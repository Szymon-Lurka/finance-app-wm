import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const nodemailerSetup = () => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Update with your email service provider
        auth: {
            user: process.env.NODEMAILER_AUTH_USER,
            pass: process.env.NODEMAILER_AUTH_PASS
        },
    });
    return transporter;
};

const getResetPasswordTemplate = () => {
    return fs.readFileSync(path.join(__dirname, 'views', 'reset-password.handlebars'), 'utf-8');
}

export {
    nodemailerSetup,
    getResetPasswordTemplate
}
