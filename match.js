var kvm = require ('./kvmModel');
var portToSt = require('./portToSt');
var async = require('async');
var app1 = require("./app.js");
var kvmIndex;
//kvmIndex - global variable for all files

//SNMP gets mac's in decimal format: translating them into hexadecimal to be able compare with user's entered
var decToHex = function (callback) {
        for (var j=0; j<kvmIndex.length; j++){
            var temp=kvmIndex[j].mac.split('.');
            for (var i=0; i<temp.length; i++){
                if (parseFloat(temp[i]).toString(16).length===1) {
                    temp[i] = '0'+parseFloat(temp[i]).toString(16)
                } else {
                    temp[i] = parseFloat(temp[i]).toString(16);
                }
            }
            kvmIndex[j].mac=temp.join(':');
        }
    callback();
    };

//Compare DB's macs with founded and add to KVMindex mac address and KVMid
function match(callback){
    kvm.findAll(function(kvms){
        var kvmLenght=kvms.length;
        var kvmIndexLenght=kvmIndex.length;
        for (var i=0; i<kvmLenght; i++){
            var flag=false;
            for (var j=0; j<kvmIndexLenght; j++){
                if (kvms[i].mac == kvmIndex[j].mac) {
                    kvmIndex[j].kvmid = kvms[i]._id;
                    flag=true;
                }
                else if (j==kvmIndexLenght-1 && !flag) {
                    kvmIndex.push({mac:kvms[i].mac, kvmid:kvms[i]._id});
                }
            }
        }
        callback();
    })
};

//Searching the rack id('st') by port number&room.
function matchSt (getPortToSt, callback){
    var room;
    switch (getPortToSt) {
        case 'getPortToSt1':
            room='standart1'
            break
        case 'getPortToSt2':
            room='standart2'
            break
    }
    portToSt[getPortToSt] (function(result){
        for (var i=0; i<kvmIndex.length; i++){
            for (var j=0; j<result.length; j++){
                if (kvmIndex[i].room == room && kvmIndex[i].port == result[j].port) {
                    kvmIndex[i].st = result[j].st;
                }
            }
        }
        callback();
    })
};

exports.matchAll = function(callback1) {
    async.series([
        function(callback) {
            kvmIndex = app1.kvmIndex;
            decToHex(callback);
        },
        function(callback){
            match(callback);
        },
        function(callback){
            matchSt('getPortToSt1', callback);
        },
        function(callback){
            matchSt('getPortToSt2', callback);
        },
        function(callback){
            exports.kvmIndex = kvmIndex;
            callback1();
        }
    ])
}
