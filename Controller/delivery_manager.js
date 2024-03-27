var mongoose = require('mongoose');
var Delivery = mongoose.model('Delivery');
var Admin = mongoose.model('Admin');

module.exports = {
    assignOrder: function (boy) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        Delivery.findOne({key: key}, (err, delData) => {
            if (delData) {
                delData.orders += 1;
                delData.save();
                
                if (boy) {
                    var boysList = delData.deliveries.filter(b => {
                        if (b.boy === boy) {
                            b.total_orders += 1;
                            b.assigned_orders += 1;
                        }
                        return b.boy === boy;
                    });
                    if (boysList.length === 0) {
                        Delivery.findOneAndUpdate({ key: key },
                            { $push: { deliveries: {
                                        boy: boy,
                                        total_orders: 1,
                                        assigned_orders: 1,
                                        total_collection: 0,
                                        cancelled: 0,
                                        delivery_count: 0
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
                    Admin.findOne({ username: boy }, (err, adm) => {
                        if (!err && adm) {
                            adm.orders_assigned += 1;
                            adm.save();
                        }
                    });   
                }
            } else {
                let del = new Delivery({
                    key: key,
                    date: istTime.toLocaleDateString("en-US", options),
                    total_collection: 0,
                    orders: 1,
                    success: 0,
                    cancel: 0,
                    deliveries: [{
                        boy: boy,
                        delivery_count: 0,
                        cancelled: 0,
                        total_collection: 0,
                        assigned_orders: 1,
                        total_orders: 1
                    }]
                });
                del.save();
                Admin.findOne({ username: boy }, (err, adm) => {
                    if (!err && adm) {
                        adm.orders_assigned += 1;
                        adm.save();
                    }
                });   
            }
        });
    },
    
    orderComplete: function (value, boy) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        Delivery.findOne({key: key}, (err, delData) => {
            if (delData) {
                delData.success += 1;
                delData.save();
                
                if (boy) {
                    var boysList = delData.deliveries.filter(b => {
                        if (b.boy === boy) {
                            b.delivery_count += 1;
                            b.total_collection += value;
                        }
                        return b.boy === boy;
                    });
                    if (boysList.length === 0) {
                        Delivery.findOneAndUpdate({ key: key },
                            { $push: { deliveries: {
                                        boy: boy,
                                        delivery_count: 1,
                                        cancelled: 0,
                                        total_collection: value,
                                        assigned_orders: 1, // check later
                                        total_orders: 1
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
                    Admin.findOne({ username: boy }, (err, adm) => {
                        if (!err && adm) {
                            adm.deliveries += 1;
                            adm.save();
                        }
                    });
                }
            } else {
                // only runs if first assign-orders happens after delivery of that day
                let del = new Delivery({
                    key: key,
                    date: istTime.toLocaleDateString("en-US", options),
                    total_collection: value,
                    orders: 1,
                    success: 1,
                    cancel: 0,
                    deliveries: [{
                        boy: boy,
                        delivery_count: 1,
                        cancelled: 0,
                        total_collection: value,
                        assigned_orders: 1,
                        total_orders: 1
                    }]
                });
                del.save();
                Admin.findOne({ username: boy }, (err, adm) => {
                    if (!err && adm) {
                        adm.deliveries += 1;
                        adm.save();
                    }
                });
            }
        });
    },

    orderCancel: function (boy) {
        let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        Delivery.findOne({key: key}, (err, delData) => {
            if (delData) {
                delData.cancel += 1;

                delData.deliveries.map(del => {                    
                    if (del.boy === boy) {
                        del.cancelled += 1;
                    }
                });
                delData.save();      
                Admin.findOne({ username: boy }, (err, adm) => {
                    if (!err && adm) {
                        adm.cancellations += 1;
                        adm.save();
                    }
                });          
            } else {
                let data = new Delivery({
                    key: 'Extra cancel Order, Rarest Case',
                    date: istTime.toLocaleDateString("en-US", options),
                    total_collection: 0,
                    orders: 1,
                    success: 0,
                    cancel: 1,
                    deliveries: [{
                        boy: boy,
                        delivery_count: 1,
                        cancelled: 0,
                        total_collection: 0,
                        assigned_orders: 1
                    }]
                });
                data.save();
                Admin.findOne({ username: boy }, (err, adm) => {
                    if (!err && adm) {
                        adm.cancellations += 1;
                        adm.save();
                    }
                });   
            }
        });
    }
};
