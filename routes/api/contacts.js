const express = require("express");
const {
  validate,
  favoriteValidate,
  validateId,
} = require("../../utils/validate");
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

router.get("/:contactId", validateId, getById);

router.delete("/:contactId", validateId, removeById);

router.post("/", validate, add);

router.put("/:contactId", validateId, validate, updateById);

router.patch(
  "/:contactId/favorite",
  validateId,
  favoriteValidate,
  updateStatusContact
);

module.exports = router;
