var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , kvmSNMP = require('./getKvmIndex')
  , match = require('./match')
  , async = require('async')
  , kvm = require('./kvmModel');
var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon('public/img/bird.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/kvm/add', function(req,res){
    res.render('kvmadd');
})

app.get('/kvm/:kvmid', function(req,res){
    kvm.get(req.params.kvmid, function(kvm){
        if (kvm.length > 0) {
        res.render('kvmid', {kvm:kvm})}
        else {
            res.send(req.params.kvmid+' not found')
        }
    })
});
app.get('/kvm', function(req,res){
    kvm.findAll(function(kvms){
        res.render('kvm', {kvms:kvms});
    })
});
app.get('/', function(req,res){
    async.series([
        function(callback) {
            kvmSNMP.getSNMP(callback);
        },
        function(callback) {
            exports.kvmIndex = [];
            exports.kvmIndex = kvmSNMP.kvmIndex;
            callback();
        },
        function(callback) {
            match.matchAll(callback);
            kvmSNMP.kvmIndexReset();
        },
        function (callback) {
            callback();
        }, function (){
            res.render('index', {macKvmTest:match.kvmIndex});
        }
    ])
});

app.post('/kvm/add', function(req,res){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = year + "/" + month + "/" + day;
    var newkvm = {'mac':req.body.kvmmac,
                  '_id':req.body.kvmid,
                  'created':newdate};
    kvm.add(newkvm, function() {
        res.redirect('/kvm');
    });
})
app.post('/kvm/del', function(req,res){
    kvm.delete(req.body._id, function(){
        res.redirect('/kvm');
    });
})



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
