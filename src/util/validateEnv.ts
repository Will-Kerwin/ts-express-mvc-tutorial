import {cleanEnv, port, str} from "envalid"

export function validateEnv() {
    cleanEnv(process.env, {
        DATABASE_URL: str(),
        PORT: port(),
        JWT_SECRET: str()
    });
}

export default validateEnv
