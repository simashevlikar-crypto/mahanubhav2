/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Pravachan } from '../types';
import { Radio, Play, Pause, Video, Clock, Search, BookOpen, Sparkles } from 'lucide-react';
import { translations } from '../translations';

interface PravachanListProps {
  pravachans: Pravachan[];
  lang?: 'hi' | 'mr' | 'en';
}

export default function PravachanList({ pravachans, lang = 'mr' }: PravachanListProps) {
  const [selectedPravachan, setSelectedPravachan] = useState<Pravachan | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (pr: Pravachan) => {
    setSelectedPravachan(pr);
    setShowVideo(false);

    if (audioRef.current) {
      audioRef.current.src = pr.audioUrl || '';
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio error', err));
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio error', err));
    }
  };

  const categories = [
    { id: 'All', label: lang === 'mr' ? 'सर्व प्रवचने' : lang === 'hi' ? 'सभी प्रवचन' : 'All Sermons' },
    { id: 'leela', label: lang === 'mr' ? 'लीळा चिंतन' : lang === 'hi' ? 'लीला चिंतन' : 'Leela Contemplation' },
    { id: 'sutra', label: lang === 'mr' ? 'सूत्रपाठ निरूपण' : lang === 'hi' ? 'सूत्रपाठ निरूपण' : 'Sutrapath Explanation' },
    { id: 'achara', label: lang === 'mr' ? 'आचार विवेचन' : lang === 'hi' ? 'आचार विवेचन' : 'Conduct Commentary' }
  ];

  const filteredPravachans = pravachans.filter(pr => {
    const matchesCategory = activeCategory === 'All' || pr.category === activeCategory;
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pr.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="pravachan-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px]">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      {/* Header */}
      <div className="bg-saffron-50 p-6 border-b border-saffron-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-saffron-700 font-devanagari flex items-center gap-2">
            <Radio className="w-6 h-6 text-saffron-500" />
            {translations.pravachanHeader[lang]}
          </h2>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {translations.pravachanSub[lang]}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={translations.searchPravachanPlaceholder[lang]}
              className="w-full pl-9 pr-4 py-2 text-sm border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 overflow-x-auto gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-saffron-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-saffron-600 hover:border-saffron-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
        {/* Discourses Sidebar */}
        <div className="border-r border-saffron-100 p-4 bg-saffron-50/30 overflow-y-auto max-h-[450px] custom-scrollbar">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {lang === 'mr' ? 'प्रवचनांची सूची' : lang === 'hi' ? 'प्रवचनों की सूची' : 'Sermon List'}
          </h3>
          <div className="space-y-3">
            {filteredPravachans.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">
                {lang === 'mr' ? 'कोणतेही प्रवचन आढळले नाही.' : lang === 'hi' ? 'कोई प्रवचन नहीं मिला।' : 'No sermons found.'}
              </p>
            ) : (
              filteredPravachans.map(pr => (
                <div
                  key={pr.id}
                  id={`pravachan-card-${pr.id}`}
                  onClick={() => handlePlay(pr)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 group ${
                    selectedPravachan?.id === pr.id
                      ? 'bg-saffron-50 border-saffron-200 shadow-sm'
                      : 'bg-white border-gray-100 hover:border-saffron-200'
                  }`}
                >
                  {pr.thumbnailUrl ? (
                    <img src={pr.thumbnailUrl} alt={pr.title} className="w-16 h-12 object-cover rounded shadow-sm border border-gray-100 flex-shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-16 h-12 rounded bg-saffron-100 text-saffron-600 flex items-center justify-center flex-shrink-0">
                      <Radio className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-saffron-600 bg-saffron-100/60 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                      {pr.category}
                    </span>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm font-devanagari mt-1 line-clamp-1 group-hover:text-saffron-600">
                      {pr.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-sans mt-0.5 line-clamp-1">
                      {pr.speaker}
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 mt-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{pr.duration} {lang === 'mr' ? 'मिनिटे' : lang === 'hi' ? 'मिनट' : 'mins'}</span>
                      <span>•</span>
                      <span>{pr.date}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Play/Details Section */}
        <div className="col-span-1 md:col-span-2 p-6 flex flex-col bg-white">
          {selectedPravachan ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-5 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-devanagari">
                      {selectedPravachan.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      {lang === 'mr' ? 'प्रवचनकार:' : lang === 'hi' ? 'प्रवचनकार:' : 'Speaker:'} <span className="font-semibold text-gray-700">{selectedPravachan.speaker}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* Audio toggle */}
                    <button
                      onClick={togglePlayPause}
                      className="px-3.5 py-1.5 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying 
                        ? (lang === 'mr' ? 'थांबवा (Pause)' : lang === 'hi' ? 'रोकें (Pause)' : 'Pause') 
                        : (lang === 'mr' ? 'प्रवचन ऐका' : lang === 'hi' ? 'प्रवचन सुनें' : 'Listen Sermon')
                      }
                    </button>

                    {/* Video toggling */}
                    {selectedPravachan.videoUrl && (
                      <button
                        onClick={() => setShowVideo(!showVideo)}
                        className={`p-2 rounded-lg transition-all border ${
                          showVideo
                            ? 'bg-red-500 text-white border-red-500 shadow-sm'
                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        }`}
                        title={lang === 'mr' ? 'व्हिडिओ प्रवचन पहा' : lang === 'hi' ? 'वीडियो प्रवचन देखें' : 'Watch Video Sermon'}
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Video player view */}
                {showVideo && selectedPravachan.videoUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden aspect-video shadow-md border border-gray-200 bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedPravachan.videoUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Discourse Details / Meaning Card */}
                <div className="p-5 border border-saffron-100 rounded-2xl bg-saffron-50/20 shadow-sm flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-saffron-100 text-saffron-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm font-devanagari">
                      {lang === 'mr' ? 'ज्ञान चिंतन तपशील:' : lang === 'hi' ? 'ज्ञान चिंतन विवरण:' : 'Sermon Insight Details:'}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1 font-sans leading-relaxed">
                      {lang === 'mr' 
                        ? 'या प्रवचन सत्रात महानुभाव आचार्यांनी सर्वज्ञ श्रीचक्रधर स्वामी महाराजांच्या लीळांचे मर्म आणि धर्मग्रंथांचे निरूपण केले आहे. साधकांना धर्मात लीन राहण्याचे व वैराग्य भाव दृढ करण्याचे व्यावहारिक मार्ग सांगितले आहेत.' 
                        : lang === 'hi' 
                        ? 'इस प्रवचन सत्र में महानुभाव आचार्यों ने सर्वज्ञ श्रीचक्रधर स्वामी महाराज की लीलाओं के मर्म और धर्मग्रंथों की व्याख्या की है। साधकों को धर्म में लीन रहने तथा वैराग्य भाव पुष्ट करने के व्यावहारिक तरीके बताये गए हैं।' 
                        : 'In this discourse session, respected Acharyas explain the essence of Sarvajna Shri Chakradhar Swami Maharaj\'s divine plays and holy scriptures, guiding spiritual seekers on practical ways to nurture devotion and renunciation.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              {selectedPravachan.audioUrl && (
                <div className="mt-8 p-3 bg-saffron-50/50 rounded-xl border border-saffron-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-saffron-500 ${isPlaying ? 'animate-ping' : ''}`} />
                    <span className="text-xs text-gray-600 font-sans">
                      {isPlaying 
                        ? (lang === 'mr' ? `आता चालू आहे: ${selectedPravachan.title}` : lang === 'hi' ? `अभी चल रहा है: ${selectedPravachan.title}` : `Currently Playing: ${selectedPravachan.title}`) 
                        : (lang === 'mr' ? 'ऑडिओ ऐकण्यासाठी तयार.' : lang === 'hi' ? 'ऑडियो श्रवण के लिए तैयार।' : 'Audio is ready to listen.')
                      }
                    </span>
                  </div>
                  {isPlaying && (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-saffron-500 h-2 animate-[pulse_0.7s_infinite]" />
                      <div className="w-0.5 bg-saffron-500 h-3 animate-[pulse_1.1s_infinite]" />
                      <div className="w-0.5 bg-saffron-500 h-1 animate-[pulse_0.4s_infinite]" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Radio className="w-16 h-16 text-saffron-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 font-devanagari">
                {lang === 'mr' ? 'प्रवचन श्रवण करा' : lang === 'hi' ? 'प्रवचन श्रवण करें' : 'Listen to Discourses'}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mt-2 font-sans">
                {lang === 'mr' 
                  ? 'डाव्या बाजूला दिलेल्या सूचीमधून एखादा विषय निवडा आणि आचार्यांच्या दिव्य अमृतवाणीचा आनंद घ्या. तुम्ही प्रवचनासोबत व्हिडिओ देखील पाहू शकता.' 
                  : lang === 'hi' 
                  ? 'बायें ओर दी गई सूची से किसी विषय को चुनें और आचार्यों की दिव्य अमृतवाणी का रसास्वादन करें। आप प्रवचन के साथ वीडियो भी देख सकते हैं।' 
                  : 'Choose a discourse topic from the left list to listen to the divine words of our Acharyas. You can also view the video sermon where available.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
