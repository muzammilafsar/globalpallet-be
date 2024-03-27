var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var FeedbackSchema = new Schema({
    feedback_no: {
        type: Number,
        unique: true,
        min: 1
    },
    order_special_id : {
        type: Number
    },
    mobile : {
        type: String
    },
    name : {
        type: String
    },
    rating : {
        overall: {
            type: Number,
            default: 0
        },
        behavior: {
            type: Number,
            default: 0
        },
        packaging: {
            type: Number,
            default: 0
        },
        timely: {
            type: Number,
            default: 0
        },
    },
    comment : {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

FeedbackSchema.plugin(AutoIncrement, {inc_field: 'feedback_no'});
module.exports = mongoose.model("Feedback", FeedbackSchema);
