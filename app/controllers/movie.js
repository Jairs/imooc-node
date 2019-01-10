var Movie = require('../models/movie');
var Comment = require('../models/comment')
var _ = require('underscore'); //用来替换数据

//detail page
exports.detail = function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        if (err) {
            console.log(err);
        } 
        Comment
            .find({movie:id})
            .populate('from','name')
            .exec(function(err,comments){
                if (err) {
                    console.log(err);
                } 
                console.log(comments);
                res.render('detail', {
                    title: 'imooc ' + movie.title,
                    movie: movie,
                    comments:comments
                        // movie: {
                        //     director: '何塞·帕迪里亚',
                        //     country: '美国',
                        //     title: '机械战警',
                        //     year: 2014,
                        //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
                        //     language: '英语',
                        //     flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
                        //     summary: '《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。'
                        // }
                });
        }); 
    });
}

//admin new page
exports.new = function(req, res) {
    res.render('admin', {
        title: 'imooc 后台',
        movie: {
            director: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
}

//admin update movie
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            console.log(movie);
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            });
        });
    }
}

//admin post movie
exports.save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    console.log(movieObj);
    var _movie;
    if (id != 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                _movie = _.extend(movie, movieObj); //替换数据
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/movie/' + movie._id);
                    }
                });
            }
        });
    } else {
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/movie/' + movie._id);
            }
        });
    }
}

//list page
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        } else {
            console.log(movies)
            res.render('list', {
                title: 'imooc 列表页',
                movies: movies
                    // movies: [{
                    //     director: '何塞·帕迪里亚',
                    //     country: '美国',
                    //     title: '机械战警',
                    //     _id: 1,
                    //     year: 2014,
                    //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
                    //     language: '英语',
                    //     flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
                    // }]
            });
        }
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