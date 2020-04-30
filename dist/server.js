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
const AddressController_1 = __importDefault(require("./address/AddressController"));
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const posts_controllers_1 = __importDefault(require("./posts/posts.controllers"));
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const typeorm_1 = require("typeorm");
const ormconfig_1 = __importDefault(require("./ormconfig"));
require("dotenv").config();
validateEnv_1.default();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield typeorm_1.createConnection(ormconfig_1.default);
    }
    catch (e) {
        console.log("Error while connnecting to the database:", e);
        return e;
    }
    const app = new app_1.default([
        new posts_controllers_1.default(),
        new AddressController_1.default(),
    ]);
    app.listen();
}))();
//# sourceMappingURL=server.js.map