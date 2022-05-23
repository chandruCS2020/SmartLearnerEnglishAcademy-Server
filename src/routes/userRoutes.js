const express=require("express"),
    app=express.Router(),
    email=require("../helper/email"),
    jwt=require("jsonwebtoken"),
    isEmailVerified=require("../helper/isEmailVerified"),
    User=require("../db/user"),
    axios=require("axios"),
    loginMiddleWare=require("../helper/loginMiddleWare"),
    form = require('../db/form');



//sigup-email-password

app.get("/signup-email",async (req,res)=>{
    try{
        let token=jwt.sign({email:req.query.email},process.env.JWTEMAILSECRET,{expiresIn:60*10});
        let url=`https://${req.headers.host}/email-verification/${token}`
        // console.log(url);
        await email(req.query.email,"Email Verification",`
            <div class="container" style="background-color: #ddd;text-align: center;max-width: 600px;margin: auto;">
            <div class="main" style="background-color: #003399;padding: 10%;color: #fff;">
                <h4 style="font-weight: 400;font-size: 1rem;">THANKS FOR SIGNING UP!</h4>
                <h2 style="font-weight: bold;font-size: 2rem;">Verify Your E-mail Address</h2>
            </div>
            <div class="submain" style="padding: 10%;font-weight: 400;color: rgba(0, 0, 0, 0.747);">
                <h3 >Hi,</h3>
                <h4 style="line-height: 30px;">You're almost ready to get started.Please click on button below to verify your email address and enjoy exclusive cleaning services with us!</h4>
                <a style="padding: 15px 40px;border-radius: 4px;  background-color: #FF6600;color: #fff;text-decoration: none;" href=${url} target='_blank'>VERIFY YOUR EMAIL</a>
                <h3 style="margin-top: 70px;">Thanks,</h3>
                <h3>The Company Team</h3>
            </div>
            <div class="footer" style="background-color: #003399;padding: 3% 10%;color: #fff;">
                <h4>Copyrights © Company All Rights Reserved</h4>
            </div>
        </div>
        `)
        var computerSciencePortal = "Verification Link has sent to Mail";
        res.send(computerSciencePortal);
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
            signed:true,
            sameSite:'none',
            secure:true
        })

        res.redirect(process.env.FRONTENDURL+"Register");

    }catch(err){
        res.status(400).send(err.message);
    }
})

app.post("/signup-email",isEmailVerified,async (req,res)=>{
    try{
        if(!req.body.password)throw new Error("password required")
        let newUser=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            password:req.body.password,
            email:req.signedCookies.email,
            admin:false
        });
        newUser.createAuthJwt();
        newUser=await newUser.save();
        // res.cookie("sid",newUser.jwt,{
        //     httpOnly:true,
        //     maxAge:1000*60*60*24*7
        // })
        res.clearCookie("email",{path:"/"})
        res.send(newUser.jwt);
    }catch(err){
        if(err.code===11000)return res.status(403).send(`${req.signedCookies.email} is existed`)
        res.status(400).send(err.message);
    }
})




//login-email-password
// TODO
// route -> check email password in db -> error 
//                                     ->succes -> cookie

app.post("/login-email",async (req,res)=>{
    try{
        res.set("access-control-expose-headers", "Set-Cookie")
        const {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user)throw new Error("invalid credentials")
        await user.authenticate(password)

        await user.save();
        // res.cookie("sid",user.jwt,{
        //     maxAge:1000*60*60*24*7
        // })
        // if(user.admin)return res.send("admin");
        // console.log(process.env.)
        res.send(user.jwt);

    }catch(err){
        res.status(400).send(err.message);
    }
})
app.get("/setCookie/:token",(req,res)=>{
    res.clearCookie("email",{path:"/"})
    res.clearCookie("gid",{path:"/"})
    res.cookie("sid",req.params.token,{maxAge:1000*60*60*24*7,sameSite:'none',secure:true});
    res.redirect(process.env.FRONTENDURL);
})

//google-auth

//TODO
//req hit -> return link with client id

app.get("/google-auth-signup",(req,res)=>{
    let url=`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLECLIENTID}&scope=openid%20email%20profile&redirect_uri=https%3A//${req.headers.host}/signup-oauth-google-callback&state=aroundTrip`
    res.send(url)
})

