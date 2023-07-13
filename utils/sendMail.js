const sgMail = require("@sendgrid/mail");
const wrapper = require("./wrapper");

const { BASE_URL, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (email, verificationToken) => {
  const msg = {
    from: "demon.com54@gmail.com",
    to: email,
    subject: "Verify your email, please",
    text: "To starting working with our phonebook base please verify your email and sign in",
    html: `<a style="font-size:20px" target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify your email</a>`,
  };

  await sgMail.send(msg);

  return true;
};

module.exports = wrapper(sendMail);
