const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { SendMailClient } = require("zeptomail");

const app = express();
app.use(bodyParser.json());

const client = new SendMailClient({
  url: "https://api.zeptomail.com/",
  token: process.env.NUXT_PUBLIC_ZEPTOMAIL_API_KEY
});

app.post("/contact-us", async (req, res) => {
  console.log("Contact us form submitted");

  try {
    const { name, email, phone, address, help } = req.body;

    const response = await client.sendMail({
      from: {
        address: "no-reply@api.jacobelectricgroup.com",
        name: "Zepto Mailer"
      },
      to: [
        {
          email_address: {
            address: "t0n9hua@gmail.com",
            name: "Numan Hussain"
          }
        }
      ],
      subject: "Hi Numan Hussain",
      textbody: `${name}`,
      htmlbody: `
      <p><strong>Full Name:</strong> ${name} </p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Help Request:</strong> ${help}</p>
      `
    });

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while sending the email.");
  }
});

app.post("/consultation", async (req, res) => {
  console.log("Consultation request submitted");

  // Handle the consultation request

  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      city,
      postal_code,
      help,
      contact_method,
      hear_about_us
    } = req.body;

    const response = await client.sendMail({
      from: {
        address: "no-reply@api.jacobelectricgroup.com",
        name: "Zepto Mailer"
      },
      to: [
        {
          email_address: {
            address: "t0n9hua@gmail.com",
            name: "Numan Hussain"
          }
        }
      ],
      subject: "Hi Numan Hussain",
      textbody: `From ${first_name + " " + last_name}`,
      htmlbody: `
      <p><strong>Full Name:</strong> ${first_name + " " + last_name} </p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Postal Code:</strong> ${postal_code}</p>
      <p><strong>Help Request:</strong> ${help}</p>
      <p><strong>Contact Method:</strong> ${contact_method}</p>
      <p><strong>Hear About Us:</strong> ${hear_about_us}</p>
      `
    });

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while sending the email.");
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API endpoint to handle form submission
app.post("/career", upload.array("cv"), async (req, res) => {
  const { first_name, last_name, email, phone, city, postal_code } = req.body;
  const files = req.files;

  const attachments = await Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        fs.readFile(file.path, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              content: data.toString("base64"),
              filename: file.filename,
              name: file.originalname,
              encoding: "base64",
              mime_type:
                (file.headers && file.headers["content-type"]) ||
                "application/octet-stream",
              disposition: "attachment"
            });
          }
        });
      });
    })
  );

  try {
    const response = await client.sendMail({
      from: {
        address: "no-reply@api.jacobelectricgroup.com",
        name: "Zepto Mailer"
      },
      to: [
        {
          email_address: {
            address: "t0n9hua@gmail.com",
            name: "Numan Hussain"
          }
        }
      ],
      subject: "Hi Numan Hussain",
      textbody: `${first_name + " " + last_name}`,
      htmlbody: `
      <p><strong>Full Name:</strong> ${first_name + " " + last_name} </p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Postal Code:</strong> ${postal_code}</p>
      `,
      attachments: attachments
    });

    // Remove the files after processing
    files.forEach(file => {
      fs.unlink(file.path, err => {
        if (err) {
          console.error(`Failed to delete file: ${file.path}`, err);
        }
      });
    });

    res.end(JSON.stringify({ message: "Email sent successfully", response }));
  } catch (error) {
    res.end(JSON.stringify({ message: "Failed to send email", error }));
  }
});

app.post(
  "/promotion",
  upload.fields([
    { name: "quotations", maxCount: 10 },
    { name: "photography", maxCount: 10 }
  ]),
  async (req, res) => {
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postal_code,
      price_from,
      price_to
    } = req.body;

    const files = [...req.files.quotations, ...req.files.photography];

    const attachments = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          fs.readFile(file.path, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                content: data.toString("base64"),
                filename: file.filename,
                name: file.originalname,
                encoding: "base64",
                mime_type:
                  (file.headers && file.headers["content-type"]) ||
                  "application/octet-stream",
                disposition: "attachment"
              });
            }
          });
        });
      })
    );

    try {
      const response = await client.sendMail({
        from: {
          address: "no-reply@api.jacobelectricgroup.com",
          name: "Zepto Mailer"
        },
        to: [
          {
            email_address: {
              address: "t0n9hua@gmail.com",
              name: "Numan Hussain"
            }
          }
        ],
        subject: "Hi Numan Hussain",
        textbody: `From ${first_name + " " + last_name}`,
        htmlbody: `
      <p><strong>Full Name:</strong> ${first_name + " " + last_name} </p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Postal Code:</strong> ${postal_code}</p>
      <p><strong>Price from:</strong> ${price_from}</p>
      <p><strong>Price to:</strong> ${price_to}</p>
      `,
        attachments: attachments
      });

      // Remove the files after processing
      files.forEach(file => {
        fs.unlink(file.path, err => {
          console.log("File deleted >>>", file.path);
          if (err) {
            console.error(`Failed to delete file: ${file.path}`, err);
          }
        });
      });

      res.end(JSON.stringify({ message: "Email sent successfully", response }));
    } catch (error) {
      res.end(JSON.stringify({ message: "Failed to send email", error }));
    }
  }
);

module.exports = {
  path: "/api",
  handler: app
};
