import teamsRepository from "../repository/teamsRepository";
import ISquad from "../interfaces/squad";
import { validateTeamName, validateUUID } from "../utils/validator";
import CustomError from "../utils/customError";
import IUser from "../interfaces/user";
import userRepository from "../repository/userRepository";

const createTeam = async (name: string, leaderId: string): Promise<ISquad> => {
    try {
        if (!validateTeamName(name)) {
            throw new CustomError("O nome do time deve ter entre 3 e 30 caracteres e conter apenas letras e espaços.", 400);
        }

        if (!validateUUID(leaderId)) {
            throw new CustomError("ID de lider invalido.", 400);
        }

        const isAlreadyLeader = await teamsRepository.getTeamByLeader(leaderId);

        if (isAlreadyLeader) {
            throw new CustomError("O lider fornecido já está liderando uma equipe.", 400);
        }

        const nameAlreadyExist = await teamsRepository.getTeamByName(name);

        if (nameAlreadyExist) {
            throw new CustomError("O nome fornecido já está sendo utilizado.", 400);
        }

        const newTeam: ISquad = await teamsRepository.createTeam(name, leaderId);
        return newTeam;
    } catch (e) {
        throw e;
    }
};

const getAllTeams = async (): Promise<ISquad[]> => {
    try {
        const teams: ISquad[] = await teamsRepository.getAllTeams();
        return teams;
    } catch (e) {
        throw e;
    }
};

const getTeamById = async (team_id: string): Promise<ISquad | null> => {
    try {
        if (!team_id) {
            throw new CustomError("O id é obrigatotrio.", 400);
        }

        if (!validateUUID(team_id)) {
            throw new CustomError("ID de time invalido.", 400);
        }

        const team: ISquad | null = await teamsRepository.getTeamById(team_id);
        return team;
    } catch (e) {
        throw e;
    }
};

const getTeamMembers = async (team_id: string, userID: string): Promise<IUser[]> => {
    try {
        if (!team_id) {
            throw new CustomError("O id é obrigatotrio.", 400);
        }

        if (!validateUUID(team_id)) {
            throw new CustomError("ID de time invalido.", 400);
        }
        const team: ISquad | null = await teamsRepository.getTeamById(team_id);

        if (!team) {
            throw new CustomError("Equipe não encontrada.", 404);
        }

        const user = await userRepository.getMyUser(userID);
    
        if (!user.is_admin && user.squad !== team.id) {
            throw new CustomError("Acesso não autorizado!", 403);
        }

        const members: IUser[] = await teamsRepository.getTeamMembers(team_id);

        return members;
    } catch (e) {
        throw e;
    }
};

const updateTeam = async (id: string, name: string, leaderId: string): Promise<ISquad> => {
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

        const nameAlreadyExist = await teamsRepository.getTeamByName(name);

        if (nameAlreadyExist) {
            throw new CustomError("O nome fornecido já está sendo utilizado.", 400);
        }

        const updatedTeam = await teamsRepository.updateTeam(id, name || oldTeam.name, leaderId || oldTeam.leader);

        return updatedTeam;
    } catch (e) {
        throw e;
    }
};

const deleteTeamById = async(team_id:string):Promise<void>=>{
    try {
        const team = await teamsRepository.getTeamById(team_id);

        if(!team){
            throw new CustomError('Equipe não encontrada.',404);
        }

         await teamsRepository.deleteTeamById(team_id);


    } catch (e) {
        throw e;
    }
}

const deleteMemberFromTeam = async(team_id: string, user_id: string): Promise<IUser[] | null> => {
    try {
        if (!validateUUID(team_id)) {
            throw new CustomError("ID de time inválido.", 400);
        }

        if (!validateUUID(user_id)) {
            throw new CustomError("ID de usuário inválido.", 400);
        }

        const teamMember = await teamsRepository.getTeamMembers(team_id);
        if (!teamMember) {
            throw new CustomError("Equipe não encontrada.", 404);
        }

        const member = await userRepository.getMyUser(user_id);
        if (!member || !teamMember.some(name => name.id === user_id)) {
            throw new CustomError("Usuário não encontrado na equipe.", 404);
        }

        const members: IUser[] = await teamsRepository.removeMemberFromTeam(team_id, user_id);

        return members;
    } catch (e) {
        throw e;
    }
}

export default {
    createTeam,
    getAllTeams,
    getTeamById,
    getTeamMembers,
    updateTeam,
    deleteTeamById,
    deleteMemberFromTeam,
};
