import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SiteSchema = new Schema({
    contractorId: {
        type: String,
    },
    siteId: {
        type: String,
    },
    matched: {
        type: String         
    },
    imageURL: {
        type: String            
    },
    lat_Long_True: {
        type: String  
    },
    lat_Long_Contractor: {
        type: String         
    },
    archived: {
        type: String
    },
    submittedOn: {
        type: Date
    },
    address: {
        type: String
    },
    locality: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    }
});