import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import FavoriteServices from "./favorite_doc.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";



const recordedFavoriteDoc:RequestHandler=catchAsync(async(req , res)=>{

       const result=await  FavoriteServices.recordedFavoriteDocIntoDb(req.body, req.user.id);

        sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "successfully recorded",
    data: result,
  });
});


const findByAllMyFavoriteDoc:RequestHandler=catchAsync(async(req , res)=>{

     const result=await FavoriteServices.findByAllMyFavoriteDocIntoDb(req.query, req.user.id);
       sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "successfully Find My Favorite List",
    data: result,
  });

});


const  deleteFavoriteDoc:RequestHandler=catchAsync(async(req , res)=>{

     const result=await FavoriteServices.deleteFavoriteDocIntoDb(req.params.id, req.user.id);
            sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "successfully delete",
    data: result,
  });
})


const FavoriteController={
    recordedFavoriteDoc,
    findByAllMyFavoriteDoc,
     deleteFavoriteDoc
};

export default  FavoriteController;

