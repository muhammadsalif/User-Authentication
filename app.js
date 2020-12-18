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


app.get("/", (req, res) => {
    res.send("Hello world")
})
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
    let currentUser = users.filter((eachUser) => eachUser.userName === req.body.userName)[0];
    console.log("Current user", currentUser)

    if (currentUser) {
        Bcrypt.varifyHash(JSON.stringify(req.body.password), currentUser.password)
            .then(passwordVerified => {
                console.log('password verified ', passwordVerified)

                if (passwordVerified) {
                    let tokenData = {
                        ip: req.socket.remoteAddress,
                        browserName: req.useragent.browser
                    };
                    console.log("Token daTa 1", JSON.stringify(tokenData))

                    Bcrypt.stringToHash(JSON.stringify(tokenData))
                        .then(token => {
                            sessions.push({
                                id: currentUser.id,
                                token: token,
                                expire: new Date().getTime() + (1000 * 60)
                            })

                            console.log("Users sessions", sessions)
                            res.json({ "token": token })
                        })
                } else {
                    res.send("Password in invalid")
                    console.log("Password is invalid");
                }
            }).catch(e => {
                console.log("error: ", e)
            })
    } else {
        res.send("Invalid username or password || user not found")
    }
})

app.get("/profile", (req, res) => {
    let session = sessions.filter((eachSession) => eachSession.token === req.query.token)[0]
    console.log("Sessions", sessions)
    console.log("Current session", session)

    if (!req.query.token) {
        res.send("token is Missing")
    }
    if (new Date().getTime() > session.expire) {
        res.status(401).send("Token expired")
        sessions = sessions.filter((eachSession) => eachSession.token !== req.query.token)
    }
    Bcrypt.validateHash(req.query.token)
        .then(isValidTokenHash => {
            console.log(isValidTokenHash)
            if (isValidTokenHash) {
                console.log("hash is valid")

                let tokenData = {
                    ip: req.socket.remoteAddress,
                    browserName: req.useragent.browser
                };

                console.log("Token daTa 2", JSON.stringify(tokenData))

                Bcrypt.varifyHash(JSON.stringify(tokenData), session.token)
                    .then(hashVerified => {
                        if (hashVerified) {

                            res.send("Welcome to profile")

                        } else {
                            res.send("Hash is invalid")
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

app.get("/dashboard", (req, res) => {
    let session = sessions.filter((eachSession) => eachSession.token === req.query.token)[0]
    console.log("Sessions", sessions)
    console.log("Current session", session)

    if (!req.query.token) {
        res.send("token is Missing")
    }
    if (new Date().getTime() > session.expire) {
        res.status(401).send("Token expired")
        sessions = sessions.filter((eachSession) => eachSession.token !== req.query.token)
    }
    Bcrypt.validateHash(req.query.token)
        .then(isValidTokenHash => {
            console.log(isValidTokenHash)
            if (isValidTokenHash) {
                console.log("hash is valid")

                let tokenData = {
                    ip: req.socket.remoteAddress,
                    browserName: req.useragent.browser
                };

                console.log("Token daTa 2", JSON.stringify(tokenData))

                Bcrypt.varifyHash(JSON.stringify(tokenData), session.token)
                    .then(hashVerified => {
                        if (hashVerified) {

                            res.send("Welcome to Dashboard")

                        } else {
                            res.send("Hash is invalid")
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


app.listen(port, () => {
    console.log("Server is running at port ", port)
})