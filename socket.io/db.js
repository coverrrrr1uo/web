var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:123456@192.168.0.169:27017/";
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
        console.log("插入的文档数量为: " + res.insertedCount);
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
