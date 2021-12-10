const express=require("express"),
    app=express(),
    userRouter=require("./routes/userRoutes"),
    cookieParser=require("cookie-parser"),
    feedbackRouter=require("./routes/feedbackRoutes")
    contactRouter=require("./routes/contactRoutes");
require("./db/connect");


//Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWTCOOKIESECRET))
app.use(express.urlencoded({extended:false}))

//Routers Merge Point
app.use(userRouter);
app.use(feedbackRouter);
app.use(contactRouter)


app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})