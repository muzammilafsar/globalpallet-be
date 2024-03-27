var mongoose = require('mongoose');
var Product = mongoose.model('Products');

exports.get_all_products = function (req, res) {

    Product.find({}).sort({ index: 1 }).exec((err, products) => {
        if (err) {
            res.send('Interal Server Error', err);
        }
        res.json(products); 
    });
} 

exports.get_product_by_id = function (req, res) {
    let id = req.params.id;
    Product.findById(id, (err, prod) => {
        if (err) {
            res.send('404', err);
        }
        res.send({
            status: 200,
            product: prod
        });
    });

}
exports.get_products_by_category = (req, res) => {
    Product.find({ category: req.query.category }, (err, prods) => {
        if (err) {
            res.send('404', err);
        }
        res.send({
            status: 200,
            products: prods
        });
    });
}

exports.create_product = (req, res) => {
    let product = new Product(req.body);
    product.save()
        .then(product => {
            res.status(200).json({ 'product': 'Added successfully' });
        })
        .catch(err => {
            res.status(400).send(err);
        });
}

exports.get_products_by_sub_category = (req, res) => {
    Product.find({ sub_category_name: req.body.sub_category_name }, (err, products) => {
        if (err) {
            res.send({});
        } else {
            res.send({
                status: 200,
                products: products
            })
        }
    });
}

exports.delete_product = (req, res) => {
    Product.findByIdAndRemove({_id: req.params.id}, (err, product)=> {
        if (err)
        res.json(err);
        else 
        res.json('removed successfully');
    });
}

exports.update_product = (req, res) => {

    Product.findById(req.params.id, (err, product) => {
        if (!product)
            return next(new Error('could not load document'));
        else {
            product.name = req.body.name;
            product.image = req.body.image;
            product.price_1 = req.body.price_1;
            // product.price_2 = req.body.price_2;
            // product.price_3 = req.body.price_3;
            product.size_1 = req.body.size_1;
            // product.size_2 = req.body.size_2;
            // product.size_3 = req.body.size_3;
            product.qty_1 = req.body.qty_1;
            // product.qty_2 = req.body.qty_2;
            // product.qty_3 = req.body.qty_3;
            product.category = req.body.category;
            product.tags = req.body.tags;
            product.status = req.body.status;
            product.description = req.body.description;
            product.veg = req.body.veg;
            product.index = req.body.index;
            product.explore_tag = req.body.explore_tag;
            product.coming_soon = req.body.coming_soon;
            product.chilly_level = req.body.chilly_level;
            product.newly = req.body.newly;
            product.note = req.body.note;
            product.original = req.body.original;
            product.popular = req.body.popular;
            product.image_web = req.body.image_web;
            product.bit = req.body.bit;
            product.product_id = req.body.product_id;

            product.save().then(product => {
                res.json('update done');
            }).catch(err => {
                res.status(400).send('update failed');
            });
        }

    });
}
exports.verify_availability = (req, res) => {
    let data = (req.body.products);
    let list = [];
    data.map(val => {
        list.push(mongoose.Types.ObjectId(val));
    })
    Product.find({ 
        '_id': {
            $in: list
        }    
    }, (err, products) => {
        res.send(products);
    });
}