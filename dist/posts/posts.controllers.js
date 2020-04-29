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
const express_1 = require("express");
const posts_model_1 = __importDefault(require("./posts.model"));
const PostNotFoundException_1 = __importDefault(require("../exceptions/PostNotFoundException"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const post_dto_1 = __importDefault(require("./post.dto"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
class PostsController {
    constructor() {
        this.path = "/posts";
        this.router = express_1.Router();
        this.post = posts_model_1.default;
        this.getAllPosts = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.post.find()
                .populate('author', '-password');
            response.send(posts);
        });
        this.getPostById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const post = yield this.post.findById(id);
            if (post) {
                response.send(post);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        });
        this.modifyPost = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const postData = request.body;
            const post = yield this.post.findByIdAndUpdate(id, postData, { new: true });
            if (post) {
                response.send(post);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        });
        this.createPost = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const postData = request.body;
            //@ts-ignore
            const { _id } = request.user;
            const createdPost = new this.post(Object.assign(Object.assign({}, postData), { author: _id }));
            const savedPost = yield createdPost.save();
            response.send(savedPost);
        });
        this.deletePost = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const successResponse = yield this.post.findByIdAndDelete(id);
            if (successResponse) {
                response.send(200);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        });
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, auth_middleware_1.default)
            .patch(`${this.path}/:id`, validation_middleware_1.default(post_dto_1.default, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, auth_middleware_1.default, validation_middleware_1.default(post_dto_1.default), this.createPost);
    }
}
exports.default = PostsController;
//# sourceMappingURL=posts.controllers.js.map