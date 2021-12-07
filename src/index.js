const express=require("express"),
    app=express(),
    userRouter=require("./routes/userRoutes");

//Midbleware
app.use(express.json());

//Routers Merge Point
app.use(userRouter);



app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})