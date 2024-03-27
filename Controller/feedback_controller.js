var mongoose = require('mongoose');
var Feedback = mongoose.model('Feedback');
var User = mongoose.model('User');

exports.getAllFeedbacks = (req, res) => {

    Feedback.find({}, (err, fdbck) => {
        if (err) {
            res.send('Feedback Error');
        } else {
            res.json(fdbck);
        }
    });
}

exports.newFeedback = (req, res) => {
    let mob = req.decodedUserData.mobile;
    let feedback = new Feedback();
    feedback.mobile = mob;
    feedback.name = req.body.name;
    feedback.order_special_id = req.body.order;
    feedback.rating = req.body.feedback;

    feedback.save((err, fdb) => {
        if (err) {
            res.send(err);
        } else {
            res.send({
                message: 'Feedback is submitted',
                status: 200,
                feedback: fdb
            });
            User.findOne({ mobile: mob }, (err, user) => {
                if (user) {
                    user.last_order.feedback = false;
                    user.detail.appVersion = req.body.appVersion;
                    user.save();
                } else {
                    console.log('invalid user');
                }
            });
        }
    });
}

exports.cancelFeedback = (req, res) => {
    let mob = req.decodedUserData.mobile;
    User.findOne({ mobile: mob }, (err, user) => {
        if (user) {
            user.last_order.feedback = false;
            user.save();
            res.status(200).send('done');
        } else {
            res.status(400).send('cancel');
        }
    });
}
