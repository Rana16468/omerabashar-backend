import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import SubscriptionServices from "./subscription.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createSubscription: RequestHandler = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.createSubscriptionIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully Recorded",
    data: result,
  });
});

const deleteSubscription: RequestHandler = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.deleteSubscriptionIntoDb(
    req.params.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully delete",
    data: result,
  });
});

const findByAllSubscription: RequestHandler = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.findByAllSubscriptiontoDb(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully all subscription",
    data: result,
  });
});

const SubscriptionController = {
  createSubscription,
  deleteSubscription,
  findByAllSubscription,
};

export default SubscriptionController;
