var mongoose = require('mongoose');
var CancelReason = mongoose.model('CancelReason');

exports.getCancelReasons = (req, res) => {
    CancelReason.find({}, (err, reasons) => {
        if (err) {
            res.status(400).send(err);
        } else if (reasons) {
            res.status(200).json(reasons);
        } else {
            res.status(400).send('Undefined cancel reason error');
        }
    });
}

exports.createCancelReason = (req, res) => {
    let newReason = new CancelReason({
        key: req.body.key,
        reason: req.body.reason,
        code: req.body.code,
        user_access: req.body.user_access
    });
    newReason.save().then(() => {
        res.status(200).send('Added successfully');
    })
    .catch(() => {
        res.status(400).send('Failed to create new record');
    });
}
