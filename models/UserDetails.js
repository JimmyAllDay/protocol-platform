const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isCheckedPromo: {
    type: Boolean,
    default: false,
    required: true,
  },
  instagramHandle: {
    type: String,
    required: true,
  },
  isCheckedInstagram: {
    type: Boolean,
    default: false,
    required: false,
  },
  facebookName: {
    type: String,
    required: true,
  },
  isCheckedFacebook: {
    type: Boolean,
    default: false,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserDetails =
  mongoose.models.UserDetails || mongoose.model('UserDetails', formSchema);
export default UserDetails;
