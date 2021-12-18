const mongoose=require("mongoose"),
    User=require("../db/user");

async function adminPatch(){
    try{
        await mongoose.connect(process.env.DBURL);
        let admin=new User({
            firstName:"admin",
            lastName:"sea",
            email:"curatedsolution@gmail.com",
            password:"curatedsolutions",
            admin:"true"
        })
        await admin.save();
        console.log("admin created")
    }catch(err){
        console.log(err.message)
    }
}

adminPatch();