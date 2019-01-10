var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;//唯一标识，mongodb默认生成的主键

var CommentSchema = new mongoose.Schema({
    movie:{type:ObjectId,ref:'Movie'},//引用，引用的数据会替换
    from:{type:ObjectId,ref:'User'},
    to:{type:ObjectId,ref:'User'},
    content:String,
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

CommentSchema.pre('save',function(next){
    if(this.isNew){//判断是否是新数据
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }
    next();//进入下一步
});

CommentSchema.statics={//静态方法
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

module.exports = CommentSchema;//导出模型