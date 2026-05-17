import Link from 'next/link';
import { ClipboardList, Plus } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  showCTA?: boolean;
}

export default function EmptyState({
  title = 'No jobs found',
  description = 'No service requests match your current filters.',
  showCTA = true,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
        <ClipboardList size={24} className="text-[#2353E8]" />
      </div>
      <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-slate-400">{description}</p>
      {showCTA && (
        <Link href="/new-job" className="btn-blue mt-6">
          <Plus size={15} /> Post a Job
        </Link>
      )}
    </div>
  );
}
