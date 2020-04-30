import IController from "../interfaces/controller.interface";
import {Router, Request, Response, NextFunction} from "express";
import {getRepository} from "typeorm";
import Category from "./category.entity";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import CreateCategoryDto from "./category.dto";
import validationMiddleware from "../middleware/validation.middleware";


class CategoryController implements IController {
    public path = "/categories"
    public router = Router();
    private categoryRepository = getRepository(Category);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllCategories);
        this.router.get(`${this.path}/:id`, this.getCategoryById);
        this.router.post(this.path, validationMiddleware(CreateCategoryDto), this.createCategory)
    }

    private getAllCategories = async (request: Request, response: Response) => {
        const categories = await this.categoryRepository.find({ relations: ['posts'] });
        response.send(categories);
    }

    private getCategoryById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const category = await this.categoryRepository.findOne(id, { relations: ['posts'] });
        if (category) {
            response.send(category);
        } else {
            next(new CategoryNotFoundException(id));
        }
    }

    private createCategory = async (request: Request, response: Response, next: NextFunction) => {
        const categoryData: CreateCategoryDto = request.body;
        const newCategory = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(newCategory);
        response.send(newCategory)
    }
}
