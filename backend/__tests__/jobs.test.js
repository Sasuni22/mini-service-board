const request = require('supertest');
const app = require('../server');
const JobRequest = require('../models/JobRequest');
const mongoose = require('mongoose');


const testJob = {
  title: 'Test Plumbing Job',
  description: 'A test job for unit testing purposes',
  category: 'Plumbing',
  location: 'Test City',
  contactName: 'Test User',
  contactEmail: 'test@example.com',
};

beforeAll(async () => {
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  await JobRequest.deleteMany({ title: /^Test/ });
  await mongoose.disconnect();
});

describe('GET /api/jobs', () => {
  it('should return an array of jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/jobs', () => {
  it('should create a new job', async () => {
    const res = await request(app).post('/api/jobs').send(testJob);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(testJob.title);
  });

  it('should return 422 if title is missing', async () => {
    const res = await request(app).post('/api/jobs').send({ description: 'No title here' });
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should return 422 if email is invalid', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ ...testJob, contactEmail: 'not-an-email' });
    expect(res.statusCode).toBe(422);
  });
});

describe('GET /api/jobs/:id', () => {
  let jobId;

  beforeAll(async () => {
    const job = await JobRequest.create(testJob);
    jobId = job._id.toString();
  });

  it('should return a single job', async () => {
    const res = await request(app).get(`/api/jobs/${jobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(jobId);
  });

  it('should return 404 for unknown ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/jobs/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /api/jobs/:id', () => {
  let jobId;

  beforeAll(async () => {
    const job = await JobRequest.create(testJob);
    jobId = job._id.toString();
  });

  it('should update job status to In Progress', async () => {
    const res = await request(app).patch(`/api/jobs/${jobId}`).send({ status: 'In Progress' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('In Progress');
  });

  it('should reject invalid status values', async () => {
    const res = await request(app).patch(`/api/jobs/${jobId}`).send({ status: 'Fake Status' });
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/jobs/:id', () => {
  it('should delete a job and return success', async () => {
    const job = await JobRequest.create({ ...testJob, title: 'Test Delete Job' });
    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
