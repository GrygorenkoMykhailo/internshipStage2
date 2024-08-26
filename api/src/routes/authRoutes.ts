import express from "express";
import authController from "../controllers/authController";

export const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.authenticateUser);
router.post('/logout', authController.logOutUser)