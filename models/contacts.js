const { Schema, model } = require("mongoose");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: [true, "Duplicated email.."],
      required: true,
    },
    phone: {
      type: String,
      unique: [true, "Duplicated phone.."],
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

const Contact = model("contact", contactSchema);

module.exports = Contact;
