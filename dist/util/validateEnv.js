"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    envalid_1.cleanEnv(process.env, {
        DATABASE_URL: envalid_1.str(),
        PORT: envalid_1.port(),
        JWT_SECRET: envalid_1.str()
    });
}
exports.default = validateEnv;
//# sourceMappingURL=validateEnv.js.map