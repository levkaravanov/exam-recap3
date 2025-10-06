const Property = require("../models/PropertyModel");
const mongoose = require("mongoose");

//GET / Properties;
const getAllProperties = async (req, res) => {
  try { 
    const Properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(Properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Properties" });
  }
};

// POST /Properties
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create({ ...req.body });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: "Failed to create Property", error: error.message });
  }
};

// GET /Properties/:propertyId
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid Property ID" });
  }

  try {
    const property = await Property.findById(propertyId);
    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Property" });
  }
};

// PUT /Properties/:PropertyId
const updateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }
    const updatedProperty = await Property.findOneAndUpdate(
      { _id: propertyId },
      { ...req.body },
      { new: true }
    );
    if (updatedProperty) {
      res.status(200).json(updatedProperty);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to update Property", error: error.message });
  }
};

// DELETE /Properties/:propertyId
const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }
    const deletedProperty = await Property.findOneAndDelete({ _id: propertyId });
    if (deletedProperty) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to delete Property", error: error.message });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
