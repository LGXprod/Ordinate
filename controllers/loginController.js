module.exports = async function(app, connection, bcrypt, user) {
    app.get("/", function(req, res){
		res.render("login", {
			userWrong: false,
			passWrong: false
		})
	});

    app.post("/", function(req, res){
        var username = req.body.username
        var password = req.body.password

        user.validateUsername(connection, username).then((thePatient) => {
            if (thePatient.isValid) {
                user.validatePassword(password, thePatient.password, bcrypt).then((valid) => {
                    if (valid) {
                        res.render("index")
                    } else {
                        res.render("login", {
                            userWrong: false,
                            passWrong: true
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                res.render("login", {
                    userWrong: false,
                    passWrong: true
                })
            }
        }).catch((error) => {
            console.log(error)
            res.render("login", {
                userWrong: false,
                passWrong: false
            })
        })
    })
}