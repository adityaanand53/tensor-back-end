import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as async from 'async';
import * as fs from 'fs';
import * as imagemin from 'imagemin';
import * as imageminMozjpeg from 'imagemin-mozjpeg';
const imageminPngquant = require('imagemin-pngquant');

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

    public async updateSite(req: Request, res: Response) {
        const imgPath: string[] = [];
        // for (let i = 0; i < req.files.length; i++) {
        //     imgPath.push(__dirname.replace("lib\\controllers", "") + 'uploads/' + req.files[i].filename);
        // }

        await fs.writeFile(__dirname.replace("lib\\controllers", "") + "uploads/out.png", req.body.img, 'base64', function (err) {
            console.log(err);
        });

        async.waterfall([
            async function (callback) {
                const files = await imagemin(imgPath, 'uploads', {
                    plugins: [
                        imageminMozjpeg({ quality: 50 }),
                        imageminPngquant({ quality: [0.5, 0.8] })
                    ]
                });
                const imgData = [];
                for (let i = 0; i < imgPath.length; i++) {
                    cloudinary.image(imgPath[i], { width: 385, crop: "scale" });
                    await cloudinary.uploader.upload(imgPath[i], { resource_type: 'image' }).then(function (img) {
                        imgData.push(img);
                    });
                    if (i === imgPath.length - 1) {
                        callback(null, imgData);
                    }
                }
            },
            function (imgData, callback) {
                imgPath.forEach(item => {
                    fs.unlink(item, function () {
                        console.log('deleted...............', item);
                    });
                })
                let imgUrl = '';
                for (let i = 0; i < imgData.length; i++) {
                    imgUrl += imgData.length === 1 ? imgData[i].url : imgData[i].url + ',';
                }

                Sites.update({ siteId: req.body.siteId }, { $set: { "lat_Long_Contractor": req.body.lat_Long_True, "imageURL": imgUrl } }, (err, site) => {
                    if (err) {
                        res.send(err);
                    }
                    res.json(site);
                });
            }
        ], function (err, imgData) {
            if (err) throw res.send(err);
        });
    }
}
