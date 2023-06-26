const wrapper = require("../utils/wrapper");
const errHttp = require("../utils/errHttp");
const Contact = require("../models/contacts");

/** Add */

const add = async (req, res) => {
  const { _id: owner } = req.user;

  const newContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(newContact);
};

/** Get */

const getAll = async (req, res) => {
  const { page = 1, limit = 10, favorite = "" } = req.query;

  const findOptions = {
    owner: req.user._id,
  };

  if (favorite) {
    findOptions.favorite = favorite;
  }

  const skip = (page - 1) * limit;

  const contacts = await Contact.find(findOptions, "", {
    skip,
    limit,
  });

  res.json(contacts);
};

/** GetByID */

const getById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw errHttp(404, "Not found");
  }

  res.json(contact);
};

/** RemoveByID */

const removeById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    throw errHttp(404, "Not found");
  }

  res.json({ message: "Contact deleted" });
};

/** UpdateByID */

const updateById = async (req, res) => {
  const { contactId } = req.params;

  const updateContact = await Contact.findByIdAndUpdate(
    contactId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  if (!updateContact) {
    throw errHttp(404, "Not found");
  }

  res.json(updateContact);
};

/** UpdateFavorite */

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  const updateFavorite = await Contact.findByIdAndUpdate(
    contactId,
    { favorite: req.body.favorite },
    { new: true }
  );

  if (!updateFavorite) {
    throw errHttp(404, "Not found");
  }

  res.json(updateFavorite);
};

module.exports = {
  add: wrapper(add),
  getAll: wrapper(getAll),
  getById: wrapper(getById),
  removeById: wrapper(removeById),
  updateById: wrapper(updateById),
  updateStatusContact: wrapper(updateStatusContact),
};
