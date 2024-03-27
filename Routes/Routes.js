"use-strict";
var cors = require('cors');
var checkAuth = require('../Middleware/checkAuth');
var checkAdminAuth = require('../Middleware/checkAdminAuth');
module.exports = function(app) {
    var products = require('../Controller/product_controller');
    var category = require('../Controller/category_controller');
    var order = require('../Controller/order_controller');    
    var user = require('../Controller/user_controller');
    // var subCategory = require('../Controller/sub_category_controller');
    // var rootCategory = require('../Controller/root_category_controller.js');
    var coupon = require('../Controller/coupon_controller');
    var address = require('../Controller/address_controller');
    var shop = require('../Controller/shop_timings_controller');
    var customercontact = require('../Controller/customer_contact_controller');
    var partyorder = require('../Controller/party_orders_controller');
    var carousel = require('../Controller/carousel_controller');
    var offer = require('../Controller/offers_controller');
    var constant = require('../Controller/constants_controller');
    var locality = require('../Controller/locality_controller');
    var admin = require('../Controller/admin_controller');
    var explore = require('../Controller/explore_controller');
    var otpHistory = require('../Controller/otp_history_controller');
    var business = require('../Controller/business_controller');
    var daily = require('../Controller/daily_controller');
    var delivery = require('../Controller/delivery_controller');
    var cancelReason = require('../Controller/cancel_reason_controller');
    // var test = require('../Controller/test_controller');
    var feedback = require('../Controller/feedback_controller');
    var appUsers = require('../Controller/app_users_controller');
    var general = require('../Controller/general');

    // general
    app.route('/').get(general.indexResponse);
    app.route('/mains').get(general.getMainsIndex);
    
    app.use(cors());
    app.route("/shoptimings").get(shop.shopTiming);
    app.route("/ocassional").get(shop.ocassional);
    //admin api
   
    // locality
     app.route("/locality").get(locality.get_locality);
     app.route('/localitybyid/:id').get(locality.get_locality_by_id);
     app.route("/createlocality").post(locality.create_locality);
     app.route("/deletelocality").post(locality.delete_locality);
     app.route("/editlocality").post(locality.edit_locality);
    

    // Issues
    app.route("/issues").get(customercontact.get_all_customers_contact);
    app.route("/issues/:id").get(customercontact.get_customers_contact_by_id);
    app.route("/createissue").post(customercontact.create_customers_contact);
    app.route("/issues/delete/:id").post(customercontact.delete_customers_contact);
    app.route("/resolveissue/:id").post(customercontact.resolveIssue);

    // party
    app.route("/partyorder").get(partyorder.get_all_party_orders);
    app.route("/partyorder/:id").get(partyorder.get_party_orders_by_id);
    app.route("/createpartyorder").post(partyorder.create_party_orders);
    app.route("/partyorder/delete/:id").post(partyorder.delete_party_orders);
    app.route("/partycomplete/:id").post(partyorder.partyRequestComplete);

 
    // admin orders
    app.route('/orders').post(order.allOrders);
    app.route("/activeorders").post(order.activeOrder);
    app.route("/admincancel").post(order.adminCancelOrder );
    app.route("/adminordercomplete").post(checkAdminAuth, order.adminCompleteOrder );
    app.route('/getactiveorder').post(checkAdminAuth, order.getActiveOrderById);
    app.route('/editactiveorder').post(checkAdminAuth, order.editActiveOrder );

    // products
    app.route("/products").get(products.get_all_products);
    app.route("/products/:id").get(products.get_product_by_id);
    app.route("/productsbycategory").get(products.get_products_by_category);
    app.route("/productsbysubcategory").post(products.get_products_by_sub_category);
    app.route("/products/verify").post(products.verify_availability);

    app.route("/products/update/:id").post(checkAdminAuth, products.update_product );
    app.route("/products/delete/:id").post(checkAdminAuth, products.delete_product );
    app.route("/createproduct").post(products.create_product );

    // category
    app.route("/getallcatwithsubcat").get(category.get_list);
    app.route("/category/:id").get(category.get_category_by_id);
    app.route("/category").get(category.get_all_category);
    app.route("/createcategory").post(checkAdminAuth, category.create_category );
    app.route("/category/update/:id").post(checkAdminAuth, category.update_category );
    app.route("/category/delete/:id").post(checkAdminAuth, category.delete_category );

    // deprecated
    // app.route("/createsubcategory").post(subCategory.create_sub_category );
    // app.route("/getsubcatbycat").post(subCategory.get_subcategory_of_category);

    // app.route("/createrootcategory").post(rootCategory.create_root_category);
    // app.route("/getrootcatbysubcat").post(rootCategory.get_rootcategory_of_subcategory);
    
    // app.route("/registeruser").post(user.register_user);
    // app.route('/login').post(user.login);

    // user orders
    app.route('/cancelorder').post(checkAuth, order.cancel_order);    
    app.route('/neworder').post(checkAuth, order.createOrder);
    app.route('/getorders').post(checkAuth, order.userOrders);
    app.route('/getshortorders').post(checkAuth, order.userRecentOrders);
    app.route("/useractiveorders").post(checkAuth, order.userActiveOrders);

    // otp
    app.route('/sendotp').post(user.sendOtp);
    app.route('/verifyotp').post(user.verifyOtp);
    app.route('/resendotp').post(user.resendOtp);
    app.route('/otphistory').get(/*checkAdminAuth, */otpHistory.getOtpHistory);
    
    // address
    app.route('/getaddress').post(checkAuth, address.getUserAddress);
    app.route('/getalladdress').post(checkAuth, address.getAllUserAddress);
    app.route('/addaddress').post(checkAuth, address.addUserAddress);
    app.route('/editaddress').post(checkAuth, address.editUserAddress);
    app.route('/deleteaddress').post(checkAuth, address.deleteUserAddress);

    app.route('/getaddresseslist').post(checkAdminAuth, address.getAllAddressesList);
        
    app.route('/getjwt').get(user.generatejwt);
    app.route('/verifyjwt').post(user.verifyJwt);

    // coupon
    app.route('/getcoupon').get(coupon.get_coupon);
    app.route('/getcouponbyid').post(coupon.get_coupon_by_id);
    app.route('/createcoupon').post(coupon.createCoupon);
    app.route('/editcoupon').post(coupon.editCoupon);
    app.route('/deletecoupon').post(coupon.deleteCoupon);
    app.route('/applycoupon').post(checkAuth, coupon.applyCoupon);

    
    // user
     app.route('/customers').get(user.getAllUsers);
     app.route("/customersbyid/:id").get(user.get_user_by_id);
     app.route('/updatecustomers').post(user.edit_user);
     app.route('/getuserdata').post(checkAuth, user.getUserData);
     app.route('/noticeread').post(checkAuth, user.noticeRead);
     app.route('/ratedapp').post(checkAuth, user.ratedApp);

     app.route('/updateuserremarks').post(checkAdminAuth, user.updateUserRemarks);
    
    //carousel
    app.route('/create_carousel').post(checkAdminAuth, carousel.create_carousel );
    app.route('/delete_carousel').post(checkAdminAuth, carousel.delete_carousel );
    app.route('/edit_carousel').post(checkAdminAuth, carousel.edit_carousel );
    app.route('/get_all_carousel').get(carousel.get_all_carousel);
    app.route('/get_carousel').post(carousel.get_carousel);

    //offers
    app.route('/create_offer').post(checkAdminAuth, offer.create_offer);
    app.route('/delete_offer').post(checkAdminAuth, offer.delete_offer);
    app.route('/edit_offer').post(offer.edit_offer );
    app.route('/get_all_offer').get(offer.get_all_offer);
    app.route('/get_offer').post(offer.get_offer);

    // constants
    app.route('/create_constant').post(checkAdminAuth, constant.createConstant );
    app.route('/get_all_constant').get(constant.get_all_constants);
    app.route('/getconstantbyid').post(constant.get_constants_by_id );
    app.route('/edit_constant').post( checkAdminAuth, constant.edit_constant);
    app.route('/delete_constant').post(checkAdminAuth, constant.delete_constant);
    app.route('/get_constant').post(constant.get_constant);

    // admin
    app.route('/create_admin').post(admin.create_admin);
    app.route('/admin_login').post(admin.admin_login);

    // delivery boy in adminSchema
    app.route('/getboys').get(admin.getDeliveryBoysList);
    app.route('/getcompleteboys').get(admin.getCompleteBoys);

    app.route('/getboystats').post(admin.getBoyStats);
    app.route('/getboybyid').post(admin.getDeliveryBoysById);
    app.route('/editboy').post(admin.editDeliveryBoy);
    app.route('/deleteboy').post(checkAdminAuth, admin.deleteDeliveryBoy);
    
    app.route('/getdeliveryreport').get(delivery.getDeliveryReport);
    app.route('/getboydaily').post(delivery.getDailyBoyData);

    app.route('/assignorder').post(checkAdminAuth, order.orderAssigned);
    app.route('/getorderbyboy').post(order.getActiveOrderByBoy);
    app.route('/gettodayorders').post(order.getTodayOrders);
    
    // reports
    app.route('/getdailyreport').get(daily.getDailyReports);
    app.route('/getbusinessreport').get(business.getBusinessReports);
    app.route('/resetbusinessdata').get(business.resetBusinessData);
    app.route('/getoldbusiness').get(business.getOldBusinessReports);

    // explore
    app.route('/explore').get(explore.getExplore);
    app.route("/explore/:id").get(explore.getExploreById);
    app.route("/createexplore").post(checkAdminAuth, explore.createExplore);
    app.route("/explore/update/:id").post(checkAdminAuth, explore.updateExplore);
    app.route("/explore/delete/:id").post(checkAdminAuth, explore.deleteExplore);

    // cancel reasons
    app.route('/getcancelreasons').get(cancelReason.getCancelReasons);
    app.route("/createcancelreason").post(cancelReason.createCancelReason);

    // background activity
    app.route('/updatefavourite').post(checkAuth, user.updateFavourite);
    app.route('/updatecart').post(checkAuth, user.updateCartItems);

    // routes for testing
    // app.route('/testfire').get(test.testFire);

    // feedback
    app.route('/newfeedback').post(checkAuth, feedback.newFeedback);
    app.route('/cancelfeedback').post(checkAuth, feedback.cancelFeedback);
    app.route('/getfeedbacks').get(feedback.getAllFeedbacks);

    // app installations
    app.route('/newinstall').post(appUsers.newAppUser);
    app.route('/getinstalls').get(appUsers.getAppUsers);
};
