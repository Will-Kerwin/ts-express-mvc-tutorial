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
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const address_entity_1 = __importDefault(require("./address.entity"));
class AddressController {
    constructor() {
        this.path = "/addresses";
        this.router = express_1.Router();
        this.addressRepository = typeorm_1.getRepository(address_entity_1.default);
        this.getAllAddresses = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const addresses = yield this.addressRepository.find();
            response.send(addresses);
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllAddresses);
    }
}
exports.default = AddressController;
//# sourceMappingURL=AddressController.js.map