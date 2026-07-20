if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}


const express = require('express');
const app = express();
const mongoose = require ("mongoose");
// const dns = require("dns");
const Listing = require('./models/listing');
const path = require ("path");
const methodOverride = require("method-override");


const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const { listingSchema } = require("./schema.js")
const listingsRouter = require("./routes/listing")
const session = require("express-session")
const {MongoStore} = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const userRouter = require("./routes/user")
require("dotenv").config()


// changed: use public DNS servers so mongodb+srv Atlas lookup does not get refused
// dns.setServers(["8.8.8.8","1.1.1.1"]);

const dbUrl = process.env.ATLASDB_URL
// Render provides the live port in process.env.PORT; locally we still use 8080.
const port = process.env.PORT || 8080;


async function main(){
    await mongoose.connect(dbUrl)
}
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
    
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"public")))

// app.use((req,res,next)=>{
//     // Set safe defaults before session/passport run, so error pages and included EJS files
//     // can still render even if MongoDB session storage fails.
//     res.locals.success = [];
//     res.locals.error = [];
//     res.locals.currentUser = null;
//     next();
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
    
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7,
        httpOnly : true,
    }
}
app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // After passport.session(), req.user contains the logged-in user.
    // These locals are available in every EJS template, including navbar.ejs.
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// app.get("/",(req,res)=>{
//     res.send("Hello World")
// })


app.use("/listings", listingsRouter);
app.use("/", userRouter);

// check this is not working

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
// custom error handling
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message= "Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message})
})

app.listen(port,()=>{
    console.log(`Server is Listening to port ${port}`)
})
