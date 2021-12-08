const mongoose=require("mongoose");

mongoose.connect(process.env.DBURL)
.then((data)=>{
    console.log("db conntected!");
})
.catch((err)=>{
    console.error(err.message)
})