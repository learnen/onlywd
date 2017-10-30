var fs = require("fs");
var path = require("path");

exports.getAllAlbums = function(callback) {
	fs.readdir("./uploads", function(err, files) {
		var allAlbums = [];
		(function iterator(i) {
			if (i == files.length) {
				callback(allAlbums);
				return;
			}
			fs.stat("./uploads/" + files[i], function(err, stats) {
				if (stats.isDirectory()) {
					allAlbums.push(files[i])
				}
				iterator(i + 1);
			})
		})(0)
	})
}