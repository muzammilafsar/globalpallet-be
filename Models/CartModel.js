var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
        special_id : {
        type : String,
        unique: true
    }, 
        item_name: {
        type: String
    },
        quantity: {
        type: Number
    },
        size: {
        type: String
    },
        order_id: {
        type: String
     },
        to_be_delivered_by: {
        type: String
     }, 
        item_price: {
        type: Number
     }, 
        order_total: {
        type: Number
     }, 
        in_cart: {
        type: Boolean
    }, 
        in_waiting: {
        type: Boolean
    }, 
        save_for_later: {
        type: Boolean
    }, 
        ordered: {
        type: Boolean
    }, 
        order_cancelled: {
        type: Boolean
    }, 
        delete_from_cart: {
        type: Boolean
    }, 
        delivered: {
        type: Boolean
    }, 
        red_date: {
        type: String
}
       
});
module.exports = mongoose.model('Cart', CartSchema);