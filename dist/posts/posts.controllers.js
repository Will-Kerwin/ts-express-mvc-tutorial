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
const PostNotFoundException_1 = __importDefault(require("../exceptions/PostNotFoundException"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const post_dto_1 = __importDefault(require("./post.dto"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const typeorm_1 = require("typeorm");
const post_entity_1 = __importDefault(require("./post.entity"));
class PostsController {
    constructor() {
        this.path = "/posts";
        this.router = express_1.Router();
        this.postRepository = typeorm_1.getRepository(post_entity_1.default);
        this.getAllPosts = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postRepository.find({ relations: ["categories"] });
            response.send(posts);
        });
        this.getPostById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const post = yield this.postRepository.findOne(id, { relations: ["categories"] });
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
            yield this.postRepository.update(id, postData);
            const updatedPost = yield this.postRepository.findOne(id);
            if (updatedPost) {
                response.send(updatedPost);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        });
        this.createPost = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const postData = request.body;
            const newPost = this.postRepository.create(Object.assign(Object.assign({}, postData), { author: request.user }));
            yield this.postRepository.save(newPost);
            response.send(newPost);
        });
        this.deletePost = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const successResponse = yield this.postRepository.delete(id);
            if (successResponse) {
                response.sendStatus(200);
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