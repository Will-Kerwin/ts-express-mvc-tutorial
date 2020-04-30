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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const posts_model_1 = __importDefault(require("../posts/posts.model"));
const NotAuthorizedException_1 = __importDefault(require("../exceptions/NotAuthorizedException"));
class UserController {
    constructor() {
        this.path = "/users";
        this.router = express_1.default.Router();
        this.post = posts_model_1.default;
        this.getAllPostsOfUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            //@ts-ignore
            const reqUserID = req.user._id;
            if (userId === reqUserID.toString()) {
                const posts = yield this.post.find({ author: userId });
                res.send(posts);
            }
            next(new NotAuthorizedException_1.default());
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/:id/posts`, auth_middleware_1.default, this.getAllPostsOfUser);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map