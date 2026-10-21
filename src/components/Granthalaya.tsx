/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Chapter, Bhajan } from '../types';
import { BookOpen, Bookmark, Volume2, VolumeX, ChevronRight, ChevronDown, ArrowLeft, Search, Sparkles, Filter, Info, Play, Pause, Maximize2, Minimize2, MapPin, Copy, Check, Ruler, Table, Layers, Grid, HelpCircle, Share2 } from 'lucide-react';
import { translations } from '../translations';
import { dattatreyaGurus, GuruInfo } from '../data/dattatreyaGurus';
import { galfaMeasurementsList, GalfaMeasurement } from '../data/pramukhSthanancheGalfeData';
import SthanMap from './SthanMap';
import BhajanList from './BhajanList';

interface GranthalayaProps {
  books: Book[];
  chapters: Chapter[];
  onBookRead: (bookTitle: string) => void;
  lang?: 'hi' | 'mr' | 'en';
  bhajans?: Bhajan[];
  onBhajanPlay?: (bhajanTitle: string) => void;
  initialSubCategory?: string;
  initialBookId?: string | null;
  initialChapterId?: string | null;
}

export default function Granthalaya({
  books,
  chapters,
  onBookRead,
  lang = 'mr',
  bhajans = [],
  onBhajanPlay,
  initialSubCategory = 'all',
  initialBookId = null,
  initialChapterId = null
}: GranthalayaProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // New states for Dattatreya 24 Gurus feature
  const [showGurusInfo, setShowGurusInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentlyPlayingGuruId, setCurrentlyPlayingGuruId] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategory);

  // New states for Galfa Measurements Table feature
  const [showGalfaTable, setShowGalfaTable] = useState(false);
  const [galfaSearch, setGalfaSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [galfaViewMode, setGalfaViewMode] = useState<'table' | 'grouped' | 'cards'>('table');
  const [showGalfaInfo, setShowGalfaInfo] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (selectedBook?.id === 'sthan_galfa_maap' || selectedBook?.id === 'pramukh_sthananchya_galphache_map') {
      setShowGalfaTable(true);
      setSelectedChapter(null);
    } else {
      setShowGalfaTable(false);
    }
  }, [selectedBook?.id]);

  const copyGalfaRow = (item: GalfaMeasurement) => {
    const text = `${item.village}${item.district ? ' (जि. ' + item.district + ')' : ''} - ${item.sthan} : लांबी ${item.length}″ × रुंदी ${item.width}″ × उंची ${item.height}″ ${item.note ? ' [' + item.note + ']' : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllGalfaList = () => {
    const rows = galfaMeasurementsList.map((item, idx) => 
      `${idx + 1}. ${item.village}${item.district ? ' (जि. ' + item.district + ')' : ''} - ${item.sthan} : लांबी ${item.length}″ × रुंदी ${item.width}″ × उंची ${item.height}″ ${item.note ? ' (' + item.note + ')' : ''}`
    ).join('\n');
    navigator.clipboard.writeText(`॥ सर्व स्थानांची गल्फ माप सारणी (४९ गावे व १२४ स्थाने) ॥\n\n${rows}`);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const galfaDistricts = Array.from(new Set(galfaMeasurementsList.map(item => item.district).filter(Boolean))) as string[];
  const galfaVillages = Array.from(new Set(galfaMeasurementsList.map(item => item.village)));

  const filteredGalfaList = galfaMeasurementsList.filter(item => {
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesVillage = selectedVillage === 'all' || item.village === selectedVillage;
    const q = galfaSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      item.village.toLowerCase().includes(q) ||
      (item.villageEn && item.villageEn.toLowerCase().includes(q)) ||
      item.sthan.toLowerCase().includes(q) ||
      (item.sthanEn && item.sthanEn.toLowerCase().includes(q)) ||
      (item.district && item.district.toLowerCase().includes(q)) ||
      item.length.includes(q) ||
      item.width.includes(q) ||
      item.height.includes(q) ||
      (item.note && item.note.toLowerCase().includes(q));

    return matchesDistrict && matchesVillage && matchesSearch;
  });

  const groupedGalfaByVillage: { [village: string]: GalfaMeasurement[] } = {};
  filteredGalfaList.forEach(item => {
    if (!groupedGalfaByVillage[item.village]) {
      groupedGalfaByVillage[item.village] = [];
    }
    groupedGalfaByVillage[item.village].push(item);
  });

  useEffect(() => {
    if (initialSubCategory) {
      setSelectedSubCategory(initialSubCategory);
    }
  }, [initialSubCategory]);

  // Deep linking for book/chapter selection
  useEffect(() => {
    if (initialBookId) {
      const foundBook = books.find(b => b.id === initialBookId);
      if (foundBook) {
        setSelectedBook(foundBook);
        if (initialChapterId) {
          const foundChap = chapters.find(c => c.id === initialChapterId);
          if (foundChap) {
            setSelectedChapter(foundChap);
            setShowGalfaTable(false);
          }
        }
      }
    }
  }, [initialBookId, initialChapterId, books, chapters]);

  // Google Book Fullscreen Reader states
  const [isFullscreenReader, setIsFullscreenReader] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<number>(20);
  const [readerTheme, setReaderTheme] = useState<'sepia' | 'light' | 'dark'>('sepia');

  // New state for Leela Charitra parts (Purvardh / Uttarardh)
  const [selectedLeelaPart, setSelectedLeelaPart] = useState<'purvardh' | 'uttarardh'>('purvardh');

  // Search state for chapters/leelas
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');

  // New state for Pujavasar (sp_18) sub-menu parts
  const [pujavasarSubMenu, setPujavasarSubMenu] = useState<'all' | 'pratah' | 'madhyanh' | 'sayan'>('all');

  useEffect(() => {
    if (selectedBook?.id === 'leela_charitra') {
      setSelectedLeelaPart('purvardh');
    }
    setChapterSearchQuery('');
  }, [selectedBook]);

  useEffect(() => {
    setChapterSearchQuery('');
  }, [selectedLeelaPart]);

  useEffect(() => {
    setPujavasarSubMenu('all');
  }, [selectedChapter?.id]);

  const getPujavasarContent = (content: string, subMenu: 'all' | 'pratah' | 'madhyanh' | 'sayan') => {
    if (!content) return '';
    if (subMenu === 'all') return content;
    
    if (subMenu === 'pratah') {
      const start = content.indexOf('॥ १. प्रातःकाळ पूजावसर ॥');
      const end = content.indexOf('॥ २. मध्यान्हकाळ पूजावसर ॥');
      if (start !== -1 && end !== -1) {
        return content.substring(start, end).trim();
      } else if (start !== -1) {
        return content.substring(start).trim();
      }
    }
    
    if (subMenu === 'madhyanh') {
      const start = content.indexOf('॥ २. मध्यान्हकाळ पूजावसर ॥');
      const end = content.indexOf('॥ ३. सायंकाळ पूजावसर ॥');
      if (start !== -1 && end !== -1) {
        return content.substring(start, end).trim();
      } else if (start !== -1) {
        return content.substring(start).trim();
      }
    }
    
    if (subMenu === 'sayan') {
      const start = content.indexOf('॥ ३. सायंकाळ पूजावसर ॥');
      if (start !== -1) {
        return content.substring(start).trim();
      }
    }

    return content;
  };

  const getBookSubCategory = (book: Book) => {
    const idLower = book.id.toLowerCase();
    const titleLower = (book.title || '').toLowerCase();
    const catLower = (book.category || '').toLowerCase();
    
    // Sutrapath is a main scripture (mukhya), NOT a Stotra
    if (idLower.includes('sutra_path') || idLower.includes('sutrapath') || titleLower.includes('सूत्रपाठ')) {
      return 'mukhya';
    }

    if (
      idLower.includes('parayan') ||
      idLower.includes('janmadhyay') ||
      titleLower.includes('पारायण') ||
      titleLower.includes('जन्माध्याय') ||
      book.category === 'parayan'
    ) {
      return 'parayan';
    }

    if (
      catLower === 'stavan_stotra' ||
      catLower === 'stavan_prarthana' ||
      catLower === 'stavan' ||
      catLower === 'stotra' ||
      idLower.includes('stavan') ||
      idLower.includes('stotra') ||
      idLower.includes('prarthana') ||
      idLower.includes('kavach') ||
      titleLower.includes('स्तवन') ||
      titleLower.includes('स्तोत्र') ||
      titleLower.includes('प्रार्थना') ||
      titleLower.includes('कवच') ||
      titleLower.includes('याचक') ||
      titleLower.includes('अनुताप') ||
      titleLower.includes('नारविलाप') ||
      titleLower.includes('चिंतामणी') ||
      titleLower.includes('चिंतामणि') ||
      titleLower.includes('निर्वेद') ||
      titleLower.includes('संसारपाश') ||
      titleLower.includes('विनंती') ||
      titleLower.includes('धनामृत') ||
      titleLower.includes('साधनामृत') ||
      titleLower.includes('विंगुळी') ||
      titleLower.includes('नाममहिमा') ||
      titleLower.includes('प्रसाद') ||
      titleLower.includes('संकष्ट') ||
      idLower.includes('prasad') ||
      idLower.includes('sankasht')
    ) {
      return 'stavan_stotra';
    }
    if (idLower.includes('bhajan') || titleLower.includes('भजन') || book.category === 'bhajan') {
      return 'bhajan';
    }
    if (idLower.includes('drishtant') || titleLower.includes('दृष्टांत')) {
      return 'drishtant';
    }
    if (idLower.includes('sthan') || titleLower.includes('स्थान')) {
      return 'sthan';
    }
    if (idLower.includes('aarti') || idLower.includes('arti') || titleLower.includes('आरती') || book.category === 'aarti_stotra') {
      return 'arti';
    }
    if (book.category === 'pramukh_granth' || idLower.includes('leela')) {
      return 'mukhya';
    }
    return 'mukhya';
  };

  // Load bookmarks
  useEffect(() => {
    const saved = localStorage.getItem('mahanubhav_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (chapterId: string) => {
    let updated = [...bookmarks];
    if (updated.includes(chapterId)) {
      updated = updated.filter(id => id !== chapterId);
    } else {
      updated.push(chapterId);
    }
    setBookmarks(updated);
    localStorage.setItem('mahanubhav_bookmarks', JSON.stringify(updated));
  };

  // Filter books by selected category
  const filteredBooks = books.filter(book => {
    if (selectedSubCategory === 'all') return true;
    const cat = getBookSubCategory(book);
    if (
      (selectedSubCategory === 'stavan_stotra' || selectedSubCategory === 'stavan_prarthana' || selectedSubCategory === 'sutra' || selectedSubCategory === 'stotra') &&
      cat === 'stavan_stotra'
    ) {
      return true;
    }
    if (selectedSubCategory === 'mukhya' && (cat === 'mukhya' || cat === 'sthan')) {
      return true;
    }
    return cat === selectedSubCategory;
  });

  // Filter chapters for the selected book
  const filteredChapters = (chapters || [])
    .filter(chap => {
      if (!chap) return false;
      if (selectedBook && chap.bookId !== selectedBook.id) return false;
      
      // Filter by part if the selected book is Leela Charitra
      if (selectedBook?.id === 'leela_charitra') {
        if (selectedLeelaPart === 'purvardh') {
          if (!chap.id?.startsWith('lc_p')) return false;
        } else if (selectedLeelaPart === 'uttarardh') {
          if (!chap.id?.startsWith('lc_u') && chap.id !== 'lc_u13') return false;
        }
      }
      
      if (chapterSearchQuery.trim()) {
        const q = chapterSearchQuery.trim().toLowerCase();
        const titleMatch = (chap.title || '').toLowerCase().includes(q);
        const contentMatch = (chap.content || '').toLowerCase().includes(q);
        const expMatch = (chap.explanation || '').toLowerCase().includes(q);
        const titleEnMatch = (chap.titleEn || '').toLowerCase().includes(q);
        return titleMatch || contentMatch || expMatch || titleEnMatch;
      }

      return true;
    })
    .sort((a, b) => (a?.number || 0) - (b?.number || 0));

  const startSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\n\r\#\.\,]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Try to find a Devanagari voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('mr'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      utterance.rate = 0.9; // A bit slower for spiritual content
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setSpeechUtterance(utterance);
      setIsPlaying(true);
    } else {
      alert('आपके ब्राउज़र में स्पीच सिंथेसिस सपोर्ट नहीं है।');
    }
  };

  const startGuruSpeech = (guru: GuruInfo) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const txt = `${guru.name[lang]}. ${lang === 'mr' ? 'शिकवण आणि बोध' : lang === 'hi' ? 'सीख और उपदेश' : 'Lesson learned'}: ${guru.lesson[lang]}. ${lang === 'mr' ? 'स्पष्टीकरण' : lang === 'hi' ? 'स्पष्टीकरण' : 'Explanation'}: ${guru.explanation[lang]}`;
      const cleanText = txt.replace(/[\n\r\#\.\,]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.includes('hi') || v.lang.includes('mr'));
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.9;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentlyPlayingGuruId(null);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentlyPlayingGuruId(null);
      };

      window.speechSynthesis.speak(utterance);
      setSpeechUtterance(utterance);
      setIsPlaying(true);
      setCurrentlyPlayingGuruId(guru.id);
    } else {
      alert('Your browser does not support Speech Synthesis.');
    }
  };

  const stopGuruSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentlyPlayingGuruId(null);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentlyPlayingGuruId(null);
    }
  };

  const renderStructuredExplanation = (expText: string) => {
    if (!expText) return null;

    if (expText.includes('१. प्रसंग व संदर्भ') || expText.includes('२. सविस्तर भावार्थ')) {
      return (
        <div className="space-y-4 my-3 font-devanagari">
          {expText.split(/(?=[१-४]\.\s*)/).map((part, idx) => {
            const trimmed = part.trim();
            if (!trimmed) return null;
            
            let header = '';
            let body = trimmed;
            
            const matchHeader = trimmed.match(/^([१-४]\.\s*[^:\n]+[:\n]?)/);
            if (matchHeader) {
              header = matchHeader[1].replace(/[:\n]$/, '').trim();
              body = trimmed.slice(matchHeader[0].length).trim();
            }

            return (
              <div key={idx} className="font-devanagari">
                {header && (
                  <h5 className="font-bold text-sm md:text-base text-saffron-800 mb-1">
                    {header}
                  </h5>
                )}
                <p className="text-sm md:text-base text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                  {body}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p className="text-sm md:text-base text-gray-800 font-devanagari leading-relaxed whitespace-pre-line">
        {expText}
      </p>
    );
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|“[^”]+”|"[^"\n]+"|‘[^’]+’|'[^'\n]+')/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-amber-950 dark:text-amber-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (
        (part.startsWith('“') && part.endsWith('”')) ||
        (part.startsWith('"') && part.endsWith('"')) ||
        (part.startsWith('‘') && part.endsWith('’')) ||
        (part.startsWith("'") && part.endsWith("'"))
      ) {
        return (
          <strong key={i} className="font-bold text-amber-950 dark:text-amber-100">
            {part}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-bold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-devanagari">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');

    return (
      <div className="space-y-2 font-devanagari">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          if (trimmed.startsWith('#### ') || trimmed.startsWith('### ')) {
            const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            return (
              <h4 key={idx} className="text-lg md:text-xl font-bold text-saffron-800 dark:text-saffron-300 mt-6 mb-2 border-b border-saffron-200/50 dark:border-saffron-800/50 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
                {headerText}
              </h4>
            );
          }

          const isShloka =
            trimmed.startsWith('**`') ||
            trimmed.startsWith('`') ||
            (trimmed.startsWith('**') &&
              !trimmed.includes(':-') &&
              (trimmed.includes('॥') || trimmed.includes('।')));

          if (isShloka) {
            const cleanVerse = trimmed.replace(/\*\*/g, '').replace(/`/g, '');
            return (
              <div
                key={idx}
                className="font-bold text-lg md:text-xl text-amber-950 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/60 px-4 py-2 rounded-lg border-l-4 border-amber-600 my-1.5 tracking-wide shadow-2xs leading-relaxed"
              >
                {cleanVerse}
              </div>
            );
          }

          return (
            <p key={idx} className="text-base md:text-lg leading-relaxed text-current/90">
              {renderInlineMarkdown(line)}
            </p>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectBookHandler = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setShowGurusInfo(false);
    if (book.id === 'sthan_galfa_maap' || book.id === 'pramukh_sthananchya_galphache_map') {
      setShowGalfaTable(true);
    } else {
      setShowGalfaTable(false);
    }
    onBookRead(book.title);
  };

  return (
    <div id="granthalaya-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px]">
      {/* Granthalaya Header & Main Section */}
      {!selectedBook ? (
        <div className="p-4 sm:p-6 bg-gradient-to-b from-[#FFF8EE] to-amber-50/50 min-h-[500px]">
          
          {/* Sacred Books Section Title */}
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs font-devanagari border border-amber-300 mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              महानुभाव वाङ्मय संग्रह
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-purple-800 font-devanagari leading-tight drop-shadow-2xs">
              महानुभाव पंथीय पवित्र ग्रंथ
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-devanagari mt-1">
              सर्वज्ञ श्रीचक्रधर स्वामी उपदेशीत आद्य मराठी ग्रंथ, सूत्रपाठ, दृष्टांतपाठ व आरत्या
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-3xl mx-auto">
            {[
              { id: 'all', mr: 'सर्व', hi: 'सभी', en: 'All' },
              { id: 'mukhya', mr: 'मुख्य', hi: 'मुख्य', en: 'Main' },
              { id: 'stavan_stotra', mr: 'स्तवन स्तोत्र', hi: 'स्तवन स्तोत्र', en: 'Stavan & Stotra' },
              { id: 'parayan', mr: 'पारायण', hi: 'पारायण', en: 'Parayan' },
              { id: 'arti', mr: 'आरती', hi: 'आरती', en: 'Aarti' },
              { id: 'bhajan', mr: 'भजन', hi: 'भजन', en: 'Bhajan' },
              { id: 'drishtant', mr: 'दृष्टांत', hi: 'दृष्टांत', en: 'Drishtant' }
            ].map(chip => {
              const isSelected = selectedSubCategory === chip.id ||
                (chip.id === 'stavan_stotra' && (selectedSubCategory === 'stavan_prarthana' || selectedSubCategory === 'sutra' || selectedSubCategory === 'stotra'));
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedSubCategory(chip.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black font-devanagari transition-all cursor-pointer border shadow-sm flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-[#FFD54F] shadow-amber-500/30 shadow-md scale-105'
                      : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100/60 hover:border-amber-300'
                  }`}
                >
                  <span>{lang === 'mr' ? chip.mr : lang === 'hi' ? chip.hi : chip.en}</span>
                </button>
              );
            })}
          </div>

          {/* Sacred Books Cards List - Stacked vertically as horizontal strips (Lamb Patti) */}
          <div className="flex flex-col gap-3.5 max-w-3xl mx-auto">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-3xl border-2 border-[#FFD54F] p-8 shadow-sm">
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-bounce" />
                <p className="text-sm text-gray-500 font-devanagari">
                  {lang === 'mr' ? 'या वर्गवारीत कोणताही ग्रंथ उपलब्ध नाही.' : lang === 'hi' ? 'इस श्रेणी में कोई ग्रंथ उपलब्ध नहीं है।' : 'No books found in this category.'}
                </p>
              </div>
            ) : (
              filteredBooks.map((book, index) => {
                const icons = ['📖', '📜', '📕', '🛕', '🪔'];
                const cardIcon = icons[index % icons.length];
                const marathiNumbers = ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०', '११', '१२', '१३', '१४', '१५'];
                const numBadge = marathiNumbers[index] || `${index + 1}`;

                // Distinct vibrant gradient themes for each card
                const cardGradients = [
                  {
                    bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
                    border: 'border-amber-300/80',
                    textMain: 'text-white',
                    textSub: 'text-amber-100',
                    badge: 'bg-amber-950/30 text-amber-100 border-amber-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-amber-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700',
                    border: 'border-pink-300/80',
                    textMain: 'text-white',
                    textSub: 'text-pink-100',
                    badge: 'bg-pink-950/30 text-pink-100 border-pink-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-rose-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700',
                    border: 'border-blue-300/80',
                    textMain: 'text-white',
                    textSub: 'text-blue-100',
                    badge: 'bg-blue-950/30 text-blue-100 border-blue-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-indigo-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700',
                    border: 'border-emerald-300/80',
                    textMain: 'text-white',
                    textSub: 'text-emerald-100',
                    badge: 'bg-emerald-950/30 text-emerald-100 border-emerald-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-teal-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-700',
                    border: 'border-purple-300/80',
                    textMain: 'text-white',
                    textSub: 'text-purple-100',
                    badge: 'bg-purple-950/30 text-purple-100 border-purple-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-purple-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700',
                    border: 'border-cyan-300/80',
                    textMain: 'text-white',
                    textSub: 'text-cyan-100',
                    badge: 'bg-cyan-950/30 text-cyan-100 border-cyan-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-teal-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-600',
                    border: 'border-red-300/80',
                    textMain: 'text-white',
                    textSub: 'text-orange-100',
                    badge: 'bg-red-950/30 text-red-100 border-red-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-red-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                  {
                    bg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-700',
                    border: 'border-violet-300/80',
                    textMain: 'text-white',
                    textSub: 'text-violet-100',
                    badge: 'bg-violet-950/30 text-violet-100 border-violet-200/50',
                    btnBg: 'bg-white/20 group-hover:bg-white text-white group-hover:text-violet-700 border-white/40',
                    iconBg: 'bg-white/20 text-white border-white/30',
                  },
                ];

                const theme = cardGradients[index % cardGradients.length];

                return (
                  <div
                    key={book.id}
                    id={`book-card-${book.id}`}
                    onClick={() => selectBookHandler(book)}
                    className={`relative overflow-hidden rounded-2xl ${theme.bg} ${theme.border} border shadow-lg hover:shadow-2xl p-3.5 sm:p-4 text-white flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 group`}
                  >
                    {/* Background Subtle Accent Icon */}
                    <div className="absolute right-12 -bottom-2 text-6xl opacity-10 select-none pointer-events-none group-hover:scale-125 transition-transform duration-500">
                      {cardIcon}
                    </div>

                    {/* Left side: Icon Box + Title & Subtitle */}
                    <div className="flex items-center gap-3.5 min-w-0 z-10">
                      <div className="relative shrink-0 flex items-center justify-center">
                        <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} backdrop-blur-md flex items-center justify-center text-xl font-bold border transform group-hover:scale-105 transition-transform shadow-sm`}>
                          {cardIcon}
                        </div>
                        <span className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-full text-[10px] font-black font-sans bg-black/40 text-white border border-white/40 backdrop-blur-xs shadow-xs">
                          #{numBadge}
                        </span>
                      </div>

                      {/* Text details */}
                      <div className="min-w-0">
                        <h3 className="font-black text-base sm:text-lg font-devanagari leading-snug text-white drop-shadow-xs truncate">
                          {book.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <p className={`text-xs ${theme.textSub} font-medium font-sans truncate`}>
                            {book.titleEn || book.author || 'पवित्र ग्रंथ'}
                          </p>
                          {book.chaptersCount ? (
                            <span className={`text-[10px] font-bold font-devanagari ${theme.badge} backdrop-blur-xs px-2.5 py-0.5 rounded-full border`}>
                              {book.chaptersCount} {lang === 'mr' ? 'अध्याय / भाग' : 'Chapters'}
                            </span>
                          ) : (
                            <span className={`text-[10px] font-bold font-devanagari ${theme.badge} backdrop-blur-xs px-2.5 py-0.5 rounded-full border`}>
                              {lang === 'mr' ? 'रिक्त ग्रंथ (Blank Book)' : 'Blank Book'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Action Button */}
                    <div className="shrink-0 flex items-center gap-2 z-10">
                      <button className={`w-10 h-10 rounded-full ${theme.btnBg} border flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110 group-hover:shadow-lg`}>
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Bhajan Player when Bhajan category is selected */}
          {selectedSubCategory === 'bhajan' && bhajans && bhajans.length > 0 && (
            <div className="mt-8 max-w-4xl mx-auto border-t-2 border-amber-200/80 pt-6">
              <BhajanList bhajans={bhajans} onBhajanPlay={onBhajanPlay} lang={lang} />
            </div>
          )}

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[450px]">
          {/* Book / Chapter Sidebar */}
          {selectedBook?.id !== 'sthan_darshan' && (
            <div className="border-r border-saffron-100 p-4 bg-saffron-50/30">
              <div>
                <button
                  onClick={() => { setSelectedBook(null); setSelectedChapter(null); setShowGurusInfo(false); stopSpeech(); stopGuruSpeech(); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-saffron-600 hover:text-saffron-700 mb-4 transition-all font-sans"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {translations.backToBooks[lang]}
                </button>

                <div className="mb-4 p-3 bg-saffron-50 rounded-xl border border-saffron-100">
                  <h4 className="font-bold text-saffron-800 text-sm md:text-base font-devanagari truncate">{selectedBook.title}</h4>
                </div>

              {/* Google Book Style Fullscreen Reader Button */}
              <button
                onClick={() => {
                  setIsFullscreenReader(true);
                  stopSpeech();
                  stopGuruSpeech();
                }}
                className="w-full text-center p-2.5 rounded-xl border mb-4 transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-saffron-500 to-amber-500 text-white hover:from-saffron-600 hover:to-amber-600 font-bold text-xs md:text-sm shadow-xs cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 shrink-0" />
                <span>
                  {selectedBook.id === 'drishtantapath'
                    ? (lang === 'mr' ? 'गूगल बुक वाचन (सर्व दृष्टांत)' : lang === 'hi' ? 'गूगल बुक वाचन (सभी दृष्टांत)' : 'Google Books Style (All Stories)')
                    : (lang === 'mr' ? 'गूगल बुक वाचन (पूर्ण स्क्रीन)' : lang === 'hi' ? 'गूगल बुक वाचन (पूर्ण स्क्रीन)' : 'Google Books Fullscreen Reader')}
                </span>
              </button>

              {/* 24 Gurus Feature Button */}
              {selectedBook.id === 'shreedattatreyacharitra' && (
                <button
                  onClick={() => {
                    setShowGurusInfo(true);
                    setSelectedChapter(null);
                    stopSpeech();
                    stopGuruSpeech();
                  }}
                  className={`w-full text-left p-3 rounded-xl border mb-4 transition-all flex items-center gap-3 group ${
                    showGurusInfo
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md font-medium'
                      : 'bg-gradient-to-r from-amber-50 to-amber-100/50 hover:from-amber-100 border-amber-200 text-amber-800 hover:border-amber-300'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    showGurusInfo ? 'bg-white text-amber-600' : 'bg-amber-200 text-amber-800'
                  }`}>
                    ✨
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs md:text-sm font-devanagari">
                      {lang === 'mr' ? '२४ गुरु दर्शन व बोध' : lang === 'hi' ? '२४ गुरु दर्शन व सीख' : '24 Gurus Wisdom'}
                    </h4>
                    <p className={`text-[10px] ${showGurusInfo ? 'text-amber-100' : 'text-amber-700/80'} font-sans truncate`}>
                      {lang === 'mr' ? 'दत्त महाराजांचे २४ गुरु सविस्तर' : lang === 'hi' ? 'दत्त महाराज के २४ गुरु विस्तार में' : 'Detailed guide of 24 Gurus'}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 shrink-0 transition-transform ${showGurusInfo ? 'rotate-90' : ''}`} />
                </button>
              )}

              {/* Galfa Measurement Table Feature Button */}
              {(selectedBook.id === 'sthan_galfa_maap' || selectedBook.id === 'pramukh_sthananchya_galphache_map') && (
                <button
                  onClick={() => {
                    setShowGalfaTable(true);
                    setSelectedChapter(null);
                    stopSpeech();
                    stopGuruSpeech();
                  }}
                  className={`w-full text-left p-3 rounded-xl border mb-4 transition-all flex items-center gap-3 group cursor-pointer ${
                    showGalfaTable && !selectedChapter
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-amber-500 shadow-md font-medium'
                      : 'bg-gradient-to-r from-amber-50 to-orange-50/60 hover:from-amber-100 border-amber-300 text-amber-900 hover:border-amber-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 shadow-xs ${
                    showGalfaTable && !selectedChapter ? 'bg-white text-amber-700 font-bold' : 'bg-amber-200 text-amber-900'
                  }`}>
                    📐
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs md:text-sm font-devanagari">
                      {lang === 'mr' ? 'सर्व स्थानांची गल्फ माप सारणी' : 'Galfa Measurements Table'}
                    </h4>
                    <p className={`text-[10px] ${showGalfaTable && !selectedChapter ? 'text-amber-100' : 'text-amber-700'} font-sans truncate`}>
                      {lang === 'mr' ? '४९ गावे व १२४ स्थाने अधिकृत नोंद' : '49 Villages & 124 Sacred Sthans'}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-80 shrink-0 transition-transform ${showGalfaTable && !selectedChapter ? 'rotate-90' : ''}`} />
                </button>
              )}

              {/* Leela Charitra Parts Sub-menu Tabs */}
              {selectedBook.id === 'leela_charitra' && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {lang === 'mr' ? 'भाग निवडा' : lang === 'hi' ? 'भाग चुनें' : 'Select Part'}
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-saffron-50 rounded-xl border border-saffron-100">
                    <button
                      onClick={() => {
                        setSelectedLeelaPart('purvardh');
                        setSelectedChapter(null);
                        stopSpeech();
                        stopGuruSpeech();
                      }}
                      className={`py-2 px-2 text-center rounded-lg font-bold text-xs md:text-sm font-devanagari transition-all cursor-pointer ${
                        selectedLeelaPart === 'purvardh'
                          ? 'bg-saffron-500 text-white shadow-xs'
                          : 'text-saffron-700 hover:bg-saffron-100/50 hover:text-saffron-800'
                      }`}
                    >
                      {lang === 'mr' ? 'लीळाचरित्र पूर्वार्ध' : lang === 'hi' ? 'लीलाचरित्र पूर्वार्ध' : 'Purvardh'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLeelaPart('uttarardh');
                        setSelectedChapter(null);
                        stopSpeech();
                        stopGuruSpeech();
                      }}
                      className={`py-2 px-2 text-center rounded-lg font-bold text-xs md:text-sm font-devanagari transition-all cursor-pointer ${
                        selectedLeelaPart === 'uttarardh'
                          ? 'bg-saffron-500 text-white shadow-xs'
                          : 'text-saffron-700 hover:bg-saffron-100/50 hover:text-saffron-800'
                      }`}
                    >
                      {lang === 'mr' ? 'लीळाचरित्र उत्तरार्ध' : lang === 'hi' ? 'लीलाचरित्र उत्तरार्ध' : 'Uttarardh'}
                    </button>
                  </div>
                </div>
              )}

              {/* Leela Charitra / Book Chapter Search Bar */}
              <div className="mb-3 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none" />
                <input
                  type="text"
                  value={chapterSearchQuery}
                  onChange={(e) => setChapterSearchQuery(e.target.value)}
                  placeholder={
                    selectedBook.id === 'leela_charitra'
                      ? 'लीला, व्यक्ती, गाव, सूत्र शोधा...'
                      : (lang === 'mr' ? 'अध्याय / प्रकरण शोधा...' : lang === 'hi' ? 'अध्याय खोजें...' : 'Search chapters...')
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-white border border-amber-300 focus:border-amber-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-devanagari shadow-2xs text-gray-800 placeholder-gray-400"
                />
                {chapterSearchQuery && (
                  <button
                    onClick={() => setChapterSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold p-0.5 rounded-full cursor-pointer"
                    title="Clear"
                  >
                    ✕
                  </button>
                )}
              </div>

              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {lang === 'mr' ? 'अध्याय / प्रकरण सूची' : lang === 'hi' ? 'अध्याय / प्रकरण सूची' : 'Chapter List'}
              </h3>
              <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                {filteredChapters.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    {lang === 'mr' ? 'कोणताही अध्याय उपलब्ध नाही.' : lang === 'hi' ? 'कोई अध्याय उपलब्ध नहीं है।' : 'No chapters available.'}
                  </p>
                ) : (
                  filteredChapters.map(chap => (
                    <div key={chap.id} className="space-y-1">
                      <button
                        id={`chap-btn-${chap.id}`}
                        onClick={() => { setSelectedChapter(chap); setShowGalfaTable(false); setShowGurusInfo(false); stopSpeech(); stopGuruSpeech(); }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs md:text-sm transition-all flex items-center justify-between border cursor-pointer ${
                          selectedChapter?.id === chap.id
                            ? 'bg-saffron-500 text-white border-saffron-500 font-medium'
                            : 'bg-white hover:bg-saffron-50 border-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-devanagari truncate mr-2">{chap.title}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {bookmarks.includes(chap.id) && (
                            <Bookmark className={`w-3 h-3 ${selectedChapter?.id === chap.id ? 'fill-white text-white' : 'fill-saffron-500 text-saffron-500'}`} />
                          )}
                          <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                        </div>
                      </button>

                      {/* Submenu for Pujavasar (sp_18) */}
                      {chap.id === 'sp_18' && selectedChapter?.id === 'sp_18' && (
                        <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-saffron-400 my-1 bg-saffron-50/60 rounded-r-lg">
                          {[
                            { id: 'all', label: lang === 'mr' ? 'सर्व पूजावसर' : lang === 'hi' ? 'सभी पूजावसर' : 'All Pujavasar' },
                            { id: 'pratah', label: '१. प्रातःकाळ पूजावसर' },
                            { id: 'madhyanh', label: '२. मध्यान्हकाळ पूजावसर' },
                            { id: 'sayan', label: '३. सायंकाळ पूजावसर' }
                          ].map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setPujavasarSubMenu(sub.id as any);
                                if (isPlaying) stopSpeech();
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs font-devanagari transition-all cursor-pointer ${
                                pujavasarSubMenu === sub.id
                                  ? 'bg-saffron-600 text-white font-semibold shadow-xs'
                                  : 'text-saffron-900 hover:bg-saffron-100/70'
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reading Panel */}
        <div className={`${selectedBook?.id === 'sthan_darshan' ? 'col-span-1 md:col-span-3' : 'col-span-1 md:col-span-2'} p-6 flex flex-col bg-white`}>
          {selectedBook?.id === 'sthan_darshan' ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Sthan Darshan Layout Header */}
              <div className="border-b border-gray-100 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedBook(null); setSelectedChapter(null); setShowGurusInfo(false); }}
                    className="p-2 border border-saffron-200 text-saffron-600 hover:bg-saffron-50 rounded-xl transition-all"
                    title={translations.backToBooks[lang]}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-xs text-saffron-600 font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-saffron-500 animate-pulse" />
                      {lang === 'mr' ? 'तीर्थक्षेत्र आणि लीळा स्थान दर्शन' : lang === 'hi' ? 'तीर्थक्षेत्र और लीला स्थान दर्शन' : 'Holy Places & Leela Maps'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-950 font-devanagari mt-1">
                      {lang === 'mr' ? 'पवित्र महानुभाव स्थान दर्शन' : lang === 'hi' ? 'पवित्र महानुभाव स्थान दर्शन' : 'Sacred Sthan Darshan Guide'}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <SthanMap lang={lang} />
              </div>
            </div>
          ) : showGurusInfo && selectedBook?.id === 'shreedattatreyacharitra' ? (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs text-amber-600 font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    {lang === 'mr' ? 'अत्रिकुमार अवधूत उपदेश' : lang === 'hi' ? 'अत्रिकुमार अवधूत उपदेश' : 'Avadhuta Wisdom'}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-950 font-devanagari mt-1">
                    {lang === 'mr' ? 'भगवान दत्तात्रेयांचे २४ दिव्य गुरु' : lang === 'hi' ? 'भगवान दत्तात्रेय के २४ दिव्य गुरु' : '24 Divine Gurus of Lord Dattatreya'}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans mt-1">
                    {lang === 'mr' ? 'दत्तगुरूंनी निसर्गातील २४ तत्त्वांकडून घेतलेली जीवनोपयोगी व आध्यात्मिक शिकवण' : lang === 'hi' ? 'दत्तगुरु द्वारा प्रकृति के २४ तत्वों से प्राप्त जीवनोपयोगी व आध्यात्मिक शिक्षाएं' : 'The 24 spiritual and practical lessons learned by Lord Dattatreya from nature.'}
                  </p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={lang === 'mr' ? 'गुरूंचे नाव, शिकवण किंवा बोध शोधा...' : lang === 'hi' ? 'गुरु का नाम, सीख या उपदेश खोजें...' : 'Search gurus, lessons or wisdom...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-sans"
                    />
                  </div>

                  {/* Filter Select or Chips */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {[
                      { id: 'all', label: lang === 'mr' ? 'सर्व' : lang === 'hi' ? 'सभी' : 'All' },
                      { id: 'elements', label: lang === 'mr' ? 'महाभूत' : lang === 'hi' ? 'महाभूत' : 'Elements' },
                      { id: 'animals', label: lang === 'mr' ? 'प्राणी व पक्षी' : lang === 'hi' ? 'पक्षी व प्राणी' : 'Animals' },
                      { id: 'human', label: lang === 'mr' ? 'मानव' : lang === 'hi' ? 'मानव' : 'Human' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveCategory(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                          activeCategory === tab.id
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {activeCategory === tab.id && <Filter className="w-3 h-3" />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gurus Grid */}
              <div className="flex-1 max-h-[550px] overflow-y-auto custom-scrollbar pr-1 space-y-4">
                {dattatreyaGurus
                  .filter(guru => {
                    const matchesSearch = 
                      guru.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                      guru.observation[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                      guru.lesson[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                      guru.explanation[lang].toLowerCase().includes(searchQuery.toLowerCase());
                    
                    if (activeCategory === 'all') return matchesSearch;
                    
                    const catEn = guru.category.en;
                    if (activeCategory === 'elements' && catEn === 'Elements') return matchesSearch;
                    if (activeCategory === 'animals' && catEn === 'Animals & Birds') return matchesSearch;
                    if (activeCategory === 'human' && catEn === 'Human') return matchesSearch;
                    return false;
                  })
                  .length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Info className="w-10 h-10 text-gray-400 mx-auto mb-2.5" />
                      <p className="text-sm text-gray-500 font-sans">
                        {lang === 'mr' ? 'शोधलेला गुरु किंवा बोध आढळला नाही.' : lang === 'hi' ? 'कोई गुरु या सीख नहीं मिली।' : 'No matching guru or wisdom found.'}
                      </p>
                    </div>
                  ) : (
                    dattatreyaGurus
                      .filter(guru => {
                        const matchesSearch = 
                          guru.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guru.observation[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guru.lesson[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guru.explanation[lang].toLowerCase().includes(searchQuery.toLowerCase());
                        
                        if (activeCategory === 'all') return matchesSearch;
                        
                        const catEn = guru.category.en;
                        if (activeCategory === 'elements' && catEn === 'Elements') return matchesSearch;
                        if (activeCategory === 'animals' && catEn === 'Animals & Birds') return matchesSearch;
                        if (activeCategory === 'human' && catEn === 'Human') return matchesSearch;
                        return false;
                      })
                      .map((guru) => (
                        <div
                          key={guru.id}
                          className="bg-amber-50/10 border border-amber-100 hover:border-amber-200 rounded-2xl p-5 hover:shadow-md transition-all relative overflow-hidden group/card"
                        >
                          {/* Soft background glow */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/10 rounded-full blur-2xl group-hover/card:bg-amber-200/20 transition-all pointer-events-none" />

                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-4 mb-3 border-b border-amber-50 pb-2.5">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl leading-none">{guru.symbol}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">
                                    {lang === 'mr' ? `गुरू #${guru.id}` : lang === 'hi' ? `गुरु #${guru.id}` : `GURU #${guru.id}`}
                                  </span>
                                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-sans">
                                    {guru.category[lang]}
                                  </span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-950 font-devanagari mt-1">
                                  {guru.name[lang]}
                                </h4>
                              </div>
                            </div>

                            {/* TTS Button */}
                            <button
                              onClick={() => currentlyPlayingGuruId === guru.id ? stopGuruSpeech() : startGuruSpeech(guru)}
                              className={`p-2 rounded-xl border transition-all ${
                                currentlyPlayingGuruId === guru.id
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 hover:border-amber-200 shadow-sm'
                              }`}
                              title={currentlyPlayingGuruId === guru.id ? "थांबवा" : "ऐका (Listen)"}
                            >
                              {currentlyPlayingGuruId === guru.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4 fill-amber-700 text-amber-700" />
                              )}
                            </button>
                          </div>

                          {/* Observation / Details */}
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans mb-1">
                                {lang === 'mr' ? '👀 दत्तात्रेयांचे निरीक्षण :' : lang === 'hi' ? '👀 दत्त महाराज का अवलोकन :' : '👀 Observation:'}
                              </h5>
                              <p className="text-sm text-gray-700 leading-relaxed font-devanagari">
                                {guru.observation[lang]}
                              </p>
                            </div>

                            {/* Lesson Callout */}
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl">
                              <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider font-sans mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                {lang === 'mr' ? '💡 प्राप्त शिकवण / बोध :' : lang === 'hi' ? '💡 प्राप्त सीख / उपदेश :' : '💡 The Lesson / Wisdom:'}
                              </h5>
                              <p className="text-sm md:text-base font-medium text-amber-950 leading-relaxed font-devanagari">
                                {guru.lesson[lang]}
                              </p>
                            </div>

                            {/* Explanation */}
                            <div>
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans mb-1">
                                {lang === 'mr' ? '✨ अध्यात्मिक महत्त्व :' : lang === 'hi' ? '✨ आध्यात्मिक महत्त्व :' : '✨ Spiritual Significance:'}
                              </h5>
                              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                                {guru.explanation[lang]}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
              </div>
            </div>
          ) : ((showGalfaTable || selectedBook?.id === 'sthan_galfa_maap' || selectedBook?.id === 'pramukh_sthananchya_galphache_map') && !selectedChapter) ? (
            <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto max-h-[850px] custom-scrollbar bg-gradient-to-b from-amber-50/20 to-white">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg border border-amber-300/40 relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-3 py-0.5 rounded-full bg-black/20 text-white text-xs font-bold font-devanagari border border-white/30 backdrop-blur-xs flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-amber-200" />
                        अधिकृत प्रमाणबद्ध माप संग्रह
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                        ४९ गावे • १२४ स्थाने
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-devanagari leading-tight drop-shadow-sm flex items-center gap-2">
                      <span>📐</span>
                      <span>सर्व स्थानांची गल्फ माप सारणी</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-100 font-devanagari mt-1 max-w-2xl leading-relaxed">
                      महानुभाव पंथातील पावन तीर्थस्थानांच्या गल्फांचे (पवित्र आसनावरील रेशमी/मखमली वस्त्र) अधिकृत प्रमाणबद्ध मोजमाप (लांबी × रुंदी × उंची इंचामध्ये).
                    </p>
                  </div>

                  {/* Header Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={copyAllGalfaList}
                      className="px-3.5 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs font-devanagari shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
                      <span>{copiedAll ? 'सर्व मापे कॉपी केली!' : 'सर्व १२४ स्थाने कॉपी करा'}</span>
                    </button>

                    <button
                      onClick={() => setShowGalfaInfo(!showGalfaInfo)}
                      className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold text-xs font-devanagari backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-200" />
                      <span>{showGalfaInfo ? 'माहिती लपवा' : 'गल्फ म्हणजे काय?'}</span>
                    </button>
                  </div>
                </div>

                {/* Metric Summary Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/25">
                  <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 text-center border border-white/20">
                    <div className="text-lg sm:text-2xl font-black font-devanagari text-amber-100">४९</div>
                    <div className="text-[11px] text-white/90 font-medium font-devanagari">गावे / तीर्थक्षेत्रे</div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 text-center border border-white/20">
                    <div className="text-lg sm:text-2xl font-black font-devanagari text-white">१२४</div>
                    <div className="text-[11px] text-white/90 font-medium font-devanagari">एकूण पवित्र स्थाने</div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 text-center border border-white/20">
                    <div className="text-lg sm:text-2xl font-black font-devanagari text-amber-100">१०</div>
                    <div className="text-[11px] text-white/90 font-medium font-devanagari">जिल्हे</div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 text-center border border-white/20">
                    <div className="text-lg sm:text-2xl font-black font-devanagari text-white">इंच (″)</div>
                    <div className="text-[11px] text-white/90 font-medium font-devanagari">लांबी × रुंदी × उंची</div>
                  </div>
                </div>
              </div>

              {/* Explanatory Collapsible Box */}
              {showGalfaInfo && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 mb-6 text-amber-950 font-devanagari animate-fade-in shadow-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                      <h4 className="font-bold text-base text-amber-900">गल्फ म्हणजे काय व त्याचे धार्मिक महत्त्व?</h4>
                      <p>
                        महानुभाव पंथात सर्वज्ञ श्री चक्रधर स्वामी, श्री गोविंदप्रभू महाराज व पंचकृष्णांच्या पदस्पर्शाने पावन झालेल्या प्रत्येक पवित्र स्थानावर (ओटा, चरण, आसन, गाभारा, पलंग) रेशमी, मखमली अथवा जरीकामयुक्त वस्त्र परिधान केले जाते, त्यास <strong>"गल्फ"</strong> म्हणतात.
                      </p>
                      <p>
                        प्रत्येक तीर्थस्थानाचा ओटा व आसन वेगवेगळ्या आकाराचे असल्याने गल्फाची लांबी, रुंदी आणि उंची निश्चित ठरलेली असते. भाविक, भक्त व सेवा मंडळांना स्थानावर अर्पण करण्यासाठी नवीन गल्फ शिवून आणताना हे अधिकृत मोजमाप अत्यंत आवश्यक असते.
                      </p>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-xs font-sans text-amber-900 mt-2">
                        📐 <strong>मापाचे स्वरूप :</strong> सर्व आकडे इंचामध्ये (Inches) आहेत. उदाहरणार्थ : ६०″ × २४″ × २०″ म्हणजे लांबी ६० इंच, रुंदी २४ इंच, आणि उंची २० इंच.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls: Search, District Filter & View Mode */}
              <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none" />
                    <input
                      type="text"
                      value={galfaSearch}
                      onChange={(e) => setGalfaSearch(e.target.value)}
                      placeholder="गाव, स्थान, जिल्हा किंवा माप शोधा... (उदा. फलटण, रिध्दपूर, मुख्यस्थान, ७२)"
                      className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-amber-50/40 border border-amber-300 focus:border-amber-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-devanagari text-gray-800 placeholder-gray-400"
                    />
                    {galfaSearch && (
                      <button
                        onClick={() => setGalfaSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold p-0.5 rounded-full cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Village Select Dropdown */}
                  <div className="w-full md:w-56 shrink-0">
                    <select
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      className="w-full py-2 px-3 text-xs md:text-sm bg-white border border-amber-300 focus:border-amber-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-devanagari text-gray-800 cursor-pointer shadow-2xs"
                    >
                      <option value="all">सर्व ४९ गावे ({galfaVillages.length})</option>
                      {galfaVillages.map((v) => (
                        <option key={v} value={v}>
                          {v} ({galfaMeasurementsList.filter(item => item.village === v).length} स्थाने)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode Toggle Buttons */}
                  <div className="flex items-center gap-1 bg-amber-100/60 p-1 rounded-xl border border-amber-200 shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => setGalfaViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-devanagari flex items-center gap-1.5 transition-all cursor-pointer ${
                        galfaViewMode === 'table'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                      title="सारणी स्वरूप"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>सारणी</span>
                    </button>
                    <button
                      onClick={() => setGalfaViewMode('grouped')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-devanagari flex items-center gap-1.5 transition-all cursor-pointer ${
                        galfaViewMode === 'grouped'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                      title="गावानुसार गट (४९ गावे)"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>गावानुसार</span>
                    </button>
                    <button
                      onClick={() => setGalfaViewMode('cards')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-devanagari flex items-center gap-1.5 transition-all cursor-pointer ${
                        galfaViewMode === 'cards'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                      title="कार्ड स्वरूप"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>कार्ड्स</span>
                    </button>
                  </div>
                </div>

                {/* District Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
                  <span className="text-gray-500 font-devanagari font-bold shrink-0 mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-amber-600" />
                    जिल्हा :
                  </span>
                  <button
                    onClick={() => setSelectedDistrict('all')}
                    className={`px-2.5 py-1 rounded-full font-bold font-devanagari whitespace-nowrap transition-all cursor-pointer border ${
                      selectedDistrict === 'all'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    सर्व ({galfaMeasurementsList.length})
                  </button>
                  {galfaDistricts.map(dist => {
                    const count = galfaMeasurementsList.filter(item => item.district === dist).length;
                    return (
                      <button
                        key={dist}
                        onClick={() => setSelectedDistrict(dist)}
                        className={`px-2.5 py-1 rounded-full font-bold font-devanagari whitespace-nowrap transition-all cursor-pointer border ${
                          selectedDistrict === dist
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                        }`}
                      >
                        {dist} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Results Count */}
              <div className="flex items-center justify-between text-xs text-gray-600 mb-3 px-1 font-devanagari">
                <div>
                  दर्शवित आहे: <strong>{filteredGalfaList.length}</strong> स्थाने 
                  {selectedDistrict !== 'all' && <span> (जिल्हा: {selectedDistrict})</span>}
                  {selectedVillage !== 'all' && <span> (गाव: {selectedVillage})</span>}
                  {galfaSearch && <span> (शोध: "{galfaSearch}")</span>}
                </div>
                {(selectedDistrict !== 'all' || selectedVillage !== 'all' || galfaSearch) && (
                  <button
                    onClick={() => {
                      setSelectedDistrict('all');
                      setSelectedVillage('all');
                      setGalfaSearch('');
                    }}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    सर्व फिल्टर पूर्ववत करा
                  </button>
                )}
              </div>

              {/* No Results */}
              {filteredGalfaList.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-amber-200 p-8 shadow-sm">
                  <Ruler className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-gray-800 font-devanagari">कोणतीही नोंद आढळली नाही</p>
                  <p className="text-xs text-gray-500 font-devanagari mt-1">कृपया शोध शब्द किंवा जिल्हा तपासा.</p>
                  <button
                    onClick={() => {
                      setSelectedDistrict('all');
                      setSelectedVillage('all');
                      setGalfaSearch('');
                    }}
                    className="mt-4 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 font-devanagari cursor-pointer"
                  >
                    सर्व १२४ स्थाने पहा
                  </button>
                </div>
              ) : galfaViewMode === 'table' ? (
                /* 1. TABLE VIEW */
                <div className="bg-white rounded-2xl border border-amber-200 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-devanagari">
                      <thead>
                        <tr className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                          <th className="py-3 px-3 text-center font-bold border-b border-amber-700 w-12">#</th>
                          <th className="py-3 px-3 font-bold border-b border-amber-700">गाव / तीर्थक्षेत्र</th>
                          <th className="py-3 px-3 font-bold border-b border-amber-700">पवित्र स्थान</th>
                          <th className="py-3 px-3 text-center font-bold border-b border-amber-700">लांबी (इंच)</th>
                          <th className="py-3 px-3 text-center font-bold border-b border-amber-700">रुंदी (इंच)</th>
                          <th className="py-3 px-3 text-center font-bold border-b border-amber-700">उंची (इंच)</th>
                          <th className="py-3 px-3 text-center font-bold border-b border-amber-700">पूर्ण माप (L×W×H)</th>
                          <th className="py-3 px-3 font-bold border-b border-amber-700">विशेष नोंद</th>
                          <th className="py-3 px-2 text-center font-bold border-b border-amber-700 w-16">कॉपी</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {filteredGalfaList.map((item, idx) => (
                          <tr
                            key={item.id}
                            className={`transition-colors hover:bg-amber-50/70 ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-[#FFFDF7]'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-500 text-xs">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-gray-900 font-devanagari">{item.village}</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {item.district && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100/70 text-amber-800 font-semibold border border-amber-200">
                                    जि. {item.district}
                                  </span>
                                )}
                                {item.villageEn && (
                                  <span className="text-[10px] text-gray-400 font-sans">
                                    {item.villageEn}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-gray-800 flex items-center gap-1.5 font-devanagari">
                                <span className="text-amber-500 text-xs">🛕</span>
                                <span>{item.sthan}</span>
                              </div>
                              {item.sthanEn && (
                                <span className="text-[10px] text-gray-400 font-sans block pl-4">
                                  {item.sthanEn}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-900 bg-amber-50/40">
                              {item.length}″
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-900 bg-amber-50/40">
                              {item.width}″
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-900 bg-amber-50/40">
                              {item.height}″
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-[11px] border border-amber-300">
                                {item.length}″ × {item.width}″ × {item.height}″
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-600 text-xs font-devanagari">
                              {item.note ? (
                                <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  {item.note}
                                </span>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => copyGalfaRow(item)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  copiedId === item.id
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-amber-100 hover:text-amber-800'
                                }`}
                                title="हे माप कॉपी करा"
                              >
                                {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : galfaViewMode === 'grouped' ? (
                /* 2. GROUPED BY VILLAGE (49 VILLAGES) */
                <div className="space-y-4">
                  {Object.entries(groupedGalfaByVillage).map(([villageName, sthans], vIdx) => {
                    const dist = sthans[0]?.district;
                    const vEn = sthans[0]?.villageEn;
                    return (
                      <div
                        key={villageName}
                        className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-100/40 p-3.5 sm:p-4 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                              {vIdx + 1}
                            </span>
                            <div>
                              <h3 className="font-black text-base sm:text-lg text-gray-900 font-devanagari flex items-center gap-2">
                                <span>{villageName}</span>
                                {vEn && <span className="text-xs font-normal text-gray-500 font-sans">({vEn})</span>}
                              </h3>
                              {dist && (
                                <span className="text-[11px] text-amber-800 font-devanagari font-semibold">
                                  जिल्हा: {dist}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 font-devanagari font-bold text-xs border border-amber-300">
                              {sthans.length} {sthans.length > 1 ? 'स्थाने' : 'स्थान'}
                            </span>
                            <button
                              onClick={() => {
                                const text = sthans.map((s, i) => `${i + 1}. ${villageName} - ${s.sthan} : लांबी ${s.length}″ × रुंदी ${s.width}″ × उंची ${s.height}″ ${s.note ? ' [' + s.note + ']' : ''}`).join('\n');
                                navigator.clipboard.writeText(`॥ ${villageName} गल्फ मापे ॥\n\n${text}`);
                                setCopiedId(`v_${villageName}`);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-amber-800 text-xs font-devanagari font-bold flex items-center gap-1 cursor-pointer transition-all"
                              title="या गावातील सर्व मापे कॉपी करा"
                            >
                              {copiedId === `v_${villageName}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === `v_${villageName}` ? 'कॉपी झाले!' : 'कॉपी'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 overflow-x-auto">
                          <table className="w-full text-left text-xs md:text-sm font-devanagari">
                            <thead>
                              <tr className="border-b border-gray-100 text-gray-500 font-bold text-[11px]">
                                <th className="py-1.5 px-2">स्थान</th>
                                <th className="py-1.5 px-2 text-center">लांबी</th>
                                <th className="py-1.5 px-2 text-center">रुंदी</th>
                                <th className="py-1.5 px-2 text-center">उंची</th>
                                <th className="py-1.5 px-2 text-center">आकारमान (L×W×H)</th>
                                <th className="py-1.5 px-2">विशेष नोंद</th>
                                <th className="py-1.5 px-2 text-center w-12">कॉपी</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {sthans.map((s) => (
                                <tr key={s.id} className="hover:bg-amber-50/40">
                                  <td className="py-2 px-2 font-bold text-gray-800 flex items-center gap-1.5">
                                    <span className="text-amber-500">🛕</span>
                                    <span>{s.sthan}</span>
                                    {s.sthanEn && <span className="text-[10px] text-gray-400 font-sans">({s.sthanEn})</span>}
                                  </td>
                                  <td className="py-2 px-2 text-center font-mono font-bold text-amber-900">{s.length}″</td>
                                  <td className="py-2 px-2 text-center font-mono font-bold text-amber-900">{s.width}″</td>
                                  <td className="py-2 px-2 text-center font-mono font-bold text-amber-900">{s.height}″</td>
                                  <td className="py-2 px-2 text-center font-mono font-bold text-amber-900">
                                    <span className="bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded border border-amber-200 text-xs">
                                      {s.length}″ × {s.width}″ × {s.height}″
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 text-gray-600 text-xs">
                                    {s.note ? <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">{s.note}</span> : '-'}
                                  </td>
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      onClick={() => copyGalfaRow(s)}
                                      className={`p-1 rounded border cursor-pointer ${
                                        copiedId === s.id ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-white text-gray-400 hover:text-amber-800'
                                      }`}
                                    >
                                      {copiedId === s.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 3. CARD GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredGalfaList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            #{idx + 1}
                          </span>
                          {item.district && (
                            <span className="text-[10px] font-bold font-devanagari px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                              जि. {item.district}
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-base text-gray-900 font-devanagari mb-0.5 flex items-center gap-1.5">
                          <span className="text-amber-500">🛕</span>
                          <span>{item.sthan}</span>
                        </h4>
                        <div className="text-xs font-medium text-amber-800 font-devanagari mb-3">
                          {item.village} {item.villageEn && <span className="text-[10px] text-gray-400 font-sans">({item.villageEn})</span>}
                        </div>

                        {/* Dimensions Visual Box */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 mb-3">
                          <div className="text-[10px] text-amber-700 font-devanagari font-bold uppercase mb-1.5 flex items-center justify-between">
                            <span>📐 गल्फ माप (इंच)</span>
                            <span className="font-mono text-amber-900">{item.length}″ × {item.width}″ × {item.height}″</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-center font-mono">
                            <div className="bg-white/90 p-1.5 rounded-lg border border-amber-100">
                              <span className="text-[10px] text-gray-400 block font-devanagari">लांबी</span>
                              <span className="font-bold text-sm text-amber-900">{item.length}″</span>
                            </div>
                            <div className="bg-white/90 p-1.5 rounded-lg border border-amber-100">
                              <span className="text-[10px] text-gray-400 block font-devanagari">रुंदी</span>
                              <span className="font-bold text-sm text-amber-900">{item.width}″</span>
                            </div>
                            <div className="bg-white/90 p-1.5 rounded-lg border border-amber-100">
                              <span className="text-[10px] text-gray-400 block font-devanagari">उंची</span>
                              <span className="font-bold text-sm text-amber-900">{item.height}″</span>
                            </div>
                          </div>
                        </div>

                        {item.note && (
                          <div className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 p-2 rounded-xl font-devanagari mb-3">
                            <strong>नोंद:</strong> {item.note}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-end">
                        <button
                          onClick={() => copyGalfaRow(item)}
                          className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold font-devanagari flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            copiedId === item.id
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                          }`}
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === item.id ? 'कॉपी झाले!' : 'हे माप कॉपी करा'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom devotional blessing */}
              <div className="mt-8 text-center p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs text-amber-900 font-devanagari">
                ॥ सर्वज्ञ श्रीचक्रधर स्वामींच्या पावन स्थानांना विनम्र साष्टांग प्रणिपात ॥
              </div>
            </div>
          ) : selectedChapter ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Switch to Galfa Table Banner */}
                {(selectedBook?.id === 'sthan_galfa_maap' || selectedBook?.id === 'pramukh_sthananchya_galphache_map') && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">📐</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-amber-950 font-devanagari">सर्व स्थानांची गल्फ माप सारणी (४९ गावे व १२४ स्थाने)</h4>
                        <p className="text-[11px] text-amber-700 font-devanagari">अधिकृत संवादात्मक सारणी, शोध व गावानुसार वर्गवारी पहा</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowGalfaTable(true);
                        setSelectedChapter(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-devanagari flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>सारणी उघडा</span>
                    </button>
                  </div>
                )}
                {/* Chapter Title & Action bar */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <span className="text-xs text-saffron-600 font-mono font-bold tracking-wider">
                      {translations.chapters[lang]} - {selectedChapter.number}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 font-devanagari mt-1">
                      {selectedChapter.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Google Books Fullscreen Button */}
                    <button
                      onClick={() => {
                        setIsFullscreenReader(true);
                        stopSpeech();
                        stopGuruSpeech();
                      }}
                      className="p-2 rounded-lg transition-all border bg-amber-50 text-amber-600 border-amber-100 hover:bg-[#ebdcc3] cursor-pointer"
                      title={lang === 'mr' ? 'पूर्ण स्क्रीन वाचन (गूगल बुक)' : lang === 'hi' ? 'पूर्ण स्क्रीन वाचन (गूगल बुक)' : 'Fullscreen (Google Book Mode)'}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* TTS Button */}
                    <button
                      onClick={() => {
                        const textToRead = selectedChapter.id === 'sp_18'
                          ? getPujavasarContent(selectedChapter.content, pujavasarSubMenu)
                          : selectedChapter.content;
                        isPlaying ? stopSpeech() : startSpeech(textToRead);
                      }}
                      className={`p-2 rounded-lg transition-all border ${
                        isPlaying 
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                          : 'bg-saffron-50 text-saffron-600 border-saffron-100 hover:bg-saffron-100'
                      }`}
                      title={isPlaying ? translations.stopAudio[lang] : translations.audioListen[lang]}
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(selectedChapter.id)}
                      className={`p-2 rounded-lg transition-all border ${
                        bookmarks.includes(selectedChapter.id)
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                      title={lang === 'mr' ? 'बुकमार्क करा' : lang === 'hi' ? 'बुकमार्क करें' : 'Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(selectedChapter.id) ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Submenu Tabs for Pujavasar (sp_18) */}
                {selectedChapter.id === 'sp_18' && (
                  <div className="mb-4 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 shadow-xs">
                    <div className="text-xs font-bold text-amber-900 mb-2 font-sans px-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      {lang === 'mr' ? 'पूजावसर भाग निवडा (Submenu) :' : lang === 'hi' ? 'पूजावसर भाग चुनें (Submenu) :' : 'Select Pujavasar Sub-section:'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: lang === 'mr' ? 'सर्व (All)' : lang === 'hi' ? 'सभी (All)' : 'All' },
                        { id: 'pratah', label: '१. प्रातःकाळ पूजावसर' },
                        { id: 'madhyanh', label: '२. मध्यान्हकाळ पूजावसर' },
                        { id: 'sayan', label: '३. सायंकाळ पूजावसर' }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setPujavasarSubMenu(sub.id as any);
                            if (isPlaying) stopSpeech();
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-devanagari font-semibold transition-all cursor-pointer ${
                            pujavasarSubMenu === sub.id
                              ? 'bg-saffron-600 text-white shadow-sm ring-2 ring-saffron-300'
                              : 'bg-white text-gray-700 hover:bg-saffron-100/80 border border-amber-200/50'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Script Script */}
                <div className="bg-saffron-50/25 border-l-4 border-saffron-500 p-5 rounded-r-xl my-4">
                  <h4 className="text-xs font-bold text-saffron-600 mb-2 tracking-wider">
                    {lang === 'mr' ? 'मूळ वचन / लीळा पाठ :' : lang === 'hi' ? 'मूल वचन / लीला पाठ :' : 'Original Text:'}
                  </h4>
                  {renderFormattedContent(
                    selectedChapter.id === 'sp_18' 
                      ? getPujavasarContent(selectedChapter.content, pujavasarSubMenu) 
                      : selectedChapter.content
                  )}
                </div>

                {/* Commentary / Explanation */}
                {selectedChapter.explanation && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-800 font-devanagari border-b border-gray-100 pb-1.5 mb-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-4 bg-saffron-500 rounded-full"></span>
                      {translations.explanation[lang]} :
                    </h4>
                    {renderStructuredExplanation(selectedChapter.explanation)}
                  </div>
                )}
              </div>

              {/* PDF & Download Resources info */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3 bg-saffron-50/40 p-4 rounded-xl">
                <div className="flex gap-2">
                  <a
                    href="https://mural.is.depaul.edu/jspui/bitstream/10611/4845/1/sutrapath-final.pdf" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 border border-saffron-200 text-saffron-600 hover:bg-saffron-50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 font-sans"
                  >
                    {lang === 'mr' ? 'PDF डाउनलोड करा' : lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <BookOpen className="w-16 h-16 text-saffron-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 font-devanagari">
                {lang === 'mr' ? 'स्वाध्याय सुरू करा' : lang === 'hi' ? 'स्वाध्याय आरंभ करें' : 'Start Reading'}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mt-2 font-sans mb-4">
                {selectedBook 
                  ? (filteredChapters.length === 0
                      ? (lang === 'mr' ? "हा ग्रंथ सध्या रिक्त (Blank) स्वरूपात जोडलेला आहे. यात अद्याप कोणतेही अध्याय किंवा मजकूर जोडलेला नाही." : lang === 'hi' ? "यह ग्रंथ वर्तमान में रिक्त (Blank) स्वरूप में जोड़ा गया है। इसमें अभी तक कोई अध्याय नहीं जुड़ा है।" : "This book is currently blank. No chapters or content added yet.")
                      : (lang === 'mr' ? "डाव्या बाजूच्या पॅनेलमधील अध्यायावर क्लिक करून त्याचा पावन पाठ आणि भावार्थ वाचा." : lang === 'hi' ? "बायें पैनल में दिए गए अध्याय/लीलाओं की सूची में से किसी एक पर क्लिक करके उसका पावन पाठ और अर्थ पढ़ें।" : "Click on a chapter in the left panel to read its text and explanation."))
                  : (lang === 'mr' ? "वरील पवित्र ग्रंथांपैकी एक ग्रंथ निवडा आणि त्याच्या मौल्यवान शिकवणींचा अभ्यास करा." : lang === 'hi' ? "ऊपर दिए गए पवित्र ग्रंथों की सूची में से एक ग्रंथ चुनें, और उसकी अमूल्य शिक्षाओं का अध्ययन करें।" : "Select a scripture from above and study its divine wisdom.")
                }
              </p>
              {selectedBook && (
                <button
                  onClick={() => {
                    setIsFullscreenReader(true);
                    stopSpeech();
                    stopGuruSpeech();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>
                    {selectedBook.id === 'drishtantapath'
                      ? (lang === 'mr' ? 'गूगल बुक पद्धतीने सर्व दृष्टांत वाचा' : lang === 'hi' ? 'गूगल बुक शैली में सभी दृष्टांत पढ़ें' : 'Read All Stories (Google Books Style)')
                      : (lang === 'mr' ? 'गूगल बुक पद्धतीत संपूर्ण ग्रंथ वाचा' : lang === 'hi' ? 'गूगल बुक शैली में संपूर्ण ग्रंथ पढ़ें' : 'Read Full Book (Google Books Style)')}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )}

      {/* Google Book Style Immersive Fullscreen Reader */}
      {isFullscreenReader && selectedBook && (
        <div className={`fixed inset-0 z-50 flex flex-col md:flex-row font-devanagari select-none animate-fade-in ${
          readerTheme === 'sepia' 
            ? 'bg-[#fcf8f2] text-[#433422]' 
            : readerTheme === 'dark' 
              ? 'bg-[#181818] text-[#e0e0e0]' 
              : 'bg-white text-gray-900'
        }`}>
          {/* Left Sidebar: Index / Table of Contents */}
          <div className={`w-full md:w-80 flex flex-col border-b md:border-b-0 md:border-r shrink-0 h-2/5 md:h-full ${
            readerTheme === 'sepia' 
              ? 'border-[#ebdcc3] bg-[#f5ebd7]' 
              : readerTheme === 'dark' 
                ? 'border-[#2d2d2d] bg-[#222]' 
                : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="p-4 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-saffron-600" />
                <h3 className="font-bold text-sm md:text-base">
                  {lang === 'mr' ? 'प्रकरण सूची (अनुक्रमणिका)' : lang === 'hi' ? 'प्रकरण सूची (अनुक्रमणिका)' : 'Chapter Index'}
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 font-bold font-sans">
                {filteredChapters.length}
              </span>
            </div>

            {/* Reader Search Input */}
            <div className="p-2 border-b border-inherit relative">
              <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={chapterSearchQuery}
                onChange={(e) => setChapterSearchQuery(e.target.value)}
                placeholder={
                  selectedBook.id === 'leela_charitra'
                    ? 'लीला, व्यक्ती, गाव, सूत्र शोधा...'
                    : (lang === 'mr' ? 'शोधा...' : 'Search...')
                }
                className={`w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border focus:outline-none font-devanagari ${
                  readerTheme === 'dark'
                    ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder-gray-500'
                    : readerTheme === 'sepia'
                    ? 'bg-[#fcf8f2] border-[#ebdcc3] text-[#433422] placeholder-[#8a7a67]'
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                }`}
              />
              {chapterSearchQuery && (
                <button
                  onClick={() => setChapterSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold p-0.5 rounded-full cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {filteredChapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    const el = document.getElementById(`reader-chap-${chap.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs md:text-sm transition-all flex items-start gap-2 border cursor-pointer ${
                    readerTheme === 'sepia'
                      ? 'border-transparent hover:bg-[#ebdcc3] text-[#5c4731]'
                      : readerTheme === 'dark'
                        ? 'border-transparent hover:bg-[#2d2d2d] text-gray-300'
                        : 'border-transparent hover:bg-gray-200/55 text-gray-700'
                  }`}
                >
                  <span className="font-sans font-bold text-xs shrink-0 mt-0.5 opacity-65">
                    {idx + 1}.
                  </span>
                  <span className="font-devanagari leading-relaxed">
                    {chap.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Main Reading Viewport */}
          <div className="flex-1 flex flex-col h-3/5 md:h-full">
            {/* Top Reader Navbar */}
            <div className={`px-4 py-3 border-b flex items-center justify-between gap-4 shrink-0 ${
              readerTheme === 'sepia' 
                ? 'border-[#ebdcc3] bg-[#f5ebd7]' 
                : readerTheme === 'dark' 
                  ? 'border-[#2d2d2d] bg-[#222]' 
                  : 'border-gray-200 bg-gray-50'
            }`}>
              {/* Left side actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsFullscreenReader(false);
                    stopSpeech();
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    readerTheme === 'sepia'
                      ? 'bg-[#fcf8f2] border-[#ebdcc3] text-[#5c4731] hover:bg-[#f3e7d3]'
                      : readerTheme === 'dark'
                        ? 'bg-[#2a2a2a] border-[#2d2d2d] text-gray-200 hover:bg-[#333]'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-150'
                  }`}
                  title={lang === 'mr' ? 'वाचन बंद करा' : lang === 'hi' ? 'वाचन बंद करें' : 'Exit Reader'}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="font-bold text-xs md:text-sm line-clamp-1">{selectedBook.title}</h4>
                  <p className="text-[10px] opacity-75 font-sans">
                    {lang === 'mr' ? 'गूगल बुक वाचन प्रकार (पूर्ण स्क्रीन)' : lang === 'hi' ? 'गूगल बुक वाचन प्रकार (पूर्ण स्क्रीन)' : 'Google Books Mode (Fullscreen)'}
                  </p>
                </div>
              </div>

              {/* Right side controls: Theme selection, Font Size */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Theme Selector */}
                <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-0.5 border border-current/10">
                  {(['light', 'sepia', 'dark'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setReaderTheme(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        readerTheme === t
                          ? t === 'sepia'
                            ? 'bg-[#ebdcc3] text-[#5c4731] shadow-xs'
                            : t === 'dark'
                              ? 'bg-[#2a2a2a] text-white shadow-xs'
                              : 'bg-white text-gray-900 shadow-xs'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {t === 'light' ? (lang === 'mr' ? 'शुभ्र' : lang === 'hi' ? 'लाइट' : 'Light') :
                       t === 'sepia' ? (lang === 'mr' ? 'पीत' : lang === 'hi' ? 'सेपिया' : 'Sepia') :
                       (lang === 'mr' ? 'कृष्ण' : lang === 'hi' ? 'डार्क' : 'Dark')}
                    </button>
                  ))}
                </div>

                {/* Font Size controls */}
                <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg border border-current/10 overflow-hidden">
                  <button
                    onClick={() => setReaderFontSize(prev => Math.max(14, prev - 2))}
                    className="px-2 py-1 text-xs font-bold font-sans hover:bg-black/10 transition-all cursor-pointer"
                    title="लहान करा"
                  >
                    A-
                  </button>
                  <span className="px-2 text-xs font-bold font-sans border-x border-current/10">
                    {readerFontSize}px
                  </span>
                  <button
                    onClick={() => setReaderFontSize(prev => Math.min(32, prev + 2))}
                    className="px-2 py-1 text-xs font-bold font-sans hover:bg-black/10 transition-all cursor-pointer"
                    title="मोठे करा"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Immersive Pages Stream */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 py-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-12 pb-24">
                {/* Book Cover / Welcome */}
                <div className="text-center py-16 border-b-2 border-dashed border-current/10 space-y-4">
                  <span className="text-4xl leading-none">📖</span>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-devanagari text-saffron-600">
                    {selectedBook.title}
                  </h1>
                  <p className="text-sm opacity-80 max-w-md mx-auto leading-relaxed">
                    {lang === 'mr' ? 'पूर्ण स्क्रीन इमर्सिव्ह वाचन मोड. सर्व अध्याय आणि विवरण एकाच ठिकाणी क्रमशः उपलब्ध.' : lang === 'hi' ? 'पूर्ण स्क्रीन इमर्सिव्ह वाचन मोड। सभी अध्याय और विवरण एक ही स्थान पर क्रमशः उपलब्ध।' : 'Immersive fullscreen reader. Scroll through all chapters and descriptions continuously.'}
                  </p>
                </div>

                {filteredChapters.length === 0 ? (
                  <div className="text-center py-16 opacity-75">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-bold font-devanagari">
                      {lang === 'mr' ? 'या ग्रंथात सध्या कोणतेही प्रकरण किंवा मजकूर उपलब्ध नाही (रिक्त ग्रंथ).' : lang === 'hi' ? 'इस ग्रंथ में वर्तमान में कोई अध्याय या सामग्री उपलब्ध नहीं है (रिक्त पुस्तक)।' : 'No chapters or content available in this book yet (blank book).'}
                    </p>
                  </div>
                ) : (
                  filteredChapters.map((chap, idx) => (
                  <div
                    key={chap.id}
                    id={`reader-chap-${chap.id}`}
                    className={`p-6 md:p-10 rounded-2xl border transition-all relative ${
                      readerTheme === 'sepia'
                        ? 'bg-[#fefcf8] border-[#ebdcc3] shadow-xs'
                        : readerTheme === 'dark'
                          ? 'bg-[#202020] border-[#2f2f2f] shadow-xs'
                          : 'bg-white border-gray-100 shadow-xs'
                    }`}
                  >
                    {/* Chapter Header Elements */}
                    <div className="flex justify-between items-start border-b border-current/10 pb-4 mb-5 gap-4">
                      <div>
                        <span className="text-[10px] tracking-widest font-mono font-bold uppercase opacity-60">
                          {lang === 'mr' ? `अध्याय / दृष्टांत ${idx + 1}` : lang === 'hi' ? `अध्याय / दृष्टांत ${idx + 1}` : `Chapter ${idx + 1}`}
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold font-devanagari mt-1 text-saffron-700">
                          {chap.title}
                        </h2>
                      </div>

                      {/* Header controls for chapter */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            const textToRead = chap.id === 'sp_18'
                              ? getPujavasarContent(chap.content, pujavasarSubMenu)
                              : chap.content;
                            isPlaying ? stopSpeech() : startSpeech(textToRead);
                          }}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-red-500 text-white border-red-600'
                              : 'opacity-60 hover:opacity-100 hover:bg-black/5'
                          }`}
                          title={lang === 'mr' ? 'ऐका' : lang === 'hi' ? 'सुनें' : 'Listen'}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleBookmark(chap.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            bookmarks.includes(chap.id)
                              ? 'bg-saffron-500 text-white border-saffron-600'
                              : 'opacity-60 hover:opacity-100 hover:bg-black/5'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarks.includes(chap.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Pujavasar Submenu tabs in Fullscreen Mode */}
                    {chap.id === 'sp_18' && (
                      <div className="mb-4 p-2.5 rounded-xl border border-current/10 bg-black/5 dark:bg-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'all', label: lang === 'mr' ? 'सर्व' : lang === 'hi' ? 'सभी' : 'All' },
                            { id: 'pratah', label: '१. प्रातःकाळ' },
                            { id: 'madhyanh', label: '२. मध्यान्हकाळ' },
                            { id: 'sayan', label: '३. सायंकाळ' }
                          ].map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setPujavasarSubMenu(sub.id as any);
                                if (isPlaying) stopSpeech();
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-devanagari font-semibold transition-all cursor-pointer ${
                                pujavasarSubMenu === sub.id
                                  ? 'bg-saffron-600 text-white'
                                  : 'opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/10'
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Book Text Area with Dynamic Font Size */}
                    <div className="space-y-6">
                      <div className={`p-5 md:p-8 rounded-xl border-l-4 border-saffron-500 leading-relaxed font-devanagari ${
                        readerTheme === 'sepia'
                          ? 'bg-[#f8f1e5]'
                          : readerTheme === 'dark'
                            ? 'bg-[#2a2a2a]'
                            : 'bg-saffron-50/20'
                      }`} style={{ fontSize: `${readerFontSize}px` }}>
                        {renderFormattedContent(
                          chap.id === 'sp_18' ? getPujavasarContent(chap.content, pujavasarSubMenu) : chap.content
                        )}
                      </div>

                      {/* Description / Explanation */}
                      {chap.explanation && (
                        <div className="mt-6 pt-4 border-t border-dashed border-current/10">
                          <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 opacity-70">
                            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
                            {lang === 'mr' ? 'निरूपण व भावार्थ :' : lang === 'hi' ? 'भावार्थ व स्पष्टीकरण :' : 'Explanation / Meaning :'}
                          </h4>
                          {renderStructuredExplanation(chap.explanation)}
                        </div>
                      )}
                    </div>
                  </div>
                )))}

                {/* End of book divider */}
                <div className="text-center py-16 opacity-60 flex flex-col items-center justify-center gap-2">
                  <div className="w-24 h-px bg-current/20"></div>
                  <p className="text-xs font-sans tracking-widest font-bold">
                    {lang === 'mr' ? '।। समाप्तम् ।।' : lang === 'hi' ? '।। समाप्तम् ।।' : '|| THE END ||'}
                  </p>
                  <div className="w-24 h-px bg-current/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
