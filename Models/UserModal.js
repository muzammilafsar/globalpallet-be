var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var UserSchema = new Schema({
    user_number: {
        type: Number,
        unique: true,
        minimum: 1
    },
    name: {
        type: String,
    },
    // email: {
    //     type: String
    // },   
    // password: {
    //     type: String
    // },
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    total_orders: {
        type: Number,
        default: 0
    },
    completed_orders: {
        type: Number,
        default: 0
    },
    cancelled_orders: {
        type: Number,
        default: 0
    },
    goldMember: {
        type: Boolean,
        default: false
    },
    user_since: {
        type: Date,
        default: Date.now()
    },
    address: [{
        title: {
            type: String,
            default: ''
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
            type: String,
        },
        state: {
            type: String
        },
        landmark: {
            type:String
        },
        alt_mobile: {
            type: String
        },
        contact: {
            type: String
        }
    }],
    // is_in_trans_cpassword: {
    //     type: Boolean
    // },
    // is_in_trans_signup: {
    //     type: Boolean
    // },
    user_flag_danger: {
        default: false,
        type: Boolean
    },
    user_flag_important: {
        default: false,
        type: Boolean
    },
    remarks: {
        type: String,
        default: ''
    },
    wallet_balance: {
        type: Number,
        default: 0
    },
    feedback_private: {
        type: String,
        default: ''
    },
    favourites: [String],
    itemsInCart: [String],
    last_order: {
        order: Number,
        feedback: {
            type: Boolean,
            default: false
        }
    },
    notice: {
        show: {
            type: Boolean,
            default: false
        },
        message: String,
        rate: {
            type: Boolean,
            default: false
        }
    },
    detail: {
        appVersion: {
            type: String
        },
        walletThreshold: {
            type: Number,
            default: 0
        }
    }
});

UserSchema.plugin(AutoIncrement, {inc_field: 'user_number'});
module.exports = mongoose.model('User', UserSchema);
