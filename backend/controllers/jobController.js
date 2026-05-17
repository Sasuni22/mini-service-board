const JobRequest = require('../models/JobRequest');
const { validationResult } = require('express-validator');

// GET /api/jobs — public, supports ?category= ?status= ?search=
const getAllJobs = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (search)   filter.$text    = { $search: search };

    const jobs = await JobRequest.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) { next(error); }
};

// GET /api/jobs/:id — public
const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id)
      .populate('createdBy', 'name email role');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) { next(error); }
};

// POST /api/jobs — homeowners only
const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const job = await JobRequest.create({
      ...req.body,
      createdBy: req.user._id,
      status: 'Open',
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) { next(error); }
};

// PUT /api/jobs/:id — homeowners, own jobs only (admins bypass)
const updateJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // ownership check
    if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You can only edit your own jobs.' });
    }

    const { title, description, category, location, contactName, contactEmail } = req.body;
    Object.assign(job, { title, description, category, location, contactName, contactEmail });
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) { next(error); }
};

// PATCH /api/jobs/:id — tradespeople only, status field only
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!JobRequest.STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${JobRequest.STATUSES.join(', ')}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    res.json({ success: true, data: job });
  } catch (error) { next(error); }
};

// DELETE /api/jobs/:id — homeowners, own jobs only (admins bypass)
const deleteJob = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // ownership check
    if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You can only delete your own jobs.' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully', id: req.params.id });
  } catch (error) { next(error); }
};

// GET /api/jobs/meta/options — public, dropdown data
const getJobOptions = async (req, res) => {
  res.json({
    success: true,
    data: { categories: JobRequest.CATEGORIES, statuses: JobRequest.STATUSES },
  });
};

module.exports = {
  getAllJobs, getJobById, createJob,
  updateJob, updateJobStatus, deleteJob, getJobOptions,
};