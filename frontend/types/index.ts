export type JobStatus = 'Open' | 'In Progress' | 'Closed';

export type JobCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Painting'
  | 'Joinery'
  | 'HVAC'
  | 'Roofing'
  | 'Landscaping'
  | 'IT Support'
  | 'General Maintenance'
  | 'Other';

export interface JobRequest {
  _id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  contactName: string;
  contactEmail: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'homeowner' | 'tradesperson' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
}
