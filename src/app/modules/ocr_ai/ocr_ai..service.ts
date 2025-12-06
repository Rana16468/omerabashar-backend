import status from "http-status";
import AppError from "../../errors/AppError";
import { createCanvas } from "canvas";
import { commonAIFunction } from "./ocr_ai.utils";

import {  universalPrompt } from "./ocr_ai.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import {PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, uploadToS3 } from "../../utils/uploadToS3";

import config from "../../config";
import { ocrtechs } from "./ocr_ai.model";
import { deleteFromS3 } from "../../utils/deleteFromS3";

const getTests = async () => {
  //   if you are using a database, you would typically query the database here
  // For example, if using Mongoose: return Test.find();

  return "kshgdfjkgasd";
};

const OCR_API_KEY = "K84249841388957";

interface PassportCardData {
  nationality: string | null;
  passportCardNumber: string | null;
  surname: string | null;
  givenNames: string | null;
  sex: string | null;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  issuedOn: string | null;
  expiresOn: string | null;
}

interface RequestWithFile {
  file?: { path: string };
}

// Extract passport card fields from OCR text
const extractPassportData = (text: string): PassportCardData => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const fullText = text.replace(/\r?\n/g, " ");

  const data: PassportCardData = {
    nationality: null,
    passportCardNumber: null,
    surname: null,
    givenNames: null,
    sex: null,
    dateOfBirth: null,
    placeOfBirth: null,
    issuedOn: null,
    expiresOn: null,
  };

  // Nationality - usually "USA"
  const natMatch = fullText.match(/Nationality\s*[:\-]?\s*(\w+)/i);
  data.nationality = natMatch ? natMatch[1].toUpperCase() : null;

  // Passport Card Number - format like C03004786
  const cardNumMatch =
    fullText.match(
      /(?:Passport\s*Card\s*no\.?|Card\s*no\.?)\s*[:\-]?\s*([A-Z]?\d{6,10})/i,
    ) || fullText.match(/\b([C]\d{8})\b/i);
  data.passportCardNumber = cardNumMatch ? cardNumMatch[1].toUpperCase() : null;

  // Surname
  const surnameMatch = fullText.match(/Surname\s*[:\-]?\s*([A-Z]+)/i);
  data.surname = surnameMatch ? surnameMatch[1].toUpperCase() : null;

  // Given Names
  const givenMatch = fullText.match(/Given\s*Names?\s*[:\-]?\s*([A-Z]+)/i);
  data.givenNames = givenMatch ? givenMatch[1].toUpperCase() : null;

  // Sex
  const sexMatch = fullText.match(/Sex\s*[:\-]?\s*([MF])/i);
  data.sex = sexMatch ? sexMatch[1].toUpperCase() : null;

  // Date of Birth - format like "1 JAN 1981"
  const dobMatch =
    fullText.match(
      /Date\s*of\s*Birth\s*[:\-]?\s*(\d{1,2}\s*[A-Z]{3}\s*\d{4})/i,
    ) || fullText.match(/\bDOB\s*[:\-]?\s*(\d{1,2}\s*[A-Z]{3}\s*\d{4})/i);
  data.dateOfBirth = dobMatch ? dobMatch[1].toUpperCase() : null;

  // Place of Birth
  const pobMatch = fullText.match(
    /Place\s*of\s*Birth\s*[:\-]?\s*([A-Z\s,\.]+?)(?=Issued|Expires|$)/i,
  );
  if (pobMatch) {
    data.placeOfBirth = pobMatch[1].trim().replace(/\s+/g, " ").toUpperCase();
  }

  // Issued On - format like "30 NOV 2009"
  const issuedMatch = fullText.match(
    /Issued\s*(?:On)?\s*[:\-]?\s*(\d{1,2}\s*[A-Z]{3}\s*\d{4})/i,
  );
  data.issuedOn = issuedMatch ? issuedMatch[1].toUpperCase() : null;

  // Expires On - format like "29 NOV 2019"
  const expiresMatch = fullText.match(
    /Expires?\s*(?:On)?\s*[:\-]?\s*(\d{1,2}\s*[A-Z]{3}\s*\d{4})/i,
  );
  data.expiresOn = expiresMatch ? expiresMatch[1].toUpperCase() : null;

  return data;
};

// const ocrIntoDb = async (req: RequestWithFile) => {

//   try {
//     const file = req.file;
//     if (!file) {
//       throw new Error("File not provided");
//     }

//     const filePath = file.path.replace(/\\/g, "/");

//     const formData = new FormData();
//     formData.append("apikey", OCR_API_KEY);
//     formData.append("language", "eng");
//     formData.append("isOverlayRequired", "true");
//     formData.append("file", fs.createReadStream(filePath));

