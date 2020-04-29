import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose"
import IController from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";

class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.connectToDatabase()
        this.initializeErrorHandling()
        this.initializeMiddleware()
        this.initializeControllers(controllers)
    }

    // listen function creating server
    public listen() {
        const port = process.env.PORT
        this.app.listen(port, () => {
            //log port number
            console.log(`Listening on port ${port}`)
        })
    }

    // initialises all middleware
    private initializeMiddleware() {
        this.app.use(bodyParser.json())
        this.app.use(cookieParser())
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }

    // initialises controllers
    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private connectToDatabase() {
        //@ts-ignore
        const DatabaseURL: string = process.env.DATABASE_URL

        mongoose.connect(DatabaseURL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .catch(err => {
                console.log(`Database error ${err}`)
            })
        mongoose.connection.once("open", function () {
            console.log("connection Successful")
        })
    }

}

export default App
