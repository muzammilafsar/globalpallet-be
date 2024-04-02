var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    
    order_special_id : {
        type : Number,
        unique: true,   
        min: 1     
    },
    user: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    items: {
        type: Array
    },
    total_items: {
        type: Number
    },
    actual_price: {
        type: Number
    },
    total_price: {
        type: Number
    },
    mobile: {
        type: String,
    },
    // in_waiting : {
    //     type : Boolean
    // },
    delivery_charge : {
        type : Number
    },
    coupon_applied: {
        type: Boolean,
        default: false
    },
    applied_coupon_name : {
        type : String
    },
    applied_coupon_discount : {
        type : Number
    },
    // final_total_with_tax : {
    //     type : String
    // },
    updated : {
        type : Boolean,
        default: false
    },
    order_cancelled : {
        type : Boolean,
        default: false
    },
    delivered : {
        type : Boolean,
        default: false
    },
    last_updated : {
        type : String,
        default: Date.now()
    },
    instruction: {
        type: String
    },
    wallet_balance_used: {
        type: Number,
        default: 0
    },
    cod: {
        type: Boolean,
        default: true
    },
    device: {
        type: String
    },
    userip: {
        type: String
    },
    order_date: {
        type: Date,
        default: Date.now()
    },
    order_completed: {
        type: Boolean,
        default: false
    },
    status_note: {
        type: String,
        default: ''
    },
    assigned_to: {
        type: String
    },
    delivery_boy: {
        name: {
            type: String
        },
        photo: {
            type: String
        },
        description: {
            type: String
        },
        mobile: {
            type: String
        }
    },
    delivered_by: {
        type: String
    },
    cancel_reason: {
        type: String
    },
    //delivery_address needs to be clearified due to 3 different addresses//
    delivery_address: {
        title: {
            type: String,
        },
        first_name: {
            type: String
        },
        mobile: {
            type: String
        },
        pincode: {
            type: String
        },
        locality: {
            type: String
        },
        address: {
            type: String
        },
        address2: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        landmark: {
            type:String
        },
        alt_mobile: {
            type: String
        }
    },
    bit: {
        type: Number
    },
    delivery_time: {
        type: Date,
    },
    time_taken_minutes: {
        type: Number
    },
    user_remarks: {
        type: String
    }
});
OrderSchema.plugin(AutoIncrement, {inc_field: 'order_special_id'});
OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Order', OrderSchema);