//TODO
//got code -> exchange token -> get id with token -> send res +cookie
//(done)        (done)                  (done)                  ()
app.get("/signup-oauth-google-callback",async (req,res)=>{
    try{
        let {data}=await axios({
            url:"https://oauth2.googleapis.com/token",
            method:"post",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data:`code=${req.query.code}&client_id=${process.env.GOOGLECLIENTID}&client_secret=${process.env.GOOGLESECRET}&redirect_uri=https%3A//${req.headers.host}/signup-oauth-google-callback&grant_type=authorization_code`
        })
        let {data:userInfo}=await axios({
            url:"https://www.googleapis.com/oauth2/v2/userinfo",
            method:"get",
            headers:{
                Authorization:`Bearer ${data.access_token}`
            }
        })
        res.cookie("gid",{
            email:userInfo.email,
            id:userInfo.id
        },{
            signed:true,
            maxAge:1000*60*10,
            sameSite:"none",
            secure:true
            
        })
        res.redirect(process.env.FRONTENDURL+"Google-oauth-signup");
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/signup-oauth",isEmailVerified,async (req,res)=>{
    try{
        let newUser=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.signedCookies.gid.email,
            googleLinked:req.signedCookies.gid.id,
            admin:false
        });
        newUser.createAuthJwt();
        await newUser.save();
        
        return res.send(newUser.jwt);
    }catch(err){
        if(err.code===11000)return res.status(400).send(`${req.signedCookies.gid.email} is existed`)
        res.status(400).send(err.message);
    }
})




app.get("/google-auth-login",(req,res)=>{
    let url=`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLECLIENTID}&scope=openid%20email%20profile&redirect_uri=https%3A//${req.headers.host}/login-oauth-google-callback&state=aroundTrip`
    res.send(url)
})

app.get("/login-oauth-google-callback",async (req,res)=>{
    try{
        let {data}=await axios({
            url:"https://oauth2.googleapis.com/token",
            method:"post",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data:`code=${req.query.code}&client_id=${process.env.GOOGLECLIENTID}&client_secret=${process.env.GOOGLESECRET}&redirect_uri=https%3A//${req.headers.host}/login-oauth-google-callback&grant_type=authorization_code`
        })
        let {data:userInfo}=await axios({
            url:"https://www.googleapis.com/oauth2/v2/userinfo",
            method:"get",
            headers:{
                Authorization:`Bearer ${data.access_token}`
            }
        })
        let user=await User.findOne({googleLinked:userInfo.id})
        if(!user)throw new Error("invalid credentials");
        user.createAuthJwt();
        await user.save();
        res.cookie("sid",user.jwt,{
            httpOnly:true,
            maxAge:1000*60*60*24*7,
            sameSite:'none',
            secure:true
        })
        // console.log("success")
        res.clearCookie("gid",{path:"/"})
        res.redirect(process.env.FRONTENDURL);
    }catch(err){
        res.redirect(process.env.FRONTENDURL+"Signin");
    }
})


app.get("/isLoggedIn",loginMiddleWare,(req,res)=>{
    res.send(req.user.admin);
})

app.get("/logout",loginMiddleWare,async (req,res)=>{
    try{
        req.user.jwt=undefined;
        await req.user.save();
        res.clearCookie("sid",{path:"/"});
        res.redirect(process.env.FRONTENDURL);
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.post('/registerCourse',async (req,res)=>{
    const forms = new form(req.body);
    await forms.save();
    await getEmail(process.env.EMAIL_USER,"New Course Registration",`<div class="container" style="background-color: #ddd;text-align: center;max-width: 600px;margin: auto;">
    <div class="main" style="background-color: #003399;padding: 2%;color: #fff;">
        <h4 style="font-weight: 400;font-size: 2rem;">Registration</h4>
    </div>
    <div class="body" style="padding: 10%;font-weight: 400;color: rgba(0, 0, 0, 0.747);">
        <div class="name" style="font-size: 1.2rem; padding: 10px;">
            <span>Name</span> <span>:</span> <span>${req.body.salutation} ${req.body.name}</span>
        </div> 
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Email</span> <span>:</span> <span>${req.body.Email}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Mobile Number</span> <span>:</span> <span>${req.body.MobileNumber}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Whatsapp Number </span> <span>:</span> <span>${req.body.WhatsappNumber}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Class/Year/Years Of Experience </span> <span>:</span> <span>${req.body.Experience}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Institution Name </span> <span>:</span> <span>${req.body.InstitutionName}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Courses</span> <span>:</span> <span>${req.body.Courses}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Qualification </span> <span>:</span> <span>${req.body.Qualification}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>State</span> <span>:</span> <span>${req.body.State}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Have you learnt with SEA? </span> <span>:</span> <span>${req.body.learntSea}</span>
        </div><div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>How Do You Know About This Course? </span> <span>:</span> <span>${req.body.ReferralType}</span>
        </div><div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Payment Method</span> <span>:</span> <span>${req.body.paymentMethod}</span>
        </div><div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Have You Paid?</span> <span>:</span> <span>${req.body.Paid}</span>
        </div><div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Address</span> <span>:</span> <span>${req.body.address}</span>
        </div>
        <div class="name"  style="font-size: 1.2rem; padding: 10px;">
            <span>Feedback</span> <span>:</span> <span>${req.body.feedback}</span>
        </div>
    </div>
</div>`);
    res.send("Successfully registered");
})



module.exports=app;