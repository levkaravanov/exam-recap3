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
    {
      id: "2",
      title: "Spacious house",
      type: "house",
      description: "Family home",
      price: 3200,
      location: {
        address: "456 Oak",
        city: "Espoo",
        state: "Uusimaa",
        zipCode: "02100",
      },
      squareFeet: 1500,
      yearBuilt: 2008,
    },
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
