const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategey = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");
const methodOverride = require("method-override");



mongoose.connect('mongodb://localhost:27017/encryptChat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret : "Samosa",
    resave : false,
    saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((res,req,next)=>{
//     res.locals.currentUser = req.user;
//     next();
// })

app.get("/",(req,res)=>{
    res.render("home.ejs");
    console.log(req.user);
})

app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.get("/register",(req,res)=>{
    res.render("register.ejs");
})

//handle signup
app.post("/register",(req,res)=>{
    let newUser = new User({username: req.body.username});
    User.register(new User(newUser),req.body.password,(err,user)=>{
       if(err){
        console.log(err);
        return res.render("register");
       } 
       passport.authenticate("local")(req,res,()=>{
           res.redirect("/chats");
       });
    });
});

// handle login logic
app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/chats",
        failureRedirect:"/login"
    }),(req,res)=>{
    
});
//logout route
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});



// CHATS
app.get("/chats", isLoggedIn ,(req,res)=>{
    console.log("loopcheck");
    res.render("chats.ejs");
})


// Middleware Function
function isLoggedIn(req,res,next) {
    
    if(req.isAuthenticated()){
        console.log("yes")
        next();
    }
    else res.redirect("/login");
}

app.listen(3000,()=>{
    console.log("encryptChat Started");
})