import express from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/auth";
const router = express.Router();

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/me", authMiddleware, userController.getMyUser);
router.get("/:user_id", authMiddleware, userController.getUserById);
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.patch("/:user_id", authMiddleware, userController.updateUser);
router.delete("/logout", userController.logout);
router.delete("/:user_id", authMiddleware, userController.deleteUserById);

export default router;
