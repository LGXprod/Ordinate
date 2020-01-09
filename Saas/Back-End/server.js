const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ip = require("ip");
const https = require("https");
// const patient = require("patient.js");

var frontEnd = "/Users/matthew/Documents/Projects/Ordinate/Saas/Front-End/";

const listApp = express();
const adminApp = express();

console.log(ip.address());

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "", //This is not the actual password, change it so that it can connect to sql server but change it back to password when committing
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

	listApp.get("/patientList", function(req, res){
		var queryString = "select ordinateID, doctorID from qlist;";
		//console.log(queryString);

		connection.query(queryString, function(err, results, fields){
			if (err) throw err;

			connection.query("select doctorID, sName from doctor;", function(err, docResults){
				if (err) throw err;

				var qlist = [];

				for (x in docResults) {
					console.log(docResults[x].doctorID)
					qlist[x] = [{id: docResults[x].doctorID, sName: docResults[x].sName}]; // creates an array for each unique doctorID and puts it in qlist
				}

				console.log("Doctors added: " + qlist);

				for (x in results){

					for (y in qlist) {

						if (qlist[y][0].id == results[x].doctorID){ // checks each doc in qlist with the doc the patient wants and then adds the patient to the right doc
							qlist[y][qlist[y].length] = {
								ordinateID: results[x].ordinateID,
								doctorID: results[x].doctorID
							};
						}

					}
		
				};

				console.log("Patients added: " + qlist);

				res.json(qlist);
			});
			
		});
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
		var doctorID = req.body.doctor;

		var validQuery = "select ordinateID from patient where ordinateID=" + id + ";";
		console.log(validQuery);

		connection.query(validQuery, function(err, result, fields){
			if (err) throw err;
			console.log(result[0].ordinateID);
			if (result[0].ordinateID) {
				console.log("Valid id");

				var insertQuery = "insert into qlist (ordinateID, doctorID) values (" + id + ", " 
				+ doctorID + ")";
				console.log(insertQuery);

				connection.query(insertQuery, function(err, result, fields){
					if (err) throw err;
					console.log("Successful");
				});
			}
		});
	});

	adminApp.post("/registration.html", function(req, res){
		var fName = req.body.fName;
		var sName = req.body.sName;
		var dob = req.body.dob;

		var id = Math.round(Math.random()*1000);	

		var queryString = "insert into patient (ordinateID, fName, sName, dob)" + " values (" + id	
		+ ", '" + fName + "', '" + sName + "', '" + dob + "')";

		console.log(queryString);

		connection.query(queryString, function(err, result){
			if (err) throw err;
			console.log("Successful");
		});

		res.send("<script>alert('New patient: " + fName + " " + sName + " has been assigned Ordinate ID: " + parseInt(id) + ".')</script>"); 
	});