var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var BusinessSchema = new Schema({
    business_reset_id: {
        type: Number,
        unique: true,
        min: 1
    },
    key: {
        type: String
    },  
    from: {
        type: String
    },
    till: {
        type: String,
    },
    opening: {
        type: Date,
        default: Date.now
    },
    orders: {
        type: Number
    },
    success: {
        type: Number
    },
    cancelled: {
        type: Number
    },
    revenue: {
        type: Number
    },
    delivery: {
        type: Number
    },
    coupon: {
        type: Number
    },
    bit: {
        type: Number
    },
    items: {
        type: Number
    },
    time_taken: {
        type: [Number]
    },
    time_taken_avg: {
        type: Number
    },
    delivered_by: {
        type: [{
            name: String,
            count: Number
        }]
    },
    platform : {
        ios: {
            type: Number
        },
        android: {
            type: Number
        },
        web: {
            type: Number
        },
    },
    productList: {
        type: [{
            id: String,
            name: String,
            count: Number
        }]
    },
    couponList: {
        type: [{
            code: String,
            count: Number
        }]
    },
    localityList: {
        type: [{
            name: String,
            count: Number
        }]
    },
    cancel_reason: {
        type: [{
            reason: String,
            count: Number
        }]
    }
});

BusinessSchema.plugin(AutoIncrement, {inc_field: 'business_reset_id'});
module.exports = mongoose.model('Business', BusinessSchema);
