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
