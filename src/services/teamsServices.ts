import teamsRepository from "../repository/teamsRepository";
import ISquad from "../interfaces/squad";

const createTeam = async (name:string,leaderId:string):Promise<ISquad>=>{
    const newTeam:ISquad = await teamsRepository.createTeam(name,leaderId);
    return newTeam;
}

const getAllTeams = async ():Promise<ISquad[]>=>{
    const teams:ISquad[] = await teamsRepository.getAllTeams();
    return teams;
}

const getTeamById = async (team_id:string):Promise<ISquad | null>=>{
    const team:ISquad|null = await teamsRepository.getTeamById(team_id);
    return team;
}



export default {
    createTeam,
    getAllTeams,
    getTeamById,
};