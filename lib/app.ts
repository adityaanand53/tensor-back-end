import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";
import * as cors from "cors";
class App {

    public app: express.Application = express();
    public routePrv: Routes = new Routes();
    // public mongoUrl: string = 'mongodb://localhost/CRMdb';  
    public mongoUrl: string = 'mongodb://admin:admin123@ds157654.mlab.com:57654/dbravindra';

    constructor() {
        this.config();
        this.mongoSetup();
        this.routePrv.routes(this.app);
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
