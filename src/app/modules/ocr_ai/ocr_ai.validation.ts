import { z } from "zod";
const ocrschema = z.object({
  body: z.object({
    ocrType: z.string({ error: "ocr type is required" }),
  }),
});

const OCRValidation = {
  ocrschema,
};

export default OCRValidation;
