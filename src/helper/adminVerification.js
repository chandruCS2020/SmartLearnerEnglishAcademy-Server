const mongoose=require("mongoose"),
    User=require("../db/user"),
    jwt=require("jsonwebtoken");

async function adminveriifaction(req,res,next){
    try{
        if(!req.cookies||!req.cookies.sid)throw new Error();
        const token=req.cookies.sid;
        // console.log(token)
        
        let payload=jwt.verify(token,process.env.JWTSECRET)
        let user=await User.findById(payload.id);
        if(!user)throw new Error();
        if(user.jwt!=token)throw new Error();
        if(!user.admin)throw new Error();
        return next();
    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports=adminveriifaction