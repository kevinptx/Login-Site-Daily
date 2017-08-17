//declare constants and require modules for use in app.
const express = require("express")
const app = express()
const mustache = require("mustache-express")
const bodyParser = require("body-parser")
const url = require("url")
const session = require("express-session")
let users = require("./users")

app.engine("mustache", mustache())
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: false}))

var sess = {
  secret: "keyword cat",
  cookie: {},
  saveUninitialized: true,
  resave: true
}
//calling to use the encryptian var declared
app.use(session(sess))

//loading index page. go to home directory. set session line to false immediately, then you know user hasn't logged in. redirect immediately to login page so user can login.
app.get("/", function(req, res, next) {
  // console.log(req.session). person not logged in if false. sets session to false.
  //if req.session == truthy
  // render index, else redirect to login.
  req.session.authorization = false
  //person is not logged in so send them to login page (not URL)
  res.redirect("/login")
})

//Render the login page first
app.get("/login", function(req, res, next) {
  res.render("login")
})

//Authenticate what was received from teh form and compare it to your array of users. Redirect to the login if failed.
app.post("/authorization", function(req, res) {

  const username = req.body.username
  const password = req.body.password

  let user
  for (var i = 0; i < users.length; i++)
    if (users[i].username === username && users[i].password === password) {
      user = users[i]
    }
    //username is now in the if statement
    if (user) {
      req.session.user = user
      //authentication is now true since user logged in
      req.session.authorized = true
      //redirect back to homepage (index.mustache)
      res.redirect("/index")
    } else {
      res.render("login", {
        errorMsg: "Incorrect username & password. Provide correct login information."
      })
    }
  })

  //Store the current session user into req.user to be used later
  app.use(function(req, res, next){
    req.user = req.session.user
    next()
  })
  //push the info. to the index
  app.get("/index", function(req, res, next) {
    const currentUser = req.user

    res.render("index", {
      currentUser: currentUser
    })
  })

  app.listen(3000, function() {
    console.log("ok we are listening on port 3000")
  })
