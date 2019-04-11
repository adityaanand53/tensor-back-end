import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";

import { SiteRoutes } from "./routes/siteRoutes";
import { ContractorRoutes } from "./routes/contractorRoutes";
import { MongoDBConfig } from './constants';

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
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        this.app.use(cors())
        this.app.use(express.static('public'));
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
