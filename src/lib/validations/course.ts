import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDesc: z.string().max(200).optional(),
  price: z.number().min(0, "Price must be non-negative"),
  isFree: z.boolean().default(false),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  tags: z.array(z.string()).default([]),
  language: z.string().default("English"),
  categoryId: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  courseId: z.string(),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
