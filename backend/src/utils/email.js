import nodemailer from "nodemailer";

export const sendShareEmail = async ({
  to,
  reportType,
  sharedBy,
  expiresAt,
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Digital Health Wallet" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Medical Report Shared With You",
    html: `
      <h3>A medical report has been shared with you</h3>
      <p><strong>Report:</strong> ${reportType}</p>
      <p><strong>Shared by:</strong> ${sharedBy}</p>
      ${
        expiresAt
          ? `<p><strong>Access valid till:</strong> ${expiresAt}</p>`
          : `<p><strong>Access:</strong> No expiry</p>`
      }
      <p>Please login to Digital Health Wallet to view the report.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
