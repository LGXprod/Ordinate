var table = $("table");
var docFilter = $("#docFilter");

function addPatient(patID, eta){	
	table.append("<tr><td>" + patID + "</td><td>"
		+ eta + "</td></tr>");
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
	url: "/docFilter",
	complete: function(data){
		var patList = data.responseJSON;
		for (i in patList){
			table.append(patList[i].ordinateID, (i++)*15)
		}
	}
})