require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ip = require("ip");
const faker = require("faker");
const AES = require("mysql-aes")
const bcrypt = require("bcrypt")

const saltRounds = 10

var frontEnd = "/Users/matthew/Documents/Projects/Ordinate/Saas/Front-End/";

const listApp = express();
const adminApp = express();

console.log(ip.address());

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD, 
	database: "ordinateDB"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("Connected!");
});

// bcrypt.hash("testPassword", saltRounds, function(err, hash){
// 	if (err) throw err

// 	connection.query("update client_com set password='" + hash + "' where clientID=1;")
// 	console.log("Passowrd added")
// })

// var test = AES.encrypt("hello world :)", "testPassword")
// console.log(AES.decrypt(test, "testPassword"))

listApp.listen(3000, function(){
	console.log("Server started on port 3000");
});

listApp.use(bodyParser.urlencoded({extended: true}));

	listApp.get("/", function(req, res){
		res.sendFile(frontEnd + "login.html");
	});

		listApp.post("/", function(req, res){
			var username = req.body.username
			var password = req.body.password

			var validateUsername = "select username, convert(password using utf8) as password from client_com having aes_decrypt(username,'" + process.env.usernameKey + "')='" + username + "'"
			console.log(validateUsername)

			connection.query(validateUsername, function(err, result){
				if (err) throw err

				if (result.length == 1){
					//Check password
					console.log(result)
					bcrypt.compare(password, result[0].password, function(err, correct){
						if (correct){
							res.sendFile(frontEnd + "index.html")
						}
					})
				} else {
					res.redirect('/')
				}
			})
		})

	listApp.get('/css/addPatient.css', function(req, res) {
		res.sendFile(frontEnd + "css/addPatient.css");
	  });

	listApp.get('/css/styles.css', function(req, res) {
	  res.sendFile(frontEnd + "css/styles.css");
	});

	listApp.get("/images/logo.png", function(req, res){
		res.sendFile(frontEnd + "/images/Corner-Logo4.png");
	});

	listApp.get("/js/index.js", function(req, res){
		res.sendfile(frontEnd + "js/index.js");
	});

	function qlistTest(){
		var testDataQuery = "select ordinateID from patient where dob='2010-10-10'"
		connection.query(testDataQuery, function(err, testData){
			if (err) throw err
			var x = -1

			for (i = 0; i < testData.length; i++){
				x++
				var insertQuery = "insert into qlist (ordinateID, doctorID) values (" + testData[i].ordinateID + ", " + x + ")"
				
				connection.query(insertQuery, function(err){
					if (err) throw err
					console.log("Test data in qlist")
				})

				if (x == 4) x = -1
			}
		})
	}

	//qlistTest()

	function getDoctorsList(req, res){
		var queryString = "select qlist.ordinateID, qlist.doctorID, patient.fName, patient.sName from qlist inner join patient where patient.ordinateID=qlist.ordinateID;";
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
							doctorID: patResults[x].doctorID,
							fName: patResults[x].fName,
							sName: patResults[x].sName
						};

					} else {

						for (y in qlist) {
	
							if (qlist[y][0].id == patResults[x].doctorID && patResults[x].doctorID != 0){ // checks each doc in qlist with the doc the patient wants and then adds the patient to the right doc
								
								qlist[y][qlist[y].length] = {
									ordinateID: patResults[x].ordinateID,
									doctorID: patResults[x].doctorID,
									fName: patResults[x].fName,
									sName: patResults[x].sName
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

	adminApp.get("/registration", function(req, res){
		res.sendFile(frontEnd + "registration.html");
	});

	adminApp.get("/admin.html", function(req, res){
		res.sendFile(frontEnd + "admin.html");
	});

	adminApp.get('/css/styles.css', function(req, res) {
		res.sendFile(frontEnd + "css/styles.css");
	  });

	adminApp.get("/Q-Admin.png", function(req, res){
		res.sendFile(frontEnd + "images/Admin-Logo.png")
	})

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

	function addPatientToDB(fName, sName, dob, id, res, redirect, setID){
		var validateQuery = "select ordinateID from patient where ordinateID="+id;
		var recepID = 1;

		connection.query(validateQuery, function(err, results){
			if (err) throw err;

			if (results[0] == null){
				var insertPatient = "insert into patient (ordinateID, fName, sName, dob)" + " values (" + id	
				+ ", '" + fName + "', '" + sName + "', '" + dob + "')";
		
				console.log(insertPatient);

				connection.query(insertPatient, function(err){
					if (err) throw err;
					console.log("Successful 1");
				});

				connection.query("select recepID from recentNewPatient where recepID="+recepID, function(err, result){
					if (err) throw err

					//console.log(result)
					var insertNewPatient;
					if (result.length == 0){
						insertNewPatient = "insert into recentNewPatient (recepID, fName, sName, dob, ordinateID) values (" + recepID + ", '" + fName + "', '" + sName + "', '" + dob + "', " 
						 + id + ")"
					} else {
						insertNewPatient = "update recentNewPatient set fName ='" + fName + "', sName='" + sName + "', dob='" + dob + "', ordinateID=" + id + " where recepID=" + recepID
					}

					console.log(insertNewPatient)

					connection.query(insertNewPatient, function(err){
						if (err) throw err
						console.log("Successful 2")
					})
				})	

				//res.send("<script>alert('New patient: " + fName + " " + sName + " has been assigned Ordinate ID: " + parseInt(id) + ".')</script>"); 
				
				if (redirect){
					res.redirect("/newPatient")
				}
			} else {
				console.log("Already exists");
				setID();
				console.log("New id " + id);
				applyID();
			}
		});
	}

	

	adminApp.post("/registration", function(req, res){
		var fName = req.body.fName;
		var sName = req.body.sName;
		var dob = req.body.dob;

		var id; 
		function setID(){
			id = Math.round(Math.random()*100000);
		}

		setID();
		
		addPatientToDB(fName, sName, dob, id, res, true, setID);
	});

		function addManyPatientsToDBTest(noPatients){
			for (i = 1; i <= noPatients; i++){
				// dob 10/10/2010 will be the identifier for the faker.js generated instances
				var id 
				function setID(){
					id = Math.round(Math.random()*100000);
				}
				setID()
				addPatientToDB(faker.name.firstName(), faker.name.lastName(), "2010-10-10", id, null, false, setID)
			}
		}

		//addManyPatientsToDBTest(10)

	adminApp.get("/patientList", function(req, res){
		getDoctorsList(req, res)
	})

			adminApp.post("/removedPatients", function(req, res){
				var id = req.body.id
				var validateQuery = "select ordinateID from qlist where ordinateID=" + id

				connection.query(validateQuery, function(err, result){
					if (err) throw err

					if (result.length >= 1){
						var deleteQuery = "delete from qlist where ordinateID=" + id
						connection.query(deleteQuery, function(err){
							if (err) throw err
						})
					}
				})	
			})

	adminApp.get("/newPatient", function(req, res){
		res.sendFile(frontEnd + "newPatient.html")
	})

		adminApp.get("/submission", function(req, res){
			var recepID = 1

			connection.query("select fName, sName, dob, ordinateID from recentNewPatient where recepID=" + recepID, function(err, result){
				var patient = {
					fName: result[0].fName,
					sName: result[0].sName,
					dob: result[0].dob,
					ordinateID: result[0].ordinateID
				}

				res.json(patient)
			})
		})

	adminApp.get("/js/newPatient.js", function(req, res){
		res.sendFile(frontEnd + "js/newPatient.js")
	})

	adminApp.get("/delete", function(req, res){
		res.send("<script>window.location.replace('/registration');</script>")
	})