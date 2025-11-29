import { Model, Types } from "mongoose";

export interface TSubscription {
  title: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  isDelete: boolean;
  //   type: Schema.Types.ObjectId,
}

export interface SubscriptionModel extends Model<TSubscription> {
  // eslint-disable-next-line no-unused-vars
  isSubscriptionCustomId(id: string): Promise<TSubscription>;
}
