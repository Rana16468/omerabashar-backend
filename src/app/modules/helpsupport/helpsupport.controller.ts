import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import HelpAndSupportServices from "./helpsupport.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const recordedHelpAndSupport: RequestHandler = catchAsync(async (req, res) => {
  const result = await HelpAndSupportServices.recordedHelpAndSupportIntoDb(
    req.user.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Successfully  Recorded",
    data: result,
  });
});

const findByAllHelpAndSupportReport: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await HelpAndSupportServices.findByAllHelpAndSupportReportIntoDb(
        req.query,
      );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Successfully Find By All Help And Support Report",
      data: result,
    });
  },
);

const deleteHelpAndSupport: RequestHandler = catchAsync(async (req, res) => {
  const result = await HelpAndSupportServices.deleteHelpAndSupportIntoDb(
    req.params.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Successfully Delete Help And Support Report",
    data: result,
  });
});

const HelpAndSupportController = {
  recordedHelpAndSupport,
  findByAllHelpAndSupportReport,
  deleteHelpAndSupport,
};

export default HelpAndSupportController;
