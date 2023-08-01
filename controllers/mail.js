import nodemailer from "nodemailer";

const mainMail = async (name, email, subject, message) => {
    const transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.PASSWORD,
        },
    });
    const mailOption = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: subject,
        html: `
        <p>You got a message from</p> 
        <span> <strong>Email:</strong> ${email}</span>
        <span> <strong>Name:</strong> ${name}</span>
        <span><strong>Message: </strong> ${message}</span>`,
    };
    try {
        await transporter.sendMail(mailOption);
        return Promise.resolve("Message Sent Successfully!");
    } catch (error) {
        return Promise.reject(error);
    }
}

export const contact = async (req, res, next) => {
    const { name, email, subject, message } = req.body;
    console.log(name, email, subject, message);
    try {
        await mainMail(name, email, subject, message);
        res.status(201).send({
            success: "Message sent successfully"
        })
    } catch (error) {
        res.status(401).send({
            message: "Some error occured!!"
        })
    }
}