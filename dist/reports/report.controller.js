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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const user_model_1 = __importDefault(require("../users/user.model"));
class ReportController {
    constructor() {
        this.path = "/report";
        this.router = express.Router();
        this.user = user_model_1.default;
        this.generateReport = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const usersByCountries = yield this.user.aggregate([
                {
                    $match: {
                        "address.country": {
                            $exists: true
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            country: "$address.country",
                        },
                        users: {
                            $push: {
                                name: '$name',
                                _id: '$_id',
                            },
                        },
                        count: {
                            $sum: 1,
                        }
                    },
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'users._id',
                        foreignField: 'author',
                        as: 'articles',
                    },
                },
                {
                    $addFields: {
                        amountOfArticles: {
                            $size: '$articles'
                        },
                    },
                },
                {
                    $sort: {
                        count: 1,
                    },
                }
            ]);
            res.send({ usersByCountries });
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.generateReport);
    }
}
exports.default = ReportController;
//# sourceMappingURL=report.controller.js.map