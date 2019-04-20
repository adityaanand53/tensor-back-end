import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ContractorSchema = new Schema({

    contractorId: {
        type: Number,
    },
    name: {
        type: String,
    },
    passcode: {
        type: Number
    }

});