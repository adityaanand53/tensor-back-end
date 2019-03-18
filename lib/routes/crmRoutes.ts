import {Request, Response, NextFunction} from "express";
import { SitesController } from "../controllers/crmController";

export class Routes { 
    
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
     

    }
}