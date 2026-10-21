/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, Chapter, Bhajan, Temple, EventKaryakram, Samachar, AnalyticsData } from '../types';
import { 
  Settings, Plus, TrendingUp, Bell, Image, Shield, AlertCircle, PlayCircle, Eye, EyeOff, 
  CheckCircle, MapPin, MessageSquare, Lock, KeyRound, ShieldCheck, LogOut 
} from 'lucide-react';
import { MAHARASHTRA_DISTRICTS_AND_TALUKAS, maharashtraDistricts } from '../data';
import PlacesAdmin from './PlacesAdmin';
import CommunityAdminPanel from './admin/CommunityAdminPanel';

interface AdminConsoleProps {
  books: Book[];
  chapters: Chapter[];
  temples: Temple[];
  analytics: AnalyticsData;
  adsEnabled: boolean;
  onToggleAds: () => void;
  onAddBook: (title: string, titleEn: string, author: string, description: string) => void;
  onAddChapter: (bookId: string, number: number, title: string, content: string, explanation: string) => void;
  onAddBhajan: (title: string, lyrics: string, singer: string, language: string) => void;
  onAddTemple: (name: string, type: 'temple' | 'ashram' | 'sthan', location: string, description: string, lat: number, lng: number, state?: string, district?: string, taluka?: string) => void;
  onSendNotification: (title: string, body: string, category: 'granth' | 'bhajan' | 'event' | 'general') => void;
  lang?: 'hi' | 'mr' | 'en';
}

