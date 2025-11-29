import express from "express";

import UserController from "./user.controller";

import { USER_ROLE } from "./user.constant";
import validationRequest from "../../middlewares/validationRequest";
import UserValidationSchema from "./users.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create_user",
  validationRequest(UserValidationSchema.createUserZodSchema),
  UserController.createUser,
);

router.patch(
  "/user_verification",
  validationRequest(UserValidationSchema.UserVerification),
  UserController.userVarification,
);

router.patch(
  "/change_password",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validationRequest(UserValidationSchema.ChnagePasswordSchema),
  UserController.chnagePassword,
);

router.post(
  "/forgot_password",
  validationRequest(UserValidationSchema.ForgotPasswordSchema),
  UserController.forgotPassword,
);

router.post(
  "/verification_forgot_user",
  validationRequest(UserValidationSchema.verificationCodeSchema),
  UserController.verificationForgotUser,
);

router.post(
  "/reset_password",
  validationRequest(UserValidationSchema.resetPasswordSchema),
  UserController.resetPassword,
);

router.post(
  "/google_auth",

  validationRequest(UserValidationSchema.createUserZodSchema),
  UserController.googleAuth,
);
router.get("/get_user_growth", auth(USER_ROLE.admin, USER_ROLE.superAdmin), UserController.getUserGrowth );

// 2 factor auth

// Protected routes (require authentication)
router.post(
  "/generate-secret",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.generateTwoFactorSecret,
);

router.post(
  "/enable",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.enableTwoFactor,
);

router.post(
  "/disable",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.disableTwoFactor,
);

router.post(
  "/regenerate-backup-codes",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.regenerateBackupCodes,
);

// Public route for login verification
router.post(
  "/verify",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.verifyTwoFactor,
);
router.get("/resend_verification_otp/:email",UserController.resendVerificationOtp);

const UserRouters = router;
export default UserRouters;
