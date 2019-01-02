var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var SALT_WALK_FACTOR = 10
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    /**
     * string型
     * user
     * admin
     * super admin
     */
    //role: String,

    /**
     * Number型
     * 0:normal user
     * 1:verified user
     * 2:professonal user
     * 
     * >10:admin
     * >50:super admin
     */
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.pre('save', function(next) {
    var user = this;
    console.log(user);
    if (this.isNew) { // 判断是否是新数据
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    bcrypt.genSalt(SALT_WALK_FACTOR, function(err, salt) {
        if (err)
            return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)
                return next(err)
            user.password = hash
            next(); // 进入下一步
        });
    });
});

UserSchema.methods = { //实例方法
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    }
}

UserSchema.statics = { // 静态方法
    fetch: function(cb) { // 取出数据库中所有的数据
        return this
            .find({}) // 找到所有的数据
            .sort('meta.updateAt') // 按照更新时间排序
            .exec(cb); // 执行
    },
    findById: function(id, cb) { // 查找单条数据
        return this
            .findOne({ _id: id })
            .sort('meta.updateAt') // 按照更新时间排序
            .exec(cb); // 执行
    }
}

module.exports = UserSchema; // 导出模型