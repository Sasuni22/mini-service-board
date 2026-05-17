const mongoose = require('mongoose');

const JOB_CATEGORIES = [
  'Plumbing', 'Electrical', 'Painting', 'Joinery',
  'HVAC', 'Roofing', 'Landscaping', 'IT Support',
  'General Maintenance', 'Other',
];

const JOB_STATUSES = ['Open', 'In Progress', 'Closed'];

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: { values: JOB_CATEGORIES, message: '{VALUE} is not a valid category' },
      default: 'General Maintenance',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact name cannot exceed 100 characters'],
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type: String,
      enum: {
        values: JOB_STATUSES,
        message: '{VALUE} is not a valid status. Must be Open, In Progress, or Closed',
      },
      default: 'Open',
    },
    // tracks which user created this job — used for ownership checks
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobRequestSchema.index({ title: 'text', description: 'text', location: 'text' });

jobRequestSchema.statics.CATEGORIES = JOB_CATEGORIES;
jobRequestSchema.statics.STATUSES   = JOB_STATUSES;

module.exports = mongoose.model('JobRequest', jobRequestSchema);