import IAPIResponse from "../interfaces/apiResponse";
import ISquad from "../interfaces/squad";
import teamsServices from "../services/teamsServices";
import { Request, Response } from "express";

const createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, leaderId } = req.body;

        const newTeam: ISquad = await teamsServices.createTeam(name, leaderId);

        const response = {
            data: newTeam,
            error: null,
            status: 200,
        };

        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({
            data: null,
            error: e.message,
            status: e.status || 500,
        });
    }
};

const getAllTeams = async (req: Request, res: Response): Promise<void> => {
    try {
        const teams: ISquad[] = await teamsServices.getAllTeams();

        const response = {
            data: teams,
            error: null,
            status: 200,
        };

        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({
            data: null,
            error: e.message,
            status: e.status || 500,
        });
    }
};

const getTeamById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { team_id } = req.params;
        const team: ISquad | null = await teamsServices.getTeamById(team_id);

        if (team) {
            const response = {
                data: team,
                error: null,
                status: 200,
            };

            res.status(200).json(response);
        } else {
            res.status(404).json({
                data: null,
                error: "Equipe não encontrada.",
                status: 404,
            });
        }
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({
            data: null,
            error: e.message,
            status: e.status || 500,
        });
    }
};

const updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, leaderId } = req.body;
        const id = req.params.id;
        const updatedTeam = await teamsServices.updateTeam(id, name, leaderId);

        const response: IAPIResponse<Partial<ISquad>> = {
            data: updatedTeam,
            error: null,
            status: 200,
        };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

export default {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam
};
