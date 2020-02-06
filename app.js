// "use strict";

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ip = require("ip");
const faker = require("faker");
const AES = require("mysql-aes")
const bcrypt = require("bcrypt")
const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

const loginController = require("./controllers/loginController");
const listController = require("./controllers/listController");
const adminController = require("./controllers/adminController");
const user = require("./models/user");
const patientList = require("./models/patientList");
const doctorList = require("./models/doctorList");

const saltRounds = 10

const listApp = express();
const adminApp = express();

//set up template engine
listApp.set('view engine', 'ejs');
adminApp.set('view engine', 'ejs');

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

listApp.listen(3000, function(){
	console.log("Server started on port 3000");
});

adminApp.listen(4000, function(){
	console.log("Server started on port 4000");
});

listApp.use(bodyParser.urlencoded({extended: false})); //change back to true when done to see if it works (true is more secure)
adminApp.use(bodyParser.urlencoded({extended: true}));

//listApp.use(session({ secret: process.env.DB_PASSWORD }));

//static files (automatically routes static files stored in /public)
listApp.use(express.static(__dirname + "/public"));
adminApp.use(express.static(__dirname + "/public"));

//no need for below any more
// listApp.get('/css/addPatient.css', function(req, res) {
// 	res.sendFile(__dirname + "/css/addPatient.css");
//   });

//call controllers
loginController(listApp, connection, bcrypt, user);
listController(listApp, connection, patientList);

adminController(adminApp, connection, doctorList, patientList);
listController(adminApp, connection);

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