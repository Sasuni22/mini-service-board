import { JobRequest, ApiResponse, JobStatus, AuthResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const authHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'An unexpected error occurred');
  }

  return data;
};

export const fetchJobs = async (params?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<ApiResponse<JobRequest[]>> => {
  const query = new URLSearchParams();

  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/api/jobs?${query.toString()}`);

  return handleResponse(res);
};

export const fetchJob = async (
  id: string
): Promise<ApiResponse<JobRequest>> => {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`);

  return handleResponse(res);
};

export const createJob = async (
  data: Omit<JobRequest, '_id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<JobRequest>> => {
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

// PUT /api/jobs/:id — full edit of all fields except status
export const updateJob = async (
  id: string,
  data: Omit<JobRequest, '_id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<JobRequest>> => {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

// PATCH /api/jobs/:id — status only
export const updateJobStatus = async (
  id: string,
  status: JobStatus
): Promise<ApiResponse<JobRequest>> => {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(res);
};

export const deleteJob = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  return handleResponse(res);
};

export const fetchJobOptions = async (): Promise<
  ApiResponse<{ categories: string[]; statuses: string[] }>
> => {
  const res = await fetch(`${API_BASE}/api/jobs/meta/options`);

  return handleResponse(res);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  return handleResponse(res);
};