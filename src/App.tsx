/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Chapter, Bhajan, Pravachan, Temple, EventKaryakram, Samachar, CommunityMessage, AppNotification, AnalyticsData } from './types';

// Component Imports
import Granthalaya from './components/Granthalaya';
import BhajanList from './components/BhajanList';
import PravachanList from './components/PravachanList';
import TempleDirectory from './components/TempleDirectory';
import KaryakramCalendar from './components/KaryakramCalendar';
import SamacharNews from './components/SamacharNews';
import CommunityDiscussion from './components/CommunityDiscussion';
import LiveChannel from './components/LiveChannel';
import DonationGateway from './components/DonationGateway';
import NiwasKosh from './components/NiwasKosh';
import AdminConsole from './components/AdminConsole';
import SthanMap from './components/SthanMap';
import MyYatra from './components/MyYatra';
import PanchangView from './components/PanchangView';
import { MuhurtView } from './components/MuhurtView';
import { HolidaysView } from './components/HolidaysView';
import KnowledgeGuide from './components/KnowledgeGuide';
import SadhakSampark from './components/SadhakSampark';
import AppLogo from './components/AppLogo';
import { translations } from './translations';
import {
  initialBooks,
  initialChapters,
  initialBhajans,
  initialPravachans,
  initialTemples,
  initialEvents,
  initialNews,
  initialMessages
} from './data';

