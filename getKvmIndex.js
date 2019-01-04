
var snmp = require('snmp-native');
var async = require('async');
var kvmIndex=[],
    switchIps = ['99.99.99.99','99.99.99.99','99.99.99.99']; //should be the real ip's of Switches
function getMac(session, room, callback) {
    session.getSubtree({ oid: [1,3,6,1,2,1,17,4,3,1,2] }, function (error, varbinds) {
        if (error) {
            console.log('Fail :(');
        } else {
            varbinds.forEach(function (vb) {
                if (vb.value<49) {
                    for (var i=0; i<11; i++){
                        vb.oid.shift();
                    }
                    kvmIndex.push ({'mac' : vb.oid.join(".") , "port" : vb.value, "room" : room});
                }});
            callback(null);
        }
    });
}
function getActivity(session, room, callback) {
    session.getSubtree({ oid: [1,3,6,1,4,1,9,2,2,1,1,6]}, function (error, varbinds) {
        if (error) {
            console.log('Fail :(');
        } else {
         varbinds.forEach(function (vb) {
             for (var i = 0; i<kvmIndex.length; i++){
                 if ((kvmIndex[i].port==(vb.oid[12]-10000))
                     && kvmIndex[i].room==room){
                        kvmIndex[i].activity=vb.value;
                 }
             }

         });
         callback(null);
        }
    });
}
function getSysTime(session, room, callback){
    session.getSubtree({ oid: [1,3,6,1,2,1,1,3]}, function (error, varbinds) {
        if (error) {
            console.log('Fail :(');
        } else {
            varbinds.forEach(function (vb) {
                for (var i = 0; i<kvmIndex.length; i++){
                    if (kvmIndex[i].room==room){
                        kvmIndex[i].systime = vb.value;
                    }
                }
            });
            callback(null);
        }
    });
}
function getLastChange(session, room, callback){
    session.getSubtree({ oid: [1,3,6,1,2,1,2,2,1,9]}, function (error, varbinds) {
        if (error) {
            console.log('Fail :(');
        } else {
            varbinds.forEach(function (vb) {
                for (var i = 0; i<kvmIndex.length; i++){
                    if ((kvmIndex[i].port==(vb.oid[10]-10000))
                        && kvmIndex[i].room==room){
                        kvmIndex[i].lastChange=vb.value;
                    }
                }
            });
            callback(null);
        }
    });
}
exports.kvmIndexReset = function (){
    kvmIndex = [];
}

function goGo(ip_addr, callback1){
    var room;
    switch (ip_addr) {
        case '10.5.11.218':
            room='standart1'
            break
        case '10.5.11.219':
            room='standart2'
            break
        case '10.5.11.217':
            room='vip'
            break
    };
    var session = new snmp.Session({ host: ip_addr, community: 'community@vlan' }); //Should be real SNMP community
    async.series([
        function (callback) {
            getMac(session, room, callback);
        },
        function (callback) {
            getActivity(session, room, callback);
        },
        function (callback) {
            getSysTime(session, room, callback);
        },
        function (callback) {
            getLastChange(session, room, callback);
        }],
        function(err,results) {
            callback1();
    });
};
//for each of switches get SNMP request
exports.getSNMP = function (callback) {
   async.each(switchIps, function(switchIp, callback1) {
   goGo(switchIp, callback1);
   }, function(err) {
       exports.kvmIndex = kvmIndex;
        callback();
    })
};
