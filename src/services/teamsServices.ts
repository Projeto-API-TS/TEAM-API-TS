import teamsRepository from "../repository/teamsRepository";
import ISquad from "../interfaces/squad";
import { validateTeamName, validateUUID } from "../utils/validator";
import CustomError from "../utils/customError";

const createTeam = async (name: string, leaderId: string): Promise<ISquad> => {
    const newTeam: ISquad = await teamsRepository.createTeam(name, leaderId);
    return newTeam;
};

const getAllTeams = async (): Promise<ISquad[]> => {
    const teams: ISquad[] = await teamsRepository.getAllTeams();
    return teams;
};

const getTeamById = async (team_id: string): Promise<ISquad | null> => {
    const team: ISquad | null = await teamsRepository.getTeamById(team_id);
    return team;
};

const updateTeam = async (id: string, name: string, leaderId: string) : Promise<ISquad> => {
    try {
        if (!id) {
            throw new CustomError("O id é obrigatotrio.", 400);
        }

        if (!validateUUID(id)) {
            throw new CustomError("ID de time invalido.", 400);
        }

        if (name && !validateTeamName(name)) {
            throw new CustomError("O nome do time deve ter entre 3 e 30 caracteres e conter apenas letras e espaços.", 400);
        }
        
        if (leaderId && !validateUUID(leaderId)) {
            throw new CustomError("ID de lider invalido.", 400);
        }

        const isAlreadyLeader = await teamsRepository.getTeamByLeader(leaderId);

        const oldTeam: ISquad | null = await teamsRepository.getTeamById(id);
        
        if (!oldTeam) {
            throw new CustomError("Equipe não encontrada.", 404);
        }

        if (isAlreadyLeader && isAlreadyLeader.leader !== oldTeam.leader) {
            throw new CustomError("O lider fornecido já está liderando uma equipe.", 400);
        }

        const updatedTeam = await teamsRepository.updateTeam(id, name || oldTeam.name , leaderId || oldTeam.leader)

        return updatedTeam;
    } catch (e) {
        throw e;
    }
};
export default {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
};
