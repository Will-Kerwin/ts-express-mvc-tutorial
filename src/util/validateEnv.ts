import {cleanEnv, port, str} from "envalid"

export default function validateEnv() {
    cleanEnv(process.env, {
        DATABASE_URL: str(),
        PORT: port(),
        JWT_SECRET: str()
    });
}
