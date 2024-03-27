var mongoose = require('mongoose');
var CustomerContact = mongoose.model('CustomerContacts');

exports.get_all_customers_contact = function (req, res) {

    CustomerContact.find({}, function (err, customercontact) {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(
            customercontact);
    });
}

exports.get_customers_contact_by_id = function (req, res) {
    let id = req.params.id;
    CustomerContact.findById(id, (err, prod) => {
        if (err) {
            res.send('404', err);
        }
        res.send({
            status: 200,
            customercontact: prod
        });
    });
}

exports.create_customers_contact = (req, res) => {
    let customercontact = new CustomerContact(req.body);
    customercontact.save()
        .then(customercontact => {
            res.status(200).json({ 'customercontact': 'Added successfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
}

exports.delete_customers_contact = (req, res) => {
    CustomerContact.findByIdAndRemove({_id: req.params.id}, (err, customercontact)=> {
        if (err)
        res.json(err);
        else 
        res.json('removed successfully');
    });
} 

exports.resolveIssue = (req, res) => {
    CustomerContact.findById(req.params.id, (err, issue)=> {
        if (err) {
            res.json(err);
        } else {
            issue.resolved = true;
            issue.resolved_time = Date.now();
            issue.save()
            .then(() => {
                res.status(200).json('resolved successfully');
            })
            .catch(err => {
                res.status(400).send(err);
            });
        }
    });
}
