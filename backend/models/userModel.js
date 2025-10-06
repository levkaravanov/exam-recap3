const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true }, // Full name of the user
    username: { type: String, required: true, unique: true }, // Unique username for login
    password: { type: String, required: true }, // Hashed password for authentication
    phone_number: { type: String, required: true }, // Contact phone number
    profilePicture: { type: String, required: false }, // URL of the user's profile picture
    gender: { type: String, required: true }, // Gender of the user
    date_of_birth: { type: Date, required: true }, // User's birth date
    role: { type: String, required: true, enum: ['admin', 'user', 'moderator'], default: 'user' }, // User role
    address: {
      street: { type: String, required: true }, // Street address
      city: { type: String, required: true }, // City
      state: { type: String, required: true }, // State or region
      zipCode: { type: String, required: true } // Postal/ZIP code
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);

//add  virtual field id
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

