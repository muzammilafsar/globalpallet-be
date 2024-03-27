var mongoose = require('mongoose');
var Business = mongoose.model('Business');

module.exports = {
    orderPlace: function (products, total, deliveryCharges, cpn, discount, device, locality) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        Business.findOne({key: 'main'}, (err, businessData) => {
            if (!err && businessData) {
                // add
                var bit = 0;
                products.map(val => {
                    bit = bit + val.product.bit;
                    businessData.productList.map(dd => {
                        if (dd.id === val.product.product_id) {
                            dd.count = dd.count + val.quantity;
                        }
                    });
                });

                products.map(val => {
                    var plist = businessData.productList.filter(pl => {
                        return pl.id === val.product.product_id;
                    });
                    if (plist.length === 0) {
                        Business.findOneAndUpdate({ key: 'main' },
                            { $push: { productList: {
                                        id: val.product.product_id,
                                        name: val.product.name,
                                        count: val.quantity
                                    }
                                }
                            }, (error, success) => {
                                if (error) {
                                    console.log('ErrPush');
                                } else {
                                    console.log('Pushed');
                                }
                        });
                    }
                });

                if (cpn) {
                    var cpnList = businessData.couponList.filter(coup => {
                        if (coup.code === cpn) {
                            coup.count += 1;
                        }
                        return coup.code === cpn;
                    });
                    if (cpnList.length === 0) {
                        Business.findOneAndUpdate({ key: 'main' },
                            { $push: { couponList: {
                                        code: cpn,
                                        count: 1
                                    }
                                }
                            }, (error, success) => {
                                if (error) {
                                    console.log('ErrPush');
                                } else {
                                    console.log('Pushed');
                                }
                        });
                    }
                }

                var locList = businessData.localityList.filter(loc => {
                    if (loc.name === locality) {
                        loc.count += 1;
                    }
                    return loc.name === locality;
                });
                if (locList.length === 0) {
                    Business.findOneAndUpdate({ key: 'main' }, 
                        { $push: { localityList: {
                                    name: locality,
                                    count: 1
                                }
                            } 
                        }, (error, success) => {
                            if (error) {
                                console.log('ErrPush');
                            } else {
                                console.log('Pushed');
                            }
                    });
                }

                if (device.toUpperCase() === 'IOS') {
                    businessData.platform.ios += 1;
                } else if (device.toUpperCase() === 'ANDROID') {
                    businessData.platform.android += 1;
                } else if (device.toUpperCase() === 'WEBSITE') {
                    businessData.platform.web += 1;
                }

                var totalItem = products.map(it => it.quantity).reduce((acc, val) => acc + val);

                businessData.orders = businessData.orders + 1;
                businessData.revenue = businessData.revenue + total;
                businessData.delivery = businessData.delivery + deliveryCharges;
                businessData.coupon = businessData.coupon + discount;
                businessData.bit = businessData.bit + bit;
                businessData.items = businessData.items + totalItem;

                businessData.save();
            } else {
                // create
                var bit = 0;
                let productArr = [];

                products.map(val => {
                    bit = bit + val.product.bit;
                    productArr.push({
                        id: val.product.product_id,
                        name: val.product.name,
                        count: val.quantity
                    });
                });

                var totalItem = products.map(it => it.quantity).reduce((acc, val) => acc + val);

                let data = new Business({
                    key: 'main',
                    from: istTime.toLocaleDateString("en-US", options),
                    orders: 1,
                    success: 0,
                    cancelled: 0,
                    revenue: total,
                    delivery: deliveryCharges,
                    coupon: discount,
                    bit: bit,
                    items: totalItem,
                    platform: {
                        ios: device.toUpperCase() === 'IOS' ? 1 : 0,
                        android: device.toUpperCase() === 'ANDROID' ? 1 : 0,
                        web: device.toUpperCase() === 'WEBSITE' ? 1 : 0,
                    },
                    productList: productArr,
                    couponList: cpn ? [{
                        code: cpn,
                        count: 1
                    }] : [],
                    localityList: [{
                        name: locality,
                        count: 1
                    }],
                    cancel_reason: []
                });
                data.save();
            }
        });
    },

    orderComplete: function (time, boy) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        Business.findOne({key: 'main'}, (err, businessData) => {
            if (businessData) {
                let total_time = 0;
                if (businessData.time_taken.length > 0) {
                    total_time = businessData.time_taken.reduce((acc, val) => acc + val);
                }
                businessData.time_taken_avg = Math.round((total_time + time) / (businessData.success + 1));

                businessData.success += 1;
                businessData.save();
                Business.findOneAndUpdate({ key: 'main' }, 
                    { $push: { time_taken: time } }, (error, success) => {
                        if (error) {
                            console.log('ErrPush');
                        } else {
                            console.log('Pushed');
                        }
                });
                if (boy) {
                    var boysList = businessData.delivered_by.filter(b => {
                        if (b.name === boy) {
                            b.count += 1;
                        }
                        return b.name === boy;
                    });
                    if (boysList.length === 0) {
                        Business.findOneAndUpdate({ key: 'main' },
                            { $push: { delivered_by: {
                                        name: boy,
                                        count: 1
                                    }
                                }
                            }, (error, success) => {
                                if (error) {
                                    console.log('ErrPush');
                                } else {
                                    console.log('Pushed');
                                }
                        });
                    }
                }
            } else {
                let data = new Business({
                    key: 'Extra Success Order, Rarest Case',
                    date: istTime.toLocaleDateString("en-US", options),
                    orders: 0,
                    success: 1,
                });
                data.save();
            }
        });
    },

    orderCancel: function (order, reason) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var productArr = [];

        Business.findOne({key: 'main'}, (err, businessData) => {
            if (businessData) {
                var bit = 0;
                businessData.cancelled += 1;

                order.items.map(pl => {
                    businessData.productList.map(dd => {
                        if (pl.product.product_id === dd.id) {
                            dd.count -= pl.quantity;
                            bit += pl.product.bit;
                        }
                    });
                });

                businessData.couponList.map(cc => {
                    if (cc.code === order.applied_coupon_name) {
                        cc.count -= 1;
                    }
                });

                if (order.cancel_reason) {
                    let reasonList = businessData.cancel_reason.filter(rl => {
                        if (rl.reason === order.cancel_reason) {
                            rl.count += 1;
                        }
                        return rl.reason === order.cancel_reason;
                    });                    
                    if (reasonList.length === 0) {
                        Business.findOneAndUpdate({ key: 'main' }, 
                            { $push: { cancel_reason: {
                                        reason: order.cancel_reason,
                                        count: 1
                                    }
                                } 
                            }, (error, success) => {
                                if (error) {
                                    console.log('ErrPush');
                                } else {
                                    console.log('Pushed');
                                }
                        });
                    }
                }

                var totalItem = order.items.map(it => it.quantity).reduce((acc, val) => acc + val);

                businessData.items -= totalItem;
                businessData.revenue -= order.total_price;
                businessData.delivery -= order.delivery_charge;
                businessData.coupon -= order.applied_coupon_discount;
                businessData.bit -= bit;
                businessData.save();
            } else {
                order.items.map(p => {
                    productArr.push({
                        id: p.product.product_id,
                        name: p.product.name,
                        count: 1
                    });
                });
                let data = new Business({
                    key: 'Extra cancel Order, Rarest Case',
                    date: istTime.toLocaleDateString("en-US", options),
                    orders: 0,
                    cancelled: 1,
                    productList: productArr
                });
                data.save();
            }
        });
    }
};
