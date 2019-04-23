import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as async from 'async';
import * as fs from 'fs';
import * as imagemin from 'imagemin';
import * as imageminMozjpeg from 'imagemin-mozjpeg';
const imageminPngquant = require('imagemin-pngquant');

import { SiteSchema } from '../models/siteModel';
import { ContractorSchema } from '../models/contractorModel';
import { cloudinary } from '../app';

const Sites = mongoose.model('Sites', SiteSchema);
const ArchSites = mongoose.model('ArchivedSites', SiteSchema);
const Contractor = mongoose.model('Contractor', ContractorSchema);

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

            async.waterfall([
                function (callback) {
                    const newArr = [];
                    idArr.forEach((id, index) => {
                        let TargetSite = Sites;
                        let SourceSite = ArchSites;
                        req.body.archived === 'true' ? SourceSite = Sites : SourceSite = ArchSites;
                        req.body.archived === 'true' ? TargetSite = ArchSites : TargetSite = Sites;
                        SourceSite.findOne({ _id: id.trim() }, function (err, result) {
                            if (err) {
                                console.log("err", err)
                                res.send(err);
                            }
                            if (result) {
                                let swap = new (TargetSite)(result)
                                swap._id = mongoose.Types.ObjectId()
                                swap.isNew = true
                                result.remove();
                                swap.save();
                                newArr.push(swap);
                            }
                            if (index === idArr.length - 1) {
                                callback(null, newArr)
                            }
                        });
                    });
                },
                function (newArr, callback) {
                    if (newArr.length > 0) {
                        res.json(newArr);
                    } else {
                        res.json({ response: "Err: No site found" });
                    }
                }
            ], function (err, imgData) {
                if (err) res.send(err);
            });
        } else {
            res.json({
                response: "Err: Please provide the Id"
            });
        }
    }

    // public removeArchive(req: Request, res: Response) {
    //     if (req.body.id) {
    //         let idArr = req.body.id.split(",");
    //         const newArr = [];
    //         idArr.forEach(id => {
    //             console.log(id.trim());

    //             ArchSites.findOne({ _id: id.trim() }, function (err, result) {
    //                 if (err) {
    //                     res.send(err);
    //                 }
    //                 if (result) {
    //                     let swap = new (Sites)(result)
    //                     swap._id = mongoose.Types.ObjectId()
    //                     swap.isNew = true
    //                     result.remove();
    //                     swap.save();
    //                     newArr.push(swap);
    //                 }
    //             });
    //         });
    //         if (newArr.length > 0) {
    //             res.json(newArr);
    //         } else {
    //             res.json({ response: "Err: No site found" });
    //         }
    //     } else {
    //         res.json({
    //             response: "Err: Please provide the Id"
    //         });
    //     }
    // }

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
                status: "pending"
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
    public getSiteData(req: Request, res: Response) {
        let contractorID = req.body.contractorId;
        let passcode = Number(req.body.passcode);
        async.waterfall([
            function (callback) {
                Contractor.find({ contractorId: contractorID }, (err, contractorData) => {
                    if (err) {
                        res.send(err);
                    }
                    if (!contractorData){
                        res.send({response: "invalid contractorId"});
                    }
                    callback(null, contractorData)
                });
            },
            function (contractorData, callback) {
                if (Number(contractorData[0].passcode) === passcode) {
                    Sites.find({ contractorId: { $eq: contractorID }, status: { $eq: "pending" } }, (err, site) => {
                        if (err) {
                            res.send(err);
                        }
                        res.json(site);
                    });
                } else {
                    res.json({ response: "incorrect passcode" });
                }
            }
        ], function (err, imgData) {
            if (err) res.send(err);
        });


    }
    public async updateSite(req: Request, res: Response) {
        try {
            const imgPath: string[] = [];
            // for (let i = 0; i < req.files.length; i++) {
            //     imgPath.push(__dirname.replace("lib\\controllers", "") + 'uploads/' + req.files[i].filename);
            // }
            let imgs = JSON.parse(req.body.img);
            const d = new Date();
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
                        Sites.update({ siteId: req.body.siteId }, { $set: { "lat_Long_Contractor": req.body.lat_Long_Contractor, "imageURL": imgUrl, "submittedOn": d.toDateString(), status: "submitted" } }, (err, site) => {
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

    public setApproved(req: Request, res: Response) {
        Sites.update({ _id: req.body.id }, {
            $set: {
                "status": req.body.status,
            }
        }, (err, site) => {
            if (err) {
                res.send(err);
            }
            res.json(site);
        });
    }
}
