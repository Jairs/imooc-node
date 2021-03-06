var User = require('../models/user');

//signup
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    });
}

exports.signup = function(req, res) {
    var _user = req.body.user; //req.param('user);所有请求都查询一遍出结果（先在params中查找，再到body，最后query）
    // /user/signup/:userid=>获取userid:req.params.userid
    // /user/signup/1111?userid=1112=>获取userid:req.query.userid

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            console.log('重名');
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            });
        }
    });
}

//signin
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    });
}

exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    console.log(_user);
    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            console.log('无此用户!');
            return res.redirect('/signup');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                console.log('Password is matched!');
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('Password is not matched!');
                return res.redirect('/signin');
            }
        });
    });
}

//logout
exports.logout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}

//userList page
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            console.log(users)
            res.render('userList', {
                title: 'imooc 用户列表页',
                users: users
            });
        }
    });
}

//midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin');
    }

    next();
}

//midware for user
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role <= 10) {
        return res.redirect('/signin');
    }

    next();
}