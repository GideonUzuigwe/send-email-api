const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//Initialize the configuration.
dotenv.config();

//Initialize all the required middlewares for your app...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Get Requests
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the Email API");
});

//Post Request
app.post("/send-mail", async (req, res) => {
  const { name, receiverEmail, senderEmail, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services like 'Yahoo', 'Outlook', etc.
    auth: {
      user: process.env.USER_EMAIL, // Your email address
      pass: process.env.USER_PASS, // Your email password or App Password
    },
  });

  const mailOptions = {
    from: senderEmail,
    to: receiverEmail, // Replace with your recipient's email
    subject: `New message from ${name}`,
    text: message,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    res.status(200).json({
      OK: true,
      sent: true,
      accepted: response.accepted,
      responseId: response.response,
      envelope: response.envelope,
      messageId: response.messageId,
    });
  } catch (err) {
    return res.status(500).send("Error sending email");
  }
});

app.listen(port, console.log("Our app is live and running..."));
