import { Schema, model, Types } from "mongoose";
import { FavoriteModel, TFavorite } from "./favorite_doc.interface";


const TFavoriteSchema = new Schema<TFavorite, FavoriteModel>(
  {
    userId: {
      type:  Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index:true
    },

    ocrtechsId: {
      type:  Schema.Types.ObjectId,
      ref: "ocrtechs",
      required: true,
      index:true
    },
    isFavorite:{
        type:Boolean,
        required:[false, 'isFavorite is not  required'],
        default :true
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TFavoriteSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});
TFavoriteSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TFavoriteSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $match: { isDelete: { $ne: true } } });
  next();
});


TFavoriteSchema.statics.isFavoriteCustomId = async function (id: string) {
  return await this.findById(id);
};


 const favorites = model<TFavorite, FavoriteModel>(
  "favorites",
  TFavoriteSchema
);
export default favorites;


