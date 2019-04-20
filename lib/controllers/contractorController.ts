import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { ContractorSchema } from '../models/contractorModel';

var ObjectId = require('mongoose').Types.ObjectId;

const Contractor = mongoose.model('Contractor', ContractorSchema);
export class ContractorController {


    public getContractors(req: Request, res: Response) {
        Contractor.find({ contractorId: { $exists: "true" } }, (err, contractorData) => {
            if (err) {
                res.send(err);
            }
            res.json(contractorData);
        });
    }

    public addContractors = async (req: Request, res: Response) => {
        let passcode: number;
        await this.generatePasscode().then(data => passcode = data);
        if (req.body.contractorId && req.body.name && passcode) {
            Contractor.create({ contractorId: req.body.contractorId, name: req.body.name, passcode: passcode }, (err, contractorData) => {
                if (err) {
                    res.send(err);
                }
                contractorData = Object.assign({}, contractorData._doc, { response: "success" });
                res.json(contractorData);
            });
        } else {
            let resp = !req.body.contractorId ? "Err: Contractor Id is required" : !req.body.name ? "Err: Name is required" : "Err: Contact database administrator";
            res.json({
                response: resp
            })
        }
    }

    public deleteContractors(req: Request, res: Response) {
        if (req.body.id) {
            Contractor.findByIdAndDelete({ _id: req.body.id }, (err, contractorData) => {
                if (err) {
                    res.send(err);
                }
                if (contractorData) {
                    res.json({
                        response: "success"
                    });
                } else {
                    res.json({
                        response: "Err: No contractor found"
                    });
                }
            });
        } else {
            res.json({
                response: "Err: Please provide the Id"
            });
        }
    }

    public async generatePasscode(): Promise<number> {
        let passcode = Math.floor(100000 + Math.random() * 900000);
        await Contractor.find({ contractorId: { $exists: "true" } }, (err, contractorData) => {
            if (err) {
                return new Promise(function (resolve, reject) { resolve(null) });
            }
            for (let i = 0; i < contractorData.length; i++) {
                if (contractorData[i].passcode && contractorData[i].passcode === passcode) {
                    this.generatePasscode().then(data => passcode = data);
                    break;
                }
            }
        });
        return new Promise(function (resolve, reject) { resolve(passcode) });
    }

}