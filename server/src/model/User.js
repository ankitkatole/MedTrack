// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AADHAAR_REGEX = /^[2-9]\d{11}$/; // 12 digits, cannot start with 0 or 1 [web:41][web:47]
const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/; // E.164-like basic check [web:42]
const EMAIL_LOWER = true;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [PHONE_REGEX, 'Invalid phone number'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: EMAIL_LOWER,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    aadhaar: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [AADHAAR_REGEX, 'Invalid Aadhaar number'],
      select: false, // do not return by default [web:49]
    },
    role: {
      type: String,
      enum: ['PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN'],
      default: 'PATIENT',
      index: true,
    },
    medTrackId: {
      type: String,
      unique: true,
      immutable: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // omit from queries by default [web:49]
    },
  },
  { timestamps: true }
);

// Generate MedTrackID like MT-YYYYMMDD-<6 char>
userSchema.pre('save', function (next) {
  if (!this.isNew || this.medTrackId) return next();
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  this.medTrackId = `MT-${y}${m}${d}-${rand}`;
  next();
});

// Ensure unique indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ aadhaar: 1 }, { unique: true });
userSchema.index({ medTrackId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
