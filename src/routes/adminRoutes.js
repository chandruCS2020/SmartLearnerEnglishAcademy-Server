const express=require("express"),
    app=express.Router(),
    adminveriifaction=require("../helper/adminVerification"),
    Contact=require("../db/contact"),
    User=require("../db/user"),
    Feedback=require("../db/feedback"),
    form = require('../db/form');


// app.use(adminveriifaction)



app.get("/get-users",adminveriifaction,async (req,res)=>{
    try{
        let users=await User.find({}).sort({createdAt:-1}).limit(15);
        res.send(users);
    }catch(err){
        res.status(400).send(err.message);
    }
    
})

app.get("/get-contact",adminveriifaction,async (req,res)=>{
    try{
        let contact=await Contact.find({}).sort({createdAt:-1}).limit(15);
        res.send(contact);
    }catch(err){
        res.status(400).send(err.message);
    }
})

app.get("/get-feedback",adminveriifaction,async (req,res)=>{
    try{
        let feedback=await Feedback.find({}).sort({rating:-1,createdAt:-1}).limit(15);
        res.send(feedback);
    }catch(err){
        res.status(400).send(err.message);
    }
})

app.get("/count",adminveriifaction,async (req,res)=>{
    try{
        let user=await User.find({});
        let contact=await Contact.find({});
        let feedback=await Feedback.find({});
        res.send([
            {id:1,name:"Users",count:user.length,icon:'PersonIcon'},
            {id:2,name:"Contact",count:contact.length,icon:'ContactsIcon'},
            {id:3,name:"Feedback",count:feedback.length,icon:'FeedbackIcon'}
        ])
    }catch(err){
        res.status(400).send(err.message)
    }
})
app.get("/get-forms",adminveriifaction,async (req,res)=>{
    try{
        let forms=await form.find({}).sort({createdAt:-1});
        res.send(forms);
    }catch(err){
        res.status(400).send(err.message);
    }
    
})


module.exports=app;