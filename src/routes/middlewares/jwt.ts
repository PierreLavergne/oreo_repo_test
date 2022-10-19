import type { Request, Response, NextFunction } from "express";
import code from 'http-status-codes';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const checkJwt = (req: Request, res: Response, next: NextFunction): void => {
    const authorization: string = String(req.headers.authorization);

    if (authorization === "" || authorization.search('Bearer') === -1) {
        res.status(code.UNAUTHORIZED).send('Access denied');
        return;
    }
    const token: string = authorization.split(' ')[1];
    jwt.verify(token, String(process.env.SECRET_KEY), (err, result) => {
        if (err) {
            res.status(code.UNAUTHORIZED).send('Access denied');
            return;
        }
        res.locals.user = result;
        next();
    });
}

export default checkJwt;