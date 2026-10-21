/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Bell, MessageSquare, ThumbsUp, UserCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { CommunityNotification } from '../../types';
import { fetchUserNotifications, markNotificationRead } from '../../lib/communityService';

interface CommunityNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onOpenPost: (postId: string) => void;
  onOpenUserProfile: (userId: string) => void;
  lang?: 'mr' | 'hi' | 'en';
}

export default function CommunityNotificationsModal({
  isOpen,
  onClose,
  userId,
  onOpenPost,
  onOpenUserProfile,
  lang = 'mr',
}: CommunityNotificationsModalProps) {
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      loadNotifs();
    }
  }, [isOpen, userId]);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const res = await fetchUserNotifications(userId);
      setNotifications(res);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif: CommunityNotification) => {
    if (!notif.read) {
      await markNotificationRead(userId, notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }

    if (notif.postId) {
      onOpenPost(notif.postId);
      onClose();
    } else if (notif.type === 'follow' && notif.fromUserId) {
      onOpenUserProfile(notif.fromUserId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-devanagari">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-200" />
            <h3 className="font-extrabold text-sm sm:text-base">समुदाय सूचना (Notifications)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2">
          {loading ? (
            <div className="py-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>सूचना लोड होत आहेत...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              कोणतीही नवीन सूचना उपलब्ध नाही.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  !n.read
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  {n.type === 'answer' ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : n.type === 'like' ? (
                    <ThumbsUp className="w-4 h-4" />
                  ) : n.type === 'follow' ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <p className="text-gray-900 font-semibold leading-snug">{n.message}</p>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    {new Date(n.createdAt).toLocaleDateString('mr-IN')}
                  </span>
                </div>

                {!n.read && <span className="w-2 h-2 rounded-full bg-amber-600 mt-1"></span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
