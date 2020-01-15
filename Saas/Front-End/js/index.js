var table = $("table");
var docHeading = $("#docHeader");

function addPatient(patID, eta){	
	table.append("<tr><td>" + patID + "</td><td>"
		+ eta + "</td></tr>");
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var sleepTime = 7500;
var noDoctors = 4;

function loadDocLists(){
	$.ajax({
		url: '/patientList',
		complete: async function(data) {
	
			var docList = data.responseJSON;
			console.log(docList);
	
			for (x in docList) {
				
				$('#mainTable tr:gt(0)').remove();

				// docHeading.text(docList[x][0].sName);
				docHeading.fadeOut(function(){
					docHeading.text("Doctor " + docList[x][0].sName).fadeIn();
				});
				console.log(docList[x][0].sName);
				console.log(docList[x].length);
	
				for (i = 1; i < docList[x].length; i++){
					console.log(docList[x][i].ordinateID);
					addPatient(docList[x][i].ordinateID, i*15);
				}
	
				await sleep(sleepTime);
	
			}
	
		}
	});
}

loadDocLists();

setInterval(async function(){
	loadDocLists();
}, (sleepTime*noDoctors)+5); 
