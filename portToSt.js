var mongojs = require('mongojs');
var db = mongojs('kvmator2', ['portst1', 'portst2']);
var portSt1 = [
        {port:'1', st:'112'},
        {port:'2', st:'112'},
        {port:'3', st:'115'},
        {port:'4', st:'115'},
        {port:'5', st:'117'},
        {port:'6', st:'117'},
        {port:'7', st:'122'},
        {port:'8', st:'122'},
        {port:'9', st:'125'},
        {port:'10', st:'125'},
        {port:'11', st:'127'},
        {port:'12', st:'127'},
        {port:'13', st:'132'},
        {port:'14', st:'132'},
        {port:'15', st:'135'},
        {port:'16', st:'135'},
        {port:'17', st:'137'},
        {port:'18', st:'137'},
        {port:'19', st:'142'},
        {port:'20', st:'142'},
        {port:'21', st:'145'},
        {port:'22', st:'145'},
        {port:'23', st:'147'},
        {port:'24', st:'147'},
        {port:'25', st:'152'},
        {port:'26', st:'152'},
        {port:'27', st:'155'},
        {port:'28', st:'155'},
        {port:'29', st:'157'},
        {port:'30', st:'157'},
        {port:'31', st:'162'},
        {port:'32', st:'162'},
        {port:'33', st:'165'},
        {port:'34', st:'165'},
        {port:'35', st:'167'},
        {port:'36', st:'167'},
        {port:'37', st:'172'},
        {port:'38', st:'172'},
        {port:'39', st:'175'},
        {port:'40', st:'175'},
        {port:'41', st:'177'},
        {port:'42', st:'177'},
        {port:'43', st:'182'},
        {port:'44', st:'182'},
        {port:'45', st:'185'},
        {port:'46', st:'185'},
        {port:'47', st:'187'},
        {port:'48', st:'187'}
    ];
var portSt2 = [
        {port:'1', st:'212'},
        {port:'2', st:'212'},
        {port:'3', st:'215'},
        {port:'4', st:'215'},
        {port:'5', st:'217'},
        {port:'6', st:'217'},
        {port:'7', st:'222'},
        {port:'8', st:'222'},
        {port:'9', st:'225'},
        {port:'10', st:'225'},
        {port:'11', st:'227'},
        {port:'12', st:'227'},
        {port:'13', st:'232'},
        {port:'14', st:'232'},
        {port:'15', st:'235'},
        {port:'16', st:'235'},
        {port:'17', st:'237'},
        {port:'18', st:'237'},
        {port:'19', st:'242'},
        {port:'20', st:'242'},
        {port:'21', st:'245'},
        {port:'22', st:'245'},
        {port:'23', st:'247'},
        {port:'24', st:'247'},
        {port:'25', st:'252'},
        {port:'26', st:'252'},
        {port:'27', st:'255'},
        {port:'28', st:'255'},
        {port:'29', st:'257'},
        {port:'30', st:'257'},
        {port:'31', st:'262'},
        {port:'32', st:'262'},
        {port:'33', st:'265'},
        {port:'34', st:'265'},
        {port:'35', st:'267'},
        {port:'36', st:'267'},
        {port:'37', st:'272'},
        {port:'38', st:'272'},
        {port:'39', st:'275'},
        {port:'40', st:'275'},
        {port:'41', st:'277'},
        {port:'42', st:'277'},
        {port:'43', st:'282'},
        {port:'44', st:'282'},
        {port:'45', st:'285'},
        {port:'46', st:'285'},
        {port:'47', st:'287'},
        {port:'48', st:'287'}
    ];
/*
* Переписати враховуючи, що getPortToSt1 цього не робить, а лише інсертить
* */
db.portst1.find(function (err,result) {
    if (result.length > 0) {
        console.log("Db1 is not empty");
    } else {
        db.portst1.insert(portSt1, function(){
            console.log("Done for 1")
        })
    }
});
db.portst2.find(function (err,result) {
    if (result.length > 0) {
        console.log("Db2 is not empty");
    } else {
        db.portst2.insert(portSt2, function(){
            console.log("Done for 2")
        })
    }
});
exports.getPortToSt1 = function(callback) {
    db.portst1.find(function (err,result) {
        callback(result);
    })
}
exports.getPortToSt2 = function(callback) {
    db.portst2.find(function (err,result) {
        callback(result);
    })
}