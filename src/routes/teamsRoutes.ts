import express from "express";
const router = express.Router();
import teamController from "../controllers/teamsController";
import authMiddleware from "../middleware/auth";

<<<<<<< users
router.post("/teams", teamController.createTeam);
router.get("/teams", teamController.getAllTeams);
router.get("/teams/:team_id/members", authMiddleware, teamController.getTeamMembers);
router.get("/teams/:team_id", teamController.getTeamById);
router.patch("/teams/:id", teamController.updateTeam);
router.delete("/teams/:team_id", teamController.updateTeam);
router.delete("/teams/:team_id/member/:user_id",authMiddleware, teamController.deleteTeamMember)
=======
router.get("/", teamController.getAllTeams);
router.get("/:team_id/members", authMiddleware, teamController.getTeamMembers);
router.get("/:team_id", teamController.getTeamById);
router.post("/:team_id/member/:user_id", authMiddleware, teamController.insertMember)
router.post("/", teamController.createTeam);
router.patch("/:id", teamController.updateTeam);
router.delete("/:team_id", teamController.updateTeam);
>>>>>>> main

export default router;
