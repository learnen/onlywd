//连接数据库
var MongoClient = require('mongodb').MongoClient;

function _connectDb(callback) {
	var url = 'mongodb://root:a1372892517@123.206.228.48/demo';
	MongoClient.connect(url, function(err, db) {
		if (err) {
			
		}
		callback(err,db);
	});
}
//插入数据
exports.insertOne = function(collectionName, json, callback) {
	_connectDb(function(err, db) {
		db.collection(collectionName).insertOne(json, function(err, result) {
			callback(err, result);
			db.close();
		})
	})
}


exports.find = function(collectionName, json, callback) {
		var result = [];
		var json = json || {};
		_connectDb(function(err, db) {
				var cursor = db.collection(collectionName).find(json);
				cursor.each(function(err, doc) {
					if (err) {
						callback(err, null);
					};
					if (doc != null) {
						result.push(doc);
					} else {
						callback(null,result);
					}
				});
			})
}


exports.deletemany = function(collectionName,json,callback){
	_connectDb(function(err, db) {
		db.collection(collectionName).deleteMany(json,function(err,result){
			callback(err,result);
		})

	})
}

exports.updateMany = function(collectionName, json1, json2, callback) {
	_connectDb(function(err, db) {
		db.collection(collectionName).updateMany(json1, json2, function(err, result) {
			callback(err, result);
		});
	})
}


exports.updateOne = function(collectionName, json1, json2, callback) {
	_connectDb(function(err, db) {
		db.collection(collectionName).updateOne(json1, json2, function(err, result) {
			callback(err, result);
		});
	})
}

exports.findsort = function(collectionName, json, sort ,callback) {
		var result = [];
		var collation = sort;
		var json = json || {};
		_connectDb(function(err, db) {
				var cursor = db.collection(collectionName).find(json).sort(collation);
				cursor.each(function(err, doc) {
					if (err) {
						callback(err, null);
					};
					if (doc != null) {
						result.push(doc);
					} else {
						callback(null,result);
					}
				});
			})
}