/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Pin,
  CheckCircle2,
  Flag,
  Trash2,
  Edit,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import { CommunityPost, CommunityUserProfile } from '../../types';

interface PostCardProps {
  key?: React.Key;
  post: CommunityPost;
  currentUser: CommunityUserProfile | null;
  onOpenDetail: (post: CommunityPost) => void;
  onOpenUserProfile: (userId: string) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onReport: (post: CommunityPost) => void;
  onDelete?: (postId: string) => void;
  onTogglePin?: (postId: string, currentPin: boolean) => void;
  isLiked?: boolean;
  isSaved?: boolean;
  lang?: 'mr' | 'hi' | 'en';
}

export default function PostCard({
  post,
  currentUser,
  onOpenDetail,
  onOpenUserProfile,
  onToggleLike,
  onToggleSave,
  onReport,
  onDelete,
  onTogglePin,
  isLiked = false,
  isSaved = false,
  lang = 'mr',
}: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isOwner = currentUser?.uid === post.authorId;
  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'vishwajeet shevlikar' ||
    currentUser?.name.toLowerCase().includes('vishwajeet');

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return lang === 'mr' ? 'आत्ताच' : 'Just now';
      if (mins < 60) return `${mins} ${lang === 'mr' ? 'मि. पूर्वी' : 'min ago'}`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} ${lang === 'mr' ? 'तासांपूर्वी' : 'hrs ago'}`;
      const days = Math.floor(hrs / 24);
      return `${days} ${lang === 'mr' ? 'दिवसांपूर्वी' : 'days ago'}`;
    } catch {
      return dateStr;
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: post.title,
      text: `${post.title}\n\nमहानुभाव विश्व समुदाय व प्रश्नोत्तरे`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${post.title}\n${window.location.href}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {}
    }
  };

  return (
    <article
      id={`community-post-${post.id}`}
      className={`bg-white rounded-3xl border ${
        post.isPinned ? 'border-amber-400 bg-amber-50/20 shadow-md' : 'border-amber-200/80 shadow-xs'
      } hover:shadow-md transition-all duration-200 p-4 sm:p-5 relative font-devanagari`}
    >
      {/* Pinned Badge */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-black mb-2 pb-1.5 border-b border-amber-200">
          <Pin className="w-3.5 h-3.5 fill-amber-600 text-amber-600 rotate-45" />
          <span>पिन केलेले महत्त्वाचे सूत्र (Pinned Post)</span>
        </div>
      )}

      {/* 1. HEADER: Author Profile, Category & More Options */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          onClick={() => onOpenUserProfile(post.authorId)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            src={
              post.authorPhoto ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                post.authorName
              )}&backgroundColor=f59e0b`
            }
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-300 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-amber-700 transition-colors">
                {post.authorName}
              </span>
              {(post.authorRole === 'admin' || post.authorRole === 'vishwajeet shevlikar') && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                  <Crown className="w-2.5 h-2.5 text-amber-600" />
                  {post.authorRole === 'vishwajeet shevlikar' ? 'संपादक' : 'अ‍ॅडमिन'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              {post.authorUsername && <span>@{post.authorUsername}</span>}
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Category Badge & More Menu */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[10px] sm:text-[11px] font-bold">
            {post.category}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-7 z-20 w-44 bg-white rounded-2xl shadow-xl border border-amber-200 py-1.5 text-xs animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    onOpenDetail(post);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-gray-700 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>सविस्तर उघडा</span>
                </button>

                <button
                  onClick={(e) => {
                    handleShare(e);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-gray-700"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>लिंक शेअर करा</span>
                </button>

                {isAdmin && onTogglePin && (
                  <button
                    onClick={() => {
                      onTogglePin(post.id, !!post.isPinned);
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-amber-800 font-bold"
                  >
                    <Pin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{post.isPinned ? 'अनपिन करा' : 'पिन करा'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onReport(post);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <Flag className="w-3.5 h-3.5 text-red-500" />
                  <span>तक्रार नोंदवा (Report)</span>
                </button>

                {(isOwner || isAdmin) && onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('ही पोस्ट हटवायची आहे का?')) {
                        onDelete(post.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-700 font-bold border-t border-gray-100"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>पोस्ट हटवा (Delete)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. BODY: Title & Content */}
      <div onClick={() => onOpenDetail(post)} className="cursor-pointer space-y-2 mb-3">
        <h3 className="font-extrabold text-sm sm:text-base text-gray-900 hover:text-amber-800 leading-snug">
          {post.title}
        </h3>

        <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
          {isExpanded || post.content.length <= 220
            ? post.content
            : `${post.content.slice(0, 220)}...`}
        </p>

        {post.content.length > 220 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-[11px] font-extrabold text-amber-700 hover:underline"
          >
            {isExpanded ? 'कमी दाखवा' : '...अधिक वाचा'}
          </button>
        )}
      </div>

      {/* 3. IMAGES GALLERY */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div
          onClick={() => onOpenDetail(post)}
          className={`grid gap-2 rounded-2xl overflow-hidden mb-3 cursor-pointer ${
            post.imageUrls.length === 1
              ? 'grid-cols-1 max-h-[360px]'
              : post.imageUrls.length === 2
              ? 'grid-cols-2 max-h-[260px]'
              : 'grid-cols-3 max-h-[220px]'
          }`}
        >
          {post.imageUrls.map((url, idx) => (
            <div key={idx} className="relative overflow-hidden bg-amber-50 rounded-xl group aspect-video sm:aspect-auto">
              <img
                src={url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* 4. FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs text-gray-600">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(post.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              isLiked
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'hover:bg-amber-50 text-gray-600 hover:text-amber-700'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span>{post.likesCount || 0}</span>
            <span className="hidden sm:inline">{lang === 'mr' ? 'सहमत' : 'Like'}</span>
          </button>

          {/* Answers / Comments Button */}
          <button
            type="button"
            onClick={() => onOpenDetail(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-amber-600" />
            <span>{post.answersCount || 0}</span>
            <span>{post.type === 'question' ? 'उत्तरे' : 'चर्चा'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(post.id);
            }}
            title="जतन करा"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-100 text-amber-800'
                : 'hover:bg-amber-50 text-gray-500 hover:text-amber-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            title="शेअर करा"
            className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-amber-50 text-gray-500 hover:text-amber-700 transition-all cursor-pointer font-bold text-xs"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">शेअर</span>
          </button>
        </div>
      </div>

      {copiedLink && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          लिंक कॉपी केली!
        </div>
      )}
    </article>
  );
}
