import express from "express";
const router = express.Router();
import teamController from "../controllers/teamsController";
import authMiddleware from "../middleware/auth";

router.post("/teams", teamController.createTeam);
router.get("/teams", teamController.getAllTeams);
router.get("/teams/:team_id/members", authMiddleware, teamController.getTeamMembers);
router.get("/teams/:team_id", teamController.getTeamById);
router.patch("/teams/:id", teamController.updateTeam);
router.delete("/teams/:team_id", teamController.updateTeam);
router.delete("/teams/:team_id/member/:user_id", teamController.deleteTeamMember)

export default router;
