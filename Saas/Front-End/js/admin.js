var table = $("table");
var docFilter = $("#docSelector");

function addPatient(patID, name, eta){	
	table.append("<tr><td>" + patID + "</td><td id='fullName'>"
		+ name + "</td><td>" + eta + "</td></tr>");
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

$.ajax({
    url: '/availableDocs',
    complete: function(data) {

        var doctors = data.responseJSON;
        docFilter.append('<option value=0>Any doctor</option>');

        for (i = 1; i < doctors.length; i++) {
            docFilter.append('<option value=' + doctors[i].doctorID + '>' + doctors[i].fName + ' ' + doctors[i].sName + '</option>');
        }

    }
})

$.ajax({
	url: "/patientList",
	complete: function(data){
		var patList = data.responseJSON;

		for (i in patList){
			for (x = 1; x < patList[i].length; x++){
				addPatient(patList[i][x].ordinateID, patList[i][x].fName + " " + patList[i][x].sName, x*15);
			}
		}
	}
})

function filter(){
	$('#smallTable tr:gt(0)').remove();

	$.ajax({
		url: "/patientList",
		complete: function(data){
			var patList = data.responseJSON;
			console.log(patList);
			
			if (docFilter.val() == 0){
				console.log("here");
				for (i in patList){
					for (x = 1; x < patList[i].length; x++){
						addPatient(patList[i][x].ordinateID, patList[i][x].fName + " " + patList[i][x].sName, x*15);
					}
				}

			} else {

				for (i in patList){
					if (patList[i][0].id == docFilter.val()){
						for (x = 1; x < patList[i].length; x++){
							addPatient(patList[i][x].ordinateID, patList[i][x].fName + " " + patList[i][x].sName, x*15);
						}
						break;
					}
				}

			}
		}
	})
}