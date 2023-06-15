const express = require("express");
const validate = require("../../utils/validate");
const {
  getAll,
  getById,
  removeById,
  add,
  updateById,
  updateStatusContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.delete("/:contactId", removeById);

router.post("/", validate(), add);

router.put("/:contactId", validate(), updateById);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
