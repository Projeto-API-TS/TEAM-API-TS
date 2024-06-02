import bcrypt from "bcrypt";
import CustomError from "./customError";

export default async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (e: any) {
        console.error("Erro ao gerar o hash da senha:", e);
        throw new CustomError("Erro ao gerar o hash da senha.", 500);
    }
};
