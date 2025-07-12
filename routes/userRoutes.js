import express from "express";
import { deleteUser, getAllUsers, update } from "../controllers/userController.js";
import User from "../models/userModel.js";
import verifyToken from "../middlewares/verifyToken.js";

const user = express.Router();

user.get("/all", getAllUsers);
user.put("/update", verifyToken, update);
user.delete("/delete", verifyToken, deleteUser);
user.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });

  } catch (error) {
    console.error("Error fetching user from token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default user;
