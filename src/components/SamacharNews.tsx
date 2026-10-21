/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Samachar } from '../types';
import { Newspaper, Calendar, Search, Tag, ExternalLink } from 'lucide-react';
import { translations } from '../translations';

interface SamacharNewsProps {
  news: Samachar[];
  lang?: 'hi' | 'mr' | 'en';
}

export default function SamacharNews({ news, lang = 'mr' }: SamacharNewsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: lang === 'mr' ? 'सर्व मासिक व वृत्त' : lang === 'hi' ? 'सभी मासिक व समाचार' : 'All' },
    { id: 'announcement', label: lang === 'mr' ? 'मासिक पत्रिका' : lang === 'hi' ? 'मासिक पत्रिका' : 'Monthly Magazine' },
    { id: 'update', label: lang === 'mr' ? 'संघटन वृत्त' : lang === 'hi' ? 'संगठन समाचार' : 'Community News' },
    { id: 'news', label: lang === 'mr' ? 'ताज्या घडामोडी' : lang === 'hi' ? 'ताज़ा समाचार' : 'Latest News' }
  ];

  const filteredNews = news.filter(ns => {
    const matchesCategory = selectedCategory === 'All' || ns.category === selectedCategory;
    const matchesSearch = ns.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ns.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'announcement': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'update': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'news': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'announcement': return lang === 'mr' ? 'मासिक पत्रिका' : lang === 'hi' ? 'मासिक पत्रिका' : 'Monthly Magazine';
      case 'update': return lang === 'mr' ? 'संघटन वृत्त' : lang === 'hi' ? 'संगठन समाचार' : 'Community News';
      case 'news': return lang === 'mr' ? 'ताज्या घडामोडी' : lang === 'hi' ? 'ताज़ा समाचार' : 'Latest News';
      default: return lang === 'mr' ? 'वृत्त' : lang === 'hi' ? 'समाचार' : 'News';
    }
  };

  return (
    <div id="samachar-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="bg-saffron-50 p-6 border-b border-saffron-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-saffron-700 font-devanagari flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-saffron-500" />
            {translations.newsHeader[lang]}
          </h2>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {translations.newsSub[lang]}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'mr' ? 'बातम्या शोधा...' : lang === 'hi' ? 'समाचार खोजें...' : 'Search news...'}
            className="w-full pl-9 pr-4 py-2 text-sm border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 overflow-x-auto gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-saffron-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-saffron-600 hover:border-saffron-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of news */}
      <div className="p-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-sans">
              {lang === 'mr' ? 'कोणतीही बातमी आढळली नाही.' : lang === 'hi' ? 'कोई समाचार नहीं मिला।' : 'No news articles found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews.map(ns => (
              <div
                key={ns.id}
                id={`news-card-${ns.id}`}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {ns.imageUrl && (
                    <div className="h-44 w-full overflow-hidden relative">
                      <img
                        src={ns.imageUrl}
                        alt={ns.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getCategoryBadge(ns.category)} bg-white/90 backdrop-blur-xs`}>
                          {getCategoryLabel(ns.category)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {!ns.imageUrl && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getCategoryBadge(ns.category)}`}>
                        {getCategoryLabel(ns.category)}
                      </span>
                    )}

                    <h4 className="font-bold text-gray-900 text-sm md:text-base font-devanagari mt-2 line-clamp-2 hover:text-saffron-600">
                      {ns.title}
                    </h4>

                    <p className="text-xs text-gray-600 mt-2 font-sans leading-relaxed line-clamp-4">
                      {ns.content}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {ns.date}
                  </span>
                  <button className="text-saffron-600 font-semibold text-xs hover:text-saffron-700 flex items-center gap-0.5 transition-all">
                    {lang === 'mr' ? 'सविस्तर वाचा' : lang === 'hi' ? 'विस्तार से पढ़ें' : 'Read More'}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
