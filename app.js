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
    { id: 2, userName: "ali", password: 123 },
]
console.log("Users array", users)

let sessions = [
    { id: 2, token: "sdfrwerfew54er2rfwerwrw", expire: 1607424594798 },
    { id: 2, token: "sdfrwerfew54er2rfwerwrw", expire: 1607424594798 },
]

app.post("/signup", (req, res) => {
    if (!req.body || !req.body.userName || !req.body.password) {
        res.send("Information is missing")
        return;
    }
    users.push({
        id: Math.ceil(Math.random() * 100),
        userName: req.body.userName,
        password: req.body.password
    })
    res.send("Sign up successfully")
    console.log("User Signup successfully :", req.body.userName)
})

app.post("/login", (req, res) => {

    if (!req.body || !req.body.userName || !req.body.password) {
        res.send("Username or password is Missing")
    }
    let currentUser = users.filter((eachUser) => eachUser.userName === req.body.userName);

    if (currentUser) {
        let passwordVerified = false
        // Verifying user given password to the hash of that password in the database
        Bcrypt.varifyHash(req.body.password, currentUser.password)
            .then(result => {
                if (result) {
                    return passwordVerified = result;
                    console.log("matched");
                } else {
                    console.log("not matched");
                }
            }).catch(e => {
                console.log("error: ", e)
            })

        if (passwordVerified) {

            // make token using ip, browser name, 
            let tokenData = {
                ip: req.socket.remoteAddress,
                browserName: req.useragent.browser
            };
            console.log("Token is : ", tokenData)

            Bcrypt.stringToHash(JSON.stringify(tokenData))
                .then(token => {
                    sessions.push({
                        id: currentUser.id,
                        token: token,
                        expire: new Date().getTime() + 300
                    })

                    res.send("Login success, token:" + token)
                })
            console.log("Session is : ", sessions)

        } else {
            res.send("password didnt match")
        }
    }
    else {
        res.send("User not found")
    }
})

app.get("/profile/:token", (req, res, next) => {

    if (!req.params.token) {
        res.send("token is Missing")
    }
    let session = sessions.filter((eachSession) => eachSession.token === req.params.token)
    res.send("Welcome to profile")
    if (new Date().getTime() > session.expire) {
        res.status(401).send("Token expired")
        sessions = sessions.filter((eachSession) => eachSession.token !== req.params.token)
    }
}
)

app.get("/dashboard/:token", (req, res, next) => {

    if (!req.params.token) {
        res.send("token is Missing")
    }
    let session = sessions.filter((eachSession) => eachSession.token === req.params.token)
    res.send("Welcome to dashboard")
    if (new Date().getTime() > session.expire) {
        res.status(401).send("Token expired")
        sessions = sessions.filter((eachSession) => eachSession.token !== req.params.token)
    }
}
)

app.listen(port, () => {
    console.log("Server is running at port ", port)
})