import {Router, Request, Response} from "express";
import {getRepository} from "typeorm";
import IController from "../interfaces/controller.interface";
import Address from "./address.entity";

class AddressController implements IController {
    public path = "/addresses";
    public router = Router();
    private addressRepository = getRepository(Address);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get(this.path, this.getAllAddresses);
    }

    private getAllAddresses = async (request: Request, response: Response) => {
        const addresses = await this.addressRepository.find();
        response.send(addresses);
    }

}

export default AddressController;
