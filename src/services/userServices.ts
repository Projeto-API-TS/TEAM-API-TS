import userRepository from "../repository/userRepository";
import IUser from "../interfaces/user";
import hashPassword from "../utils/hashPassword";
import CustomError from "../utils/customError";
import { validateEmail, validateName, validatePassword, validateUsername } from "../utils/validator";
import bcrypt from "bcrypt";

const getAllUsers = async(): Promise<IUser[]> => {
    try {
        const users: IUser[] = await userRepository.getAllUsers();
        return users;
    } catch (e: any) {
        throw e;
    }
}

const createUser = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
): Promise<Partial<IUser>> => {
    try {
        if (!validateUsername(username)) {
            throw new CustomError("O nome de usuário deve ter entre 1 e 30 caracteres e conter apenas letras, números e sublinhados.", 400);
        }

        if (!validateEmail(email)) {
            throw new CustomError("O email deve ser válido no formato padrão (ex: usuario@exemplo.com).", 400);
        }

        if (!first_name || !last_name) {
            throw new CustomError("Nome e sobrenome são obrigatorios.", 400);
        }

        if (!validateName(first_name + last_name)) {
            throw new CustomError("O nome deve ter pelo menos 3 caracteres e conter apenas letras e espaços.", 400);
        }

        if (!validatePassword(password)) {
            throw new CustomError("A senha deve ter pelo menos 8 caracteres, incluindo letras e números.", 400);
        }

        const userExists: IUser = await userRepository.getUserByUsername(username);

        if (userExists) {
            throw new CustomError("O username fornecido já está sendo utilizado.", 400);
        }
        const hashedPassword = await hashPassword(password);
        const user: Partial<IUser> = await userRepository.createUser(username, email, first_name, last_name, hashedPassword);
        return user;
    } catch (e) {
        throw e;
    }
};

export const loginService = async (
    email:string,
    password:string
): Promise<string> => {
    try {
        const result = await userRepository.loginQuery(email);

        if (result.length > 0) {
            const user = result[0];
            const hashedPassword = await bcrypt.compare(password, user.password)

            if (!hashedPassword) {
                const error = new CustomError("Email e/ou senha incorretos.", 404);
                throw error;
            }

            return user.id;

        } else {
            const error = new CustomError("Email e/ou senha incorretos.", 404);
            throw error;
        }

    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        } else if (error instanceof Error) {
            throw new CustomError(error.message, 500);
        }
        throw error;
    }
}


export default {
    getAllUsers,
    createUser,
    loginService,
};
