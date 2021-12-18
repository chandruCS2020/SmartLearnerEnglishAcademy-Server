const express=require("express"),
    app=express(),
    userRouter=require("./routes/userRoutes"),
    cookieParser=require("cookie-parser"),
    feedbackRouter=require("./routes/feedbackRoutes"),
    contactRouter=require("./routes/contactRoutes"),
    adminRouter=require("./routes/adminRoutes");
require("./db/connect");


//Middleware

app.use(express.json());
app.use(cookieParser(process.env.JWTCOOKIESECRET))
app.use(express.urlencoded({extended:false}))
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
})


//Routers Merge Point
app.use(userRouter);
app.use(feedbackRouter);
app.use(contactRouter)
app.use(adminRouter)


app.options("/*",(req,res)=>{
    res.send();
})



app.get("/*",(req,res)=>{
    res.send();
})


app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})