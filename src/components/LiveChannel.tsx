/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tv, Radio, ExternalLink, Calendar, Video, Clock } from 'lucide-react';
import { translations } from '../translations';

interface LiveChannelProps {
  lang?: 'hi' | 'mr' | 'en';
}

export default function LiveChannel({ lang = 'mr' }: LiveChannelProps) {
  const [isLive, setIsLive] = useState(true);

  return (
    <div id="live-channel-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px] flex flex-col justify-between">
      {/* Header */}
      <div className="bg-saffron-50 p-6 border-b border-saffron-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-saffron-700 font-devanagari flex items-center gap-2">
            <Tv className="w-6 h-6 text-saffron-500" />
            {translations.liveHeader[lang]}
          </h2>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {translations.liveSub[lang]}
          </p>
        </div>

        {/* Live Status indicator */}
        {isLive ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full live-pulse"></span>
            <span className="text-xs font-bold text-red-600 font-sans tracking-wide">
              {lang === 'mr' ? 'थेट चालू' : lang === 'hi' ? 'लाइव चालू' : 'LIVE NOW'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="text-xs font-bold text-gray-500 font-sans">
              {lang === 'mr' ? 'ऑफलाईन' : lang === 'hi' ? 'ऑफलाइन' : 'OFFLINE'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1">
        {/* Left Player block */}
        <div className="lg:col-span-2 p-6 bg-black flex items-center justify-center min-h-[300px]">
          {isLive ? (
            <div className="w-full h-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Standard sample live stream placeholder
                title="Mahanubhav Live Streaming"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <Tv className="w-16 h-16 mx-auto text-gray-600 mb-3" />
              <p className="text-sm font-sans">
                {lang === 'mr' ? 'सध्या कोणतेही थेट प्रक्षेपण उपलब्ध नाही.' : lang === 'hi' ? 'अभी कोई लाइव प्रसारण उपलब्ध नहीं है।' : 'No live streams currently available.'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'mr' ? 'खालील आगामी थेट वेळापत्रक तपासा.' : lang === 'hi' ? 'आगामी लाइव उत्सव का समय नीचे देखें।' : 'Check upcoming schedules below.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Info schedule sidebar */}
        <div className="p-6 bg-saffron-50/20 border-t lg:border-t-0 lg:border-l border-saffron-100 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 font-devanagari border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-saffron-500" />
              {lang === 'mr' ? 'सुरू असलेला कार्यक्रम' : lang === 'hi' ? 'चल रहा कार्यक्रम (Current Stream)' : 'Current Stream'}
            </h3>

            {isLive ? (
              <div className="bg-white p-4 rounded-xl border border-saffron-100 shadow-2xs">
                <h4 className="font-bold text-gray-900 text-sm font-devanagari">
                  {lang === 'mr' ? 'ऋद्धपूर धाम: महाआरती आणि दिव्य दर्शन' : lang === 'hi' ? 'ऋद्धपूर धाम: महाआरती एवं दिव्य दर्शन' : 'Riddhapur Dham: Maha Aarti & Divine Darshan'}
                </h4>
                <p className="text-xs text-gray-500 font-sans mt-1">
                  {lang === 'mr' ? 'आयोजक: श्री देवस्थान ट्रस्ट ऋद्धपूर' : lang === 'hi' ? 'आयोजक: श्री देवस्थान ट्रस्ट ऋद्धपूर' : 'Organizer: Shri Devasthan Trust Riddhapur'}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-saffron-500" />
                  <span>{lang === 'mr' ? 'सकाळी ८:०० - दुपारी १२:००' : lang === 'hi' ? 'सुबह ८:०० - दोपहर १२:००' : '8:00 AM - 12:00 PM'}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-sans">
                {lang === 'mr' ? 'प्रक्षेपण बंद आहे.' : lang === 'hi' ? 'प्रसारण बंद है।' : 'Stream is offline.'}
              </p>
            )}

            <h3 className="text-sm font-bold text-gray-800 font-devanagari border-b border-gray-100 pb-1.5 pt-4 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-saffron-500" />
              {lang === 'mr' ? 'आगामी थेट वेळापत्रक' : lang === 'hi' ? 'आगामी लाइव वेळापत्रक (Schedule)' : 'Upcoming Streams'}
            </h3>

            <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
              <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100 flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold text-gray-800 font-devanagari">
                    {lang === 'mr' ? 'श्री कृष्ण जन्मोत्सव कथा' : lang === 'hi' ? 'श्री कृष्ण जन्मोत्सव कथा' : 'Shri Krishna Janmotsav Katha'}
                  </h5>
                  <p className="text-[10px] text-gray-500 font-sans">
                    {lang === 'mr' ? '२७ ऑगस्ट, संध्याकाळी ६:०० वाजता' : lang === 'hi' ? '२७ अगस्त, संध्या ६:०० बजे' : '27th August, 6:00 PM'}
                  </p>
                </div>
                <Radio className="w-4 h-4 text-saffron-500" />
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100 flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold text-gray-800 font-devanagari">
                    {lang === 'mr' ? 'चक्रधर स्वामी उपदेश पारायण' : lang === 'hi' ? 'चक्रधर स्वामी उपदेश पारायण' : 'Chakradhar Swami Teachings Recital'}
                  </h5>
                  <p className="text-[10px] text-gray-500 font-sans">
                    {lang === 'mr' ? '२८ ऑगस्ट, सकाळी ९:०० वाजता' : lang === 'hi' ? '२८ अगस्त, सुबह ९:०० बजे' : '28th August, 9:00 AM'}
                  </p>
                </div>
                <Radio className="w-4 h-4 text-saffron-500" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-6 text-center">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-all"
            >
              {lang === 'mr' ? 'आमच्या युट्यूब चॅनेलला भेट द्या' : lang === 'hi' ? 'हमारे यूट्यूब चैनल पर जाएं' : 'Visit Our YouTube Channel'}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
