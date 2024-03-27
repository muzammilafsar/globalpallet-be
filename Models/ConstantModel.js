var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConstantSchema = new Schema({
    constants: {
        type: String
    },
    key: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = mongoose.model('Constant', ConstantSchema);
