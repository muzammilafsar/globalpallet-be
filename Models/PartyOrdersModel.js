var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var PartyOrderSchema = new Schema({
    party_id: {
        type: Number,
        unique: true,
        min: 1
    },
    event_name : 
    {
        type: String
    },
    amount_people : 
    {
        type: String
    },
    date : 
    {
        type: String
    },
    name : 
    {
        type: String
    },
    mobile : 
    {
        type: Number
    },
    comment : 
    {
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

PartyOrderSchema.plugin(AutoIncrement, {inc_field: 'party_id'});
module.exports = mongoose.model("PartyOrders", PartyOrderSchema);