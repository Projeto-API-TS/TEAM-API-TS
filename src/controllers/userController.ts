import IAPIResponse from "../interfaces/apiResponse";
import IUser from "../interfaces/user";
import userServices from "../services/userServices";
import { Request, Response } from "express";
import CustomError from "../utils/customError";
import jwt from "jsonwebtoken";
import config from "../config";
import userRepository from "../repository/userRepository";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIDLogged = req.userID;

        const users: IUser[] = await userServices.getAllUsers(userIDLogged);

        const response: IAPIResponse<IUser[]> = {
            data: users,
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

const getMyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.userID;
        const user: IUser = await userServices.getMyUser(userID);

        const response: IAPIResponse<IUser> = {
            data: user,
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

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIDLogged = req.userID;
        const userID = req.params.user_id;
        const user: IUser = await userServices.getUserById(userID, userIDLogged);

        const response: IAPIResponse<IUser> = {
            data: user,
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

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, first_name, last_name, password } = req.body;

        const newUser = await userServices.createUser(username, email, first_name, last_name, password);

        const response: IAPIResponse<Partial<IUser>> = {
            data: newUser,
            error: null,
            status: 201,
        };

        res.status(201).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({
            data: null,
            error: e.message,
            status: e.status || 500,
        });
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, first_name, last_name, password, is_admin} = req.body;
        const id = req.params.user_id;
        const userIDLogged = req.userID;

        const updatedUser: IUser = await userServices.updateUser(
            id,
            username,
            email,
            first_name,
            last_name,
            password,
            is_admin || false,
            userIDLogged
        );

        const response: IAPIResponse<Partial<IUser>> = {
            data: updatedUser,
            error: null,
            status: 200,
        };

        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message , status: e.status || 500});
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password }: IUser = req.body;

        const userID: string = await userServices.loginService(username, password);

        const sessionToken = jwt.sign({ userID }, config.SECRET_KEY, {
            expiresIn: 864000,
        });

        res.cookie("sessionID", sessionToken, {
            maxAge: 864000000,
            httpOnly: true,
        });
        res.status(200).json({ sessionToken });
    } catch (error: any) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.status).json({
                data: null,
                error: error.message,
                status: error.status,
            });
        } else {
            res.status(500).json({ data: null, error: error, status: 500 });
        }
    }
};

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIDLogged = req.userID;
        const userID = req.params.user_id;
        const user: IUser = await userServices.deleteUserById(userID, userIDLogged);

        const response: IAPIResponse<IUser> = {
            data: user,
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

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("sessionID");
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error, status: 500 });
    }
};

export default {
    getAllUsers,
    getMyUser,
    getUserById,
    createUser,
    updateUser,
    login,
    deleteUserById,
    logout,
};
