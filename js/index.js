class Patient {
	constructor(ordinateID, doctorRequested){
		this.ordinateID = ordinateID;
		this.doctorRequested = doctorRequested;
	}

	getID(){
		return this.ordinateID;
	}

	getDoctor(){
		return this.doctorRequested;
	}
}

var submitButton = document.querySelector("Button");

submitButton.addEventListener("click", function() {
	newPatient = new Patient(document.getElementById("inputID").value, 
		document.getElementById("inputDoctor").value);
	alert(newPatient.getID() + " " + newPatient.getDoctor());
	localStorage.setItem("patient", newPatient.getID());
});