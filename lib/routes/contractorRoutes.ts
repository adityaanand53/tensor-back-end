import { Request, Response } from "express";
import { ContractorController } from "../controllers/contractorController";

export class ContractorRoutes {

    public contractorController: ContractorController = new ContractorController()

    public routes(app): void {

        app.route('/api/contractors')
            .get(this.contractorController.getContractors)

        app.route('/api/addContractors')
            .post(this.contractorController.addContractors)

        app.route('/api/deleteContractors')
            .post(this.contractorController.deleteContractors)

     
    }
}