import {Request, Response, NextFunction, Router} from 'express';
import IController from "../interfaces/controller.interface";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import {getRepository} from "typeorm";
import Post from "./post.entity";

class PostsController implements IController {
    public path = "/posts";
    public router = Router();
    private postRepository = getRepository(Post)

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private getAllPosts = async (request: Request, response: Response) => {
        const posts = await this.postRepository.find({relations: ["categories"]});
        response.send(posts);
    }

    private getPostById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const post = await this.postRepository.findOne(id, {relations: ["categories"]});
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        await this.postRepository.update(id, postData);
        const updatedPost = await this.postRepository.findOne(id);
        if (updatedPost) {
            response.send(updatedPost)
        } else {
            next(new PostNotFoundException(id));
        }

    }

    private createPost = async (request: IRequestWithUser, response: Response) => {
        const postData: CreatePostDto = request.body;
        const newPost = this.postRepository.create({
            ...postData,
            author: request.user,
        });
        await this.postRepository.save(newPost);
        response.send(newPost);
    }

    private deletePost = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.postRepository.delete(id);
        if (successResponse) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostsController
