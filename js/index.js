var table = $("table");
var docHeading = $("#docHeader");

$("#firstRow").css({"background-color": "#099ca4"})

function addPatient(patID, eta, i){	
	table.append("<tr id='row" + i + "'><td>" + patID + "</td><td>"
		+ eta + "</td></tr>");
	
	var topPosition = $("#row" + i).position().top;
	var height = $("#row" + i).height();

	var nextRowBottom = topPosition + (height*2);
	
	return nextRowBottom;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var sleepTime = 10000;
var noDoctors = 4;

function loadDocLists(){
	$.ajax({
		url: '/patientList',
		complete: async function(data) {
	
			var docList = data.responseJSON;
			//console.log(docList);
	
			for (x in docList) {
				
				$('#mainTable tr:gt(0)').remove();

				// docHeading.text(docList[x][0].sName);
				docHeading.fadeOut(function(){
					docHeading.text("Doctor " + docList[x][0].sName).fadeIn();
				});
				// console.log(docList[x][0].sName);
				// console.log(docList[x].length);

				var y = 1;
				var rowColor;	
				for (i = 1; i < docList[x].length; i++){
					//console.log(docList[x][i].ordinateID);
					var nextRowBottom = addPatient(docList[x][i].ordinateID, i*15, i);
					console.log(y);
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

					if (y==4) y=0; 

					var viewableHeight = $(window).height();
					console.log("Row bottom: " + nextRowBottom + " Viewable height: " + viewableHeight);

					if (nextRowBottom >= viewableHeight){
						console.log("Passed bottom");
						// await sleep(sleepTime/2);
						// $('#mainTable tr:gt(0)').remove();
						// addFromDocList(i);
					} 

					y++;
				}
	
				// async function addFromDocList(position){
				// 	for (i = position; i < docList[x].length; i++){
				// 		//console.log(docList[x][i].ordinateID);
				// 		var nextRowBottom = addPatient(docList[x][i].ordinateID, i*15, i);
				// 		var viewableHeight = $(window).height();
				// 		console.log("Row bottom: " + nextRowBottom + " Viewable height: " + viewableHeight);
	
				// 		// if (nextRowBottom >= viewableHeight){
				// 		// 	console.log("Passed bottom");
				// 		// 	await sleep(sleepTime/2);
				// 		// 	$('#mainTable tr:gt(0)').remove();
				// 		// 	addFromDocList(i);
				// 		// } 
				// 	}
				// }

				//addFromDocList(1);
	
				await sleep(sleepTime);
	
			}
	
		}
	});
}

loadDocLists();

setInterval(async function(){
	loadDocLists();
}, (sleepTime*noDoctors*3)+5); 
