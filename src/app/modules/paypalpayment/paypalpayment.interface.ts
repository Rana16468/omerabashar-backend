import { Model, Types } from "mongoose";

export interface TPaypalPayment {
     userId:Types.ObjectId;
      currentSubscriptionId:Types.ObjectId;
       price:Number;
        payment_status?: "unpaid" | "paid";
       isDelete:Boolean;
   

}

export interface PaypalPaymentModel extends Model<TPaypalPayment> {
  isPaypalPaymentCustomId(id: string): Promise<TPaypalPayment>;
}
