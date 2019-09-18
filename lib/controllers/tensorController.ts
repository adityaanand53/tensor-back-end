import { Request, Response } from 'express';
import * as async from 'async';
import * as fs from 'fs';
import * as tf from "@tensorflow/tfjs-node";

export class TensorController {
    public getData = (req: Request, res: Response) => async.waterfall([
        function readFile(readFileCallback) {
            fs.readFile('training_data.csv', (err, data) => {
                const parsedData = data.toString() // convert Buffer to string
                    .split('\n') // split string to lines
                    .map(e => e.trim()) // remove white spaces for each line
                    .map(e => e.split(',').map(e => e.trim())); // split each line to array
                console.log('inside', parsedData);
                readFileCallback(null, JSON.stringify(parsedData));
            })
        },
        async function processFile(file, processFileCallback) {
            var data = JSON.parse(file);
            console.log(data)
            const model = createModel();
            const tensorData = convertToTensor(data);
            const { inputs, labels } = tensorData;

            await trainModel(model, inputs, labels);
            console.log("Done Training");

            const pred = testModel(model, data, tensorData);
            res.send(pred);
        }
    ], function (error) {
        if (error) {
            //handle readFile error or processFile error here
        }
    });
}

const createModel = () => {
    const model: tf.Sequential = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 50 }));
    model.add(tf.layers.dense({ units: 100, activation: 'sigmoid' }));
    model.add(tf.layers.dense({ units: 1, useBias: true, activation: 'sigmoid' }));

    return model;
}


const convertToTensor = (data) => {
    return tf.tidy(() => {
        data.shift()
        tf.util.shuffle(data);

        const inputs = data.map(d => Number(d[0]));
        const labels = data.map(d => Number(d[1]));
console.log("inputs", inputs)
console.log("labels", labels)
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor
            .sub(inputMin)
            .div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor
            .sub(labelMin)
            .div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            inputMax,
            inputMin,
            labelMax,
            labelMin
        };
    });
}



const trainModel = async (model, inputs, labels) => {
    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: tf.losses.meanSquaredError,
        metrics: ["mse"]
    });

    const batchSize = 32;
    const epochs = 30;

    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        // callbacks: tfvis.show.fitCallbacks(
        //     { name: "Training Performance" },
        //     ["loss", "mse"],
        //     { height: 200, callbacks: ["onEpochEnd"] }
        // )
    });
}
const testModel = (model, inputData, normalizationData) => {
    const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

    const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0, 1, 100);
        const preds = model.predict(xs.reshape([100, 1]));

        const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);

        const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);

        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    return preds;
}

// private getData = async () => {
//     const csv = await Papa.parsePromise(
//       "https://docs.google.com/spreadsheets/d/1C947mrOPa2JvFIXOhR8_8jN7-TsE1MWzEF_h3gdMJs4/export?format=csv"
//     );
//     const cleaned = csv.data
//       .map(car => ({
//         cars: car.cars,
//         time: car.time
//       }))
//       .filter(car => car.cars != null && car.time != null);


//     return cleaned;
//   }


//   private run = async () => {
//     // Load and plot the original input data that we are going to train on.
//     const data = await this.getData();

//     const model = this.createModel();
//     // tfvis.show.modelSummary({ name: "Model Summary" }, model);

//     const tensorData = this.convertToTensor(data);
//     const { inputs, labels } = tensorData;

//     // Train the model
//     await this.trainModel(model, inputs, labels);
//     console.log("Done Training");

//     this.testModel(model, data, tensorData);
//     // More code will be added below
//   }

