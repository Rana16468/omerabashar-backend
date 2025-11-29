
import { Request, Response } from 'express';
import catchAsync from '../../utils/asyncCatch';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { paypalServiceInstancePromise } from '../../PayPalWebhook/PaypalService';
 

const createPurchaseSubscription = catchAsync(async (req: Request, res: Response) => {
    const subscriptionData = req.body;
    const userId =req.user.id;
    console.log(userId);
    const subscriptionId = subscriptionData.subscriptionId;
    console.log(subscriptionId)
 
    // initialize PayPal service
    const paypalService = await paypalServiceInstancePromise;
 
    // create PayPal order
    // const returnUrl = `${process.env.SERVER_URL}/v1/purchase-subscription/return?user=${user}&subscription=${subscriptionId}`;
    const returnUrl = `https://machinery-manufacturer-structure-famous.trycloudflare.com/api/v1/paypal/subscription-capture?user=${req.body.userId}&subscription=${subscriptionId}`;
 
    const cancelUrl = `${`https://machinery-manufacturer-structure-famous.trycloudflare.com/api/v1/paypal/purchase-subscription/cancel`}`;
    const paypalOrder = await paypalService.createPaypalOrder(
        "100",
        "USD",
        cancelUrl,
        returnUrl,
        userId,
    );
    const approveUrl = paypalOrder.links.find((link: any) => link.rel === 'approve')?.href;
 
    // send approval URL to frontend
    sendResponse(res, {
        statusCode: status.CREATED,
        success:true,
        message: 'PayPal order created. Approve payment to complete subscription purchase.',
        data: {
            paypalOrderId: paypalOrder.id,
            approveUrl,
        },
    });
});
 
const capturePurchaseSubscriptionPayment =  catchAsync(async (req: Request, res: Response) => {
    // const { orderId, user, subscription: subscriptionId } = req.query;
 
    const orderId = req.query.token as string;

    console.log("orderId", orderId)
    const user = req.query.user as string;
    const subscriptionId = req.query.subscription as string;
 
    if (!orderId) throw new AppError(status.NOT_FOUND,'Order ID missing!');
 
    const paypalService = await paypalServiceInstancePromise;
 
    const captureData = await paypalService.capturePaypalOrder(orderId as string);
 
    const captureInfo = captureData.purchase_units[0].payments.captures[0];
 
    if (captureInfo.status !== 'COMPLETED') {
        throw new  AppError(status.NOT_EXTENDED,'Payment not completed. Try again.');
    }

   
 
   
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Subscription successfully purchased',
        data: captureInfo
    });
});

 const capturePurchaseSubscriptionCancel=catchAsync(async(req , res)=>{

          const orderId = req.query.token as string;
           sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Subscription successfully purchased',
        data: orderId
    });
    });



const paypalController={
createPurchaseSubscription,
 capturePurchaseSubscriptionPayment,
 capturePurchaseSubscriptionCancel

}

export default paypalController;