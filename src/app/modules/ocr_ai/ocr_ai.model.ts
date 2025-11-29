import { Schema, model, Model, Types } from "mongoose";
import { OcrTechModel, TOcrTech,  } from "./ocr_ai..interface";


const TOcrTechSchema = new Schema<TOcrTech,OcrTechModel >(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index:true
    },

    filePath: {
      type: String,
      required: true,
    },
    ocrType:{
      type:String,
      required:true,
      index:true
    },
    status:{
      type: Boolean,
      required:[false,'status is not required'],
      default:true
    },
    textImageUrl:{
      type:String,
      required:[true ,'textImageUrl is required']
    },


    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

TOcrTechSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TOcrTechSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TOcrTechSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TOcrTechSchema.statics.isOcrPassportCustomId = async function (id: string) {
  return await this.findById(id);
};

export const ocrtechs = model<TOcrTech,OcrTechModel>(
  "ocrtechs",
  TOcrTechSchema,
);

