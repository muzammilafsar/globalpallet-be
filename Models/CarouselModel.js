var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var CarouselSchema = new Schema({
    carousel_id: {
        type: Number,
        unique: true,
        min: 1
    },
    url_1: {
        type: String,
        default: ''
    },
    url_2: {
        type: String,
        default: ''
    },
    url_3: {
        type: String,
        default: ''
    },
    text: {
        type: String
    },
    description: {
        type: String,
        default: ''
    },
    index: {
        type: Number
    },
    enabled: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

CarouselSchema.plugin(AutoIncrement, {inc_field: 'carousel_id'});
module.exports = mongoose.model('Carousel', CarouselSchema);