import { z } from "zod";

const helpSupportZodSchema = z.object({
  body: z.object({
    title: z.string({ error: "title is required" }).min(1).max(100).trim(),
    description: z
      .string({ error: " description is required" })
      .min(1)
      .max(500)
      .trim(),
  }),
});

const helpSupportValidation = {
  helpSupportZodSchema,
};

export default helpSupportValidation;
