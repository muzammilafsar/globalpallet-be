'use strict';
var fetch = require('node-fetch');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
const querystring = require('querystring');
const msg91key = process.env.msg91;
var User = mongoose.model('User');
const uuidv4 = require("uuid/v4");
const constants = require('../constants');
var OtpHistory = mongoose.model('OtpHistory');
console.log(process.env)
const client = require('twilio')(process.env.twilioAppID, process.env.twilioAppSecret);

 var sendEmail = (email,link) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password
        },
        tls: { rejectUnauthorized: false }
      });

      const mailOptions = {
        from: "88o2868625@gmail.com", // sender address
        to: `${email}`, // list of receivers
        subject: `Email verification`, // Subject line
        html: `<h1>${constants.baseUrl}${link}</h1>` // plain text body
      };
      transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        else console.log(info);
      });
}
exports.register_user = (req, res) => {
    let verificationLink = uuidv4();
    let newUser = User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        email_verification_code: verificationLink
    });
    newUser.save((err, user) => {
        if (err) {
            console.log(err);
            res.send({
                status: 400,
                message: 'already registerd',
                data: err

            });
        } else {
            res.send({
                status: 200,
                message: 'registerd successfully',
                email: req.body.email
            });
            sendEmail(req.body.email,verificationLink);
        }

    });

}
exports.login = (req, res) => {
    let id= uuidv4();
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.send({
                status: 405,
                message: "system error"
            });
        } else {
            if (user === null) {
                res.send({
                    status: 401,
                    message: "not registered",
                    id: id
                });
            }
            else {
                if (user.password !== req.body.password) {
                    res.send({
                        status: 402,
                        message: "incorrect password"
                    });
                }
                else if (user.password === req.body.password && user.email_verified === true) {
                    res.send({
                        status: 200,
                        user: {
                            email: user.email,
                            name: user.name,
                            image: ''
                        }
                    });
                } else if (user.password === req.body.password && user.email_verified === false) {
                    res.send({
                        status: 201,
                        user: {
                            message: 'email not verified'
                        }
                    });
                }

            }
        }
    });
    
}

exports.sendOtp = (req, res) => {
    let mobile = `+1${req.body.mobile}`;
    client.verify.v2.services(process.env.twilioServiceID)
    .verifications
    .create({to: mobile, channel: 'sms'})
    .then(val => {
        res.send({
            a:val.sid
        });
        OtpHistory.findOne({mobile: req.body.mobile}, (err, user) => {
            if(user) {
                user.sendOtpCount = user.sendOtpCount + 1;
                user.save();
            } else {
                let cust = new OtpHistory({ mobile: req.body.mobile });
                cust.save();
            }
        });
    });
};

exports.resendOtp = (req, res) => {
    let mobile = `+1${req.body.mobile}`;
    client.verify.v2.services(process.env.twilioServiceID)
    .verifications
    .create({to: mobile, channel: 'sms'})
    .then(val => {
        res.send({
            a:val.sid
        });
        OtpHistory.findOne({mobile: req.body.mobile}, (err, user) => {
            if(user) {
                user.sendOtpCount = user.sendOtpCount + 1;
                user.save();
            } else {
                let cust = new OtpHistory({ mobile: req.body.mobile });
                cust.save();
            }
        });
    });
};

exports.verifyOtp = (req, res) => {
    let mobile = `+1${req.body.mobile}`;
    let otp = (req.body.otp);
    var token = jwt.sign({ mobile: mobile }, process.env.authkey, {expiresIn: '360d'});  

    client.verify.v2.services(process.env.twilioServiceID)
      .verificationChecks
      .create({to: mobile, code: otp})
      .then(val => {
        if(val['status'] === 'approved') {
            res.send({
                type: 'success',
                auth: token
            });
            User.findOne({ mobile: mobile }, (err, user) => {
                if (err) {
                    console.log('loginfy error');
                } else {
                    if (user) {
                        console.log('Old user');
                    } else {
                        let newUser = new User({
                            mobile,
                            address: []
                        });
                        newUser.save();
                    }
                }
            });
            OtpHistory.findOne({mobile: req.body.mobile}, (err, user) => {
                if(user) {
                    user.verifyOtpCount = user.verifyOtpCount + 1;
                    user.verified = true;
                    user.save();
                }
            });
        } else {
            res.send({
                ...val
            });
        }

    });
    // res.send({
    //     type: 'success',
    //     auth: token
    // });
};