// Icons
import {
  BookOpen, Music, Radio, MapPin, Calendar, Newspaper, MessageSquare, Tv, Bell, Settings,
  Sparkles, Heart, Compass, Volume2, ShieldAlert, ShieldCheck, User, VolumeX, Menu, ChevronDown, Check, Home, Map,
  ChevronLeft, ChevronRight, Phone, PhoneCall, UserCheck, Clock, Sun, Gift, MoreHorizontal, Brain, ArrowLeft,
  Lock, KeyRound, Eye, EyeOff
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('mukhya');
  const [lang, setLang] = useState<'hi' | 'mr' | 'en'>('mr');
  const [granthalayaSubCat, setGranthalayaSubCat] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // States for KnowledgeGuide source link navigation to Granthalaya
  const [knowledgeBookId, setKnowledgeBookId] = useState<string | null>(null);
  const [knowledgeChapterId, setKnowledgeChapterId] = useState<string | null>(null);

  // Tab label display name map
  const tabNameMap: Record<string, { mr: string; hi: string; en: string }> = {
    knowledge_guide: { mr: '🧠 ज्ञानमार्गदर्शक', hi: '🧠 ज्ञानमार्गदर्शक', en: '🧠 Knowledge Guide' },
    sadhak_sampark: { mr: 'साधक संपर्क क्रमांक', hi: 'साधक संपर्क सूची', en: 'Sadhak Contacts' },
    granthalaya: { mr: 'ग्रंथालय', hi: 'ग्रंथालय', en: 'Library' },
    muhurt: { mr: 'शुभ मुहूर्त', hi: 'शुभ मुहूर्त', en: 'Muhurt' },
    calendar: { mr: 'पंचांग व कॅलेंडर', hi: 'पंचांग व कैलेंडर', en: 'Calendar' },
    panchang: { mr: 'दैनिक पंचांग', hi: 'दैनिक पंचांग', en: 'Panchang' },
    holidays: { mr: 'सुट्ट्या', hi: 'छुट्टियां', en: 'Holidays' },
    my_yatra: { mr: 'माझी यात्रा', hi: 'मेरी यात्रा', en: 'My Yatra' },
    niwas_kosh: { mr: 'निवास कोश', hi: 'निवास कोष', en: 'Niwas Kosh' },
    pravachan: { mr: 'प्रवचन माला', hi: 'प्रवचन माला', en: 'Pravachan' },
    temples: { mr: 'स्थान दर्शन', hi: 'स्थान दर्शन', en: 'Sthan Darshan' },
    samachar: { mr: 'वार्तापत्र व बातम्या', hi: 'समाचार', en: 'News' },
    community: { mr: 'धर्मचर्चा', hi: 'धर्मचर्चा', en: 'Discussion' },
    donation: { mr: 'सेवा व दान', hi: 'सेवा व दान', en: 'Donation' },
    admin: { mr: 'अ‍ॅडमिन', hi: 'एडमिन', en: 'Admin' },
    live: { mr: 'थेट प्रक्षेपण (Live)', hi: 'लाइव प्रसारण', en: 'Live Stream' },
    bhajan: { mr: 'भजन व आरत्या', hi: 'भजन व आरती', en: 'Bhajan & Aarti' },
  };

  // Safe navigation helper with browser history pushState
  const navigateToTab = (tab: string, pushHistory = true) => {
    setActiveTab(tab);
    if (pushHistory && typeof window !== 'undefined' && window.history) {
      window.history.pushState({ tab }, '', `#${tab}`);
    }
  };

  // Dedicated back navigation helper
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history && window.history.state && window.history.state.tab && window.history.state.tab !== 'mukhya') {
      window.history.back();
    } else {
      navigateToTab('mukhya');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser/Hardware Back button handler (popstate)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({ tab: 'mukhya' }, '', '#mukhya');

      const handlePopState = (e: PopStateEvent) => {
        if (e.state && e.state.tab) {
          setActiveTab(e.state.tab);
        } else {
          setActiveTab('mukhya');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Mobile Slide Back Gesture (Edge swipe right to go back)
  const [swipeHint, setSwipeHint] = useState<boolean>(false);
  const touchStartRef = React.useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    // Only enable gesture when not on main menu
    if (activeTab === 'mukhya' || activeTab === 'sthan_darshan') return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      // Only capture swipes starting from the left edge (within first 80px) or anywhere on subpages
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // If predominantly horizontal swipe right starting near left zone
      if (deltaX > 40 && deltaY < 50 && touchStartRef.current.x <= 100) {
        setSwipeHint(true);
      } else {
        setSwipeHint(false);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      setSwipeHint(false);
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Threshold: swiped right at least 60px with start x <= 90px (screen edge) and low vertical drift
      // or quick flick right (>100px)
      if (
        (touchStartRef.current.x <= 90 && deltaX > 65 && deltaY < 80) ||
        (deltaX > 120 && deltaY < 60 && deltaTime < 400)
      ) {
        handleGoBack();
      }
      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab]);

  // Auto-rotate hero banner slides every 6 seconds
  useEffect(() => {
    if (activeTab !== 'mukhya' && activeTab !== 'sthan_darshan') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeTab]);

  // Server state data (initialized with bundled fallback data for offline / Android Studio WebView compatibility)
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [bhajans, setBhajans] = useState<Bhajan[]>(initialBhajans);
  const [pravachans, setPravachans] = useState<Pravachan[]>(initialPravachans);
  const [temples, setTemples] = useState<Temple[]>(initialTemples);
  const [events, setEvents] = useState<EventKaryakram[]>(initialEvents);
  const [news, setNews] = useState<Samachar[]>(initialNews);
  const [messages, setMessages] = useState<CommunityMessage[]>(initialMessages);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    appOpens: 0,
    mostReadBooks: {},
    mostPlayedBhajans: {},
    activeUsersToday: 0
  });

  // Admin Customization configurations
  const [adsEnabled, setAdsEnabled] = useState(true);

  // Mobile More menu drawer state
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Notifications dropdown open state
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  // Yatra state count
  const [yatraCount, setYatraCount] = useState(0);

  // Prashasak Niyantran (Admin Console) Authentication state
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const checkIsAdminAuthenticated = () => {
    return (
      sessionStorage.getItem('admin_console_auth') === 'true' ||
      sessionStorage.getItem('sthan_admin_auth') === 'true' ||
      sessionStorage.getItem('niwas_admin_auth') === 'true'
    );
  };

  const handleAdminAccess = () => {
    setShowMoreMenu(false);
    setShowNotifications(false);
    if (checkIsAdminAuthenticated()) {
      navigateToTab('admin');
    } else {
      setAdminPasswordInput('');
      setAdminPasswordError('');
      setShowAdminPassword(false);
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleVerifyAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPasswordInput.trim();
    const customPin = localStorage.getItem('niwas_admin_custom_pin') || localStorage.getItem('sadhak_admin_custom_pin') || '342500';
    if (
      clean === customPin ||
      clean === '342500' ||
      clean === '1234' ||
      clean === 'mahanubhav' ||
      clean === 'admin'
    ) {
      sessionStorage.setItem('admin_console_auth', 'true');
      sessionStorage.setItem('sthan_admin_auth', 'true');
      setIsAdminAuthModalOpen(false);
      setAdminPasswordInput('');
      setAdminPasswordError('');
      navigateToTab('admin');
    } else {
      setAdminPasswordError(
        lang === 'mr'
          ? 'चुकीचा ॲडमिन पासवर्ड! कृपया योग्य पासवर्ड प्रविष्ट करा.'
          : lang === 'hi'
          ? 'गलत एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।'
          : 'Incorrect Admin Password! Please try again.'
      );
    }
  };

  // Helper function for safe JSON fetching (prevents crashes when running in WebView / offline)
  const fetchJson = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  // API Fetches
  const fetchAllData = async () => {
    try {
      const [
        resBooks, resChapters, resBhajans, resPravachans,
        resTemples, resEvents, resNews, resMessages,
        resNotifs, resAnalytics
      ] = await Promise.all([
        fetchJson('/api/books'),
        fetchJson('/api/chapters'),
        fetchJson('/api/bhajans'),
        fetchJson('/api/pravachans'),
        fetchJson('/api/temples'),
        fetchJson('/api/events'),
        fetchJson('/api/news'),
        fetchJson('/api/messages'),
        fetchJson('/api/notifications'),
        fetchJson('/api/analytics')
      ]);

      if (Array.isArray(resBooks) && resBooks.length > 0) setBooks(resBooks);
      if (Array.isArray(resChapters) && resChapters.length > 0) setChapters(resChapters);
      if (Array.isArray(resBhajans) && resBhajans.length > 0) setBhajans(resBhajans);
      if (Array.isArray(resPravachans) && resPravachans.length > 0) setPravachans(resPravachans);
      if (Array.isArray(resTemples) && resTemples.length > 0) setTemples(resTemples);
      if (Array.isArray(resEvents) && resEvents.length > 0) setEvents(resEvents);
      if (Array.isArray(resNews) && resNews.length > 0) setNews(resNews);
      if (Array.isArray(resMessages) && resMessages.length > 0) setMessages(resMessages);
      if (Array.isArray(resNotifs) && resNotifs.length > 0) setNotifications(resNotifs);
      if (resAnalytics && typeof resAnalytics === 'object') setAnalytics(resAnalytics);
    } catch (err) {
      console.error("Error fetching data from Server:", err);
    }
  };

  // On App opens
  useEffect(() => {
    fetchAllData();
    // Increment App Opens count on Server
    fetch('/api/analytics/open', { method: 'POST' })
      .then(r => r.json())
      .then(updatedAnalytics => setAnalytics(updatedAnalytics))
      .catch(err => console.log(err));
  }, []);

  // Update Yatra list count and synchronize with local storage changes
  useEffect(() => {
    const updateYatraCount = () => {
      try {
        const saved = localStorage.getItem('mahanubhav_my_yatra');
        if (saved) {
          const list = JSON.parse(saved);
          setYatraCount(Array.isArray(list) ? list.length : 0);
        } else {
          setYatraCount(0);
        }
      } catch (e) {
        console.error('Failed reading mahanubhav_my_yatra count:', e);
      }
    };

    updateYatraCount();
    window.addEventListener('yatra-updated', updateYatraCount);
    return () => {
      window.removeEventListener('yatra-updated', updateYatraCount);
    };
  }, []);

  // -------------------------------------------------------------
  // Dynamic API Actions mapped to Admin Console
  // -------------------------------------------------------------

  const handleAddBook = async (title: string, titleEn: string, author: string, description: string) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, titleEn, author, description })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChapter = async (bookId: string, number: number, title: string, content: string, explanation: string) => {
    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, number, title, content, explanation })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBhajan = async (title: string, lyrics: string, singer: string, language: string) => {
    try {
      const res = await fetch('/api/bhajans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, lyrics, singer, language })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTemple = async (name: string, type: 'temple' | 'ashram' | 'sthan', location: string, description: string, lat: number, lng: number, state?: string, district?: string, taluka?: string) => {
    try {
      const res = await fetch('/api/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, location, description, latitude: lat, longitude: lng, state, district, taluka })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotification = async (title: string, body: string, category: 'granth' | 'bhajan' | 'event' | 'general') => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, category })
      });
      if (res.ok) {
        setHasNewNotifications(true);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // Dynamic API Actions mapped to Community
  // -------------------------------------------------------------

  const handleSendMessage = async (messageText: string, userName: string, userRole: 'user' | 'vishwajeet shevlikar') => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userRole, message: messageText })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (msgId: string, replyText: string, userName: string, userRole: 'user' | 'vishwajeet shevlikar') => {
    try {
      const res = await fetch(`/api/messages/${msgId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userRole, message: replyText })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeMessage = async (msgId: string) => {
    try {
      const res = await fetch(`/api/messages/${msgId}/like`, { method: 'POST' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // Analytics Trackers
  // -------------------------------------------------------------

  const handleBookReadCount = async (bookTitle: string) => {
    try {
      const res = await fetch('/api/analytics/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnalytics(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBhajanPlayCount = async (bhajanTitle: string) => {
    try {
      const res = await fetch('/api/analytics/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bhajanTitle })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnalytics(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6A4CFF] via-[#B25CFC] to-[#FF7AB6] bg-fixed text-gray-800 flex flex-col font-sans transition-all selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden max-w-full pb-20 md:pb-8">
      
      {/* 1. DEVOTIONAL MANTRA STRIP - ONLY ON HOME */}
      {(activeTab === 'mukhya' || activeTab === 'sthan_darshan') && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-1 px-4 text-center text-xs sm:text-sm font-bold font-devanagari tracking-wider flex items-center justify-center gap-2 shadow-sm border-b border-[#FFD54F]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD54F] animate-spin" />
          <span>॥ जय श्री चक्रधर ॥ श्रीचक्रधर स्वामी उपदेश पीठ</span>
          <Sparkles className="w-3.5 h-3.5 text-[#FFD54F] animate-spin" />
        </div>
      )}

      {/* 2. SCROLLING ANNOUNCEMENT BANNER - ONLY ON HOME */}
      {(activeTab === 'mukhya' || activeTab === 'sthan_darshan') && (
        <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-900 text-[#FFD54F] py-1 px-3 text-[11px] sm:text-xs font-semibold tracking-wide font-devanagari flex items-center overflow-hidden border-b border-amber-500/20 shadow-inner">
          <div className="animate-marquee whitespace-nowrap">
            🚩 महानुभाव विश्व मध्ये आपण आपली सर्वच प्रकारची जाहिरात देऊ शकता, संपर्क: ९४०३९८६६५५ 🚩 ॥ जय श्री चक्रधर ॥
          </div>
        </div>
      )}

      {/* 4. MAIN HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-md">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-2">
          
          {/* Logo & Title & Back Button for Mobile/Header */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {activeTab !== 'mukhya' && activeTab !== 'sthan_darshan' && (
              <button
                type="button"
                onClick={handleGoBack}
                aria-label="Back"
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs shadow-md transition-all active:scale-95 border border-amber-300 shrink-0 cursor-pointer"
                title={lang === 'mr' ? 'मागे जा' : lang === 'hi' ? 'वापस जाएं' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 stroke-[3]" />
                <span className="hidden xs:inline sm:inline text-[11px] sm:text-xs">
                  {lang === 'mr' ? 'मागे' : lang === 'hi' ? 'वापस' : 'Back'}
                </span>
              </button>
            )}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer" onClick={() => navigateToTab('mukhya')}>
              <AppLogo size="md" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-purple-800 font-display leading-tight tracking-wide truncate">
                  {translations.appTitle[lang]}
                </h1>
                <p className="text-[10px] text-amber-800/80 font-devanagari font-bold truncate hidden sm:block">
                  {translations.appSubtitle[lang]}
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Language Selector Dropdown */}
            <div className="relative group">
              <button className="px-2.5 py-1.5 border border-amber-200 text-amber-800 rounded-xl hover:bg-amber-50 text-[10px] sm:text-xs font-bold font-sans transition-all flex items-center gap-1 bg-white shadow-2xs">
                <span>{lang === 'hi' ? 'हिंदी' : lang === 'mr' ? 'मराठी' : 'Eng'}</span>
                <ChevronDown className="w-3 h-3 text-amber-600" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-amber-200 rounded-2xl shadow-xl p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={() => setLang('hi')} className="w-full text-left px-2.5 py-1.5 text-[11px] font-bold rounded-xl hover:bg-amber-50 flex items-center justify-between text-gray-800">
                  <span>हिंदी</span>
                  {lang === 'hi' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button onClick={() => setLang('mr')} className="w-full text-left px-2.5 py-1.5 text-[11px] font-bold rounded-xl hover:bg-amber-50 flex items-center justify-between text-gray-800">
                  <span>मराठी</span>
                  {lang === 'mr' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button onClick={() => setLang('en')} className="w-full text-left px-2.5 py-1.5 text-[11px] font-bold rounded-xl hover:bg-amber-50 flex items-center justify-between text-gray-800">
                  <span>English</span>
                  {lang === 'en' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>
            </div>

            {/* Notification Alert Inbox Button */}
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => { setShowNotifications(!showNotifications); setHasNewNotifications(false); }}
                className={`p-2 rounded-full border bg-white text-amber-800 hover:text-amber-600 transition-all shadow-2xs relative ${
                  hasNewNotifications ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-amber-200'
                }`}
                title="अधिसूचना संदेश (Notifications)"
              >
                <Bell className="w-4 h-4" />
                {hasNewNotifications && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-ping"></span>
                )}
              </button>

              {/* Notification dropdown list */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-amber-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="bg-amber-50 p-3 border-b border-amber-200 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider font-sans">{translations.notificationsTitle[lang]}</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 font-sans">
                      {translations.close[lang]}
                    </button>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto custom-scrollbar divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 p-6 text-center">{translations.noNotifications[lang]}</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-3 hover:bg-amber-50/40 transition-all">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold font-mono uppercase">
                              {notif.category}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono ml-auto">{notif.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-800 mt-1 font-devanagari">{notif.title}</h4>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 font-sans leading-relaxed">{notif.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 5. APP MODULES BUTTON TABS (DESKTOP NAVIGATION RAIL) */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-amber-200/60 py-2 shadow-2xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2">
          {[
            { id: 'mukhya', label: translations.tabMukhya[lang], icon: Home },
            { id: 'sadhak_sampark', label: translations.tabSadhakSampark[lang], icon: PhoneCall },
            { id: 'knowledge_guide', label: '🧠 ज्ञानमार्गदर्शक', icon: Brain },
            { id: 'granthalaya', label: translations.tabGranthalaya[lang], icon: BookOpen },
            { id: 'muhurt', label: translations.tabMuhurt[lang], icon: Clock },
            { id: 'calendar', label: translations.tabCalendar[lang], icon: Calendar },
            { id: 'holidays', label: translations.tabHolidays[lang], icon: Sun },
            { id: 'my_yatra', label: lang === 'mr' ? 'माझी यात्रा' : lang === 'hi' ? 'मेरी यात्रा' : 'My Yatra', icon: Map },
            { id: 'niwas_kosh', label: translations.tabNiwasKosh[lang], icon: Home },
            { id: 'pravachan', label: lang === 'mr' ? 'प्रवचन माला' : lang === 'hi' ? 'प्रवचन माला' : 'Pravachan', icon: Radio },
            { id: 'temples', label: translations.tabTemples[lang], icon: MapPin },
            { id: 'samachar', label: translations.tabSamachar[lang], icon: Newspaper },
            { id: 'community', label: translations.tabCommunity[lang], icon: MessageSquare },
            { id: 'donation', label: translations.tabDonation[lang], icon: Sparkles },
            { id: 'admin', label: translations.tabAdmin[lang], icon: Settings }
          ].map(tab => {
            const IconComp = tab.icon;
            const isAdmin = tab.id === 'admin';
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => {
                  if (isAdmin) {
                    handleAdminAccess();
                  } else {
                    navigateToTab(tab.id);
                    setShowNotifications(false);
                  }
                }}
                title={isAdmin ? (lang === 'mr' ? 'प्रशासक नियंत्रण (पासवर्ड आवश्यक)' : lang === 'hi' ? 'प्रशासक नियंत्रण (पासवर्ड आवश्यक)' : 'Admin Console (Password Required)') : undefined}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 font-devanagari select-none cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/20 border-[#FFD54F]'
                    : 'bg-white/80 text-gray-700 hover:bg-amber-50 hover:text-amber-700 border-amber-100'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {isAdmin && (
                  <Lock className={`w-3 h-3 shrink-0 ${activeTab === tab.id ? 'text-amber-200' : 'text-amber-600'}`} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 7. MAIN CENTRAL CONTENT WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 overflow-x-hidden">
        
        {/* TOP NAVIGATION BACK TO MAIN MENU BUTTON (Visible on all sub-menu screens) */}
        {activeTab !== 'mukhya' && activeTab !== 'sthan_darshan' && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border-2 border-amber-300 shadow-lg font-devanagari animate-fade-in">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 border border-amber-300"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                <span>{lang === 'mr' ? '← मुख्य मेनूवर जा' : lang === 'hi' ? '← मुख्य मेनू पर जाएं' : '← Back to Main Menu'}</span>
              </button>

              {/* Mobile Slide Gesture hint chip */}
              <div className="sm:hidden flex items-center gap-1 text-[11px] text-amber-800/80 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/70 font-semibold select-none">
                <span className="text-amber-600 font-bold">👉</span>
                <span>{lang === 'mr' ? 'उजवीकडे स्लाइड करा' : lang === 'hi' ? 'दाएं स्लाइड करें' : 'Swipe right to back'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 ml-auto">
              <Home className="w-4 h-4 text-amber-600 hidden sm:block" />
              <span className="hidden md:inline">{lang === 'mr' ? 'सध्याचा विभाग:' : lang === 'hi' ? 'वर्तमान अनुभाग:' : 'Section:'}</span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-300 font-extrabold text-xs">
                {tabNameMap[activeTab]?.[lang] || activeTab}
              </span>
            </div>
          </div>
        )}

        {/* Animated Render Wrapper based on selected Tab */}
        <div className="transition-all duration-300">
          {activeTab === 'knowledge_guide' && (
            <KnowledgeGuide
              lang={lang}
              onOpenSource={(bookId, chapterId) => {
                setKnowledgeBookId(bookId);
                setKnowledgeChapterId(chapterId);
                navigateToTab('granthalaya');
              }}
              onNavigateToGranthalaya={() => navigateToTab('granthalaya')}
            />
          )}

          {activeTab === 'granthalaya' && (
            <Granthalaya
              books={books}
              chapters={chapters}
              onBookRead={handleBookReadCount}
              lang={lang}
              bhajans={bhajans}
              onBhajanPlay={handleBhajanPlayCount}
              initialSubCategory={granthalayaSubCat}
              initialBookId={knowledgeBookId}
              initialChapterId={knowledgeChapterId}
            />
          )}

          {(activeTab === 'mukhya' || activeTab === 'sthan_darshan') && (
            <div className="space-y-6">
              {/* HERO WELCOME BANNER / SWAGAT PATTI SLIDER */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-purple-900 text-white p-4 sm:p-6 shadow-2xl border-2 border-[#FFD54F]/50 min-h-[220px] sm:min-h-[250px] flex flex-col justify-between group">
                
                {/* SLIDE 0: MAIN WELCOME BANNER WITH "थेट प्रक्षेपण" (LIVE) MENU */}
                {currentSlide === 0 && (
                  <div className="relative z-10 flex flex-col justify-between h-full animate-fade-in space-y-3">
                    <div className="max-w-2xl">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[#FFD54F] font-black text-[10px] sm:text-xs font-devanagari border border-white/30 mb-1.5">
                        <Sparkles className="w-3 h-3 text-[#FFD54F]" />
                        श्रीचक्रधर स्वामी उपदेश पीठ
                      </span>
                      <h2 className="text-base sm:text-xl md:text-2xl font-black font-devanagari leading-tight drop-shadow-md">
                        जय श्रीकृष्ण ! महानुभाव विश्व मध्ये आपले स्वागत आहे
                      </h2>
                      <p className="text-[11px] sm:text-xs text-amber-100/90 font-devanagari mt-1 leading-snug line-clamp-2 sm:line-clamp-none">
                        महानुभाव पंथाचे पवित्र ग्रंथ, आरती, सूत्रपाठ, दृष्टांतपाठ, तीर्थक्षेत्र स्थान दर्शन व निवास कोष
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full shrink-0 mt-2">
                      <button
                        onClick={() => navigateToTab('temples')}
                        className="bg-gradient-to-r from-[#FFD54F] to-amber-400 text-amber-950 font-black px-3.5 py-2 rounded-xl shadow-lg hover:shadow-amber-400/40 flex items-center justify-center gap-1.5 text-xs transition-all hover:scale-105 cursor-pointer border border-white/50"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-950" />
                        <span>स्थान दर्शन</span>
                      </button>
                      <button
                        onClick={() => navigateToTab('granthalaya')}
                        className="bg-white/20 hover:bg-white/30 text-white font-black px-3.5 py-2 rounded-xl backdrop-blur-md flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer border border-white/30"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#FFD54F]" />
                        <span>पवित्र ग्रंथ</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SLIDE 1: GOOGLE DRIVE IMAGE BANNER SLIDE */}
                {currentSlide === 1 && (
                  <div className="relative z-10 flex flex-col justify-end h-full animate-fade-in min-h-[200px]">
                    <div className="absolute inset-0 -m-4 sm:-m-6 z-0 overflow-hidden rounded-3xl">
                      <img 
                        src="https://lh3.googleusercontent.com/d/1lnvEQD7Tfxw-Pw3GxL-NlKQ-xhPWP4e_" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://drive.google.com/uc?export=view&id=1lnvEQD7Tfxw-Pw3GxL-NlKQ-xhPWP4e_";
                        }}
                        alt="महानुभाव दर्शन" 
                        className="w-full h-full object-cover object-center filter brightness-95 hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between w-full mt-auto">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateToTab('live')}
                          className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black px-4 py-2 rounded-xl shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer border border-white/60"
                        >
                          <Tv className="w-4 h-4 text-white animate-pulse" />
                          <span>थेट प्रक्षेपण</span>
                          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDER NAVIGATION DOTS & CONTROLS */}
                <div className="absolute bottom-2 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                  <button 
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
                    title="मागील स्लाईड"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {[0, 1].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-5 bg-[#FFD54F]' : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentSlide((prev) => (prev === 1 ? 0 : 1))}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
                    title="पुढील स्लाईड"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* QUICK MENU (DEVOTIONAL DASHBOARD) - PLACED DIRECTLY BELOW WELCOME BANNER */}
              <div className="bg-white/90 border border-amber-200/80 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-black text-amber-900 font-devanagari flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    त्वरित सेवा सूची (Quick Menu)
                  </h3>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
                  {[
                    { id: 'sadhak_sampark', label: '📞 साधक संपर्क क्रमांक', icon: PhoneCall, gradient: 'from-amber-600 via-orange-600 to-amber-800', glow: 'shadow-orange-500/40' },
                    { id: 'knowledge_guide', label: '🧠 ज्ञानमार्गदर्शक', icon: Brain, gradient: 'from-[#6A4CFF] via-[#B25CFC] to-[#FF7AB6]', glow: 'shadow-purple-500/40' },
                    { id: 'niwas_kosh', label: '🏠 निवास', icon: Home, gradient: 'from-emerald-500 via-teal-500 to-emerald-700', glow: 'shadow-emerald-500/40' },
                    { id: 'bhajan', label: '📜 भजन', icon: BookOpen, gradient: 'from-pink-500 via-rose-500 to-purple-600', glow: 'shadow-pink-500/40', subCat: 'bhajan' },
                    { id: 'temples', label: '📍 स्थान', icon: MapPin, gradient: 'from-purple-600 via-indigo-600 to-purple-800', glow: 'shadow-purple-500/40' },
                    { id: 'pravachan', label: '🎤 प्रवचन', icon: Radio, gradient: 'from-blue-500 via-cyan-500 to-blue-700', glow: 'shadow-blue-500/40' },
                    { id: 'community', label: '💬 चर्चा', icon: MessageSquare, gradient: 'from-emerald-500 via-teal-600 to-emerald-800', glow: 'shadow-emerald-500/40' },
                    { id: 'samachar', label: '📰 समाचार', icon: Newspaper, gradient: 'from-indigo-500 via-purple-600 to-indigo-800', glow: 'shadow-indigo-500/40' }
                  ].map(item => {
                    const isCurrent = activeTab === item.id || (activeTab === 'granthalaya' && item.subCat === granthalayaSubCat);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.subCat) {
                            setGranthalayaSubCat(item.subCat);
                            navigateToTab('granthalaya');
                          } else {
                            navigateToTab(item.id);
                          }
                        }}
                        className={`flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-amber-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${
                          isCurrent ? 'ring-2 ring-amber-500 bg-amber-50' : ''
                        }`}
                        title={item.label.split(' ').slice(1).join(' ')}
                      >
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${item.gradient} p-0.5 shadow-lg ${item.glow} flex items-center justify-center text-white border-2 border-white/50 transform group-hover:scale-110 transition-transform`}>
                          <span className="text-xl sm:text-2xl">{item.label.split(' ')[0]}</span>
                        </div>
                        <span className="text-[11px] sm:text-xs font-black font-devanagari text-gray-800 group-hover:text-amber-700 transition-colors text-center leading-tight line-clamp-2">
                          {item.label.split(' ').slice(1).join(' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MAIN SECTIONS GRID */}
              <div className="bg-white/90 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 shadow-md">
                <h3 className="font-black text-amber-900 font-devanagari text-xs sm:text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-amber-600" />
                  प्रमुख मुख्य विभाग (Main Sections)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
                  {[
                    { id: 'sadhak_sampark', title: 'साधक संपर्क क्रमांक', desc: 'महंत, साधक व मंदिर फोन सूची', icon: PhoneCall, color: 'from-amber-600 to-orange-700' },
                    { id: 'knowledge_guide', title: 'ज्ञानमार्गदर्शक', desc: 'ग्रंथाधारित AI मार्गदर्शक', icon: Brain, color: 'from-[#6A4CFF] to-[#B25CFC]' },
                    { id: 'temples', title: 'स्थान दर्शन', desc: 'पवित्र लीला स्थाने व नकाशे', icon: MapPin, color: 'from-amber-500 to-orange-600' },
                    { id: 'granthalaya', title: 'ग्रंथालय', desc: 'लीळाचरित्र, सूत्रपाठ व ग्रंथ', icon: BookOpen, color: 'from-orange-500 to-amber-600' },
                    { id: 'live', title: 'थेट प्रक्षेपण', desc: 'लाइव्ह दर्शन व आरती', icon: Tv, color: 'from-red-600 to-rose-600' },
                    { id: 'calendar', title: lang === 'mr' ? 'कॅलेंडर व उत्सव' : lang === 'hi' ? 'कैलेंडर व उत्सव' : 'Calendar & Festivals', desc: lang === 'mr' ? 'तिथी, सण व कॅलेंडर' : lang === 'hi' ? 'तिथि, त्यौहार व कैलेंडर' : 'Tithi, Festivals & Calendar', icon: Calendar, color: 'from-purple-600 to-indigo-600' },
                    { id: 'panchang', title: lang === 'mr' ? 'पंचांग' : lang === 'hi' ? 'पंचांग' : 'Panchang', desc: lang === 'mr' ? 'दैनिक पंचांग व तिथी सारणी' : lang === 'hi' ? 'दैनिक पंचांग व तिथि तालिका' : 'Daily Panchang Table', icon: Calendar, color: 'from-pink-600 to-rose-600' },
                    { id: 'holidays', title: lang === 'mr' ? 'सुट्ट्या' : lang === 'hi' ? 'छुट्टियां' : 'Holidays', desc: lang === 'mr' ? 'सार्वजनिक व पंथीय सुट्ट्या' : lang === 'hi' ? 'सार्वजनिक व पंथीय छुट्टियां' : 'Public & Sacred Holidays', icon: Sun, color: 'from-rose-600 to-amber-600' },
                    { id: 'niwas_kosh', title: 'निवास कोष', desc: 'आश्रम व भक्त निवास', icon: Home, color: 'from-emerald-600 to-teal-600' },
                    { id: 'stavan_stotra', title: 'स्तवन स्तोत्र', desc: 'पवित्र स्तवन, स्तोत्र व प्रार्थना', icon: BookOpen, color: 'from-amber-600 to-orange-700', subCat: 'stavan_stotra' },
                    { id: 'bhajan', title: 'भजन व आरती', desc: 'आरती व नित्य भजने', icon: BookOpen, color: 'from-pink-500 to-rose-600', subCat: 'bhajan' },
                    { id: 'pravachan', title: 'प्रवचन', desc: 'गुरुवर्य प्रवचने व अमृतवाणी', icon: Radio, color: 'from-blue-500 to-cyan-600' },
                    { id: 'samachar', title: 'समाचार', desc: 'पंथ बातम्या व घडामोडी', icon: Newspaper, color: 'from-indigo-500 to-purple-600' },
                    { id: 'community', title: 'चर्चा व सत्संग', desc: 'भक्त संवाद व प्रश्नोत्तरे', icon: MessageSquare, color: 'from-teal-600 to-emerald-700' },
                  ].map((card) => {
                    const CardIcon = card.icon;
                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          if (card.subCat) {
                            setGranthalayaSubCat(card.subCat);
                            navigateToTab('granthalaya');
                          } else {
                            navigateToTab(card.id);
                          }
                        }}
                        className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-gradient-to-b from-white via-amber-50/40 to-orange-50/30 border border-amber-200/70 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer group text-left"
                      >
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0`}>
                          <CardIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-amber-950 font-devanagari text-xs leading-tight group-hover:text-amber-700 truncate">
                            {card.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-devanagari mt-0.5 leading-tight line-clamp-1">
                            {card.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DAILY LEELA / THOUGHT (PLACED AT THE BOTTOM) */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 rounded-3xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-amber-900 font-devanagari text-sm sm:text-base">
                    ॥ नित्य विचार - श्रीमुखोपनिषद ॥
                  </h3>
                </div>
                <p className="text-amber-950 font-devanagari text-sm leading-relaxed italic font-medium">
                  "अनुसरल्यापासोनि ईश्वरप्राप्तिचा आचारु: सत्य, अहिंसा, दया आणि भक्ति हेचि ईश्वराचे रूप."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'muhurt' && (
            <MuhurtView lang={lang} />
          )}

          {activeTab === 'my_yatra' && (
            <MyYatra
              lang={lang}
              onNavigateToSthanDarshan={() => setActiveTab('sthan_darshan')}
            />
          )}

          {activeTab === 'bhajan' && (
            <Granthalaya
              books={books}
              chapters={chapters}
              onBookRead={handleBookReadCount}
              lang={lang}
              bhajans={bhajans}
              onBhajanPlay={handleBhajanPlayCount}
              initialSubCategory="bhajan"
            />
          )}

          {activeTab === 'pravachan' && (
            <PravachanList
              pravachans={pravachans}
              lang={lang}
            />
          )}

          {activeTab === 'temples' && (
            <SthanMap lang={lang} />
          )}

          {activeTab === 'calendar' && (
            <KaryakramCalendar
              events={events}
              lang={lang}
            />
          )}

          {activeTab === 'panchang' && (
            <PanchangView lang={lang} />
          )}

          {activeTab === 'holidays' && (
            <HolidaysView lang={lang} />
          )}

          {activeTab === 'samachar' && (
            <SamacharNews
              news={news}
              lang={lang}
            />
          )}

          {activeTab === 'community' && (
            <CommunityDiscussion
              messages={messages}
              onSendMessage={handleSendMessage}
              onSendReply={handleSendReply}
              onLikeMessage={handleLikeMessage}
              lang={lang}
            />
          )}

          {activeTab === 'live' && (
            <LiveChannel lang={lang} />
          )}

          {activeTab === 'donation' && (
            <DonationGateway lang={lang} />
          )}

          {activeTab === 'niwas_kosh' && (
            <NiwasKosh lang={lang} />
          )}

          {activeTab === 'sadhak_sampark' && (
            <SadhakSampark lang={lang} />
          )}

          {activeTab === 'admin' && (
            <AdminConsole
              books={books}
              chapters={chapters}
              temples={temples}
              analytics={analytics}
              adsEnabled={adsEnabled}
              onToggleAds={() => setAdsEnabled(!adsEnabled)}
              onAddBook={handleAddBook}
              onAddChapter={handleAddChapter}
              onAddBhajan={handleAddBhajan}
              onAddTemple={handleAddTemple}
              onSendNotification={handleSendNotification}
              lang={lang}
            />
          )}
        </div>
      </main>

      {/* 8. NATIVE MOBILE SLIDE-UP DRAWER MENU (MORE SHEET) */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowMoreMenu(false)}>
          <div className="bg-white rounded-t-3xl border-t-2 border-[#FFD54F] p-4 pb-24 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <h3 className="text-sm font-bold text-amber-900 font-devanagari flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {lang === 'mr' ? 'अधिक सेवा व पर्याय' : lang === 'hi' ? 'अधिक सेवाएं व विकल्प' : 'More Features'}
              </h3>
              <button onClick={() => setShowMoreMenu(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[
                { id: 'sadhak_sampark', label: lang === 'mr' ? 'साधक संपर्क क्रमांक' : lang === 'hi' ? 'साधक संपर्क क्रमांक' : 'Sadhak Contacts', icon: PhoneCall, color: 'text-amber-800 bg-amber-100/80' },
                { id: 'knowledge_guide', label: '🧠 ज्ञानमार्गदर्शक', icon: Brain, color: 'text-purple-600 bg-purple-50' },
                { id: 'muhurt', label: lang === 'mr' ? 'मुहूर्त' : lang === 'hi' ? 'मुहूर्त' : 'Muhurt', icon: Clock, color: 'text-amber-600 bg-amber-50' },
                { id: 'holidays', label: lang === 'mr' ? 'सुट्ट्या' : lang === 'hi' ? 'छुट्टियां' : 'Holidays', icon: Sun, color: 'text-rose-600 bg-rose-50' },
                { id: 'niwas_kosh', label: lang === 'mr' ? 'निवास कोश' : lang === 'hi' ? 'निवास कोष' : 'Niwas', icon: Home, color: 'text-orange-600 bg-orange-50' },
                { id: 'my_yatra', label: lang === 'mr' ? 'माझी यात्रा' : lang === 'hi' ? 'मेरी यात्रा' : 'My Yatra', icon: Map, color: 'text-amber-600 bg-amber-50' },
                { id: 'calendar', label: lang === 'mr' ? 'पंचांग' : lang === 'hi' ? 'पंचांग' : 'Panchang', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
                { id: 'temples', label: translations.tabMobSthan[lang], icon: MapPin, color: 'text-amber-700 bg-amber-100/60' },
                { id: 'samachar', label: translations.tabSamachar[lang], icon: Newspaper, color: 'text-blue-600 bg-blue-50' },
                { id: 'community', label: translations.tabMobCharcha[lang], icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
                { id: 'live', label: lang === 'mr' ? 'थेट प्रक्षेपण' : lang === 'hi' ? 'लाइव प्रसारण' : 'Live', icon: Tv, color: 'text-red-600 bg-red-50' },
                { id: 'donation', label: translations.tabMobDaan[lang], icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
                { id: 'admin', label: translations.tabMobAdmin[lang], icon: Settings, color: 'text-slate-600 bg-slate-100' }
              ].map((item) => {
                const Icon = item.icon;
                const isCurrent = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'admin') {
                        handleAdminAccess();
                      } else {
                        navigateToTab(item.id);
                        setShowMoreMenu(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border ${
                      isCurrent ? 'border-amber-500 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' : 'border-amber-100 bg-gray-50/80 hover:bg-amber-50 text-gray-800'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isCurrent ? 'bg-white/20 text-white' : item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold font-devanagari leading-tight line-clamp-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9. BOTTOM FOOTER */}
      <footer className="mt-auto bg-saffron-50/80 text-gray-700 border-t border-saffron-200/60 pt-6 pb-20 md:pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <AppLogo size="sm" showStatus={false} />
            <span className="text-base font-bold font-devanagari text-amber-900">
              महानुभाव विश्व (Mahanubhav Vishwa)
            </span>
          </div>
          <p className="text-xs font-devanagari font-bold text-amber-900 max-w-xl mx-auto leading-relaxed">
            ॥ सर्वज्ञ श्री चक्रधर स्वामी की जय ॥ सर्व पंथियांना सादर दंडवत प्रणाम
          </p>
          <div className="text-[11px] font-devanagari text-gray-600 border-t border-saffron-200/40 pt-2 font-medium">
            © २०२६ महानुभाव विश्व | सर्व हक्क सुरक्षित
          </div>
        </div>
      </footer>

      {/* 10. FLOATING ROUNDED BOTTOM NAVIGATION BAR MATCHING TRADITIONAL IMAGE */}
      <nav className="fixed bottom-2 left-2 right-2 max-w-md mx-auto z-50 bg-[#fef9c3]/90 backdrop-blur-xl rounded-2xl border-2 border-amber-300 shadow-2xl shadow-amber-950/20 p-1 flex items-stretch justify-between gap-1 md:hidden">
        {[
          { 
            id: 'mukhya', 
            label: 'मुख्य', 
            icon: Home,
            bgColor: 'bg-[#581c87]', // Deep Purple
            textColor: 'text-white',
            activeRing: 'ring-2 ring-purple-300 shadow-purple-900/40'
          },
          { 
            id: 'granthalaya', 
            label: 'ग्रंथ', 
            icon: BookOpen,
            bgColor: 'bg-[#fef08a]', // Warm Cream / Yellow
            textColor: 'text-amber-950',
            activeRing: 'ring-2 ring-amber-500 shadow-amber-900/30'
          },
          { 
            id: 'calendar', 
            label: 'पंचांग', 
            icon: Calendar,
            bgColor: 'bg-[#ea580c]', // Saffron Orange
            textColor: 'text-white',
            activeRing: 'ring-2 ring-orange-300 shadow-orange-900/40'
          },
          { 
            id: 'temples', 
            label: 'स्थान', 
            icon: MapPin,
            bgColor: 'bg-[#15803d]', // Forest Green
            textColor: 'text-white',
            activeRing: 'ring-2 ring-emerald-300 shadow-emerald-900/40'
          },
          { 
            id: 'more', 
            label: 'अधिक', 
            icon: MoreHorizontal,
            bgColor: 'bg-[#fef08a]', // Warm Cream / Yellow
            textColor: 'text-amber-950',
            activeRing: 'ring-2 ring-amber-500 shadow-amber-900/30'
          }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isMoreTab = tab.id === 'more';
          const isSecondaryActive = ['sadhak_sampark', 'muhurt', 'niwas_kosh', 'my_yatra', 'samachar', 'community', 'live', 'donation', 'admin'].includes(activeTab);
          const isActive = isMoreTab 
            ? (showMoreMenu || isSecondaryActive) 
            : (tab.id === 'mukhya' ? (activeTab === 'mukhya' || activeTab === 'sthan_darshan') : activeTab === tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (isMoreTab) {
                  setShowMoreMenu(!showMoreMenu);
                } else {
                  navigateToTab(tab.id);
                  setShowMoreMenu(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black font-devanagari transition-all cursor-pointer relative ${tab.bgColor} ${tab.textColor} ${
                isActive
                  ? `scale-105 z-10 shadow-md ${tab.activeRing} font-extrabold`
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              <IconComp className={`w-5 h-5 mb-0.5 shrink-0 ${tab.textColor}`} />
              <span className="leading-tight text-center whitespace-nowrap text-[11px] font-black tracking-tight">{tab.label}</span>
              {isMoreTab && isSecondaryActive && (
                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-amber-600 rounded-full ring-2 ring-white animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 10. FLOATING MOBILE BACK BUTTON (Visible only on mobile in sub-menus) */}
      {activeTab !== 'mukhya' && activeTab !== 'sthan_darshan' && (
        <aside aria-label="Mobile Navigation Helpers">
          <div className="fixed bottom-20 left-3 z-40 md:hidden animate-bounce-subtle pointer-events-auto">
            <button
              type="button"
              onClick={handleGoBack}
              aria-label="Back to Main Menu"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-extrabold text-xs shadow-xl border-2 border-amber-300 active:scale-90 transition-all cursor-pointer backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span className="font-devanagari font-black pr-0.5">{lang === 'mr' ? 'मागे' : lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>
          </div>

          {/* Swipe Back Active Feedback Ribbon */}
          {swipeHint && (
            <div className="fixed top-1/2 left-2 -translate-y-1/2 z-50 bg-amber-950/90 text-amber-200 px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#FFD54F] backdrop-blur-lg flex items-center gap-2 pointer-events-none animate-pulse">
              <ChevronLeft className="w-6 h-6 stroke-[3] text-[#FFD54F] animate-bounce" />
              <span className="text-xs font-bold font-devanagari">
                {lang === 'mr' ? 'मागे सोडण्यासाठी सोडा' : lang === 'hi' ? 'वापस जाने के लिए छोड़ें' : 'Release to go back'}
              </span>
            </div>
          )}
        </aside>
      )}

      {/* 11. ADMIN AUTH MODAL FOR PRASHASAK NIYANTRAN */}
      {isAdminAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
                  <Lock className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-devanagari leading-snug">
                    {lang === 'mr' ? 'प्रशासक नियंत्रण सुरक्षा पडताळणी' : lang === 'hi' ? 'प्रशासक नियंत्रण सुरक्षा सत्यापन' : 'Admin Security Verification'}
                  </h3>
                  <p className="text-[11px] text-amber-100/90 font-devanagari">
                    {lang === 'mr' ? 'प्रशासक नियंत्रण उघडण्यासाठी पासवर्ड आवश्यक' : 'Admin password required'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthModalOpen(false);
                  setAdminPasswordError('');
                  setAdminPasswordInput('');
                }}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <p className="text-xs text-gray-600 font-devanagari mb-4 leading-relaxed">
                {lang === 'mr'
                  ? 'प्रशासक नियंत्रण (Admin Console) उघडण्यासाठी कृपया आपला ॲडमिन पासवर्ड प्रविष्ट करा.'
                  : lang === 'hi'
                  ? 'प्रशासक नियंत्रण खोलने के लिए कृपया अपना एडमिन पासवर्ड दर्ज करें।'
                  : 'Please enter your admin password to open Administrator Control.'}
              </p>

              <form onSubmit={handleVerifyAdminPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 font-devanagari mb-1.5">
                    {lang === 'mr' ? 'ॲडमिन पासवर्ड' : lang === 'hi' ? 'एडमिन पासवर्ड' : 'Admin Password'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        if (adminPasswordError) setAdminPasswordError('');
                      }}
                      placeholder={lang === 'mr' ? 'ॲडमिन पासवर्ड प्रविष्ट करा...' : lang === 'hi' ? 'एडमिन पासवर्ड दर्ज करें...' : 'Enter admin password...'}
                      className="w-full pl-10 pr-11 py-2.5 bg-amber-50/50 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold tracking-widest text-center"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-amber-700 transition-colors"
                      title={showAdminPassword ? "Hide password" : "Show password"}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {adminPasswordError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-devanagari animate-in fade-in duration-150">
                    {adminPasswordError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminAuthModalOpen(false);
                      setAdminPasswordError('');
                      setAdminPasswordInput('');
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-all cursor-pointer font-devanagari"
                  >
                    {lang === 'mr' ? 'रद्द करा' : lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-amber-300 font-devanagari"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'mr' ? 'प्रवेश करा' : lang === 'hi' ? 'प्रवेश करें' : 'Login'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
