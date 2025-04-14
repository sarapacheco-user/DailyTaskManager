const mongoose = require('mongoose');

// Defining the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    default: null,
  },
});

// Creating the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model to be used in other parts of the application
module.exports = User;
