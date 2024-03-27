var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var CouponSchema = new Schema({
    coupon_number: {
        type: Number,
        unique: true,
        min: 1
    },
    name: {
        type: String,
    },
    code: {
        type: String,
        unique: true
    },
    amount: {
        type: Number
    },
    enable: {
        type: Boolean,
        default: false
    },
    details: {
        type: String
    },
    date_of_creation: {
        type: Date,
        default: Date.now()
    },
    validity: {
        type: Date
    },
    times_valid_per_user: {
        type: Number,
        default: 1
    },
    first_order_only: {
        type: Boolean,
        default: false
    },
    valid_once: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },  
    min_order_value: {
        type: Number,
        default: 10
    },
    min_order_applicable: {
        type: Number
    },
    percent: {
        type: Number
    },
    goldMember: {
        type: Boolean,
        default: false
    },
    index: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    show: {
        type: String
    }
});

CouponSchema.plugin(AutoIncrement, {inc_field: 'coupon_number'});
module.exports = mongoose.model('Coupons', CouponSchema);