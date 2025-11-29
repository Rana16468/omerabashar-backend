import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import PaypalPaymentController from './paypalpayment.controller';

const route=express.Router();

route.get("/find_by_all_payment_list", auth(USER_ROLE.admin, USER_ROLE.superAdmin),PaypalPaymentController.findAllPayments );
route.get("/find_by_payment_growth", auth(USER_ROLE.admin, USER_ROLE.superAdmin),PaypalPaymentController.getPaymentGrowth);
route.get("/total_list", auth(USER_ROLE.admin,USER_ROLE.superAdmin), PaypalPaymentController.totalList)
const PaypalPaymentRoute=route;
export default PaypalPaymentRoute;