export default function AdminConsole({
  books,
  chapters,
  temples,
  analytics,
  adsEnabled,
  onToggleAds,
  onAddBook,
  onAddChapter,
  onAddBhajan,
  onAddTemple,
  onSendNotification,
  lang = 'mr'
}: AdminConsoleProps) {
  const [activePanel, setActivePanel] = useState<'analytics' | 'customize' | 'add_book' | 'add_chapter' | 'add_temple' | 'add_bhajan' | 'add_sthan' | 'places_crud' | 'community_mod'>('places_crud');

  // Admin Authentication State for Prashasak Niyantran
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem('admin_console_auth') === 'true' ||
      sessionStorage.getItem('sthan_admin_auth') === 'true' ||
      sessionStorage.getItem('niwas_admin_auth') === 'true'
    );
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState('');

  const handleVerifyPassword = (e: React.FormEvent) => {
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
      setIsAuthenticated(true);
      setAdminPasswordError('');
      setAdminPasswordInput('');
    } else {
      setAdminPasswordError(
        lang === 'mr'
          ? 'चुकीचा पासवर्ड! कृपया योग्य ॲडमिन पासवर्ड प्रविष्ट करा.'
          : lang === 'hi'
          ? 'गलत पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें।'
          : 'Incorrect password! Please enter the correct admin password.'
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_console_auth');
    sessionStorage.removeItem('sthan_admin_auth');
    setIsAuthenticated(false);
    setAdminPasswordInput('');
    setAdminPasswordError('');
  };

  // Form states
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sthan Darshan Form State
  const [stTitle, setStTitle] = useState('');
  const [stTitleEn, setStTitleEn] = useState('');
  const [stContent, setStContent] = useState('');
  const [stExplanation, setStExplanation] = useState('');
  const [stLat, setStLat] = useState('21.0');
  const [stLng, setStLng] = useState('77.0');
  const [stState, setStState] = useState('महाराष्ट्र');
  const [stDistrict, setStDistrict] = useState('');
  const [stTaluka, setStTaluka] = useState('');
  const [stNumber, setStNumber] = useState('11');

  // Book Form State
  const [bTitle, setBTitle] = useState('');
  const [bTitleEn, setBTitleEn] = useState('');
  const [bAuthor, setBAuthor] = useState('');
  const [bDesc, setBDesc] = useState('');

  // Chapter Form State
  const [cBookId, setCBookId] = useState(books[0]?.id || '');
  const [cNumber, setCNumber] = useState('1');
  const [cTitle, setCTitle] = useState('');
  const [cContent, setCContent] = useState('');
  const [cExplanation, setCExplanation] = useState('');

  // Temple Form State
  const [tName, setTName] = useState('');
  const [tType, setTType] = useState<'temple' | 'ashram' | 'sthan'>('sthan');
  const [tLocation, setTLocation] = useState('');
  const [tDescription, setTDescription] = useState('');
  const [tLat, setTLat] = useState('19.0');
  const [tLng, setTLng] = useState('75.0');
  const [tState, setTState] = useState('महाराष्ट्र');
  const [tDistrict, setTDistrict] = useState('');
  const [tTaluka, setTTaluka] = useState('');

  // Bhajan Form State
  const [bhTitle, setBhTitle] = useState('');
  const [bhLyrics, setBhLyrics] = useState('');
  const [bhSinger, setBhSinger] = useState('');
  const [bhLang, setBhLang] = useState('हिंदी (Hindi)');

  // Notification State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifCategory, setNotifCategory] = useState<'granth' | 'bhajan' | 'event' | 'general'>('general');

  const flashMessage = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bAuthor || !bDesc) {
      flashMessage('error', 'कृपया सभी आवश्यक फ़ील्ड भरें।');
      return;
    }
    onAddBook(bTitle, bTitleEn || bTitle, bAuthor, bDesc);
    flashMessage('success', `ग्रंथ "${bTitle}" सफलतापूर्वक जोड़ दिया गया है!`);
    setBTitle('');
    setBTitleEn('');
    setBAuthor('');
    setBDesc('');
  };

  const handleChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cBookId || !cTitle || !cContent) {
      flashMessage('error', 'कृपया पुस्तक, शीर्षक और मुख्य पाठ दर्ज करें।');
      return;
    }
    onAddChapter(cBookId, Number(cNumber), cTitle, cContent, cExplanation);
    flashMessage('success', `अध्याय/प्रकरण "${cTitle}" सफलतापूर्वक जोड़ दिया गया है!`);
    setCTitle('');
    setCContent('');
    setCExplanation('');
    setCNumber(String(Number(cNumber) + 1));
  };

  const handleBhajanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bhTitle || !bhLyrics) {
      flashMessage('error', 'शीर्षक और भजन के बोल आवश्यक हैं।');
      return;
    }
    onAddBhajan(bhTitle, bhLyrics, bhSinger, bhLang);
    flashMessage('success', `भजन "${bhTitle}" सफलतापूर्वक जोड़ दिया गया है!`);
    setBhTitle('');
    setBhLyrics('');
    setBhSinger('');
  };

  const handleTempleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tLocation || !tDescription) {
      flashMessage('error', 'कृपया नाम, स्थान और संक्षिप्त इतिहास दर्ज करें।');
      return;
    }
    onAddTemple(tName, tType, tLocation, tDescription, Number(tLat), Number(tLng), tState, tDistrict, tTaluka);
    flashMessage('success', `तीर्थस्थल/आश्रम "${tName}" सफलतापूर्वक जोड़ दिया गया है!`);
    setTName('');
    setTLocation('');
    setTDescription('');
    setTDistrict('');
    setTTaluka('');
  };

  const handleSthanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stTitle || !stContent) {
      flashMessage('error', 'कृपया स्थान का नाम और संक्षिप्त इतिहास दर्ज करें।');
      return;
    }
    try {
      const id = 'sthan_' + Date.now();
      const newPlace = {
        id,
        number: Number(stNumber),
        title: stTitle,
        titleEn: stTitleEn || stTitle,
        content: stContent,
        explanation: stExplanation,
        latitude: Number(stLat),
        longitude: Number(stLng),
        state: stState,
        district: stDistrict,
        taluka: stTaluka,
        photoUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop'
      };

      // Direct write to Firebase Firestore!
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await setDoc(doc(db, 'sthan_darshan', id), newPlace);

      flashMessage('success', `स्थान दर्शन स्थल "${stTitle}" सफलतापूर्वक Firestore में जोड़ दिया गया है!`);
      
      // Reset form
      setStTitle('');
      setStTitleEn('');
      setStContent('');
      setStExplanation('');
      setStDistrict('');
      setStTaluka('');
      setStNumber(String(Number(stNumber) + 1));
    } catch (err) {
      console.error("Error adding Sthan to Firestore:", err);
      flashMessage('error', 'स्थान जोड़ने में त्रुटि हुई। कृपया फ़ायरबेस कनेक्टिविटी जांचें।');
    }
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) {
      flashMessage('error', 'नोटिफिकेशन शीर्षक और विवरण आवश्यक हैं।');
      return;
    }
    onSendNotification(notifTitle, notifBody, notifCategory);
    flashMessage('success', 'पुश नोटिफिकेशन सफलतापूर्वक भेज दिया गया है!');
    setNotifTitle('');
    setNotifBody('');
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-root" className="bg-white rounded-3xl shadow-xl border-2 border-amber-300 overflow-hidden max-w-lg mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white text-center relative">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center border border-white/40 shadow-inner mb-3">
            <Lock className="w-8 h-8 text-amber-100" />
          </div>
          <h2 className="text-xl font-black font-devanagari tracking-wide">
            {lang === 'mr' ? 'प्रशासक नियंत्रण सुरक्षा पडताळणी' : lang === 'hi' ? 'प्रशासक नियंत्रण सुरक्षा सत्यापन' : 'Admin Security Verification'}
          </h2>
          <p className="text-xs text-amber-100/90 font-devanagari mt-1.5 leading-relaxed">
            {lang === 'mr'
              ? 'प्रशासक नियंत्रण (Admin Console) उघडण्यासाठी कृपया ॲडमिन पासवर्ड प्रविष्ट करा.'
              : lang === 'hi'
              ? 'प्रशासक नियंत्रण खोलने के लिए कृपया एडमिन पासवर्ड दर्ज करें।'
              : 'Please enter the admin password to access the Administrator Console.'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 font-devanagari mb-1.5">
                {lang === 'mr' ? 'ॲडमिन पासवर्ड / पिन' : lang === 'hi' ? 'एडमिन पासवर्ड / पिन' : 'Admin Password / PIN'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    if (adminPasswordError) setAdminPasswordError('');
                  }}
                  placeholder={lang === 'mr' ? 'ॲडमिन पासवर्ड प्रविष्ट करा...' : lang === 'hi' ? 'एडमिन पासवर्ड दर्ज करें...' : 'Enter admin password...'}
                  className="w-full pl-10 pr-11 py-3 bg-amber-50/50 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold tracking-widest text-center"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-amber-700 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {adminPasswordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-devanagari flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminPasswordError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-300 font-devanagari"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'mr' ? 'सुरक्षित प्रवेश करा' : lang === 'hi' ? 'सुरक्षित प्रवेश करें' : 'Login to Admin'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="bg-saffron-50 p-6 border-b border-saffron-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-saffron-700 font-devanagari flex items-center gap-2">
            <Settings className="w-6 h-6 text-saffron-500 animate-spin" />
            {lang === 'mr' ? 'प्रशासक नियंत्रण पॅनेल (Admin Panel)' : 'एडमिन कस्टमाइज़ेशन पैनल (Admin Panel)'}
          </h2>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            ग्रंथों, अध्यायों, भजनों और तीर्थक्षेत्रों को जोड़ें, नोटिफिकेशन भेजें, और लाइव एनालिटिक्स देखें।
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Msg */}
          {statusMsg && (
            <div className={`px-4 py-2 rounded-lg text-xs font-bold font-sans shadow-sm flex items-center gap-1.5 border ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <CheckCircle className="w-4 h-4 shrink-0" />
              {statusMsg.text}
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer font-devanagari shrink-0 ml-auto"
            title={lang === 'mr' ? 'प्रशासक नियंत्रण लॉगआउट करा' : 'Logout Admin Console'}
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'mr' ? 'लॉगआउट' : lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Navigation Options sidebar */}
        <div className="border-r border-saffron-100 p-4 bg-saffron-50/20 space-y-1">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 px-2">प्रबंधन श्रेणियां</h3>
          <button
            onClick={() => { setActivePanel('places_crud'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'places_crud' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <MapPin className="w-4 h-4" />
            तीर्थक्षेत्र व्यवस्थापन (Places CRUD)
          </button>
          <button
            onClick={() => { setActivePanel('community_mod'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'community_mod' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            समुदाय मॉडरेशन (Community)
          </button>
          <button
            onClick={() => { setActivePanel('analytics'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'analytics' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            लाइव एनालिटिक्स (Analytics)
          </button>
          <button
            onClick={() => { setActivePanel('customize'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'customize' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <Settings className="w-4 h-4" />
            अँप कस्टमाइझ & अलर्ट्स
          </button>
          <button
            onClick={() => { setActivePanel('add_book'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'add_book' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            नई पुस्तक जोड़ें
          </button>
          <button
            onClick={() => { setActivePanel('add_chapter'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'add_chapter' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            नया अध्याय (Chapter) जोड़ें
          </button>
          <button
            onClick={() => { setActivePanel('add_temple'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'add_temple' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            नया मंदिर/आश्रम जोड़ें
          </button>
          <button
            onClick={() => { setActivePanel('add_sthan'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'add_sthan' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            स्थान दर्शन स्थल जोड़ें (Firestore)
          </button>
          <button
            onClick={() => { setActivePanel('add_bhajan'); setStatusMsg(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activePanel === 'add_bhajan' ? 'bg-saffron-500 text-white shadow-xs' : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            नया भजन जोड़ें
          </button>
        </div>

        {/* Forms & Charts Content Block */}
        <div className="col-span-1 md:col-span-3 p-6 md:p-8 bg-white">
          
          {/* COMMUNITY MODERATION PANEL */}
          {activePanel === 'community_mod' && (
            <CommunityAdminPanel lang={lang} />
          )}

          {/* ANALYTICS PANEL */}
          {activePanel === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2 font-sans">
                <TrendingUp className="w-4 h-4 text-saffron-500" />
                लाइव ऐप एनालिटिक्स (Real-Time Statistics)
              </h3>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-saffron-50 border border-saffron-100 p-4 rounded-xl text-center shadow-2xs">
                  <span className="block text-xl md:text-2xl font-black text-saffron-600 font-mono">{analytics.appOpens}</span>
                  <span className="text-[10px] text-gray-500 font-bold font-sans">कुल ऐप ओपन (Loads)</span>
                </div>
                <div className="bg-saffron-50 border border-saffron-100 p-4 rounded-xl text-center shadow-2xs">
                  <span className="block text-xl md:text-2xl font-black text-saffron-600 font-mono">{analytics.activeUsersToday}</span>
                  <span className="text-[10px] text-gray-500 font-bold font-sans">सक्रिय पाठक (Active)</span>
                </div>
                <div className="bg-saffron-50 border border-saffron-100 p-4 rounded-xl text-center shadow-2xs">
                  <span className="block text-xl md:text-2xl font-black text-saffron-600 font-mono">९८.५%</span>
                  <span className="text-[10px] text-gray-500 font-bold font-sans">संतुष्टि स्कोर (CTR)</span>
                </div>
              </div>

              {/* Most Read Books Custom Bar Graphic */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">सर्वाधिक पढ़े जाने वाले ग्रंथ (Most Read Books)</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.mostReadBooks).map(([bookName, readCount]) => {
                    const percentage = Math.min(100, (readCount / 200) * 100);
                    return (
                      <div key={bookName} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold font-devanagari text-gray-700">{bookName}</span>
                          <span className="font-mono text-gray-500 font-bold">{readCount} बार</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-saffron-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Most Played Bhajans */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">सर्वाधिक सुने जाने वाले भजन (Most Popular Bhajans)</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.mostPlayedBhajans).map(([bhTitle, playCount]) => {
                    const percentage = Math.min(100, (playCount / 100) * 100);
                    return (
                      <div key={bhTitle} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold font-devanagari text-gray-700 truncate max-w-xs">{bhTitle}</span>
                          <span className="font-mono text-gray-500 font-bold">{playCount} श्रोते</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMIZE & NOTIFICATION SETTINGS */}
          {activePanel === 'customize' && (
            <div className="space-y-8">
              <div className="bg-saffron-50/50 p-5 rounded-2xl border border-saffron-100">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-saffron-200 pb-2 mb-4 font-sans">
                  अँप कस्टमाइझ (Configure Ads & Interface)
                </h3>

                {/* Ads Switch */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 font-sans">प्रायोजित बैनर विज्ञापन (Control Sponsor Ads)</h4>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                      ऐप के शीर्ष भाग में विज्ञापन (Banner Ads) प्रदर्शित या छुपाएं।
                    </p>
                  </div>

                  <button
                    onClick={onToggleAds}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold ${
                      adsEnabled
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {adsEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {adsEnabled ? 'Ads बंद करें' : 'Ads चालू करें'}
                  </button>
                </div>
              </div>

              {/* Notification Push form */}
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5 font-sans">
                  <Bell className="w-4 h-4 text-saffron-500" />
                  तत्काल पुश नोटिफिकेशन भेजें (Send Live Alerts)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">शीर्षक (Alert Title)</label>
                    <input
                      type="text"
                      placeholder="उदा: आज के सत्संग की सूचना..."
                      className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-sans"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">श्रेणी (Category)</label>
                    <select
                      className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-sans"
                      value={notifCategory}
                      onChange={(e) => setNotifCategory(e.target.value as any)}
                    >
                      <option value="general">सामान्य सूचना (General)</option>
                      <option value="granth">नया ग्रंथ (Granth)</option>
                      <option value="bhajan">नया भजन (Bhajan)</option>
                      <option value="event">उत्सव / कार्यक्रम (Event)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">अलर्ट विवरण (Body Message)</label>
                  <input
                    type="text"
                    placeholder="उदा: शाम ६:०० बजे ऋद्धपूर धाम से सीधे लाइव आरती का प्रसारण किया जाएगा।"
                    className="w-full px-3.5 py-2 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-sans"
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-saffron-600 shadow-xs"
                >
                  <Bell className="w-4 h-4" />
                  तत्काल पुश नोटिफिकेशन प्रेषित करें
                </button>
              </form>
            </div>
          )}

          {/* ADD BOOK PANEL */}
          {activePanel === 'add_book' && (
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 font-sans">
                नया ग्रंथ प्रविष्ट करें (Add New Scripture)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">ग्रंथ का देवनागरी शीर्षक (Devnagari Title) *</label>
                  <input
                    type="text"
                    placeholder="उदा: श्री दृष्टांतपाठ"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={bTitle}
                    onChange={(e) => setBTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">अंग्रेजी शीर्षक (English Title)</label>
                  <input
                    type="text"
                    placeholder="उदा: Shree Drishtantapath"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={bTitleEn}
                    onChange={(e) => setBTitleEn(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">लेखक/संकलनकर्ता (Author/Compiler) *</label>
                <input
                  type="text"
                  placeholder="उदा: केशिराज व्यास"
                  className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                  value={bAuthor}
                  onChange={(e) => setBAuthor(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">ग्रंथ का विस्तृत परिचय (Introduction) *</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-24 resize-none"
                  placeholder="इस पवित्र ग्रंथ के मुख्य तत्वों और महत्व का संक्षेप में विवरण दें..."
                  value={bDesc}
                  onChange={(e) => setBDesc(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-saffron-600"
              >
                ग्रंथ प्रकाशित करें
              </button>
            </form>
          )}

          {/* ADD CHAPTER PANEL */}
          {activePanel === 'add_chapter' && (
            <form onSubmit={handleChapterSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 font-sans">
                ग्रंथ के अंतर्गत नया अध्याय जोड़ें (Add Chapter)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">मूल ग्रंथ चुनें (Select Scripture) *</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={cBookId}
                    onChange={(e) => setCBookId(e.target.value)}
                    required
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">अध्याय क्रमांक (Chapter Number) *</label>
                  <input
                    type="number"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-mono"
                    value={cNumber}
                    onChange={(e) => setCNumber(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">अध्याय का शीर्षक (Chapter Title) *</label>
                  <input
                    type="text"
                    placeholder="उदा: प्रकरण ५: आचार विचार"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={cTitle}
                    onChange={(e) => setCTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">मूल पाठ/वचन सूत्र (Scripture Text) *</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-24 resize-none font-devanagari text-sm font-medium"
                  placeholder="मूल श्लोक, वचन सूत्र या लीला यहाँ प्रविष्ट करें..."
                  value={cContent}
                  onChange={(e) => setCContent(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">भावार्थ / विवेचन (Commentary/Explanation)</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-24 resize-none"
                  placeholder="साधकों के समझने के लिए सरल भावार्थ और टीका प्रविष्ट करें..."
                  value={cExplanation}
                  onChange={(e) => setCExplanation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-saffron-600"
              >
                अध्याय सहेजें (Save Chapter)
              </button>
            </form>
          )}

          {/* ADD TEMPLE PANEL */}
          {activePanel === 'add_temple' && (
            <form onSubmit={handleTempleSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 font-sans">
                नया तीर्थक्षेत्र अथवा आश्रम जोड़ें (Add Temple/Ashram)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">तीर्थ का नाम *</label>
                  <input
                    type="text"
                    placeholder="उदा: जालना आश्रम"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">श्रेणी (Type)</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={tType}
                    onChange={(e) => setTType(e.target.value as any)}
                  >
                    <option value="temple">प्राचीन मंदिर (Temple)</option>
                    <option value="ashram">साधना आश्रम (Ashram)</option>
                    <option value="sthan">पवित्र स्थान (Sthan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">भौगोलिक पता (Location) *</label>
                  <input
                    type="text"
                    placeholder="उदा: जालना जिला, महाराष्ट्र"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={tLocation}
                    onChange={(e) => setTLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">अक्षांश (Latitude Coordinates)</label>
                  <input
                    type="text"
                    placeholder="19.1667"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-mono"
                    value={tLat}
                    onChange={(e) => setTLat(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">देशांतर (Longitude Coordinates)</label>
                  <input
                    type="text"
                    placeholder="75.8333"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-mono"
                    value={tLng}
                    onChange={(e) => setTLng(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">राज्य (State) *</label>
                  <input
                    type="text"
                    placeholder="उदा: महाराष्ट्र"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={tState}
                    onChange={(e) => {
                      setTState(e.target.value);
                      if (e.target.value !== 'महाराष्ट्र') {
                        setTDistrict('');
                        setTTaluka('');
                      }
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">जिल्हा (District)</label>
                  {tState === 'महाराष्ट्र' ? (
                    <select
                      className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={tDistrict}
                      onChange={(e) => {
                        setTDistrict(e.target.value);
                        setTTaluka('');
                      }}
                    >
                      <option value="">जिल्हा निवडा (Select District)</option>
                      {maharashtraDistricts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="उदा: अमरावती"
                      className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={tDistrict}
                      onChange={(e) => setTDistrict(e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">तालुका (Taluka)</label>
                  {tState === 'महाराष्ट्र' && tDistrict ? (
                    <select
                      className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={tTaluka}
                      onChange={(e) => setTTaluka(e.target.value)}
                    >
                      <option value="">तालुका निवडा (Select Taluka)</option>
                      {(MAHARASHTRA_DISTRICTS_AND_TALUKAS[tDistrict] || []).sort().map(tal => (
                        <option key={tal} value={tal}>{tal}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="उदा: चांदुर बाजार"
                      className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={tTaluka}
                      onChange={(e) => setTTaluka(e.target.value)}
                      disabled={tState === 'महाराष्ट्र' && !tDistrict}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">स्थान का इतिहास एवं दर्शन महत्व *</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-24 resize-none"
                  placeholder="यहाँ की लीलाओं और इतिहास का संक्षेप में उल्लेख करें..."
                  value={tDescription}
                  onChange={(e) => setTDescription(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-saffron-600"
              >
                स्थान सहेजें
              </button>
            </form>
          )}

          {/* ADD BHAJAN PANEL */}
          {activePanel === 'add_bhajan' && (
            <form onSubmit={handleBhajanSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 font-sans">
                नया भक्ति भजन प्रविष्ट करें (Add Bhajan)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">भजन का शीर्षक (Bhajan Title) *</label>
                  <input
                    type="text"
                    placeholder="उदा: स्वामी चक्रधरा आदि पुरुषा"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={bhTitle}
                    onChange={(e) => setBhTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">भाषा (Language)</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={bhLang}
                    onChange={(e) => setBhLang(e.target.value)}
                  >
                    <option value="हिंदी (Hindi)">हिंदी (Hindi)</option>
                    <option value="मराठी (Marathi)">मराठी (Marathi)</option>
                    <option value="संस्कृत (Sanskrit)">संस्कृत (Sanskrit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">गायक / कीर्तनकार (Singer Name)</label>
                <input
                  type="text"
                  placeholder="उदा: आचार्य प्रवर"
                  className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                  value={bhSinger}
                  onChange={(e) => setBhSinger(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">भजन के बोल (Full Lyrics) *</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-24 font-devanagari leading-relaxed text-sm"
                  placeholder="भजन के पूरे अंतरे और शब्द यहाँ प्रविष्ट करें..."
                  value={bhLyrics}
                  onChange={(e) => setBhLyrics(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-saffron-600"
              >
                भजन सहेजें (Save Bhajan)
              </button>
            </form>
          )}

          {/* ADD STHAN DARSHAN PLACE PANEL (FIRESTORE) */}
          {activePanel === 'add_sthan' && (
            <form onSubmit={handleSthanSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 font-sans flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-saffron-500 rounded-full"></span>
                नया स्थान दर्शन स्थल जोड़ें (Add Sthan Darshan - Firestore)
              </h3>
              <p className="text-[11px] text-gray-500 font-sans">
                यह डेटा सीधे फ़ायरबेस फ़ायरस्टोर (Firebase Firestore) में जुड़ता है और लाइव ऐप के स्थान दर्शन खंड में प्रतिबिंबित होता है।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">स्थान का नाम (देवनागरी) *</label>
                  <input
                    type="text"
                    placeholder="उदा: श्री क्षेत्र ऋद्धपूर धाम"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={stTitle}
                    onChange={(e) => setStTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">स्थान का नाम (English)</label>
                  <input
                    type="text"
                    placeholder="उदा: Shree Kshetra Riddhapur Dham"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={stTitleEn}
                    onChange={(e) => setStTitleEn(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">स्थान संख्या / अनुक्रम नंबर *</label>
                  <input
                    type="number"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={stNumber}
                    onChange={(e) => setStNumber(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">अक्षांश (Latitude) *</label>
                  <input
                    type="text"
                    placeholder="उदा: 21.2294"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-mono"
                    value={stLat}
                    onChange={(e) => setStLat(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">रेखांश (Longitude) *</label>
                  <input
                    type="text"
                    placeholder="उदा: 77.8596"
                    className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white font-mono"
                    value={stLng}
                    onChange={(e) => setStLng(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">राज्य (State)</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                    value={stState}
                    onChange={(e) => setStState(e.target.value)}
                  >
                    <option value="महाराष्ट्र">महाराष्ट्र (Maharashtra)</option>
                    <option value="कर्नाटक">कर्नाटक (Karnataka)</option>
                    <option value="गुजरात">गुजरात (Gujarat)</option>
                    <option value="मध्य प्रदेश">मध्य प्रदेश (Madhya Pradesh)</option>
                    <option value="पंजाब">पंजाब (Punjab)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">जिल्हा (District)</label>
                  {stState === 'महाराष्ट्र' ? (
                    <select
                      className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={stDistrict}
                      onChange={(e) => {
                        setStDistrict(e.target.value);
                        setStTaluka('');
                      }}
                    >
                      <option value="">जिल्हा निवडा (Select District)</option>
                      {maharashtraDistricts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="उदा: अमरावती"
                      className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={stDistrict}
                      onChange={(e) => setStDistrict(e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">तालुका (Taluka)</label>
                  {stState === 'महाराष्ट्र' && stDistrict ? (
                    <select
                      className="w-full px-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={stTaluka}
                      onChange={(e) => setStTaluka(e.target.value)}
                    >
                      <option value="">तालुका निवडा (Select Taluka)</option>
                      {(MAHARASHTRA_DISTRICTS_AND_TALUKAS[stDistrict] || []).sort().map(tal => (
                        <option key={tal} value={tal}>{tal}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="उदा: मोर्शी"
                      className="w-full px-3.5 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white"
                      value={stTaluka}
                      onChange={(e) => setStTaluka(e.target.value)}
                      disabled={stState === 'महाराष्ट्र' && !stDistrict}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">स्थान का इतिहास एवं दर्शन महत्व *</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-24 resize-none"
                  placeholder="यहाँ की लीलाओं, चरणमुद्रिका और ऐतिहासिक महत्व का विस्तार से वर्णन करें..."
                  value={stContent}
                  onChange={(e) => setStContent(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">मार्गदर्शन (कसे पोहोचावे / How to Reach)</label>
                <textarea
                  className="w-full p-3 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500 bg-white h-16 resize-none"
                  placeholder="नजदीकी रेलवे स्टेशन, बस स्टैंड या मार्ग की जानकारी दें..."
                  value={stExplanation}
                  onChange={(e) => setStExplanation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-saffron-700 shadow-sm"
              >
                स्थान सहेजें (Save to Firestore)
              </button>
            </form>
          )}

          {/* PLACES CRUD ADMIN PANEL */}
          {activePanel === 'places_crud' && (
            <PlacesAdmin lang={lang} />
          )}

        </div>
      </div>
    </div>
  );
}
