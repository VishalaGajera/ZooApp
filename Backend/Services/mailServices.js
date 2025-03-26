const nodemailer = require("nodemailer");

const EMAIL_ID = process.env.EMAIL_ID;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ID,
        pass: process.env.EMAIL_PASSKEY
    }
});

const COMPANY_NAME = process.env.COMPANY_NAME;

const sendMail = async (to, subject, content) => {
    try {
        const MailOption = {
            from: EMAIL_ID,
            to: to,
            subject: subject,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                background-color: #f4f4f4;
                            }
                            .container {
                                background-color: #ffffff;
                                padding: 10px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                font-size: 24px;
                                color: #4CAF50;
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.5;
                                margin-bottom: 20px;
                            }
                            .otp {
                                font-size: 20px;
                                font-weight: bold;
                                color: #4CAF50;
                                background-color: #f1f1f1;
                                padding: 10px;
                                border-radius: 4px;
                                text-align: center;
                                margin: 10px 0;
                            }
                            .footer {
                                text-align: center;
                                font-size: 14px;
                                color: #888;
                                margin-top: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 20px 0;
                            }
                            table, th, td {
                                border: 1px solid #ddd;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f4f4f4;
                            }
                            .button {
                                font-size: 16px;
                                font-weight: bold;
                                color: #4CAF50;
                                background-color: #f1f1f1;
                                padding: 5px 13px;
                                border-radius: 4px;
                                text-align: center;
                                margin: 10px 0;
                                white-space: nowrap;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            ${content}
                            <p class="footer">
                                Best regards,<br>
                                The ${COMPANY_NAME} Team
                            </p>
                        </div>
                    </body>
                </html>
            `
        };
        const info = await transporter.sendMail(MailOption);
        if (info.response.includes('250 2.0.0 OK')) {
            return { success: true, message: 'Mail sent successfully' };
        } else {
            return { success: false, message: 'Error to send mail' };
        }
    } catch (error) {
        return { success: false, message: 'Error to send mail' };
    }
}

module.exports = { sendMail }