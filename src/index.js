const express=require("express"),
    app=express(),
    userRouter=require("./routes/userRoutes"),
    cookieParser=require("cookie-parser");
require("./db/connect");


//Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWTCOOKIESECRET))


//Routers Merge Point
app.use(userRouter);



app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})