/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  HelpCircle,
  Sparkles,
  Search,
  Plus,
  Flame,
  Clock,
  Image as ImageIcon,
  Bookmark,
  Bell,
  User as UserIcon,
  Filter,
  RefreshCw,
  Send,
  AlertCircle,
  Share2,
  LogIn,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  CommunityPost,
  CommunityUserProfile,
  CommunityMessage,
  CommunityCategory,
} from '../types';
import {
  fetchCommunityPosts,
  getUserProfile,
  toggleLikePost,
  toggleSavePost,
  fetchUserSavedPostIds,
  pinCommunityPost,
  deleteCommunityPost,
} from '../lib/communityService';
import PostCard from './community/PostCard';
import PostDetailModal from './community/PostDetailModal';
import AskQuestionModal from './community/AskQuestionModal';
import UserProfileModal from './community/UserProfileModal';
import CommunityAuthModal from './community/CommunityAuthModal';
import ReportModal from './community/ReportModal';
import CommunityNotificationsModal from './community/CommunityNotificationsModal';

interface CommunityDiscussionProps {
  messages?: CommunityMessage[];
  onSendMessage?: (messageText: string, userName: string, userRole: 'user' | 'vishwajeet shevlikar') => void;
  onSendReply?: (msgId: string, replyText: string, userName: string, userRole: 'user' | 'vishwajeet shevlikar') => void;
  onLikeMessage?: (msgId: string) => void;
  lang?: 'hi' | 'mr' | 'en';
}

const CATEGORIES: string[] = [
  'सर्व',
  '📖 लीळा व ग्रंथ',
  '🙏 धर्म व तत्त्वज्ञान',
  '🛕 स्थान / देवस्थान',
  '🎵 भजन / आरती',
  '📅 कार्यक्रम',
  '📷 फोटो',
  '💬 सामान्य चर्चा',
  '❓ इतर',
];

