const express=require("express"),
    app=express.Router(),
    Contact=require("../db/contact"),
    sendEmail=require("../helper/email")


app.post("/Contact",async (req,res)=>{
    try{
        let contact=new Contact(req.body);
        await contact.save();
        await sendEmail("chandru6501@gmail.com","Contact",JSON.stringify(contact));
        res.send("Our Emplyoee will Contact you in 4-5 business days")
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=app;