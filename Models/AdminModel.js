var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    description: {
        type: String,
        default: ''
    },
    designation: {
        type: String
    },
    mobile: {
        type: String
    },
    deliveries: {
        type: Number,
        default: 0
    },
    cancellations: {
        type: Number,
        default: 0
    },
    orders_assigned: {
        type: Number,
        default: 0
    },
    delivers: {
        type: Boolean,
        default: true
    },
    photograph: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Admin', AdminSchema);
