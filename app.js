let express = require("express");
let app = express();
let port = process.env.PORT || 5000;
let bodyParser = require('body-parser')

let Bcrypt = require("bcrypt-inzi");

let useragent = require('express-useragent');

app.use(useragent.express());

// parse application/json
app.use(bodyParser.json())

let users = [
    // { userName: "Muhammad Salif", password: 123456 }
    // { id: 2, userName: "ali", password: 123 },
]
console.log("Users array", users)

let sessions = [
    // { id: 2, token: "sdfrwerfew54er2rfwerwrw", expire: 1607424594798 },
    // { id: 2, token: "sdfrwerfew54er2rfwerwrw", expire: 1607424594798 },
]



app.post("/signup", (req, res) => {
    if (!req.body || !req.body.userName || !req.body.password) {
        res.send("Information is missing")
        console.log("Information is missing")
        return;
    }
    Bcrypt.stringToHash(JSON.stringify(req.body.password))
        .then(passwordHash => {
            users.push({
                id: Math.ceil(Math.random() * 100),
                userName: req.body.userName,
                password: passwordHash
            })
            res.send("SignUp Successfully")
            console.log("User Signup successfully :", req.body.userName)
        })
})

app.post("/login", (req, res) => {

    if (!req.body || !req.body.userName || !req.body.password) {
        res.send("Username or password is Missing")
        return
    }
    let currentUser = users.filter((eachUser) => eachUser.userName === req.body.userName);
    currentUser = currentUser[0]
    console.log("Current user", currentUser)

    if (currentUser) {

        // Bcrypt.stringToHash(req.body.password)
        //     .then(passwordHash => {
        //         console.log("hash: ", passwordHash);

        Bcrypt.varifyHash(JSON.stringify(req.body.password), currentUser.password)
            .then(passwordVerified => {
                console.log('password verified ', passwordVerified)

                if (passwordVerified) {

                    let tokenData = {
                        ip: req.socket.remoteAddress,
                        browserName: req.useragent.browser
                    };

                    Bcrypt.stringToHash(JSON.stringify(tokenData))
                        .then(token => {
                            sessions.push({
                                id: currentUser.id,
                                token: token,
                                expire: new Date().getTime() + 300
                            })

                            console.log("Users sessions", sessions)
                            res.send("Login success, token:" + token)
                        })
                } else {
                    res.send("Password in invalid")
                    console.log("Password is invalid");
                }
            }).catch(e => {
                console.log("error: ", e)
            })
        // })
    } else {
        res.send("Invalid username or password || user not found")
    }


})


app.get("/profile/:token", (req, res) => {
    let session = sessions.filter((eachSession) => eachSession.token === req.params.token)
    console.log("Sessions", sessions)
    console.log("Current session", session)

    if (!req.params.token) {
        res.send("token is Missing")
    }
    if (new Date().getTime() > session.expire) {
        res.status(401).send("Token expired")
        sessions = sessions.filter((eachSession) => eachSession.token !== req.params.token)
    }
    Bcrypt.validateHash(req.params.token)
        .then(isValidTokenHash => {
            console.log(isValidTokenHash)
            if (isValidTokenHash) {
                console.log("hash is valid")
                Bcrypt.varifyHash(isValidTokenHash, session.token)
                    .then(hashVerified => {
                        if (hashVerified) {

                            res.send("Welcome to profile")

                        } else {
                            console.log("hash is not valid");
                        }
                    }).catch(e => {
                        console.log("error: ", e)
                    })
            } else {
                res.send("Not valid token")
                console.log("hash is invalid")
            }
        })
}
)

app.get("/dashboard/:token", (req, res, next) => {

    let session = sessions.filter((eachSession) => eachSession.token === req.params.token)

    if (!req.params.token) {
        res.send("token is Missing")
    }
    if (new Date().getTime() > session.expire) {
        res.status(401).send("Token expired")
        sessions = sessions.filter((eachSession) => eachSession.token !== req.params.token)
    }
    Bcrypt.validateHash(JSON.stringify(req.params.token))
        .then(isValidHash => {
            if (isValidHash) {
                console.log("hash is valid")
                Bcrypt.varifyHash(isValidHash, session.token)
                    .then(hashVerified => {
                        if (hashVerified) {

                            res.send("Welcome to dashboard")

                        } else {
                            console.log("hash is not valid");
                        }
                    }).catch(e => {
                        console.log("error: ", e)
                    })
            } else {
                console.log("hash is invalid")
            }
        })
}
)

app.listen(port, () => {
    console.log("Server is running at port ", port)
})