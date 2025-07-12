import express from "express";
import { login, logout } from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/test", (req, res) => {
  res.status(200).send("✅ Auth route is working!");
});

export default router;
