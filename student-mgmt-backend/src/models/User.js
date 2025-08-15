const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','staff'], default: 'staff' }
}, { timestamps: true });

UserSchema.methods.setPassword = async function(pw) {
  this.passwordHash = await bcrypt.hash(pw, 10);
};

UserSchema.methods.validatePassword = function(pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
