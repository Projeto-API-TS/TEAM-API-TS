import pool from "../database/postgresql";
import IUser from "../interfaces/user";
import CustomError from "../utils/customError";

const getAllUsers = async (): Promise<IUser[]> => {
    const query = "SELECT * FROM users";
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

const getMyUser = async (userID: string): Promise<IUser> => {
    const query = "SELECT * FROM users WHERE id = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [userID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message || e, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getUserById = async (
    userID: string,
    isLeader: boolean
): Promise<IUser> => {
    const queryAdmin = "SELECT * FROM users WHERE id = $1";
    const queryLeader =
        "SELECT id, username, email, first_name, last_name, squad, is_admin FROM users WHERE id = $1";
    let client;
    try {
        client = await pool.connect();
        if (isLeader) {
            const { rows } = await client.query(queryLeader, [userID]);
            return rows[0];
        }
        const { rows } = await client.query(queryAdmin, [userID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message || e, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getUserByUsername = async (username: string): Promise<IUser> => {
    const query = "SELECT * FROM users WHERE username = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [username]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message || e, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const createUser = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
): Promise<Partial<IUser>> => {
    const query = `INSERT INTO users (username, email, first_name, last_name, password) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, first_name, last_name`;
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [
            username,
            email,
            first_name,
            last_name,
            password,
        ]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message || e, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const updateUser = async (
    id: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
): Promise<IUser> => {
    const query = `
        UPDATE users 
        SET username = $1, email = $2, first_name = $3, last_name = $4, password = $5 
        WHERE id = $6 
        RETURNING *;
    `;

    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [
            username,
            email,
            first_name,
            last_name,
            password,
            id,
        ]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const deleteUserById = async (userID: string): Promise<IUser> => {
    const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [userID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message || e, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const loginQuery = async (email: string): Promise<IUser[]> => {
    const client = await pool.connect();
    try {
        const query = "SELECT id, password FROM users WHERE email = $1";
        const result = await client.query(query, [email]);
        return result.rows;
    } catch (error: any) {
        throw error;
    } finally {
        client.release();
    }
};

export default {
    getAllUsers,
    getMyUser,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUserById,
    loginQuery,
};
