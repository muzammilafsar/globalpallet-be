var jwt = require('jsonwebtoken');
var Admin = require('../Models/AdminModel');

exports.admin_login = async (req, res) => {
    try {
        let admin = await Admin.findOne({username: req.body.username, password: req.body.password});
        // console.log(admin, req.body.username, req.body.password);
        if (admin) {
            var token = jwt.sign({ email: req.body.email }, process.env.adminAuthKey, {expiresIn: '7d'});
            res.send({
                type: 'success',
                expiresIn: 604800,
                token,
                message: 'Authentication Successfull',
                name: admin.name,
                designation: admin.designation,
                username: admin.username,
                mobile: admin.mobile,
                photograph: admin.photograph,
                deliveries: admin.deliveries,
                cancellations: admin.cancellations,
                orders: admin.orders_assigned
            })  
        }
        else {
            res.send({
                type: 'error',
                message: 'email or password is incorrect'
            }) 
        }
    } catch(err) {
        res.sendStatus(500);
    }
} 

exports.create_admin = (req, res) => {
    let admin = new Admin(req.body);
    admin.save((err, ad) => {
        if (err) {
            res.status(400).send('Error, Cannot Add');
        } else if (ad) {
            res.status(200).send({
                message: 'Admin is Created',
                admin: ad
            });
        }
    });
}

exports.getCompleteBoys = (req, res) => {
    Admin.find({}, (err, bb) => {
        if(err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(bb);
        }
    })
}

exports.getDeliveryBoysList = (req, res) => {
    Admin.find({ delivers: true }, (err, boys) => {
        if (err) {
            res.status(400).send('Error');
        } else if (boys) {
            let boysList = boys.map(b => {
                return {
                    name: b.name,
                    username: b.username,
                    email: b.email,
                    designation: b.designation,
                    photograph: b.photograph
                };
            });
            res.status(200).json({
                message: 'success',
                boys: boysList
            });
        }
    });
}

exports.getDeliveryBoysById = (req, res) => {
    Admin.findOne({ _id: req.body.id }, (err, boy) => {
        if (err) {
            res.send('no record found', err);
        }
        res.json(boy);
    });
}

exports.editDeliveryBoy = (req, res) => {
    console.log(req.body);
    Admin.findOneAndUpdate({ _id: req.body.id }, req.body.boy, (err, boy) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('updated');
    });
}
exports.deleteDeliveryBoy = (req, res) => {
    Admin.findByIdAndRemove(req.body.id, (err, boy) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('deleted');
    });
}

exports.getBoyStats = (req, res) => {
    Admin.findOne({ username: req.body.boy }, (err, boy) => {
        if (err) {
            res.status(400).send(err);
        } else if (boy) {
            res.status(200).json({
                message: 'success',
                stats: {
                    orders: boy.orders_assigned,
                    success: boy.deliveries,
                    cancel: boy.cancellations
                }
            });
        } else {
            res.status(400).send('Undefied Error');
        }
    });
}
