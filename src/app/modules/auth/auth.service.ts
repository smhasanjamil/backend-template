import bcrypt from "bcrypt";
// import httpStatus from 'http-status';
import { Secret } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import AppError from "../../errors/appError";
import status from "http-status";
import { generateToken } from "../../utils/generateToken";
import config from "../../config";
import type { StringValue } from "ms";
// import config from '../../../config';
// import AppError from '../../errors/AppError';
// import { generateToken } from '../../utils/generateToken';
// import prisma from '../../utils/prisma';
// import { UserServices } from '../User/user.service';

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(status.BAD_REQUEST, "Password incorrect");
  }

  // if (!userData.isEmailVerified) {
  //   await UserServices.resendUserVerificationEmail(userData.email);
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Email is not verified, Please check your email for the verification link."
  //   );
  // }

  const accessToken = generateToken(
    {
      id: userData.id,
      name: userData.firstName + " " + userData.lastName,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as StringValue
  );
  return {
    id: userData.id,
    name: userData.firstName + " " + userData.lastName,
    email: userData.email,
    role: userData.role,
    accessToken: accessToken,
  };
};

export const AuthServices = { loginUserFromDB };
