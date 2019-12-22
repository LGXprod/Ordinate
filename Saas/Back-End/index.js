const fs = require("fs");
const express = require("express");
var frontEnd = "/Users/matthew/Documents/Projects/Ordinate/Saas/Front-End/";

const listApp = express();
const adminApp = express();

listApp.listen(3000, function(){
	console.log("Server started on port 3000");
});

	listApp.get("/", function(req, res){
		res.sendFile(frontEnd + "index.html");
	});

	listApp.get('/css/styles.css', function(req, res) {
	  res.sendFile(frontEnd + "css/styles.css");
	});

	listApp.get("/images/logo.png", function(req, res){
		res.sendFile(frontEnd + "/images/logo.png");
	});

	listApp.get("/js/index.js", function(req, res){
		res.sendfile(frontEnd + "js/index.js");
	});


adminApp.listen(4000, function(){
	console.log("Server started on port 4000");
});

	adminApp.get("/", function(req, res){
		res.sendFile(frontEnd + "admin.html");
	});

	adminApp.get("/js/admin.js", function(req, res){
		res.sendfile(frontEnd + "js/admin.js");
	});

	adminApp.get("/css/addPatient.css", function(req, res){
		res.sendFile(frontEnd + "css/addPatient.css");
	});

	adminApp.post("/", function(req, res){
		res.send("work");
	});

	
