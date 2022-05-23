const express=require("express"),
    app=express.Router(),
    Contact=require("../db/contact"),
    getEmail=require("../helper/getEmail");


app.post("/Contact",async (req,res)=>{
    try{
        let contact=new Contact(req.body);
        await contact.save();
        await getEmail(process.env.EMAIL_USER,"Contact",`<div class="container" style="background-color: #ddd;text-align: center;max-width: 600px;margin: auto;">
        <div class="main" style="background-color: #003399;padding: 2%;color: #fff;">
            <h4 style="font-weight: 400;font-size: 2rem;">Contact</h4>
        </div>
        <div class="body" style="padding: 10%;font-weight: 400;color: rgba(0, 0, 0, 0.747);">
            <div class="name" style="font-size: 1.2rem; padding: 10px;">
                <span>Name</span> <span>:</span> <span>${req.body.name}</span>
            </div>
            <div class="name"  style="font-size: 1.2rem; padding: 10px;">
                <span>Mobile Number</span> <span>:</span> <span>${req.body.mobile}</span>
            </div>
            <div class="name"  style="font-size: 1.2rem; padding: 10px;">
                <span>Email</span> <span>:</span> <span>${req.body.email}</span>
            </div>
            <div class="name"  style="font-size: 1.2rem; padding: 10px;">
                <span>Message</span> <span>:</span> <span>${req.body.message}</span>
            </div>
        </div>
    </div>`);
        res.send("Our Emplyoee will Contact you in 4-5 business days")
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports=app;