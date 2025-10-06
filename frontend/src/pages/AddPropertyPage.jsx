const AddPropertyPage = () => {
  
  const submitForm = (e) => {
    e.preventDefault();
    console.log("submitForm called");
   
  };

  return (
    <div className="create">
      <h2>Add a New Property</h2>
      <form onSubmit={submitForm}>
        <label>Property title:</label>
        <input
          type="text"
          required
          value=""
        />
        <label>Property type:</label>
        <select >
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>

        <label>Property Description:</label>
        <textarea
          required
          value=""

        ></textarea>
        <label>Property Price:</label>
        <input
          type="number"
          required
          value=""
        />
        <label>Property Address:</label>
        <input
          type="text"
          required
          value=""
        />
        <label>Property City:</label>
        <input
          type="text"
          required
          value=""
        />
        <label>Property State:</label>
        <input
          type="text"
          required
          value=""
        />
        <label>Property Zip Code:</label>
        <input
          type="text"
          required
          value=""
        />
        <label>Property Square Feet:</label>
        <input
          type="number"
          required
          value=""
        />
        <label>Property Year Built:</label>
        <input
          type="number"
          required
          value=""
        />
        <button>Add Property</button>
      </form>
    </div>
  );
};

export default AddPropertyPage;
