const validateUsername = function(connection, username){
    return new Promise ((resolve, reject) => {
        var validateUsername = "select username, convert(password using utf8) as password from client_com having aes_decrypt(username,'" 
        + process.env.usernameKey + "')='" + username + "'"

        connection.query(validateUsername, function(err, result){
            if (err) {
                reject("Query didn't work")
                throw err
            }

            if (result.length == 0){
                resolve({
                    isValid: false
                })
            } else {
                resolve({
                    isValid: true,
                    password: result[0].password
                })
            }
        })
    })
}

const validatePassword = (inputPassword, storedPassword, bcrypt) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputPassword, storedPassword, function(err, correct){
            if (err) {
                reject("Bcrypt comparison broke")
                throw err
            }

            if (correct) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

module.exports = {
    validateUsername: validateUsername,
    validatePassword: validatePassword
}