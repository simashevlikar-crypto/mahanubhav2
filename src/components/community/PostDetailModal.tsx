/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle2,
  Flag,
  Send,
  Camera,
  Trash2,
  Check,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from 'lucide-react';
import {
  CommunityPost,
  CommunityAnswer,
  CommunityReply,
  CommunityUserProfile,
} from '../../types';
import {
  fetchPostAnswers,
  createAnswer,
  toggleLikeAnswer,
  markAcceptedAnswer,
  deleteAnswer,
  fetchAnswerReplies,
  createReply,
  uploadCommunityImage,
  toggleLikePost,
  toggleSavePost,
} from '../../lib/communityService';

interface PostDetailModalProps {
  post: CommunityPost;
  currentUser: CommunityUserProfile | null;
  onClose: () => void;
  onOpenUserProfile: (userId: string) => void;
  onRequestAuth: () => void;
  onReport: (postOrAnswer: any) => void;
  lang?: 'mr' | 'hi' | 'en';
}

export default function PostDetailModal({
  post,
  currentUser,
  onClose,
  onOpenUserProfile,
  onRequestAuth,
  onReport,
  lang = 'mr',
}: PostDetailModalProps) {
  const [answers, setAnswers] = useState<CommunityAnswer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerImages, setAnswerImages] = useState<File[]>([]);
  const [answerImagePreviews, setAnswerImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Post like & save states
  const [postLikes, setPostLikes] = useState(post.likesCount || 0);
  const [isLikedPost, setIsLikedPost] = useState(false);
  const [isSavedPost, setIsSavedPost] = useState(false);

  // Reply thread state
  const [activeReplyAnswerId, setActiveReplyAnswerId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [repliesMap, setRepliesMap] = useState<Record<string, CommunityReply[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});

  const isPostAuthor = currentUser?.uid === post.authorId;
  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'vishwajeet shevlikar' ||
    currentUser?.name.toLowerCase().includes('vishwajeet');

  // Load answers on mount
  useEffect(() => {
    loadAnswers();
  }, [post.id]);

  const loadAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const res = await fetchPostAnswers(post.id);
      setAnswers(res);
    } catch (err) {
      console.error('Error fetching answers:', err);
    } finally {
      setLoadingAnswers(false);
    }
  };

  const handleTogglePostLike = async () => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    const liked = await toggleLikePost(post.id, currentUser.uid);
    setIsLikedPost(liked);
    setPostLikes((prev) => (liked ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleTogglePostSave = async () => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    const saved = await toggleSavePost(post.id, currentUser.uid);
    setIsSavedPost(saved);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    setAnswerImages((prev) => [...prev, ...files]);
    const previews = files.map((file: File) => URL.createObjectURL(file));
    setAnswerImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveAnswerImage = (index: number) => {
    setAnswerImages((prev) => prev.filter((_, i) => i !== index));
    setAnswerImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    if (!newAnswerText.trim()) return;

    setSubmittingAnswer(true);
    try {
      const uploadedUrls: string[] = [];
      for (const img of answerImages) {
        const url = await uploadCommunityImage(img, `community/answers/${post.id}`);
        uploadedUrls.push(url);
      }

      await createAnswer(post.id, {
        authorId: currentUser.uid,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorPhoto: currentUser.photoURL,
        authorRole: currentUser.role,
        content: newAnswerText.trim(),
        imageUrls: uploadedUrls,
      });

      setNewAnswerText('');
      setAnswerImages([]);
      setAnswerImagePreviews([]);
      await loadAnswers();
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleToggleAnswerLike = async (answerId: string) => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    const liked = await toggleLikeAnswer(post.id, answerId, currentUser.uid);
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === answerId
          ? {
              ...ans,
              likesCount: liked ? ans.likesCount + 1 : Math.max(0, ans.likesCount - 1),
            }
          : ans
      )
    );
  };

  const handleAcceptAnswer = async (answer: CommunityAnswer) => {
    if (!isPostAuthor && !isAdmin) return;
    const newStatus = !answer.isAccepted;
    await markAcceptedAnswer(post.id, answer.id, newStatus);
    setAnswers((prev) =>
      prev.map((ans) => ({
        ...ans,
        isAccepted: ans.id === answer.id ? newStatus : false,
      }))
    );
  };

  const handleDeleteAnswer = async (answerId: string, authorId: string) => {
    if (!window.confirm('हे उत्तर हटवायचे आहे का?')) return;
    await deleteAnswer(post.id, answerId, authorId);
    setAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
  };

  const loadReplies = async (answerId: string) => {
    setLoadingReplies((prev) => ({ ...prev, [answerId]: true }));
    try {
      const reps = await fetchAnswerReplies(post.id, answerId);
      setRepliesMap((prev) => ({ ...prev, [answerId]: reps }));
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [answerId]: false }));
    }
  };

  const handleSendReply = async (answerId: string) => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    if (!replyText.trim()) return;

    try {
      await createReply(post.id, answerId, {
        authorId: currentUser.uid,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorPhoto: currentUser.photoURL,
        content: replyText.trim(),
      });
      setReplyText('');
      await loadReplies(answerId);
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-devanagari">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-3.5 sm:p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-amber-200 font-bold text-xs border border-white/30">
              {post.category}
            </span>
            <span className="text-xs font-semibold text-amber-100 hidden sm:inline">
              {post.type === 'question' ? 'प्रश्नोत्तर' : 'धर्मचर्चा'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Question / Post Header */}
          <div className="space-y-3 pb-4 border-b border-amber-100">
            <div className="flex items-center justify-between">
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
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-300"
                />
                <div>
                  <span className="font-extrabold text-sm text-gray-900 group-hover:text-amber-700 block">
                    {post.authorName}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{post.authorUsername || 'devotee'} • {new Date(post.createdAt).toLocaleDateString('mr-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePostLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isLikedPost
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-amber-50 border-gray-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLikedPost ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{postLikes}</span>
                </button>
                <button
                  type="button"
                  onClick={handleTogglePostSave}
                  className={`p-2 rounded-xl text-xs border ${
                    isSavedPost ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSavedPost ? 'fill-amber-600 text-amber-600' : ''}`} />
                </button>
              </div>
            </div>

            <h2 className="text-base sm:text-xl font-black text-gray-950 leading-snug">
              {post.title}
            </h2>

            <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Images */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {post.imageUrls.map((url, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-amber-200 bg-amber-50">
                    <img src={url} alt="Attachment" className="w-full h-auto object-cover max-h-[350px]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ANSWERS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm sm:text-base text-amber-950 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-600" />
                <span>उत्तरे व चर्चा ({answers.length})</span>
              </h3>
            </div>

            {loadingAnswers ? (
              <div className="py-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span>उत्तरे लोड होत आहेत...</span>
              </div>
            ) : answers.length === 0 ? (
              <div className="py-8 text-center bg-amber-50/50 rounded-2xl border border-amber-200/60 p-4">
                <p className="text-xs font-bold text-amber-900">अजून कोणतेही उत्तर आलेले नाही.</p>
                <p className="text-[11px] text-gray-500 mt-1">आपले ज्ञान किंवा विचार मांडून पहिले उत्तर द्या!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map((ans) => {
                  const isAnsOwner = currentUser?.uid === ans.authorId;
                  const isRepOpen = activeReplyAnswerId === ans.id;
                  const replies = repliesMap[ans.id] || [];

                  return (
                    <div
                      key={ans.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        ans.isAccepted
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                          : 'bg-white border-amber-200/80 shadow-2xs'
                      }`}
                    >
                      {/* Accepted Answer Ribbon */}
                      {ans.isAccepted && (
                        <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-black mb-2.5 pb-1.5 border-b border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          <span>✓ योग्य व स्वीकृत उत्तर (Accepted Answer)</span>
                        </div>
                      )}

                      {/* Author Header */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div
                          onClick={() => onOpenUserProfile(ans.authorId)}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <img
                            src={
                              ans.authorPhoto ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                ans.authorName
                              )}&backgroundColor=f59e0b`
                            }
                            alt={ans.authorName}
                            className="w-8 h-8 rounded-full object-cover border border-amber-300"
                          />
                          <div>
                            <span className="font-bold text-xs text-gray-900 group-hover:text-amber-700 block leading-tight">
                              {ans.authorName}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(ans.createdAt).toLocaleDateString('mr-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Actions for Answer Owner / Admin / Post Owner */}
                        <div className="flex items-center gap-1.5">
                          {(isPostAuthor || isAdmin) && (
                            <button
                              type="button"
                              onClick={() => handleAcceptAnswer(ans)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                ans.isAccepted
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border-gray-200'
                              }`}
                            >
                              {ans.isAccepted ? 'स्वीकृत' : 'योग्य उत्तर ठरवा'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onReport(ans)}
                            className="p-1 text-gray-400 hover:text-red-500"
                            title="तक्रार करा"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>

                          {(isAnsOwner || isAdmin) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAnswer(ans.id, ans.authorId)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="हटवा"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mb-3">
                        {ans.content}
                      </div>

                      {/* Answer Images */}
                      {ans.imageUrls && ans.imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {ans.imageUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="Attachment"
                              className="rounded-xl object-cover max-h-48 border border-amber-200"
                            />
                          ))}
                        </div>
                      )}

                      {/* Footer: Like & Reply Toggle */}
                      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleToggleAnswerLike(ans.id)}
                          className="flex items-center gap-1.5 font-bold hover:text-amber-700 cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                          <span>{ans.likesCount || 0} सहमत</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isRepOpen) {
                              setActiveReplyAnswerId(ans.id);
                              loadReplies(ans.id);
                            } else {
                              setActiveReplyAnswerId(null);
                            }
                          }}
                          className="flex items-center gap-1 font-bold text-amber-800 hover:underline cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>प्रत्युत्तर द्या ({ans.repliesCount || replies.length})</span>
                          {isRepOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* NESTED REPLIES */}
                      {isRepOpen && (
                        <div className="mt-3 pl-3 border-l-2 border-amber-300 space-y-2.5 pt-2 animate-fade-in">
                          {loadingReplies[ans.id] ? (
                            <div className="text-[11px] text-gray-500 py-1">प्रत्युत्तरे लोड होत आहेत...</div>
                          ) : (
                            replies.map((rep) => (
                              <div key={rep.id} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-gray-900">{rep.authorName}</span>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(rep.createdAt).toLocaleDateString('mr-IN')}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-xs">{rep.content}</p>
                              </div>
                            ))
                          )}

                          {/* Reply Input Box */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="आपले प्रत्युत्तर लिहा..."
                              className="flex-1 px-3 py-1.5 text-xs border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(ans.id);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSendReply(ans.id)}
                              disabled={!replyText.trim()}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs disabled:opacity-50"
                            >
                              पाठवा
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM FIXED ANSWER COMPOSER FORM */}
        <div className="p-3 sm:p-4 bg-amber-50/90 border-t-2 border-amber-200 shrink-0">
          <form onSubmit={handleSubmitAnswer} className="space-y-2">
            {answerImagePreviews.length > 0 && (
              <div className="flex items-center gap-2 pb-1">
                {answerImagePreviews.map((url, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-amber-300">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveAnswerImage(i)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2">
              <textarea
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="आपले उत्तर किंवा मत येथे लिहा..."
                rows={2}
                className="flex-1 p-2.5 text-xs sm:text-sm border-2 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 bg-white resize-none"
              />

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-800 transition-colors"
                  title="फोटो जोडा"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={submittingAnswer || !newAnswerText.trim()}
                  className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer border border-amber-300"
                  title="उत्तर पाठवा"
                >
                  {submittingAnswer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
