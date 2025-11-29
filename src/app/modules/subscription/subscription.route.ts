// SubscriptionController

import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";
import validationRequest from "../../middlewares/validationRequest";
import SubscriptionController from "./subscription.controller";
import SubscriptionValidation from "./subscription.validation";

const route = express.Router();

route.post(
  "/create_subscription",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(SubscriptionValidation.createSubscriptionSchema),
  SubscriptionController.createSubscription,
);
route.delete(
  "/delete_subscription/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SubscriptionController.createSubscription,
);
route.get(
  "/find_by_all_subscription",
  SubscriptionController.findByAllSubscription,
);
const SubscriptionRoute = route;
export default SubscriptionRoute;
