var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var SubCategory = mongoose.model('SubCategory');
var RootCategory = mongoose.model('RootCategory');
exports.get_rootcategory_of_subcategory = (req, res) => {

    RootCategory.find({category_name: req.body.category_name}, (err, sub_cat) => {
        if(err) {

        }
        else {
            res.json({
                status: 200,
                sub_categories: sub_cat
            })
        } 
    })
}

exports.create_root_category = (req,res) => {
    let a = new RootCategory({name: req.body.name,
    image: req.body.image,
    enable: req.body.enable,
    source: req.body.source,
    details: req.body.details,
    category_name: req.body.category_name, 
    sub_category_name: req.body.sub_category_name});
    a.save((err, cat) => {
        if( err) {
            console.log(err);
            res.send({status: 404});
        } else{
            res.send({status: 200, data: cat });
        }
    });
}