import { Request, Response } from "express";
import { SitesController } from "../controllers/siteController";
import * as multer from 'multer';
import * as passport from 'passport';
import * as  jwt from 'jsonwebtoken';

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

        app.route('/api/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        app.route('/api/sites')
            .get(this.sitesController.getAllSites)

        app.route('/api/activeSites')
            .get(this.sitesController.getActiveSites)

        app.route('/api/archivedSites')
            .get(this.sitesController.getArchivedSites)

        app.route('/api/updateArchive')
            .post(this.sitesController.updateArchive)

        app.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
            res.json({ 
              message : 'Signup successful',
              user : req.user 
            });
          });

          app.post('/login', async (req, res, next) => {
            passport.authenticate('login', async (err, user, info) => {     try {
                if(err || !user){
                  const error = new Error('An Error occured')
                  return next(error);
                }
                req.login(user, { session : false }, async (error) => {
                  if( error ) return next(error)
                  //We don't want to store the sensitive information such as the
                  //user password in the token so we pick only the email and id
                  const body = { _id : user._id, email : user.email };
                  //Sign the JWT token and populate the payload with the user email and id
                  const token = jwt.sign({ user : body },'top_secret');
                  //Send back the token to the user
                  return res.json({ token });
                });     } catch (error) {
                return next(error);
              }
            })(req, res, next);
          });


        app.route('/api/createNewSite')
            .post(this.sitesController.createNewSite)

        app.route('/api/updateSiteData')
            .post(this.sitesController.updateSiteData)

        app.route('/api/updateSite')
            .post(this.sitesController.updateAllSite)

        app.post('/api/app/updateSite', upload.array('image', 5), this.sitesController.updateSite)
    }
}
