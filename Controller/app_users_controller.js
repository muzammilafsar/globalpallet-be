var mongoose = require('mongoose');
var AppUsers = mongoose.model('AppUsers');

exports.getAppUsers = (req, res) => {
    AppUsers.find({}, (err, users) => {
        if(err) {
            res.send('inetrnal error', err);
        } 
        res.json(users);
    });
} 

exports.newAppUser = (req, res) => {
    var user = new AppUsers();
    user.ipAddress = req.body.ip;
    user.platform = req.body.platform;
    user.version = req.body.version;
    user.isPad = req.body.isPad;
    user.save((err, use) => {
        if (err) {
            res.status(400).send({
                message: 'Interal Server Error',
                error: err
            });
        }
        res.status(200).send({ message: use.reverse() });
    })
} 
