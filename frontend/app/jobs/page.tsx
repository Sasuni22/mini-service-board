'use client';

import { useEffect, useState } from 'react';
import { fetchJobs } from '@/lib/api';
import { JobRequest } from '@/types';
import JobCard from '@/components/JobCard';
import { JobGridSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function ActiveJobsPage() {
  const [jobs, setJobs]     = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs({ status: 'Open' })
      .then((r) => setJobs(r.data))
      .catch(() => toast.error('Failed to load active jobs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900">Active Jobs</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Open service requests available for tradespeople.
        </p>
      </div>
      {loading ? (
        <JobGridSkeleton count={6} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No active jobs"
          description="All jobs are currently closed or in progress."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
        </div>
      )}
    </div>
  );
}
