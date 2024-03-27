var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var CustomerContactSchema = new Schema({
    issue_number: {
        type: Number,
        unique: true,
        min: 1
    },
    Order_id : {
        type: String
    },
    subject : {
        type: String
    },
    name : {
        type: String
    },
    mobile : {
        type: Number
    },
    comment : {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    resolved: {
        type: Boolean,
        default: false
    },
    resolved_time: {
        type: Date
    }
});

CustomerContactSchema.plugin(AutoIncrement, {inc_field: 'issue_number'});
module.exports = mongoose.model("CustomerContacts", CustomerContactSchema);
