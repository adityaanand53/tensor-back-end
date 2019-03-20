import * as mongoose from 'mongoose';
import { SiteSchema } from '../models/crmModel';
import { Request, Response } from 'express';

const Sites = mongoose.model('Sites', SiteSchema);

export class SitesController {

    // public addNewContact (req: Request, res: Response) {                
    //     let newContact = new Sites(req.body);

    //     newContact.save((err, contact) => {
    //         if(err){
    //             res.send(err);
    //         }    
    //         res.json(contact);
    //     });
    // }

    public getAllSites(req: Request, res: Response) {
        Sites.find({imageURL : { $exists : true }}, (err, site) => {
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