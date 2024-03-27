var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var CategorySchema = new Schema({
    category_id: {
        type: Number,
        unique: true,
        min: 1
    },
    name: {
        type: String,
        unique: true
    },
    image: {
        type: String
    },
    image_web: {
        type: String
    },
    enable: {
        type: Boolean
    },
    source: {
        type: String
    },
    details: {
        type: String
    },
    tag: {
        type: String
    },
    key: {
        type: String
    },
    newly: {
        type: Boolean,
        default: false
    },
    segment: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }      
});

CategorySchema.plugin(AutoIncrement, {inc_field: 'category_id'});
module.exports = mongoose.model('Category', CategorySchema);