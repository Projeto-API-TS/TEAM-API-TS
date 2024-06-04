import userRepository from "../repository/userRepository";
import teamsRepository from "../repository/teamsRepository";
import IUser from "../interfaces/user";
import ISquad from "../interfaces/squad";
import hashPassword from "../utils/hashPassword";
import CustomError from "../utils/customError";
import { validateEmail, validateName, validatePassword, validateUsername } from "../utils/validator";
import bcrypt from "bcrypt";

const getAllUsers = async (userIDLogged: string): Promise<IUser[]> => {
    try {
        const userLogged = await userRepository.getMyUser(userIDLogged);
        if (!userLogged.is_admin) {
            throw new CustomError("Acesso não autorizado!", 403);
        }
        const users: IUser[] = await userRepository.getAllUsers();
        return users;
    } catch (e: any) {
        throw e;
    }
};

const getMyUser = async (userID: string): Promise<IUser> => {
    try {
        const user: IUser = await userRepository.getMyUser(userID);
        return user;
    } catch (e: any) {
        throw e;
    }
};

const getUserById = async (userID: string, userIDLogged: string): Promise<IUser> => {
    try {
        const userLogged: IUser = await userRepository.getMyUser(userIDLogged);
        const userLoggedLeaderTeam: ISquad = await teamsRepository.verificateLeader(userIDLogged);
        const userById: IUser = await userRepository.getMyUser(userID);
        const userByIdLeaderTeam: ISquad = await teamsRepository.verificateLeader(userID);
        let user: IUser;
        if (userLogged.is_admin) {
            user = await userRepository.getUserById(userID, false);
        } else if (
            (userLoggedLeaderTeam && userLoggedLeaderTeam.id === userById.squad) ||
            (userLoggedLeaderTeam && userByIdLeaderTeam)
        ) {
            user = await userRepository.getUserById(userID, true);
        } else {
            throw new CustomError("Acesso não autorizado!", 403);
        }

        if (!user) {
            throw new CustomError('Usuário não encontrado.', 404);
        }

        return user;
    } catch (e: any) {
        throw e;
    }
};

const createUser = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
): Promise<Partial<IUser>> => {
    try {
        if (!validateUsername(username)) {
            throw new CustomError(
                "O nome de usuário deve ter entre 1 e 30 caracteres e conter apenas letras, números e sublinhados.",
                400
            );
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

const updateUser = async (
    id: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    is_admin: boolean ,
    userIDLogged: string
): Promise<IUser> => {
    try {
        const userLogged: IUser = await userRepository.getMyUser(userIDLogged);
        const oldUser: IUser = await userRepository.getMyUser(id);
        const allowGivingAdmin = userLogged.is_admin && !oldUser.squad;
        console.log("allow:", allowGivingAdmin);
        
        const isAdminValue = allowGivingAdmin ? is_admin : false;

        if(!oldUser){
            throw new CustomError('Usuário não encontrado.', 404);
        }

        if (!userLogged.is_admin && oldUser.id !== userIDLogged) {
            throw new CustomError("Acesso não autorizado!", 403);
        }

        if (userLogged.is_admin && is_admin && oldUser.squad) {
            throw new CustomError("Não é possivel dar admin para um usuário com equipe.", 403);
        }

        if (username && !validateUsername(username)) {
            throw new CustomError(
                "O nome de usuário deve ter entre 1 e 30 caracteres e conter apenas letras, números e sublinhados.",
                400
            );
        }

        if (email && !validateEmail(email)) {
            throw new CustomError("O email deve ser válido no formato padrão (ex: usuario@exemplo.com).", 400);
        }

        if ((first_name || last_name) && !validateName(first_name + last_name)) {
            throw new CustomError("O nome deve ter pelo menos 3 caracteres e conter apenas letras e espaços.", 400);
        }

        if (password && !validatePassword(password)) {
            throw new CustomError("A senha deve ter pelo menos 8 caracteres, incluindo letras e números.", 400);
        }

        const usernameExists: IUser = await userRepository.getUserByUsername(username);

        if (usernameExists) {
            throw new CustomError("O username fornecido já está sendo utilizado.", 400);
        }

        const hashedPassword = password ? await hashPassword(password) : null;

        const updatedUser = await userRepository.updateUser(
            id,
            username || oldUser.username,
            email || oldUser.email,
            first_name || oldUser.first_name,
            last_name || oldUser.last_name,
            hashedPassword || oldUser.password,
            isAdminValue
        );

        return updatedUser
    } catch (e) {
        throw e;
    }
};

const deleteUserById = async (userID: string, userIDLogged: string): Promise<IUser> => {
    try {
        const userLogged: IUser = await userRepository.getMyUser(userIDLogged);
        const userLeader: ISquad = await teamsRepository.verificateLeader(userID);
        if (!userLogged.is_admin) {
            throw new CustomError("Ação não autorizada! Você não é um administrador.", 403);
        } else if (userLeader) {
            throw new CustomError("Ação não autorizada! Você não pode excluir um líder de equipe.", 403);
        }
        const user: IUser = await userRepository.deleteUserById(userID);

        if (!user) {
            throw new CustomError('Usuário não encontrado.', 404);
        }

        return user;
    } catch (e: any) {
        throw e;
    }
};

const loginService = async (username: string, password: string): Promise<string> => {
    try {
        const result = await userRepository.getUserByUsername(username);

        if (result) {
            const user = result;
            const hashedPassword = await bcrypt.compare(password, user.password);

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
};

export default {
    getAllUsers,
    getMyUser,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    loginService,
};
