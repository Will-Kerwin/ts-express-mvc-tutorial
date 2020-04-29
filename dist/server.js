"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_controller_1 = __importDefault(require("./authentication/authentication.controller"));
require("dotenv").config();
const app_1 = __importDefault(require("./app"));
const posts_controllers_1 = __importDefault(require("./posts/posts.controllers"));
const validateEnv_1 = require("./util/validateEnv");
validateEnv_1.validateEnv();
const app = new app_1.default([
    new posts_controllers_1.default(),
    new authentication_controller_1.default()
]);
app.listen();
//# sourceMappingURL=server.js.map