import { Router } from "express";
import {
  getUserInfo,
  login,
  profileImageSetUp,
  signup,
  updateProfile,
  removeProfileImg,
  logOut,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
const uploads = multer({ dest: "uploads/profiles/" });

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/logout", verifyToken, logOut);
authRoutes.post(
  "/add-profile-img",
  verifyToken,
  uploads.single("profile-image"),
  profileImageSetUp
);
authRoutes.delete("/remove-profile-img", verifyToken, removeProfileImg);

export default authRoutes;
