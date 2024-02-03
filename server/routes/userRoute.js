import express from "express";
import {
  registerUser,
  loginUser,
  findUser,
  findAllUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/findall", findAllUser);

export default router;
