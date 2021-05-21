

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
var DbName = "chat";
var CollectionName = "charRecords";
function saveChatRecords(obj) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DbName);
        var myobj =  [
            obj
        ];
        dbo.collection(CollectionName).insertMany(myobj, function(err, res) {
            if (err) throw err;
            console.log("The number of inserted documents is: " + res.insertedCount);
            db.close();
        });
    });
}

function findChatRecords(params, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DbName);
        dbo.collection(CollectionName).find(params).toArray(function(err, result) {
            if (err) throw err;
            if(callback != undefined && callback != null) {
                callback(result);
            }
            db.close();
        });
    });
}



module.exports = {
    saveChatRecords: saveChatRecords,
    findChatRecords: findChatRecords
}