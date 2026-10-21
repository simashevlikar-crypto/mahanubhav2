/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { CommunityUserProfile } from '../../types';
import { createReport } from '../../lib/communityService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    type: 'post' | 'answer' | 'reply' | 'user';
    id: string;
    postId?: string;
    title?: string;
  } | null;
  currentUser: CommunityUserProfile | null;
  onRequestAuth: () => void;
  lang?: 'mr' | 'hi' | 'en';
}

const REPORT_REASONS = [
  'अयोग्य मजकूर / अपमानास्पद भाषा',
  'चुकीची किंवा दिशाभूल करणारी माहिती',
  'स्पॅम किंवा अनपेक्षित जाहिरात',
  'अनुचित किंवा आक्षेपार्ह फोटो',
  'धार्मिक भावना दुखावणारी सामग्री',
  'इतर कारण',
];

export default function ReportModal({
  isOpen,
  onClose,
  target,
  currentUser,
  onRequestAuth,
  lang = 'mr',
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequestAuth();
      return;
    }

    setSubmitting(true);
    try {
      await createReport({
        reporterId: currentUser.uid,
        reporterName: currentUser.name,
        targetType: target.type,
        targetId: target.id,
        postId: target.postId,
        reason: selectedReason,
        description: description.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error reporting:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-devanagari">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-red-300 overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            <h3 className="font-extrabold text-sm sm:text-base">तक्रार नोंदवा (Report Content)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {success ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-gray-900">आपली तक्रार नोंदवली गेली आहे.</h4>
              <p className="text-xs text-gray-500">
                आमचे प्रशासक (Admin) या सामग्रीचे त्वरित पुनरावलोकन करतील.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2.5 text-xs text-red-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>
                  महानुभाव समुदायाचे पावित्र्य राखण्यासाठी कृपया योग्य कारण निवडून तक्रार करा.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  तक्रारीचे मुख्य कारण निवडा *
                </label>
                <div className="space-y-1.5">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedReason === reason
                          ? 'border-red-500 bg-red-50/50 font-bold text-red-900'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  अधिक सविस्तर माहिती (ऐच्छिक)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="तक्रारीबद्दल अतिरिक्त माहिती येथे लिहा..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>नोंदवत आहे...</span>
                    </>
                  ) : (
                    <span>तक्रार पाठवा</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
