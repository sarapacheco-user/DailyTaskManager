const nodemailer = require("nodemailer");

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9397dd46b44a14",  // Your Mailtrap username
    pass: "********0167"     // Your Mailtrap password
  }
});

// Send test email
async function sendEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Your App" <noreply@yourapp.com>',  // Sender
      to: "recipient@example.com",               // Recipient
      subject: "Hello from Mailtrap",
      text: "This is a test email sent using Mailtrap.",
      html: "<b>This is a test email sent using Mailtrap.</b>"
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Run email function
sendEmail();
