module.exports = function(app, connection, bcrypt){
    app.get("/", function(req, res){
		res.render("login", {
			userWrong: false,
			passWrong: false
		})
	});

    app.post("/", function(req, res){
        var username = req.body.username
        var password = req.body.password

        var validateUsername = "select username, convert(password using utf8) as password from client_com having aes_decrypt(username,'" + process.env.usernameKey + "')='" + username + "'"
        console.log(validateUsername)

        connection.query(validateUsername, function(err, result){
            if (err) throw err

            if (result.length == 1){
                bcrypt.compare(password, result[0].password, function(err, correct){
                    if (correct){
                        res.render("index")
                    } else {
                        res.render("login", {
                            userWrong: false,
                            passWrong: true
                        })
                    }
                })
            } else {
                res.render("login", {
                    userWrong: true,
                    passWrong: false
                })
            }
        })
    })
}