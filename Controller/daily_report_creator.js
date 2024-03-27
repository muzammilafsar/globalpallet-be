var mongoose = require('mongoose');
var Daily = mongoose.model('Daily');

module.exports = {
    orderPlace: function (products, total, deliveryCharges, cpn, discount, device, locality) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        Daily.findOne({key: key}, (err, dailyData) => {
            console.log('KEYY', key);
            
            if (dailyData) {
                // add
                var bit = 0;     
                products.map(val => {
                    bit = bit + val.product.bit;
                    dailyData.productList.map(dd => {
                        if (dd.id === val.product.product_id) {
                            dd.count = dd.count + val.quantity;
                        }
                    });
                });

                products.map(val => {
                    var plist = dailyData.productList.filter(pl => {
                        return pl.id === val.product.product_id;
                    });
                    if (plist.length === 0) {
                        Daily.findOneAndUpdate({ key: key }, 
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
                    var cpnList = dailyData.couponList.filter(coup => {
                        if (coup.code === cpn) {
                            coup.count += 1;
                        }
                        return coup.code === cpn;
                    });
                    if (cpnList.length === 0) {
                        Daily.findOneAndUpdate({ key: key }, 
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

                var locList = dailyData.localityList.filter(loc => {
                    if (loc.name === locality) {
                        loc.count += 1;
                    }
                    return loc.name === locality;
                });
                if (locList.length === 0) {
                    Daily.findOneAndUpdate({ key: key }, 
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

                Daily.findOneAndUpdate({ key: key }, 
                    { $push: { times: Date.now()} 
                    }, (error, success) => {
                        if (error) {
                            console.log('ErrPush');
                        } else {
                            console.log('Pushed');
                        }
                });

                if (device.toUpperCase() === 'IOS') {
                    dailyData.platform.ios += 1;
                } else if (device.toUpperCase() === 'ANDROID') {
                    dailyData.platform.android += 1;
                } else if (device.toUpperCase() === 'WEBSITE') {
                    dailyData.platform.web += 1;
                }

                var totalItem = products.map(it => it.quantity).reduce((acc, val) => acc + val);
                
                dailyData.orders = dailyData.orders + 1;
                dailyData.revenue = dailyData.revenue + total;
                dailyData.delivery = dailyData.delivery + deliveryCharges;
                dailyData.coupon = dailyData.coupon + discount;
                dailyData.bit = dailyData.bit + bit;
                dailyData.items = dailyData.items + totalItem;
                
                dailyData.save();                
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
                
                let data = new Daily({
                    key: key,
                    date: istTime.toLocaleDateString("en-US", options),
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
                    times: [Date.now()],
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
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        Daily.findOne({key: key}, (err, dailyData) => {
            if (dailyData) {
                let total_time = 0;
                if (dailyData.time_taken.length > 0) {
                    total_time = dailyData.time_taken.reduce((acc, val) => acc + val);
                }
                dailyData.time_taken_avg = Math.round((total_time + time) / (dailyData.success + 1));
                dailyData.success += 1;
                dailyData.save();
                Daily.findOneAndUpdate({ key: key }, 
                    { $push: { time_taken: time } }, (error, success) => {
                        if (error) {
                            console.log('ErrPush');
                        } else {
                            console.log('Pushed');
                        }
                });
                if (boy) {
                    var boysList = dailyData.delivered_by.filter(b => {
                        if (b.name === boy) {
                            b.count += 1;
                        }
                        return b.name === boy;
                    });
                    if (boysList.length === 0) {
                        Daily.findOneAndUpdate({ key: key },
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
                // let yes = new Date(new Date().setDate(new Date().getDate() - 1));
                // Daily.findOne({key: yes.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear()}, (err, yesterday) => {
                    // if (yesterday) {
                    //     yesterday.success += 1;
                    //     yesterday.save();
                    // } else {
                        // never run
                        // happens when we cancel order the next day
                        let data = new Daily({
                            key: 'Extra Success Order, Rarest Case',
                            date: istTime.toLocaleDateString("en-US", options),
                            orders: 0,
                            success: 1,
                        });
                        data.save();
                    // }
                // });
            }
        });
    },

    orderCancel: function (order, reason) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var productArr = [];
        
        Daily.findOne({key: key}, (err, dailyData) => {
            if (dailyData) {
                var bit = 0;
                dailyData.cancelled += 1;

                order.items.map(pl => {
                    dailyData.productList.map(dd => {
                        if (pl.product.product_id === dd.id) {
                            dd.count -= pl.quantity;
                            bit += pl.product.bit;
                        }
                    });
                });

                dailyData.couponList.map(cc => {                    
                    if (cc.code === order.applied_coupon_name) {
                        cc.count -= 1;
                    }
                });

                if (order.cancel_reason) {
                    let reasonList = dailyData.cancel_reason.filter(rl => {
                        if (rl.reason === order.cancel_reason) {
                            rl.count += 1;
                        }
                        return rl.reason === order.cancel_reason;
                    });
                    if (reasonList.length === 0) {
                        Daily.findOneAndUpdate({ key: key }, 
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

                dailyData.items -= totalItem;
                dailyData.revenue -= order.total_price;
                dailyData.delivery -= order.delivery_charge;
                dailyData.coupon -= order.applied_coupon_discount;
                dailyData.bit -= bit;
                dailyData.save();                
            } else {
                // let yes = new Date(new Date().setDate(new Date().getDate() - 1));
                // Daily.findOne({key: yes.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear()}, (err, yesterday) => {
                    // if (yesterday) {
                    //     console.log('Yesterday Order hai ye');
                        
                    //     var bit = 0;
                    //     yesterday.cancelled += 1;

                    //     order.items.map(pl => {
                    //         yesterday.productList.map(dd => {
                    //             if (pl.product.product_id === dd.id) {
                    //                 dd.count -= pl.quantity;
                    //                 bit += pl.product.bit;
                    //             }
                    //         });
                    //     });

                    //     yesterday.couponList.map(cc => {
                    //         if (cc.code === order.cpn) {
                    //             cc.count -= 1;
                    //         }
                    //     });

                    //     var totalItem = order.items.map(it => it.quantity).reduce((acc, val) => acc + val);

                    //     yesterday.items -= totalItem;
                    //     yesterday.revenue -= order.total_price;
                    //     yesterday.delivery -= order.delivey_charge;
                    //     yesterday.coupon -= order.applied_coupon_discount;
                    //     yesterday.bit -= bit;
                    //     yesterday.save();
                    // } else {
                        // never run
                        order.items.map(p => {
                            productArr.push({
                                id: p.product.product_id,
                                name: p.product.name,
                                count: 1
                            });
                        });
                        let data = new Daily({
                            key: 'Extra cancel Order, Rarest Case',
                            date: istTime.toLocaleDateString("en-US", options),
                            orders: 0,
                            cancelled: 1,
                            productList: productArr
                        });
                        data.save();
                    // }
                // });
            }
        });
    }
};
