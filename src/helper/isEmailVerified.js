function isEmailVerified(req,res,next){
    if(req.signedCookies&&(req.signedCookies.email||req.signedCookies.gid))return next();
    res.status(400).send("email not verified");
}

module.exports=isEmailVerified;