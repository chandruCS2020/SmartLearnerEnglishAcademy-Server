const nodemailer=require("nodemailer");

async function sendEmail(to,subject,body){
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
        from: process.env.EMAIL, 
        to, 
        subject,
        html: body
      })
      .catch((err)=>{
          console.log(err.message);
      })
}



module.exports=sendEmail