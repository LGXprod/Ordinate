const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
// const patient = require("patient.js");

var frontEnd = "/Users/matthew/Documents/Projects/Ordinate/Saas/Front-End/";

const listApp = express();
const adminApp = express();

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password", //This is not the actual password, change it so that it can connect to sql server but change it back to password when committing
	database: "ordinateDB"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("Connected!");
});

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

	adminApp.get("/registration.html", function(req, res){
		res.sendFile(frontEnd + "registration.html");
	});

	adminApp.get("/admin.html", function(req, res){
		res.sendFile(frontEnd + "admin.html");
	});

	adminApp.get("/images/logo2.png", function(req, res){
		res.sendFile(frontEnd + "images/logo2.png");
	});

	adminApp.get("/js/admin.js", function(req, res){
		res.sendfile(frontEnd + "js/admin.js");
	});

	adminApp.get("/css/addPatient.css", function(req, res){
		res.sendFile(frontEnd + "css/addPatient.css");
	});

	adminApp.use(bodyParser.urlencoded({extended: true}));

	adminApp.post("/", function(req, res){
		var id = req.body.ID;
		var doctor = req.body.doctor;

		var queryString = "insert into qlist (ordinateID) values (" + id + ")";
		console.log(queryString);

		connection.query(queryString, function(err, result, fields){
			if (err) throw err;
			console.log(result);
		});

		// newPatient = new Patient(req.body.id, req.body.doctor);
		// console.log(newPatient.getID());
	});

	adminApp.post("/registration.html", function(req, res){
		var fName = req.body.fName;
		var sName = req.body.sName;
		var dob = req.body.dob;

		var queryString = "insert into patient (ordinateID, fName, sName, dob)" + " values (" + Math.round(Math.random()*1000)	
		+ ", '" + fName + "', '" + sName + "', '" + dob + "')";

		console.log(queryString);

		connection.query(queryString, function(err, result){
			if (err) throw err;
			console.log("Successful");
		});

		res.write("<script>alert(' Added: " + fName + " as a new patient')</script>");
		res.redirect('back');
	});