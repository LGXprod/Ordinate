var body = $("body");

$.ajax({
    url: "/submission",
    complete: function(data){
        console.log(data.responseJSON);
        var patient = data.responseJSON;

        $("#fName").text(patient.fName);
        $("#sName").text(patient.sName);

        var dob = new Date(patient.dob);
        $("#dob").text(dob.getDate() + "/" + (dob.getMonth()+1) + "/" + dob.getFullYear());

        $("#id").text("Assigned ID: " + patient.ordinateID);
    }
});

$("#confirmBtn").click(function(){
    window.location.replace("/");
});

$("#deleteBtn").click(function(){
    window.location.replace("delete");
});