require("dotenv").config();

let sendRaw;

// Validate critical env vars
if (!process.env.SENDGRID_API_KEY && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
  console.warn(
    "Warning: No email provider fully configured. Emails may fail to send. " +
    "Set SENDGRID_API_KEY for SendGrid or EMAIL_USER/EMAIL_PASS for SMTP."
  );
}

const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@paisable.com";

// Use SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sendRaw = async ({ to, from, subject, text, html }) => {
    try {
      const msg = {
        to,
        from: from || emailFrom,
        subject,
        text,
        html,
      };
      return await sgMail.send(msg);
    } catch (err) {
      console.error("SendGrid email failed", { to, subject, message: err.message });
    }
  };
} else {
  // Fallback to SMTP via Nodemailer
  const nodemailer = require("nodemailer");

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  transport.verify()
    .then(() => console.info("SMTP transporter verified"))
    .catch(err => console.warn("SMTP transporter verification failed", { message: err.message }));

  sendRaw = async ({ to, from, subject, text, html }) => {
    try {
      const mailOptions = {
        from: from || emailFrom,
        to,
        subject,
        text,
        html,
      };
      return await transport.sendMail(mailOptions);
    } catch (err) {
      console.error("SMTP email failed", { to, subject, message: err.message });
    }
  };
}

// Inline welcome email template
function renderWelcomeTemplate(name = "") {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4; color:#333;">
      <h2>Welcome to Paisable${name ? ", " + name : ""}!</h2>
      <p>Thank you for creating an account. We're excited to have you on board.</p>
      <p>Here are a few things to get started:</p>
      <ul>
        <li>Log in and complete your profile</li>
        <li>Explore transactions and receipts</li>
        <li>Contact support if you need help</li>
      </ul>
      <p>Cheers,<br/>The Paisable Team</p>
    </div>
  `;

  const text = `Hi ${name}\n\nWelcome to Paisable! Your account has been created.\n\n- Log in and complete your profile\n- Explore transactions and receipts\n- Contact support if you need help\n\nCheers,\nThe Paisable Team`;

  return { html, text };
}

// Fire-and-forget welcome email
async function sendWelcomeEmail(to, name = "") {
  if (!to) return;
  const { html, text } = renderWelcomeTemplate(name);
  const subject = "Welcome to Paisable!";
  try {
    await sendRaw({ to, subject, text, html });
    console.info("Welcome email sent", { to });
  } catch (err) {
    console.error("Failed to send welcome email", { to, message: err.message });
  }
}

module.exports = {
  sendWelcomeEmail,
  sendRaw,
};
