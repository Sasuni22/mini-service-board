const express = require('express');
const router  = express.Router();
const {
  getAllJobs, getJobById, createJob,
  updateJob, updateJobStatus, deleteJob, getJobOptions,
} = require('../controllers/jobController');
const { protect, restrictTo }   = require('../middleware/index');
const { validateCreateJob }     = require('../middleware/validate');

// Public — no token needed
router.get('/meta/options', getJobOptions);
router.get('/',    getAllJobs);
router.get('/:id', getJobById);

// Homeowners: create / edit / delete their own jobs
router.post(
  '/',
  protect,
  restrictTo('homeowner', 'admin'),
  validateCreateJob,
  createJob
);

router.put(
  '/:id',
  protect,
  restrictTo('homeowner', 'admin'),
  validateCreateJob,
  updateJob
);

router.delete(
  '/:id',
  protect,
  restrictTo('homeowner', 'admin'),
  deleteJob
);

// Tradespeople: update status only
router.patch(
  '/:id',
  protect,
  restrictTo('tradesperson', 'admin'),
  updateJobStatus
);

module.exports = router;