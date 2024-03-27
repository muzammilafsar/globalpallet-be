var mongoose = require('mongoose');
var Carousel = mongoose.model('Carousel');

exports.get_all_carousel = (req, res) => {

    Carousel.find({}).sort({index: 1}).exec((err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(caro);
    });
}

exports.get_carousel = (req, res) => {
    Carousel.findOne({_id: req.body.id}, (err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(caro);
    });
}

exports.create_carousel = (req, res) => {
    let carousel = new Carousel(req.body.carousel);
    carousel.save((err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(caro);
    })
}

exports.delete_carousel = (req, res) => {
    Carousel.findByIdAndRemove(req.body.id, (err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('deleted');
    });
}
exports.edit_carousel = (req, res) => {
    console.log(req.body);
    Carousel.findOneAndUpdate({_id: req.body.id}, req.body.carousel, (err, caro) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('updated');
    });
}