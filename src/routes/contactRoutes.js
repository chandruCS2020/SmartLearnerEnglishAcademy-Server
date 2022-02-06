const express=require("express"),
    app=express.Router(),
    Contact=require("../db/contact"),
    getEmail=require("../helper/getEmail");


app.post("/Contact",async (req,res)=>{
    try{
        let contact=new Contact(req.body);
        await contact.save();
        await getEmail(req.email,req.subject,JSON.stringify(contact));
        res.send("Our Emplyoee will Contact you in 4-5 business days")
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=app;