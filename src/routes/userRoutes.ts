import express from "express";
import userController from "../controllers/userController";
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.delete("/logout", userController.logout);

export default router;