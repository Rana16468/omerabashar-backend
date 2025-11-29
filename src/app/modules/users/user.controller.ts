import { RequestHandler } from "express";

import UserServices from "./user.services";

import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import userTwoFactorService from "./user.TwoFactorService";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Recorded and Send Email",
    data: result,
  });
});
const userVarification: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.userVarificationIntoDb(
    req.body.verificationCode,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Varified Your Account",
    data: result,
  });
});

const chnagePassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.chnagePasswordIntoDb(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Change Password",
    data: result,
  });
});

const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.forgotPasswordIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Send Email",
    data: result,
  });
});

const verificationForgotUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.verificationForgotUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Verify User",
    data: result,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.resetPasswordIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Reset Password",
    data: result,
  });
});

const googleAuth: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.googleAuthIntoDb(req.body);

  const { refreshToken, accessToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config?.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Login",
    data: {
      accessToken,
    },
  });
});

// 2 factor auth started

// Generate 2FA Secret and QR Code
const generateTwoFactorSecret: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;

  const result = await userTwoFactorService.generateTwoFactorSecret(
    userId,
    email,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "2FA secret generated successfully",
    data: result,
  });
});

// Enable 2FA
const enableTwoFactor: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await userTwoFactorService.enableTwoFactor(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "2FA enabled successfully. Save your backup codes securely!",
    data: result,
  });
});

const verifyTwoFactor: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "User ID and useBackupCode are required",
      data: null,
    });
  }

  let isValid: boolean;

  if (userId) {
    isValid = await userTwoFactorService.verifyBackupCode(userId);
  } else {
    isValid = await userTwoFactorService.verifyTwoFactorToken(userId);
  }

  if (!isValid) {
    //  await userTwoFactorService.enableTwoFactor(userId);
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Invalid verification code",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "2FA verification successful",
    data: { verified: true },
  });
});

// Disable 2FA
const disableTwoFactor: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await userTwoFactorService.disableTwoFactor(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "2FA disabled successfully",
    data: result,
  });
});

// Regenerate Backup Codes
const regenerateBackupCodes: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await userTwoFactorService.regenerateBackupCodes(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Backup codes regenerated successfully",
    data: result,
  });
});


const resendVerificationOtp:RequestHandler=catchAsync(async(req , res)=>{

     const result=await  UserServices.resendVerificationOtpIntoDb(req.params.email);
      sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully  Resend Verification OTP",
      data: result,
  });
});


const getUserGrowth:RequestHandler=catchAsync(async(req , res)=>{
   const result=await UserServices.getUserGrowthIntoDb(req.query);
         sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully  Find The User Growth",
      data: result,
  });
})

// 2 factor auth

const UserController = {
  createUser,
  userVarification,
  chnagePassword,
  forgotPassword,
  verificationForgotUser,
  resetPassword,
  googleAuth,
  getUserGrowth,
  // 2 factor auth
  generateTwoFactorSecret,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  regenerateBackupCodes,
  resendVerificationOtp
};

export default UserController;
