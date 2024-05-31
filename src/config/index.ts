import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: Number(process.env.PORT || 3000) ,
    HOST: String(process.env.HOST || "localhost") ,
    SECRET_KEY: String(process.env.SECRET_KEY || "senha_padrao") ,
    CONNECTION_STRING: String(process.env.CONNECTION_STRING || "postgresql://postgres:password@localhost:5432/db") ,
};

export default config;
