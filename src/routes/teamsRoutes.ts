import express from "express";
const router = express.Router();
import teamController from "../controllers/teamsController";
import authMiddleware from "../middleware/auth";

router.get("/", teamController.getAllTeams);
router.get("/:team_id/members", authMiddleware, teamController.getTeamMembers);
router.get("/:team_id", teamController.getTeamById);
router.post("/:team_id/member/:user_id", authMiddleware, teamController.insertMember)
router.post("/", teamController.createTeam);
router.patch("/:id", teamController.updateTeam);
router.delete("/:team_id", teamController.updateTeam);

export default router;
