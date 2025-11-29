import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import PaypalPaymentServices from "./paypalpayment.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";



const findAllPayments:RequestHandler=catchAsync(async(req , res)=>{

      const result=await PaypalPaymentServices.findAllPaymentsIntoDB(req.query);
 
      sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully  Find By All Payment List",
    data: result,
  });

});


const getPaymentGrowth:RequestHandler=catchAsync(async(req , res)=>{

    const result=await PaypalPaymentServices.getPaymentGrowthIntoDb(req.query);
          sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully Find My Payment Growth",
    data: result,
  });
});

const totalList:RequestHandler=catchAsync(async(req , res)=>{

    const result=await  PaypalPaymentServices.totalListIntoDb();
             sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully Find My Payment Growth",
    data: result,
  });
})


const PaypalPaymentController={
    findAllPayments,
    getPaymentGrowth,
     totalList
};

export default PaypalPaymentController

