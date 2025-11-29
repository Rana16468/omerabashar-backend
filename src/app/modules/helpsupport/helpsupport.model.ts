import { Schema, model, Types } from "mongoose";
import { HelpSupportModel, THelpSupport } from "./helpsupport.interface";

const THelpSupportSchema = new Schema<THelpSupport, HelpSupportModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// middlewere
THelpSupportSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

THelpSupportSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

THelpSupportSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
THelpSupportSchema.statics.isHelpSupportCustomId = async function (id: string) {
  const result = await this.findById(id);
  return result;
};

const helpsupports = model<THelpSupport, HelpSupportModel>(
  "helpsupports",
  THelpSupportSchema,
);

export default helpsupports;
