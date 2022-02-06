const nodemailer=require("nodemailer");

async function getEmail(to,subject,body){
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, 
        },
    });
    
    transporter.sendMail({
        to:process.env.EMAIL, 
        subject,
        html: body
    })
    .catch((err)=>{
        console.log(err.message);
    })
}



module.exports=getEmail