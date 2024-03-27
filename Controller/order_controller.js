var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var Product = mongoose.model('Products');
var CouponHistory = mongoose.model('CouponHistory');
var Address = mongoose.model('Address');
var Coupon = mongoose.model('Coupons');
var User = mongoose.model('User');
var OtpHistory = mongoose.model('OtpHistory');
var Constant = mongoose.model('Constant');
var Admin = mongoose.model('Admin');
var daily = require('./daily_report_creator');
var business = require('./business_report_creator');
var delivery = require('./delivery_manager');
var fetch = require('node-fetch');


let saveAddress = (mobile, address) => {
    User.findOneAndUpdate({ mobile },
        { $push: { address } }, (error, success) => {
            if (!error && success) {
                new Address({
                    address,
                    user: mobile
                }).save();
            }
    });
}

let createCouponHistory = (coupon, user) => {
    let cpnHistory = new CouponHistory({
        code: coupon.code,
        user
    });
    cpnHistory.save((err, saved) => {});
}

let checkCoupon = (cpn, user, call) => {
    Coupon.findOne({
        code: cpn
    }, (err, coupon) => {
        if (err) {
            console.log("error 1");
            call(0);
        } else {
            if (coupon) {
                if (!coupon.enable) {
                    console.log("error 2");
                    call(0);
                } else {
                    if (coupon.valid_once) {
                        CouponHistory.findOne({
                            code: coupon.code,
                            user: user
                        }, (err, cpn) => {
                            if (err) {
                                console.log("errorhistory");
                                call(0);
                            } else {
                                if (cpn) {
                                    call(0);
                                } else {
                                    createCouponHistory(coupon, user);
                                    call(coupon.amount);
                                }
                            }
                        })
                    } else if (coupon.first_order_only) {
                        console.log("first order");
                        Order.find({
                            user: user
                        }, (err, order) => {
                            if (err) {
                                console.log("first order2");
                                call(0);
                            } else {
                                if (order.length > 0) {
                                    console.log("first order3");
                                    call(0);
                                } else {
                                    createCouponHistory(coupon, user);
                                    call(coupon.amount);
                                }
                            }
                        })
                    } else {
                        createCouponHistory(coupon, user);
                        call(coupon.amount);
                    }
                }
            } else {
                call(0);
            }
        }
    })
}

getConstants = (sendConst) => {
    try{
        Constant.findOne({
            key: 'serviceData'
        }, (err, cons) => {
            console.log(cons.constants);
            if (err) {
                sendConst({});
            } else {
                sendConst(JSON.parse(cons.constants));
            }
        })
    } catch(err) {
        sendConst({});
    }
}

const reduceQuantity = (products) => {
    products.map(val => {
        Product.findById(val.product._id, (err, prod) => {
            if(!err && prod) {
                let temp = prod.qty_1;
                temp = temp - val.quantity;
                prod.qty_1 = (temp >= 0)? temp : 0;
                prod.order_score = prod.order_score + val.quantity;
                prod.save();
            }
        });
    });
}

const increaseQuantity = (products) => {
    products.map(val => {
        Product.findById(val.product._id, (err, prod) => {
            if(!err && prod) {
                prod.qty_1 = prod.qty_1 + val.quantity;
                prod.order_score = prod.order_score - val.quantity;
                prod.save();
            }
        });
    });
}

exports.userActiveOrders = (req, res) => {
    try {
        Order.find({
            user: req.decodedUserData.mobile,
            order_cancelled: false,
            order_completed: false
        }, (err, orders) => {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    status: 200,
                    count: orders.length,
                    orders : orders.reverse()
                });
            }
        });
    } catch (err) {
        res.send({
            error: err
        });
    }
}

