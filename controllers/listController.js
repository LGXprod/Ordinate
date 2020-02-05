module.exports = function(app, connection){
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

	app.get("/patientList", function(req, res){
		getDoctorsList(req, res);
	});
}