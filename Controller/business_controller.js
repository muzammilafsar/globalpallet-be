var mongoose = require('mongoose');
var Business = mongoose.model('Business');

exports.getBusinessReports = (req, res) => {
    Business.findOne({key: 'main'}, (err, businessData) => {
        if (err) {
            res.status(400).json('Interal Server Error');
        } else {
            if (businessData) {
                res.status(200).json(businessData);
            } else {
                res.status(400).json([]);
            }
        }
    });
}

exports.resetBusinessData = (req, res) => {
    Business.findOne({key: 'main'}, (err, businessData) => {
        if (!businessData) {
            res.json({ status: 205, message: "unable to update" });
        }
        else {
            let date = new Date();
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            businessData.key = 'over';
            businessData.till = date.toLocaleDateString("en-US", options);

            businessData.save().then(() => {
                res.json('Reset Business Data Successful.');
            }).catch(err => {
                res.status(400).send('reset failed');
            });
        }
    });
}

exports.getOldBusinessReports = (req, res) => {
    Business.find({ key: 'over' }, (err, over) => {
        if (err) {
            res.status(400).send({
                message: 'error',
                error: err
            });
        } else if (over) {
            res.status(200).json(over.reverse());
        }
    });
}
