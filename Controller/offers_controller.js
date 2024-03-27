var mongoose = require('mongoose');
var Offer = mongoose.model('Offer');

exports.get_all_offer = (req, res) => {

    Offer.find({}).sort({index: 1}).exec((err, offer) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(offer);
    });
}
exports.get_offer = (req, res) => {

    Offer.findById(req.body.id, (err, offer) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(offer);
    });
}

exports.create_offer = (req, res) => {
    let offer = new Offer(req.body.offer);
    offer.save((err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(caro);
    })
}

exports.delete_offer = (req, res) => {
    Offer.findByIdAndRemove(req.body.id, (err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('deleted');
    });
}
exports.edit_offer = (req, res) => {
    Offer.findByIdAndUpdate(req.body.id, req.body.offer, (err, offer) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('updated');
    });
}