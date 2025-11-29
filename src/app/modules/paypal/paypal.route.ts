import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import paypalController from './paypal.controller';
import { handlePayPalWebhook } from '../../PayPalWebhook/handlePayPalWebhook';

const router=express.Router();

router.post(
    '/',
    auth(USER_ROLE.user),
    paypalController.createPurchaseSubscription,
);
router.get(
    '/subscription-capture',
    paypalController.capturePurchaseSubscriptionPayment,
);
router.get("/purchase-subscription/cancel", paypalController.capturePurchaseSubscriptionCancel)
router.post('/webhook/paypal', handlePayPalWebhook)
const  PaypalRouter=router;

export default PaypalRouter;

