import { Request, Response } from 'express';
import catchAsync from '../utils/asyncCatch';
import sendResponse from '../utils/sendResponse';
 import httpStatus from 'http-status';
export const handlePayPalWebhook = catchAsync(async (req: Request, res: Response) => {
    const event = req.body;
    console.log(event, "event")
   
 
    switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
            console.log(event)
            break;
        case 'PAYMENT.CAPTURE.DENIED':
            // handle wallet top-up or appointment payment
            break;
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
            // handle subscription activated
            break;
        case 'BILLING.SUBSCRIPTION.CANCELLED':
            // handle subscription cancelled
            break;
        case 'BILLING.SUBSCRIPTION.EXPIRED':
            // handle subscription expired
            break;
        case 'BILLING.SUBSCRIPTION.SUSPENDED':
            // handle subscription suspended
            break;
        case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
            // mark the therapist payouts as complete
            break;
        case 'PAYMENT.PAYOUTS-ITEM.FAILED':
            // mark the therapist payouts as failed
            break;
        default:
            break;
    }
 
   sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully  Resend Verification OTP",
      data: '',
  });
});