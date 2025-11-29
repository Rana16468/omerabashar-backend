import { z } from "zod";

const createSubscriptionSchema = z.object({
  body: z.object({
    title: z
      .string({
        error: "Title is required",
      })
      .trim(),

    description: z
      .string({
        error: "Description is required",
      })
      .trim(),

    monthlyPrice: z
      .number({
        error: "Monthly price is required",
      })
      .min(0, "Monthly price cannot be negative"),
  }),
});

const SubscriptionValidation = {
  createSubscriptionSchema,
};

export default SubscriptionValidation;
