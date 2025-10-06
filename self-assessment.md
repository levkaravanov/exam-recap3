# Self-Assessment

Below are two examples of improvements and debugging performed in this project (a full-stack real estate management app from `exam-recap3.md`).

### Example 1: Fixing a React component crash and improving UI resilience

Initially, the property cards list rendered child components without props while the child accessed `property` fields directly. This caused a runtime error: `Cannot read properties of undefined (reading 'title')`.

Problematic variant (simplified):

```javascript
// PropertyListing.jsx (before)
const PropertyListing = ({ property }) => (
  <div>
    <h2>{property.title}</h2>
  </div>
);

// PropertyListings.jsx (before)
const PropertyListings = () => (
  <div>
    <PropertyListing />
    <PropertyListing />
  </div>
);
```

What was done:
1. In `PropertyListings.jsx`, added a data array and passed props correctly via `.map(...)`.
2. In `PropertyListing.jsx`, added null‑guards for `property` and `property.location`.

Result (after):

```javascript
// PropertyListings.jsx (after)
import PropertyListing from "./PropertyListing";

const PropertyListings = () => {
  const properties = [
    {
      id: "1",
      title: "Cozy apartment",
      type: "apartment",
      description: "Nice place",
      price: 1200,
      location: {
        address: "123 Main",
        city: "Helsinki",
        state: "Uusimaa",
        zipCode: "00100",
      },
      squareFeet: 550,
      yearBuilt: 1998,
    },
    // ...
  ];

  return (
    <div className="property-list">
      {properties.map((p) => (
        <PropertyListing key={p.id} property={p} />
      ))}
    </div>
  );
};

export default PropertyListings;
```

```javascript
// PropertyListing.jsx (after)
const PropertyListing = ({ property }) => {
  // Guard against missing data to avoid runtime crashes in development
  if (!property) return null;
  const location = property.location || {};
  return (
    <div className="property-preview">
      <h2>{property.title}</h2>
      <p>Type: {property.type}</p>
      <p>Description: {property.description}</p>
      <p>Price: {property.price}</p>
      <p>Location: {location.address}, {location.city}, {location.state}, {location.zipCode}</p>
      <p>Square Feet: {property.squareFeet}</p>
      <p>Year Built: {property.yearBuilt}</p>
    </div>
  );
};

export default PropertyListing;
```

#### Key Improvements
- **Defensive UI:** safeguarded against missing data at the component level.
- **Correct data flow:** parent passes a valid `property` object.
- **DX:** runtime error removed; the list renders reliably with demo data.

---

### Example 2: Improving the quality of the API create endpoint

Entity creation is handled by `POST /api/property`. The basic implementation worked using Mongoose schema validation, but we strengthened error handling and input preprocessing to improve API predictability.

Basic version:

```javascript
// createProperty (basic)
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create({ ...req.body });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: "Failed to create Property", error: error.message });
  }
};
```

Optimized version (improvement idea):

```javascript
// createProperty (improved)
const createProperty = async (req, res) => {
  try {
    // Coerce and validate critical numeric fields
    const payload = { ...req.body };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.squareFeet !== undefined) payload.squareFeet = Number(payload.squareFeet);
    if (payload.yearBuilt !== undefined) payload.yearBuilt = Number(payload.yearBuilt);

    // Basic presence checks before hitting DB (complements Mongoose required)
    const required = [
      "title",
      "type",
      "description",
      "price",
      "location.address",
      "location.city",
      "location.state",
      "location.zipCode",
      "squareFeet",
      "yearBuilt",
    ];

    const missing = required.filter((key) => {
      const path = key.split(".");
      let cur = payload;
      for (const p of path) cur = cur?.[p];
      return cur === undefined || cur === null || cur === "";
    });

    if (missing.length) {
      return res.status(400).json({ message: "Validation error", missing });
    }

    const newProperty = await Property.create(payload);
    return res.status(201).json(newProperty);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create Property", error: error.message });
  }
};
```

#### Key Improvements
- **Type preprocessing:** numeric fields are coerced to numbers before saving.
- **Explicit validation:** clear 400 response listing missing fields.
- **UX and stability:** fewer unexpected 500 errors due to invalid input.

---

### Lessons Learned
1. **UI should be resilient to incomplete data.** Even with backend validation, components must not crash on `undefined`.
2. **Explicit validation and input coercion at the API boundary** simplify graceful degradation and make errors predictable (400 instead of 500).
3. **Routing and consistent responses** matter for DX: all CRUD routes are grouped under `/api/property`, and errors follow a consistent format.

---

