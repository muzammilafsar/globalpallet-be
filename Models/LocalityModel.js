 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const AutoIncrement = require('mongoose-sequence')(mongoose);

 var LocalitySchema = new Schema({
    locality_number: {
        type: Number,
        unique: true,
        min: 1
    },
    key: {
        type: String
    },
    name: {
        type: String
    },
    enable: {
        type: Boolean
    },
    description: {
        type: String
    },
    index: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

LocalitySchema.plugin(AutoIncrement, {inc_field: 'locality_number'});
module.exports = mongoose.model('Localities', LocalitySchema);