var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var DailySchema = new Schema({
    day_no: {
        type: Number,
        unique: true,
        min: 1
    },
    key: {
        type: String
    },  
    date: {
        type: String
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
    times: {
        type: [Date]
    },
    cancel_reason: {
        type: [{
            reason: String,
            count: Number
        }]
    }
});

DailySchema.plugin(AutoIncrement, {inc_field: 'day_no'});
module.exports = mongoose.model('Daily', DailySchema);
