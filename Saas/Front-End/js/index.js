var table = $("table");

function addPatient(patID, docID){	
	table.append("<tr><td>" + patID + "</td><td>"
		+ docID + "</td></tr>");
}

setInterval(function(){
	$(document).ready(function() {
		table.find("tr:gt(0)").remove();
	 });

	$.ajax({
		url: '/patientList',
		complete: function(data) {
			var patArray = data.responseJSON;
			for (x in patArray) {
				addPatient(patArray[x].ordinateID, (++x)*15);
			}
		}
	});
}, 2500);
