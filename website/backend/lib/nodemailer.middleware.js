import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class Mailer {
    constructor() {
        this.user = process.env.SENDERMAIL;
        this.pass = process.env.MAILPASS;
        this.from = process.env.MAILFROM;
        this.transporter = null;
    }

    async setUp() {
        // Validate environment variables
        if (!this.user || !this.pass || !this.from) {
            console.error("Missing environment variables:", { user: this.user, pass: this.pass, from: this.from }); // Debugging
            throw new Error("Missing required environment variables for email setup.");
        }

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.user,
                    pass: this.pass
                }
            });
            this.transporter = transporter;
            if (!transporter) {
                throw new Error("Failed to create transporter");
            }
            console.log("Transporter created successfully"); // Debugging
        } catch (error) {
            console.error("Error setting up transporter:", error.message); // Debugging
            throw error; // Re-throw the error to stop execution
        }
    }

    async sentMail(to, subject, text) {
        console.log("Sending mail to:", to); // Debugging
        console.log("Using sender:", this.user); // Debugging

        // Validate email before sending
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            console.error("Invalid email address:", to); // Debugging
            return { error: "Invalid email address!" };
        }

        await this.setUp(); // Initialize the transporter

        try {
            const info = await this.transporter.sendMail({
                from: this.from,
                to: to,
                subject: subject,
                text: text
            });

            console.log("Email sent successfully:", info); // Debugging
            return info;
        } catch (error) {
            console.error("Error sending email:", error.message); // Debugging
            return { error: "Failed to send email" };
        }
    }
}

export default Mailer;