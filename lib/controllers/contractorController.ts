import * as mongoose from 'mongoose';
import { ContractorSchema } from '../models/contractorModel';
import { Request, Response } from 'express';
var ObjectId = require('mongoose').Types.ObjectId;

const Contractor = mongoose.model('Contractor', ContractorSchema);
export class ContractorController {


    public getContractors(req: Request, res: Response) {
        Contractor.find({ contractorId: { $exists: "true" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public addContractors(req: Request, res: Response) {
        console.log("gdfgnlkn............", req.body.name, req.body.contractorId)
        Contractor.create({ contractorId: req.body.contractorId, name: req.body.name }, (err, site) => {
            if (err) {
                res.send(err);
            }
            console.log(site);
            res.json(site);
        });
    }

    public deleteContractors(req: Request, res: Response) {

        console.log("...........id", req.body.id);
        Contractor.findByIdAndDelete({ _id: req.body.id }, (err, site) => {
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