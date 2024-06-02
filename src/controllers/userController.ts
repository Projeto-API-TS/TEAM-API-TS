import IAPIResponse from "../interfaces/apiResponse";
import IUser from "../interfaces/user";
import userServices from "../services/userServices";
import { Request, Response } from "express";
import CustomError from "../utils/customError";
import jwt from "jsonwebtoken";
import config from "../config";

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, first_name, last_name, password } = req.body;

        const newUser = await userServices.createUser(username, email, first_name, last_name, password);

        const response: IAPIResponse<Partial<IUser>> = {
            data: newUser,
            error: null,
            status: 200,
        };

        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({
            data: null,
            error: e.message,
            status: e.status || 500
        });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: IUser = req.body;

        const userID: string = await userServices.loginService(
            email.trim(),
            password.trim()
        );

        const sessionToken = jwt.sign({ userID }, config.SECRET_KEY, { expiresIn: 9999999999 });

        res.cookie("sessionID", sessionToken, { maxAge: 900000, httpOnly: true });
        res.status(200).json({ sessionToken });
    } catch (error) {
        if (error instanceof CustomError) {
            res
                .status(error.status)
                .json({ data: null, error: error.message, status: error.status });
        } else {
            res.status(500).json({ data: null, error: error, status: 500 })
        }
    }
};

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("sessionID");
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error, status: 500 })
    }
};

export default {
    createUser,
    login,
    logout
};
