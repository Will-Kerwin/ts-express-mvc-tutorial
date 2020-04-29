"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class App {
    constructor(controllers) {
        this.app = express_1.default();
        this.connectToDatabase();
        this.initializeErrorHandling();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }
    // listen function creating server
    listen() {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            //log port number
            console.log(`Listening on port ${port}`);
        });
    }
    // initialises all middleware
    initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cookie_parser_1.default());
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    // initialises controllers
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    connectToDatabase() {
        //@ts-ignore
        const DatabaseURL = process.env.DATABASE_URL;
        mongoose_1.default.connect(DatabaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .catch(err => {
            console.log(`Database error ${err}`);
        });
        mongoose_1.default.connection.once("open", function () {
            console.log("connection Successful");
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map