module.exports = function(app, connection, patientList){
	app.get("/patientList", function(req, res){
		patientList.getPatientLists(connection).then((qlist) => {
			res.json(qlist)
		}).catch((err) => {
			console.log(err)
		})
	});
}