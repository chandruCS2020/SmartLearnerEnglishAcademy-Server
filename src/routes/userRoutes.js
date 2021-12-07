const express=require("express"),
    app=express.Router(),
    email=require("../helper/email"),
    jwt=require("jsonwebtoken");

app.get("/signup-email",async (req,res)=>{
    try{
        let token=jwt.sign({email:req.query.email},process.env.JWTEMAILSECRET,{expiresIn:1000*60*10});
        let url=`http://localhost:3000/${token}`
        await email(req.query.email,process.env.SUBJECT,url)
        res.send()
    }catch(err){
        res.status(400).send(err.message);
    }
})


app.post("/signup",(req,res)=>{
    console.log(req.body);
    res.send("sdf");
})

module.exports=app;