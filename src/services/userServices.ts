import userRepository from "../repository/userRepository";
import IUser from "../interfaces/user";
import hashPassword from "../utils/hashPassword";
import CustomError from "../utils/customError";
import { validateEmail, validateName, validatePassword, validateUsername } from "../utils/validator";

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

export default {
    createUser,
};
