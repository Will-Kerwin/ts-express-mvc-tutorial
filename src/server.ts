import ReportController from "./reports/report.controller";

require("dotenv").config();
import App from "./app";
import PostsController from "./posts/posts.controllers";
import {validateEnv} from "./util/validateEnv";
import UserController from "./users/user.controller";
import AuthenticationController from "./authentication/authentication.controller";

validateEnv()

const app = new App(
    [
        new PostsController(),
        new AuthenticationController(),
        new UserController(),
        new ReportController()
    ]
);

app.listen()
