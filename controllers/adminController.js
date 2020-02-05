module.exports = function(app, connection){
    app.get("/", function(req, res){
		res.render("admin");
	});

	app.get("/registration", function(req, res){
		res.render("registration");
    });
    
    app.get("/availableDocs", function(req, res){
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
    
    app.post("/", function(req, res, next){
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

	app.post("/registration", function(req, res){
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
    
    app.get("/newPatient", function(req, res){
		res.sendFile(__dirname + "/newPatient.html")
	})

    app.get("/submission", function(req, res){
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
}