export default function CommunityDiscussion({
  messages = [],
  onSendMessage,
  onSendReply,
  onLikeMessage,
  lang = 'mr',
}: CommunityDiscussionProps) {
  // Navigation Sub-tabs
  const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'questions' | 'discussions' | 'photos' | 'saved' | 'ai'>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('सर्व');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data States
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  // User Authentication & Profile
  const [currentUser, setCurrentUser] = useState<CommunityUserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [askModalDefaultType, setAskModalDefaultType] = useState<'question' | 'discussion' | 'information'>('question');
  const [selectedPostDetail, setSelectedPostDetail] = useState<CommunityPost | null>(null);
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<any | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(1);

  // AI Chakradhar Assistant States (Preserved & Enhanced)
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text:
        lang === 'mr'
          ? 'दंडवत प्रणाम! मी सर्वज्ञ श्रीचक्रधर स्वामींच्या उपदेशांवर, सूत्रपाठावर आणि लीळाचरित्राच्या सखोल ज्ञानावर आधारित आध्यात्मिक AI सहाय्यक आहे.\n\nतुम्ही मला लीळांचे रहस्य, दृष्टांतांचे अर्थ किंवा साधनेशी संबंधित कोणताही प्रश्न विचारू शकता.'
          : 'दंडवत प्रणाम! मैं सर्वज्ञ श्रीचक्रधर स्वामी जी के उपदेशों एवं लीळाचरित्र पर आधारित आध्यात्मिक AI सहायक हूँ। आप मुझसे कोई भी जिज्ञासा पूछ सकते हैं।',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiEndRef = useRef<HTMLDivElement | null>(null);

  // Monitor Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setCurrentUser(profile);
          const saved = await fetchUserSavedPostIds(user.uid);
          setSavedPostIds(saved);
        } else {
          // Auto create default profile if newly signed in
          const defaultProf: CommunityUserProfile = {
            uid: user.uid,
            name: user.displayName || 'साधक भक्त',
            username: (user.displayName || 'sadhak').toLowerCase().replace(/\s+/g, '_'),
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=sadhak&backgroundColor=f59e0b`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            answersCount: 0,
            role: 'user',
          };
          setCurrentUser(defaultProf);
        }
      } else {
        // Guest mode fallback
        try {
          const cached = localStorage.getItem('mahanubhav_guest_user');
          if (cached) {
            setCurrentUser(JSON.parse(cached));
          }
        } catch {}
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Community Posts on filter change
  useEffect(() => {
    if (activeTab !== 'ai') {
      loadPosts();
    }
  }, [activeTab, selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      let typeParam: string | undefined = undefined;
      if (activeTab === 'questions') typeParam = 'question';
      if (activeTab === 'discussions') typeParam = 'discussion';
      if (activeTab === 'photos') typeParam = 'photo';

      const sortBy = activeTab === 'popular' ? 'popular' : 'latest';
      const categoryParam = selectedCategory !== 'सर्व' ? selectedCategory : undefined;

      const res = await fetchCommunityPosts({
        type: typeParam,
        sortBy,
        category: categoryParam,
        limitCount: 30,
      });

      setPosts(res.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const isCurrentlyLiked = likedPostIds.has(postId);
    const updatedLikedSet = new Set(likedPostIds);
    if (isCurrentlyLiked) {
      updatedLikedSet.delete(postId);
    } else {
      updatedLikedSet.add(postId);
    }
    setLikedPostIds(updatedLikedSet);

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likesCount: isCurrentlyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
            }
          : p
      )
    );

    await toggleLikePost(postId, currentUser.uid);
  };

  const handleToggleSave = async (postId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const isCurrentlySaved = savedPostIds.includes(postId);
    const updatedSaved = isCurrentlySaved
      ? savedPostIds.filter((id) => id !== postId)
      : [...savedPostIds, postId];
    setSavedPostIds(updatedSaved);

    await toggleSavePost(postId, currentUser.uid);
  };

  const handleTogglePin = async (postId: string, currentPin: boolean) => {
    await pinCommunityPost(postId, !currentPin);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isPinned: !currentPin } : p))
    );
  };

  const handleDeletePost = async (postId: string) => {
    await deleteCommunityPost(postId, currentUser?.uid);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // AI Chat submission handler
  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim() || isAiLoading) return;

    const userText = aiMessage.trim();
    setAiMessage('');
    setAiChat((prev) => [...prev, { role: 'user', text: userText }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/spiritual-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          chatHistory: aiChat,
        }),
      });

      const data = await res.json();
      setAiChat((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      setAiChat((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'दंडवत प्रणाम! क्षमस्व, सध्या तांत्रिक कारणास्तव उत्तर मिळण्यात अडचण येत आहे. कृपया थोड्या वेळाने प्रयत्न करा.',
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered posts based on search query and saved tab
  const displayedPosts = posts.filter((p) => {
    if (activeTab === 'saved') {
      if (!savedPostIds.includes(p.id)) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.authorName && p.authorName.toLowerCase().includes(q))
    );
  });

  return (
    <div id="community-main-container" className="space-y-4 font-devanagari animate-fade-in">
      {/* 1. TOP HERO HEADER & SEARCH BAR */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-4 sm:p-6 text-white shadow-xl border-2 border-amber-300 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-extrabold text-xs border border-white/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>महानुभाव विश्व धर्मचर्चा</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight">
              महानुभाव समुदाय (Community)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
              प्रश्न विचारा, उत्तरे द्या, ज्ञान शेअर करा आणि साधकांशी संवाद साधा
            </p>
          </div>

          {/* User Status Badge / Join CTA & Notifications */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition-all cursor-pointer"
                  title="सूचना"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUserIdForProfile(currentUser.uid)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition-all cursor-pointer"
                >
                  <img
                    src={
                      currentUser.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        currentUser.name
                      )}&backgroundColor=f59e0b`
                    }
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-200"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="font-bold text-xs block leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-amber-200 block">माझी प्रोफाइल</span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-amber-900 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-amber-50 transition-all cursor-pointer border border-amber-200"
              >
                <LogIn className="w-4 h-4 text-amber-600" />
                <span>समुदायात सहभागी व्हा</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="प्रश्न, उत्तर, लीळा किंवा विषय शोधा..."
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                रद्द
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTION BUTTONS ROW (Ask Question & Share Info) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setAskModalDefaultType('question');
              setIsAskModalOpen(true);
            }
          }}
          className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer border border-amber-300 active:scale-95"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
          <span>❓ प्रश्न विचारा (Ask Question)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setAskModalDefaultType('discussion');
              setIsAskModalOpen(true);
            }
          }}
          className="p-3 sm:p-4 rounded-2xl bg-white hover:bg-amber-50/60 text-amber-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer border-2 border-amber-300 active:scale-95"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          <span>💬 माहिती / चर्चा शेअर करा</span>
        </button>
      </div>

      {/* 3. CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-amber-50 border-amber-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. NAVIGATION TABS (Popular, Latest, Questions, Discussions, Photos, Saved, AI Assistant) */}
      <div className="bg-white rounded-2xl border border-amber-200 p-1.5 flex items-center gap-1 overflow-x-auto shadow-xs">
        {[
          { id: 'latest', label: '🆕 नवीनतम', icon: Clock },
          { id: 'popular', label: '🔥 लोकप्रिय', icon: Flame },
          { id: 'questions', label: '❓ प्रश्न', icon: HelpCircle },
          { id: 'discussions', label: '💬 चर्चा', icon: MessageSquare },
          { id: 'photos', label: '📷 फोटो', icon: ImageIcon },
          { id: 'saved', label: '🔖 जतन केलेले', icon: Bookmark },
          { id: 'ai', label: '🧠 AI संवाद', icon: Sparkles },
        ].map((tab) => {
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. MAIN CONTENT AREA */}
      {activeTab === 'ai' ? (
        /* PRESERVED & ENHANCED AI CHAKRADHAR SPIRITUAL ASSISTANT */
        <div className="bg-white rounded-3xl border-2 border-amber-300 overflow-hidden shadow-lg flex flex-col min-h-[500px]">
          <div className="bg-amber-50/80 p-3.5 sm:p-4 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                श्री
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-amber-950">
                  श्रीचक्रधर स्वामी ज्ञान AI सहाय्यक
                </h3>
                <p className="text-[10px] text-gray-500">
                  लीळाचरित्र, सूत्रपाठ व दृष्टांतपाठ ग्रंथाधारित मार्गदर्शन
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[10px]">
              AI मार्गदर्शक
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[420px]">
            {aiChat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[88%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                    msg.role === 'user' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {msg.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : 'श्री'}
                </div>
                <div
                  className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-none shadow-sm font-semibold'
                      : 'bg-amber-50/60 text-gray-800 border border-amber-200 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex gap-2.5 max-w-[88%]">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                  श्री
                </div>
                <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-2xl rounded-tl-none text-xs text-amber-900 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>स्वामींच्या वचनांचे चिंतन सुरू आहे...</span>
                </div>
              </div>
            )}
            <div ref={aiEndRef} />
          </div>

          <form onSubmit={handleAiSubmit} className="p-3 bg-white border-t border-amber-200 flex gap-2">
            <input
              type="text"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="लीळाचरित्र किंवा साधनेविषयी कोणताही प्रश्न विचारा..."
              disabled={isAiLoading}
              className="flex-1 px-4 py-2 text-xs sm:text-sm border-2 border-amber-200 rounded-2xl focus:outline-none focus:border-amber-500 bg-amber-50/20"
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiMessage.trim()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>विचारा</span>
            </button>
          </form>
        </div>
      ) : (
        /* POSTS STREAM */
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="py-16 text-center text-gray-500 text-xs flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-amber-200 p-6">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              <span className="font-bold text-amber-950">समुदाय चर्चा लोड होत आहे...</span>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-amber-200 p-6 space-y-3">
              <MessageSquare className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="font-extrabold text-sm sm:text-base text-gray-800">
                {activeTab === 'saved'
                  ? 'आपण कोणतीही पोस्ट जतन केलेली नाही.'
                  : 'या श्रेणीमध्ये कोणतीही पोस्ट आढळली नाही.'}
              </h4>
              <p className="text-xs text-gray-500">
                आपला प्रश्न विचारा किंवा नवीन चर्चा सुरू करा!
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setIsAskModalOpen(true);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-amber-700 transition-all cursor-pointer shadow-sm"
              >
                पहिला प्रश्न विचारा
              </button>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                isLiked={likedPostIds.has(post.id)}
                isSaved={savedPostIds.includes(post.id)}
                onOpenDetail={(p) => setSelectedPostDetail(p)}
                onOpenUserProfile={(uid) => setSelectedUserIdForProfile(uid)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onTogglePin={handleTogglePin}
                onDelete={handleDeletePost}
                onReport={(p) =>
                  setReportTarget({
                    type: 'post',
                    id: p.id,
                    title: p.title,
                  })
                }
                lang={lang}
              />
            ))
          )}
        </div>
      )}

      {/* 6. MODALS */}

      {/* Auth / Register Modal */}
      <CommunityAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(profile) => {
          setCurrentUser(profile);
          try {
            localStorage.setItem('mahanubhav_guest_user', JSON.stringify(profile));
          } catch {}
        }}
        lang={lang}
      />

      {/* Ask Question / Create Post Modal */}
      {currentUser && (
        <AskQuestionModal
          isOpen={isAskModalOpen}
          onClose={() => setIsAskModalOpen(false)}
          currentUser={currentUser}
          defaultType={askModalDefaultType}
          onPostCreated={async (newId) => {
            await loadPosts();
          }}
          lang={lang}
        />
      )}

      {/* Post Detail Modal with Answers Thread */}
      {selectedPostDetail && (
        <PostDetailModal
          post={selectedPostDetail}
          currentUser={currentUser}
          onClose={() => setSelectedPostDetail(null)}
          onOpenUserProfile={(uid) => setSelectedUserIdForProfile(uid)}
          onRequestAuth={() => setIsAuthModalOpen(true)}
          onReport={(targetObj) =>
            setReportTarget({
              type: targetObj.postId ? 'answer' : 'post',
              id: targetObj.id,
              postId: targetObj.postId || selectedPostDetail.id,
            })
          }
          lang={lang}
        />
      )}

      {/* User Profile Modal */}
      {selectedUserIdForProfile && (
        <UserProfileModal
          userId={selectedUserIdForProfile}
          currentUser={currentUser}
          onClose={() => setSelectedUserIdForProfile(null)}
          onPostClick={(p) => setSelectedPostDetail(p)}
          onRequestAuth={() => setIsAuthModalOpen(true)}
          lang={lang}
        />
      )}

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          target={reportTarget}
          currentUser={currentUser}
          onRequestAuth={() => setIsAuthModalOpen(true)}
          lang={lang}
        />
      )}

      {/* Community Notifications Modal */}
      {currentUser && (
        <CommunityNotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => {
            setIsNotificationsOpen(false);
            setUnreadNotifsCount(0);
          }}
          userId={currentUser.uid}
          onOpenPost={(postId) => {
            const found = posts.find((p) => p.id === postId);
            if (found) setSelectedPostDetail(found);
          }}
          onOpenUserProfile={(uid) => setSelectedUserIdForProfile(uid)}
          lang={lang}
        />
      )}
    </div>
  );
}
