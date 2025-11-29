import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import currentSubscriptionServices from "./current_subscription.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";




const  currentSubscriptionUser:RequestHandler=catchAsync(async(req , res)=>{

      const result=await currentSubscriptionServices.currentSubscriptionUserIntoDb(req.user.id, req.body);
      sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Successfully Recorded",
    data: result,
  });
});


const isAvailableCurrentSubscription:RequestHandler=catchAsync(async(req , res)=>{

      const result=await currentSubscriptionServices.isAvailableCurrentSubscriptionIntoDb(req.user.id);
            sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Successfully Find My Available Subscription",
    data: result,
  });

});



const findByAvailableSubscriptionUser:RequestHandler=catchAsync(async(req , res)=>{

    const result=await currentSubscriptionServices.findByAvailableSubscriptionUserIntoDb(req.query);
       sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully Find My Available Subscription",
    data: result,
  });
});

const getCurrentSubscriptionGrowth:RequestHandler=catchAsync(async(req , res)=>{

     const result=await currentSubscriptionServices.getCurrentSubscriptionGrowthIntoDb(req.query);
            sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully Find My  Current User Growth ",
    data: result,
  });
});



const  currentSubscriptionController={
    currentSubscriptionUser,
    isAvailableCurrentSubscription,
    findByAvailableSubscriptionUser,
 getCurrentSubscriptionGrowth
};

export default currentSubscriptionController;
