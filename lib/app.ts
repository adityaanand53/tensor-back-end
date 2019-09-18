import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { TensorRoutes } from "./routes/tensorRoutes";

class App {
    public app: express.Application = express();
    public routeS: TensorRoutes = new TensorRoutes();

    constructor() {
        this.config();
        this.routeS.routes(this.app);
    }

    private config(): void {
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 100000 }));
        this.app.use(cors({ credentials: true, origin: true }))
        this.app.use(express.static('public'));
    }
}

export default new App().app;
