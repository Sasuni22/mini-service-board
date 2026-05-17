'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, X, CheckCircle2 } from 'lucide-react';
import { createJob, fetchJobOptions } from '@/lib/api';
import toast from 'react-hot-toast';

interface FormState {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  contactEmail?: string;
}

const INITIAL: FormState = {
  title: '',
  description: '',
  category: 'General Maintenance',
  location: '',
  contactName: '',
  contactEmail: '',
};

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  /* load categories */
  useEffect(() => {
    fetchJobOptions()
      .then((r) => setCategories(r.data.categories))
      .catch(() => {});
    /* restore draft */
    const saved = localStorage.getItem('jobDraft');
    if (saved) { try { setForm(JSON.parse(saved)); } catch {} }
  }, []);

  /* auto-save draft */
  useEffect(() => {
    const t = setTimeout(() => {
      const hasContent = Object.values(form).some((v) => v.trim());
      if (hasContent) {
        localStorage.setItem('jobDraft', JSON.stringify(form));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2500);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e: FormErrors = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      e.contactEmail = 'Please enter a valid email address.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await createJob(form);
      localStorage.removeItem('jobDraft');
      toast.success('Job posted successfully!');
      router.push(`/jobs/${res.data._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('jobDraft');
    router.back();
  };

  return (
    <div className="relative p-6 max-w-2xl">

      {/* Draft Saved toast — top-right fixed, matching design */}
      {draftSaved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl animate-slide-in">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <CheckCircle2 size={16} className="text-[#2353E8]" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-900">Draft Saved</p>
            <p className="text-[12px] text-slate-400">Your progress is being synced.</p>
          </div>
          <button
            onClick={() => setDraftSaved(false)}
            className="ml-2 text-slate-300 hover:text-slate-500"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="card p-8">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Post New Job</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Fill in the details below to broadcast your service request to our network.
          </p>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="field-label" htmlFor="title">Title</label>
            <input
              id="title" name="title" type="text"
              placeholder="e.g. Emergency Leak in Kitchen"
              value={form.title} onChange={handleChange}
              className={`field-input ${errors.title ? 'field-input-error' : ''}`}
            />
            {errors.title && <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>}
          </div>

          {/* Category + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="category">Category</label>
              <div className="relative">
                <select
                  id="category" name="category"
                  value={form.category} onChange={handleChange}
                  className="field-input appearance-none pr-9"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="location">Location</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input
                  id="location" name="location" type="text"
                  placeholder="City or Office Name"
                  value={form.location} onChange={handleChange}
                  className="field-input pl-9"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="field-label" htmlFor="description">Description</label>
            <textarea
              id="description" name="description" rows={5}
              placeholder="Describe the job requirements in detail..."
              value={form.description} onChange={handleChange}
              className={`field-input resize-none ${errors.description ? 'field-input-error' : ''}`}
            />
            {errors.description && <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>}
          </div>

          {/* Divider + section heading */}
          <div className="border-t border-slate-100 pt-2">
            <h2 className="text-[15px] font-bold text-slate-900">Point of Contact</h2>
          </div>

          {/* Contact name + email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="contactName">Contact Name</label>
              <input
                id="contactName" name="contactName" type="text"
                placeholder="Full name"
                value={form.contactName} onChange={handleChange}
                className="field-input"
              />
            </div>
            <div>
              <label
                className={`field-label ${errors.contactEmail ? 'text-red-500' : ''}`}
                htmlFor="contactEmail"
              >
                Contact Email
              </label>
              <div className="relative">
                <input
                  id="contactEmail" name="contactEmail" type="email"
                  placeholder="you@example.com"
                  value={form.contactEmail} onChange={handleChange}
                  className={`field-input ${errors.contactEmail ? 'field-input-error pr-10' : ''}`}
                />
                {errors.contactEmail && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.contactEmail && (
                <p className="mt-1 text-[12px] text-red-500">{errors.contactEmail}</p>
              )}
            </div>
          </div>

          {/* Action buttons — Post New Job full-width blue, Cancel outline */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSubmit} disabled={submitting}
              className="btn-blue flex-1 py-3 text-[14px]"
            >
              {submitting ? 'Posting…' : (
                <>
                  Post New Job
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </>
              )}
            </button>
            <button onClick={handleCancel} className="btn-outline px-6 py-3 text-[14px]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