exports.createOrder = (req, res) => {
    let userip = req.body.userip;
    let device = req.body.device;
    let products = req.body.products;
    let address = req.body.address;
    let cpn = req.body.coupon.toUpperCase();
    let discount = req.body.couponamount;
    let instruction = req.body.instruction;
    let wallet = req.body.walletused;

    let date = new Date();
    let currentOffset = date.getTimezoneOffset();
    let istTime = new Date(date.getTime() + (330 + currentOffset) * 60000);
    let current = istTime.getHours();


    Constant.findOne({ key: 'serviceTimings' }, (err, con) => {
        const timing = JSON.parse(con.constants);
        
        if (err) {
            console.log(err);
        } else {
            if (timing.notice.length > 0) {
                // we are off
                res.send({
                    status: 205,
                    message: timing.notice
                });
            } else {
                if (timing.opening > current || timing.closing <= current) {
                    // we are sleeping, come in day time
                    res.send({
                        status: 205,
                        message: timing.night
                    });
                } else {
                    User.findOne({mobile: req.decodedUserData.mobile}, (err, user) => {
                        if(user && user.user_flag_danger) {
                            res.send({
                                status: 205,
                                message: 'We are Sorry! You cannot place order with us. Your number is completely banned from using all services of GlobalPallet, due to your violation of GlobalPallet Laws, Regulations, or Terms & Conditions. In case you think, it is done by mistake you can contact us'
                            });
                        } else {
                    getConstants(constants => {
                        checkCoupon(cpn.toUpperCase(), req.decodedUserData.mobile, (couponAmount) => {
                            console.log(couponAmount);
                            let product_ids = [];
                            products.map(val => {
                                product_ids.push((val.product._id));
                            });
                            Product.find({
                                '_id': {
                                    $in: product_ids
                                }
                            }, (err, pro) => {
                                let total = 0;
                                let no_of_items = [];
                                let deliveryCharges = 0;
                                let actual = 0;
                                products.map((val, i) => {
                                    let p = pro.findIndex(pval => {
                                        return pval._id == val.product._id;
                                    });
                    
                                    products[i].product = pro[p];
                                    let s = products[i].size.split('_')[1];
                                    products[i].price = val.product[`price_${products[i].size.split('_')[1]}`];
                                });
                                products.map(val => {
                                    total = total + (val.price * val.quantity);
                                    no_of_items = no_of_items + val.quantity;
                                });
                                if (total >= constants.freeDeliveryAmount) {
                                    deliveryCharges = 0;
                                } else {
                                    deliveryCharges = constants.deliveryCharge;
                                }
                                actual = total + parseInt(deliveryCharges, 10);
                                total = actual - discount;
                                if (wallet > 0) {
                                    total = total - wallet;
                                }
                                if (total < 0) {
                                    total = 0;
                                }
                                let order = {
                                    userip: userip,
                                    device: device,
                                    delivery_address: address,
                                    user: req.decodedUserData.mobile,
                                    name: address.first_name,
                                    items: products,
                                    actual_price: actual,
                                    total_price: total,
                                    total_items: no_of_items,
                                    mobile: req.decodedUserData.mobile,
                                    delivery_charge: deliveryCharges,
                                    coupon_applied: (cpn) ? true : false,
                                    applied_coupon_name: cpn,
                                    applied_coupon_discount: discount,
                                    order_date: Date.now(),
                                    user_remarks: user.remarks,
                                    instruction:  instruction || '',
                                    wallet_balance_used: wallet
                                };
                                order = new Order(order);
                                if (address.save_address) {
                                    saveAddress(req.decodedUserData.mobile, address);
                                }
                                order.save((err, odr) => {
                                    if (err) {
                                        res.send({
                                            status: 400,
                                            message: err
                                        });
                                    } else {
                                        daily.orderPlace(products, total, deliveryCharges, cpn, discount, device, address.locality);
                                        business.orderPlace(products, total, deliveryCharges, cpn, discount, device, address.locality);
                                        reduceQuantity(products);
                                        sendOrderSms(address.first_name, req.decodedUserData.mobile, total, address.locality);
                                        res.send({
                                            status: 200,
                                            message: 'order successfull',
                                            order: odr
                                        });
                                    }
                                });
                                User.findOne({
                                    mobile: req.decodedUserData.mobile
                                }, (err, user) => {
                                    if (err) {
                                        console.log('user not found', err);
                                    } else {
                                        console.log('user found');
                                        if (user) {
                                            user.total_orders = user.total_orders + 1;
                                            if (!user.name) {
                                                user.name = address.first_name;
                                            }
                                            if (wallet > 0) {
                                                user.wallet_balance = user.wallet_balance - wallet;
                                            }
                                            user.save();
                                            OtpHistory.findOne({mobile: req.decodedUserData.mobile}, (err, user) => {
                                                if(user) {
                                                    user.ordered = true;
                                                    user.save();
                                                }
                                            });
                                        } else {
                                            let newUser = new User({
                                                mobile: req.decodedUserData.mobile,
                                                address: [address],
                                                name: address.first_name,
                                                total_orders: 1
                                            });
                                            newUser.save();
                                        }
                                    }
                                });
                            });
                        });
                    })
                }});
                }
            }
        }
    });
}

