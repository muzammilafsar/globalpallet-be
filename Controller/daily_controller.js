var mongoose = require('mongoose');
var Daily = mongoose.model('Daily');


exports.getDailyReports = (req, res) => {
    Daily.find({}, (err, dailyData) => {
        if (err) {
            res.send('Interal Server Error');
        } else if (dailyData) {
            res.json(dailyData.reverse());
        }
    });
}
