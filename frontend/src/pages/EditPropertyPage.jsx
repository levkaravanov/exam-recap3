import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {updateProperty, getPropertyById} from "../api";

const EditPropertyPage = () => {
  const [property, setProperty] = useState(null); // Initialize property state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  // Declare state variables for form fields
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

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  // Function to update property

  const updateProperty = async (form) => {
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

      await updateProperty(id, payload);
    navigate("/property/" + id);
    } catch (error) {
      console.error("Error updating property:", error);
      return false;
    }
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setForm(data); // Set the property data
        } catch (error) {
        console.error("Failed to fetch property:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchProperty();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const success = await updateProperty(form);
    if (success) {
      console.log("Job Updated Successfully");
      navigate(`/jobs/${id}`);
    } else {
      console.error("Failed to update the job");
    }
  };

  return (
    <div className="create">
      <h2>Update Job</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Job title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Job type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>

          <label>Job Description:</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label>Company Name:</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <label>Contact Email:</label>
          <input
            type="text"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <label>Contact Phone:</label>
          <input
            type="text"
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <button>Update Job</button>
        </form>
      )}
    </div>
  );
};

export default EditPropertyPage;