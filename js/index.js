var table = $("table");
var docHeading = $("#docHeader");

var testRow = table.append("<tr><td></td><td></td></tr>");
console.log(testRow.height());

$("#firstRow").css({"background-color": "#099ca4"})

function addPatient(patID, eta, i){	
	table.append("<tr id='row" + i + "'><td>" + patID + "</td><td>"
		+ eta + "</td></tr>");
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var sleepTime = 5000;
var noDoctors = 4;

async function addPatientsFromList(docList, firstRow){
	var y = 1;
	var rowColor;	
	var thTop;

	for (i = firstRow; i < docList.length; i++){
		
		addPatient(docList[i].ordinateID, i*15, i);
		thTop = table.position().top;
		console.log(thTop)

		switch (y){
			case 1:
				rowColor = "#f38181";
				break;
			case 2:
				rowColor = "#fce38a";
				break;
			case 3:
				rowColor = "#eaffd0";
				break;
			case 4:
				rowColor = "#95e1d3";
				break;
			default:
				console.log("Broken");
				break;
		}

		$("#row"+i).css({ "background-color" : rowColor });

		var addInvisRows = true;

		if (thTop < $(window).height()*0.20){
			addInvisRows = false;
			await sleep(sleepTime);
			$('#mainTable tr:gt(0)').remove();
			addPatientsFromList(docList, i);
		}

		if (y==4) y=0; 

		y++;
	}

	while (!(thTop < $(window).height()*0.20)){
		table.append("<tr><td></td><td></td></tr>");
		thTop = table.position().top;
	}
}

function loadDocLists(){
	$.ajax({
		url: '/patientList',
		complete: async function(data) {
	
			var docList = data.responseJSON;
	
			for (x in docList) {
				
				$('#mainTable tr:gt(0)').remove();

				docHeading.fadeOut(function(){
					docHeading.text("Doctor " + docList[x][0].sName).fadeIn();
				});

				await addPatientsFromList(docList[x], 1);
	
				await sleep(sleepTime);
	
			}

			loadDocLists();
	
		}
	});
}

loadDocLists();

// setInterval(async function(){
// 	loadDocLists();
// }, (sleepTime*noDoctors*3)+5); 
