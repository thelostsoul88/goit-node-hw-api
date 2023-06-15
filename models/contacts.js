const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
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
  __v: {
    type: Number,
    select: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
