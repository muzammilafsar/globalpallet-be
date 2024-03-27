var mongoose = require('mongoose');
var Coupon = mongoose.model('Coupons');
var CouponHistory = mongoose.model('CouponHistory');
var Order = mongoose.model('Order');
var User = mongoose.model('User');

exports.get_coupon = (req, res) => {

    Coupon.find({}).sort({index: 1}).exec((err, coupon) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(coupon);
    });
}

exports.get_coupon_by_id = (req, res) => {

    Coupon.findById(req.body.id, (err, coupon) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(coupon);
    });
}

exports.createCoupon = (req, res) => {
    let coupon = new Coupon(req.body);
    coupon.save((err, cpn) => {
        if (err) {
            res.send(err);
        } else {
            res.send({message: 'created successfully',
            coupon: cpn});
        }
    });
}
exports.editCoupon = (req, res) => {
    Coupon.findByIdAndUpdate(req.body.id, req.body.coupon, {new: true}, (err, cpn) => {
        if(err) {
            res.send(err);
        } else {
            res.send({message: 'updated successfully',
        coupon: cpn});
        }
    });
}
exports.deleteCoupon = (req, res) => {
    Coupon.findByIdAndRemove(req.body.id, (err, cpn) => {
        if(err) {
            res.send(err);
        } else {
            res.json('deleted');
        }
    });
}
exports.applyCoupon = (req, res) => {
    let discount = 0;
    req.body.code = req.body.code.toUpperCase();
    Coupon.findOne({code: req.body.code},(err, coupon) => {
        if(err) {
            res.send({message: 'Somthing Went Wrong'});
        } else {
            if (coupon) {
                if (!true) {
                    res.send({message: 'Coupon Expired'});
                } else {
                    if (coupon.valid_once) {
                        CouponHistory.findOne({code: req.body.code, user: req.decodedUserData.mobile}, (err, cpn) => {
                            if(err) {
                                res.send({message: 'Somthing Went Wrong'});
                            } else {
                                if (cpn) {
                                    res.send({message: 'Coupon Already Used'});
                                } else {
                                    res.send({status: 200, message: 'Coupon Applied Successfully', coupon});
                                }
                            }
                        })
                    } else if (coupon.first_order_only) {
                        Order.findOne({user: req.decodedUserData.mobile}, (err, order) => {
                            if(err) {
                                res.send({message: 'Somthing Went Wrong'});
                            } else {
                                if(order) {
                                    res.send({message: "Valid only on first user."});
                                }
                            }
                        })
                    } else {
                        if (coupon.goldMember === true) {
                            User.findOne({mobile: req.decodedUserData.mobile}, (err, user) => {
                                if(err) {
                                    res.send({message: 'Something went wrong, try again'});
                                } else {
                                    if(user) {
                                        if (user.goldMember === true) {
                                            if (coupon.percent !== 0 && coupon.amount === 0) {
                                                discount = Math.floor((req.body.total/100) * coupon.percent);
                                            } else {
                                                discount = coupon.amount;
                                            }
                                            res.send({
                                                status: 200, 
                                                message: 'Coupon Applied Successfully',
                                                coupon: {
                                                    name: coupon.name,
                                                    code: coupon.code,
                                                    amount: discount,
                                                    enable: coupon.enable,
                                                    details: coupon.details,
                                                    date_of_creation: coupon.date_of_creation,
                                                    validity: coupon.validity,
                                                    times_valid_per_user: coupon.times_valid_per_user,
                                                    first_order_only: coupon.first_order_only,
                                                    valid_once: coupon.valid_once,
                                                    active: coupon.active,
                                                    min_order_value: coupon.min_order_value,
                                                    min_order_applicable: coupon.min_order_applicable,
                                                    goldMember: coupon.goldMember,
                                                    show: coupon.show
                                                }});
                                        } else {
                                            res.send({message: "This Coupon is only for VIP Members."});
                                        }
                                    }
                                }
                            });
                        } else {
                            //free 30 temporary coding starts
                            if (coupon.code === 'FREE30') {
                                res.send({
                                    status: 200, 
                                    message: 'Coupon Applied Successfully',
                                    coupon: {
                                        name: 'You will get ₹30 Cashback',
                                        code: coupon.code,
                                        amount: 0,
                                        enable: coupon.enable,
                                        details: coupon.details,
                                        date_of_creation: coupon.date_of_creation,
                                        validity: coupon.validity,
                                        times_valid_per_user: coupon.times_valid_per_user,
                                        first_order_only: coupon.first_order_only,
                                        valid_once: coupon.valid_once,
                                        active: coupon.active,
                                        min_order_value: coupon.min_order_value,
                                        min_order_applicable: coupon.min_order_applicable,
                                        goldMember: coupon.goldMember,
                                        show: coupon.show
                                    }});
                            //free 30 temporary coding ends
                            } else {
                                if (coupon.percent !== 0 && coupon.amount === 0) {
                                    discount = Math.floor((req.body.total/100) * coupon.percent);
                                } else {
                                    discount = coupon.amount;
                                }
                                res.send({
                                    status: 200, 
                                    message: 'Coupon Applied Successfully',
                                    coupon: {
                                        name: coupon.name,
                                        code: coupon.code,
                                        amount: discount,
                                        enable: coupon.enable,
                                        details: coupon.details,
                                        date_of_creation: coupon.date_of_creation,
                                        validity: coupon.validity,
                                        times_valid_per_user: coupon.times_valid_per_user,
                                        first_order_only: coupon.first_order_only,
                                        valid_once: coupon.valid_once,
                                        active: coupon.active,
                                        min_order_value: coupon.min_order_value,
                                        min_order_applicable: coupon.min_order_applicable,
                                        goldMember: coupon.goldMember,
                                        show: coupon.show
                                    }});
                            }
                        }
                    }
                }
            } else {
                res.send({message: 'Coupon is invalid'});
            }

        }
    })
}