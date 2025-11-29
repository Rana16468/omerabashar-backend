import { Model, Types } from "mongoose";


export  interface TFavorite {

    userId:Types.ObjectId;
    ocrtechsId:Types.ObjectId;
    isFavorite: Boolean;
    isDelete: Boolean;

};

export interface FavoriteModel extends Model<TFavorite> {
  isFavoriteCustomId(id: string): Promise<TFavorite>;
}
