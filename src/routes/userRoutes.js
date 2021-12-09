const express=require("express"),
    app=express.Router(),
    email=require("../helper/email"),
    jwt=require("jsonwebtoken"),
    isEmailVerified=require("../helper/isEmailVerified"),
    User=require("../db/user");



//sigup-email-password

app.get("/signup-email",async (req,res)=>{
    try{
        let token=jwt.sign({email:req.query.email},process.env.JWTEMAILSECRET,{expiresIn:60*10});
        let url=`${req.protocol}://${req.headers.host}/email-verification/${token}`
        // console.log(url);
        await email(req.query.email,process.env.SUBJECT,url)
        res.send()
    }catch(err){
        res.status(400).send(err.message);
    }
})

//TODO
//email link click -> route -> verfiy -> return a (form +cookies) -> validate and store in db
    //       (done)    (done)    (done)    (done)                        (done)
app.get("/email-verification/:token",(req,res)=>{
    try{
        const {email}=jwt.verify(req.params.token,process.env.JWTEMAILSECRET);
        res.cookie("email",email,{
            maxAge:1000*60*10,
            signed:true
        })
        res.send();
    }catch(err){
        res.status(400).send(err.message);
    }
})

app.post("/signup-email",isEmailVerified,async (req,res)=>{
    try{
        res.set("Access-Control-Allow-Origin","http://localhost:3001");
        res.set("Access-Control-Allow-Credentials","true");
        if(!req.body.password)throw new Error("password required")
        let newUser=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            password:req.body.password,
            email:req.signedCookies.email,
            admin:false
        });
        newUser=await newUser.save();
        newUser.createAuthJwt();
        res.cookie("sid",newUser.jwt,{
            httpOnly:true
        })
        res.clearCookie("email",{path:"/signup-email"})
        return res.send(newUser);
    }catch(err){
        res.status(400).send(err.message);
    }
})


app.options("/signup-email",(req,res)=>{
    res.set("Access-Control-Allow-Origin","http://localhost:3001");
    res.set("Access-Control-Allow-Credentials","true");
    res.set("Access-Control-Allow-Headers","Content-type");
    res.send();
})

//login-email-password
// TODO
// route -> check email password in db -> error 
//                                     ->succes -> cookie

app.post("/login-password",async (req,res)=>{
    try{
        const {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user)throw new Error("invalid credentials")
        await user.authenticate(password)
        await user.save();
        res.cookie("sid",user.jwt,{
            httpOnly:true
        })
        res.send("login succesfull");
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=app;