var mongoose = require('mongoose');
var OtpHistory = mongoose.model('OtpHistory');

exports.getOtpHistory = (req, res) => {
    OtpHistory.find({}, (err, history) => {
        if(err) {
            res.send('inetrnal error', err);
        } 
        res.json(history.reverse());
    });
} 
