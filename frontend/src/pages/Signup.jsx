import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const username = useField("text");
  const password = useField("password");
  const phoneNumber = useField("text");
  const profilePicture = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const role = useField("text");
  const addressStreet = useField("text");
  const addressCity = useField("text");
  const addressState = useField("text");
  const addressZip = useField("text");
  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const created = await signup({
      username: username.value,
      password: password.value,
      name: name.value,
      phone_number: phoneNumber.value,
      profilePicture: profilePicture.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      role: role.value || "user",
      address: {
        street: addressStreet.value,
        city: addressCity.value,
        state: addressState.value,
        zipCode: addressZip.value,
      },
    });
    if (created) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <label>Phone Number:</label>
        <input {...phoneNumber} />
        <label>Gender:</label>
        <input {...gender} />
        <label>Date of Birth:</label>
        <input {...dateOfBirth} />
        <label>Role:</label>
        <input {...role} />
        <label>Profile Picture URL:</label>
        <input {...profilePicture} />
        <label>Street Address:</label>
        <input {...addressStreet} />
        <label>City:</label>
        <input {...addressCity} />
        <label>State:</label>
        <input {...addressState} />
        <label>Zip Code:</label>
        <input {...addressZip} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
