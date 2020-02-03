var table = $("table");
var docHeading = $("#docHeader");

var testRow = table.append("<tr><td></td><td></td></tr>");
console.log(testRow.height());

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

				docHeading.fadeOut(function(){
					docHeading.text("Doctor " + docList[x][0].sName).fadeIn();
				});

				var y = 1;
				var rowColor;	
				var thTop;

				for (i = 1; i < docList[x].length; i++){
					
					var nextRowBottom = addPatient(docList[x][i].ordinateID, i*15, i);
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

					if (thTop < $(window).height()*0.20) break;

					if (y==4) y=0; 

					y++;
				}
	
				await sleep(sleepTime);
	
			}
	
		}
	});
}

loadDocLists();

setInterval(async function(){
	loadDocLists();
}, (sleepTime*noDoctors*3)+5); 
