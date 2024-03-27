var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExploreSchema = new Schema({
    name: {
        type: String,
        unique: true
    },  
    image: {
        type: String
    },
    color: {
        type: String
    },
    detail: {
        icon: {
            type: String
        }, 
        title: {
            type: String
        },
        desciption: {
            type: String
        },
        tag: {
            type: String
        }
    }
});
module.exports = mongoose.model('Explore', ExploreSchema);
