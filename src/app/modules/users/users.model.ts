import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { socialAuth, USER_ACCESSIBILITY, USER_ROLE } from "./user.constant";
import config from "../../config";
import { TUser, UserModel } from "./users.interface";

const TUserSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: [true, "user name is Required"] },
    password: { type: String, required: false },
    email: {
      type: String,
      required: [true, "Email is Required"],
      trim: true,
      unique: true,
    },
    phoneNumber: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
    verificationCode: { type: Number, required: false },
    isVerify: {
      type: Boolean,
      required: false,
      default: false,
    },
    role: {
      type: String,
      index: true,
      enum: {
        values: [USER_ROLE.admin, USER_ROLE.user, USER_ROLE.superAdmin],
        message: "{VALUE} is Not Required",
      },
      required: true,
    },
    provider: {
      type: String,
      enum: {
        values: [socialAuth.googleAuth],
      },
      required: true,
      default: socialAuth.googleAuth,
    },
    status: {
      type: String,
      index: true,
      enum: {
        values: [USER_ACCESSIBILITY.isProgress, USER_ACCESSIBILITY.blocked],
        message: "{VALUE} is not required",
      },
      required: true,
      default: USER_ACCESSIBILITY.isProgress as any,
    },
    photo: {
      type: String,
      required: false,
      default: null,
    },
    stripeAccountId: { type: String, required: false },
    isStripeConnected: {
      type: Boolean,
      required: false,
      default: false,
    },
    country: { type: String, required: false },
    fcm: { type: String, required: false, default: null },
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },

    // 2FA Fields
    twoFactorEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      required: false,
      default: null,
    },
    twoFactorBackupCodes: {
      type: [String],
      required: false,
      default: [],
    },
    twoFactorMethod: {
      type: String,
      enum: ["authenticator", "sms", "email"],
      required: false,
      default: "authenticator",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Remove password and 2FA secret on response
TUserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret.password;
    delete ret.twoFactorSecret;
    delete ret.twoFactorBackupCodes;
    return ret;
  },
});

// Hash password before save
TUserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// Clear password when returning doc
TUserSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Do not return deleted users
TUserSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TUserSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TUserSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

// STATIC METHODS
TUserSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await users.findById(id);
};

TUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

TUserSchema.statics.isJWTIssuesBeforePasswordChange = async function (
  passwordChangeTimestamp: Date,
  jwtIssuesTime: number,
) {
  const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuesTime;
};

const users = model<TUser, UserModel>("users", TUserSchema);
export default users;
