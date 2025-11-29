import subscriptions from "./subscription.model";
import AppError from "../../errors/AppError";
import status from "http-status";
import config from "../../config";
import { TSubscription } from "./subscription.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createSubscriptionIntoDb = async (payload: TSubscription) => {
  try {
    if (payload.monthlyPrice === undefined || payload.monthlyPrice === null) {
      throw new AppError(status.BAD_REQUEST, `Monthly price is required`);
    }
    payload.annualPrice = payload.monthlyPrice * Number(config.annual_price);
    const subscription = new subscriptions(payload);
    const result = await subscription.save();

    if (!result) {
      throw new AppError(
        status.NOT_EXTENDED,
        "issues by the not extended  data base section issues",
      );
    }
    return {
      status: true,
      message: "successfully recorded",
    };
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Error creating subscription",
    );
  }
};

export const deleteSubscriptionIntoDb = async (id: string) => {
  try {
    const isExist = await subscriptions.exists({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "Subscription not found");
    }

    const result = await subscriptions.findByIdAndUpdate(id, { new: true });

    if (!result) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to soft delete subscription",
      );
    }

    return {
      status: true,
      message: "Subscription successfully deleted",
    };
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Error occurred while deleting subscription",
    );
  }
};

const findByAllSubscriptiontoDb = async (query: Record<string, unknown>) => {
  try {
    const allSubscriptionListQuery = new QueryBuilder(
      subscriptions.find({}),
      query,
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const all_subscription = await allSubscriptionListQuery.modelQuery;
    const meta = await allSubscriptionListQuery.countTotal();

    return { meta, all_subscription };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "find By All User Admin IntoDb server unavailable",
      error,
    );
  }
};

const SubscriptionServices = {
  createSubscriptionIntoDb,
  deleteSubscriptionIntoDb,
  findByAllSubscriptiontoDb,
};

export default SubscriptionServices;
