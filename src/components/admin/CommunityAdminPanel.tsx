/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flag,
  Trash2,
  CheckCircle,
  XCircle,
  Pin,
  UserX,
  UserCheck,
  Search,
  MessageSquare,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { CommunityReport, CommunityPost, CommunityUserProfile } from '../../types';
import {
  fetchReports,
  updateReportStatus,
  deleteCommunityPost,
  pinCommunityPost,
  fetchCommunityPosts,
  setUserBlockStatus,
} from '../../lib/communityService';

interface CommunityAdminPanelProps {
  lang?: 'mr' | 'hi' | 'en';
}

export default function CommunityAdminPanel({ lang = 'mr' }: CommunityAdminPanelProps) {
  const [subTab, setSubTab] = useState<'reports' | 'posts' | 'users'>('reports');
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [searchPost, setSearchPost] = useState('');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [subTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (subTab === 'reports') {
        const r = await fetchReports();
        setReports(r);
      } else if (subTab === 'posts') {
        const p = await fetchCommunityPosts({ limitCount: 50 });
        setPosts(p.posts);
      }
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    await updateReportStatus(reportId, status);
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    showMsg(status === 'resolved' ? 'तक्रार निकाली काढली.' : 'तक्रार फेटाळली.');
  };

  const handleDeleteReportedPost = async (reportId: string, postId: string) => {
    if (!window.confirm('ही पोस्ट हटवायची आहे का?')) return;
    await deleteCommunityPost(postId);
    await updateReportStatus(reportId, 'resolved');
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    showMsg('पोस्ट हटवली आणि तक्रार निकाली काढली.');
  };

  const handleTogglePinPost = async (postId: string, currentPin: boolean) => {
    await pinCommunityPost(postId, !currentPin);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isPinned: !currentPin } : p))
    );
    showMsg(!currentPin ? 'पोस्ट पिन केली!' : 'पोस्ट अनपिन केली!');
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('ही पोस्ट कायमस्वरूपी हटवायची आहे का?')) return;
    await deleteCommunityPost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showMsg('पोस्ट यशस्वीरित्या हटवली!');
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const filteredPosts = posts.filter((p) => {
    if (!searchPost.trim()) return true;
    return (
      p.title.toLowerCase().includes(searchPost.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchPost.toLowerCase())
    );
  });

  return (
    <div className="space-y-4 font-devanagari">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>समुदाय व्यवस्थापन व मॉडरेशन (Community Moderation)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            वापरकर्त्यांच्या तक्रारींचे निवारण करा, पोस्ट व्यवस्थापित करा आणि नियमांचे पालन सुनिश्चित करा.
          </p>
        </div>

        {actionMsg && (
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
              actionMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-red-50 text-red-800 border-red-300'
            }`}
          >
            {actionMsg.text}
          </div>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSubTab('reports')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'reports'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>तक्रारी (Reports) ({reports.filter((r) => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setSubTab('posts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'posts'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>सर्व समुदाय पोस्ट ({posts.length})</span>
        </button>
      </div>

      {/* 1. REPORTS TAB */}
      {subTab === 'reports' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">स्थिती:</span>
            {['all', 'pending', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  statusFilter === st
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {st === 'all' ? 'सर्व' : st === 'pending' ? 'प्रलंबित (Pending)' : 'निकाली काढलेल्या'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500 text-xs">लोड होत आहे...</div>
          ) : filteredReports.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-xs bg-amber-50/40 rounded-2xl border border-amber-200">
              कोणतीही तक्रार आढळली नाही.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-2xl border border-amber-200 bg-white shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold">
                      {rep.reason}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(rep.createdAt).toLocaleString('mr-IN')}
                    </span>
                  </div>

                  <div className="text-xs text-gray-800">
                    <span className="font-bold">तक्रारदार:</span> {rep.reporterName || 'अनामिक'}{' '}
                    • <span className="font-bold">लक्ष्य प्रकार:</span> {rep.targetType} (ID: {rep.targetId})
                  </div>

                  {rep.description && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg italic">
                      "{rep.description}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    {rep.targetType === 'post' && rep.targetId && (
                      <button
                        onClick={() => handleDeleteReportedPost(rep.id, rep.targetId)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>पोस्ट हटवा</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>निकाली काढा (Resolve)</span>
                    </button>

                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold"
                    >
                      फेटाळा (Dismiss)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. POSTS MANAGEMENT TAB */}
      {subTab === 'posts' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchPost}
              onChange={(e) => setSearchPost(e.target.value)}
              placeholder="पोस्टचे नाव किंवा लेखकाचे नाव शोधा..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-amber-200 rounded-xl bg-white"
            />
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500 text-xs">पोस्ट लोड होत आहेत...</div>
          ) : (
            <div className="space-y-2">
              {filteredPosts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-amber-200 bg-white hover:bg-amber-50/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {p.isPinned && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                          पिन केलेले
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px]">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(p.createdAt).toLocaleDateString('mr-IN')}
                      </span>
                    </div>
                    <h5 className="font-bold text-gray-900 truncate">{p.title}</h5>
                    <span className="text-[11px] text-gray-500 block truncate">
                      लेखक: {p.authorName} • 👍 {p.likesCount || 0} • 💬 {p.answersCount || 0} उत्तरे
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePinPost(p.id, !!p.isPinned)}
                      className={`p-1.5 rounded-lg border text-xs font-bold ${
                        p.isPinned
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-gray-50 text-gray-600 hover:bg-amber-50'
                      }`}
                      title={p.isPinned ? 'अनपिन करा' : 'पिन करा'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeletePost(p.id)}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                      title="पोस्ट हटवा"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
