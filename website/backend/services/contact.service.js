import Mailer from "../lib/nodemailer.middleware.js";
import CustomError from "../components/customError.component.js";

class Contact {
    async setMailMessage(req, res, next) {
        try {
            const { senderName, email, messageType, message } = req.body; // add message type in the body later
            console.log("SenderName: ", senderName); // debugging

            if (!senderName || typeof senderName !== 'string') throw new CustomError("Your name is required!", 400);
            if (!email || typeof email !== 'string') throw new CustomError("Email is required!", 400);
            if(!messageType || typeof messageType !== 'string') throw new CustomError("Message type is required!", 400);
            if (!message || typeof message !== 'string') throw new CustomError("Message is required!", 400);

            // after the input fields are validated, sent email to the destination email(email)
            const mailBody = {
                to: process.env.SENDERMAIL, // receiver email
                from: email, // sender email
                subject: messageType, // let the user choose between (feedback, connect);
                text: `Hi, I'm ${senderName}. \n\n${message} \n\n From: ${email}`
            }
            const mailer = new Mailer();
            await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text); // incoming mail

            await mailer.sentMail(email, `Thanks for contacting us, ${senderName}.`, `We've received your "${messageType}" message and we, the FUTURE will contact you soon!`); // response mail

            return res.status(200).json({ message: `Mail sent successfully!` });
        } catch (error) {
            next(error);
        }
    }
}

const contact = new Contact();
export default contact;