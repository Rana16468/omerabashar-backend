import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import paypalpayments from "./paypalpayment.model";
import subscriptions from "../subscription/subscription.model"; // ensure model is imported
import currentsubscriptions from "../current_subscription/current_subscription.model";
import AppError from "../../errors/AppError";
import users from "../users/users.model";

/**
 * Fetch all PayPal payments with populated user and subscription details.
 * Returns cleaned API response with subscription info at top level.
 */
const findAllPaymentsIntoDB = async (query: Record<string, unknown>) => {
  try {
    // Base query with nested population
    const baseQuery = paypalpayments.find().populate([
      {
        path: "userId",
        select: "name photo email phoneNumber",
      },
      {
        path: "currentSubscriptionId",
        select: "isAvailable subscriptionId",
        populate: {
          path: "subscriptionId",
          select: "title monthlyPrice annualPrice",
          model: subscriptions, // ensure correct model reference
        },
      },
    ]);

    // Build query with QueryBuilder (filter, sort, paginate, fields)
    const qb = new QueryBuilder(baseQuery, query)
      .search(["userId.name", "userId.email"]) // search on user fields
      .filter()
      .sort()
      .paginate()
      .fields();

    // Execute query
    const payments = await qb.modelQuery.lean(); // lean for performance
    const meta = await qb.countTotal();

    //
    return { meta, payments };
  } catch (error: any) {
    console.error("findAllPaymentsIntoDB error:", error);
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "Failed to fetch PayPal payments: server unavailable",
      error
    );
  }
};

const getPaymentGrowthIntoDb = async (query: { year?: string }) => {
  try {
    const year = query.year ? parseInt(query.year) : new Date().getFullYear();

    const stats = await paypalpayments.aggregate([
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

const totalListIntoDb = async () => {
  try {
    const totalUser = await users.countDocuments();
    const totalCurrentSubscriber = await currentsubscriptions.countDocuments();

    // Fetch all payments
    const result = await paypalpayments.find();

    // Calculate total price
    const totalPrice = await paypalpayments.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    return {
      totalUser,
      totalCurrentSubscriber,
      totalPrice: totalPrice[0]?.total || 0
      
    };
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to fetch user creation stats",
      error
    );
  }
};


const PaypalPaymentServices = {
  findAllPaymentsIntoDB,
   getPaymentGrowthIntoDb,
   totalListIntoDb
};

export default PaypalPaymentServices;
