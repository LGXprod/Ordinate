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

function loadDocLists(){
	$.ajax({
		url: '/doctorList',
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
	
				await sleep(7500);
	
			}
	
		}
	});
}

loadDocLists();