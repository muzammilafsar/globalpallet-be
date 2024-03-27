var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BrandsSchema = new Schema({
        id : {
        type : Number
    }, 
        name: {
        type: String,
        unique: true
    },
        image: {
        type: String
    },
        enable: {
        type: Boolean
    },
        details: {
        type: String
     }
       
});
module.exports = mongoose.model('Brands', BrandsSchema);