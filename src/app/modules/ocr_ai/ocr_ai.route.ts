import express, { NextFunction, Request, Response } from "express";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";
import upload from "../../utils/uploadFile";
import AppError from "../../errors/AppError";
import status from "http-status";
import validationRequest from "../../middlewares/validationRequest";
import OCRValidation from "./ocr_ai.validation";
import OCRController from "./ocr_ai..controller";
const router = express.Router();

router.get("/test", OCRController.getTests);

router.post(
  "/ocr",
  auth(USER_ROLE.user),

  // 1️⃣ First parse file + form-data body
  upload.single("file"),

  // 2️⃣ Then convert JSON if needed
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      next(new AppError(status.BAD_REQUEST, "Invalid JSON data", ""));
    }
  },

  // 3️⃣ Now Zod receives the correct body
  validationRequest(OCRValidation.ocrschema),

  // 4️⃣ Controller
  OCRController.ocr,
);

router.get("/find_my_ocr_list", auth(USER_ROLE.user),OCRController.findByMyOCRList);
router.get("/textToImageBuffer",auth(USER_ROLE.user), OCRController.textToImageBuffer);

router.get("/find_by_specific_ocr/:id", auth(USER_ROLE.user),OCRController.findBySpecificOCR);
router.delete("/delete_ocr/:id", auth(USER_ROLE.user), OCRController.deleteOCR);





const OcrRoute = router;
export default OcrRoute;
