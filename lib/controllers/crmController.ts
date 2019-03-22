import * as mongoose from 'mongoose';
import { SiteSchema } from '../models/crmModel';
import { ContractorSchema } from '../models/contractorModel';
import { Request, Response } from 'express';

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
        Sites.create({ contractorId: req.body.contractorId, siteId: req.body.siteId, location: req.body.location, matched: "false", lat_Long_True: req.body.lat_Long_True, lat_Long_Contractor: "",  submittedOn: "",  archived: "false", }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }
    public updateSiteData(req: Request, res: Response) {
        Sites.update({ _id: req.body.id }, { $set: {"lat_Long_True": req.body.latLong, "location": req.body.siteName, "contractorId": req.body.cId}}, (err, site) => {
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
    // public getContactWithID (req: Request, res: Response) {           
    //     Sites.findById(req.params.contactId, (err, contact) => {
    //         if(err){
    //             res.send(err);
    //         }
    //         res.json(contact);
    //     });
    // }

    // public updateContact (req: Request, res: Response) {           
    //     Sites.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
    //         if(err){
    //             res.send(err);
    //         }
    //         res.json(contact);
    //     });
    // }

    // public deleteContact (req: Request, res: Response) {           
    //     Sites.remove({ _id: req.params.contactId }, (err, contact) => {
    //         if(err){
    //             res.send(err);
    //         }
    //         res.json({ message: 'Successfully deleted contact!'});
    //     });
    // }

}