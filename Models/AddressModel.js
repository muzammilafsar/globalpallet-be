var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    address_id: {
        type: Number,
        unique: true,
        min: 1
    },
    user: {
        type: String,
        required: true
    },
    added_on: {
        type: Date,
        default: Date.now()
    },
    address: {
        title: {
            type: String,
            default: ''
        },
        first_name: {
            type: String
        },
        mobile: {
            type: String
        },
        pincode: {
            type: String
        },
        locality: {
            type: String
        },
        address: {
            type: String
        },
        address2: {
            type: String
        },
        city: {
            type: String,
        },
        state: {
            type: String
        },
        landmark: {
            type:String
        },
        alt_mobile: {
            type: String
        },
        contact: {
            type: String
        }
    }
});

AddressSchema.plugin(AutoIncrement, {inc_field: 'address_id'});
module.exports = mongoose.model('Address', AddressSchema);
