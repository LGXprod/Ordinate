var getDoctors = (req, res, connection) => {
    connection.query("select doctorID, fName, sName from doctor", function(err, results){
        if (err) throw err;

        var docList = [];

        for(i in results) {
            docList[i] = {
                doctorID: results[i].doctorID,
                fName: results[i].fName,
                sName: results[i].sName
            }
        }

        res.json(docList);
    })
}

module.exports = {
    getDoctors: getDoctors
}