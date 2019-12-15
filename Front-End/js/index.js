class Patient {
	constructor(ordinateID, doctorRequested){
		this.ordinateID = ordinateID;
		this.doctorRequested = doctorRequested;
		this.timeArrived = new Date();
	}

	getID(){
		return this.ordinateID;
	}

	getDoctor(){
		return this.doctorRequested;
	}

	getTimeArrived(){
		return this.timeArrived;
	}
}

var submitButton = document.querySelector("Button");

submitButton.addEventListener("click", function() {

	newPatient = new Patient(document.getElementById("inputID").value, 
		document.getElementById("inputDoctor").value);

	alert(newPatient.getID() + " is being added to Doctor " + newPatient.getDoctor());
	localStorage.setItem("patient", newPatient.getID());

	var time = newPatient.getTimeArrived();
	alert(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
	localStorage.setItem("eta", time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
});