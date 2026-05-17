'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { JobRequest } from '@/types';
import StatusBadge from './StatusBadge';

const categoryColors: Record<string, string> = {
  Plumbing:             'bg-blue-50   text-blue-700   border-blue-200',
  Electrical:           'bg-yellow-50 text-yellow-700 border-yellow-200',
  Painting:             'bg-pink-50   text-pink-700   border-pink-200',
  Joinery:              'bg-orange-50 text-orange-700 border-orange-200',
  HVAC:                 'bg-cyan-50   text-cyan-700   border-cyan-200',
  Roofing:              'bg-stone-100 text-stone-700  border-stone-200',
  Landscaping:          'bg-green-50  text-green-700  border-green-200',
  'IT Support':         'bg-violet-50 text-violet-700 border-violet-200',
  'General Maintenance':'bg-slate-100 text-slate-600  border-slate-200',
  Other:                'bg-slate-100 text-slate-600  border-slate-200',
};

interface Props {
  job: JobRequest;
  index?: number;
}

export default function JobCard({ job, index = 0 }: Props) {
  const catClass = categoryColors[job.category] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  const delay = Math.min(index * 60, 400);

  const date = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });


  const jobRef = `JOB-${job._id.slice(-4).toUpperCase()}`;

  return (
    <article
      className="card flex flex-col p-5 gap-3 hover:shadow-md transition-shadow animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Row 1: job ref + status badge */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">{jobRef}</span>
        <StatusBadge status={job.status} />
      </div>

      {/* Row 2: title */}
      <h3 className="text-[15px] font-bold leading-snug text-slate-900 line-clamp-2">
        {job.title}
      </h3>

      {/* Row 3: description */}
      <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Row 4: category + location */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded px-2 py-0.5 text-[11px] font-semibold border ${catClass}`}>
          {job.category}
        </span>
        {job.location && (
          <span className="flex items-center gap-1 text-[12px] text-slate-400">
            <MapPin size={11} />
            {job.location}
          </span>
        )}
      </div>

      {/* Row 5: date + view details */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
        <span className="text-[12px] text-slate-400">{date}</span>
        <Link
          href={`/jobs/${job._id}`}
          className="text-[13px] font-semibold text-[#2353E8] hover:underline"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
