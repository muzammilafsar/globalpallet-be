var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var OffersSchema = new Schema({
    offer_id: {
        type: Number,
        unique: true,
        min: 1
    },
    image: {
        type: String,
        default: ''
    },
    image_web: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: false
    },
    description: {
        type: [String]
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    coupon_code: {
        type: String
    },
    index: {
        type: Number
    },
    goldMember: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

OffersSchema.plugin(AutoIncrement, {inc_field: 'offer_id'});
module.exports = mongoose.model('Offer', OffersSchema);