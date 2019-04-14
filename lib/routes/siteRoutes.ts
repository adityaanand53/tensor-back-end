import { Request, Response } from "express";
import { SitesController } from "../controllers/siteController";
import * as multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
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

        app.post('/app/updateSite', upload.array('image', 5), this.sitesController.updateSite)
    }
}
