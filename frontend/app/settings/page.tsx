'use client';

import { useState } from 'react';
import { Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newJobs: true,
    statusUpdates: true,
    comments: false,
    digest: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Manage your account preferences and notifications.
        </p>
      </div>

      <div className="space-y-4">
        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Bell size={15} className="text-[#2353E8]" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'newJobs',       label: 'New job postings',         desc: 'Get notified when new jobs are posted in your area' },
              { key: 'statusUpdates', label: 'Status updates',           desc: 'Receive updates when job statuses change' },
              { key: 'comments',      label: 'Comments & messages',      desc: 'Be notified of new comments on your jobs' },
              { key: 'digest',        label: 'Weekly digest',            desc: 'Receive a weekly summary of activity' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{label}</p>
                  <p className="text-[12px] text-slate-400">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications] ? 'bg-[#2353E8]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Palette size={15} className="text-purple-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Appearance</h2>
          </div>
          <div className="flex gap-3">
            {['Light', 'Dark', 'System'].map((mode) => (
              <button
                key={mode}
                className={`flex-1 rounded-lg border py-3 text-[13px] font-semibold transition-all ${
                  mode === 'Light'
                    ? 'border-[#2353E8] bg-blue-50 text-[#2353E8]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <Shield size={15} className="text-green-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Privacy & Security</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left rounded-lg border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Change Password
            </button>
            <button className="w-full text-left rounded-lg border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Two-Factor Authentication
            </button>
            <button className="w-full text-left rounded-lg border border-red-200 px-4 py-3 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>

        {/* Region */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Globe size={15} className="text-amber-500" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900">Region & Language</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Language</label>
              <select className="field-input">
                <option>English (US)</option>
                <option>English (UK)</option>
              </select>
            </div>
            <div>
              <label className="field-label">Timezone</label>
              <select className="field-input">
                <option>UTC-5 (Eastern)</option>
                <option>UTC-8 (Pacific)</option>
                <option>UTC+0 (London)</option>
                <option>UTC+5:30 (Colombo)</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-blue w-full py-3">
          <Save size={15} /> Save Changes
        </button>
      </div>
    </div>
  );
}
