import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email").trim(),
  projectType: z.string().trim().min(1, "Select a project type").max(100),
  budgetRange: z.string().trim().min(1, "Select a budget range").max(100),
  timeline: z.string().trim().min(1, "Select a timeline").max(100),
  message: z.string().trim().min(10, "Tell us a bit more — at least 10 characters").max(2000),
});
export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;