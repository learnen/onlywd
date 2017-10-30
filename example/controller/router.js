var db = require("../models/db.js");
var md5 = require("../models/md5.js");
var session = require("express-session");

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

exports.register = function(req,res,next){
	db.find("chatroom",{"name":req.body.name},function(err,result){
		var a = req.body.password;

		var password = md5(a + "aaaa");


		if (!result[0]) {
			db.insertOne("chatroom",{
				"number":req.body.number,
				"password":password,
				"name":req.body.name,
			},function(err,result){
				if (err) {
					console.log("3");
				};
				res.send("1");
			})
		}else{
			res.send("2");
		}
	})
}


exports.login = function(req,res,next){
	var a = req.body.password;
	
	var password = md5(a + "aaaa");


	db.find("chatroom",{"number":req.body.number},function(err,result){
		
	if (result[0]) {
		if(result[0].password == password){
			req.session.number = result[0].number;
			req.session.name = result[0].name;
			res.send(["1",result[0].name]);

		}else{
			res.send("2");
		}
	}else{
		res.send("3");
	}
		
	})
}


exports.psmg = function(req, res, next) {
	var name = req.params.id;

	if (req.session.name) {
		res.render("psmg",{
		name : req.session.name,
		user : name
		});
	}else{
		res.send('该页面需要登录');
	}
}