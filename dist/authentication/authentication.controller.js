"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const express = __importStar(require("express"));
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../exceptions/UserWithThatEmailAlreadyExistsException"));
const WrongCredentialsException_1 = __importDefault(require("../exceptions/WrongCredentialsException"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const user_dto_1 = __importDefault(require("../users/user.dto"));
const login_dto_1 = __importDefault(require("./login.dto"));
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const user_entity_1 = __importDefault(require("../users/user.entity"));
class AuthenticationController {
    constructor() {
        this.path = "/auth";
        this.router = express.Router();
        this.userRepository = typeorm_1.getRepository(user_entity_1.default);
        this.salt = 12;
        this.registration = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = req.body;
            if (yield this.userRepository.findOne({ email: userData.email })) {
                next(new UserWithThatEmailAlreadyExistsException_1.default(userData.email));
            }
            else {
                const hashedPassword = yield bcrypt.hash(userData.password, this.salt);
                const user = yield this.userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                // @ts-ignore
                user.password = undefined;
                res.send(user);
            }
        });
        this.loggingIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const logInData = req.body;
            const user = yield this.userRepository.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = yield bcrypt.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const tokenData = this.createToken(user);
                    res.setHeader("set-Cookie", [this.createCookie(tokenData)]);
                    res.send(user);
                }
                else {
                    next(new WrongCredentialsException_1.default());
                }
            }
            else {
                next(new WrongCredentialsException_1.default());
            }
        });
        this.loggingOut = (req, res) => {
            res.setHeader("set-Cookie", [`Authorization=;Max-age=0`]);
            res.status(200).send();
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_middleware_1.default(user_dto_1.default), this.registration);
        this.router.post(`${this.path}/login`, validation_middleware_1.default(login_dto_1.default), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }
    createToken(user) {
        const expiresIn = 60 * 60; // hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            _id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map