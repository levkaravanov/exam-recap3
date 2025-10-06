import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PropertyPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`/api/property/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete property: ${errorText}`);
      }
      console.log("Property deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/property/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const onDeleteClick = (propertyId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?" + propertyId
    );
    if (!confirm) return;

    deleteProperty(propertyId);
  };

  return (
    <div className="property-details">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{property.title}</h2>
          <p>Type: {property.type}</p>
          <p>Description: {property.description}</p>
          <p>Address: {property.location.address}</p>
          <p>City: {property.location.city}</p>
          <p>State: {property.location.state}</p>
          <p>Zip Code: {property.location.zipCode}</p>
          <p>Price: ${property.price}</p>
          <p>Square Feet: {property.squareFeet}</p>
          <p>Year Built: {property.yearBuilt}</p>

          {isAuthenticated && (
            <div className="actions">
              <button className="btn btn-danger" onClick={() => onDeleteClick(property._id)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/edit-property/${property._id}`)}>
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyPage;