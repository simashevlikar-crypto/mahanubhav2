/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Send,
  HelpCircle,
  MessageSquare,
  FileText,
  Camera,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react';
import {
  CommunityPostType,
  CommunityCategory,
  CommunityUserProfile,
} from '../../types';
import { createCommunityPost, uploadCommunityImage } from '../../lib/communityService';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CommunityUserProfile;
  onPostCreated: (postId: string) => void;
  defaultType?: CommunityPostType;
  lang?: 'mr' | 'hi' | 'en';
}

const CATEGORIES: CommunityCategory[] = [
  '📖 लीळा व ग्रंथ',
  '🙏 धर्म व तत्त्वज्ञान',
  '🛕 स्थान / देवस्थान',
  '🎵 भजन / आरती',
  '📅 कार्यक्रम',
  '📷 फोटो',
  '💬 सामान्य चर्चा',
  '❓ इतर',
];

export default function AskQuestionModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  defaultType = 'question',
  lang = 'mr',
}: AskQuestionModalProps) {
  const [postType, setPostType] = useState<CommunityPostType>(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('📖 लीळा व ग्रंथ');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      setError(
        lang === 'mr'
          ? 'एका पोस्टमध्ये जास्तीत जास्त ५ फोटो जोडता येतील.'
          : 'You can upload maximum 5 images per post.'
      );
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newPreviews = files.map((file: File) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(
        lang === 'mr'
          ? 'कृपया प्रश्न किंवा विषयाचे शीर्षक टाका.'
          : 'Please enter a title for your post.'
      );
      return;
    }

    if (!content.trim()) {
      setError(
        lang === 'mr'
          ? 'कृपया सविस्तर माहिती किंवा प्रश्न लिहा.'
          : 'Please enter the details/content.'
      );
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 1. Upload images in parallel
      const uploadedUrls: string[] = [];
      for (const imgFile of images) {
        const url = await uploadCommunityImage(imgFile, `community/posts/${currentUser.uid}`);
        uploadedUrls.push(url);
      }

      // 2. Create post in Firestore
      const newPostId = await createCommunityPost({
        type: postType,
        authorId: currentUser.uid,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorPhoto: currentUser.photoURL,
        authorRole: currentUser.role,
        title: title.trim(),
        content: content.trim(),
        category,
        imageUrls: uploadedUrls,
      });

      onPostCreated(newPostId);
      onClose();
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(
        lang === 'mr'
          ? 'पोस्ट प्रकाशित करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : 'Error creating post. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-devanagari">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-amber-200">
              {postType === 'question' ? (
                <HelpCircle className="w-5 h-5" />
              ) : postType === 'discussion' ? (
                <MessageSquare className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {postType === 'question'
                  ? 'प्रश्न विचारा (Ask Question)'
                  : postType === 'discussion'
                  ? 'नवीन चर्चा सुरू करा (Start Discussion)'
                  : 'माहिती / फोटो शेअर करा (Share Post)'}
              </h3>
              <p className="text-[11px] text-amber-100/90 leading-tight">
                महानुभाव पंथीय साधकांशी थेट विचारविनिमय करा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Post Type Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              प्रकार निवडा (Select Post Type)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'question', label: '❓ प्रश्न विचारा', icon: HelpCircle },
                { id: 'discussion', label: '💬 धर्मचर्चा', icon: MessageSquare },
                { id: 'information', label: '📢 माहिती / फोटो', icon: FileText },
              ].map((item) => {
                const isSelected = postType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPostType(item.id as CommunityPostType)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-amber-50 border-gray-200'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              विषय श्रेणी (Category) *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              {postType === 'question'
                ? 'आपला प्रश्न काय आहे? (Question Title) *'
                : 'विषयाचे शीर्षक (Topic Title) *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'question'
                  ? 'उदा. जाळीच्या देवाच्या लीळेचा संदर्भ कोणता?'
                  : 'उदा. आजच्या वाचनातील महत्त्वाचे सूत्र चिंतन'
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 bg-amber-50/10 placeholder:font-normal"
              required
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              सविस्तर वर्णन (Details / Content) *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="प्रश्नाबद्दल अधिक संदर्भ, ग्रंथ संदर्भ किंवा आपले विचार येथे सविस्तर लिहा..."
              rows={4}
              className="w-full p-3 text-xs sm:text-sm border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 bg-white resize-none"
              required
            />
          </div>

          {/* Image Attachments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-950">
                फोटो जोडा (Optional Images - Max 5)
              </label>
              <span className="text-[11px] text-gray-500">{images.length}/5 फोटो</span>
            </div>

            {/* Thumbnail Preview Row */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-2">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-amber-200">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 rounded-xl text-amber-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-amber-100/50"
              >
                <Camera className="w-4 h-4 text-amber-600" />
                <span>कॅमेरा किंवा गॅलरीतून फोटो निवडा</span>
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          {/* Author Badge */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center gap-3">
            <img
              src={currentUser.photoURL}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-amber-300"
            />
            <div className="text-xs">
              <span className="font-bold text-amber-950">{currentUser.name}</span>
              <span className="text-gray-500 block text-[10px]">@{currentUser.username} म्हणून प्रकाशित होईल</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !title.trim() || !content.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer border border-amber-300"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>प्रकाशित करत आहे...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>प्रकाशित करा (Publish Post)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
