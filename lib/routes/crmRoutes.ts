import { Request, Response, NextFunction } from "express";
import { SitesController } from "../controllers/crmController";
import { ContractorController } from "../controllers/contractorController";

export class Routes {

    public sitesController: SitesController = new SitesController()
    public contractorController: ContractorController = new ContractorController()

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        app.route('/sites')
            .get(this.sitesController.getAllSites)

        app.route('/activeSites')
            .get(this.sitesController.getActiveSites)

        app.route('/archivedSites')
            .get(this.sitesController.getArchivedSites)

        app.route('/updateArchive')
            .put(this.sitesController.updateArchive)

        app.route('/contractors')
            .get(this.contractorController.getContractors)

        app.route('/addContractors')
            .put(this.contractorController.addContractors)

        app.route('/deleteContractors')
            .post(this.contractorController.deleteContractors)

        app.route('/createNewSite')
            .post(this.sitesController.createNewSite)

    }
}