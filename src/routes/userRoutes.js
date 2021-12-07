const express=require("express"),
    app=express.Router(),
    email=require("../helper/email"),
    jwt=require("jsonwebtoken"),
    isEmailVerified=require("../helper/isEmailVerified")



app.get("/signup-email",async (req,res)=>{
    try{
        let token=jwt.sign({email:req.query.email},process.env.JWTEMAILSECRET,{expiresIn:1000*60*10});
        let url=`${req.protocol}://${req.headers.host}/email-verification/${token}`
        console.log(url);
        await email(req.query.email,process.env.SUBJECT,url)
        res.send()
    }catch(err){
        res.status(400).send(err.message);
    }
})

//TODO
//email link click -> route -> verfiy -> return a (form +cookies) -> validate and store in db
    //       (done)         (done)    (done)    (done)                        ()
app.get("/email-verification/:token",(req,res)=>{
    try{
        const {email}=jwt.verify(req.params.token,process.env.JWTEMAILSECRET);
        res.cookie("email",email,{
            maxAge:1000*60*10,
            path:"/signup-email",
            signed:true
        })
        res.send();
    }catch(err){
        res.status(400).send(err.message);
    }
})

app.post("/signup-email",isEmailVerified,(req,res)=>{
    try{
        req.body.email=req.signedCookies.email;
        res.send(req.body);
    }catch(err){
        res.status(400).send(err.message);
    }
})



module.exports=app;