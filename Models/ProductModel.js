var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var ProductSchema = new Schema({
    product_number: {
        type: Number,
        unique: true,
        min: 1
    },
    product_id: {
        type: String
    },
    name : {
        type: String
    },
    image : {
        type: String
    },
    image_web: {
        type: String
    },
    price_1 : {
        type: Number
    },
    price_2 : {
        type: Number
    },
    price_3 : {
        type: Number
    },
    size_1 : {
        type: String
    },
    size_2 : {
        type: String
    },
    size_3 : {
        type: String
    },
    qty_1: {
        type: Number
    },
    qty_2: {
        type: Number
    },
    qty_3: {
        type: Number
    },
    category : {
        type: String
    },
    tags : {
        type: String
    },
    status : {
        type: Boolean
    },
    description : {
        type: String
    },
    index : {
        type: Number
    },
    veg : {
        type: Boolean
    },
    coming_soon : {
        type: Boolean,
        default: false
    },
    explore_tag : {
        type: String,
        default : " "
    },
    order_score: {
        type: Number,
        default: 0
    },
    bit: {
        type: Number
    }, 
    popular: {
        type: Boolean
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    chilly_level: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
    },
    newly: {
        type: Boolean,
        default: false
    },
    note: {
        type: String
    },
    original: {
        type: String
    }
});

ProductSchema.plugin(AutoIncrement, {inc_field: 'product_number'});
module.exports = mongoose.model("Products", ProductSchema);