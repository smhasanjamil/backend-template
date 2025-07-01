import { UserRoleEnum, UserStatus } from "@prisma/client";
import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(UserRoleEnum).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    verifyOtp: z.string().optional(),
    verifyOtpExpireAt: z.number().int().optional(),
    isEmailVerified: z.boolean().optional(),
    resetOtp: z.string().optional(),
    resetOtpExpireAt: z.number().int().optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
