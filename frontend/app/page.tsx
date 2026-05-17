'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, MessageSquare, Clock, TrendingUp, ChevronDown } from 'lucide-react';
import { fetchJobs, fetchJobOptions } from '@/lib/api';
import { JobRequest } from '@/types';
import JobCard from '@/components/JobCard';
import { JobGridSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

const ALL = 'All';
const CATEGORY_SHORTCUTS = ['All Jobs', 'Plumbing', 'Electrical', 'Painting', 'Joinery'];

/* Recent activity items — static for now, could be wired to a real endpoint */
const recentActivity = [
  {
    id: 1,
    icon: CheckCircle2,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: 'Job #1102 Marked Closed',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: MessageSquare,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    title: 'New comment on JOB-0988',
    time: '4 hours ago',
  },
  {
    id: 3,
    icon: Clock,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    title: 'Status Update: JOB-1024',
    time: 'Yesterday',
  },
];

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [allJobs, setAllJobs] = useState<JobRequest[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [activeStatus, setActiveStatus] = useState(ALL);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  /* load categories */
  useEffect(() => {
    fetchJobOptions()
      .then((r) => setCategories(r.data.categories))
      .catch(() => {});
  }, []);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeCategory !== ALL) params.category = activeCategory;
      if (activeStatus !== ALL)   params.status   = activeStatus;
      if (debouncedSearch)        params.search   = debouncedSearch;
      const res = await fetchJobs(params);
      setJobs(res.data);
      /* also load unfiltered for stats */
      if (!allJobs.length) {
        const all = await fetchJobs({});
        setAllJobs(all.data);
      }
    } catch {
      toast.error('Failed to load jobs. Is the backend running?');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeStatus, debouncedSearch]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  /* stats from unfiltered list */
  const openCount       = allJobs.filter((j) => j.status === 'Open').length;
  const inProgressCount = allJobs.filter((j) => j.status === 'In Progress').length;

  /* display categories for the pill row */
  const pillCategories = categories.length ? categories : CATEGORY_SHORTCUTS.slice(1);

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 flex-wrap">
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <button
            onClick={() => setActiveCategory(ALL)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ${
              activeCategory === ALL
                ? 'bg-[#2353E8] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            All Jobs
          </button>
          {pillCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#2353E8] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[13px] text-slate-500 font-medium">Status:</span>
          <div className="relative">
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-[13px] font-semibold text-[#2353E8] outline-none cursor-pointer focus:ring-2 focus:ring-blue-200"
            >
              <option value={ALL}>All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2353E8]" />
          </div>
        </div>
      </div>

      {/* ── Job cards grid ── */}
      <div className="px-6 pb-4">
        {loading ? (
          <JobGridSkeleton count={3} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description={
              debouncedSearch || activeCategory !== ALL || activeStatus !== ALL
                ? 'Try adjusting your search or filters.'
                : 'No service requests yet. Post the first one!'
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <JobCard key={job._id} job={job} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom panels: Efficiency Insight + Recent Activity ── */}
      <div className="mt-auto px-6 pb-6 grid gap-4 lg:grid-cols-[1fr_320px]">

        {/* Service Efficiency Insight — blue card */}
        <div className="relative overflow-hidden rounded-xl bg-[#2353E8] p-7 text-white">
          {/* Watermark trend icon */}
          <TrendingUp
            size={140}
            strokeWidth={1}
            className="absolute right-4 bottom-[-20px] text-white/10"
          />
          <h2 className="text-lg font-bold mb-1">Service Efficiency Insight</h2>
          <p className="text-sm text-blue-100 max-w-md">
            Your average response time for Plumbing requests has improved by 14% this month. Keep it up!
          </p>
          <div className="mt-6 flex gap-10">
            <div>
              <p className="text-4xl font-extrabold leading-none">84%</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 mt-1">
                On-Time Completion
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold leading-none">4.9</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 mt-1">
                Client Rating
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map(({ id, icon: Icon, iconBg, iconColor, title, time }) => (
              <li key={id} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon size={16} className={iconColor} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{title}</p>
                  <p className="text-[12px] text-slate-400">{time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
