import AddressController from "./address/AddressController";
import 'reflect-metadata';
import App from "./app";
import PostsController from "./posts/posts.controllers";
import validateEnv from "./util/validateEnv";
import {createConnection} from "typeorm";
import config from "./ormconfig";
import AuthenticationController from "./authentication/authentication.controller";
require("dotenv").config();

validateEnv();

(async () => {
    try {
        await createConnection(config);
    } catch (e) {
        console.log("Error while connnecting to the database:", e);
        return e;
    }
    const app = new App(
        [
            new PostsController(),
            new AddressController(),
            new AuthenticationController()
        ],
    );
    app.listen();
})();
