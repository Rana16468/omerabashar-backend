import { model, Schema, Types } from "mongoose";
import { PaypalPaymentModel, TPaypalPayment } from "./paypalpayment.interface";


const TPaypalPaymentSchema = new Schema<TPaypalPayment, PaypalPaymentModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", index:true, required: true  },
currentSubscriptionId: { type: Schema.Types.ObjectId, ref: "currentsubscriptions", index:true, required: true },
    price: { type: Number, required: true },
    payment_status: {
      type: String,
      index:true,
      enum: {
        values: ["unpaid", "paid"],
        message: "{VALUE} is not a valid provider",
      },
      required: [false, "payment status is not  required"],
      default: "paid",
    },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true, 
  }
);


TPaypalPaymentSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});
TPaypalPaymentSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});
TPaypalPaymentSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $match: { isDelete: { $ne: true } } });
  next();
});



TPaypalPaymentSchema.statics.isPaypalPaymentCustomId = async function (
  id: string
): Promise<TPaypalPayment | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return this.findById(id).exec();
};

const paypalpayments= model<TPaypalPayment, PaypalPaymentModel>(
  "paypalpayments",
  TPaypalPaymentSchema
);

export default paypalpayments