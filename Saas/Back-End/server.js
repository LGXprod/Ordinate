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

	function getDoctorsList(req, res){
		var queryString = "select ordinateID, doctorID from qlist;";
		//console.log(queryString);

		connection.query(queryString, function(err, patResults, fields){
			if (err) throw err;

			connection.query("select doctorID, sName from doctor order by doctorID ASC;", function(err, docResults){
				if (err) throw err;

				var qlist = [];

				for (i=1; i<docResults.length; i++) {
					qlist[i-1] = [{id: docResults[i].doctorID, sName: docResults[i].sName}]; // creates an array for each unique doctorID and puts it in qlist
				}

				for (x in patResults) {
						
					if (patResults[x].doctorID == 0) {

						var min = qlist[0];
						for (i=1; i<qlist.length; i++) if (min.length > qlist[i].length) min=qlist[i];

						min[min.length] = {
							ordinateID: patResults[x].ordinateID,
							doctorID: patResults[x].doctorID
						};

					} else {

						for (y in qlist) {
	
							if (qlist[y][0].id == patResults[x].doctorID && patResults[x].doctorID != 0){ // checks each doc in qlist with the doc the patient wants and then adds the patient to the right doc
								
								qlist[y][qlist[y].length] = {
									ordinateID: patResults[x].ordinateID,
									doctorID: patResults[x].doctorID
								};
	
							}
	
						}

					}	
		
				}

				res.json(qlist);
			});
			
		});
	}

	listApp.get("/patientList", function(req, res){
		getDoctorsList(req, res);
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

	adminApp.get('/css/styles.css', function(req, res) {
		res.sendFile(frontEnd + "css/styles.css");
	  });

	adminApp.get("/images/logo2.png", function(req, res){
		res.sendFile(frontEnd + "images/logo2.png");
	});

	adminApp.get("/js/admin.js", function(req, res){
		res.sendfile(frontEnd + "js/admin.js");
	});

	adminApp.get("/js/index.js", function(req, res){
		res.sendfile(frontEnd + "js/index.js");
	});

	adminApp.get("/css/addPatient.css", function(req, res){
		res.sendFile(frontEnd + "css/addPatient.css");
	});

	adminApp.get("/availableDocs", function(req, res){
		connection.query("select doctorID, fName, sName from doctor", function(err, results){
			if (err) throw err;

			var docList = [];

			for(i in results) {
				docList[i] = {
					doctorID: results[i].doctorID,
					fName: results[i].fName,
					sName: results[i].sName
				}
			}

			res.json(docList);
		})
	});

	adminApp.use(bodyParser.urlencoded({extended: true}));

	adminApp.post("/", function(req, res, next){
		var id = req.body.ID;
		var doctorID = req.body.doctor;

		var validQuery = "select ordinateID from patient where ordinateID=" + id + ";";
		console.log(validQuery);

		connection.query(validQuery, function(err, result, fields){
			if (err) throw err;

			console.log(result[0]);

			if (result[0] != null) { 
				console.log("Valid id");

				var insertQuery = "insert into qlist (ordinateID, doctorID) values (" + id + ", " 
				+ doctorID + ")";
				console.log(insertQuery);

				connection.query(insertQuery, function(err, result, fields){
					if (err) throw err;
					console.log("Successful");
				});
			} else {
				res.send("<script>alert('Ordinate ID " + parseInt(id) + " does not exist.')</script>");
			}
		});

		res.redirect('back');
	});

	adminApp.post("/docFilter", function(req, res){
		var specifiedDoc = req.body.id
		var queryString = "select ordinateID, fName, sName from patient where ordinateID in (select ordinateID from qlist where doctorID=" + specifiedDoc + ")"

		connection.query(queryString, function(err, results){
			var patList = []

			for (i in results){
				patList[i] = {
					ordinateID: results[i].ordinateID,
					fName: results[i].fName,
					sName: results[i].sName
				}
			}

			res.json(patList)
		})
	});

	adminApp.post("/registration.html", function(req, res){
		var fName = req.body.fName;
		var sName = req.body.sName;
		var dob = req.body.dob;

		var id; 

		function setID(){
			id = Math.round(Math.random()*100000);
		}

		setID();

		function applyID(){
			var validateQuery = "select ordinateID from patient where ordinateID="+id;

			connection.query(validateQuery, function(err, results){
				if (err) throw err;
	
				if (results[0] == null){
					var queryString = "insert into patient (ordinateID, fName, sName, dob)" + " values (" + id	
					+ ", '" + fName + "', '" + sName + "', '" + dob + "')";
			
					console.log(queryString);
	
					connection.query(queryString, function(err, result){
						if (err) throw err;
						console.log("Successful");
					});
	
					//res.send("<script>alert('New patient: " + fName + " " + sName + " has been assigned Ordinate ID: " + parseInt(id) + ".')</script>"); 
					res.redirect('back');
				} else {
					console.log("Already exists");
					setID();
					console.log("New id " + id);
					applyID();
				}
			});
		}
		
		applyID();
	});