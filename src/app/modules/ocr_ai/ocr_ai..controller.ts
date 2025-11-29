import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/asyncCatch";
import OCRService from "./ocr_ai..service";

const getTests: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OCRService.getTests();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tests fetched successfully!",
      data: result,
    });
  },
);

const ocr: RequestHandler = catchAsync(async (req, res) => {
  const result = await OCRService.ocrIntoDb(req as any, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully Recorded OCR",
    data: result,
  });
});


const findByMyOCRList:RequestHandler=catchAsync(async(req , res)=>{

        const result=await OCRService.findByMyOCRListIntoDb(req.user.id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully Find My All OCR",
    data: result,
  });

});

const textToImageBuffer:RequestHandler=catchAsync(async(req , res)=>{


     const result=await OCRService.textToImageBuffer({
            "document_type": "PASSPORT CARD",
            "Nationality": "USA",
            "Surname": "TRAVELER",
            "Given Names": "HAPPY",
            "Passport Card no.": "C03004786",
            "Date of Birth": "1 JAN 1981",
            "Sex": "F",
            "Place of Birth": "NEW YORK. U.S.A.",
            "Issued On": "30 NOV 2009",
            "Expires On": "29 NOV 2019",
            "MRZ": "M-6131821-07",
            "Code": "1-02781-0",
            "Name": "EXEMPLAR"
        });

          sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully Find My All OCR",
    data: result,
  });
});


const findBySpecificOCR:RequestHandler=catchAsync(async(req , res)=>{

    const result=await OCRService.findBySpecificOCRInDb(req.params.id);
      sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully Find By Specific OCR",
    data: result,
  });
});



const deleteOCR:RequestHandler=catchAsync(async(req , res)=>{

     const result=await OCRService.deleteOCRIntoDb(req.params.id);
           sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully delete",
    data: result,
  });
});



const OCRController = {
  getTests,
  ocr,
  findByMyOCRList,
  textToImageBuffer,
  findBySpecificOCR,
  deleteOCR
};

export default OCRController;
