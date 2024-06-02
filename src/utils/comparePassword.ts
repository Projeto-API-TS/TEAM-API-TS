import bcrypt from "bcrypt";

export default async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    } catch (error) {
        console.error('Erro ao comparar a senha:', error);
        return false;
    }
};
