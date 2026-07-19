import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required.",
      })
      .trim()
      .min(4, "Name must contain at least 4 characters.")
      .max(20, "Name cannot exceed 20 characters."),

    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Enter a valid email address.")
      .max(50, "Email cannot exceed 50 characters.")
      .transform((value) => value.toLowerCase()),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, "Password must contain at least 8 characters.")
      .max(20, "Password cannot exceed 20 characters."),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Enter a valid email address.")
      .transform((value) => value.toLowerCase()),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(1, "Password is required."),
  }),
});
