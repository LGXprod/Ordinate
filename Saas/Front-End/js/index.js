var table = $("table");
var newPatientOld = localStorage.getItem('patient');

function addPatient(){	
	table.append("<tr><td>" + localStorage.getItem('patient') + "</td><td>"
		+ localStorage.getItem('eta') + "</td></tr>");
}

setInterval(function(){
	var newPatientNew = localStorage.getItem('patient');
	// alert(newPatientOld + " vs " + newPatientNew);
	if (newPatientOld !== newPatientNew){
		// alert("here");
		addPatient();
		newPatientOld = localStorage.getItem('patient');
	}
}, 1000);
