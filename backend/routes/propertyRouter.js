const express = require("express");
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();


router.get("/", getAllProperties);
router.get("/:propertyId", getPropertyById);

router.post("/", requireAuth, createProperty);
router.put("/:propertyId", requireAuth, updateProperty);
router.delete("/:propertyId", requireAuth, deleteProperty);

module.exports = router;