//     const response = await axios.post(
//       "https://api.ocr.space/parse/image",
//       formData,
//       {
//         headers: { ...formData.getHeaders() },
//         maxBodyLength: Infinity,
//       }
//     );

//     const ocrResult = response.data;
//     const parsedResults = ocrResult.ParsedResults;
//     const isErrored = ocrResult.IsErroredOnProcessing;
//     const errorMessage = ocrResult.ErrorMessage;
//     const errorDetails = ocrResult.ErrorDetails;

//     if (isErrored) {
//       throw new Error(`OCR Error: ${errorMessage} | Details: ${errorDetails}`);
//     }

//     let rawText = "";

//     if (parsedResults && parsedResults.length > 0) {
//       parsedResults.forEach((result: any) => {
//         if (result.FileParseExitCode === 1) {
//           rawText += result.ParsedText;
//         }
//       });
//     }

//     // Extract structured passport data
//     const passportData = extractPassportData(rawText);

//     return {
//       success: true,
//       rawText,
//       passportData,
//       filePath,
//     };
//   } catch (error: any) {
//     console.error("OCR Error:", error);
//     throw new Error(error.message);
//   }
// };

const ocrIntoDb = async (req: Request & RequestWithFile, userId: string) => {
  try {
   
    const file = req.file as any;
    if (!file) throw new AppError(status.BAD_REQUEST, "File not provided");
    let filePath
    const { ocrType } = req.body as any;
    const extractedData = await commonAIFunction(file.path.replace(/\\/g, "/"), universalPrompt);
    filePath=  await uploadToS3(file, config.file_path);

    const { url: textImageUrl } = await textToImageBuffer(extractedData);

    const created = await ocrtechs.create({
      userId,
      ocrType,
      filePath,
      textImageUrl,
      extractedData,
    });

    if (!created) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to save OCR information"
      );
    }

    return {
      success: true,
      message: "Successfully recorded",
      textImageUrl,
      dataId: created._id,
    };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      `${error.message} - OCR processing failed`
    );
  }
};



const findByMyOCRListIntoDb = async (
  userId: string,
  query: Record<string, unknown>
) => {
  try {
    const qb = new QueryBuilder(
      ocrtechs.find({ userId }).select(""),
      query
    )
       .search([])
            .filter()
            .sort()
            .paginate()
            .fields();
      
          const all_ocr = await qb .modelQuery;
          const meta = await qb .countTotal();
      
          return { meta,  all_ocr };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      `${error.message} - Fetch OCR list failed`
    );
  }
};



async function textToImageBuffer(data: any) {
  const text =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  const lines = text.split("\n");

  const width = 1200;
  const padding = 40;
  const lineHeight = 30;
  const height = padding * 2 + lines.length * lineHeight;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  // Text Style
  ctx.font = "20px Sans";
  ctx.fillStyle = "#000";

  let y = padding;
  for (const line of lines) {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  }

  // Convert to PNG
  const buffer = canvas.toBuffer("image/png");
  const fileName = `ocr-${Date.now()}.png`;

await s3.send(
  new PutObjectCommand({
    Bucket: config.s3_bucket.aws_bucket_name,
    Key: fileName,
    Body: buffer,
    ContentType: "image/png",
    ContentEncoding: "base64",
    CacheControl: "public, max-age=31536000",
    ACL: "public-read",
  })
);


  const imageUrl = `https://${config.s3_bucket.aws_bucket_name}.s3.${config.s3_bucket.aws_bucket_region}.amazonaws.com/${fileName}`;

  return { success: true, url: imageUrl };
};



const findBySpecificOCRInDb=async(id:string)=>{
  try{

    return await ocrtechs.findById(id);

  }
  catch(error:any){
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      `${error.message} - find by the specific ocr section failed`
    );
  }
};


const deleteOCRIntoDb = async (id: string) => {
  try {
   
    const ocrData = await ocrtechs
      .findById(id)
      .select("filePath textImageUrl")
      .lean();

    if (!ocrData) {
      throw new AppError(
        status.NOT_FOUND,
        "OCR record does not exist in the database"
      );
    }

    await Promise.all([
      ocrData.filePath ? deleteFromS3(ocrData.filePath) : null,
      ocrData.textImageUrl ? deleteFromS3(ocrData.textImageUrl) : null,
    ]);

    const deleted = await ocrtechs.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError(
        status.NOT_EXTENDED,
        "Failed to delete OCR record from database"
      );
    }

    // 4. Final response
    return {
      status: true,
      message: "OCR deleted successfully",
    };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      `${error.message} - OCR delete operation failed`
    );
  }
};



const OCRService = {
  getTests,
  ocrIntoDb,
  findByMyOCRListIntoDb,
  textToImageBuffer,
  findBySpecificOCRInDb,
  deleteOCRIntoDb
};

export default OCRService;
