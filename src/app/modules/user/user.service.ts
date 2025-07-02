import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import AppError from "../../errors/appError";
import status from "http-status";
import jwt, { Secret } from "jsonwebtoken";
import { generateToken } from "../../utils/generateToken";
import config from "../../config";
import { StringValue } from "ms";
import { emailService, EmailService } from "../../utils/sendMail";

// Register User
const registerUserIntoDB = async (payload: User) => {
  //  Check if user already exists (by email, or another unique field)
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email, // Assuming 'email' is unique
    },
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  //  Hash the password
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  
  const { otp, expiresAt } = EmailService.generateVerificationOTP();

  const userData = {
    ...payload,
    password: hashedPassword,
    verifyOtp: otp,
    verifyOtpExpireAt: expiresAt.getTime(),
    isEmailVerified: false,
  };

  const newUser = await prisma.user.create({ data: userData });

  await emailService.sendVerificationEmail(newUser.email, otp);

  // Generate JWT token
  const accessToken = generateToken(
    {
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as StringValue
  );

  return {
    user: {
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
    },
    accessToken,
    message: "Verification email sent",
  };
};

export const UserServices = {
  registerUserIntoDB,
};
