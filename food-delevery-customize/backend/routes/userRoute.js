import express from "express";
import { loginUser, registerUser, verifyEmail, forgotPassword, resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify-email/:token", verifyEmail);  // New verification route
userRouter.post("/forgot-password", forgotPassword);  // Forgot password
userRouter.post("/reset-password", resetPassword);    // Reset password

export default userRouter;
