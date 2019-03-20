import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ContractorSchema = new Schema({

    contractorId: {
        type: String,
    },
    name: {
        type: String,
    }

});