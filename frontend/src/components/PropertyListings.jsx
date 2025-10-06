import { useEffect, useState } from "react";
import PropertyListing from "./PropertyListing";
import { getProperties } from "../api";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    // Load properties from backend API
    getProperties()
      .then((data) => {
        if (!isMounted) return;
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load properties");
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div className="property-list">Loading properties...</div>;
  if (error) return <div className="property-list">Error: {error}</div>;

  return (
    <div className="property-list">
      {properties.map((p) => (
        <PropertyListing key={p.id || p._id} property={p} />
      ))}
    </div>
  );
};

export default PropertyListings;
