import express from "express";
import {
  createMessage,
  getMassages,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/message", createMessage);
router.get("/messages/:chatId", getMassages);

export default router;
