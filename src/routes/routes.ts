import { Router } from "express";
import userRoutes from "./userRoutes";
import teamsRoutes from "./teamsRoutes"
const router = Router();

router.use("/user", userRoutes)
router.use("/teams", teamsRoutes)

export default router
