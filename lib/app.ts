import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as fs from 'fs';

import { SiteRoutes } from "./routes/siteRoutes";
import { ContractorRoutes } from "./routes/contractorRoutes";
import { MongoDBConfig } from './constants';


export const cloudinary = require('cloudinary').v2;
import { CloudinaryConfig } from './constants'

// var fs = require('fs');


cloudinary.config({
    cloud_name: CloudinaryConfig.CLOUD_NAME,
    api_key: CloudinaryConfig.API_KEY,
    api_secret: CloudinaryConfig.API_SECRET
});

class App {

    public app: express.Application = express();
    public routeS: SiteRoutes = new SiteRoutes();
    public routeC: ContractorRoutes = new ContractorRoutes();
    public mongoUrl: string = `mongodb://${MongoDBConfig.USERID}:${MongoDBConfig.PASSWORD}@ds157654.mlab.com:${MongoDBConfig.PORT}/${MongoDBConfig.DB_NAME}`;

    constructor() {
        this.config();
        this.mongoSetup();
        this.routeS.routes(this.app);
        this.routeC.routes(this.app);

    }

    private config(): void {
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 100000 }));
        this.app.use(cors({credentials: true, origin: true}))
        this.app.use(express.static('public'));

        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });

        const connection = mongoose.connection;
        connection.once('open', () => {
            console.log('MongoDB database connection established successfully!');
        });
    }
}

export default new App().app;
