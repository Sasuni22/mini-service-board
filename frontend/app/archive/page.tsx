'use client';

import { useEffect, useState } from 'react';
import { fetchJobs } from '@/lib/api';
import { JobRequest } from '@/types';
import JobCard from '@/components/JobCard';
import { JobGridSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function ArchivePage() {
  const [jobs, setJobs]       = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs({ status: 'Closed' })
      .then((r) => setJobs(r.data))
      .catch(() => toast.error('Failed to load archive'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900">Archive</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Completed and closed service requests.
        </p>
      </div>
      {loading ? (
        <JobGridSkeleton count={6} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="Archive is empty"
          description="Closed jobs will appear here once completed."
          showCTA={false}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
        </div>
      )}
    </div>
  );
}