exports.userOrders = (req, res) => {
    Order.find({
        mobile: req.decodedUserData.mobile
    }, (err, orders) => {
        if (err) {
            res.send({
                status: 400,
                message: err
            });
        } else {
            res.send({
                status: 200,
                orders: orders.reverse()
            });
        }
    });
}
exports.userRecentOrders = (req, res) => {
    Order.find(
        { mobile: req.decodedUserData.mobile, order_cancelled: false })
        .sort('-order_special_id')
        .limit(20)
        .exec((err, orders) => {
        if (err) {
            res.send({
                status: 400,
                message: err
            });
        } else {
            res.send({
                status: 200,
                orders
            });
        }
    });
}
exports.allOrders = (req, res) => {
    var { page, perPage } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(perPage) || 20,
    };
    Order.paginate({}, options, (err, orders) => {
        if (err) {
            res.send({
                status: 400,
                message: err
            });
        } else {
            res.send({
                status: 200,
                orders: orders
            });
        }
    });
}
exports.cancel_order = (req, res) => {
    User.findOne({
        mobile: req.decodedUserData.mobile
    }, (err, user) => {
        if (err) {
            console.log('user not found', err);
        } else {
            console.log('user found');
            if (user) {
                // order start
                Order.findOne({
                    _id: req.body.order_id
                }, (err, order) => {
                    if (err) {
                        res.send({
                            message: 'Something Went Wrong'
                        });
                    } else if (order) {
                        let diffMs = Date.now() - new Date(order.order_date);
                        let mins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                        if (mins > 30) {
                            res.send({
                                message: 'Cant Cancel your Order Now, This Is Because Your Order Must Be On Its Way. No Worries, Dont Accept Order When It Arrives!'
                            });
                        } else {
                            order.order_cancelled = true;
                            order.cancel_reason = req.body.reason || 'u_1';
                            order.save((err, order) => {
                                if (err) {
                                    res.send({
                                        message: 'Something Went Wrong'
                                    });
                                } else {
                                    increaseQuantity(order.items);
                                    daily.orderCancel(order);
                                    business.orderCancel(order);
                                    delivery.orderCancel('user');

                                    user.cancelled_orders = user.cancelled_orders + 1;
                                    if (order.wallet_balance_used > 0) {
                                        user.wallet_balance = user.wallet_balance + order.wallet_balance_used;
                                    }
                                    user.save();
            
                                    res.send({
                                        message: order.wallet_balance_used > 0 ? 
                                         `Order Cancelled Successfully! ₹${order.wallet_balance_used} are added to your wallet. Thank you` :
                                         'Order Cancelled Successfully! We may contact you for confirmation. Thanks for visiting us.',
                                        status: 200
                                    });
                                }
                            });
                        }
                    } else {
                        res.send({
                            message: 'Not Found'
                        });
                    }
                });
                // order end
            } else {
                console.log('cannot increment user');
            }
        }
    });
}

exports.activeOrder = (req, res) => {
    try {
        Order.find({
            order_cancelled: false,
            order_completed: false
        }, (err, orders) => {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    orders: orders.reverse()
                });
            }
        });
    } catch (err) {
        res.send({
            error: err
        });
    }
}

exports.getActiveOrderByBoy = (req, res) => {
    try {
        Order.find({
            order_cancelled: false,
            order_completed: false,
            assigned_to: req.body.boy
        }, (err, orders) => {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    orders
                });
            }
        });
    } catch (err) {
        res.send({
            error: err
        });
    }
}

exports.getActiveOrderById = (req, res) => {
    Order.findOne({_id: req.body.id}, (err, ord) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(ord);
    });
}

exports.editActiveOrder = (req, res) => {
    console.log(req.body);
    Order.findOneAndUpdate({_id: req.body.id}, req.body.order, (err, ord) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('updated');
    });
}

