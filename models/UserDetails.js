const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: null,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  facebookName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  instagramHandle: {
    type: String,
    required: true,
  },
  isCheckedFacebook: {
    type: Boolean,
    default: false,
    required: false,
  },
  isCheckedInstagram: {
    type: Boolean,
    default: false,
    required: false,
  },
  isCheckedPromo: {
    type: Boolean,
    default: false,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: null,
    required: false,
  },
  userProfileComplete: {
    type: Boolean,
    default: false,
    required: false,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  phone: {
    type: Number,
    required: false,
    unique: true,
  },
  __v: {
    type: Number,
    required: false,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const UserDetails =
  mongoose.models.UserDetails || mongoose.model('UserDetails', formSchema);
export default UserDetails;
