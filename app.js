const express = require('express');
var app = express();
require('dotenv').config();
port = process.env.PORT || 3000 ;
var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Product = require('./Models/ProductModel');
var User = require('./Models/UserModal');
var Order = require('./Models/OrderModel');
var Category = require('./Models/CategoryModel');
var SubCategory = require('./Models/SubCategory');
var RootCategory = require('./Models/RootCategoryModel');
var Coupon = require('./Models/CouponModel');
var CouponHistory = require('./Models/CouponHistoryModel');
var Address = require('./Models/AddressModel');
var CustomerContacts = require('./Models/CustomerContactModel');
var PartyOrder = require('./Models/PartyOrdersModel');
var Carousel = require('./Models/CarouselModel');
var Offer = require('./Models/OffersModel');
var constant = require('./Models/ConstantModel');
var locality = require('./Models/LocalityModel');
var admin = require('./Models/AdminModel');
var explore = require('./Models/ExploreModel');
var otpHistory = require('./Models/OtpHistoryModel');
var business = require('./Models/BusinessModel');
var daily = require('./Models/DailyModel');
var delivery = require('./Models/DeliveryModel');
var cancelReason = require('./Models/CancelReasonModel');
var feedback = require('./Models/FeedbackModel');
var appUsers = require('./Models/AppUsersModel');

var bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://mafsar:afsar@ac-ql6rnqu-shard-00-00.lcrtuec.mongodb.net:27017,ac-ql6rnqu-shard-00-01.lcrtuec.mongodb.net:27017,ac-ql6rnqu-shard-00-02.lcrtuec.mongodb.net:27017/foodrill?ssl=true&replicaSet=atlas-qmk2kq-shard-0&authSource=admin&retryWrites=true&w=majority');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit:10241024102420,type:'application/json'}));

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","HEAD,GET,POST,PATCH,OPTIONS,PUT,DELETE");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

var routes = require('./Routes/Routes'); //importing route
routes(app); //register the route
app.listen(port);
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

console.log('todo list RESTful API server started on: ' + port);
