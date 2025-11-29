import status from "http-status";
import AppError from "../../errors/AppError";
import paypalpayments from "../paypalpayment/paypalpayment.model";
import currentsubscriptions from "./current_subscription.model";
import subscriptions from "../subscription/subscription.model";
import mongoose from "mongoose";
import { TCurrentSubscription } from "./current_subscription.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const currentSubscriptionUserIntoDb = async (
  userId: string,
  payload: Partial<TCurrentSubscription>
) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Validate subscriptionId
      if (!payload.subscriptionId) {
        throw new AppError(
          status.BAD_REQUEST,
          "Subscription ID is required"
        );
      }

      if (!mongoose.Types.ObjectId.isValid(payload.subscriptionId)) {
        throw new AppError(
          status.BAD_REQUEST,
          "Invalid subscription ID format"
        );
      }

      // Find subscription and get price
      const subscription = await subscriptions
        .findById(payload.subscriptionId)
        .select("annualPrice")
        .session(session);

      if (!subscription) {
        throw new AppError(
          status.NOT_FOUND,
          "Subscription plan not found"
        );
      }

      if (!subscription.annualPrice || subscription.annualPrice <= 0) {
        throw new AppError(
          status.BAD_REQUEST,
          "Invalid subscription price"
        );
      }

      // Create or update current subscription
      const currentSub = await currentsubscriptions.findOneAndUpdate(
        { subscriptionId: payload.subscriptionId, userId },
        {
          $set: {
            ...payload,
            userId,
            isAvailable: true,
          },
        },
        {
          new: true,
          upsert: true,
          session,
        }
      );

      if (!currentSub || !currentSub._id) {
        throw new AppError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to create or update subscription"
        );
      }

      // Create payment record with correct field name
      const payment = await paypalpayments.create(
        [
          {
            userId,
            currentSubscriptionId: currentSub._id, // ✅ Fixed: was 'currentSubscription'
            price: subscription.annualPrice,
            isDelete: false,
            payment_status: "paid",
          },
        ],
        { session }
      );

      if (!payment || payment.length === 0) {
        throw new AppError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to record payment"
        );
      }
    });

    return {
      success: true,
      message: "Subscription purchased successfully",
    };
  } catch (err: any) {
    console.error("Transaction failed:", err);

    // Throw AppError as-is, wrap others
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to process subscription purchase",
      err
    );
  } finally {
    await session.endSession();
  }
};


const isAvailableCurrentSubscriptionIntoDb = async (userId: string) => {
  try {
    return await currentsubscriptions.findOne({ userId }).select("isAvailable");
  } catch (err: any) {
    console.error("Transaction failed:", err);

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to process subscription purchase",
      err
    );
  }
};

const findByAvailableSubscriptionUserIntoDb = async (
  query: Record<string, unknown>
) => {
  try {
    const allCurrentSubscriptionQuery = new QueryBuilder(
      currentsubscriptions.find().populate([
        {
          path: "userId",
          select: "name photo email phoneNumber",
        },
        {
          path: "subscriptionId",
          select: "title annualPrice",
        },
      ]),
      query
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const all_current_subscription = await allCurrentSubscriptionQuery.modelQuery;
    const meta = await allCurrentSubscriptionQuery.countTotal();

    return { meta,all_current_subscription };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "Failed to fetch subscription users — server unavailable",
      error
    );
  }
};


const getCurrentSubscriptionGrowthIntoDb = async (query: { year?: string }) => {
  try {
    const year = query.year ? parseInt(query.year) : new Date().getFullYear();

    const stats = await currentsubscriptions.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { month: "$month", count: "$count" } },
        },
      },

      {
        $project: {
          months: {
            $map: {
              input: { $range: [1, 13] },
              as: "m",
              in: {
                year: year,
                month: "$$m",
                count: {
                  $let: {
                    vars: {
                      matched: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$data",
                              as: "d",
                              cond: { $eq: ["$$d.month", "$$m"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$matched.count", 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: "$months" },
      { $replaceRoot: { newRoot: "$months" } },
    ]);

    return { monthlyStats: stats };
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to fetch user creation stats",
      error,
    );
  }
};




const currentSubscriptionServices = {
  currentSubscriptionUserIntoDb,
  isAvailableCurrentSubscriptionIntoDb,
  findByAvailableSubscriptionUserIntoDb,
 getCurrentSubscriptionGrowthIntoDb
};

export default currentSubscriptionServices;