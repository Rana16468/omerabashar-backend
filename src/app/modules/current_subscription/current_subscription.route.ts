import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import validationRequest from '../../middlewares/validationRequest';
import currentSubscriptionValidation from './current_subscription.validation';

import currentSubscriptionController from './current_subscription.controller';


const route=express.Router();

route.post("/buy_current_subscription", auth(USER_ROLE.user), validationRequest(currentSubscriptionValidation.currentSubscriptionSchema),currentSubscriptionController.currentSubscriptionUser);
route.get("/is_subscription_exist", auth(USER_ROLE.user), currentSubscriptionController.isAvailableCurrentSubscription);
route.get("/current_subscribe_user", auth(USER_ROLE.admin, USER_ROLE.superAdmin),currentSubscriptionController. findByAvailableSubscriptionUser );
route.get("/get_current_subscription_growth", auth(USER_ROLE.superAdmin, USER_ROLE.admin), currentSubscriptionController.getCurrentSubscriptionGrowth);

const CurrentSubscriptionRoute=route;

export default CurrentSubscriptionRoute;