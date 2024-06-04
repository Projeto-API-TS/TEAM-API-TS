import express from "express";
const router = express.Router();
import teamController from "../controllers/teamsController";
import authMiddleware from "../middleware/auth";

router.get("/", authMiddleware, teamController.getAllTeams);
router.get("/:team_id/members", authMiddleware, teamController.getTeamMembers);
router.get("/:team_id", authMiddleware, teamController.getTeamById);
router.post("/:team_id/member/:user_id", authMiddleware, teamController.insertMember);
router.post("/", authMiddleware, teamController.createTeam);
router.patch("/:id", authMiddleware, teamController.updateTeam);
router.delete("/:team_id", authMiddleware, teamController.deleteTeamById);
router.delete("/:team_id/member/:user_id", authMiddleware, teamController.deleteTeamMember);

export default router;
