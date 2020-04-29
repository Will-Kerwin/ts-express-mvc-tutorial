import * as bcrypt from "bcryptjs";
import * as express from "express";
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import IController from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDTO from "../users/user.dto";
import userModel from "../users/user.model";
import LoginDto from "./login.dto";
import IUser from "../users/user.interface";
import ITokenData from "../interfaces/tokenData.interface";
import IDataStoredInToken from "../interfaces/dataStoredInToken.interface";
import * as jwt from "jsonwebtoken"

class AuthenticationController implements IController{
    public path: string ="/auth";
    public router: express.Router = express.Router();
    private user = userModel;
    private salt: number = 12;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.registration);
        this.router.post(`${this.path}/login`,validationMiddleware(LoginDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut)
    }

    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDTO = req.body;
        if(
            await this.user.findOne({email: userData.email})
        ){
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        }else {
            const hashedPassword = await bcrypt.hash(userData.password, this.salt);
            const user = await this.user.create({
                ...userData,
                password:hashedPassword,
            });
            //@ts-ignore
            user.password = undefined;
            res.send(user)
        }
    }

    private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: LoginDto = req.body;
        const user = await this.user.findOne({email: logInData.email});
        if(user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if(isPasswordMatching){
                //@ts-ignore
                user.password = undefined;
                const tokenData = this.createToken(user);
                res.setHeader("set-Cookie", [this.createCookie(tokenData)])
                res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException())
        }
    }

    private createToken(user: IUser): ITokenData {
        const expiresIn = 60*60; // hour
        // @ts-ignore
        const secret: string = process.env.JWT_SECRET;
        const _id: string = user._id;
        const dataStoredInToken: IDataStoredInToken = {
            _id: _id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret,{ expiresIn })
        }
    }

    private createCookie(tokenData:ITokenData){
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    private loggingOut = (req: express.Request, res: express.Response) => {
        res.setHeader("set-Cookie", [`Authorization=;Max-age=0`]);
        res.status(200).send()
    }
}

export default AuthenticationController;
