import IAPIResponse from "../interfaces/apiResponse";
import IUser from "../interfaces/user";
import userServices from "../services/userServices";
import { Request, Response } from "express";
import CustomError from "../utils/customError";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users: IUser[] = await userServices.getAllUsers();

        const response: IAPIResponse<IUser[]> = {
            data: users,
            error: null,
            status: 200,
        };

        res.status(200).json(response);
    } catch(e: any){
        console.error(e);
        res.status(e.status || 500).json({
            data: null,
            error: e.message,
            status: e.status || 500
        });
    }
}

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
            status: e.status || 500
        });
    }
};

export default {
    getAllUsers,
    createUser,
};
