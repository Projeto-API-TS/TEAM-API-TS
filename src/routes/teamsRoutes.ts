import express from "express";
const router = express.Router();
import teamController from '../controllers/teamsController'

router.post('/', teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.get('/:team_id', teamController.getTeamById);
router.patch('/:id', teamController.updateTeam)

export default router;