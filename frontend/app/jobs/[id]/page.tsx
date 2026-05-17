'use client';


import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Mail, User,
  Trash2, RefreshCw, Tag, Pencil, X, Save,
} from 'lucide-react';
import { fetchJob, updateJob, updateJobStatus, deleteJob, fetchJobOptions } from '@/lib/api';
import { JobRequest, JobStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { JobDetailSkeleton } from '@/components/Skeleton';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

const STATUSES: JobStatus[] = ['Open', 'In Progress', 'Closed'];

interface EditForm {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
}

interface EditErrors {
  title?: string;
  description?: string;
  contactEmail?: string;
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { user }     = useAuth();

  const [job, setJob]                 = useState<JobRequest | null>(null);
  const [loading, setLoading]         = useState(true);
  const [selectedStatus, setSelected] = useState<JobStatus>('Open');
  const [statusUpdating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDel] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [editForm, setEditForm]       = useState<EditForm>({
    title: '', description: '', category: '',
    location: '', contactName: '', contactEmail: '',
  });
  const [editErrors, setEditErrors]   = useState<EditErrors>({});
  const [saving, setSaving]           = useState(false);
  const [categories, setCategories]   = useState<string[]>([]);

  // Derived permission flags
  const createdById =
    job?.createdBy && typeof job.createdBy === 'object'
      ? (job.createdBy as unknown as { _id: string })._id
      : String(job?.createdBy ?? '');

  const isOwner        = !!user && !!job?.createdBy && user.id === createdById;
  const isTradesperson = user?.role === 'tradesperson';
  const isAdmin        = user?.role === 'admin';
  const canEdit        = isOwner || isAdmin;
  const canStatus      = isTradesperson || isAdmin;

  useEffect(() => {
    fetchJob(id)
      .then((r) => {
        setJob(r.data);
        setSelected(r.data.status);
        setEditForm({
          title:        r.data.title        || '',
          description:  r.data.description  || '',
          category:     r.data.category     || '',
          location:     r.data.location     || '',
          contactName:  r.data.contactName  || '',
          contactEmail: r.data.contactEmail || '',
        });
      })
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));

    fetchJobOptions()
      .then((r) => setCategories(r.data.categories))
      .catch(() => {});
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!job) return;
    setUpdating(true);
    try {
      const res = await updateJobStatus(id, selectedStatus);
      setJob(res.data);
      setSelected(res.data.status);
      toast.success(`Status updated to "${selectedStatus}"`);
    } catch {
      toast.error('Failed to update status');
    } finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete job');
      setDeleting(false);
      setShowDel(false);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
    if (editErrors[name as keyof EditErrors])
      setEditErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validateEdit = (): boolean => {
    const e: EditErrors = {};
    if (!editForm.title.trim())       e.title       = 'Title is required';
    if (!editForm.description.trim()) e.description = 'Description is required';
    if (editForm.contactEmail && !/^\S+@\S+\.\S+$/.test(editForm.contactEmail))
      e.contactEmail = 'Please enter a valid email address';
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEdit()) return;
    setSaving(true);
    try {
      const res = await updateJob(id, editForm);
      setJob(res.data);
      setEditForm({
        title:        res.data.title        || '',
        description:  res.data.description  || '',
        category:     res.data.category     || '',
        location:     res.data.location     || '',
        contactName:  res.data.contactName  || '',
        contactEmail: res.data.contactEmail || '',
      });
      setShowEdit(false);
      toast.success('Job updated successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save changes');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-6"><JobDetailSkeleton /></div>;

  if (!job) return (
    <div className="flex flex-col items-center justify-center py-24">
      <p className="text-slate-500">This job could not be found.</p>
      <Link href="/" className="btn-blue mt-4">Back to Dashboard</Link>
    </div>
  );

  const jobRef = `JOB-${job._id.slice(-4).toUpperCase()}`;

  return (
    <>
      <div className="p-6 grid gap-5 lg:grid-cols-[1fr_280px]">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-5">

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2353E8] hover:underline w-fit"
          >
            <ArrowLeft size={14} /> Back to Board
          </Link>

          <div className="card p-7 animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-400">{jobRef}</span>
                <StatusBadge status={job.status} />
              </div>
              {canEdit && (
                <button
                  onClick={() => setShowEdit(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Pencil size={12} /> Edit Job
                </button>
              )}
            </div>

            <h1 className="text-[22px] font-extrabold text-slate-900 leading-tight mb-4">
              {job.title}
            </h1>

            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
              <MetaCol icon={<Tag size={13} />}    label="Category"     value={job.category    || '—'} />
              <MetaCol icon={<MapPin size={13} />}  label="Location"     value={job.location    || '—'} />
              <MetaCol icon={<User size={13} />}    label="Requested By" value={job.contactName || '—'} />
            </div>

            <h2 className="text-[13px] font-bold text-slate-900 mb-2">Service Description</h2>
            <p className="text-[13px] text-slate-600 leading-7 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Location card */}
          <div className="card overflow-hidden animate-fade-up delay-100">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-[13px] font-bold text-slate-900">Location Details</h2>
            </div>
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 mx-5 mb-5 rounded-lg overflow-hidden flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200">
                <path d="M0 60 Q100 40 200 70 Q300 100 400 60"      stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
                <path d="M0 110 Q80 90 180 120 Q280 150 400 110"    stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
                <path d="M0 160 Q120 140 220 165 Q320 190 400 155"  stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
                <path d="M60 0 Q80 100 70 200"                      stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
                <path d="M200 0 Q210 100 205 200"                   stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
                <path d="M340 0 Q345 100 340 200"                   stroke="#94A3B8" strokeWidth="1.5" fill="none"/>
                <circle cx="200" cy="110" r="8" fill="#2353E8" opacity="0.8"/>
                <circle cx="200" cy="110" r="4" fill="white"/>
              </svg>
              <div className="relative text-center">
                <MapPin size={22} className="mx-auto text-[#2353E8] mb-1" />
                <p className="text-[12px] font-semibold text-slate-600">
                  {job.location || 'No location specified'}
                </p>
              </div>
            </div>
            {job.location && (
              <p className="flex items-center gap-1.5 px-5 pb-4 text-[12px] text-slate-400">
                <MapPin size={11} />
                Map updated on {new Date(job.updatedAt).toLocaleDateString()}.
              </p>
            )}
          </div>

          {/* Contact card */}
          {(job.contactName || job.contactEmail) && (
            <div className="card p-5 animate-fade-up delay-200">
              <h2 className="text-[13px] font-bold text-slate-900 mb-4">Contact Information</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {job.contactName && (
                  <ContactCard
                    icon={<User size={14} className="text-[#2353E8]" />}
                    label="Name" value={job.contactName}
                  />
                )}
                {job.contactEmail && (
                  <ContactCard
                    icon={<Mail size={14} className="text-[#2353E8]" />}
                    label="Email" value={job.contactEmail}
                    href={`mailto:${job.contactEmail}`}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4">

          <div className="card p-5 animate-fade-up">
            <h2 className="text-[13px] font-bold text-slate-900 mb-4">Management</h2>

            {canStatus && (
              <>
                <label className="field-label">Job Status</label>
                <div className="relative mb-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelected(e.target.value as JobStatus)}
                    className="field-input appearance-none pr-9"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={statusUpdating}
                  className="btn-blue w-full mb-3"
                >
                  {statusUpdating
                    ? <><RefreshCw size={13} className="animate-spin" />Updating…</>
                    : <><RefreshCw size={13} />Update Status</>}
                </button>
              </>
            )}

            {!canStatus && (
              <div className="mb-3">
                <label className="field-label">Current Status</label>
                <div className="mt-1"><StatusBadge status={job.status} /></div>
              </div>
            )}

            {canEdit && (
              <>
                <button
                  onClick={() => setShowEdit(true)}
                  className="btn-outline w-full mb-2"
                >
                  <Pencil size={13} /> Edit Job Details
                </button>
                <button
                  onClick={() => setShowDel(true)}
                  className="btn-danger-outline w-full"
                >
                  <Trash2 size={13} /> Delete Job
                </button>
              </>
            )}

            {!user && (
              <p className="text-[12px] text-slate-400 text-center mt-2">
                <Link href="/auth/login" className="text-[#2353E8] font-semibold hover:underline">
                  Sign in
                </Link>{' '}
                to manage this job.
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="card p-5 animate-fade-up delay-100">
            <h2 className="text-[13px] font-bold text-slate-900 mb-4">Timeline</h2>
            <ol className="relative ml-2 border-l-2 border-slate-200 pl-4 space-y-4">
              <TimelineItem label="Created" date={job.createdAt} active />
              {(job.status === 'In Progress' || job.status === 'Closed') && (
                <TimelineItem label="Moved to In Progress" date={job.updatedAt} />
              )}
              {job.status === 'Closed' && (
                <TimelineItem label="Closed" date={job.updatedAt} />
              )}
            </ol>
          </div>

          {/* Posted By */}
          {job.createdBy && typeof job.createdBy === 'object' && (
            <div className="card p-4 animate-fade-up delay-200">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Posted By
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                  <User size={14} className="text-[#2353E8]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">
                    {(job.createdBy as unknown as { name: string }).name}
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize">
                    {(job.createdBy as unknown as { role: string }).role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowEdit(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-[16px] font-bold text-slate-900">Edit Job Details</h2>
              <button
                onClick={() => setShowEdit(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="field-label" htmlFor="edit-title">Title</label>
                <input
                  id="edit-title" name="title" type="text"
                  value={editForm.title} onChange={handleEditChange}
                  className={`field-input ${editErrors.title ? 'field-input-error' : ''}`}
                />
                {editErrors.title && (
                  <p className="mt-1 text-[12px] text-red-500">{editErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label" htmlFor="edit-category">Category</label>
                  <div className="relative">
                    <select
                      id="edit-category" name="category"
                      value={editForm.category} onChange={handleEditChange}
                      className="field-input appearance-none pr-9"
                    >
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="edit-location">Location</label>
                  <input
                    id="edit-location" name="location" type="text"
                    value={editForm.location} onChange={handleEditChange}
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description" name="description" rows={4}
                  value={editForm.description} onChange={handleEditChange}
                  className={`field-input resize-none ${editErrors.description ? 'field-input-error' : ''}`}
                />
                {editErrors.description && (
                  <p className="mt-1 text-[12px] text-red-500">{editErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label" htmlFor="edit-contactName">Contact Name</label>
                  <input
                    id="edit-contactName" name="contactName" type="text"
                    value={editForm.contactName} onChange={handleEditChange}
                    className="field-input"
                  />
                </div>
                <div>
                  <label
                    className={`field-label ${editErrors.contactEmail ? 'text-red-500' : ''}`}
                    htmlFor="edit-contactEmail"
                  >
                    Contact Email
                  </label>
                  <input
                    id="edit-contactEmail" name="contactEmail" type="email"
                    value={editForm.contactEmail} onChange={handleEditChange}
                    className={`field-input ${editErrors.contactEmail ? 'field-input-error' : ''}`}
                  />
                  {editErrors.contactEmail && (
                    <p className="mt-1 text-[12px] text-red-500">{editErrors.contactEmail}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button onClick={() => setShowEdit(false)} className="btn-outline" disabled={saving}>
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={saving} className="btn-blue">
                {saving
                  ? <><RefreshCw size={13} className="animate-spin" />Saving…</>
                  : <><Save size={13} />Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this service request? This action cannot be undone and will remove all associated logs and history."
        confirmLabel="Delete Permanently"
        onConfirm={handleDelete}
        onCancel={() => setShowDel(false)}
        isLoading={deleting}
      />
    </>
  );
}

function MetaCol({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
        {icon} {label}
      </div>
      <p className="text-[13px] font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function ContactCard({
  icon, label, value, href,
}: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        {href ? (
          <a href={href} className="text-[13px] font-semibold text-[#2353E8] hover:underline">{value}</a>
        ) : (
          <p className="text-[13px] font-semibold text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ label, date, active }: { label: string; date: string; active?: boolean }) {
  return (
    <li className="relative">
      <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${active ? 'bg-[#2353E8]' : 'bg-slate-300'}`} />
      <p className="text-[12px] font-semibold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400">
        {new Date(date).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </p>
    </li>
  );
}