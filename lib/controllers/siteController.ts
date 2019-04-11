import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { SiteSchema } from '../models/siteModel';

const Sites = mongoose.model('Sites', SiteSchema);
export class SitesController {

    public getAllSites(req: Request, res: Response) {
        Sites.find({ archived: { $exists: "true" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public getArchivedSites(req: Request, res: Response) {
        Sites.find({ archived: true }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public updateArchive(req: Request, res: Response) {
        let idArr = req.body.id.split(",");
        Sites.update({ _id: { $in: idArr } }, { $set: { archived: req.body.archived }}, {'multi': true }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public getActiveSites(req: Request, res: Response) {
        Sites.find({ archived: { $eq: "false" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public createNewSite(req: Request, res: Response) {

        Sites.create({ 
            contractorId: req.body.contractorId, 
            siteId: req.body.siteId, 
            address: req.body.address, 
            locality: req.body.locality,
            city: req.body.city,
            state: req.body.state,
            matched: "false", 
            lat_Long_True: req.body.lat_Long_True, 
            lat_Long_Contractor: "",  
            submittedOn: "",  
            archived: "false", 
        }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }
    public updateSiteData(req: Request, res: Response) {
        Sites.update({ _id: req.body.id }, { 
                        $set: {"lat_Long_True": req.body.latLong, 
                               "address": req.body.address, 
                               "locality": req.body.locality, 
                               "city": req.body.city, 
                               "state": req.body.state, 
                               "contractorId": req.body.cId}}, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public updateAllSite(req: Request, res: Response) {
        Sites.update({ _id: req.body.id }, { $set: {"lat_Long_True": req.body.latLong, "location": req.body.siteName, "contractorId": req.body.cId}}, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public updateSite(req: Request, res: Response) {
        Sites.update({ siteId: req.body.siteId }, { $set: {"lat_Long_Contractor": req.body.latLong, "imageURL": req.body.imageURL}}, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }
}