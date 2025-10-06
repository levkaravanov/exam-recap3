import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../api";

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    type: "Apartment",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    squareFeet: "",
    yearBuilt: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Prepare payload matching backend schema
      const payload = {
        title: form.title,
        type: form.type.toLowerCase(),
        description: form.description,
        price: Number(form.price),
        location: {
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
        squareFeet: Number(form.squareFeet),
        yearBuilt: Number(form.yearBuilt),
      };

      await createProperty(payload);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create property");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create">
      <h2>Add a New Property</h2>
      <form onSubmit={submitForm}>
        <label>Property title:</label>
        <input
          type="text"
          name="title"
          required
          value={form.title}
          onChange={onChange}
        />
        <label>Property type:</label>
        <select name="type" value={form.type} onChange={onChange}>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>

        <label>Property Description:</label>
        <textarea
          name="description"
          required
          value={form.description}
          onChange={onChange}
        ></textarea>
        <label>Property Price:</label>
        <input
          type="number"
          name="price"
          required
          value={form.price}
          onChange={onChange}
        />
        <label>Property Address:</label>
        <input
          type="text"
          name="address"
          required
          value={form.address}
          onChange={onChange}
        />
        <label>Property City:</label>
        <input
          type="text"
          name="city"
          required
          value={form.city}
          onChange={onChange}
        />
        <label>Property State:</label>
        <input
          type="text"
          name="state"
          required
          value={form.state}
          onChange={onChange}
        />
        <label>Property Zip Code:</label>
        <input
          type="text"
          name="zipCode"
          required
          value={form.zipCode}
          onChange={onChange}
        />
        <label>Property Square Feet:</label>
        <input
          type="number"
          name="squareFeet"
          required
          value={form.squareFeet}
          onChange={onChange}
        />
        <label>Property Year Built:</label>
        <input
          type="number"
          name="yearBuilt"
          required
          value={form.yearBuilt}
          onChange={onChange}
        />
        <button disabled={submitting}>{submitting ? "Adding..." : "Add Property"}</button>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </form>
    </div>
  );
};

export default AddPropertyPage;
