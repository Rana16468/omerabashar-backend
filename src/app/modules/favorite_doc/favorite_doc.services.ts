import status from "http-status";
import AppError from "../../errors/AppError";
import { TFavorite } from "./favorite_doc.interface";
import favorites from "./favorite_doc.model";
import QueryBuilder from "../../builder/QueryBuilder";

/**
 * Add a favorite document for a user
 */
const recordedFavoriteDocIntoDb = async (
  payload: Partial<TFavorite>, 
  userId: string
) => {
  try {
    if (!payload?.ocrtechsId) {
      throw new AppError(status.BAD_REQUEST, "ocrtechsId is required", "");
    }

    const isExist = await favorites.exists({
      userId,
      ocrtechsId: payload.ocrtechsId,
      isDelete: false
    });

    if (isExist) {
      return {
        status: false,
        message: "Already exists in your favorite list",
      };
    }

   
    const favorite = await favorites.create({
      userId,
      ocrtechsId: payload.ocrtechsId,
      isDelete: false
    });

    if (!favorite) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to save favorite"
      );
    }

    return {
      status: true,
      message: "Successfully added to favorites",
    };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      error?.message || "Favorite adding server issue"
    );
  }
};

const findByAllMyFavoriteDocIntoDb = async (
  query: Record<string, unknown>,
  userId: string
) => {
  try {
    const mongoQuery = favorites
      .find({ userId })
      .populate([
        {
          path: "ocrtechsId",
          select: "filePath ocrType status textImageUrl createdAt",
        },
      ])
      .select("-userId -__v -updatedAt -isDelete");

    const builtQuery = new QueryBuilder(mongoQuery, query)
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const all_favorite = await builtQuery.modelQuery;
    const meta = await builtQuery.countTotal();

    return {
      meta,
      all_favorite,
    };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "Favorite list fetch failed.",
      error?.message
    );
  }
};

const deleteFavoriteDocIntoDb=async(id:string, userId:string)=>{

     try{

        const isExistFavoriteDoc=await favorites.exists({_id:id});
        if(!isExistFavoriteDoc){
            throw new AppError(status.NOT_FOUND, 'not founded favorite this information server ')
        };

        const  result=await favorites.findOneAndDelete({userId,_id:id},{new:true});
        if(!result){
            throw new AppError(status.NOT_EXTENDED, 'issues by  the favorites extended section','');
        };
        return {
            status:true , 
            message:"successfully recorded"
        }

     }
     catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "deleteFavoriteDocIntoDb fetch failed.",
      error?.message
    );
  }
}







const FavoriteServices = {
  recordedFavoriteDocIntoDb,
  findByAllMyFavoriteDocIntoDb,
  deleteFavoriteDocIntoDb
};

export default FavoriteServices;
