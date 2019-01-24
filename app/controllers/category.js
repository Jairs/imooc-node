var Category = require('../models/category');

//admin new page
exports.new = function(req, res) {
    res.render('categoryAdmin', {
        title: 'imooc 后台分类录入页',
        category: {}
    });
}

//admin post movie
exports.save = function(req, res) {
    var _category = req.body.category;
    console.log(_category);

    var category = new Category(_category);
    category.save(function(err, category) {
        console.log(category);
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/category/list');
        }
    });

}

//list page
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err);
        } else {
            console.log(categories);
            res.render('categoryList', {
                title: 'imooc 分类列表页',
                categories: categories
            });
        }
    });
}