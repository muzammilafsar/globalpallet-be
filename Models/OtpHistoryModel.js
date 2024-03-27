var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var OtpHistorySchema = new Schema({
    otp_no: {
        type: Number,
        unique: true,
        min: 1
    },
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    sendOtpCount: {
        type: Number,
        default: 1
    },
    verifyOtpCount: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    ordered: {
        type: Boolean,
        default: false
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

OtpHistorySchema.plugin(AutoIncrement, {inc_field: 'otp_no'});
module.exports = mongoose.model('OtpHistory', OtpHistorySchema);
