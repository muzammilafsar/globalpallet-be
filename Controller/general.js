var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var CustomerContact = mongoose.model('CustomerContacts');
var PartyOrder = mongoose.model('PartyOrders');

exports.indexResponse = (req, res) => {
    res.status(200).send('Hello Admin! Server is working fine, You are good to go. :)');
}

exports.getMainsIndex = (req, res) => {
    Order.find({
        order_cancelled: false,
        order_completed: false
    }, (err1, orders) => {
        if (err1) {
            res.send(err1);
        } else {
            CustomerContact.find({ resolved: false }, (err2, issue)=> {
                if (err2) {
                    res.json(err2);
                } else {
                    PartyOrder.find({ resolved: false }, (err3, party)=> {
                        if (err3) {
                            res.json(err3);
                        } else {                            
                            res.send({
                                orders: orders.length,
                                issues: issue.length,
                                party: party.length
                            });
                        }
                    });
                }
            });
        }
    });
}
