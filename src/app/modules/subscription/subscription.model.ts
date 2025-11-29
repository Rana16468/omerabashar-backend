import { model, Schema } from "mongoose";
import { SubscriptionModel, TSubscription } from "./subscription.interface";

const TSubscriptionSchema = new Schema<TSubscription, SubscriptionModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    monthlyPrice: {
      type: Number,
      required: [true, "Monthly price is required"],
      min: [0, "Monthly price cannot be negative"],
    },

    annualPrice: {
      type: Number,
      required: [true, "Annual price is required"],
      min: [0, "Annual price cannot be negative"],
    },

    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

TSubscriptionSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TSubscriptionSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TSubscriptionSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TSubscriptionSchema.statics.isSubscriptionCustomId = async function (
  id: string,
) {
  return await this.findById(id);
};

const subscriptions = model<TSubscription, SubscriptionModel>(
  "subscriptions",
  TSubscriptionSchema,
);

export default subscriptions;
