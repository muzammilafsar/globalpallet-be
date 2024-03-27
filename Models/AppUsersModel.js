var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var AppUsersSchema = new Schema({
    installation_no: {
        type: Number,
        unique: true,
        min: 1
    },
    ipAddress: {
        type: String,
    },
    platform: {
        type: String,
    },
    version: {
        type: String,
    },
    isPad: {
        type: Boolean,
        default: false
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

AppUsersSchema.plugin(AutoIncrement, {inc_field: 'installation_no'});
module.exports = mongoose.model('AppUsers', AppUsersSchema);
