import { Schema, model,  Types } from "mongoose";
import { CurrentSubscriptionModel, TCurrentSubscription } from "./current_subscription.interface";

const TCurrentSubscriptionSchema = new Schema<TCurrentSubscription, CurrentSubscriptionModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "subscriptions", required: true },
    isAvailable: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);




TCurrentSubscriptionSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});
TCurrentSubscriptionSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});
TCurrentSubscriptionSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $match: { isDelete: { $ne: true } } });
  next();
});




TCurrentSubscriptionSchema.statics.isCurrentSubscriptionCustomId = async function (
  id: string
): Promise<TCurrentSubscription | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return this.findById(id).exec();
};


 const currentsubscriptions = model<TCurrentSubscription, CurrentSubscriptionModel>(
  "currentsubscriptions",
  TCurrentSubscriptionSchema
);

export default currentsubscriptions;
