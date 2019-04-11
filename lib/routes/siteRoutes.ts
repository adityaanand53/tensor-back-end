import { Request, Response } from "express";
import { SitesController } from "../controllers/siteController";
import { ContractorController } from "../controllers/contractorController";

export class SiteRoutes {

    public sitesController: SitesController = new SitesController()

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
            .post(this.sitesController.updateArchive)

        app.route('/createNewSite')
            .post(this.sitesController.createNewSite)

        app.route('/updateSiteData')
            .post(this.sitesController.updateSiteData)

        app.route('/updateSite')
            .post(this.sitesController.updateAllSite)

        app.route('/app/updateSite')
            .post(this.sitesController.updateSite)
    }
}