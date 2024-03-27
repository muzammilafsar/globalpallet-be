var mongoose = require('mongoose');
var Constant = mongoose.model('Constant');

exports.get_all_constants = (req, res) => {

    Constant.find({}, (err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        } else {
            res.json(caro);
        }
    });
}
exports.get_constant = (req, res) => {
    Constant.findOne({key: req.body.key}, (err, cons) => {
        if (err) {
            res.status(400).send(err);
        } else if (cons) {
            res.status(200).json({
                _id: cons._id,
                constants: JSON.parse(cons.constants),
                key: cons.key
            });
        } else {
            res.status(400).send('Contants undefined error');
        }
    });
}

exports.get_constants_by_id = (req, res) => {

    Constant.findById(req.body.id, (err, constant) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(constant);
    });
}

exports.delete_constant = (req, res) => {
    Constant.findOneAndRemove({key: req.body.key}, (err, cons) => {
        if (err) {
            res.send('Interal Server Error', err);
        } else {
            res.send('deleted');
        }
    })
}
exports.createConstant = (req, res) => {
    let constant = new Constant();
    constant.key = req.body.key;
    constant.constants = JSON.stringify(req.body.constants);
    constant.save((err, cpn) => {
        if (err) {
            res.send(err);
        } else {
            res.send({message: 'created successfully',
            constant: cpn});
        }
    });
}
exports.edit_constant = (req, res) => {
    Constant.findOneAndUpdate({key: req.body.key}, {constants: req.body.constants}, (err, caro) => {  //  {constants: JSON.stringify(req.body.constants)}
        if (err) {
            res.send(err);
        }
        res.json('updated');
    });
}