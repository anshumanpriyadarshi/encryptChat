const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategey = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");
const Message = require("./models/message");
const methodOverride = require("method-override");
const message = require("./models/message.js");



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
    res.render("home.ejs",{currentUser: req.user});
    // console.log(req.user);
})

// app.get("/sendmsg",isLoggedIn,(req,res)=>{
//     res.render("sender.ejs",{currentUser: req.user});
// })

app.get("/:id/sendmsg" , isLoggedIn ,(req,res)=>{
    
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err);
        }else{
           
            res.render("sender.ejs",{currentUser: req.user, reciever : user})
        }
    });

    
})

app.post("/send",(req,res)=>{
    let recipient = req.body.message.reciever;
    console.log(req.body);
    User.find({"username" : recipient},(err,foundUser)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(foundUser);
            // let message = {};
            // message.sender.id = req.user._id;
            // message.sender.username = req.user.username;
            // message.reciever.id = foundUser._id;
            // message.reciever.username = foundUser.username;
            // message.text = req.body.message;

            Message.create(req.body.message,(err,createdMessage)=>{
                // console.log("==" + req.body.)
                if(err){
                    console.log(err);
                }
                else{
                    
                    createdMessage.sender.id = req.user._id;
                    createdMessage.sender.username = req.user.username;
                    createdMessage.reciever.id = foundUser[0]._id;
                    createdMessage.reciever.username = foundUser[0].username;

                    // console.log(foundUser[0]);
                    // console.log(createdMessage.reciever);
                    createdMessage.save((err,msg)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            
                        }
                    })

                    foundUser[0].message.push(createdMessage);
                    foundUser[0].save((err,doc)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(message);
                            res.redirect("/chats");
                        }
                    })
                }
            })




        }
    } 
)});

// app.post("/send",(req,res)=>{
//     let recipient = req.body.message.reciever;
//     console.log(req.body);
//     User.findById({"username" : recipient},(err,foundUser)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log(foundUser);
//             // let message = {};
//             // message.sender.id = req.user._id;
//             // message.sender.username = req.user.username;
//             // message.reciever.id = foundUser._id;
//             // message.reciever.username = foundUser.username;
//             // message.text = req.body.message;

//             Message.create(req.body.message,(err,createdMessage)=>{
//                 // console.log("==" + req.body.)
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
                    
//                     createdMessage.sender.id = req.user._id;
//                     createdMessage.sender.username = req.user.username;
//                     createdMessage.reciever.id = foundUser[0]._id;
//                     createdMessage.reciever.username = foundUser[0].username;

//                     // console.log(foundUser[0]);
//                     // console.log(createdMessage.reciever);
//                     createdMessage.save((err,msg)=>{
//                         if(err){
//                             console.log(err);
//                         }
//                         else{
                            
//                         }
//                     })

//                     foundUser[0].message.push(createdMessage);
//                     foundUser[0].save((err,doc)=>{
//                         if(err){
//                             console.log(err);
//                         }
//                         else{
//                             console.log(message);
//                             res.redirect("/chats");
//                         }
//                     })
//                 }
//             })




//         }
//     } 
// )});

app.get("/login",(req,res)=>{
    res.render("login.ejs",{currentUser:req.user});
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
        successRedirect:"/",
        failureRedirect:"/login"
    }),(req,res)=>{
    
});
//logout route
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

//Contacts Route

app.get("/contacts",(req,res)=>{
    User.find({},(err,users)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("contacts.ejs",{foundUsers : users});
        }
    })
})



// CHATS
app.get("/chats", isLoggedIn ,(req,res)=>{
    // console.log("loopcheck");
    User.findById(req.user._id).populate("message").exec((err,foundUser)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("chats.ejs",{currentUser:foundUser});
        }
    })
    
})


// Middleware Function
function isLoggedIn(req,res,next) {
    
    if(req.isAuthenticated()){
        // console.log("yes")
        next();
    }
    else res.redirect("/login");
}

app.listen(3000,()=>{
    console.log("encryptChat Started");
})