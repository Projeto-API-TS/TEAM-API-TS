import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/index";

declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies.sessionID;

    if (sessionToken) {
        try {
            const decoded = jwt.verify(sessionToken, config.SECRET_KEY);
            if (typeof decoded === 'object' && 'user' in decoded) {
                req.user = decoded.user;
                next();
            } else {
                throw new Error('Token inválido');
            }
        } catch (error: any) {
            return res.status(401).json({ data: null, error: 'Token inválido', token: 401 });
        }
    } else {
        return res.status(401).json({ data: null, error: 'Acesso não autorizado. Faça login para acessar este recurso.', status: 401});
    }
};

export default authMiddleware;