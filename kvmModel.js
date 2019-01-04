var mongojs = require('mongojs');
var db = mongojs('kvmator2', ['allkvms'])
exports.findAll = function(callback){
    db.allkvms.find(function(err,result) {
        if (!err) {
            callback (result);
        }
    })
}
exports.add = function(document, callback){
    db.allkvms.insert(document, function(){
        callback();
    });
};
exports.delete = function(kvmid, callback){
    db.allkvms.remove({'_id':kvmid}, function(){
    if (callback) {
        callback();
        }
    }
    )
};
exports.get = function(kvmid,callback){
    db.allkvms.find({'_id':kvmid}, function (err,result){
        if (!err) {
            callback(result);
        }
    })
}