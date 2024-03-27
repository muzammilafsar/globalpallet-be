var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CancelReasonSchema = new Schema({
    key: {
        type: String,
        unique: true,
        required: true,
    },
    reason: {
        type: String
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    user_access: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('CancelReason', CancelReasonSchema);
