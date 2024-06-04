import IAPIResponse from "../interfaces/apiResponse";
import ISquad from "../interfaces/squad";
import IUser from "../interfaces/user";
import teamsServices from "../services/teamsServices";
import { Request, Response } from "express";

const createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, leaderId } = req.body;
        const userIDLogged = req.userID;

        const newTeam: ISquad = await teamsServices.createTeam(name, leaderId, userIDLogged);

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

const insertMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const {team_id , user_id} = req.params;
        const loggedUserId = req.userID;

        const addedUser: Partial<IUser> = await teamsServices.insertMember(team_id, user_id, loggedUserId);

        const response = {
            data: addedUser,
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
        const userIDLogged = req.userID;

        const teams: ISquad[] = await teamsServices.getAllTeams(userIDLogged);
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
        const userIDLogged = req.userID;

        const team: ISquad | null = await teamsServices.getTeamById(team_id, userIDLogged);

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

const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { team_id } = req.params;
        const userID = req.userID;

        const members: IUser[] = await teamsServices.getTeamMembers(team_id, userID);

        const response = {
            data: members,
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

const updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, leaderId } = req.body;
        const id = req.params.id;
        const userIDLogged = req.userID;
        const updatedTeam = await teamsServices.updateTeam(id, name, leaderId, userIDLogged);

        const response: IAPIResponse<Partial<ISquad>> = {
            data: updatedTeam,
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

const deleteTeamById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { team_id } = req.params;
        const userIDLogged = req.userID;
        const deletedTeam = await teamsServices.deleteTeamById(team_id, userIDLogged);

        const response: IAPIResponse<Partial<ISquad>> = {
            data: deletedTeam,
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

const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { team_id, user_id } = req.params;
        const loggedUserId = req.userID;
        const deleteUser: IUser | null = await teamsServices.deleteMemberFromTeam(team_id, user_id, loggedUserId);

        if (deleteUser) {
            const response: IAPIResponse<IUser> = {
                data: deleteUser,
                error: null,
                status: 200,
            };
            res.status(200).json(response);
        } else {
            res.status(404).json({
                data: null,
                error: "Usuário ou equipe não encontrada.",
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
}

export default {
    createTeam,
    insertMember,
    getAllTeams,
    getTeamById,
    getTeamMembers,
    updateTeam,
    deleteTeamById,
    deleteTeamMember,
};
