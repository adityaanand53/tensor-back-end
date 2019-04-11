import { Request, Response } from "express";
import { ContractorController } from "../controllers/contractorController";

export class ContractorRoutes {

    public contractorController: ContractorController = new ContractorController()

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        app.route('/contractors')
            .get(this.contractorController.getContractors)

        app.route('/addContractors')
            .post(this.contractorController.addContractors)

        app.route('/deleteContractors')
            .post(this.contractorController.deleteContractors)

     
    }
}