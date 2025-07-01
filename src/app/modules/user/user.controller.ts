import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { UserServices } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User registration completed successfully!",
    data: result,
  });
});

export const UserController = {
  registerUser,
};
