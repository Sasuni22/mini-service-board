import { JobStatus } from '@/types';

const cfg: Record<JobStatus, { label: string; classes: string }> = {
  'Open':        { label: 'OPEN',        classes: 'text-emerald-600 bg-emerald-50  border border-emerald-200 font-bold' },
  'In Progress': { label: 'IN PROGRESS', classes: 'text-blue-600   bg-blue-50     border border-blue-200   font-bold' },
  'Closed':      { label: 'CLOSED',      classes: 'text-slate-500  bg-slate-100   border border-slate-200  font-bold' },
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  const { label, classes } = cfg[status] ?? cfg['Open'];
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] tracking-wider ${classes}`}>
      {label}
    </span>
  );
}
