import pool from "../database/postgresql";
import ISquad from "../interfaces/squad";
import IUser from "../interfaces/user";
import CustomError from "../utils/customError";

const getTeamById = async (team_id: string): Promise<ISquad | null> => {
    const query = "SELECT * FROM teams WHERE id = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [team_id]);
        return rows[0] || null;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getAllTeams = async (): Promise<ISquad[]> => {
    const query = "SELECT * FROM teams";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getTeamByLeader = async (leaderId: string): Promise<ISquad> => {
    const query = "SELECT * FROM teams WHERE leader = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [leaderId]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getTeamByName = async (leaderId: string): Promise<ISquad> => {
    const query = "SELECT * FROM teams WHERE name = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [leaderId]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getTeamMembers = async (team_id: string): Promise<IUser[]> => {
    const query = "SELECT id, username, email, first_name, last_name, squad FROM users WHERE squad = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query , [team_id]);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const createTeam = async (name: string, leaderId: string): Promise<ISquad> => {
    const createTeamQuery = `INSERT INTO teams (name, leader) VALUES ($1, $2) RETURNING *`;
    const updateUserQuery = `UPDATE users SET squad = $1 WHERE id = $2 RETURNING *`;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        const { rows } = await client.query(createTeamQuery, [name, leaderId]);
        const newTeam = rows[0];
        
        await client.query(updateUserQuery, [newTeam.id, leaderId]);

        await client.query('COMMIT');
        return newTeam;
    } catch (e: any) {
        if (client) {
            await client.query('ROLLBACK');
        }
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};


const verificateLeader = async (leader_id: string): Promise<ISquad> => {
    const query = "SELECT * FROM teams WHERE leader = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [leader_id]);
        return rows[0]; 
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const updateTeam = async (id: string, name: string, leaderId: string) => {
    const query = "UPDATE teams SET name = $1, leader = $2 WHERE id = $3 RETURNING *";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [name, leaderId, id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

export default {
    getTeamById,
    getAllTeams,
    getTeamByLeader,
    getTeamByName,
    getTeamMembers,
    createTeam,
    verificateLeader,
    updateTeam
};

