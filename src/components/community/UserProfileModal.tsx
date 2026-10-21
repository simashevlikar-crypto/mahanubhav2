/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  Edit,
  Camera,
  MessageSquare,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Crown,
  Loader2,
} from 'lucide-react';
import {
  CommunityUserProfile,
  CommunityPost,
} from '../../types';
import {
  getUserProfile,
  saveUserProfile,
  toggleFollowUser,
  checkIfFollowing,
  fetchCommunityPosts,
  uploadCommunityImage,
} from '../../lib/communityService';

interface UserProfileModalProps {
  userId: string;
  currentUser: CommunityUserProfile | null;
  onClose: () => void;
  onPostClick: (post: CommunityPost) => void;
  onRequestAuth: () => void;
  lang?: 'mr' | 'hi' | 'en';
}

export default function UserProfileModal({
  userId,
  currentUser,
  onClose,
  onPostClick,
  onRequestAuth,
  lang = 'mr',
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<CommunityUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'questions' | 'photos'>('posts');
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSelf = currentUser?.uid === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const p = await getUserProfile(userId);
      if (p) {
        setProfile(p);
        setEditName(p.name);
        setEditBio(p.bio || '');
        setEditPhotoURL(p.photoURL || '');
      } else {
        // Fallback placeholder profile
        const mock: CommunityUserProfile = {
          uid: userId,
          name: 'साधक भक्त',
          username: 'sadhak',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          followersCount: 12,
          followingCount: 5,
          postsCount: 3,
          answersCount: 7,
          role: 'user',
        };
        setProfile(mock);
      }

      if (currentUser && !isSelf) {
        const following = await checkIfFollowing(currentUser.uid, userId);
        setIsFollowing(following);
      }

      // Load user posts
      const postsRes = await fetchCommunityPosts({ userId });
      setUserPosts(postsRes.posts);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    const followed = await toggleFollowUser(currentUser.uid, userId);
    setIsFollowing(followed);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            followersCount: followed ? prev.followersCount + 1 : Math.max(0, prev.followersCount - 1),
          }
        : null
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadCommunityImage(file, 'community/avatars');
      setEditPhotoURL(url);
    } catch {
      const reader = new FileReader();
      reader.onload = () => setEditPhotoURL(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingEdit(true);
    try {
      const updated: CommunityUserProfile = {
        ...profile,
        name: editName.trim() || profile.name,
        bio: editBio.trim(),
        photoURL: editPhotoURL || profile.photoURL,
        updatedAt: new Date().toISOString(),
      };
      await saveUserProfile(updated);
      setProfile(updated);
      setIsEditing(false);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-devanagari">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-sm sm:text-base">
            {isSelf ? 'माझी प्रोफाइल (My Profile)' : 'साधक प्रोफाइल'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {loading ? (
            <div className="py-12 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>माहिती लोड होत आहे...</span>
            </div>
          ) : profile ? (
            <>
              {/* Profile Card Header */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <img
                        src={
                          editPhotoURL ||
                          profile.photoURL ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            editName
                          )}&backgroundColor=f59e0b`
                        }
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-amber-300 shadow-md"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Camera className="w-5 h-5" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <span className="text-[11px] text-amber-700 font-bold">फोटो बदला</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">नाव</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-amber-200 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">परिचय (Bio)</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs border border-amber-200 rounded-xl resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                    >
                      रद्द करा
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      {savingEdit ? 'जतन करत आहे...' : 'सहेजें (Save)'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          profile.photoURL ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            profile.name
                          )}&backgroundColor=f59e0b`
                        }
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-base text-gray-900 leading-tight">
                            {profile.name}
                          </h4>
                          {(profile.role === 'admin' || profile.role === 'vishwajeet shevlikar') && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                              <Crown className="w-2.5 h-2.5 inline text-amber-600 mr-0.5" />
                              {profile.role === 'vishwajeet shevlikar' ? 'संपादक' : 'अ‍ॅडमिन'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 block">@{profile.username}</span>
                        {profile.bio && (
                          <p className="text-xs text-gray-700 mt-1 leading-relaxed">{profile.bio}</p>
                        )}
                      </div>
                    </div>

                    {isSelf ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>संपादित करा</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
                          isFollowing
                            ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-700'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md border border-amber-300'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>फॉलो करत आहात</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>फॉलो करा</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* STATS COUNTER BAR */}
                  <div className="grid grid-cols-4 gap-2 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-center">
                    <div>
                      <span className="text-sm font-black text-amber-950 block">
                        {userPosts.filter((p) => p.type === 'question').length || profile.postsCount || 0}
                      </span>
                      <span className="text-[10px] text-gray-600 font-bold">प्रश्न</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-amber-950 block">
                        {profile.answersCount || 0}
                      </span>
                      <span className="text-[10px] text-gray-600 font-bold">उत्तरे</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-amber-950 block">
                        {profile.followersCount || 0}
                      </span>
                      <span className="text-[10px] text-gray-600 font-bold">फॉलोअर्स</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-amber-950 block">
                        {profile.followingCount || 0}
                      </span>
                      <span className="text-[10px] text-gray-600 font-bold">फॉलोइंग</span>
                    </div>
                  </div>
                </div>
              )}

              {/* POSTS TABS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
                  {[
                    { id: 'posts', label: 'सर्व पोस्ट', icon: FileText },
                    { id: 'questions', label: 'विचारलेले प्रश्न', icon: HelpCircle },
                    { id: 'photos', label: 'फोटो दर्शन', icon: ImageIcon },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === t.id
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content List */}
                <div className="space-y-2">
                  {userPosts.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 text-xs bg-amber-50/30 rounded-2xl">
                      कोणतीही पोस्ट आढळली नाही.
                    </div>
                  ) : (
                    userPosts
                      .filter((p) => {
                        if (activeTab === 'questions') return p.type === 'question';
                        if (activeTab === 'photos') return p.imageUrls && p.imageUrls.length > 0;
                        return true;
                      })
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onPostClick(p);
                            onClose();
                          }}
                          className="p-3 rounded-2xl border border-amber-200 bg-white hover:bg-amber-50/50 cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-bold">
                              {p.category}
                            </span>
                            <span>{new Date(p.createdAt).toLocaleDateString('mr-IN')}</span>
                          </div>
                          <h5 className="font-extrabold text-xs text-gray-900 line-clamp-1">
                            {p.title}
                          </h5>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1">
                            <span>👍 {p.likesCount || 0} सहमत</span>
                            <span>💬 {p.answersCount || 0} उत्तरे</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
