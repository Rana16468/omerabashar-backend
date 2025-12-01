import express from "express";

import UserRouters from "../modules/users/users.route";
import AuthRouter from "../modules/auth/auth.route";
import SubscriptionRoute from "../modules/subscription/subscription.route";
import SettingsRoutes from "../modules/settings/settings.routres";
import helpSupportRoutes from "../modules/helpsupport/helpsupport.route";
import OcrRoute from "../modules/ocr_ai/ocr_ai.route";
import FavoriteRoute from "../modules/favorite_doc/favorite_doc.route";
import PaypalRouter from "../modules/paypal/paypal.route";
import CurrentSubscriptionRoute from "../modules/current_subscription/current_subscription.route";
import PaypalPaymentRoute from "../modules/paypalpayment/paypalpayment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/test",
    route: OcrRoute,
  },
  {
    path: "/user",
    route: UserRouters,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/subscription",
    route: SubscriptionRoute,
  },
  {
    path: "/setting",
    route: SettingsRoutes,
  },
  {
    path: "/help_support",
    route: helpSupportRoutes,
  },
  {
    path:"/favorite",
    route: FavoriteRoute
  },
  {
    path:"/current_subscription",
    route:  CurrentSubscriptionRoute

  },
  {
    path:"/paypal",
    route:PaypalRouter
  },
  {
    path:"/paypal_payment",
    route: PaypalPaymentRoute
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
