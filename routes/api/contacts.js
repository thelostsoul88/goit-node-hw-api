const express = require("express");
const {
  getAll,
  getById,
  removeById,
  add,
  updateById,
  updateStatusContact,
} = require("../../controllers/contactsController");
const {
  validate,
  validateFavorite,
  validateId,
} = require("../../middlewares/validate");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", validateId, getById);

router.delete("/:contactId", validateId, removeById);

router.post("/", validate, add);

router.put("/:contactId", validateId, validate, updateById);

router.patch(
  "/:contactId/favorite",
  validateId,
  validateFavorite,
  updateStatusContact
);

module.exports = router;
