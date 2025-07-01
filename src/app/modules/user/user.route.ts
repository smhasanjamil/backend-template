import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidation.userValidationSchema),
  UserController.registerUser
);
router.post("/verify-email", UserController.registerUser);
router.post("/forgot-password", UserController.registerUser);
router.post("/reset-password/:token", UserController.registerUser);

export const UserRoutes = router;
