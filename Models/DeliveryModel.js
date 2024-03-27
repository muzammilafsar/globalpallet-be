var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var DeliverySchema = new Schema({
    day_number: {
        type: Number,
        unique: true,
        min: 1
    },
    key: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    total_collection: {
        type: String,
        default: ''
    },
    orders: {
        type: Number
    },
    success: {
        type: Number
    },
    cancel: {
        type: Number
    },
    deliveries: {
        type: [{
            boy: String,
            total_orders: {
                type: Number,
                default: 0
            },
            delivery_count: {
                type: Number,
                default: 0
            },
            cancelled: {
                type: Number,
                default: 0
            },
            assigned_orders: {
                type: Number,
                default: 0
            },
            total_collection: {
                type: Number,
                default: 0
            }
        }]
    }
});

DeliverySchema.plugin(AutoIncrement, {inc_field: 'day_number'});
module.exports = mongoose.model('Delivery', DeliverySchema);
