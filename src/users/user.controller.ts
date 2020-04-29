import express from "express";
import IController from "../interfaces/controller.interface";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import postModel from "../posts/posts.model";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";


class UserController implements IController {
    public path = "/users";
    public router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
    }

    private getAllPostsOfUser = async (req: IRequestWithUser, res: express.Response, next: express.NextFunction) => {
        const userId = req.params.id;
        //@ts-ignore
        const reqUserID = req.user._id;
        if (userId === reqUserID.toString()){
            const posts = await this.post.find({author: userId});
            res.send(posts);
        }
        next(new NotAuthorizedException());
    }
}
export default UserController
