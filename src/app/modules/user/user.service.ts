import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import AppError from "../../errors/appError";
import status from "http-status";
import jwt from "jsonwebtoken";

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
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  //   Prepare data
  const userData = {
    ...payload,
    password: hashedPassword,
  };

  //   Create user
  const newUser = await prisma.user.create({
    data: {
      ...userData,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      verifyOtp: true,
      verifyOtpExpireAt: true,
      isEmailVerified: true,
      resetOtp: true,
      resetOtpExpireAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};

export const UserServices = {
  registerUserIntoDB,
};
