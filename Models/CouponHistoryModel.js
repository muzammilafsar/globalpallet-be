var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const AutoIncrement = require('mongoose-sequence')(mongoose);

var CouponHistory = new Schema({
    // coupon_history_id: {
    //     type: Number,
    //     unique: true,
    //     min: 1
    // },
    code: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    usedOn: {
        type: Date,
        default: Date.now()
    }
});

// CouponHistory.plugin(AutoIncrement, {inc_field: 'coupon_history_id'});
module.exports = mongoose.model('CouponHistory', CouponHistory);