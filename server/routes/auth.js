import express from "express";

const router = express.Router();

import { requireSignin } from "../middlewares";

// controllers
import {
  register,
  login,
  logout,
  currentUser,
  //   sendTestEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
// router.get("/send-email", sendTestEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
