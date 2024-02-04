import express from "express";
import {
  createChat,
  findUserChats,
  findChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", createChat);
router.get("/chat/:userId", findUserChats);
router.get("/chat/find/:firstId/:secondId", findChat);

export default router;
