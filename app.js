var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); //用来格式化表单数据
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session); //存储session数据
var logger = require('morgan');
var dbUrl = 'mongodb://localhost/imooc';
// mongoose.connect(dbUrl);
mongoose.connect(dbUrl, { useNewUrlParser: true }, function(err) {　　
    if (err) {　　　　
        console.log('Connection Error:' + err);　　
    } else {　　　　
        console.log('Connection success!');
    }
});

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //session依赖于cookie
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: true,
    saveUninitialized: true, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));

if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true; //格式化网页源代码(原先是压缩过的)
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));

console.log('imooc started on port ' + port);