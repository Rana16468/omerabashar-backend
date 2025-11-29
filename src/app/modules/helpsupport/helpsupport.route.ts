import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";
import validationRequest from "../../middlewares/validationRequest";
import helpSupportValidation from "./helpsupport.validation";
import HelpAndSupportController from "./helpsupport.controller";

const route = express.Router();

route.post(
  "/recorded_help_support",
  auth(USER_ROLE.user),
  validationRequest(helpSupportValidation.helpSupportZodSchema),
  HelpAndSupportController.recordedHelpAndSupport,
);
route.get(
  "/find_by_all_help_report",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  HelpAndSupportController.findByAllHelpAndSupportReport,
);
route.delete(
  "/find_by_all_help_support/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  HelpAndSupportController.deleteHelpAndSupport,
);

const helpSupportRoutes = route;

export default helpSupportRoutes;
