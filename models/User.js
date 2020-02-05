const mysql = require("mysql")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function validatePassword(connection, password){
    var validateUsername = "select username, convert(password using utf8) as password from client_com having aes_decrypt(username,'" 
                            + process.env.usernameKey + "')='" + username + "'"

    connection.query(validateUsername, function(err, result){
        if (err) throw err

        if (result.length == 1){
            bcrypt.compare(password, result[0].password, function(err, correct){
                return correct
            })
        } 
    })
}