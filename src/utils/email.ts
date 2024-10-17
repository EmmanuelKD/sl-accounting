import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";

async function sendMail(htmlContent: string, email: string, subject: string) {
  // Create nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Your Gmail email
      pass: process.env.EMAIL_PASSWORD, // Your Gmail password
    },
  });

  // Email options
  let mailOptions = {
    from: process.env.EMAIL, // Your Gmail email
    to: email, // User's email
    subject,
    html: htmlContent, // HTML content with OTP and user email
  };

  // Send email synchronously
  await transporter.sendMail(mailOptions);
}

async function sendOTPEmail(otp: string, email: string) {
  // Path to the HTML file
  const htmlFilePath = path.join(
    process.cwd(),
    "src/email-templates",
    "otp.html"
  );

  // Read HTML file content
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  // Replace the placeholder with the OTP and user email
  htmlContent = htmlContent.replace(/<h1>[\s\d]*<\/h1>/g, `<h1>${otp}</h1>`);
  htmlContent = htmlContent.replace(/usingyourmail@gmail\.com/g, email);

  await sendMail(htmlContent, email, "Verify your email");
}

// async function sendResetPasswordEmail(
// resetPasswordLink: string,
// email: String
// ) {
async function sendResetPasswordEmail(
  resetPasswordLink: string,
  email: string
) {
  // Path to the HTML file
  const htmlFilePath = path.join(
    process.cwd(),
    "src/email-templates",
    "forget.html"
  );

  // Read HTML file content
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  // Replace the href attribute of the <a> tag with the reset password link
  // htmlContent = htmlContent.replace(
  //   /href="javascript:void\(0\);"/g,
  //   `href="${resetPasswordLink}"`
  // )
  htmlContent = htmlContent.replace(
    /href="javascript:void\(0\);"/g,
    `href="${resetPasswordLink}"`
  );
  await sendMail(htmlContent, email, "Kindly Reset your password");
}

async function sendBusinessRegistrationEmail(
  businessName: string,
  email: string
) {
  // Path to the HTML file
  const htmlFilePath = path.join(
    process.cwd(),
    "src/email-templates",
    "business-registration.html"
  );

  // Read HTML file content
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  // Replace the placeholder with the OTP and user email
  htmlContent = htmlContent.replace(
    /<h1>[\s\d]*<\/h1>/g,
    `<h1>${businessName}</h1>`
  );
  htmlContent = htmlContent.replace(/usingyourmail@gmail\.com/g, email);

  await sendMail(htmlContent, email, "Business Registered successfully");
}

async function sendFarmRegistrationEmail(farmName: string, email: string) {
  // Path to the HTML file
  const htmlFilePath = path.join(
    process.cwd(),
    "src/email-templates",
    "business-registration.html"
  );

  // Read HTML file content
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  // Replace the placeholder with the OTP and user email
  htmlContent = htmlContent.replace(
    /<h1>[\s\d]*<\/h1>/g,
    `<h1>${farmName}</h1>`
  );
  htmlContent = htmlContent.replace(/usingyourmail@gmail\.com/g, email);

  await sendMail(htmlContent, email, "Farm Registered successfully");
}


async function sendStorageFacilityRegistrationEmail(facilityName: string, email: string) {
  // Path to the HTML file
  const htmlFilePath = path.join(
    process.cwd(),
    "src/email-templates",
    "business-registration.html"
  );

  // Read HTML file content
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  // Replace the placeholder with the OTP and user email
  htmlContent = htmlContent.replace(
    /<h1>[\s\d]*<\/h1>/g,
    `<h1>${facilityName}</h1>`
  );
  htmlContent = htmlContent.replace(/usingyourmail@gmail\.com/g, email);

  await sendMail(htmlContent, email, "Farm Registered successfully");
}

async function sendSeedStockCertificationEmail(facilityName: string, email: string, status:string) {
  // Path to the HTML file
  const htmlFilePath = path.join(
    process.cwd(),
    "src/email-templates",
    "seed-stock-ceritifcation-mail.html"
  );

  // Read HTML file content
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  // Replace the placeholder with the OTP and user email
  htmlContent = htmlContent.replace(
    /<h1>[\s\d]*<\/h1>/g,
    `<h1>${facilityName}</h1>`
  );
  htmlContent = htmlContent.replace(/usingyourmail@gmail\.com/g, email);

  await sendMail(htmlContent, email, "Farm Registered successfully");
}


export {
  sendOTPEmail,
  sendResetPasswordEmail,
  sendSeedStockCertificationEmail,
  sendBusinessRegistrationEmail,
  sendFarmRegistrationEmail,
  sendStorageFacilityRegistrationEmail,
};
