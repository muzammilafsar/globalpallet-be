var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubCategorySchema = new Schema({ 
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
        source: {
        type: String
     },
        details: {
        type: String
     },
     category_name: {
         type: String
     }
});
module.exports = mongoose.model('SubCategory', SubCategorySchema);