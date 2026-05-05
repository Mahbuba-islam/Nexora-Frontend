import { z } from "zod";

const NAME_REGEX = /^[\p{L}\p{M}'\-\s.]+$/u;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const registerZodSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(60, "Name is too long.")
    .regex(NAME_REGEX, "Name can only contain letters, spaces and hyphens."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .max(200, "Email is too long.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .regex(
      PASSWORD_REGEX,
      "Use at least one letter and one number for a stronger password.",
    ),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;


export const loginZodSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});


export type ILoginPayload = z.infer<typeof loginZodSchema>;



export const forgotPasswordZodSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
});

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;
