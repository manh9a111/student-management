const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentCode: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male','female','other'] },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String },
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
}, { timestamps: true });

StudentSchema.index({ studentCode: 1 }, { unique: true });

module.exports = mongoose.model('Student', StudentSchema);
