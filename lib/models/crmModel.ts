import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SiteSchema = new Schema({
    contractorId: {
        type: String,
    },
    siteId: {
        type: String,
    },
    location: {
        type: String            
    },
    matched: {
        type: Boolean         
    },
    imageURL: {
        type: String            
    },
    lat_Long_Contractor: {
        type: String         
    }
});