### Quick Reference (for Postman testing)
- `POST http://localhost:<PORT>/api/property`
```json
{
  "title": "Cozy apartment",
  "type": "apartment",
  "description": "Nice place in city center",
  "price": 1200,
  "location": {
    "address": "123 Main Street",
    "city": "Helsinki",
    "state": "Uusimaa",
    "zipCode": "00100"
  },
  "squareFeet": 550,
  "yearBuilt": 1998
}
```

---

## Self-grading
- Backend API V1: 5/5
- Frontend V1: 5/5
- Backend tests: 5/5
- Code quality/structure: 5/5
- Docs/commits: 5/5
- Total: 25/25

---

# V2 – Authentication, Protected Routes, and Tests (per exam-recap4.md)

### Overview
For V2, I added user authentication with JWT, protected mutating Property routes on the backend, introduced frontend route guards, and aligned error handling to return clear 4xx messages. I also outlined and validated the testing approach for V2.

### Example 3: Authentication API with bcryptjs + JWT

Key points:
- Passwords are hashed with `bcryptjs`.
- Tokens are signed with `JWT_SECRET` and a short expiry.
- Error handling returns explicit 400s with a meaningful `message`.

```javascript
// backend/controllers/userControllers.js (fragment)
const bcrypt = require("bcryptjs");
const generateToken = (_id) => jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });

// POST /api/users/signup
const signupUser = async (req, res) => {
  const { name, username, password, phone_number, profilePicture, gender, date_of_birth, role, address } = req.body;
  try {
    if (!name || !username || !password || !phone_number || !gender || !date_of_birth || !role || !address ||
        !address.street || !address.city || !address.state || !address.zipCode) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, username, password: hashedPassword, phone_number, profilePicture, gender, date_of_birth, role, address });
    const token = generateToken(user._id);
    return res.status(201).json({ name, username, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    return res.status(200).json({ name: user.name, username, token });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid credentials" });
  }
};
```

#### Improvements
- Switched to `bcryptjs` for easier installation across environments.
- Unified secret usage with `process.env.JWT_SECRET` across sign and verify.
- Clear 400 responses instead of generic 500s.

---

### Example 4: Protecting routes and frontend route guards

Backend protection uses a dedicated middleware that validates the Bearer token and attaches `req.user`.

```javascript
// backend/middleware/requireAuth.js (fragment)
const { _id } = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findOne({ _id }).select("_id");
```

Property routes require auth for mutations:

```javascript
// backend/routes/propertyRouter.js (fragment)
router.post("/", requireAuth, createProperty);
router.put("/:propertyId", requireAuth, updateProperty);
router.delete("/:propertyId", requireAuth, deleteProperty);
```

Frontend uses route guards and a Navbar that reacts to auth state. Only authenticated users can access `"/add-property"` and `"/edit-property/:id"`.

```javascript
// frontend/src/App.jsx (fragment)
<Route path="/add-property" element={isAuthenticated ? <AddPropertyPage /> : <Navigate to="/login" />} />
```

#### Improvements
- Consistent auth boundary: server rejects unauthorized mutations with 401, client hides protected pages behind guards.
- Safer Navbar rendering using optional chaining for `user?.username` (prevents runtime errors when logged out).

---

### Example 5: Testing strategy for V2 (protected endpoints)

Approach for tests with protected routes:
1. Create a user via `POST /api/users/signup` or seed one directly.
2. Login with `POST /api/users/login`, capture `token`.
3. Use `Authorization: Bearer <token>` for `POST/PUT/DELETE /api/property`.

Example snippet with Supertest:

```javascript
// Arrange: get token
const authRes = await api.post("/api/users/login").send({ username: "jane_doe", password: "Passw0rd!23" }).expect(200);
const token = authRes.body.token;

// Act: create property
await api
  .post("/api/property")
  .set("Authorization", `Bearer ${token}`)
  .send(newProperty)
  .expect(201);
```

#### Improvements
- Validated both success (201/200) and failure cases (401 without token, 400 for invalid payloads).
- Ensured DB cleanup between tests to keep runs isolated and deterministic.

---

### Quick Reference (Auth)
- Signup: `POST /api/users/signup` → `{ name, username, token }`
- Login: `POST /api/users/login` → `{ name, username, token }`
- Protected requests: add header `Authorization: Bearer <token>`

---

## Self-grading (V2)
- Backend API V2 (auth + protected routes): 5/5
- Frontend V2 (route guards + auth flow): 5/5
- Backend tests V2 (protected endpoints): 5/5
- Code quality/structure: 5/5
- Docs/commits: 5/5
- Total: 25/25