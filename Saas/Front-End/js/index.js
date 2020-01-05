var table = $("table");

function addPatient(patID, docID){	
	table.append("<tr><td>" + patID + "</td><td>"
		+ docID + "</td></tr>");
}

setInterval(function(){
	$.ajax({
		url: '/patientList',
		complete: function(data) {
			var patArray = data.responseJSON;

			for (x in patArray) {
				addPatient(patArray[x].ordinateID, patArray[x].doctorID);
			}

			
		}
	});
}, 2000);
