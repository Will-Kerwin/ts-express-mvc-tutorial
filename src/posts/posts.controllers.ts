import { Request, Response, NextFunction, Router } from 'express';
import IController from "../interfaces/controller.interface";
import IPost from "./posts.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import IRequestWithUser from "../interfaces/requestWithUser.interface";

class PostsController implements IController {
    public path = "/posts";
    public router = Router();
    private post = postModel;

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private getAllPosts = async (request: Request, response: Response) => {
        const posts = await this.post.find()
            .populate('author', '-password');
        response.send(posts);
    }

    private getPostById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const post = await this.post.findById(id);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const postData: IPost = request.body;
        const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private createPost = async (request: IRequestWithUser, response: Response) => {
        const postData: CreatePostDto = request.body;
        //@ts-ignore
        const {_id} = request.user
        const createdPost = new this.post({
            ...postData,
            author: _id,
        });
        const savedPost = await createdPost.save();
        await savedPost.populate("author", "-password").execPopulate();
        response.send(savedPost);
    }

    private deletePost = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostsController
