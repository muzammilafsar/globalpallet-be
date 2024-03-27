var mongoose = require('mongoose');
var Delivery = mongoose.model('Delivery');

exports.getDeliveryReport = (req, res) => {
    Delivery.find({}, (err, deliv) => {
        if (err) {
            res.send('Interal Server Error');
        } else if (deliv) {
            res.json(deliv);
        }
    });
}

exports.getDailyBoyData = (req, res) => {
    let date = new Date();
        var currentOffset = date.getTimezoneOffset();
        var istOffset = 330;
        var istTime = new Date(date.getTime() + (istOffset + currentOffset) * 60000);
        let key = istTime.getDate() + ' ' + (istTime.getMonth() + 1) + ' ' + istTime.getFullYear();

    Delivery.findOne({ key: key }, (err, deliv) => {
        if (err) {
            res.send('Interal Server Error');
        } else if (deliv) {
            if (deliv.deliveries) {                
                let file = deliv.deliveries.filter(c => c.boy === req.body.boy);
                if (file.length > 0) {
                    res.json({
                        code: 1,
                        boyData: file[0],
                        message: 'success'
                    });
                } else {
                    res.json({
                        code: 0,
                        boyData: '',
                        message: 'You did not get any assigns today'
                    });
                }
            } else {
                res.json({
                    code: 0,
                    boyData: '',
                    message: 'Error: Internal Error'
                });
            }
        } else {
            res.json({
                code: 0,
                boyData: '',
                message: 'Delivery service has not yet started for today.'
            });
        }
    });
}
