var mongoose = require('mongoose');
var PartyOrder = mongoose.model('PartyOrders');

exports.get_all_party_orders = function (req, res) {

    PartyOrder.find({}, function (err, partyorder) {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(partyorder);
    });
}

exports.get_party_orders_by_id = function (req, res) {
    let id = req.params.id;
    PartyOrder.findById(id, (err, prod) => {
        if (err) {
            res.send('404', err);
        }
        res.send({
            status: 200,
            partyorder: prod
        });
    });
}

exports.create_party_orders = (req, res) => {
    let partyorder = new PartyOrder(req.body);
    partyorder.save()
        .then(partyorder => {
            res.status(200).json({ 'partyorder': 'Added successfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
}

exports.delete_party_orders = (req, res) => {
    PartyOrder.findByIdAndRemove({_id: req.params.id}, (err, partyorder)=> {
        if (err)
        res.json(err);
        else 
        res.json('removed successfully');
    });
}

exports.partyRequestComplete = (req, res) => {
    PartyOrder.findById(req.params.id, (err, party)=> {
        if (err) {
            res.json(err);
        } else {
            party.resolved = true;
            party.resolved_time = Date.now();
            party.save()
            .then(() => {
                res.status(200).json('resolved successfully');
            })
            .catch(err => {
                res.status(400).send(err);
            });
        }
    });
} 