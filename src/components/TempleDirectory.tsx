/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Temple } from '../types';
import { MapPin, Phone, Clock, ExternalLink, Compass, ShieldCheck, Filter, RotateCcw } from 'lucide-react';
import { MAHARASHTRA_DISTRICTS_AND_TALUKAS, maharashtraDistricts } from '../data';
import { translations } from '../translations';

interface TempleDirectoryProps {
  temples: Temple[];
  lang?: 'hi' | 'mr' | 'en';
}

export default function TempleDirectory({ temples, lang = 'mr' }: TempleDirectoryProps) {
  // Primary category: Separating "Sthan" and "Ashram"
  const [activeCategory, setActiveCategory] = useState<'sthan' | 'ashram'>('sthan');

  // Filters for Sthan (Maharashtra is pre-selected by default)
  const [selectedState, setSelectedState] = useState<string>('महाराष्ट्र');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('all');

  // Filter temples based on activeCategory
  const sthanTemples = temples.filter(t => t.type === 'sthan' || t.type === 'temple');
  const ashramTemples = temples.filter(t => t.type === 'ashram');

  // Extract dynamic states, districts, and talukas from sthans data for filtering
  const availableStates = Array.from(new Set(sthanTemples.map(t => t.state || 'महाराष्ट्र')));
  
  const availableDistricts = selectedState === 'महाराष्ट्र'
    ? maharashtraDistricts
    : Array.from(new Set(
        sthanTemples
          .filter(t => (t.state || 'महाराष्ट्र') === selectedState && t.district)
          .map(t => t.district as string)
      ));

  const availableTalukas = selectedState === 'महाराष्ट्र' && selectedDistrict !== 'all'
    ? (MAHARASHTRA_DISTRICTS_AND_TALUKAS[selectedDistrict] || []).sort()
    : Array.from(new Set(
        sthanTemples
          .filter(t => 
            (t.state || 'महाराष्ट्र') === selectedState && 
            (selectedDistrict === 'all' || t.district === selectedDistrict) && 
            t.taluka
          )
          .map(t => t.taluka as string)
      ));

  // Filtered list based on state, district, and taluka
  const displayTemples = activeCategory === 'sthan'
    ? sthanTemples.filter(t => {
        const stateMatch = (t.state || 'महाराष्ट्र') === selectedState;
        const districtMatch = selectedDistrict === 'all' || t.district === selectedDistrict;
        const talukaMatch = selectedTaluka === 'all' || t.taluka === selectedTaluka;
        return stateMatch && districtMatch && talukaMatch;
      })
    : ashramTemples;

  // Track selection, default to the first filtered item
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  
  const currentSelected = displayTemples.find(t => t.id === selectedTempleId) || displayTemples[0] || null;

  const handleResetFilters = () => {
    setSelectedState('महाराष्ट्र');
    setSelectedDistrict('all');
    setSelectedTaluka('all');
  };

  const getGoogleMapsUrl = (t: Temple) => {
    if (typeof t.latitude === 'number' && typeof t.longitude === 'number') {
      return `https://www.google.com/maps/search/?api=1&query=${t.latitude},${t.longitude}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name + ' ' + (t.location || ''))}`;
  };

  return (
    <div id="temples-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[550px] flex flex-col">
      {/* Header */}
      <div className="bg-saffron-50 p-6 border-b border-saffron-100">
        <h2 className="text-2xl font-bold text-saffron-700 font-devanagari flex items-center gap-2">
          <MapPin className="w-6 h-6 text-saffron-500" />
          {translations.templeHeader[lang]}
        </h2>
        <p className="text-xs md:text-sm text-gray-600 mt-1 font-sans">
          {translations.templeSub[lang]}
        </p>
      </div>

      {/* Primary Category Switcher - Separate Sthan and Ashram */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={() => {
            setActiveCategory('sthan');
            setSelectedDistrict('all');
            setSelectedTaluka('all');
            setSelectedTempleId(null);
          }}
          className={`flex-1 py-3 text-center font-bold font-devanagari text-xs md:text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeCategory === 'sthan'
              ? 'border-saffron-500 text-saffron-600 bg-white shadow-xs'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
          }`}
        >
          <span>🕌</span> {lang === 'mr' ? 'पवित्र स्थान (स्थान)' : lang === 'hi' ? 'पवित्र स्थान (स्थान)' : 'Holy Places (Sthan)'}
        </button>
        <button
          onClick={() => {
            setActiveCategory('ashram');
            setSelectedTempleId(null);
          }}
          className={`flex-1 py-3 text-center font-bold font-devanagari text-xs md:text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeCategory === 'ashram'
              ? 'border-saffron-500 text-saffron-600 bg-white shadow-xs'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
          }`}
        >
          <span>🏡</span> {lang === 'mr' ? 'साधना आश्रम (आश्रम)' : lang === 'hi' ? 'साधना आश्रम (आश्रम)' : 'Spiritual Retreats (Ashram)'}
        </button>
      </div>

      {/* Hierarchical Filter Section for Sthans */}
      {activeCategory === 'sthan' && (
        <div className="bg-saffron-50/30 p-4 border-b border-saffron-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-saffron-800 flex items-center gap-1 font-devanagari">
              <Filter className="w-3.5 h-3.5" />
              {lang === 'mr' ? 'स्थान शोधक' : lang === 'hi' ? 'स्थान शोधक' : 'Location Search'}
            </span>
            {(selectedState !== 'महाराष्ट्र' || selectedDistrict !== 'all' || selectedTaluka !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-bold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                {lang === 'mr' ? 'फिल्टर रीसेट करा' : lang === 'hi' ? 'फिल्टर रीसेट करें' : 'Reset Filters'}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* State Selection */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 font-devanagari">
                {lang === 'mr' ? 'राज्य (State):' : lang === 'hi' ? 'राज्य (State):' : 'State:'}
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('all');
                  setSelectedTaluka('all');
                  setSelectedTempleId(null);
                }}
                className="w-full text-xs font-semibold bg-white border border-saffron-200 rounded-xl px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-saffron-500"
              >
                {availableStates.map(st => (
                  <option key={st} value={st}>{st === 'महाराष्ट्र' && lang === 'en' ? 'Maharashtra' : st}</option>
                ))}
              </select>
            </div>

            {/* District (Jilha) Selection */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 font-devanagari">
                {lang === 'mr' ? 'जिल्हा (District):' : lang === 'hi' ? 'जिल्हा (District):' : 'District:'}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedTaluka('all');
                  setSelectedTempleId(null);
                }}
                className="w-full text-xs font-semibold bg-white border border-saffron-200 rounded-xl px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-saffron-500"
              >
                <option value="all">
                  {lang === 'mr' ? 'सर्व जिल्हे' : lang === 'hi' ? 'सभी जिले' : 'All Districts'}
                </option>
                {availableDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Taluka Selection */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 font-devanagari">
                {lang === 'mr' ? 'तालुका (Taluka):' : lang === 'hi' ? 'तालुका (Taluka):' : 'Taluka:'}
              </label>
              <select
                value={selectedTaluka}
                onChange={(e) => {
                  setSelectedTaluka(e.target.value);
                  setSelectedTempleId(null);
                }}
                className="w-full text-xs font-semibold bg-white border border-saffron-200 rounded-xl px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-saffron-500 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400"
                disabled={selectedDistrict === 'all'}
              >
                <option value="all">
                  {lang === 'mr' ? 'सर्व तालुके' : lang === 'hi' ? 'सभी तालुके' : 'All Talukas'}
                </option>
                {availableTalukas.map(tal => (
                  <option key={tal} value={tal}>{tal}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-3 flex-1 min-h-[450px]">
        {/* Left List Pane */}
        <div className="border-r border-saffron-100 p-4 bg-saffron-50/10 max-h-[550px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
            <span>
              {activeCategory === 'sthan' 
                ? (lang === 'mr' ? 'पवित्र स्थान सूची' : lang === 'hi' ? 'पवित्र स्थान सूची' : 'Holy Places') 
                : (lang === 'mr' ? 'साधना आश्रम सूची' : lang === 'hi' ? 'साधना आश्रम सूची' : 'Spiritual Retreats')
              }
            </span>
            <span className="bg-saffron-100 text-saffron-800 text-[10px] px-2 py-0.5 rounded-full">
              {displayTemples.length}
            </span>
          </h3>
          <div className="space-y-2.5">
            {displayTemples.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-devanagari">
                  {lang === 'mr' ? 'या ठिकाणी कोणतेही स्थान आढळले नाही.' : lang === 'hi' ? 'इस स्थान पर कोई पवित्र स्थान या आश्रम नहीं मिला।' : 'No holy places or ashrams found here.'}
                </p>
                {activeCategory === 'sthan' && (
                  <button
                    onClick={handleResetFilters}
                    className="mt-3 text-xs text-saffron-600 font-bold border border-saffron-200 hover:bg-saffron-50 px-3 py-1.5 rounded-lg"
                  >
                    {lang === 'mr' ? 'फिल्टर साफ करा' : lang === 'hi' ? 'फिल्टर साफ करें' : 'Clear Filters'}
                  </button>
                )}
              </div>
            ) : (
              displayTemples.map(t => (
                <button
                  key={t.id}
                  id={`temple-card-${t.id}`}
                  onClick={() => setSelectedTempleId(t.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 group items-center ${
                    currentSelected?.id === t.id
                      ? 'bg-saffron-50/70 border-saffron-300 shadow-xs'
                      : 'bg-white border-gray-100 hover:border-saffron-200'
                  }`}
                >
                  <img
                    src={t.photoUrl}
                    alt={t.name}
                    className="w-14 h-14 object-cover rounded-lg shadow-xs flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-1.5 flex-wrap">
                      {t.district && (
                        <span className="text-[9px] bg-saffron-100 text-saffron-800 px-1.5 py-0.5 rounded-sm font-semibold font-devanagari">
                          {t.district}
                        </span>
                      )}
                      {t.taluka && (
                        <span className="text-[9px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-sm font-semibold font-devanagari">
                          {t.taluka}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm font-devanagari mt-1.5 truncate group-hover:text-saffron-600">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-sans mt-0.5 truncate flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      {t.location}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Details Pane */}
        <div className="col-span-1 md:col-span-2 p-6 bg-white flex flex-col justify-between">
          {currentSelected ? (
            <div>
              {/* Cover Image & Quick stats */}
              <div className="relative rounded-2xl overflow-hidden h-48 md:h-64 shadow-md border border-gray-100 mb-6 group">
                <img
                  src={currentSelected.photoUrl}
                  alt={currentSelected.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5 md:p-6">
                  <div>
                    <span className="text-[10px] bg-saffron-500 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-sans shadow-sm">
                      {currentSelected.type === 'temple' || currentSelected.type === 'sthan' 
                        ? (lang === 'mr' ? 'पवित्र चरणमुद्रित स्थान' : lang === 'hi' ? 'पवित्र चरणमुद्रित स्थान' : 'Holy Footprints Sthan') 
                        : (lang === 'mr' ? 'दिव्य साधना आश्रम' : lang === 'hi' ? 'दिव्य साधना आश्रम' : 'Divine Ashram Retreat')
                      }
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white font-devanagari mt-1.5 drop-shadow-md">
                      {currentSelected.name}
                    </h3>
                    <p className="text-white/95 text-xs md:text-sm font-sans flex items-center gap-1 mt-1 drop-shadow-md">
                      <MapPin className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                      {currentSelected.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description & History tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-1.5 mb-2.5 flex items-center gap-1.5 font-devanagari">
                    <Compass className="w-4 h-4 text-saffron-500" />
                    {lang === 'mr' ? 'स्थानाचे महात्म्य' : lang === 'hi' ? 'स्थान का महात्म्य' : 'About the Place'}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 font-sans leading-relaxed">
                    {currentSelected.description}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-saffron-50/50 p-2.5 rounded-xl border border-saffron-100">
                      <Clock className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold font-sans text-gray-700">
                          {lang === 'mr' ? 'दर्शन वेळ (Darshan):' : lang === 'hi' ? 'दर्शन समय (Darshan):' : 'Darshan Timings:'}
                        </p>
                        <p className="text-gray-500 font-devanagari mt-0.5">
                          {currentSelected.darshanTimings || (lang === 'mr' ? 'सकाळी ६:०० ते रात्री ८:००' : lang === 'hi' ? 'सुबह ६:०० से रात ८:००' : '6:00 AM to 8:00 PM')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-saffron-50/50 p-2.5 rounded-xl border border-saffron-100">
                      <Phone className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold font-sans text-gray-700">
                          {lang === 'mr' ? 'संपर्क तपशील (Contact):' : lang === 'hi' ? 'संपर्क विवरण (Contact):' : 'Contact Details:'}
                        </p>
                        <p className="text-gray-500 font-sans mt-0.5">{currentSelected.contact || '+91 XXXXXXXXXX'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-1.5 mb-2.5 flex items-center gap-1.5 font-devanagari">
                    <ShieldCheck className="w-4 h-4 text-saffron-500" />
                    {lang === 'mr' ? 'पवित्र इतिहास' : lang === 'hi' ? 'पावन इतिहास' : 'Divine History'}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 font-sans leading-relaxed whitespace-pre-line">
                    {currentSelected.history || (lang === 'mr' 
                      ? 'या पवित्र स्थानाचा संबंध पंचकृष्ण अवतार आणि महानुभाव पंथाच्या दिव्य आठवणींशी आहे. येथे अनेक संतांनी साधना केली आणि परम सत्याचा मार्ग दाखवला.' 
                      : lang === 'hi' 
                      ? 'इस पवित्र स्थान का संबंध पंचकृष्ण अवतारों और महानुभाव पंथ के दिव्य संस्मरणों से है। यहाँ अनेक संतों ने साधना की और परम सत्य का मार्ग प्रशस्त किया।' 
                      : 'This holy place is deeply associated with the incarnations of Panchakrishna and divine events of the Mahanubhav Sect. Many saints meditated here to show us the path of absolute truth.'
                    )}
                  </p>

                  {/* Navigation Coordinates Button */}
                  <div className="mt-6 space-y-2">
                    <div className="text-[11px] font-mono font-bold text-saffron-700 bg-saffron-50 border border-saffron-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
                      <span>{lang === 'mr' ? 'भौगोलिक निर्देशांक:' : lang === 'hi' ? 'भौगोलिक निर्देशांक:' : 'Coordinates:'}</span>
                      <span className="bg-saffron-100 px-2 py-0.5 rounded text-saffron-800">
                        {typeof currentSelected.latitude === 'number' && typeof currentSelected.longitude === 'number'
                          ? `${currentSelected.latitude.toFixed(4)}°N, ${currentSelected.longitude.toFixed(4)}°E`
                          : (currentSelected.location || 'N/A')}
                      </span>
                    </div>
                    <a
                      href={getGoogleMapsUrl(currentSelected)}
                      target="_blank"
                      rel="noreferrer"
                      id={`navigate-btn-${currentSelected.id}`}
                      className="w-full justify-center px-5 py-3 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm border border-saffron-600"
                    >
                      <Compass className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                      {lang === 'mr' ? 'गूगल मॅपवर मार्ग शोधणे' : lang === 'hi' ? 'गूगल मैप पर मार्गदर्शन' : 'Navigate on Google Maps'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MapPin className="w-16 h-16 text-saffron-200 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-gray-800 font-devanagari">
                {lang === 'mr' ? 'स्थान दर्शन' : lang === 'hi' ? 'स्थान दर्शन' : 'Sthan View'}
              </h3>
              <p className="text-sm text-gray-500 mt-2 font-sans">
                {lang === 'mr' ? 'सूचीमधून एखादे पवित्र स्थान किंवा आश्रम निवडा.' : lang === 'hi' ? 'सूची में से किसी पवित्र स्थान या आश्रम का चयन करें।' : 'Select a sacred place or ashram from the list.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
