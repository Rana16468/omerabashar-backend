import { Model, Types } from "mongoose";

export interface TCurrentSubscription {
    userId:Types.ObjectId;
    subscriptionId: Types.ObjectId;
    isAvailable: Boolean;
    isDelete:Boolean;


};

export interface CurrentSubscriptionModel extends Model<TCurrentSubscription> {
  isCurrentSubscriptionCustomId(id: string): Promise<TCurrentSubscription>;
}
