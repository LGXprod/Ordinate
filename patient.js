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