const updateOnAdminComplete = (mobile, id, coupon) => {
    User.findOne({ mobile: mobile }, (err, user) => {
        if (err) {
            console.log('user not found', err);
        } else {
            console.log('user found');
            if (user) {
                user.completed_orders = user.completed_orders + 1;
                let score = user.completed_orders - user.cancelled_orders;
                if (score > 10) {
                    user.goldMember = true;
                }
                // temporary coding FREE30 starts
                if (coupon === 'FREE30') {
                    user.wallet_balance += 30;
                    user.notice.show = true;
                    user.notice.message = 'Congratulations! You have received ₹30 CashBack';
                }
                // temporary coding FREE30 ends
                user.last_order.order = id;
                user.last_order.feedback = true;
                user.save();
            } else {
                console.log('invalid user');
            }
        }
    });
} 

exports.adminCompleteOrder = (req, res) => {
    Order.findOne({ _id: req.body.order_id }, (err, order) => {
        if (err) {
            res.send(err);
        } else if (order) {
            let boy = req.body.boy;
            let orderTime = new Date(order.order_date).getTime();
            let time = Math.round(((Date.now() - orderTime)/60000) * 100) / 100;

            order.delivered_by = boy;
            order.delivery_time = Date.now();
            order.time_taken_minutes = time;
            order.order_completed = true;
            order.save((err, suc) => {
                if (err) {
                    res.send(err);
                } else {
                    updateOnAdminComplete(order.user, order.order_special_id, order.applied_coupon_name);
                    daily.orderComplete(time, boy);
                    business.orderComplete(time, boy);
                    delivery.orderComplete(order.total_price, boy);

                    res.send({
                        message: 'sucess',
                        status: 200
                    });
                }
            })
        }
    });
}

exports.adminCancelOrder = (req, res) => {
    Order.findOne({_id: req.body.order_id}, (err, order) => {
        if (err) {
            res.send(err);
        } else if (order) {
            let reason = req.body.reason;
            order.order_cancelled = true;
            order.cancel_reason = reason;
            order_completed = false;
            order.save((err, suc) => {
                if (err) {
                    res.send(err);
                } else {
                    User.findOne({ mobile: order.user }, (err, user) => {
                        if (user) {
                            user.cancelled_orders = user.cancelled_orders + 1;
                            user.notice.show = true;
                            if (order.wallet_balance_used > 0) {
                                user.wallet_balance = user.wallet_balance + order.wallet_balance_used;
                                user.notice.message = `Order No. ${order.order_special_id} is cancelled. We have refunded Rs. ${order.wallet_balance_used}. Thank you.`;
                            } else {
                                user.notice.message = `Order No. ${order.order_special_id} is cancelled. Thank you for using GlobalPallet.`;
                            }
                            user.save();
                        } 
                    });
                    let boy = req.body.boy;
                    increaseQuantity(order.items);
                    daily.orderCancel(order, reason);
                    business.orderCancel(order, reason);
                    delivery.orderCancel(boy);

                    res.send({
                        message: 'sucess',
                        status: 200
                    });
                }
            })
        }
    });
}

exports.orderAssigned = (req, res) => {
    Order.findOne({ _id: req.body.order_id }, (err, order) => {
        if (err) {
            res.send(err);
        } else if (order) {
            let boy = req.body.boy;
            Admin.findOne({ username: boy }, (err, fieldBoy) => {
                if (err) {
                    res.send(err);
                } else if (fieldBoy) {
                    order.assigned_to = boy;
                    order.delivery_boy.name = fieldBoy.name;
                    order.delivery_boy.photo = fieldBoy.photograph;
                    order.delivery_boy.description = fieldBoy.description;
                    order.delivery_boy.mobile = fieldBoy.mobile;
                    order.save((err, success) => {
                        if (err) {
                            res.send(err);
                        } else {
                            delivery.assignOrder(boy);
                            res.send({
                                message: `order assigned to ${fieldBoy.name}`,
                                status: 200
                            });
                        }
                    });
                }
            });
        }
    });
}

exports.getTodayOrders = (req, res) => {
    try {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = -330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);

        const today = new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
        console.log(date, 'date');

        console.log(today, 'today');
        console.log(istTime, 'istTime');
        
        Order.find({
            order_date: { $gte: today },
            $or:[{ 'assigned_to': req.body.boy}, {'delivered_by': req.body.boy }]
        }, (err, orders) => {
            if (err) {
                res.send(err);
            } else {
                res.send(orders.reverse());
            }
        });
    } catch (err) {
        res.send({
            error: err
        });
    }
}

const sendOrderSms = (name, mob, total, locality) => {
};
