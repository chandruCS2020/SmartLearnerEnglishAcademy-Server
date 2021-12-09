const mongoose=require("mongoose");

const feedbackSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:5
    }
})

const FeedBack=mongoose.model("feedback",feedbackSchema);

module.exports=FeedBack;