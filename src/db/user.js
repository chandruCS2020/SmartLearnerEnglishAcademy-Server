const mongoose=require("mongoose"),
    bcryptjs=require("bcryptjs"),
    jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxlength:[15,"max limit char reached"]
    },
    lastName:{
        type:String,
        required:true,
        maxlength:[15,"max limit char reached"]
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    googleLinked:{
        type:String,
        sparse:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    jwt:{
        type:String
    }
})

userSchema.pre("save",async function(){
    if(this.isModified("password")){
        this.password=await bcryptjs.hash(this.password,8);
    }
    
})

const User=mongoose.model("User",userSchema);

User.prototype.createAuthJwt=function(){
    this.jwt=jwt.sign({id:this._id},process.env.JWTSECRET,{expiresIn:60*60*24*3})
}


User.prototype.authenticate=async function(password){
    let res=await bcryptjs.compare(password,this.password);
    if(!res)throw new Error("invalid credentials")
    this.createAuthJwt()
}


module.exports=User;
