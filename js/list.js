var table = document.querySelector("table");
var newPatientOld = localStorage.getItem('patient');

function addPatient(){	
	var row = table.insertRow();
	var id = row.insertCell(0);
	var doctor = row.insertCell(1);
	id.innerText = localStorage.getItem('patient');
	doctor.innerText = localStorage.getItem('patient');
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
