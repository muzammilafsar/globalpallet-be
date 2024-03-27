var mongoose = require('mongoose');
var Locality = mongoose.model('Localities');

exports.get_locality = function (req, res) {

    Locality.find({}).sort({index: 1}).exec((err, locality) => {
        if(err) {
        res.send('inetrnal error', err);
        } 
        res.json(locality);
    });
    } 

exports.get_locality_by_id = (req, res) => {
    let id = req.params.id;
    Locality.findById(id, (err, loc) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(loc);
    });
}

exports.edit_locality = (req, res) => {
    Locality.findByIdAndUpdate(req.body.id, req.body.locality, (err, locality) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json('updated');
    });
}

exports.create_locality = (req, res) => {
    let locality = new Locality(req.body);
    locality.save().then(locality => {
        res.status(200).json({ 'locality': 'Added successfully' });
    })
    .catch(err => {
        res.status(400).send('Failed to create new record');
    });
    
    // (err, locality) => {
    //     if (err) {
    //         res.send('Interal Server Error', err);
    //     }
    //     res.json(locality);
    // });
}

// exports.create_locality = (req, res) => {
//     let locality = new Locality(req.body);
//     locality.save()
//         .then(locality => {
//             res.status(200).json({ 'locality': 'Added successfully' });
//         })
//         .catch(err => {
//             res.status(400).send('Failed to create new record');
//         });
// }

exports.delete_locality = (req, res) => {
    Locality.findByIdAndRemove(req.body.id, (err, locality) => {
        if(err) { res.json(err); }
        else { res.json('removed locality'); }
    });
}


