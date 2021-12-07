const nodemailer=require("nodemailer");

async function sendEmail(to,subject,link){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
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
        html: `<a href=${link} target='_blank'>click here</a>`,
      })
      .catch((err)=>{
          console.log(err.message);
      })
}

module.exports=sendEmail