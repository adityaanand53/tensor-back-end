import { Request, Response } from "express";
import { TensorController } from "../controllers/tensorController";

export class TensorRoutes {

    public sitesController: TensorController = new TensorController()

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        app.route('/process')
            .get(this.sitesController.getData)

    }
}
