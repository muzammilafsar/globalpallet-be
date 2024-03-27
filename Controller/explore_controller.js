var mongoose = require('mongoose');
var Explore = mongoose.model('Explore');

exports.getExplore = (req, res) => {
    Explore.find({}, (err, explore) => {
        if(err) {
            res.send(err);
        } else {
            res.json(explore);
        }
    })
}

exports.createExplore = (req, res) => {
    let explore = new Explore({
        name: req.body.name,
        image: req.body.image,
        color: req.body.color,
        detail: {
            title: req.body.title,
            icon: req.body.icon,
            desciption: req.body.desciption,
            tag: req.body.tag,
        }
    });
    explore.save().then(() => {
        res.status(200).send('Added successfully');
    })
    .catch(() => {
        res.status(400).send('Failed to create new record');
    });
}

exports.getExploreById = (req, res) => {
    let id = req.params.id;
    Explore.findById(id, (err, explore) => {
        if (err) {
            res.send('404', err);
        }
        res.json(explore);
    });
}

exports.updateExplore = (req, res) => {
    Explore.findById(req.params.id, (err, explore) => {
        if (!explore)
             res.json({ status: 205, message: "unable to update" });
        else {
            explore.name = req.body.name;
            explore.image = req.body.image;
            explore.color = req.body.color;
            explore.detail.tag = req.body.tag;
            explore.detail.title = req.body.title;
            explore.detail.desciption = req.body.desciption;
            explore.detail.icon = req.body.icon;

            explore.save().then(() => {
                res.json('explore updated');
            }).catch(err => {
                res.json({
                    type: 'error',
                    error: err,
                    status: 400
                });
            });
        }
    });
  }

exports.deleteExplore = (req, res) => {
    Explore.findByIdAndRemove({_id: req.params.id}, (err, exp)=> {
        if (err) {
            res.json(err);
        }
        else {
            res.json('removed successfully');
        }
    });
}
