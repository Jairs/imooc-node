var Comment = require('../models/comment');

//comment
exports.save = function(req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;
    var comment =  new Comment(_comment);
    comment.save(function(err, movie) {
        if (err) {
            console.log(err);
        } 
        res.redirect('/movie/' + movieId);
        
    });
    
}




//list delete movie
exports.del = function(req, res) {
    var id = req.query.id; //链接带参
    console.log(id);
    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        })
    }
}