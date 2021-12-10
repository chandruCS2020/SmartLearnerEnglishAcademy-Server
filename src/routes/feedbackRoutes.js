const express=require("express"),
    app=express.Router(),
    Feedback=require("../db/feedback");


app.post("/Feedback",async (req,res)=>{
    try{
        let feedback=new Feedback(req.body);
        await feedback.save();
        res.send("thanks for your feedback");
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=app;