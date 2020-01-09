var table = $("table");
var docHeading = $("h1");

function addPatient(patID, eta){	
	table.append("<tr><td>" + patID + "</td><td>"
		+ eta + "</td></tr>");
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function loadDocLists(){
	$.ajax({
		url: '/patientList',
		complete: async function(data) {
	
			var docList = data.responseJSON;
			console.log(docList);
	
			for (x in docList) {

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
	
				await sleep(7500);
	
				$('#mainTable tr:gt(0)').remove();
	
			}
	
		}
	});
}

loadDocLists();

setInterval(function(){
	loadDocLists();
}, 31000);
