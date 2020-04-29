import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import IDataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../users/user.model';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
        //@ts-ignore
        const secret: string = process.env.JWT_SECRET;

        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}
export default authMiddleware;