exports.generatejwt = (req, res ) => {
    let key = 'apnakaam';
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    // jwt.sign({ foo: 'bar' }, key, { algorithm: 'RS256' }, function(err, token) {
        res.send({auth: token});
    //   });
}
exports.verifyJwt = (req, res) => {
    var decoded = jwt.verify(req.body.auth, 'shhhh');
    res.send({auth: decoded});
}

exports.getUserData = (req, res) => {
    User.findOne({mobile: req.decodedUserData.mobile}, (err, user) => {
        if(err) {
            res.send(err);
        } else if (user) {
            res.send({
                status: 200,
                userData: {
                    name: user.name,
                    mobile: user.mobile,
                    total_orders: user.total_orders,
                    cancelled_orders: user.cancelled_orders,
                    completed_orders: user.completed_orders,
                    user_flag_important: user.user_flag_important,
                    user_flag_danger: user.user_flag_danger,
                    favourites: user.favourites,
                    goldMember: user.goldMember,
                    wallet_balance: user.wallet_balance,
                    last_order: user.last_order,
                    notice: user.notice,
                    walletThreshold: user.detail.walletThreshold
                }
            });
        } else {
            res.send({
                status: 209,
                code: 'nouser'
            });
        }
    })
}

exports.updateFavourite = (req, res) => {
    User.findOne({mobile: req.decodedUserData.mobile}, (err, users) => {
        if (!users)
             res.send({ status: 205, message: "unable to update" });
        else {
            users.favourites = req.body.favourites;
            users.save().then(() => {
                res.json('Favourites Updated');
            }).catch(err => {
                res.status(400).send(err);
            });
        }
    });
}

exports.updateCartItems = (req, res) => {
    User.findOne({mobile: req.decodedUserData.mobile}, (err, users) => {
        if (!users)
             res.send({ status: 205, message: "unable to update" });
        else {
            users.itemsInCart = req.body.itemsInCart;
            users.save().then(() => {
                res.json('CartList Updated');
            }).catch(err => {
                res.status(400).send(err);
            });
        }
    });
}

exports.getAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if( err) {
            res.send(err);
        } else {
            res.send(users);
        }
    })
}
exports.get_user_by_id = (req, res) => {

    User.findById(req.params.id, (err, users) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(users);
    });
}

exports.edit_user = (req, res) => {
    try {
        User.findByIdAndUpdate(req.body.id, req.body.users, (err, users) => {
            if (err) {
                res.send('Interal Server Error', err);
            }
            res.json('updated');
        });

    } catch(err) {
        res.send(err);
    }
} 

exports.updateUserRemarks = (req, res) => {
    User.findOneAndUpdate({ mobile: req.body.mobile },
        { $set: 
            { remarks: req.body.remarks }
        }, (error, success) => {
            if (error) {
                res.status(400).send(error);
            } else if (success) {
                Order.findOneAndUpdate({ user: req.body.mobile },
                    { $set: { user_remarks: req.body.remarks, status_note: req.body.note }
                    }, (err, done) => {
                        if (err) {
                            res.status(400).send(err);
                        } else if (done) {
                            res.status(200).send('Remarks updated');
                        } else {
                            res.status(400).send('remarks error');
                        }
                });
            } else {
                res.status(400).send('undefined remarks error');
            }
    });
};

exports.noticeRead = (req, res) => {
    let mobile = req.decodedUserData.mobile;
    User.findOne({ mobile }, (err, user) => {
        if (user) {
            user.notice.show = false;
            user.notice.message = '';
            user.save();
            res.status(200).send('done');
        } else {
            res.status(400).send('cancel');
        }
    });
}

exports.ratedApp = (req, res) => {
    let mobile = req.decodedUserData.mobile;
    User.findOne({ mobile }, (err, user) => {
        if (user) {
            user.notice.rate = false;
            user.save();
            res.status(200).send('done');
        } else {
            res.status(400).send('cancel');
        }
    });
}
