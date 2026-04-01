import nodemailer from "nodemailer"
import { configDotenv } from "dotenv"
configDotenv();

const transporter =()=>{
       if(!process.env.SMTP_Host || !process.env.SMTP_FROM || !process.env.SMTP_PASS){
        return null
       }
       return nodemailer.createTransport({
        host:process.env.SMTP_Host,
        port :parseInt(process.env.SMTP_PORT || '587'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000, // 10s timeout so it fails fast instead of hanging
        greetingTimeout: 10000,
        socketTimeout: 10000,

    })
}

const emailTemplates= {
    'Verification' :(firstName,otp)=>({
    subject: 'Welcome to ProjectX! Verify Your Email',
    html :`<div class="container" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);>
       <h1 style="font:'font-bold' ">
        ${firstName}, Welcome
       </h1>

       <h3>
         Please Verify the email via submitting One time Password(OTP)
       </h3
       <h1>
        ${otp}
        </h1>
    </div>`

    })
}

const sendMail = async (to,template,data={})=>{
    
    try {   
        
    if (!emailTemplates[template]) {
      console.error(`Email template '${template}' not found. Available templates:`, Object.keys(emailTemplates));
      throw new Error(`Email template '${template}' not found`);
    }
    
    let emailContent;

    console.log("email templates",emailTemplates[template])
    
    if(template === "Verification"){
        emailContent = emailTemplates[template](data.firstName ,data.otp)
    }

    const transport=transporter()
    
    const mailConfig={
        from : process.env.SMTP_FROM,
        to,
        subject: emailContent.subject,
        html: emailContent.html, 
        text: emailContent.html.replace(/<[^>]*>/g, ''),
    }
    const result = await transport.sendMail(mailConfig);
    console.log("result ",result);
    return result
     } catch (error) {
        console.log("error1 ",error);
    }

}


export const verifyEmail= async(email,firstName,otp)=> {
     return sendMail(email,'Verification',{firstName,otp})
}
 



