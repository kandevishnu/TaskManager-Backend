import express from "express";
import { createTask, deleteTask, getTasks, getTasksByStatus, updateTask } from "../controllers/taskController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();


router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);
router.get("/filter", verifyToken, getTasksByStatus);

export default router;
