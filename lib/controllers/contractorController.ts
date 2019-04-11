import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { ContractorSchema } from '../models/contractorModel';

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

}