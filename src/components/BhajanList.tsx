/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bhajan } from '../types';
import { BookOpen, Heart, Search, FileText, Sparkles, Copy, Check, ZoomIn, ZoomOut, Share2, Video } from 'lucide-react';
import { translations } from '../translations';

interface BhajanListProps {
  bhajans: Bhajan[];
  onBhajanPlay?: (bhajanTitle: string) => void;
  lang?: 'hi' | 'mr' | 'en';
}

export default function BhajanList({ bhajans, onBhajanPlay, lang = 'mr' }: BhajanListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mahanubhav_favorites_bhajans');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Default select first bhajan if available
  useEffect(() => {
    if (bhajans && bhajans.length > 0 && !selectedBhajan) {
      setSelectedBhajan(bhajans[0]);
    }
  }, [bhajans]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = [...favorites];
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id);
    } else {
      updated.push(id);
    }
    setFavorites(updated);
    localStorage.setItem('mahanubhav_favorites_bhajans', JSON.stringify(updated));
  };

  const selectBhajanHandler = (bhajan: Bhajan) => {
    setSelectedBhajan(bhajan);
    setShowVideo(false);
    if (onBhajanPlay) {
      onBhajanPlay(bhajan.title);
    }
  };

  const handleCopyText = () => {
    if (!selectedBhajan) return;
    const textToCopy = `${selectedBhajan.title}\n\n${selectedBhajan.lyrics}\n\n— महानुभाव विश्व भजन संग्रह`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // List of distinct languages for filtering
  const languages = ['All', 'मराठी', 'हिंदी'];

  // Filter Bhajans
  const filteredBhajans = bhajans.filter(bh => {
    const matchesSearch = bh.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bh.lyrics.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === 'All' || bh.language.includes(selectedLanguage);
    return matchesSearch && matchesLang;
  });

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal': return 'text-base md:text-lg leading-relaxed';
      case 'large': return 'text-lg md:text-xl leading-loose';
      case 'xlarge': return 'text-xl md:text-2xl leading-loose';
      default: return 'text-lg md:text-xl leading-loose';
    }
  };

  return (
    <div id="bhajan-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-saffron-50 via-amber-50 to-orange-50 p-5 sm:p-6 border-b border-saffron-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 font-bold text-xs font-devanagari mb-1.5 border border-saffron-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            {lang === 'mr' ? 'पवित्र वाचन संग्रह' : lang === 'hi' ? 'पवित्र पाठ संग्रह' : 'Devotional Reading'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-saffron-800 font-devanagari flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-saffron-600 shrink-0" />
            {translations.bhajanHeader[lang]}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-devanagari">
            {translations.bhajanSub[lang]}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Language filter */}
          <div className="flex gap-1.5 bg-white/80 p-1 rounded-xl border border-saffron-200 shadow-2xs">
            {languages.map(l => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-sans cursor-pointer ${
                  (l === 'All' && selectedLanguage === 'All') || (l !== 'All' && selectedLanguage === l)
                    ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-saffron-600 hover:bg-saffron-50'
                }`}
              >
                {l === 'All' ? translations.all[lang] : l}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={translations.searchBhajanPlaceholder[lang]}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-saffron-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white shadow-2xs font-devanagari"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
        {/* Bhajan list sidebar */}
        <div className="border-r border-saffron-100 p-3 sm:p-4 bg-saffron-50/20 overflow-y-auto max-h-[580px] custom-scrollbar">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-saffron-800 uppercase tracking-wider font-devanagari flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-saffron-600" />
              {lang === 'mr' ? 'भजन व अभंग सूची' : lang === 'hi' ? 'भजन सूची' : 'Bhajan List'} ({filteredBhajans.length})
            </h3>
          </div>

          <div className="space-y-2">
            {filteredBhajans.length === 0 ? (
              <div className="text-center py-8 bg-white/60 rounded-xl border border-saffron-100 p-4">
                <FileText className="w-8 h-8 text-saffron-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-devanagari">
                  {lang === 'mr' ? 'कोणतेही भजन आढळले नाही.' : lang === 'hi' ? 'कोई भजन नहीं मिला।' : 'No bhajans found.'}
                </p>
              </div>
            ) : (
              filteredBhajans.map(bh => (
                <div
                  key={bh.id}
                  id={`bhajan-item-${bh.id}`}
                  onClick={() => selectBhajanHandler(bh)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    selectedBhajan?.id === bh.id
                      ? 'bg-gradient-to-r from-saffron-50 to-amber-50 border-saffron-400 shadow-sm ring-1 ring-saffron-400/30'
                      : 'bg-white border-saffron-100/80 hover:border-saffron-300 hover:bg-saffron-50/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${selectedBhajan?.id === bh.id ? 'bg-saffron-500 text-white' : 'bg-saffron-100 text-saffron-700'}`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-xs sm:text-sm font-devanagari truncate group-hover:text-saffron-700">
                        {bh.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-saffron-700 bg-saffron-100/70 px-1.5 py-0.5 rounded font-devanagari">
                          वाचन
                        </span>
                        <span className="text-[10px] text-gray-500 font-sans truncate">
                          {bh.language} {bh.singer && `• ${bh.singer}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => toggleFavorite(bh.id, e)}
                      className={`p-1.5 rounded-md hover:bg-saffron-100/60 transition-all ${
                        favorites.includes(bh.id) ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'
                      }`}
                      title={favorites.includes(bh.id) ? 'पसंतीतून काढा' : 'पसंतीत जोडा'}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dedicated Bhajan Reader Panel */}
        <div className="col-span-1 md:col-span-2 p-4 sm:p-6 flex flex-col bg-white">
          {selectedBhajan ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Bhajan Reader Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-saffron-100 pb-4 mb-5 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-devanagari bg-amber-100 text-amber-800 border border-amber-200">
                        📖 पाठ्य काव्य (वाचनासाठी)
                      </span>
                      <span className="text-xs text-gray-500 font-sans">
                        {selectedBhajan.language}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-saffron-900 font-devanagari leading-snug">
                      {selectedBhajan.title}
                    </h3>
                    {selectedBhajan.singer && (
                      <p className="text-xs text-gray-600 mt-0.5 font-devanagari">
                        {translations.singer[lang]}: <span className="font-semibold text-saffron-800">{selectedBhajan.singer}</span>
                      </p>
                    )}
                  </div>

                  {/* Reading Toolbar */}
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {/* Font size adjustments */}
                    <div className="flex items-center bg-saffron-50 rounded-xl p-1 border border-saffron-200">
                      <button
                        onClick={() => setFontSize('normal')}
                        className={`p-1.5 rounded-lg text-xs font-bold font-sans transition-all ${fontSize === 'normal' ? 'bg-saffron-500 text-white shadow-2xs' : 'text-gray-600 hover:text-saffron-700'}`}
                        title="साधा फॉन्ट (Normal)"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`p-1.5 rounded-lg text-xs font-bold font-sans transition-all ${fontSize === 'large' ? 'bg-saffron-500 text-white shadow-2xs' : 'text-gray-600 hover:text-saffron-700'}`}
                        title="मोठा फॉन्ट (Large)"
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('xlarge')}
                        className={`p-1.5 rounded-lg text-xs font-bold font-sans transition-all ${fontSize === 'xlarge' ? 'bg-saffron-500 text-white shadow-2xs' : 'text-gray-600 hover:text-saffron-700'}`}
                        title="अति मोठा फॉन्ट (XL)"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Copy Text Button */}
                    <button
                      onClick={handleCopyText}
                      className="px-3 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-800 border border-saffron-200 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title="भजन कॉपी करा"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-saffron-600" />}
                      <span>{copied ? (lang === 'mr' ? 'कॉपी झाले!' : 'Copied!') : (lang === 'mr' ? 'कॉपी' : 'Copy')}</span>
                    </button>

                    {/* Video Embed Toggle (if video exists) */}
                    {selectedBhajan.videoUrl && (
                      <button
                        onClick={() => setShowVideo(!showVideo)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                          showVideo
                            ? 'bg-red-500 text-white border-red-500 shadow-2xs'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title={lang === 'mr' ? 'व्हिडिओ पहा' : 'Watch Video'}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{lang === 'mr' ? 'व्हिडिओ' : 'Video'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Video Embed */}
                {showVideo && selectedBhajan.videoUrl && (
                  <div className="mb-5 rounded-2xl overflow-hidden aspect-video shadow-md border border-saffron-200 bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedBhajan.videoUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Elegant Devotional Verse Reader Card */}
                <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-[#FFF6E5] border-2 border-saffron-200/80 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden my-2">
                  {/* Decorative Background Symbol */}
                  <div className="absolute right-3 bottom-3 text-7xl opacity-5 select-none pointer-events-none font-devanagari font-bold text-saffron-800">
                    ॐ
                  </div>

                  {/* Header Ornament */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center gap-2 text-saffron-500 text-xs tracking-widest uppercase font-devanagari font-bold">
                      <span className="w-8 h-[1px] bg-saffron-300"></span>
                      <span>॥ जय श्रीकृष्ण ॥</span>
                      <span className="w-8 h-[1px] bg-saffron-300"></span>
                    </div>
                  </div>

                  {/* Bhajan Verses / Lyrics */}
                  <div className={`text-center text-gray-900 font-bold font-devanagari whitespace-pre-line max-w-xl mx-auto ${getFontSizeClass()} tracking-wide drop-shadow-2xs`}>
                    {selectedBhajan.lyrics}
                  </div>

                  {/* Footer Ornament */}
                  <div className="text-center mt-8 pt-4 border-t border-saffron-200/60">
                    <p className="text-xs text-saffron-700 font-devanagari font-bold">
                      ॥ सर्वज्ञ श्रीचक्रधर स्वामी की जय ॥
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-saffron-50/10 rounded-2xl border border-dashed border-saffron-200">
              <BookOpen className="w-14 h-14 text-saffron-300 mb-3 animate-pulse" />
              <h3 className="text-lg font-bold text-saffron-900 font-devanagari">
                {lang === 'mr' ? 'वाचनासाठी भजन किंवा अभंग निवडा' : lang === 'hi' ? 'पठन हेतु भजन चुनें' : 'Select a Bhajan to Read'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mt-1.5 font-devanagari">
                {lang === 'mr' 
                  ? 'डाव्या सूचीमधून कोणतेही भजन निवडून तुम्ही त्याचे संपूर्ण काव्य, पद व नामस्मरण स्पष्ट व मोठ्या अक्षरांत वाचू शकता.' 
                  : lang === 'hi' 
                  ? 'बायें सूची से कोई भजन चुनकर आप उसका संपूर्ण काव्य स्पष्ट व सुंदर अक्षरों में पढ़ सकते हैं।' 
                  : 'Choose any bhajan from the left list to read its complete devotional verses.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

