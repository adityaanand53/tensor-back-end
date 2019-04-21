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
const ArchSites = mongoose.model('ArchivedSites', SiteSchema);

export class SitesController {
    // public getAllSites(req: Request, res: Response) {
    //     Sites.find({ siteId: { $exists: "true" } }, (err, site) => {
    //         if (err) {
    //             res.send(err);
    //         }
    //         for (let i = 0; i < site.length; i++) {
    //             if (site[i].location) {
    //                 site[i].address = site[i].location;
    //             }
    //         }

    //         res.json(site);
    //     });
    // }

    public getArchivedSites(req: Request, res: Response) {
        ArchSites.find({ siteId: { $exists: "true" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            for (let i = 0; i < site.length; i++) {
                if (site[i].location) {
                    site[i].address = site[i].location;
                }
            }
            res.json(site);
        });
    }

    public updateArchive(req: Request, res: Response) {
        if (req.body.id) {
            let idArr = req.body.id.split(",");
            // Sites.update({ _id: { $in: idArr } }, { $set: { archived: req.body.archived } }, { 'multi': true }, (err, site) => {
            //     if (err) {
            //         res.send(err);
            //     }
            //     res.json(site);
            // });
            Sites.findOne({ _id: idArr }, function (err, result) {
                if (err) {
                    res.send(err);
                }
                let swap = new (ArchSites)(result)
                swap._id = mongoose.Types.ObjectId()
                swap.isNew = true
                result.remove();
                swap.save();
                res.json(swap);
            })
        } else {
            res.json({
                response: "Err: Please provide the Id"
            });
        }
    }

    public getActiveSites(req: Request, res: Response) {
        Sites.find({ siteId: { $exists: "true" } }, (err, site) => {
            if (err) {
                res.send(err);
            }
            for (let i = 0; i < site.length; i++) {
                if (site[i].location) {
                    site[i].address = site[i].location;
                }
            }
            res.json(site);
        });
    }

    public createNewSite(req: Request, res: Response) {
        if (req.body.siteId && (req.body.address || req.body.lat_Long_True)) {
            Sites.create({
                contractorId: req.body.contractorId,
                siteId: req.body.siteId,
                address: req.body.address,
                matched: "false",
                lat_Long_True: req.body.lat_Long_True,
                lat_Long_Contractor: "",
                submittedOn: "",
            }, (err, site) => {
                if (err) {
                    res.send(err);
                }
                site = Object.assign({}, site, { response: 'success' })
                res.json(site);
            });
        } else {
            res.json({
                response: "Err: Provide missing information"
            });
        }
    }

    public updateSiteData(req: Request, res: Response) {
        if (req.body.id && (req.body.latLong || req.body.address) && req.body.cId) {
            Sites.update({ _id: req.body.id }, {
                $set: {
                    "lat_Long_True": req.body.latLong,
                    "address": req.body.address,
                    "contractorId": req.body.cId
                }
            }, (err, site) => {
                if (err) {
                    res.send(err);
                }
                res.json(site);
            });
        } else {
            res.json({
                response: "Err: Provide missing details"
            });
        }
    }

    // public updateAllSite(req: Request, res: Response) {
    //     Sites.update({ _id: req.body.id }, { $set: { "lat_Long_True": req.body.latLong, "location": req.body.siteName, "contractorId": req.body.cId } }, (err, site) => {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.json(site);
    //     });
    // }

    public async updateSite(req: Request, res: Response) {
        try {
            const imgPath: string[] = [];
            // for (let i = 0; i < req.files.length; i++) {
            //     imgPath.push(__dirname.replace("lib\\controllers", "") + 'uploads/' + req.files[i].filename);
            // }
            let imgs = JSON.parse(req.body.img);
            if (imgs.length > 0 && req.body.siteId && req.body.lat_Long_Contractor) {
                imgs.forEach(async (item, index) => {
                    console.log("1");
                    imgPath.push('uploads/_' + index + '_out.png');
                    await fs.writeFile("uploads/_" + index + "_out.png", item, 'base64', function (err) {
                        console.log(err);
                    });
                })
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
                                console.log('deleted', item);
                            });
                        })
                        let imgUrl = '';
                        for (let i = 0; i < imgData.length; i++) {
                            imgUrl += imgData.length === 1 ? imgData[i].url : imgData[i].url + ',';
                        }
                        Sites.update({ siteId: req.body.siteId }, { $set: { "lat_Long_Contractor": req.body.lat_Long_Contractor, "imageURL": imgUrl } }, (err, site) => {
                            if (err) {
                                res.send(err);
                            }
                            site = Object.assign({}, site, { responseCode: '200' })
                            res.json(site);
                        });
                    }
                ], function (err, imgData) {
                    if (err) res.send(err);
                });
            } else {
                let resp = !imgs.length ? "Err: No image found" : !req.body.siteId ? "Err: No site Id" : "Err: No location found";
                res.send({
                    response: resp
                })
            }
        } catch (err) {
            res.send(err);
        }
    }
}
