const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Express app (already connects to DB)
const api = supertest(app);
const Property = require("../models/propertyModel");

// Seed data for tests
const properties = [
  {"title": "Convenient Family Apartment",
  "type": "Apartment",
  "description": "A lovely apartment in the city center.",
  "price": 2200,
  "location": {
    "address": "Random street 123",
    "city": "Random City",
    "state": "Random State",
    "zipCode": "12345"
  },
  "squareFeet": 20,
  "yearBuilt":1990 
},
  {"title": "Cozy Country Cottage",
  "type": "Cottage",
  "description": "A quaint cottage in the countryside.",
  "price": 1800,
  "location": {
    "address": "Random street 456",
    "city": "Random City",
    "state": "Random State",
    "zipCode": "12345"
  },
  "squareFeet": 20,
  "yearBuilt":1990 
},
];

// Reset the tours collection before each test
beforeEach(async () => {
  await Property.deleteMany({});
  await Property.insertMany(properties);
});

// ---------------- GET ----------------
describe("GET /api/property", () => {
  it("should return all properties as JSON", async () => {
    const response = await api
      .get("/api/property")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(properties.length);
    expect(response.body[0].title).toBe(properties[0].title);
  });
});

describe("GET /api/property/:id", () => {
  it("should return one property by ID", async () => {
    const property = await Property.findOne();
    const response = await api
      .get(`/api/property/${property._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(property.title);
  });

  it("should return 404 for a non-existing property ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/property/${nonExistentId}`).expect(404);
  });
});

// ---------------- POST ----------------
describe("POST /api/property", () => {
  it("should create a new property", async () => {
    const newProperty = {"title": "Modern Beachside Villa",
  "type": "Villa",
  "description": "A luxurious villa by the beach.",
  "price": 3000,
  "location": {
    "address": "Random street 456",
    "city": "Random City",
    "state": "Random State",
    "zipCode": "12345"
  },
  "squareFeet": 20,
  "yearBuilt":1990 
};

    const response = await api
      .post("/api/property")
      .send(newProperty)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(newProperty.title);

    const propertiesAfterPost = await Property.find({});
    expect(propertiesAfterPost).toHaveLength(properties.length + 1);
  });
});

// ---------------- PUT ----------------
describe("PUT /api/property/:id", () => {
  it("should update a property with partial data", async () => {
    const property = await Property.findOne();
    const updatedProperty = { description: "Updated description", price: 2500 };

    const response = await api
      .put(`/api/property/${property._id}`)
      .send(updatedProperty)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.description).toBe(updatedProperty.description);
    expect(response.body.price).toBe(updatedProperty.price);

    const updatedPropertyCheck = await Property.findById(property._id);
    expect(updatedPropertyCheck.price).toBe(updatedProperty.price);
  });

  it("should return 400 for invalid property ID", async () => {
    const invalidId = "12345"; // invalid format, not a valid ObjectId
    await api.put(`/api/property/${invalidId}`).send({}).expect(400);
  });
});

// ---------------- DELETE ----------------
describe("DELETE /api/property/:id", () => {
  it("should delete a property by ID", async () => {
    const property = await Property.findOne();
    await api.delete(`/api/property/${property._id}`).expect(200);

    const deletedPropertyCheck = await Property.findById(property._id);
    expect(deletedPropertyCheck).toBeNull();
  });

  it("should return 400 for invalid property ID", async () => {
    const invalidId = "12345"; // invalid format
    await api.delete(`/api/property/${invalidId}`).expect(400);
  });
});

// Close DB connection once after all tests in this file
afterAll(async () => {
  await mongoose.connection.close();
});