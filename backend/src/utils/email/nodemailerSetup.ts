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
    return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>

<h1>Cześć {{ name }},</h1>
<br>
<p>Nie pamiętasz hasła?</p>
<p>Otrzymaliśmy prośbę o zresetowanie hasła dla Twojego konta.</p>
<br>
<p>Aby zresetować hasło, kliknij w przycisk poniżej: </p>
<a href="{{ link }}">Kliknij tu by zresetować hasło</a>
    <p>i wklej ten adres URL w Twoją przeglądarkę:</p>
    <p>{{link}}</p>

</body>
    `;
}

export {
    nodemailerSetup,
    getResetPasswordTemplate
}
