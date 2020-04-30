import * as bcrypt from "bcryptjs";
import * as express from "express";
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import IController from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDTO from "../users/user.dto";
import LoginDto from "./login.dto";
import ITokenData from "../interfaces/tokenData.interface";
import IDataStoredInToken from "../interfaces/dataStoredInToken.interface";
import * as jwt from "jsonwebtoken"
import {getRepository} from "typeorm";
import User from "../users/user.entity";

class AuthenticationController implements IController{
    public path: string ="/auth";
    public router: express.Router = express.Router();
    private userRepository = getRepository(User);
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
            await this.userRepository.findOne({email: userData.email})
        ){
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        }else {
            const hashedPassword = await bcrypt.hash(userData.password, this.salt);
            const user = await this.userRepository.create({
                ...userData,
                password:hashedPassword,
            });
            // @ts-ignore
            user.password = undefined;
            res.send(user)
        }
    }

    private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: LoginDto = req.body;
        const user = await this.userRepository.findOne({email: logInData.email});
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

    private createToken(user: User): ITokenData {
        const expiresIn = 60*60; // hour
        const secret: string = <string>process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: <string> user.id,
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
