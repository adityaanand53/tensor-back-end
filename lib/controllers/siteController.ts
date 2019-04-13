import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as async from 'async';
import * as fs from 'fs';

import { SiteSchema } from '../models/siteModel';
import { cloudinary } from '../app';

const Sites = mongoose.model('Sites', SiteSchema);
export class SitesController {
    public getAllSites(req: Request, res: Response) {
        Sites.find({ archived: { $exists: "true" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            res.json(site);
        });
    }

    public getArchivedSites(req: Request, res: Response) {
        Sites.find({ archived: true }, (err, site) => {
            if (err) {
                res.send(err);
            }
            res.json(site);
        });
    }

    public updateArchive(req: Request, res: Response) {
        let idArr = req.body.id.split(",");
        Sites.update({ _id: { $in: idArr } }, { $set: { archived: req.body.archived } }, { 'multi': true }, (err, site) => {
            if (err) {
                res.send(err);
            }
            res.json(site);
        });
    }

    public getActiveSites(req: Request, res: Response) {
        Sites.find({ archived: { $eq: "false" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
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
            res.json(site);
        });
    }
    public updateSiteData(req: Request, res: Response) {
        Sites.update({ _id: req.body.id }, {
            $set: {
                "lat_Long_True": req.body.latLong,
                "address": req.body.address,
                "locality": req.body.locality,
                "city": req.body.city,
                "state": req.body.state,
                "contractorId": req.body.cId
            }
        }, (err, site) => {
            if (err) {
                res.send(err);
            }
            res.json(site);
        });
    }

    public updateAllSite(req: Request, res: Response) {
        Sites.update({ _id: req.body.id }, { $set: { "lat_Long_True": req.body.latLong, "location": req.body.siteName, "contractorId": req.body.cId } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            res.json(site);
        });
    }

    public updateSite(req: Request, res: Response) {
        const imgPath = __dirname.replace("lib\\controllers", "") + 'uploads/' + req.file.filename;
        async.waterfall([
            function (callback) {
                cloudinary.uploader.upload(imgPath, { resource_type: 'image' }).then(function (imgData) {
                    console.log('** file uploaded to Cloudinary service', imgData);
                    callback(null, imgData);
                });
            },
            function (imgData, callback) {
                fs.unlink(imgPath, function() {
                    callback(null, imgData);
                });
            }
        ], function (err, imgData) {
            Sites.update({ siteId: req.body.siteId }, { $set: { "lat_Long_Contractor": req.body.latLong, "imageURL": imgData.url } }, (err, site) => {
                if (err) {
                    res.send(err);
                }
                res.json(site);
            });
        });
    }
}
