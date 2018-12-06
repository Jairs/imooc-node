var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    director:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

MovieSchema.pre('save',function(next){
    if(this.isNew){//判断是否是新数据
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }
    next();//进入下一步
});

MovieSchema.statics={//静态方法
    fetch:function(cb){//取出数据库中所有的数据
        return this
        .find({})//找到所有的数据
        .sort('meta.updateAt')//按照更新时间排序
        .exec(cb);//执行
    },
    findById:function(id,cb){//查找单条数据
        return this
        .findOne({_id:id})
        .sort('meta.updateAt')//按照更新时间排序
        .exec(cb);//执行
    }
}

module.exports = MovieSchema;//导出模型