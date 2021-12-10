const mongoose=require("mongoose"),
    User=require("../db/user"),
    jwt=require("jsonwebtoken");

async function loginMiddleWare(req,res,next){
    try{
        const token=req.cookies.sid;
        // console.log(token)
        if(!token)throw new Error();
        let payload=jwt.verify(token,process.env.JWTSECRET)
        let user=await User.findById(payload.id);
        if(!user)throw new Error();
        if(user.jwt!=token)throw new Error();
        req.user=user;
        next();
    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports=loginMiddleWare;