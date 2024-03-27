var mongoose = require('mongoose');
var Address = mongoose.model('Address');
var User = mongoose.model('User');

exports.getAllAddressesList = (req, res) => {
    Address.find({}).sort({ user: 1 }).exec((err, add) => {
        if(err) {
            res.send(err);
        } else {
            res.json({
                document: 'List of All Addresses in Database',
                add: add
            });
        }
    });
}

exports.getUserAddress = (req, res) => {
    User.findOne({ mobile: req.decodedUserData.mobile }, {
            'address': {
                $elemMatch: { _id: req.body.id } 
            } 
        }, (err, user) => {
        if(err) {
            res.send(err);
        } else if (user) {
            res.send({
                address: user.address[0], 
                status: 200
            });
        } else {
            res.status(300).send({
                message: 'user hasnt ordered yet',
                code: 300
            });
        }
    });
}

exports.getAllUserAddress = (req, res) => {
    User.findOne({mobile: req.decodedUserData.mobile}, (err, user) => {
        if(err) {
            res.send(err);
        } else {
            res.send(user.address);
        }
    });
}

exports.addUserAddress = (req, res) => {
    User.findOneAndUpdate({ mobile: req.decodedUserData.mobile },
        { $push: { address: req.body.address } }, (error, success) => {
            if (error) {
                res.status(400).send(error);
            } else {
                let address = new Address({
                    address: req.body.address,
                    user: req.decodedUserData.mobile
                });
                address.save();
                res.status(200).send('Success');
            }
    });
}

exports.editUserAddress = (req, res) => {
    User.findOne({ mobile: req.decodedUserData.mobile }, (err, user) => {
        if(err) {
            res.send('address not found');
        } else {
            let add = req.body.address;
            User.update({'address._id': req.body.id}, {'$set': {
                'address.$.title': add.title,
                'address.$.first_name': add.first_name,
                'address.$.address': add.address,
                'address.$.address2': add.address2,
                'address.$.locality': add.locality,
                'address.$.state': add.state,
                'address.$.pincode': add.pincode
            }}, (err, success) => {
                if(err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send(success);
                }  
            })
        }
    });
}

exports.deleteUserAddress = (req, res) => {
    User.findOne({mobile: req.decodedUserData.mobile}, (err, success) => {
        if (err) {
            res.send('address not found');
        } else {
            User.update({'address._id': req.body.id}, 
            { $pull: {address: { _id: req.body.id } }  }, (err, success) => {
                if(err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send(success)
                }
            });
        }
    });
}
