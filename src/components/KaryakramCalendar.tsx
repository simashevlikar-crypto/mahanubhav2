/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { EventKaryakram } from '../types';
import AppLogo from './AppLogo';
import { 
  Calendar as CalendarIcon, MapPin, Phone, Clock, Search, Tag, Sparkles, 
  Crown, Flag, Sprout, Hammer, Award, Shield, Heart, Flower, Info, Eye, X, HelpCircle, ChevronLeft, ChevronRight,
  Flame, Droplets, Sun
} from 'lucide-react';
import { translations } from '../translations';

// local calendar translations
const calendarLocalTranslations = {
  toggleGrid: {
    mr: 'महानुभावीय दिनदर्शिका (२०२६)',
    hi: 'महानुभावीय कैलेंडर (२०२६)',
    en: 'Mahanubhav Calendar (2026)'
  },
  toggleList: {
    mr: 'आगामी कार्यक्रम यादी',
    hi: 'आगामी कार्यक्रम सूची',
    en: 'Upcoming Events List'
  },
  swipeHint: {
    mr: 'संपूर्ण दिनदर्शिका पाहण्यासाठी डावीकडे/उजवीकडे स्क्रोल करा ↔',
    hi: 'पूरा कैलेंडर देखने के लिए बाएं/दाएं स्क्रॉल करें ↔',
    en: 'Scroll left/right to view full calendar ↔'
  },
  clickDayHint: {
    mr: 'तारखेवर क्लिक करून संपूर्ण धार्मिक माहिती व शुभ योग पहा',
    hi: 'तारीख पर क्लिक करके पूरी धार्मिक जानकारी और शुभ योग देखें',
    en: 'Click on a date to view full religious details & auspicious timings'
  },
  modalTitle: {
    mr: 'दिवस विशेष धार्मिक माहिती',
    hi: 'दिवस विशेष धार्मिक जानकारी',
    en: 'Day Special Spiritual Information'
  }
};

function parseDevanagariInt(str: string): number {
  const devanagariMap: { [key: string]: string } = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  const englishDigits = str.replace(/[०-९]/g, (m) => devanagariMap[m] || m);
  const parsed = parseInt(englishDigits, 10);
  return isNaN(parsed) ? 1 : parsed;
}

interface KaryakramCalendarProps {
  events: EventKaryakram[];
  lang?: 'hi' | 'mr' | 'en';
}

export interface MahanubhavCalendarDay {
  dayNumber: number;
  tithi: string;
  shubhLabel: string;
  isShubh: boolean;
  events: string[];
  yogs: string[];
  isSunday: boolean;
  imageIcon?: 'flower' | 'jijau' | 'pot' | 'netaji' | 'yoga' | 'flag' | 'vishwakarma' | 'shivaji' | 'soldier' | 'fire' | 'water' | 'sun' | 'eye' | 'sprout';
  weekIndex: number;    // 0 to 4 (Week 1 to Week 5)
  weekdayIndex: number;  // 0 to 6 (Sunday to Saturday)
  month?: 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';
}

// Full extracted data from January 2026 Calendar Image
const januaryDays: MahanubhavCalendarDay[] = [
  {
    dayNumber: 1,
    tithi: "पौष शु. १३ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["नवीन वर्षाचा शुभ आरंभ"],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 2,
    tithi: "पौष शु. १४ मृगशीर्ष",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: ["पौर्णिमा प्रारंभ सायं. ६.५४"],
    yogs: ["भद्रायोग सकाळी ६.५३ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 3,
    tithi: "पौष पौर्णिमा आर्द्रा",
    shubhLabel: "आनंदी दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर मंदिर-यात्रा, श्रीक्षेत्र वाघळी, ता. चाळीसगांव, जि. जळगाव",
      "शाकंभरी पौर्णिमा",
      "पौर्णिमा समाप्ती दुपारी ३.३३"
    ],
    yogs: ["भद्रायोग सायं. ५.११ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 4,
    tithi: "पौष कृ.१ पुनर्वसु",
    shubhLabel: "नूतन वर्ष",
    isShubh: true,
    events: [
      "विश्वातील सर्व जनतेला नूतन वर्षाच्या हार्दिक शुभेच्छा...!",
      "श्रीचक्रधर मंदिर नामस्मरण यज्ञ प्रारंभ, श्रीक्षेत्र विटखेडा, ता. कन्नड, जि. संभाजीनगर"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 5,
    tithi: "पौष कृ.२ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग रात्री ८.५४ नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 6,
    tithi: "पौष कृ.३/४ आश्लेषा",
    shubhLabel: "विशेष उत्सव",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिवस - गरताड, ता. शिरपूर, जि. धुळे",
      "पत्रकार दिवस"
    ],
    yogs: [
      "घबाड योग दु. १२.१८ नं. उत्तर रात्री ६.५२ प.",
      "भद्रायोग स. ८.०२ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 7,
    tithi: "पौष कृ.५ मघा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 8,
    tithi: "पौष कृ.६ पू. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["दग्धयोग स. ६.०६ प. नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 9,
    tithi: "पौष कृ.७ पू. फाल्गुनी",
    shubhLabel: "महाचिंतनी प्रारंभ",
    isShubh: true,
    events: ["महाचिंतनी प्रारंभ"],
    yogs: ["भद्रायोग सायं. ७.४० प."],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 10,
    tithi: "पौष कृ.७ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रायोग सायं. ७.४० प.",
      "मृत्युयोग व यमघंट योग दु. ३.४० प."
    ],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 11,
    tithi: "पौष कृ.८ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["महाचिंतनी समारोप"],
    yogs: [],
    isSunday: true,
    imageIcon: "flower",
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 12,
    tithi: "पौष कृ.९ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "राजमाता जिजाऊ जयंती",
      "राष्ट्रीय युवा दिन"
    ],
    yogs: ["यमघंट योग रा. ९.६ नं."],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 13,
    tithi: "पौष कृ.१० विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "घबाड योग दु. ३.१८ प.",
      "भद्रायोग दु. ३.१८ प."
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 14,
    tithi: "पौष कृ.११ अनुराधा",
    shubhLabel: "मकर संक्रांती",
    isShubh: true,
    events: [
      "मकर संक्रांती",
      "श्रीचक्रधर मंदिर - नामस्मरण यज्ञ समारोप - श्रीक्षेत्र विटखेडा, ता. कन्नड, जि. संभाजीनगर",
      "द्वादशी प्रारंभ सायं. ५.५३"
    ],
    yogs: ["अमृतसिद्धी रात्री ३.०४ प."],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 15,
    tithi: "पौष कृ.१२ ज्येष्ठा",
    shubhLabel: "पदस्पर्श पावनदिन",
    isShubh: true,
    events: [
      "पदस्पर्श पावनदिन श्रीचक्रधर मंदिर श्रीक्षेत्र भिंगार, जि. अहिल्यानगर",
      "द्वादशी समाप्ती रा. ८.१७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 16,
    tithi: "पौष कृ.१३ मूळ",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग रात्री १०.२२ नं."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 17,
    tithi: "पौष कृ.१४ मूळ",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["अमावस्या प्रारंभ रा. १२.०३"],
    yogs: ["भद्रायोग स. ११.१६ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 18,
    tithi: "पौष अमावस्या पूर्वाषाढा",
    shubhLabel: "रहाटगाव महोत्सव",
    isShubh: true,
    events: [
      "श्री प्रभु सेवा दिन - महोत्सव श्री क्षेत्र रहाटगाव, ता. जि. अमरावती",
      "अमावस्या समाप्ती रा. १२.२०"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 19,
    tithi: "माघ शु.१ उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्रीगोपाल मंदिर - वर्धापनदिन, जबलपूर (म.प्र.)"],
    yogs: [
      "अमृतसिद्धी योग स. ११.५२ नं.",
      "मृत्युयोग स. ११.५२ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 20,
    tithi: "माघ शु.२ श्रवण",
    shubhLabel: "भाद्रपद मासारंभ",
    isShubh: true,
    events: [
      "श्रीकृष्ण ज्ञान मंदिर - वर्धापन दिन फलांडी - पटेलपाडा, ता. दादरनगर हवेली, जि. सेलवास (गुजरात)",
      "महानुभावीय भाद्रपद मासारंभ"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 21,
    tithi: "माघ शु.३ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["पंचक प्रारंभ स. १०.१०"],
    yogs: ["दग्धयोग रा. ३.४८ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 22,
    tithi: "माघ शु.४ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["पंचमी प्रारंभ रात्री २.२१"],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 23,
    tithi: "माघ शु.५ पू. भाद्रपदा",
    shubhLabel: "वसंत पंचमी",
    isShubh: true,
    events: [
      "वसंत पंचमी",
      "श्रीचक्रधर मंदिर यात्रा, श्रीक्षेत्र मोंढा, ता. जि. नागपूर",
      "श्रीकृष्ण मंदिर वर्धापनदिन (ल.व.) माळवाडी, ता. शिरपूर",
      "नेताजी सुभाषचंद्र बोस जयंती",
      "पंचमी समाप्ती रा. १.४७"
    ],
    yogs: ["घबाड योग दु. १.१६ नं."],
    isSunday: false,
    imageIcon: "netaji",
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 24,
    tithi: "माघ शु.६ उ. भाद्रपदा",
    shubhLabel: "बालदिन",
    isShubh: true,
    events: [
      "पंचसेवाश्रम - वर्धापनदिन रायतेवाडी (खुर्द) ता. संगमनेर, जि. अ. नगर",
      "बालदिन"
    ],
    yogs: [
      "घबाड योग दु. २.१६ नं. रात्री १२.४० प.",
      "घबाड योग स. १०.४९"
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 25,
    tithi: "माघ शु.७ रेवती",
    shubhLabel: "सूर्य नमस्कार दिन",
    isShubh: true,
    events: [
      "जागतिक सूर्य नमस्कार दिन",
      "मतदान दिन",
      "पंचक समाप्ती दु. १.३६"
    ],
    yogs: [],
    isSunday: true,
    imageIcon: "yoga",
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 26,
    tithi: "माघ शु.८ अश्विनी",
    shubhLabel: "प्रजासत्ताक दिन",
    isShubh: true,
    events: ["प्रजासत्ताक दिन (Republic Day)", "शुभ दिवस"],
    yogs: [],
    isSunday: false,
    imageIcon: "flag",
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 27,
    tithi: "माघ शु.९ भरणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 28,
    tithi: "माघ शु.१० कृत्तिका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग रात्री ३.१७ नं."],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 29,
    tithi: "माघ शु.११ रोहिणी/मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "घबाडयोग दु. १.५६ नं. उत्तर रात्री ५.२१ प.",
      "मृत्युयोग स. ७.३२ नं."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 30,
    tithi: "माघ शु.१२ आर्द्रा",
    shubhLabel: "पाचोरा यात्रा",
    isShubh: true,
    events: [
      "श्रीकृष्णनाथ चक्रधर मंदिर यात्रा प्रारंभ - श्रीक्षेत्र पाचोरा, जि. जळगाव",
      "द्वादशी समाप्ती स. ११.१०"
    ],
    yogs: ["घबाडयोग रा. ३.२७ नं."],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 31,
    tithi: "माघ शु.१३/१४ पुनर्वसु",
    shubhLabel: "विश्वकर्मा जयंती",
    isShubh: true,
    events: [
      "विश्वकर्मा जयंती",
      "पौर्णिमा प्रारंभ उत्तरात्री ५.५३"
    ],
    yogs: [
      "घबाड योग स. ८.२६ प.",
      "भद्रायोग रा. ५.५७"
    ],
    isSunday: false,
    imageIcon: "vishwakarma",
    weekIndex: 4,
    weekdayIndex: 6 // Saturday
  }
];

// Full extracted data from February 2026 Calendar Image
const februaryDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "माघ पौर्णिमा पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर मंदिर यात्रा, श्रीक्षेत्र 'ताळीचा' देव, ता. भोकरदन",
      "श्री दत्त मंदिर यात्रा-नांद खुर्द, ता. धडगाव",
      "श्री खंडोबा यात्रा, ता. शिरपूर, जि. धुळे",
      "पौर्णिमा समाप्ती रा. ३.३१"
    ],
    yogs: ["भद्रायोग सायं. ४.४३ प."],
    isSunday: true,
    weekIndex: 0,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 2,
    tithi: "माघ कृ. १ आश्लेषा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 3,
    tithi: "माघ कृ. २ मघा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 4,
    tithi: "माघ कृ. ३ पू. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["चतुर्थी प्रारंभ रा. १२.१०"],
    yogs: [
      "भद्रायोग स. १२.२० प.",
      "घबाड योग रा. १२.१० नं.",
      "दग्धयोग रा. १२.१० प."
    ],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 5,
    tithi: "माघ कृ. ४ उ. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर-पदस्पर्श पावनदिन - श्रीक्षेत्र खोकर, ता. श्रीरामपूर",
      "चतुर्थी समाप्ती रात्री १२.२३"
    ],
    yogs: [
      "घबाड योग रा. १०.५७ प.",
      "भद्रायोग दु. १२.०९ प."
    ],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 6,
    tithi: "माघ कृ. ५ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 7,
    tithi: "माघ कृ. ६ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग रात्री २.५५ नं."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 8,
    tithi: "माघ कृ. ७ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग दुपारी ३.५५ प."],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 9,
    tithi: "माघ कृ. ८ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["यमघंट अहोरात्र"],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 10,
    tithi: "माघ कृ. ८ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्रीचक्रधरज्ञान मंदिर-वर्धापन दिन, पाथरे, ता. सिन्नर, जि. नाशिक"],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 11,
    tithi: "माघ कृ. ९ अनुराधा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्रीगोविंद प्रभू मंदिर वर्धापनदिन श्रीक्षेत्र कुन्हा, ता. चा. बाजार, जि. अमरावती"],
    yogs: ["भद्रायोग प्रारंभ दु. ११.१२ नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 12,
    tithi: "माघ कृ. १० ज्येष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग समाप्ती दुपारी १२.२२ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 13,
    tithi: "माघ कृ. ११ मूळ",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["कुंभ संक्रांत"],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 14,
    tithi: "माघ कृ. १२ पूर्वाषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पुलवामा बलिदान दिवस",
      "त्रयोदशी प्रारंभ सायं. ४.०९"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "soldier",
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 15,
    tithi: "माघ कृ. १३ उत्तराषाढा",
    shubhLabel: "महाशिवरात्री",
    isShubh: true,
    events: [
      "देवपूजा प्रसाद वंदन (स. ९ ते सायं. ६) पानपुडा चंदन उमरखेड, जि. यवतमाळ",
      "द्वारकाधीश श्रीकृष्ण गीता अध्ययन मंदिर-वर्धापननगर कटोरा रोड, अमरावती",
      "शीतल मंदिर-वर्धापन दिन, जागोरी, ता. हिंडोरी, जि. नागपूर",
      "त्रयोदशी समाप्ती सायं. ५.०४"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 16,
    tithi: "माघ कृ. १४ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["अमावस्या प्रारंभ सायं. ५.३३"],
    yogs: ["भद्रायोग समाप्ती स. ५.२३ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 17,
    tithi: "माघ अमावस्या धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "महानुभाव विद्यापीठ-वर्धापन दिन",
      "श्रीकृष्ण मंदिर-आईचाई हंसराज महानुभाव आश्रम-चुदावा ता. पुर्णा, जि. परभणी",
      "अमावस्या समाप्ती स. ५.३०"
    ],
    yogs: ["पंचक प्रारंभ सायं. ६.१६"],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 18,
    tithi: "फाल्गुन शु. १ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीगुरुदत्त महानुभाव आश्रम वर्धापन दिन पिंप्री-गवळी, ता. खामगाव, जि. बुलढाणा",
      "वसंत ऋतू प्रारंभ"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 19,
    tithi: "फाल्गुन शु. २ पू. भाद्रपदा",
    shubhLabel: "शिवजयंती",
    isShubh: true,
    events: [
      "छ. शिवाजी महाराज जयंती (तारीखेप्रमाणे)",
      "महानुभावीय आश्विन मासारंभ"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "shivaji",
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 20,
    tithi: "फाल्गुन शु. ३ उ. भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "अमृतसिद्धीयोग रात्री ८.०८ नं.",
      "भद्रायोग रा. १.५२ नं."
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 21,
    tithi: "फाल्गुन शु. ४ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जागतिक मातृभाषा दिन",
      "पंचक समाप्ती सायं. ७.७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 22,
    tithi: "फाल्गुन शु. ५ अश्विनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["घबाड योग सायं. ५.५५ नं."],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 23,
    tithi: "फाल्गुन शु. ६/७ भरणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्रीकृष्ण ज्ञान मंदिर-वर्धापनदिन बोन्ना, सेलवास (गुजरात)"],
    yogs: ["घबाड योग स. ९.१० प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 24,
    tithi: "फाल्गुन शु. ८ कृत्तिका",
    shubhLabel: "मुद्रण दिन",
    isShubh: true,
    events: ["जागतिक मुद्रण दिन"],
    yogs: ["भद्रायोग सायं. ५.५८ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 25,
    tithi: "फाल्गुन शु. ९ रोहिणी",
    shubhLabel: "महिला दिन",
    isShubh: true,
    events: [
      "जागतिक महिला दिन",
      "श्रीचक्रधर मंदिर, श्रीचक्रधर प्रभु पदस्पर्श पावन दिन - श्रीक्षेत्र सायगव्हाण, ता. सोयगाव, जि. सं. नगर"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 26,
    tithi: "फाल्गुन शु. १० मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर मंदिर, श्रीचक्रधर प्रभु पदस्पर्श पाวน दिन - श्रीक्षेत्र वाघळी, ता. चाळीसगांव, जि. जळगाव",
      "स्वा. सावरकर पुण्यतिथी"
    ],
    yogs: ["मृत्युयोग दु. १२.१२ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 27,
    tithi: "फाल्गुन शु. ११ आर्द्रा",
    shubhLabel: "मराठी दिन",
    isShubh: true,
    events: [
      "आमलकी एकादशी-श्रीक्षेत्र कनारी, ता. भद्राय, जि. जळगाव",
      "मराठी भाषा गौरव दिन",
      "श्रीदत्त मंदिर वर्धापन दिन, वरची इंध्री, ता. मुखेड, जि. नांदेड"
    ],
    yogs: [
      "घबाडयोग रा. १०.३३ नं.",
      "भद्रायोग दु. ११.३२"
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 28,
    tithi: "फाल्गुन शु. १२ पुनर्वसू",
    shubhLabel: "विज्ञान दिन",
    isShubh: true,
    events: ["राष्ट्रीय विज्ञान दिन"],
    yogs: ["घबाड योग स. ९.३५ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  }
];

// Full extracted data from March 2026 Calendar Image
const marchDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "फाल्गुन शु. १३ पुष्य",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [
      "श्रीपंचकृष्ण मंदिर-वर्धापनदिन, मांडगाव, ता. समुद्रपूर, जि. वर्धा",
      "श्रीचक्रधर मंदिर पालखी यात्रा हरताळा, ता. मुक्ताईनगर, जि. जळगाव"
    ],
    yogs: ["घबाड योग स. ८.३४ नं. ११.१० प."],
    isSunday: true,
    weekIndex: 0,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 2,
    tithi: "फाल्गुन शु. १४ आश्लेषा",
    shubhLabel: "वर्ज्य दिवस",
    isShubh: false,
    events: [
      "हुताशनी पौर्णिमा (होळी)",
      "पौर्णिमा प्रारंभ सायं. ५.५६"
    ],
    yogs: ["भद्रायोग सायं. ४.५६ नं. उत्तर रा. ५.२१ प."],
    isSunday: false,
    imageIcon: "fire",
    weekIndex: 0,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 3,
    tithi: "फाल्गुन पौर्णिमा मघा",
    shubhLabel: "ग्रहण दिवस",
    isShubh: false,
    events: [
      "जय श्रीकृष्ण मंदिर-फुलीसव (फुलोकी होली) शाहाबाद हरियाणा",
      "धुलिवंदन",
      "पौर्णिमा समाप्ती सायं. ५.०८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 4,
    tithi: "फाल्गुन कृ. १ पू. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्री दत्तात्रेय प्रभु चिंतन सेवाश्रम वर्धापन दिन-बोरखेड, ता. जुन्नर, जि. पुणे"],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 5,
    tithi: "फाल्गुन कृ. २ उ. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्री दत्त मंदिर वर्धापनदिन समारोह, वरची इंजळी, ता. मुखेड, जि. नांदेड"],
    yogs: ["भद्राय उत्तरात्री ५.२५ नं."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 6,
    tithi: "फाल्गुन कृ. ३ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सर्वज्ञ श्रीचक्रधर मंदिर वर्धापनदिन उमरी (वाघ), ता. हिंगणा, जि. नागपूर",
      "छ. शिवाजी महाराज जयंती (तिथीनुसार)"
    ],
    yogs: ["भद्रायोग सायं. ५.५४ प."],
    isSunday: false,
    imageIcon: "shivaji",
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 7,
    tithi: "फाल्गुन कृ. ४ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["पंचमी प्रारंभ सायं. ४.१९"],
    yogs: ["घबाड योग स. ११.१६ नं. सायं. ४.१८ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 8,
    tithi: "फाल्गुन कृ. ५ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर यात्रा-श्रीक्षेत्र सुकेना, ता. निफाड, श्रीक्षेत्र माहूर, जि. नांदेड",
      "श्रीचक्रधर मंदिर, पालखी यात्रा, श्रीक्षेत्र भद्रावती आल्याची ज्ञानयज्ञ महोत्सव प्रारंभ-श्रीक्षेत्र देवेश्वर संस्थान, श्रीक्षेत्र माहूर, जि. नांदेड",
      "रंगपंचमी / जागतिक महिला दिन",
      "पंचमी समाप्ती रात्री ८.१२"
    ],
    yogs: [],
    isSunday: true,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 9,
    tithi: "फाल्गुन कृ. ६ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग रात्री ११.२८ नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 10,
    tithi: "फाल्गुन कृ. ७ अनुराधा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सावित्रीबाई फुले स्मृतीदिन",
      "अष्टमी प्रारंभ रा. १.२८"
    ],
    yogs: ["भद्रा समाप्ती दु. १२.४१ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 11,
    tithi: "फाल्गुन कृ. ८ ज्येष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर मंदिर, श्रीकृष्ण यात्रा महोत्सव, श्रीक्षेत्र कानळद, ता. निफाळ, जि. नाशिक",
      "अष्टमी समाप्ती रा. १.५५"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 12,
    tithi: "फाल्गुन कृ. ९ मूळ",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["घबाड उत्तरात्री ६.३० नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 13,
    tithi: "फाल्गुन कृ. १० पूर्वाषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["श्रीकृष्ण मंदिर-वर्धापन दिन चिखाला, ता. मुदखेड, जि. नांदेड"],
    yogs: [
      "घबाड योग रा. ३.३० प.",
      "भद्रा योग सा. ७.२५ नं."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 14,
    tithi: "फाल्गुन कृ. १० उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "घबाड रात्री ४.४९ नं.",
      "भद्रा योग स. ८.११ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 15,
    tithi: "फाल्गुन कृ. ११ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जागतिक ग्राहक दिन",
      "नियोजन दिन",
      "मीन संक्रांत"
    ],
    yogs: ["दग्ध योग स. ९.१७ नं."],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 16,
    tithi: "फाल्गुन कृ. १२ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["पंचक प्रारंभ उत्तरात्री ३.३०"],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 17,
    tithi: "फाल्गुन कृ. १३ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग स. ९.२४ नं. रात्री ८.५१ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 18,
    tithi: "फाल्गुन कृ. १४ पू. भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["अमावस्या प्रारंभ सकाळी ८.२५ नंतर"],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 19,
    tithi: "फाल्गुन अमावस्या/चैत्र शु.१ उ.भाद्रपदा",
    shubhLabel: "गुढीपाडवा",
    isShubh: true,
    events: [
      "अमावस्या समाप्ती स. ६.५३",
      "प्रतिपदा प्रारंभ स. ६.५४ पासून ते उत्तरात्री ४.५३ पर्यंत"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flag",
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 20,
    tithi: "चैत्र शु. २ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर मंदिर यात्रा- श्रीक्षेत्र संवत्सर, श्रीक्षेत्र मंदिर-वर्धापनदिन, कंदूर, ता. शिरुर, जि. पुणे",
      "निर्भया दिवस",
      "महानुभावीय कार्तिक मासारंभ",
      "द्वितीया समाप्ती रा. २.३१",
      "पंचक समाप्ती रा. २.२८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 21,
    tithi: "चैत्र शु. ३ अश्विनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर यात्रा, हिवरे, ता. जि. पुणे",
      "श्रीदत्त मंदिर यात्रा, लोहगाव, ता. हवेली, जि. पुणे",
      "तृतीया समाप्ती रा. ११.५७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 22,
    tithi: "चैत्र शु. ४ भरणी",
    shubhLabel: "जागतिक जल दिवस",
    isShubh: true,
    events: [
      "सर्वज्ञ श्रीचक्रधर चरणांकित पाडेेश्वर देवस्थान, वाकी, ता. भातकुली, जि. अमरावती",
      "विश्वशांती श्रीदत्त मंदिर वर्धापनदिन, एडोळी, ता. श्रीगोेंदा, जि. अ. नगर",
      "पंचमी प्रारंभ रा. १.१७"
    ],
    yogs: [
      "भद्रा योग स. १०.३६ नं.",
      "भद्रा योग रा. ९.१६ प."
    ],
    isSunday: true,
    imageIcon: "water",
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 23,
    tithi: "चैत्र शु. ५ कृत्तिका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर मंदिर वर्धापनदिन, पाळद, ता. मोर्शी",
      "श्रीदत्त मंदिर यात्रा, जाखणवाडी, पुणे",
      "श्रीदत्त मंदिर यात्रा, वसंतपूर, ता. कोरेगाव",
      "श्रीदत्त मंदिर संस्थान यात्रा, रातोडा, जि. लातूर",
      "जागतिक हवामान दिन",
      "पंचमी समाप्ती सायं. ६.३९"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "sun",
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 24,
    tithi: "चैत्र शु. ६ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["सप्तमी प्रारंभ सायं. ४.८"],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 25,
    tithi: "चैत्र शु. ७ मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर यात्रा, दत्तवाडी चांडोली बु।।, जि. पुणे",
      "सप्तमी समाप्ती दु. १.५१"
    ],
    yogs: ["भद्रा योग दु. १.५० नं."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 26,
    tithi: "चैत्र शु. ८ आर्द्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर यात्रा पारगांव (मंगरुळ) पुणे, श्रीदत्त मंदिर यात्रा जांबुत, ता. शिरुर, जि. पुणे",
      "अष्टमी समाप्ती स. ११.४१"
    ],
    yogs: ["भद्रा सकाळी १२.४७ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 27,
    tithi: "चैत्र शु. ९ पुनर्वसू",
    shubhLabel: "श्रीराम नवमी",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर यात्रा, नाटा ता. पालम",
      "श्रीदत्त मंदिर यात्रा, नारायणगांव, ता. जुन्नर",
      "श्री दत्त मंदिर पालखी सोहळा पेवा",
      "नवमी समाप्ती स. १०.७"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 28,
    tithi: "चैत्र शु. १० पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर यात्रा क्षेत्र मिरी, ता. पाथर्डी",
      "श्रीचक्रधर मंदिर यात्रा, पारगांव (शिंगवे), ता. आंबेगाव",
      "दशमी समाप्ती स. ८.४६"
    ],
    yogs: ["भद्रा योग रा. ८.१३ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 29,
    tithi: "चैत्र शु. ११ आश्लेषा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीक्षेत्र मायेश्वर यात्रा, नांदेड, जि. नांदेड",
      "श्रीदत्त मंदिर पालखी यात्रा, पिंपरखेड, जि. पुणे",
      "श्रीकृष्ण फुलनारी मंदिर वर्धापन दिन शिंदेपळंट-यवतमाळ.",
      "द्वादशी प्रारंभ स. ७.४७"
    ],
    yogs: ["भद्रा योग स. ७.४६ प."],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 30,
    tithi: "चैत्र शु. १२ मघा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["द्वादशी समाप्ती स. ७.१०"],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 31,
    tithi: "चैत्र शु. १३ पू. फाल्गुनी",
    shubhLabel: "महावीर जयंती",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर यात्रा, साळवडी ता. जुन्नर, जि. पुणे",
      "श्रीचक्रधर मंदिर वर्धापनदिन रेव्हनस्टेशन, कोपरगाव",
      "श्रीकृष्ण मंदिर वर्धापनदिन , वाफडी, ता. चाळीसगांव",
      "त्रयोदशी समाप्ती स. ६.५५"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  }
];

// Full extracted data from April 2026 Calendar Image
const aprilDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "चैत्र शु. १४ उ.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीक्षेत्र चांगदेव यात्रा, ता.मुक्ताईनगर",
      "श्रीदत्त मंदिर देवपन्नापर्व महोत्सव, तांदुळवाडी, ता. रावेर, श्रीक्षेत्र खाणेपुरी यात्रा",
      "श्रीपंचकृष्ण मंदिर वर्धापनदिन हिंगोली, ता. जि.हिंगोली",
      "पौर्णिमा प्रारंभ स.७.७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 2,
    tithi: "चैत्र पौर्णिमा हस्त",
    shubhLabel: "हनुमान जयंती",
    isShubh: true,
    events: [
      "पौर्णिमा समाप्ती स.७.४२",
      "श्रीदत्त मंदिर देवपन्नापर्व दिन-वरखेड, ता.नेवासा",
      "श्रीचक्रधर स्वामी अवतार दिन-वर्धापनदिन, बीड",
      "श्रीक्षेत्र धानोरा मंदिर यात्रा, गंगाखेड",
      "श्रीचक्रधर मंदिर वर्धापन दिन - अमरावती, नांदगाव पेठ, देवगाव, लोणी-ता. जुन्नर, लोणी-ता. सिन्नर, विष्णुपूरी-नांदेड",
      "अमरावती विद्यापीठ वर्धापन दिन",
      "श्री दत्त मंदिर देवपन्नापर्व दिन",
      "श्रीचक्रधर स्वामी अवतार दिन-वर्धापन दिन, वन्हाडसीम, जळगाव, पिंप्री-गवळी, रांजणी"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 3,
    tithi: "चैत्र कृ.१ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीक्षेत्र खोपडी, ता.सिन्नर, श्रीक्षेत्र शेंडी (पोखंडी), श्रीदत्त मंदिर करजगाव, ता.जुन्नर, श्रीदत्त मंदिर पालखी सोहळा, हरगड, ता.येवला",
      "श्रीदत्त मंदिर यात्रा कोरेगांव, जि.पुणे, श्रीकृष्ण मंदिर यात्रा, टिटवेळवाडी, ता.हवेली, श्रीदत्त मंदिर यात्रा, वरची इंजळी, ता.मुखेड, जि.नांंदेड",
      "प्रतिपदा समाप्ती स.०८.४३."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 4,
    tithi: "चैत्र कृ.२ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीक्षेत्र रुद्रपूर यात्रा, ता.चांदूरबाजार, श्रीपंचअवतार उपहार, श्रीकृष्ण मंदिर बोरजाईवाडी, ता.कोरेगांव, जि.सातारा",
      "द्वितीया समाप्ती स.१०.१०"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 5,
    tithi: "चैत्र कृ.३ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "तृतीया समाप्ती दु.११.५९"
    ],
    yogs: ["भद्रायोग स.११.५८ प."],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 6,
    tithi: "चैत्र कृ.४ अनुराधा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पंचमी प्रारंभ दु.२.११"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 7,
    tithi: "चैत्र कृ.५ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रधर मंदिर यात्रा श्रीक्षेत्र सुकेणी (इकरा) ता.निफाड",
      "श्रीकृष्ण मंदिर (धोडा पाडा) धानवड, बौद्ध मंदिर यात्रा जांबुवंत, श्रीदत्त देवस्थान यात्रा, श्रीचक्रधर मंदिर वडसा, ता.आर्वी, पंचकृष्ण मंदिर यात्रा, गरुडेश्वर, ता.नेवरी, श्रीक्षेत्र देवदेवेश्वर यात्रा, श्रीदत्त मंदिर यात्रा लोणी ता.देवळा, श्रीदत्त मंदिर संस्थान मंदिर यात्रा वरखेड, ता.श्रीरामपूर, श्रीदत्त मंदिर देवपन्नापर्व दिन, पिंपरी-गवळी",
      "जागतिक आरोग्यदिन",
      "पंचमी समाप्ती सायं.४.३५"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 8,
    tithi: "चैत्र कृ.६ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [
      "सप्तमी प्रारंभ सायं.७.२"
    ],
    yogs: ["भद्रायोग सायं.७.०१ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 9,
    tithi: "चैत्र कृ.७ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीक्षेत्र पंचमलेश्वर यात्रा, ता.नेवासा श्रीक्षेत्र वहाळगाव यात्रा, ता.अंधड, श्रीकृष्ण मंदिर यात्रा, वाघाळे, ता.शिरुर, श्रीकृष्ण मंदिर यात्रा दापूर, ता.सिन्नर, श्रीदत्त मंदिर यात्रा राहूरी, ता.उमरी",
      "सप्तमी समाप्ती रा.९.२०"
    ],
    yogs: ["भद्रा स.८.१२"],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 10,
    tithi: "चैत्र कृ.८ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "नवमी प्रारंभ रा.११.१८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 11,
    tithi: "चैत्र कृ.९ उत्तराषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रधर मंदिर यात्रा, श्रीक्षेत्र मायणी ता.आटपाडी जि.सांगली, श्रीकृष्ण मंदिर मढ-वर्धापन दिन, श्रीचक्रधर मंदिर वडसा, ता.आर्वी, श्रीदत्त मंदिर यात्रा कारेगाव ता.शिरुर",
      "म.ज्योतिबा फुले जयंती",
      "नवमी समाप्ती रा.१२.३८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 12,
    tithi: "चैत्र कृ.१० श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग दु.१.०२ प."],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 13,
    tithi: "चैत्र कृ.११ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक प्रारंभ स.९.५०"
    ],
    yogs: ["भद्रा योग रा.९.१६ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 14,
    tithi: "चैत्र कृ.१२ शततारका",
    shubhLabel: "",
    isShubh: false,
    events: ["मेष संक्रान्त"],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 15,
    tithi: "चैत्र कृ.१३ पू. भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: ["भद्रायोग योग सायं.५.३१"],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 16,
    tithi: "चैत्र कृ.१४ उ. भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: ["भद्रायोग योग स.९.२५ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 17,
    tithi: "चैत्र अमावस्या रेवती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन कोटंबा, ता. बाभुळगाव, जि. यवतमाळ",
      "अमावस्या समाप्ती दु. १२.०२ प.",
      "पंचक समाप्ती दु. १२.०२"
    ],
    yogs: ["अमृतसिद्धीयोग दु. १२.०२ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 18,
    tithi: "वैशाख शु.१ अश्विनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग प्रारंभ दु.१.०० नं."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 19,
    tithi: "वैशाख शु.२ भरणी/कृत्तिका",
    shubhLabel: "अक्षय तृतीया",
    isShubh: true,
    events: [
      "परशुराम जयंती / अक्षय तृतीया",
      "श्रीकृष्ण मंदिर वर्धापन दिन, गणेश पेठ, पुणे, श्रीकृष्ण ज्ञान मंदिर वर्धापन दिन, उमरखेड",
      "महानुभावीय मार्गशीर्ष मासारंभ",
      "तृतीया प्रारंभ स.१०.५०"
    ],
    yogs: [],
    isSunday: true,
    imageIcon: "pot",
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 20,
    tithi: "वैशाख शु.३/४ रोहिणी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "तृतीया समाप्ती स.७.२८"
    ],
    yogs: ["भद्रा योग सायं.५.५० प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 21,
    tithi: "वैशाख शु.५ मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "यमघंट योग रा.११.५९ ते स.६",
      "भद्रा योग उ.रा.४.१३ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 22,
    tithi: "वैशाख शु.६ आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 23,
    tithi: "वैशाख शु.७ पुनर्वसू",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन जांब ता. वाई, जि. सातारा"
    ],
    yogs: [
      "गुरुपुष्यामृत योग रा.८.५७ नं. स.६.०५ प.",
      "सप्तमी समाप्ती रा.८.५०"
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 24,
    tithi: "वैशाख शु.८ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "मृत्यू योग रा.८.१५ नं. उ. रात्री ६ प.",
      "दग्धयोग सायं.७.२० प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 25,
    tithi: "वैशाख शु.९ आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: ["दग्धयोग सायं.७.२९ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 26,
    tithi: "वैशाख शु.१० मघा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: ["दग्धयोग सायं.८.२७ प."],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 27,
    tithi: "वैशाख शु.११ पू.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "दग्धयोग सायं.६.०७",
      "भद्रा योग स.६.७ प.",
      "भद्रा योग सायं.६.१५ प."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 28,
    tithi: "वैशाख शु.१२ उ. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर फुलारीमठ वर्धापनदिन उध्रेगांव बु।।, ता. हदगाव, जि. नांदेड"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 29,
    tithi: "वैशाख शु.१३ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 30,
    tithi: "वैशाख शु.१४ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन वडगांव लांडगा, ता. संगमनेर, श्रीकृष्ण मंदिर वर्धापन दिन चिखला-यवतमाळ",
      "राष्ट्रसंत तुकडोजी म. जयंती",
      "पौर्णिमा प्रारंभ रा.१.१३"
    ],
    yogs: ["भद्रा योग रा.९.१२ प."],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  }
];

// Full extracted data from May 2026 Calendar Image
const mayDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "वैशाख पौर्णिमा स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "महाराष्ट्र दिन आंतरराष्ट्रीय कामगार दिन",
      "श्रीकृष्ण मंदिर वर्धापन दिन, वर्धा, जि. वर्धा",
      "पौर्णिमा समाप्ती रा. १०.५३"
    ],
    yogs: ["भद्रा योग स. १०.५० प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 2,
    tithi: "वैशाख कृ. १ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन, तरडगांव, ता. फलटण, जि. सातारा"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 3,
    tithi: "वैशाख कृ. २ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 4,
    tithi: "वैशाख कृ. ३ अनुराधा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग सायं. ४.१२ नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 5,
    tithi: "वैशाख कृ. ४ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: ["भद्रा योग स. ५.२४ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 6,
    tithi: "वैशाख कृ. ४ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन करंजोशी, ता. जि. सातारा"
    ],
    yogs: ["यमघंट योग दु. ३.५४ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 7,
    tithi: "वैशाख कृ. ५ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीदत्त मंदिर वर्धापन दिन कराची सावंगा, ता. काटोल, जि. नागपूर",
      "षष्ठी प्रारंभ स. १०.१३"
    ],
    yogs: ["दग्धयोग स. ६.१४ नं."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 8,
    tithi: "वैशाख कृ. ६ उत्तराषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण प्रभु पदस्पर्श पावनदिन",
      "श्रीचक्रधरस्वामींचे देवस्थान यात्रा महोत्सव श्रीक्षेत्र सुरेगाव, ता. कोपरगाव",
      "रविंद्रनाथ टागोर जयंती / जागतिक रेडक्रॉस दिन",
      "मोहिनी एकादशी",
      "षष्ठी समाप्ती दु. १२.१२"
    ],
    yogs: ["भद्रायोग दु. १२.२१ प."],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 9,
    tithi: "वैशाख कृ. ७ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर यात्रा जवळका, ता. पारगाव खंडाळा, जि. सातारा",
      "द्वारकाधिश श्रीकृष्ण मंदिर, आंबेगाव, जि. पुणे",
      "महाराणा प्रताप जयंती (तारखेप्रमाणे)"
    ],
    yogs: ["भद्रायोग दु. १.१५ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 10,
    tithi: "वैशाख कृ. ८ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक प्रारंभ सायं. ६.५०"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 11,
    tithi: "वैशाख कृ. ९ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण ज्ञानमंदिर वर्धापन दिन माहिंंद, ता. पाटण, जि. सातारा",
      "श्रीकृष्ण ज्ञानमंदिर वर्धापन दिन मौजे ओकोली, ता. शाहूवाडी, जि. कोल्हापूर",
      "विज्ञान तंत्रज्ञान दिन",
      "दशमी प्रारंभ दु. ३.२५"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 12,
    tithi: "वैशाख कृ. १० पू. भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "जागतिक तंबाखू विरोधी दिन / परिचारिका दिवस",
      "श्रीदत्त मंदिर यात्रा, पुणतांबा, ता. राहाता, जि. अ. नगर",
      "दशमी समाप्ती दु. २.५३"
    ],
    yogs: [
      "भद्रा योग स. ३.१४",
      "भद्रा दु. २.५२ प."
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 13,
    tithi: "वैशाख कृ. ११ उ. भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर स्वामी मंदिर वर्धापन दिन चिंचाळ, ता. पवनी, जि. भंडारा"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 14,
    tithi: "वैशाख कृ. १२ रेवती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण प्रभु स्थान प्रगट दिन, श्रीचक्रधर मंदिर, पिंपळगाव (माळवी), ता. जि. अ. नगर",
      "श्रीकृष्ण ज्ञान मंदिर वर्धापन दिन, कांगवाई, ता. दापोली, जि. रत्नागिरी",
      "धर्मवीर संभाजी महाराज जयंती (तारखेप्रमाणे)",
      "पंचक समाप्ती रा. १०.३४"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 15,
    tithi: "वैशाख कृ. १३/१४ अश्विनी",
    shubhLabel: "वृषभ संक्रान्त",
    isShubh: true,
    events: [
      "जागतिक कुटुंब दिन / वृषभ संक्रान्त"
    ],
    yogs: [
      "भद्रा योग स. ८.३१ प.",
      "भद्रा योग सायं. ६.५४ प."
    ],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 16,
    tithi: "वैशाख अमावस्या भरणी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीमूर्तिमंत सेवा महानुभाव आश्रम वर्धापन दिन वरखेडूर, ता. कोपरगाव, जि. अ. नगर"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 17,
    tithi: "अधिक ज्येष्ठ शु. १ कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन वाठोडा ले-आऊट श्रीकृष्ण नगर, नागपूर",
      "अधिक ज्येष्ठ मासारंभ"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 18,
    tithi: "अधिक ज्येष्ठ शु. २ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन हडगाव, जि. नांदेड",
      "श्रीकृष्ण ज्ञान मंदिर-वर्धापन दिन, वाकेश्वर, ता. खटाव, जि. सातारा",
      "श्रीपंचकृष्ण ज्ञानमंदिर वर्धापनदिन दगड सांगवी ता. लोहा, जि. नांदेड",
      "श्रीदत्त मंदिर वर्धापन दिन-मांडवा, जि. अकोला",
      "महानुभावीय अ. पौष मासारंभ"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 19,
    tithi: "अधिक ज्येष्ठ शु. ३ मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "यमघंट योग स. ८.४२ प.",
      "भद्रा रात्री १२.३९ नं."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 20,
    tithi: "अधिक ज्येष्ठ शु. ४ आर्द्रा/पुनर्वसू",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीदत्त मंदिर वर्धापन दिन तळई, ता. एरंडोल, जि. जळगाव",
      "श्रीकृष्ण मंदिर वर्धापन दिन आळदा, ता. मोताळा, जि. बुलढाणा",
      "महानुभाव श्रीदत्त मंदिर वर्धापनदिन, एरंडोल, जि. जळगाव"
    ],
    yogs: ["भद्रा योग दु. ११.०६"],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 21,
    tithi: "अधिक ज्येष्ठ शु. ५ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन, पिंपळपाडा, ता. मोखाडा, जि. ठाणे"
    ],
    yogs: [
      "गुरुपुष्यामृतयोग सूर्योदयापासून रा. २.५० प.",
      "दग्धयोग स. ८.२७ ते उ. रात्री ६.२५ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 22,
    tithi: "अधिक ज्येष्ठ शु. ६/७ आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 23,
    tithi: "अधिक ज्येष्ठ शु. ८ मघा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा सायं. ५.०५ नं.",
      "भद्रा योग सायं. ४.४० प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 24,
    tithi: "अधिक ज्येष्ठ शु. ९ पू.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 25,
    tithi: "अधिक ज्येष्ठ शु. १० उ. फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन, लोंढे, ता. नांदगाव, जि. नाशिक",
      "सूर्याचा रोहिणी नक्षत्रात दु. ३.२५ मि. वाहन : हत्ती"
    ],
    yogs: [
      "दग्धयोग उत्तररात्री ५.११ नं."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 26,
    tithi: "अधिक ज्येष्ठ शु. ११ हस्त",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा सायं. ५.४२ नं."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 27,
    tithi: "अधिक ज्येष्ठ शु. ११ चित्रा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन पिंपळी, ता. अमळनेर, जि. जळगाव"
    ],
    yogs: [
      "भद्रा योग स. ६.२१ प."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 28,
    tithi: "अधिक ज्येष्ठ शु. १२ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "स्वातंत्र्यवीर सावरकर जयंती"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 29,
    tithi: "अधिक ज्येष्ठ शु. १३ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 30,
    tithi: "अधिक ज्येष्ठ शु. १४ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग स. ११.५७ नं."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 31,
    tithi: "अधिक ज्येष्ठ पौर्णिमा अनुराधा",
    shubhLabel: "अहिल्याबाई होळकर जयंती",
    isShubh: true,
    events: [
      "श्रीकृष्ण फुल्लारी आई मंदिर वर्धापन दिन-पालम, जि. परभणी",
      "अहिल्याबाई होळकर जयंती",
      "मृत्युयोग सायं. ४.१२ नं."
    ],
    yogs: [
      "भद्रा योग दु. १.०५ प."
    ],
    isSunday: true,
    imageIcon: "jijau",
    weekIndex: 0,
    weekdayIndex: 0 // Sunday of Week 1 (Special placement)
  }
];

const juneDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "अधिक ज्येष्ठ कृ.१ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापनदिन आंबेगाव, ता. गंगापूर, जि. संभाजीनगर"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 2,
    tithi: "अधिक ज्येष्ठ कृ.२ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 3,
    tithi: "अधिक ज्येष्ठ कृ.३ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग स. ८.१२ प.",
      "भद्रा योग रा. ९.२० प."
    ],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 4,
    tithi: "अधिक ज्येष्ठ कृ.४ उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 5,
    tithi: "अधिक ज्येष्ठ कृ.५ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जागतिक पर्यावरण दिन"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 6,
    tithi: "अधिक ज्येष्ठ कृ.६ श्रवण",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 7,
    tithi: "अधिक ज्येष्ठ कृ.७ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक प्रारंभ स. ७.५६"
    ],
    yogs: [
      "भद्रा योग दु. ३.७ प."
    ],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 8,
    tithi: "अधिक ज्येष्ठ कृ.८ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा मृग नक्षत्रात प्रवेश स. ७.१८ वाहन : बेडूक"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 9,
    tithi: "अधिक ज्येष्ठ कृ.९ पू. भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "शिवराज्याभिषेक दिन"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 10,
    tithi: "अधिक ज्येष्ठ कृ.१० उ. भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जागतिक दृष्टीदान दिवस"
    ],
    yogs: [
      "भद्रा रात्री १.५२ प."
    ],
    isSunday: false,
    imageIcon: "eye",
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 11,
    tithi: "अधिक ज्येष्ठ कृ.११ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "साने गुरुजी स्मृती दिन",
      "पंचक समाप्ती स. ८.१७"
    ],
    yogs: [
      "भद्रा दु. १२.५७ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 12,
    tithi: "अधिक ज्येष्ठ कृ.१२ अश्विनी/भरणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "संस्कृत बोल कार्यशाळा प्रारंभ, मनसर जि. नागपूर"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 13,
    tithi: "अधिक ज्येष्ठ कृ.१३ कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग सायं. ४.०४ नं.",
      "भद्रा योग रा. २.१५ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 14,
    tithi: "अधिक ज्येष्ठ कृ.१४ रोहिणी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "जागतिक रक्तदान दिवस",
      "अमावस्या प्रारंभ दु. १२.२०"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 15,
    tithi: "अधिक ज्येष्ठ अमावस्या / निज ज्येष्ठ शु. १ मृगशीर्ष",
    shubhLabel: "",
    isShubh: false,
    events: [
      "मिश्रुन संक्रान्त"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 16,
    tithi: "निज ज्येष्ठ शु.२ आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रधर गुरुकुल संस्कृत महाविद्यालय वर्धापनदिन, पैजापूर, ता. यावल, जि. जळगाव",
      "महानुभावीय निज पौष मासारंभ"
    ],
    yogs: [
      "यमघट योग दु. ४.१२"
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 17,
    tithi: "निज ज्येष्ठ शु.३ पुनर्वसू",
    shubhLabel: "",
    isShubh: false,
    events: [
      "राजमाता जिजाऊसाहेब भोसले पुण्यतिथी (तारखेप्रमाणे)",
      "गोपाळ गणेश आगरकर पुण्यतिथी"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 18,
    tithi: "निज ज्येष्ठ शु.४ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "पुष्यामृत योग दु. ११.३३ प.",
      "भद्रा योग स. ८.१३ नं. सायं. ६.५८"
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 19,
    tithi: "निज ज्येष्ठ शु.५ आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "मृत्यूयोग स. १०.०७"
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 20,
    tithi: "निज ज्येष्ठ शु.६ मघा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 21,
    tithi: "निज ज्येष्ठ शु.७ पू. फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "जागतिक योग दिवस (वर्षातील सर्वात मोठा दिवस)",
      "दक्षिणायनारंभ, वर्षाऋतु प्रारंभ"
    ],
    yogs: [
      "भद्रा योग सायं. ३.२०"
    ],
    isSunday: true,
    imageIcon: "yoga",
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 22,
    tithi: "निज ज्येष्ठ शु.८ उ. फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रधर मंदिर श्रीचक्रधरप्रभू पदस्पर्श पावन दिन, श्रीक्षेत्र नेवरगाव, ता. गंगापूर, जि. संभाजीनगर",
      "सूर्याचा आर्द्रा नक्षत्रात प्रवेश स. ६.११ वाहन : बगळा"
    ],
    yogs: [
      "भद्रा योग दु. ३.२४"
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 23,
    tithi: "निज ज्येष्ठ शु.९ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 24,
    tithi: "निज ज्येष्ठ शु.१० चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 25,
    tithi: "निज ज्येष्ठ शु.११ स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग स. ७.०८ नं. रा. ८.९ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 26,
    tithi: "निज ज्येष्ठ शु.१२ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "यमघट योग सायं. ७.१६"
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 27,
    tithi: "निज ज्येष्ठ शु.१३ अनुराधा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 28,
    tithi: "निज ज्येष्ठ शु.१४ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पौर्णिमा प्रारंभ रा. ३.०६"
    ],
    yogs: [
      "भद्रा योग रा. ३.०६ नं."
    ],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 29,
    tithi: "निज ज्येष्ठ पौर्णिमा मूळ",
    shubhLabel: "वटपौर्णिमा",
    isShubh: true,
    events: [
      "वटपौर्णिमा",
      "पौर्णिमा समाप्ती उत्तरात्री ५.२६"
    ],
    yogs: [
      "भद्रा योग सायं. ४.१७ प."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 30,
    tithi: "निज ज्येष्ठ कृ.१ पूर्वाषाढा",
    shubhLabel: "अशनी दिन",
    isShubh: true,
    events: [
      "अशनी दिन"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  }
];

const julyDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "निज ज्येष्ठ कृ.१ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "महाराष्ट्र कृषी दिवस"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "sprout",
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 2,
    tithi: "निज ज्येष्ठ कृ.२ उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रा रात्री १०.३१ नं."
    ],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 3,
    tithi: "निज ज्येष्ठ कृ.३ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रा सकाळी ११.२० प."
    ],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 4,
    tithi: "निज ज्येष्ठ कृ.४ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक प्रारंभ दु. १.४०"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 5,
    tithi: "निज ज्येष्ठ कृ.५ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "षष्ठी प्रारंभ दु. १.३१"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 6,
    tithi: "निज ज्येष्ठ कृ.६ पू. भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीदत्त मंदिर पदस्पर्श पावन दिन श्रीकृष्ण वांजरगाव, ता. वैजापूर",
      "सूर्याचा पुनर्वसू नक्षत्रात प्रवेश दु. १२.०१ वाहन : घोडा",
      "षष्ठी समाप्ती दु. १.४८",
      "भद्रा दु. १.४७ नं."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 7,
    tithi: "निज ज्येष्ठ कृ.७ उ. भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रा योग रा. १.४ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 8,
    tithi: "निज ज्येष्ठ कृ.८ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक समाप्ती सायं. ४",
      "मृत्युयोग सायं. ४ नं."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 9,
    tithi: "निज ज्येष्ठ कृ.९ अश्विनी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग रात्री ९.३१ नं."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 10,
    tithi: "निज ज्येष्ठ कृ.१०/११ भरणी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग रात्री ८.१६ नं."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 11,
    tithi: "निज ज्येष्ठ कृ.१२ कृत्तिका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "विश्वजन संख्यादिन"
    ],
    yogs: [
      "अमृतसिद्धी योग स. ११.०४"
    ],
    isSunday: false,
    imageIcon: "sun",
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 12,
    tithi: "निज ज्येष्ठ कृ.१३ रोहिणी/मृगशीर्ष",
    shubhLabel: "",
    isShubh: false,
    events: [
      "चतुर्दशी प्रारंभ रा. १०.३०",
      "भद्रा रा. १०.२१ नं."
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 13,
    tithi: "निज ज्येष्ठ कृ.१४ आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "अमावस्या प्रारंभ सकाळी ६.५०",
      "भद्रा योग रा. १०.२१ नं."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 14,
    tithi: "निज ज्येष्ठ अमावस्या पुनर्वसू",
    shubhLabel: "",
    isShubh: false,
    events: [
      "अमावस्या समाप्ती दु. ३.१४"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 15,
    tithi: "आषाढ शु.१ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "द्वितीया प्रारंभ स. ११.५१"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 16,
    tithi: "आषाढ शु.२ आश्लेषा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "महानुभावीय माघ मासारंभ",
      "कर्क संक्रान्त",
      "द्वितीया समाप्ती स. ८.५३"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 17,
    tithi: "आषाढ शु.३/४ मघा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पदयात्रा प्रारंभ - लौकी, ता. येवला, जि. नाशिक ते श्रीक्षेत्र कनाशी, ता. भडगाव, जि. जळगाव"
    ],
    yogs: [
      "भद्रा सायं. ५.२९ नं."
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 18,
    tithi: "आषाढ शु.५ पू. फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "लोकशाहीर अण्णाभाऊ साठे स्मृतीदिवस"
    ],
    yogs: [
      "भद्रा योग प. ४.४२ प."
    ],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 19,
    tithi: "आषाढ शु.६ उ. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "अमृतसिद्धी योग सायं. ६.१२ नं."
    ],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 20,
    tithi: "आषाढ शु.७ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा पुष्य नक्षत्रात प्रवेश स. ११.२५ वाहन : उंदीर"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 21,
    tithi: "आषाढ शु.८ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रा योग रा. ४.०४ नं. सायं. ४.३४ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 22,
    tithi: "आषाढ शु.९ स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 23,
    tithi: "आषाढ शु.९ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "लोकमान्य टिळक जयंती"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 24,
    tithi: "आषाढ शु.१० अनुराधा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "आषाढी एकादशी निमित्त देवपूजा प्रसाद वंदन खर्डे, ता. शिरपूर, जि. धुळे स. ५.१५ पासून",
      "एकादशी प्रारंभ स. ९.१३"
    ],
    yogs: [
      "यमघट योग उ. रा. ०५.३७",
      "भद्रा योग रा. १०.२२ नं."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 25,
    tithi: "आषाढ शु.११ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "देवस्थानी आषाढी एकादशी, पंढरपूर यात्रा",
      "देवपूजा प्रसादवंदन-पुणे व नंदुरबार जिल्ह्यातील सर्व आश्रम व भक्तांच्या, वढई, वढोदे तसेच आमोदा, पुणतांबा, काटपूर, अमरावती, चाळीसगाव व इतर पुणे, सातारा, लातूर जिल्ह्यातील सर्व मोठे मंदिर भाविकांसाठी सदैव खुले राहतील. (याची सर्वांनी नोंद घेऊन वेळ पाळावी.)",
      "एकादशी समाप्ती स. ११.३५",
      "भद्रा योग स. ११.३५ प."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 26,
    tithi: "आषाढ शु.१२ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "कारगिल विजय दिवस",
      "त्रयोदशी प्रा. दु. १.५८"
    ],
    yogs: [],
    isSunday: true,
    imageIcon: "soldier",
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 27,
    tithi: "आषाढ शु.१३ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [
      "देवपूजा प्रसादवंदन - कठोरे, मोहाडी, कोरपावली, महेलखेडी व यावल, ता. यावल, जि. जळगाव",
      "त्रयोदशी समाप्ती दुपारी ४.१५"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 28,
    tithi: "आषाढ शु.१४ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "देवपूजा प्रसादवंदन - वळगाव, भादली, गोमी, वन्हाडसीम, वेल्हाळा, वरणगाव, भुसावळ, वाघोद, भालोद, जि. जळगाव व काटसूर, डाभेरी केलझरा, जि. अमरावती",
      "पौर्णिमा प्रारंभ सायं. ६.१९"
    ],
    yogs: [
      "भद्रा योग सायं. ६.१८"
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 29,
    tithi: "आषाढ पौर्णिमा उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "देवपूजा प्रसादवंदन - हरसुल, नाथी, धरणगाव, सावखेडा, उत्राण, फैलपुरा, पिंपरी, भोनक, जळगाव, loणदेव, मोहाडी, डोंगरकठाोरा, साकेगाव, सावदा, मंचूर, कळमोदा, भोकर, ता. जळगाव व वरणगाव, लोखंडीधाम, कोचूर, सोनईत, उडताई, ता. मुक्ताईनगर, वैजापूर, संभाजीनगर, पुणे व इतर सर्व ठिकाणी धार्मिक उत्सव व देवपूजा",
      "पौर्णिमा समाप्ती रा. ८.०६"
    ],
    yogs: [
      "भद्रा योग स. ७.१४ प."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 30,
    tithi: "आषाढ कृ.१ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "प्रतिपदा समाप्ती रात्री ९.३१"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 31,
    tithi: "आषाढ कृ.२ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "देवपूजा प्रसादवंदन - शिरसगांव, बीड, ता. चांदूर बाजार, श्रीदत्त मंदिर पदस्पर्श पावनदिन, श्रीक्षेत्र लासूर, ता. वैजापूर, जि. संभाजीनगर",
      "द्वितीया समाप्ती रा. १०.३२",
      "पंचक प्रारंभ सायं. ७.२५"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 5 // Friday
  }
];

const augustDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "आषाढ कृ.३ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "लोकमान्य टिळक पुण्यतिथी",
      "लोक अण्णाभाऊ साठे जयंती",
      "वनमहोत्सव दिवस"
    ],
    yogs: [
      "भद्रा योग सं. १०.५२ नं. रात्री ११.०७ प."
    ],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 2,
    tithi: "आषाढ कृ.४ पू.भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 3,
    tithi: "आषाढ कृ.५ उ.भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा आश्लेषा नक्षत्रात प्रवेश सकाळी १०.२० वाहन : हत्ती"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 4,
    tithi: "आषाढ कृ.६ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक समाप्ती रा. ९.५४",
      "भद्रा रा. १०.०३ नं."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 5,
    tithi: "आषाढ कृ.७ अश्विनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जम्मू-काश्मीर-लडाख-केंद्र शासित प्रदेश घोषित",
      "मृत्युयोग रा. ९.१८ प.",
      "भद्रा स. ९.२६ प."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 6,
    tithi: "आषाढ कृ.८ भरणी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 7,
    tithi: "आषाढ कृ.९ कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग रात्री ९.३२ नं."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 8,
    tithi: "आषाढ कृ.१० रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "अमृतसिद्धी योग सायं. ४.५१",
      "भद्रा योग दु. १.५९ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 9,
    tithi: "आषाढ कृ.११ मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 10,
    tithi: "आषाढ कृ.१२/१३ आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 11,
    tithi: "आषाढ कृ.१४ पुनर्वसू",
    shubhLabel: "",
    isShubh: false,
    events: [
      "संत सावता माळी पुण्यतिथी",
      "अमावस्या प्रारंभ रा. ९.५४",
      "भद्रा योग दु. ४.५४"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 12,
    tithi: "आषाढ अमावस्या पुष्य/आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "अमावस्या समाप्ती रा. ११.०४"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 13,
    tithi: "श्रावण शु.१ मघा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 14,
    tithi: "श्रावण शु.२ पू.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "महानुभावीय फाल्गुन मासारंभ"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 15,
    tithi: "श्रावण शु.३ उ.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "स्वातंत्र्य दिन"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flag",
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 16,
    tithi: "श्रावण शु.४ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "अमृतसिद्धीयोग रा. ३.५१ प.",
      "भद्रा योग सायं. ०४.५"
    ],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 17,
    tithi: "श्रावण शु.५ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा मघा नक्षत्रात प्रवेश सकाळी ७.५७ वाहन : मोर",
      "सिंह संक्रान्त",
      "नागपंचमी"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 18,
    tithi: "श्रावण शु.६ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 19,
    tithi: "श्रावण शु.७ स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "जागतिक छायाचित्र दिवस"
    ],
    yogs: [
      "भद्रा योग सायं. ०७.१९ नं."
    ],
    isSunday: false,
    imageIcon: "eye",
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 20,
    tithi: "श्रावण शु.८ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रा सकाळी ८.१५ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 21,
    tithi: "श्रावण शु.९ अनुराधा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "यमघंट योग स. ११.५३ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 22,
    tithi: "श्रावण शु.१० ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 23,
    tithi: "श्रावण शु.११ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग सायं. ३.१० नं."
    ],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 24,
    tithi: "श्रावण शु.१२ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्री संत सेना म. पुण्यतिथी"
    ],
    yogs: [
      "भद्रा योग स. ४.१८ प."
    ],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 25,
    tithi: "श्रावण शु.१३ उत्तराषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "संत नरहरी सोनार जयंती"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 26,
    tithi: "श्रावण शु.१३ @shravan", // Unique identifier/placeholder so we can type easily
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पवित्रपर्व (पहिले पर्वकाळ हा आज सायं. साजरा करावा)",
      "चतुर्दशी प्रारंभ स. ७.५८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 27,
    tithi: "श्रावण शु.१४ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पु. आचार्य श्री. भास्कर बाबा म. शाहदा गुरुपूजन गुजर खुर्द",
      "चतुर्दशी समाप्ती स. ९.०९",
      "पंचक प्रारंभ रा. २.१६ नं."
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 28,
    tithi: "श्रावण पौर्णिमा शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "रक्षाबंधन",
      "पौर्णिमा समाप्ती स. ९.४९"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 4,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 29,
    tithi: "श्रावण कृ.१ पू.भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 30,
    tithi: "श्रावण कृ.२ उ.भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा पूर्वा नक्षत्रात प्रवेश पहाटे ३.५७ वाहन : गाढव"
    ],
    yogs: [
      "भद्रा योग रा. ९.१७ नं."
    ],
    isSunday: true,
    weekIndex: 0,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 31,
    tithi: "श्रावण कृ.३ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक समाप्ती रा. ३.२४",
      "भद्रा योग स. ८.५० प."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 1 // Monday
  }
];

const septemberDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "श्रावण कृ.४/५ अश्विनी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "अमृतसिद्धी योग रात्री २.४२ प."
    ],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 2,
    tithi: "श्रावण कृ.६ भरणी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 3,
    tithi: "श्रावण कृ.७ कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [
      "अष्टमी प्रारंभ रा. २.२६",
      "भद्रा योग प. ४.२५ नं. दु. ३.२७ प."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 4,
    tithi: "श्रावण कृ.८ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण जन्मोत्सव - जन्मोत्सव रात्री १२ वा.",
      "महानुभाव पंथातील सर्व आश्रम, मठ, मंदिर व सर्वत्र जन्मोत्सव साजरा करतात.",
      "अष्टमी समाप्ती रा. १२.१४"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 5,
    tithi: "श्रावण कृ.९ मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर पालखी सोहळा, सावखेडबारा, ता. सोयगांव",
      "श्रीदत्त मंदिर गीता सप्ताह समाप्ती हिरवेखेडा बु, ता. जामनेर",
      "शिक्षक दिन"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 6,
    tithi: "श्रावण कृ.१० आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग स. ८.४१ रा. ७.२१ प."
    ],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 7,
    tithi: "श्रावण कृ.११ पुनर्वसू",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 8,
    tithi: "श्रावण कृ.१२ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "साक्षरता दिन"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 9,
    tithi: "श्रावण कृ.१३ आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "मातृदिन"
    ],
    yogs: [
      "भद्रा योग दु. १२.३० नं. रात्री ११.२९ प."
    ],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 10,
    tithi: "श्रावण कृ.१४ मघा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पोळा, दर्श पिठोरी अमावस्या",
      "अमावस्या प्रारंभ स. १०.३४"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "sprout",
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 11,
    tithi: "श्रावण अमावस्या पू.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "अमावस्या समाप्ती स. ८.५६"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 12,
    tithi: "भाद्रपद शु.१ उ. फाल्गुनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीचक्रधर प्रभू अवतार दिन (जन्मोत्सव दु. १२ ते १)",
      "श्रीचक्रधर शके ८०५ प्रारंभ",
      "महानुभावीय चैत्र मासारंभ",
      "द्वितीया प्रारंभ स. ७.४७"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 13,
    tithi: "भाद्रपद शु.२ हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा उत्तरा नक्षत्रात प्रवेश रात्री ९.४५ वाहन : बेडूक",
      "द्वितीया समाप्ती स. ७.०९"
    ],
    yogs: [
      "अमृतसिद्धी योग दु. १.०७ प."
    ],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 14,
    tithi: "भाद्रपद शु.३ चित्रा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "विश्व हिंदी दिवस"
    ],
    yogs: [
      "भद्रा योग सायं. ७.२०"
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 15,
    tithi: "भाद्रपद शु.४ स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "गणेश चतुर्थी"
    ],
    yogs: [
      "भद्रा योग स. ७.४४ प."
    ],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 16,
    tithi: "भाद्रपद शु.५ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जागतिक ओझोन संवर्धन दिन"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 17,
    tithi: "भाद्रपद शु.६ अनुराधा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "विश्वकर्मा प्रगट दिवस",
      "कन्या संक्रान्त"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "vishwakarma",
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 18,
    tithi: "भाद्रपद शु.७ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग दु. १ नंतर"
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 19,
    tithi: "भाद्रपद शु.८ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "भद्रा योग रा. २.१३ प."
    ],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 20,
    tithi: "भाद्रपद शु.९ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 21,
    tithi: "भाद्रपद शु.१० उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "मृत्युयोग अहोरात्र"
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 22,
    tithi: "भाद्रपद शु.११ उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [
      "भद्रा योग स. ८.५५ नं. रा. ९.४३ प."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 23,
    tithi: "भाद्रपद शु.१२ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "त्रयोदशी प्रारंभ रा. १०.५१"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 24,
    tithi: "भाद्रपद शु.१३ धनिष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीगोविंद प्रभू जन्मोत्सव काटसूर (जन्मोत्सव रात्री १० वा. आज रात्री जन्म १० वा. साजरा करावा)",
      "त्रयोदशी समाप्ती रा. ११.१९",
      "पंचक प्रारंभ स. १०.३५"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 25,
    tithi: "भाद्रपद शु.१४ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पौर्णिमा प्रारंभ रा. ११.०४"
    ],
    yogs: [
      "भद्रा योग रा. ११.०६ नं."
    ],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 26,
    tithi: "भाद्रपद पौर्णिमा पू.भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "जागतिक हृदय दिवस",
      "पौर्णिमा समाप्ती रा. १०.११"
    ],
    yogs: [
      "भद्रा योग स. १०.४६ प."
    ],
    isSunday: false,
    imageIcon: "eye",
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 27,
    tithi: "भाद्रपद कृ.१ उ. भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा हस्त नक्षत्रात प्रवेश दुपारी १.१८ वाहन : उंदीर",
      "आत्मशांती ज्ञानयज्ञ भंडारा, जि. भंडारा प्रारंभ"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 28,
    tithi: "भाद्रपद कृ.२ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक समाप्ती सकाळी १०.१०"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 29,
    tithi: "भाद्रपद कृ.३ अश्विनी",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [
      "अमृतसिद्धी योग स. ९.०४ प.",
      "भद्रा योग स. ६.१३ नं. सायं. ५.०९ प."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 30,
    tithi: "भाद्रपद कृ.४ भरणी/कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  }
];

const octoberDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "भाद्रपद कृ.५ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: ["पंचमी समाप्ती दु. १२.३६"],
    yogs: ["यमघंट योग स. ६.०३ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 2,
    tithi: "भाद्रपद कृ.६ मृग",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [
      "महात्मा गांधी जयंती",
      "लाल बहादूर शास्त्री जयंती",
      "षष्ठी समाप्ती स. १०.१६"
    ],
    yogs: ["भद्रा योग रा. ९.०७ प."],
    isSunday: false,
    imageIcon: "flag",
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 3,
    tithi: "भाद्रपद कृ.७/८ आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "सप्तमी समाप्ती स. ८.००",
      "अष्टमी समाप्ती उत्तररात्रौ ५.५२"
    ],
    yogs: ["कालाष्टमी"],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 4,
    tithi: "भाद्रपद कृ.९ पुनर्वसु",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "अविद्या नवमी",
      "नवमी समाप्ती उत्तररात्रौ ३.५४"
    ],
    yogs: ["अमृतसिद्धी योग", "रवियोग"],
    isSunday: true,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 5,
    tithi: "भाद्रपद कृ.१० पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "दशमी समाप्ती उत्तररात्रौ २.०८"
    ],
    yogs: ["सर्वार्थसिद्धी योग"],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 6,
    tithi: "भाद्रपद कृ.११ आश्लेषा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "इंदिरा एकादशी",
      "एकादशी समाप्ती उत्तररात्रौ १२.३५"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 7,
    tithi: "भाद्रपद कृ.१२ मघा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "द्वादशी समाप्ती रा. ११.१७",
      "मघा श्राद्ध",
      "सन्यासियांचे श्राद्ध"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 8,
    tithi: "भाद्रपद कृ.१३ पूर्वा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "त्रयोदशी समाप्ती रा. १०.१६",
      "महानुभाव प्रवचन सोहळा"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 9,
    tithi: "भाद्रपद कृ.१४ उत्तरा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "घटस्फोट श्राद्ध",
      "अमावास्या प्रारंभ रा. ९.३६",
      "चतुर्दशी समाप्ती रा. ९.३६"
    ],
    yogs: ["भद्रा योग स. ९.५४ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 10,
    tithi: "भाद्रपद अमावास्या हस्त",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सर्वपित्री दर्श अमावास्या",
      "अमावास्या समाप्ती रा. ९.२०"
    ],
    yogs: ["पितृमोक्ष अमावास्या"],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 11,
    tithi: "अश्विन शु.१ चित्रा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "शारदीय नवरात्रोत्सव प्रारंभ",
      "घटस्थापना",
      "महाराजा अग्रसेन जयंती",
      "प्रतिपदा समाप्ती रा. ९.३२"
    ],
    yogs: ["रवियोग", "वैधृती योग"],
    isSunday: true,
    imageIcon: "flower",
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 12,
    tithi: "अश्विन शु.२ स्वाती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "द्वितीया समाप्ती रा. १०.१४"
    ],
    yogs: ["अमृतसिद्धी योग"],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 13,
    tithi: "अश्विन शु.३ विशाखा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "तृतीया समाप्ती रा. ११.२८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 14,
    tithi: "अश्विन शु.४ अनुराधा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "उपांग ललिता व्रत",
      "विनायक चतुर्थी",
      "चतुर्थी समाप्ती उत्तररात्रौ १.१४"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 15,
    tithi: "अश्विन शु.५ ज्येष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "ललिता पंचमी",
      "पंचमी समाप्ती उत्तररात्रौ ३.२६"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 16,
    tithi: "अश्विन शु.६ ज्येष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "षष्ठी समाप्ती उत्तररात्रौ ५.५५",
      "सरस्वती आवाहन"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 17,
    tithi: "अश्विन शु.७ मूळ",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [
      "तुला संक्रांती दु. १.४२",
      "सप्तमी अहोरात्र",
      "सरस्वती पूजन"
    ],
    yogs: ["त्रिपुष्कर योग"],
    isSunday: false,
    imageIcon: "sun",
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 18,
    tithi: "अश्विन शु.७/८ पू.षा.",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "दुर्गाष्टमी / महाष्टमी",
      "सप्तमी समाप्ती स. ८.२९",
      "सरस्वती विसर्जन"
    ],
    yogs: ["भद्रा योग रा. ९.४३ नं."],
    isSunday: true,
    imageIcon: "flower",
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 19,
    tithi: "अश्विन शु.८ उ.षा.",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "महानवमी प्रारंभ",
      "अष्टमी समाप्ती स. १०.५२"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 20,
    tithi: "अश्विन शु.९ उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सीमोल्लंघन",
      "नवरात्रोत्थापन",
      "पाळणा",
      "नवमी समाप्ती दु. १२.५१"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 21,
    tithi: "अश्विन शु.१० धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "विजयादशमी (दसरा)",
      "दशमी समाप्ती दु. २.१२",
      "पंचक प्रारंभ दु. ३.४८"
    ],
    yogs: ["सर्वार्थसिद्धी योग"],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 22,
    tithi: "अश्विन शु.११ शततारका",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पाशांकुशा एकादशी",
      "श्रीबालाजी रथ, खालचे गाव, शिरपूर",
      "एकादशी समाप्ती दु. २.४९"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 23,
    tithi: "अश्विन शु.१२ पू.भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्री बालाजी रथ वरचे गाव, शिरपूर, जि. धुळे",
      "द्वारका यात्रा",
      "द्वादशी समाप्ती दु. २.३६"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 24,
    tithi: "अश्विन शु.१३ उ.भाद्रपदा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "सूर्याचा स्वाती नक्षत्रात प्रवेश दु. १२.५९ वाहन : बेडूक",
      "प्रदोष व्रत",
      "त्रयोदशी समाप्ती दु. १.३७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 25,
    tithi: "अश्विन शु.१४ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "कोजागिरी पौर्णिमा प्रारंभ",
      "पौर्णिमा प्रारंभ स. ११.५७",
      "पंचक समाप्ती साय. ७.२२",
      "चतुर्दशी समाप्ती स. ११.५७"
    ],
    yogs: [],
    isSunday: true,
    imageIcon: "pot",
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 26,
    tithi: "अश्विन पौर्णिमा अश्विनी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "महर्षी वाल्मीकि जयंती",
      "कोजागिरी पौर्णिमा",
      "पौर्णिमा समाप्ती स. ९.४२"
    ],
    yogs: ["अमृतसिद्धी योग"],
    isSunday: false,
    imageIcon: "yoga",
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 27,
    tithi: "अश्विन कृ.१/२ भरणी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "प्रतिपदा समाप्ती स. ७.०२",
      "द्वितीया समाप्ती उत्तररात्रौ ४.०७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 28,
    tithi: "अश्विन कृ.३ कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [
      "तृतीया समाप्ती उत्तररात्रौ १.०७"
    ],
    yogs: [
      "भद्रा योग दु. २.३६ नं."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 29,
    tithi: "अश्विन कृ.४ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "संकष्ट चतुर्थी",
      "चंद्रोदय रा. ८.४४",
      "पंचमी प्रारंभ रा. १०.११",
      "चतुर्थी समाप्ती रा. १०.११"
    ],
    yogs: [
      "भद्रा योग रा. १.०६ प.",
      "मृत्युयोग स. ११.१२ प."
    ],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 30,
    tithi: "अश्विन कृ.५ मृग",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचमी समाप्ती सायं. ७.२५"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 31,
    tithi: "अश्विन कृ.६ आर्द्रा",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [
      "षष्ठी समाप्ती दुपारी ४.५८"
    ],
    yogs: [
      "भद्रा योग उत्तररात्रौ ३.५२ प."
    ],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 6 // Saturday
  }
];

const novemberDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "अश्विन कृ.७ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग दु. ३.५१ प."],
    isSunday: true,
    weekIndex: 0,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 2,
    tithi: "अश्विन कृ.८ आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "औद्योगिक सुरक्षा दिवस",
      "नवमी प्रारंभ दु. १.११"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 3,
    tithi: "अश्विन कृ.९ मघा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रपाणि प्रभू जन्मोत्सव",
      "(जन्मकाळ पहाटे ४ ते ६) फलटण जन्मकाळ हा पहाटे साजरा करावा.",
      "नवमी समाप्ती स. ११.५५"
    ],
    yogs: ["भद्रा योग रा. ११.२५ नं."],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 0,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 4,
    tithi: "अश्विन कृ.१० पू.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रपाणि प्रभू जन्मोत्सवानिमित्त पालखी सोहळा श्रीक्षेत्र अरणगाव, जि.अ.नगर",
      "दशमी समाप्ती स. ११.०४"
    ],
    yogs: ["भद्रा योग स. ११.०३ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 5,
    tithi: "अश्विन कृ.११ उ.फाल्गुनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "वसुबारस"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 6,
    tithi: "अश्विन कृ.१२ हस्त",
    shubhLabel: "",
    isShubh: false,
    events: [
      "धनत्रयोदशी"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 7,
    tithi: "अश्विन कृ.१३ चित्रा",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: ["भद्रा योग स. १०.४७ नं. रा. ११.०४ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 8,
    tithi: "अश्विन कृ.१४ स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रपाणि सेवा मंडळ घाटकोपर मुंबई द्वारा आयोजित, श्रीचक्रपाणि जन्मोत्सव मुंबई",
      "शिवरात्री",
      "अमावस्या प्रारंभ स. ११.२८"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 9,
    tithi: "अश्विन अमावास्या स्वाती",
    shubhLabel: "",
    isShubh: false,
    events: [
      "दर्श अमावास्या",
      "लक्ष्मीपूजन, दीपावली",
      "महावीर निर्वाण दिन",
      "अमावास्या समाप्ती दु. १२.३२"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 10,
    tithi: "कार्तिक शु.१ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "दिवाळी पाडवा, बली प्रतिपदा",
      "गोवर्धन पूजा",
      "वही पूजन"
    ],
    yogs: [],
    isSunday: false,
    imageIcon: "fire",
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 11,
    tithi: "कार्तिक शु.२ अनुराधा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "महानुभावीय ज्येष्ठ मासारंभ",
      "यमद्वितीया, हेमंत ऋतु प्रारंभ",
      "भाऊबीज"
    ],
    yogs: ["अमृतसिद्धी योग स. ११.३८ प."],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 12,
    tithi: "कार्तिक शु.३ ज्येष्ठा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण मंदिर वर्धापन दिन शिक्रापूर, ता.शिरूर, जि.पुणे"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 13,
    tithi: "कार्तिक शु.४ मूळ",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रधर स्वामी मंदिर वर्धापन दिन श्रीक्षेत्र बळेगांव, ता. अंबड, जि.जालना"
    ],
    yogs: ["भद्रा योग स. ७.२४ नं. रात्री ८.४२ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 14,
    tithi: "कार्तिक शु.५ पूर्वाषाढा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीकृष्ण ज्ञान मंदिर वर्धापन दिन जांभा खु. ता. मूर्तीजापूर, जि.अकोला",
      "श्रीकृष्ण सेवा महानुभाव मंदिर (ट्रस्ट) वर्धापन दिन मळद, ता. दौंड, जि.पुणे."
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 15,
    tithi: "कार्तिक शु.६ उत्तराषाढा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 16,
    tithi: "कार्तिक शु.७ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "जलाराम बाप्पा जयंती",
      "वृश्चिक संक्रान्त"
    ],
    yogs: [
      "अमृतसिद्धीयोग रात्री २.१७",
      "भद्रा रात्री ४.१९ नं."
    ],
    isSunday: false,
    imageIcon: "jijau",
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 17,
    tithi: "कार्तिक शु.८ धनिष्ठा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "पंचक प्रारंभ रा. १२.३५"
    ],
    yogs: ["भद्रा योग सायं. ५.१७ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 18,
    tithi: "कार्तिक शु.९ शततारका",
    shubhLabel: "",
    isShubh: false,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 19,
    tithi: "कार्तिक शु.९ पू.भाद्रपदा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीहंस अवतार प्रकट दिन (माहिती व्हावी याकरिता प्रकाशित करीत आहोत. कार्यक्रम किंवा या नावाचे नामस्मरण करु नये)",
      "नवमी समाप्ती स. ७.०७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 20,
    tithi: "कार्तिक शु.१०/११ पू./उ.भाद्रपद",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीचक्रधर मंदिर पदस्पर्श पावनदिन पिंपळगाव केळी, ता.आष्टी, जि.बीड",
      "प्रबोधिनी स्मार्त एकादशी",
      "तुलसी विवाह प्रारंभ",
      "एकादशी प्रारंभ स. ७.१६"
    ],
    yogs: ["भद्रायोग सायं. ८.५७ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 21,
    tithi: "कार्तिक शु.१२ रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "एकादशी समाप्ती पहाटे ६.३२"
    ],
    yogs: ["भद्रा योग स. ७ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 22,
    tithi: "कार्तिक शु.१३ अश्विनी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पंचक समाप्ती स. ५.५५"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 23,
    tithi: "कार्तिक शु.१४ भरणी",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पौर्णिमा प्रारंभ रा. ११.४३"
    ],
    yogs: ["भद्रा योग रा. ११.४२"],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 24,
    tithi: "कार्तिक पौर्णिमा कृत्तिका",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीक्षेत्र वडनेर भुजंग यात्रा जि.अमरावती",
      "श्रीचक्रधर मंदिर यात्रा श्रीक्षेत्र सावखेडा बुद्रुक, जि.संभाजी नगर",
      "श्री पंचकृष्ण मंदिर, बाभूळते",
      "गुरु नानक जयंती",
      "तुलसी विवाह समाप्ती",
      "त्रिपुरी पौर्णिमा",
      "पौर्णिमा समाप्ती रा. ८.२४"
    ],
    yogs: ["भद्रा योग स. १०.०५ प."],
    isSunday: false,
    imageIcon: "flower",
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 25,
    tithi: "कार्तिक कृ.१ रोहिणी",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीदत्त मंदिर दहिहंडी खर्शीखाड, जि.यवतमाळ",
      "प्रतिपदा समाप्ती सायं. ४.५१"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 26,
    tithi: "कार्तिक कृ.२ मृगशीर्ष",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "श्रीकृष्ण मंदिर, वर्धापन दिन दि. २६ व २७ हायवे क्रॉस जवळ, धुळे, जि.धुळे",
      "पदस्पर्श पावन दिन श्रीचक्रधर मंदिर श्रीक्षेत्र मद्विंपी, जि.अ.नगर",
      "द्वितीया समाप्ती दु. १.१६"
    ],
    yogs: [
      "भद्रा योग रा. ११.३ नं.",
      "मृत्युयोग सायं. ५.४७ प."
    ],
    isSunday: false,
    imageIcon: "pot",
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 27,
    tithi: "कार्तिक कृ.३/४ आर्द्रा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "पंचमी प्रारंभ उत्तररात्री ६.४०"
    ],
    yogs: ["भद्रा योग स. ९.४८ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 28,
    tithi: "कार्तिक कृ.५ पुनर्वसू",
    shubhLabel: "",
    isShubh: false,
    events: [
      "श्रीक्षेत्र डोईफोडेविर यात्रा, जि.बुलढाणा",
      "श्री वांजेश्वरी मंदिर यात्रा, वाका, जि.नांदेड",
      "श्री गोपीराज मंदिर यात्रा, आष्टूर ता.लोहा, जि.नांदेड",
      "श्रीगोविंदप्रभू मंदिर यात्रा, इत्नली, जि.नांदेड",
      "म. ज्योतिबा फुले पुण्यतिथी",
      "पंचमी समाप्ती उ.रा. ३.५८"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 29,
    tithi: "कार्तिक कृ.६ पुष्य",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रायोग रा. १.४६ नं."],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 30,
    tithi: "कार्तिक कृ.७ आश्लेषा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "सप्तमी समाप्ती १२.१२"
    ],
    yogs: ["भद्रायोग दु. १२.५४ प."],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  }
];

const januaryDaysWithMonth: MahanubhavCalendarDay[] = januaryDays;
const februaryDays: MahanubhavCalendarDay[] = februaryDaysRaw.map(d => ({ ...d, month: "feb" }));
const marchDays: MahanubhavCalendarDay[] = marchDaysRaw.map(d => ({ ...d, month: "mar" }));
const aprilDays: MahanubhavCalendarDay[] = aprilDaysRaw.map(d => ({ ...d, month: "apr" }));
const mayDays: MahanubhavCalendarDay[] = mayDaysRaw.map(d => ({ ...d, month: "may" }));
const juneDays: MahanubhavCalendarDay[] = juneDaysRaw.map(d => ({ ...d, month: "jun" }));
const julyDays: MahanubhavCalendarDay[] = julyDaysRaw.map(d => ({ ...d, month: "jul" }));
const augustDays: MahanubhavCalendarDay[] = augustDaysRaw.map(d => ({ ...d, month: "aug" }));
const septemberDays: MahanubhavCalendarDay[] = septemberDaysRaw.map(d => ({ ...d, month: "sep" }));
const octoberDays: MahanubhavCalendarDay[] = octoberDaysRaw.map(d => ({ ...d, month: "oct" }));
const novemberDays: MahanubhavCalendarDay[] = novemberDaysRaw.map(d => ({ ...d, month: "nov" }));
const decemberDaysRaw: Omit<MahanubhavCalendarDay, 'month'>[] = [
  {
    dayNumber: 1,
    tithi: "कार्तिक कृ.८ मघा",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: ["कालाष्टमी"],
    yogs: ["वैधृति योग दु. १२.१५ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 2,
    tithi: "कार्तिक कृ.९ पूर्वा",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 3,
    tithi: "कार्तिक कृ.१० उत्तरा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 4,
    tithi: "कार्तिक कृ.११ हस्त",
    shubhLabel: "उत्पत्ती एकादशी",
    isShubh: true,
    events: [
      "उत्पत्ती एकादशी उपवास",
      "एकादशी समाप्ती रा. ११.४५"
    ],
    yogs: [],
    imageIcon: "flower",
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 5,
    tithi: "कार्तिक कृ.१२ चित्रा",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: ["प्रदोष"],
    yogs: ["भद्रा योग दु. १२.१६ प."],
    isSunday: false,
    weekIndex: 0,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 6,
    tithi: "कार्तिक कृ.१३ स्वाती",
    shubhLabel: "महापरिनिर्वाण दिन",
    isShubh: false,
    events: [
      "डॉ. बाबासाहेब आंबेडकर महापरिनिर्वाण दिन",
      "मासिक शिवरात्री"
    ],
    yogs: [],
    isSunday: true,
    weekIndex: 1,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 7,
    tithi: "कार्तिक कृ.१४ विशाखा",
    shubhLabel: "",
    isShubh: false,
    events: [
      "अमावास्या प्रारंभ दु. ०४.१३"
    ],
    yogs: ["भद्रा योग दु. ०३.१५ प."],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 8,
    tithi: "कार्तिक अमावास्या अनुराधा",
    shubhLabel: "दर्श अमावास्या",
    isShubh: false,
    events: [
      "दर्श अमावास्या",
      "कार्तिक समाप्ती",
      "अमावास्या समाप्ती स. ०६.२२"
    ],
    yogs: [],
    imageIcon: "pot",
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 9,
    tithi: "मार्गशीर्ष शु.१ ज्येष्ठा",
    shubhLabel: "मार्गशीर्ष मासारंभ",
    isShubh: true,
    events: [
      "मार्गशीर्ष मासारंभ",
      "देव दीपावली प्रारंभ",
      "चंद्रदर्शन"
    ],
    yogs: [],
    imageIcon: "fire",
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 10,
    tithi: "मार्गशीर्ष शु.१ मूळ",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [
      "प्रतिपदा समाप्ती स. ०८.४७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 11,
    tithi: "मार्गशीर्ष शु.२ पू.षा.",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 12,
    tithi: "मार्गशीर्ष शु.३ उ.षा.",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 1,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 13,
    tithi: "मार्गशीर्ष शु.४ श्रवण",
    shubhLabel: "विनायक चतुर्थी",
    isShubh: true,
    events: [
      "विनायक चतुर्थी",
      "अंगारक योग"
    ],
    yogs: ["भद्रा योग सायं. ०४.४८ प."],
    imageIcon: "flower",
    isSunday: true,
    weekIndex: 2,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 14,
    tithi: "मार्गशीर्ष शु.५ श्रवण",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [
      "नागदिवाळी",
      "पंचमी समाप्ती सायं. ०७.१७"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 15,
    tithi: "मार्गशीर्ष शु.६ धनिष्ठा",
    shubhLabel: "चंपाषष्ठी",
    isShubh: true,
    events: [
      "चंपाषष्ठी उत्सव",
      "खंडोबा नवरात्रोत्थापन",
      "मार्तंड भैरवोत्थ उत्सव"
    ],
    yogs: [],
    imageIcon: "fire",
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 16,
    tithi: "मार्गशीर्ष शु.७ शततारा",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 17,
    tithi: "मार्गशीर्ष शु.८ पू.भा.",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग स. ११.१३ प."],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 18,
    tithi: "मार्गशीर्ष शु.९ उ.भा.",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [
      "श्रीमद भगवद्गीता सप्ताह ज्ञानयज्ञ प्रारंभ"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 19,
    tithi: "मार्गशीर्ष शु.१० रेवती",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 2,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 20,
    tithi: "मार्गशीर्ष शु.११ अश्विनी",
    shubhLabel: "मोक्षदा एकादशी",
    isShubh: true,
    events: [
      "मोक्षदा एकादशी उपवास",
      "श्रीमद भगवद्गीता जयंती",
      "महानुभाव प्रवचन व ज्ञानसत्र"
    ],
    yogs: [],
    imageIcon: "flower",
    isSunday: true,
    weekIndex: 3,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 21,
    tithi: "मार्गशीर्ष शु.१२ भरणी",
    shubhLabel: "मत्स्य द्वादशी",
    isShubh: true,
    events: [
      "मत्स्य द्वादशी",
      "द्वादशी समाप्ती सायं. ०५.३७"
    ],
    yogs: ["भद्रा योग सायं. ०६.३६ प."],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 22,
    tithi: "मार्गशीर्ष शु.१३ कृत्तिका",
    shubhLabel: "प्रदोष",
    isShubh: true,
    events: [
      "प्रदोष व्रत",
      "दत्त जन्मोत्सव पूर्वतयारी"
    ],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 23,
    tithi: "मार्गशीर्ष शु.१४ रोहिणी",
    shubhLabel: "पौर्णिमा प्रारंभ",
    isShubh: true,
    events: [
      "दत्त जयंती पूर्वसंध्या",
      "पौर्णिमा प्रारंभ स. १०.४८",
      "रोहिणी नक्षत्र समाप्ती"
    ],
    yogs: ["भद्रा योग रा. ०८.५४ प."],
    imageIcon: "flower",
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 24,
    tithi: "मार्गशीर्ष पौर्णिमा/कृ.१ आर्द्रा",
    shubhLabel: "श्रीदत्त जयंती / अवतार दिन",
    isShubh: true,
    events: [
      "भगवान श्री दत्तात्रेय अवतार दिन / जयंती",
      "माहूर गड, गिरनार, कारंजा व सर्व महानुभाव स्थान यात्रा",
      "जन्मकाळ सोहळा सायं. ६ वा.",
      "पौर्णिमा समाप्ती स. ०६.५८"
    ],
    yogs: ["अमृतसिद्धी योग रा. ०१.४७ प."],
    imageIcon: "flower",
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 4 // Thursday
  },
  {
    dayNumber: 25,
    tithi: "मार्गशीर्ष कृ.२ पुनर्वसु",
    shubhLabel: "ख्रिसमस (नाताळ)",
    isShubh: true,
    events: [
      "ख्रिसमस (नाताळ) सार्वजनिक सुट्टी",
      "श्रीदत्त जयंती पारणे व महाप्रसाद"
    ],
    yogs: [],
    imageIcon: "flower",
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 5 // Friday
  },
  {
    dayNumber: 26,
    tithi: "मार्गशीर्ष कृ.३ पुष्य",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 3,
    weekdayIndex: 6 // Saturday
  },
  {
    dayNumber: 27,
    tithi: "मार्गशीर्ष कृ.४ आश्लेषा",
    shubhLabel: "संकष्ट चतुर्थी",
    isShubh: true,
    events: [
      "संकष्ट चतुर्थी उपवास",
      "चंद्रोदय रा. ०९.१५"
    ],
    yogs: ["भद्रा योग सायं. ०५.१४ प."],
    isSunday: true,
    weekIndex: 4,
    weekdayIndex: 0 // Sunday
  },
  {
    dayNumber: 28,
    tithi: "मार्गशीर्ष कृ.५ मघा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 1 // Monday
  },
  {
    dayNumber: 29,
    tithi: "मार्गशीर्ष कृ.६ पूर्वा",
    shubhLabel: "चांगला दिवस",
    isShubh: true,
    events: [],
    yogs: ["भद्रा योग दु. ०२.५६ प."],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 2 // Tuesday
  },
  {
    dayNumber: 30,
    tithi: "मार्गशीर्ष कृ.७ उत्तरा",
    shubhLabel: "शुभ दिवस",
    isShubh: true,
    events: [],
    yogs: [],
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 3 // Wednesday
  },
  {
    dayNumber: 31,
    tithi: "मार्गशीर्ष कृ.८ हस्त",
    shubhLabel: "वर्ष अखेर २०२६",
    isShubh: true,
    events: [
      "वर्ष अखेर २०२६",
      "नूतन वर्ष २०२७ पूर्वसंध्या",
      "कालाष्टमी"
    ],
    yogs: [],
    imageIcon: "fire",
    isSunday: false,
    weekIndex: 4,
    weekdayIndex: 4 // Thursday
  }
];

const decemberDays: MahanubhavCalendarDay[] = decemberDaysRaw.map(d => ({ ...d, month: "dec" }));

export default function KaryakramCalendar({ events = [], lang = "mr" }: KaryakramCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState<"jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec">("dec");
  const [selectedDay, setSelectedDay] = useState<MahanubhavCalendarDay | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "events">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const sliderRef = useRef<HTMLDivElement>(null);
  const calendarMonthScrollRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => {};
  const handleTouchEnd = (e: React.TouchEvent) => { touchStartX.current = null; };

  const handleSlideCalendarMonths = (dir: 'left' | 'right') => {
    if (calendarMonthScrollRef.current) {
      calendarMonthScrollRef.current.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
    }
  };

  const renderCellIcon = (iconOrDay?: any) => null;

  const eventTypes = [
    { id: 'all', label: 'सर्व' },
    { id: 'jayanti', label: 'जयंती' },
    { id: 'punyatithi', label: 'पुण्यतिथी' },
    { id: 'parva', label: 'पर्वदिन' }
  ];

  const getEventBadgeColor = (cat?: string) => 'bg-amber-100 text-amber-800';
  const getEventBadgeLabel = (cat?: string) => cat || 'कार्यक्रम';

  const weekdays = [
    { id: 0, label: "रवि", labelFull: "रविवार", color: "bg-red-600" },
    { id: 1, label: "सोम", labelFull: "सोमवार", color: "bg-blue-600" },
    { id: 2, label: "मंगळ", labelFull: "मंगळवार", color: "bg-pink-600" },
    { id: 3, label: "बुध", labelFull: "बुधवार", color: "bg-green-600" },
    { id: 4, label: "गुरु", labelFull: "गुरुवार", color: "bg-purple-600" },
    { id: 5, label: "शुक्र", labelFull: "शुक्रवार", color: "bg-blue-900" },
    { id: 6, label: "शनि", labelFull: "शनिवार", color: "bg-red-900" }
  ];

  const filteredEvents = (events || []).filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || (e as any).category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const headerDetails: Record<string, { leftMain: string; leftSub: string; title: string; rightMain: string; rightSub: string }> = {
    jan: {
      leftMain: "पौष / माघ शके १९४७",
      leftSub: "विश्वावसु नाम संवत्सर / उत्तरायण / शिशिर ऋतु",
      title: "जानेवारी २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय श्रावण / भाद्रपद"
    },
    feb: {
      leftMain: "माघ / फाल्गुन शके १९४७",
      leftSub: "विश्वावसु नाम संवत्सर / उत्तरायण / शिशिर / वसंत ऋतु",
      title: "फेब्रुवारी २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय भाद्रपद / आश्विन"
    },
    mar: {
      leftMain: "फाल्गुन / चैत्र शके १९४७-४८",
      leftSub: "विश्वावसु / नल नाम संवत्सर / उत्तरायण / वसंत ऋतु",
      title: "मार्च २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय आश्विन / कार्तिक"
    },
    apr: {
      leftMain: "चैत्र / वैशाख शके १९४८",
      leftSub: "पराभव नाम संवत्सर / उत्तरायण / वसंत / ग्रीष्म ऋतु",
      title: "एप्रिल २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय कार्तिक / मार्गशीर्ष"
    },
    may: {
      leftMain: "वैशाख / ज्येष्ठ शके १९४८",
      leftSub: "पराभव नाम संवत्सर / उत्तरायण / ग्रीष्म ऋतु",
      title: "मे २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय मार्गशीर्ष / पौष"
    },
    jun: {
      leftMain: "ज्येष्ठ / आषाढ शके १९४८",
      leftSub: "पराभव नाम संवत्सर / उत्तरायण / वर्षा ऋतु",
      title: "जून २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय पौष / माघ"
    },
    jul: {
      leftMain: "आषाढ / श्रावण शके १९४८",
      leftSub: "पराभव नाम संवत्सर / दक्षिणायण / वर्षा ऋतु",
      title: "जुलै २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय माघ / फाल्गुन"
    },
    aug: {
      leftMain: "आषाढ / श्रावण शके १९४८",
      leftSub: "पराभव नाम संवत्सर / दक्षिणायण / वर्षा / शरदऋतु",
      title: "ऑगस्ट २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय माघ / फाल्गुन"
    },
    sep: {
      leftMain: "श्रावण / भाद्रपद शके १९४८",
      leftSub: "पराभव नाम संवत्सर दक्षिणायण शरदऋतु",
      title: "सप्टेंबर २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४/५",
      rightSub: "महानुभावीय फाल्गुन / चैत्र"
    },
    oct: {
      leftMain: "भाद्रपद / अश्विन शके १९४८",
      leftSub: "पराभव नाम संवत्सर दक्षिणायण, शरद/हेमंत ऋतु",
      title: "ऑक्टोबर २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०५",
      rightSub: "महानुभावीय चैत्र / वैशाख"
    },
    nov: {
      leftMain: "अश्विन / कार्तिक शके १९४८",
      leftSub: "पराभव नाम संवत्सर दक्षिणायण हेमंत ऋतु",
      title: "नोव्हेंबर २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०५",
      rightSub: "महानुभावीय वैशाख / ज्येष्ठ"
    },
    dec: {
      leftMain: "कार्तिक / मार्गशीर्ष शके १९४८",
      leftSub: "पराभव नाम संवत्सर दक्षिणायण उत्तरायण हेमंत शिशिर ऋतु",
      title: "डिसेंबर २०२६",
      rightMain: "सर्वज्ञ श्रीचक्रधर शके ८०४",
      rightSub: "महानुभावीय ज्येष्ठ / आषाढ"
    }
  };

  return (
    <div id="calendar-root" className="bg-white rounded-3xl shadow-xl border-2 border-saffron-100 overflow-hidden min-h-[500px] flex flex-col">
      
      {/* Dynamic Selector Toggle Switch */}
      <div className="bg-gradient-to-r from-saffron-500 to-amber-500 p-0.5 sm:p-1 flex items-center justify-center gap-1 shadow-xs">
        <button
          onClick={() => setViewMode('grid')}
          className={`flex-1 max-w-[220px] py-0.5 sm:py-1 px-2 rounded-lg text-[10px] sm:text-xs font-bold font-devanagari flex items-center justify-center gap-1 transition-all ${
            viewMode === 'grid'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{calendarLocalTranslations.toggleGrid[lang]}</span>
        </button>
        <button
          onClick={() => setViewMode('events')}
          className={`flex-1 max-w-[220px] py-0.5 sm:py-1 px-2 rounded-lg text-[10px] sm:text-xs font-bold font-devanagari flex items-center justify-center gap-1 transition-all ${
            viewMode === 'events'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{calendarLocalTranslations.toggleList[lang]}</span>
        </button>
      </div>

      {/* Main Container Switch */}
      {viewMode === 'grid' ? (
        <div className="flex-1 flex flex-col bg-amber-50/10 p-2 md:p-6">
          
          {/* Quick Month Selector Bar with Slide Arrow Buttons */}
          <div className="bg-white/90 p-1.5 rounded-xl border border-amber-200 shadow-sm relative flex items-center gap-1.5 mb-2 w-full">
            <button
              type="button"
              onClick={() => handleSlideCalendarMonths('left')}
              title="मागील महिने"
              className="p-1.5 rounded-lg bg-saffron-100 hover:bg-saffron-200 text-saffron-900 transition-all shrink-0 cursor-pointer shadow-xs border border-saffron-300/60 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div
              ref={calendarMonthScrollRef}
              className="flex items-center gap-1 overflow-x-auto py-0.5 px-0.5 no-scrollbar scroll-smooth w-full touch-pan-x"
            >
              {[
                { id: 'jan', label: 'जानेवारी' },
                { id: 'feb', label: 'फेब्रुवारी' },
                { id: 'mar', label: 'मार्च' },
                { id: 'apr', label: 'एप्रिल' },
                { id: 'may', label: 'मे' },
                { id: 'jun', label: 'जून' },
                { id: 'jul', label: 'जुलै' },
                { id: 'aug', label: 'ऑगस्ट' },
                { id: 'sep', label: 'सप्टेंबर' },
                { id: 'oct', label: 'ऑक्टोबर' },
                { id: 'nov', label: 'नोव्हेंबर' },
                { id: 'dec', label: 'डिसेंबर' },
              ].map((m) => {
                const isActive = selectedMonth === m.id;
                return (
                  <button
                    key={m.id}
                    data-active={isActive}
                    onClick={(e) => {
                      setSelectedMonth(m.id as any);
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black font-devanagari whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-saffron-600 text-white shadow-md ring-2 ring-saffron-300 scale-105'
                        : 'bg-amber-50/80 border border-amber-200 text-gray-800 hover:bg-saffron-100 hover:text-saffron-900'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSlideCalendarMonths('right')}
              title="पुढील महिने"
              className="p-1.5 rounded-lg bg-saffron-100 hover:bg-saffron-200 text-saffron-900 transition-all shrink-0 cursor-pointer shadow-xs border border-saffron-300/60 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Calendar Traditional Banner Header - Compact Sleek Single-Line Layout */}
          <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-sky-700 rounded-lg md:rounded-xl px-2 md:px-2.5 py-0.5 shadow-xs text-white mb-1.5 border border-sky-400/80 flex items-center justify-between gap-1 md:gap-2 min-h-[32px] md:min-h-[38px] overflow-hidden">
            
            {/* Left Section: Calendar Icon + Marathi Month Information */}
            <div className="flex items-center gap-1 md:gap-1.5 min-w-0 flex-1">
              <div className="bg-white/15 p-0.5 md:p-1 rounded-md shrink-0 flex items-center justify-center">
                <CalendarIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300" />
              </div>
              <div className="flex flex-col min-w-0 text-left leading-tight">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-black font-devanagari text-yellow-100 tracking-wide truncate">
                  {headerDetails[selectedMonth].leftMain}
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-semibold font-devanagari text-sky-100/85 truncate">
                  {headerDetails[selectedMonth].leftSub}
                </span>
              </div>
            </div>

            {/* Center Section: Previous Month Button | "ऑगस्ट २०२६" | Next Month Button */}
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 shrink-0 px-1 md:px-2 border-x border-white/20">
              <button 
                onClick={() => {
                  if (selectedMonth === 'feb') setSelectedMonth('jan');
                  else if (selectedMonth === 'mar') setSelectedMonth('feb');
                  else if (selectedMonth === 'apr') setSelectedMonth('mar');
                  else if (selectedMonth === 'may') setSelectedMonth('apr');
                  else if (selectedMonth === 'jun') setSelectedMonth('may');
                  else if (selectedMonth === 'jul') setSelectedMonth('jun');
                  else if (selectedMonth === 'aug') setSelectedMonth('jul');
                  else if (selectedMonth === 'sep') setSelectedMonth('aug');
                  else if (selectedMonth === 'oct') setSelectedMonth('sep');
                  else if (selectedMonth === 'nov') setSelectedMonth('oct');
                  else if (selectedMonth === 'dec') setSelectedMonth('nov');
                }}
                className={`p-0.5 rounded-full transition-all ${selectedMonth === 'jan' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 text-yellow-300'}`}
                disabled={selectedMonth === 'jan'}
                title="मागील महिना"
              >
                <ChevronRight className="w-4 h-4 md:w-4.5 md:h-4.5 rotate-180" />
              </button>

              <span className="text-xs sm:text-sm md:text-base font-extrabold font-devanagari tracking-wide text-yellow-300 drop-shadow-xs select-none min-w-[70px] sm:min-w-[100px] md:min-w-[120px] text-center whitespace-nowrap">
                {headerDetails[selectedMonth].title}
              </span>

              <button 
                onClick={() => {
                  if (selectedMonth === 'jan') setSelectedMonth('feb');
                  else if (selectedMonth === 'feb') setSelectedMonth('mar');
                  else if (selectedMonth === 'mar') setSelectedMonth('apr');
                  else if (selectedMonth === 'apr') setSelectedMonth('may');
                  else if (selectedMonth === 'may') setSelectedMonth('jun');
                  else if (selectedMonth === 'jun') setSelectedMonth('jul');
                  else if (selectedMonth === 'jul') setSelectedMonth('aug');
                  else if (selectedMonth === 'aug') setSelectedMonth('sep');
                  else if (selectedMonth === 'sep') setSelectedMonth('oct');
                  else if (selectedMonth === 'oct') setSelectedMonth('nov');
                  else if (selectedMonth === 'nov') setSelectedMonth('dec');
                }}
                className={`p-0.5 rounded-full transition-all ${selectedMonth === 'dec' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 text-yellow-300'}`}
                disabled={selectedMonth === 'dec'}
                title="पुढील महिना"
              >
                <ChevronRight className="w-4 h-4 md:w-4.5 md:h-4.5" />
              </button>
            </div>

            {/* Right Section: Panchang & Sect Specifics */}
            <div className="flex flex-col min-w-0 text-right flex-1 justify-center leading-tight">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-black font-devanagari text-yellow-100 tracking-wide truncate">
                {headerDetails[selectedMonth].rightMain}
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-semibold font-devanagari text-sky-100/85 truncate">
                {headerDetails[selectedMonth].rightSub}
              </span>
            </div>

          </div>

          {/* Majestic Horizontal Grid Wrapper (Desktop and Responsive Mobile) */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full overflow-x-auto overflow-y-auto rounded-2xl border border-saffron-200/80 bg-white shadow-md p-1 sm:p-2 touch-pan-x touch-pan-y"
          >
            <div>
              <div className="w-full min-w-[680px] sm:min-w-0 grid grid-cols-[28px_repeat(5,1fr)] sm:grid-cols-[60px_repeat(5,1fr)] md:grid-cols-[100px_repeat(5,1fr)] grid-rows-7 select-none divide-x divide-y divide-amber-100">
              
              {/* Row 1 to 7 Headers (Sunday to Saturday) on the left margin */}
              {weekdays.map((wd) => (
                <div
                  key={wd.id}
                  style={{ gridRowStart: wd.id + 1, gridColumnStart: 1 }}
                  className={`flex flex-col items-center justify-center p-[1px] sm:p-2 md:p-3 text-center text-white ${wd.color} font-devanagari font-black border-r border-amber-100`}
                >
                  <span className="text-[9px] sm:text-base md:text-lg tracking-tighter sm:tracking-wider leading-none">{wd.label}</span>
                  <span className="hidden sm:inline text-[9px] sm:text-[10px] opacity-80 font-medium font-sans mt-0.5">{wd.labelFull}</span>
                </div>
              ))}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 EMPTY CELL BLOCKS INTEGRATED BEAUTIFULLY (ONLY FOR JANUARY) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'jan' && (
                <>
                  {/* Block 1: Editor Photo & Wishes (Sunday & Monday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 1, gridRowEnd: 3 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border-r border-b border-amber-100 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden"
                  >
                    <span className="text-[10px] font-black font-devanagari text-orange-700 uppercase tracking-wider mb-2 leading-tight">
                      नूतन वर्षाच्या हार्दिक शुभेच्छा...!
                    </span>
                    
                    <div className="relative mb-2">
                      <AppLogo size="lg" showStatus={false} />
                      <div className="absolute -bottom-1 -right-1 bg-saffron-600 text-white rounded-full p-1 border border-white text-[9px] font-bold">
                        २०२६
                      </div>
                    </div>

                    <span className="text-[9px] font-black text-blue-900 leading-tight">
                      संपादकाचा फोटो पाहून दिनदर्शिका खरेदी करा.
                    </span>
                  </div>

                  {/* Block 2: Publication Banner (Tuesday & Wednesday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 3, gridRowEnd: 5 }}
                    className="bg-gradient-to-br from-[#dc2626] to-[#b91c1c] border-r border-b border-amber-100 text-white p-3 flex flex-col justify-center text-center relative overflow-hidden"
                  >
                    <div className="bg-yellow-400 text-red-950 font-bold text-xs py-0.5 px-2 rounded-md shadow-xs mx-auto mb-2 font-devanagari">
                      श्रीचक्रधर
                    </div>
                    <h5 className="text-[10px] font-black font-devanagari text-yellow-300 leading-snug">
                      दिनदर्शिका प्रकाशन सोहळा दि. १५/१०/२०२४
                    </h5>
                    <p className="text-[8px] opacity-90 mt-1 leading-normal font-devanagari">
                      सातारा येथे प.पू.म.म.श्री.तैलंग सिंह सातारकर व प.पू.म.म.श्री.विद्याधरश्री हुंतराज खामनेरकर यांच्या शुभ करकमलाने प्रकाशित.
                    </p>
                  </div>
                </>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 EMPTY CELL BLOCKS INTEGRATED BEAUTIFULLY (ONLY FOR APRIL) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'apr' && (
                <>
                  {/* Block 1: Premmuni Virat Ad Banner (Sunday, Monday, Tuesday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 1, gridRowEnd: 4 }}
                    className="bg-gradient-to-br from-amber-50/50 to-saffron-50/50 border-r border-b border-amber-100/70 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden"
                  >
                    <span className="text-[10px] font-extrabold font-devanagari text-red-600 uppercase tracking-wider leading-tight">
                      श्रीकृष्ण दत्त मंदिर संस्था, दानबर्डी, दुई, ता. मुक्ताईनगर, जि. जळगाव
                    </span>
                    
                    <div className="relative my-2 shrink-0">
                      <img
                        src="/src/assets/images/prem_muni_portrait_1782896913288.jpg"
                        alt="ई. श्री. प्रेममुनी विराट"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-full object-cover border-2 border-saffron-400 shadow-md mx-auto"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="text-[11px] font-black text-blue-950 font-devanagari leading-none">
                        ई. श्री. प्रेममुनी विराट
                      </span>
                      <span className="text-[9px] font-bold text-gray-500 font-sans">
                        मो. ७०३०९७७२०२
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 EMPTY CELL BLOCKS INTEGRATED BEAUTIFULLY (ONLY FOR MAY) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'may' && (
                <>
                  {/* Block 1: Mahant Shivvyas Baba (Monday, Tuesday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 2, gridRowEnd: 4 }}
                    className="bg-gradient-to-br from-amber-50/50 to-saffron-50/50 border-r border-b border-amber-100/70 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden"
                  >
                    <span className="text-[9px] font-extrabold font-devanagari text-red-600 uppercase tracking-wider leading-tight">
                      श्रीकृष्ण गीतामंदिर बाईका बगीचा, चौथी गल्ली जबलपूर (मध्यप्रदेश)
                    </span>
                    
                    <div className="relative my-1 shrink-0">
                      <img
                        src="/src/assets/images/shivvyas_baba_portrait_1782897304204.jpg"
                        alt="महंत श्री. शिवव्यास बाबा"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-saffron-400 shadow-md mx-auto"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-blue-950 font-devanagari leading-none">
                        महंत श्री. शिवव्यास बाबा
                      </span>
                      <span className="text-[8px] font-bold text-gray-500 font-sans leading-none">
                        मो. ६२६१७५३१३४, ७९०९३५७६४४
                      </span>
                    </div>
                  </div>

                  {/* Block 2: P.P.M.Shri Kanheraj Baba (Wednesday, Thursday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 4, gridRowEnd: 6 }}
                    className="bg-gradient-to-br from-amber-50/50 to-saffron-50/50 border-r border-b border-amber-100/70 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden"
                  >
                    <span className="text-[9px] font-extrabold font-devanagari text-red-600 uppercase tracking-wider leading-tight">
                      गोपिराज संस्थान पूनदा, ता.जि. अमरावती
                    </span>
                    
                    <div className="relative my-1 shrink-0">
                      <img
                        src="/src/assets/images/kanheraj_baba_portrait_1782897320571.jpg"
                        alt="प.पू.म.श्री. कान्हेराज बाबा"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-saffron-400 shadow-md mx-auto"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-blue-950 font-devanagari leading-none">
                        प.पू.म.श्री. कान्हेराज बाबा
                      </span>
                      <span className="text-[8px] font-bold text-gray-500 font-sans leading-none">
                        मो. ८६६९४५६२५७
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 EMPTY CELL BLOCKS INTEGRATED BEAUTIFULLY (ONLY FOR JUNE) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'jun' && (
                <>
                  {/* Block 1: LIC Ad Block (Sunday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 1, gridRowEnd: 2 }}
                    className="bg-gradient-to-br from-blue-50 to-amber-50 border-r border-b border-blue-200/60 p-3 flex flex-col items-center justify-between text-center relative overflow-hidden group shadow-inner"
                  >
                    <div className="w-full bg-[#1e3a8a] py-1 px-2 rounded text-white text-[8px] font-black font-devanagari tracking-wide uppercase">
                      भारतीय जीवन बीमा निगम (LIC)
                    </div>
                    
                    <div className="relative my-1 shrink-0">
                      <img
                        src="/src/assets/images/dhanraj_lic_portrait_1782897642360.jpg"
                        alt="श्री. धनराज मा. कालोकार"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md mx-auto"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-blue-950 font-devanagari leading-none">
                        श्री. धनराज मा. कालोकार
                      </span>
                      <span className="text-[8px] font-extrabold text-amber-700 uppercase tracking-widest leading-none">
                        Insurance Advisor
                      </span>
                      <span className="text-[8px] font-bold text-gray-600 font-sans leading-none mt-0.5">
                        Mob. 9420551776
                      </span>
                      <span className="text-[7px] text-gray-500 font-devanagari leading-tight mt-1 truncate max-w-[130px]" title="विद्या विहार कॉलनी, रेल्वे गेट मागे, पिंपरी, वर्धा">
                        पिंपरी, वर्धा
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 5 EMPTY CELL BLOCKS (ONLY FOR FEBRUARY TO LEAVE OTHER COLUMNS EMPTY) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'feb' && Array.from({ length: 7 }).map((_, idx) => (
                <div
                  key={`empty-col5-feb-${idx}`}
                  style={{ gridColumnStart: 6, gridRowStart: idx + 1 }}
                  className="p-1 sm:p-2 min-h-[55px] sm:min-h-[70px] md:min-h-[85px] bg-slate-50/5 hover:bg-slate-50/10 border-r border-b border-amber-100/50 flex flex-col justify-between group relative"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[10px] text-gray-300 font-devanagari opacity-40 select-none font-black">फेब्रुवारी २०२६</span>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-[8px] text-gray-200 font-sans">-</span>
                  </div>
                </div>
              ))}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 5 EMPTY CELL BLOCKS (ONLY FOR MARCH TO LEAVE REMAINING DAYS OF WEEK 5 EMPTY) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'mar' && Array.from({ length: 4 }).map((_, idx) => {
                const rowIdx = idx + 4; // Rows 4, 5, 6, 7 (Wednesday to Saturday)
                return (
                  <div
                    key={`empty-col5-mar-${rowIdx}`}
                    style={{ gridColumnStart: 6, gridRowStart: rowIdx }}
                    className="p-1 sm:p-2 min-h-[55px] sm:min-h-[70px] md:min-h-[85px] bg-slate-50/5 hover:bg-slate-50/10 border-r border-b border-amber-100/50 flex flex-col justify-between group relative"
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[10px] text-gray-300 font-devanagari opacity-40 select-none font-black">मार्च २०२६</span>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-[8px] text-gray-200 font-sans">-</span>
                    </div>
                  </div>
                );
              })}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 5 EMPTY CELL BLOCKS (ONLY FOR APRIL TO LEAVE REMAINING DAYS OF WEEK 5 EMPTY WITH AD BANNER) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'apr' && (
                <div
                  style={{ gridColumnStart: 6, gridRowStart: 6, gridRowEnd: 8 }}
                  className="bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] border-r border-b border-rose-200/60 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/akanksha_baba_portrait_1782896927059.jpg"
                      alt="प.म.श्री. आकांक्षाबाबा"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-rose-400 shadow-md shrink-0"
                    />
                    <div className="text-left flex flex-col justify-center">
                      <h4 className="text-[11px] font-black font-devanagari text-rose-900 leading-tight">
                        प.म.श्री. आकांक्षाबाबा
                      </h4>
                      <p className="text-[8px] font-bold font-devanagari text-gray-700 mt-0.5 leading-tight">
                        श्रीदत्त मंदिर, वन्हाडसीम
                      </p>
                      <p className="text-[8px] font-semibold font-devanagari text-gray-500 leading-normal">
                        ता. भुसावळ, जि. जळगाव
                      </p>
                      <p className="text-[8px] font-bold text-gray-500 font-sans mt-0.5">
                        मो. ९४०५४०२९८३, ९४२१६१३९५२
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 5 EMPTY CELL BLOCKS (ONLY FOR JUNE TO LEAVE REMAINING DAYS OF WEEK 5 EMPTY WITH THE SAINT BANNER) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'jun' && (
                <div
                  style={{ gridColumnStart: 6, gridRowStart: 4, gridRowEnd: 8 }}
                  className="bg-gradient-to-br from-amber-50 to-saffron-50/50 border-r border-b border-amber-200/60 p-4 flex flex-col justify-around text-center relative overflow-hidden group"
                >
                  {/* Top Block: P.P.M. Shri Nagansh Baba */}
                  <div className="flex flex-col items-center gap-1.5 border-b border-dashed border-amber-300/60 pb-3">
                    <div className="relative shrink-0">
                      <img
                        src="/src/assets/images/nagansh_baba_portrait_1782897660617.jpg"
                        alt="प.प.श्री. नागांशबाबा"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-saffron-400 shadow-md mx-auto"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-[11px] font-black font-devanagari text-red-600 leading-none">
                        प.प.श्री. नागांशबाबा
                      </h4>
                      <p className="text-[9px] font-bold font-devanagari text-blue-950 mt-1 leading-none">
                        श्रीदत्त मंदिर, सावखेडा
                      </p>
                      <p className="text-[8px] font-medium font-devanagari text-gray-500 leading-relaxed">
                        ता. रावेर, जि. जळगाव
                      </p>
                      <p className="text-[8px] font-bold text-gray-500 font-sans mt-0.5 leading-none">
                        मो. ८६०५५८१२४९
                      </p>
                    </div>
                  </div>

                  {/* Bottom Block: P.M. Shri Govindraj Dada Talegaonkar */}
                  <div className="flex flex-col items-center gap-1.5 pt-2">
                    <div className="relative shrink-0">
                      <img
                        src="/src/assets/images/govindraj_baba_portrait_1782897672453.jpg"
                        alt="प.म.श्री. गोविंदराज दादा तळेगावकर"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-saffron-400 shadow-md mx-auto"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-[11px] font-black font-devanagari text-red-600 leading-none">
                        प.म.श्री. गोविंदराज दादा तळेगावकर
                      </h4>
                      <p className="text-[9px] font-bold font-devanagari text-blue-950 mt-1 leading-none">
                        गोविंद निकेतन, भालोद
                      </p>
                      <p className="text-[8px] font-medium font-devanagari text-gray-500 leading-relaxed">
                        ता. यावल, जि. जळगाव
                      </p>
                      <p className="text-[8px] font-bold text-gray-500 font-sans mt-0.5 leading-none">
                        मो. ९३७३१३६९६९
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 EMPTY CELL BLOCKS INTEGRATED BEAUTIFULLY (ONLY FOR JULY) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'jul' && (
                <>
                  {/* Block 1: Dual Saint Banner (Sunday, Monday, Tuesday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 1, gridRowEnd: 4 }}
                    className="bg-gradient-to-br from-amber-50 to-emerald-50 border-r border-b border-amber-200/60 p-3 flex flex-col justify-around text-center relative overflow-hidden group shadow-inner"
                  >
                    {/* Top Saint: P.M. Shri Divakar Baba */}
                    <div className="flex flex-col items-center gap-1.5 border-b border-dashed border-amber-300/60 pb-2">
                      <div className="relative shrink-0">
                        <img
                          src="/src/assets/images/divakar_baba_portrait_1782897964909.jpg"
                          alt="प.म.श्री. दिवाकर बाबा"
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md mx-auto"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-[11px] font-black font-devanagari text-red-600 leading-none">
                          प.म.श्री. दिवाकर बाबा
                        </h4>
                        <p className="text-[9px] font-bold font-devanagari text-blue-950 mt-1 leading-none">
                          श्रीकृष्ण मंदिर मोठे वाघोदा
                        </p>
                        <p className="text-[8px] font-medium font-devanagari text-gray-500 leading-relaxed">
                          ता. रावेर, जि. जळगाव.
                        </p>
                        <p className="text-[8px] font-bold text-gray-500 font-sans mt-0.5 leading-none">
                          मो. ९४०५२७५३७८
                        </p>
                      </div>
                    </div>

                    {/* Bottom Saint: P.M. Shri Waghodekar Baba */}
                    <div className="flex flex-col items-center gap-1.5 pt-2">
                      <div className="relative shrink-0">
                        <img
                          src="/src/assets/images/waghodekar_baba_portrait_1782897981723.jpg"
                          alt="प.म.श्री. वाघोदेकर बाबा"
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md mx-auto"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-[11px] font-black font-devanagari text-red-600 leading-none">
                          प.म.श्री. वाघोदेकर बाबा
                        </h4>
                        <p className="text-[9px] font-bold font-devanagari text-blue-950 mt-1 leading-none">
                          मोठे मठ, मोठे वाघोदा
                        </p>
                        <p className="text-[8px] font-medium font-devanagari text-gray-500 leading-relaxed">
                          ता. रावेर, जि. जळगाव
                        </p>
                        <p className="text-[8px] font-bold text-gray-500 font-sans mt-0.5 leading-none">
                          मो. ७०३८३१०८८८
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 5 EMPTY CELL BLOCKS (ONLY FOR JULY TO LEAVE REMAINING SATURDAY EMPTY WITH THE LIC AD BANNER) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'jul' && (
                <div
                  style={{ gridColumnStart: 6, gridRowStart: 7, gridRowEnd: 8 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-r border-b border-blue-200/60 p-3 flex flex-col items-center justify-between text-center relative overflow-hidden group shadow-inner"
                >
                  <div className="w-full bg-red-600 py-1 px-2 rounded text-white text-[9px] font-black font-devanagari tracking-wider uppercase leading-none">
                    सर्वज्ञ विमा सेवा केंद्र
                  </div>

                  <div className="flex items-center gap-2 w-full justify-center my-1.5">
                    <div className="relative shrink-0">
                      <img
                        src="/src/assets/images/tayade_lic_portrait_1782897997501.jpg"
                        alt="श्री. बी. ए. तायडे"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md mx-auto"
                      />
                    </div>
                    
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-black text-blue-950 font-devanagari leading-none">
                        श्री. बी. ए. तायडे
                      </span>
                      <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest leading-none mt-0.5">
                        C.L.I.A. (LIC)
                      </span>
                      <span className="text-[8px] font-bold text-gray-500 font-sans leading-none mt-0.5">
                        मो. ९४२१६०५१२२
                      </span>
                    </div>
                  </div>

                  <div className="text-[8px] text-gray-500 font-devanagari leading-none truncate max-w-[150px]">
                    रामपूर, ता.जि. औरंगाबाद
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 EMPTY CELL BLOCKS (ONLY FOR AUGUST) - REMOVED PER USER REQUEST */}
              {/* ----------------------------------------------------------------------------------- */}

              {/* ----------------------------------------------------------------------------------- */}
              {/* WEEK 1 AND WEEK 5 EMPTY CELL BLOCKS INTEGRATED BEAUTIFULLY (ONLY FOR SEPTEMBER) */}
              {/* ----------------------------------------------------------------------------------- */}
              {selectedMonth === 'sep' && (
                <>
                  {/* Block 1: Gopalkala list (Sunday, Monday of Week 1) */}
                  <div 
                    style={{ gridColumnStart: 2, gridRowStart: 1, gridRowEnd: 3 }}
                    className="bg-gradient-to-br from-pink-50 to-rose-50 border-r border-b border-rose-200/60 p-2.5 flex flex-col justify-between text-center relative overflow-hidden group shadow-inner"
                  >
                    <div className="flex flex-col items-center gap-1 h-full">
                      <div className="bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full text-[10px] font-black font-devanagari tracking-wide">
                        * दि. ७ गोपाळकाला *
                      </div>
                      
                      <div className="text-left w-full overflow-y-auto max-h-[290px] pr-1 mt-1.5 space-y-1 scrollbar-thin scrollbar-thumb-pink-200">
                        <div className="text-[7.5px] font-bold font-devanagari text-pink-950 leading-relaxed space-y-0.5">
                          <p className="border-b border-pink-100 pb-0.5">• श्रीमंत मंदिर, सावखेडा, ता. रावेर जि. जळगाव</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीमंत मंदिर - तोंडवाळी, ता. रावेर जि. जळगाव</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीमंत मंदिर - लासूर हिरवेखेडा बु॥ ता. जामनेर</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण ज्ञानविज्ञान आश्रम पांडोली बु॥ ता. आंबेगाव (पुणे)</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीमंत मंदिर, वराडी, ता. अंजनगाव, जि. अमरावती</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण मंदिर, विठ्ठलवाडी, ता. शिरुर जि. पुणे</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण मंदिर, भोसे ता. खेड/राजगुरुनगर जि. पुणे</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण मंदिर, वडगांव लांडगा ता. संगमनेर</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीमंत मंदिर यात्रा पुजा धुमाळवाडी ता. अकोले</p>
                          <p className="border-b border-pink-100 pb-0.5">• तरुण मित्र मंडळ, गंगापूर, ता. संगमनेर</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण मंदिर तरूण मंडळ, आरवी खुर्द ता. संगमनेर</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण सेवाश्रम रथयात्रा चिंचोली शिराळ ता. पाथर्डी</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीचक्रधर मंदिर वेली, जि. बुलढाणा</p>
                          <p className="border-b border-pink-100 pb-0.5">• श्रीकृष्ण मंदिर सावखेडा ता. सोयगांव जि. औरंगाबाद</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Block 2: Bhalodker Baba Ad (Thursday, Friday of Week 5) */}
                  <div 
                    style={{ gridColumnStart: 6, gridRowStart: 5, gridRowEnd: 7 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 border-r border-b border-pink-200/60 p-2 flex flex-col justify-around text-center relative overflow-hidden group shadow-inner"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative shrink-0">
                        <img
                          src="/src/assets/images/bhalodker_baba_portrait_1782898963696.jpg"
                          alt="प.म.श्री. भालोदकर बाबा भालोद"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-md mx-auto"
                        />
                      </div>
                      <div className="text-center mt-1">
                        <h4 className="text-[9.5px] font-black font-devanagari text-purple-950 leading-tight">
                          प.म.श्री. भालोदकर बाबा भालोद
                        </h4>
                        <p className="text-[8px] font-bold font-devanagari text-pink-700 leading-tight mt-0.5">
                          श्री. दत्त मंदिर, भालोद
                        </p>
                        <p className="text-[7.5px] font-semibold font-devanagari text-gray-500 leading-none">
                          ता. यावल, जि. जळगाव
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Block 3: Yelhe Raj Baba Ad (Saturday of Week 5) */}
                  <div 
                    style={{ gridColumnStart: 6, gridRowStart: 7, gridRowEnd: 8 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border-r border-b border-orange-200/60 p-2 flex flex-col justify-around text-center relative overflow-hidden group shadow-inner"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <img
                        src="/src/assets/images/yelhe_raj_baba_portrait_1782898979948.jpg"
                        alt="महंत श्री. येल्हेराजबाबा बिडकर"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-orange-400 shadow-sm"
                      />
                      <div className="text-left">
                        <h4 className="text-[7.5px] font-black font-devanagari text-amber-900 leading-tight">
                          जय श्रीकृष्ण मंदिर
                        </h4>
                        <p className="text-[6.5px] font-bold text-gray-500 font-devanagari leading-none mt-0.5">
                          अशोकनगर, नई दिल्ली - १८
                        </p>
                        <p className="text-[7.5px] font-black font-devanagari text-blue-950 leading-none mt-1">
                          म. श्री. येल्हेराजबाबा बिडकर
                        </p>
                        <p className="text-[7.5px] font-bold text-gray-500 font-sans leading-none mt-0.5">
                          मो. 09810314760
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* ----------------------------------------------------------------------------------- */}
              {/* EMPTY CELL BLOCKS FOR OCTOBER REMOVED PER USER REQUEST */}
              {/* ----------------------------------------------------------------------------------- */}


              {/* ----------------------------------------------------------------------------------- */}
              {/* EMPTY CELL / AD BLOCKS FOR NOVEMBER REMOVED PER USER REQUEST */}
              {/* ----------------------------------------------------------------------------------- */}


              {/* ----------------------------------------------------------------------------------- */}
              {/* EMPTY CELL / AD BLOCKS FOR DECEMBER REMOVED PER USER REQUEST */}
              {/* ----------------------------------------------------------------------------------- */}

              {/* ----------------------------------------------------------------------------------- */}
              {/* DYNAMIC RENDERING OF SELECTED MONTH DAYS */}
              {/* ----------------------------------------------------------------------------------- */}
              {(selectedMonth === 'jan' ? januaryDaysWithMonth : selectedMonth === 'feb' ? februaryDays : selectedMonth === 'mar' ? marchDays : selectedMonth === 'apr' ? aprilDays : selectedMonth === 'may' ? mayDays : selectedMonth === 'jun' ? juneDays : selectedMonth === 'jul' ? julyDays : selectedMonth === 'aug' ? augustDays : selectedMonth === 'sep' ? septemberDays : selectedMonth === 'oct' ? octoberDays : selectedMonth === 'nov' ? novemberDays : decemberDays).map((day) => {
                // Determine styling based on Sunday or typical day
                const isSunday = day.isSunday;
                const todayObj = new Date();
                const currentMonthKey = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][todayObj.getMonth()];
                const isToday = day.dayNumber === todayObj.getDate() && selectedMonth === currentMonthKey;
                
                return (
                  <div
                    key={`${selectedMonth}-${day.dayNumber}`}
                    style={{ 
                      gridColumnStart: day.weekIndex + 2, 
                      gridRowStart: day.weekdayIndex + 1 
                    }}
                    onClick={() => setSelectedDay(day)}
                    className={`p-[1px] sm:p-1.5 md:p-2 min-h-[44px] sm:min-h-[70px] md:min-h-[85px] cursor-pointer transition-all flex flex-col justify-between group relative border-r border-b border-amber-100 ${
                      isToday 
                        ? 'bg-amber-100 border-2 border-saffron-500 shadow-lg ring-2 ring-saffron-400/30 z-10' 
                        : isSunday 
                          ? 'bg-rose-50/20 hover:bg-saffron-50/60' 
                          : 'bg-white hover:bg-saffron-50/60'
                    }`}
                  >
                    {/* Pulsing background effect for today to blink on and off */}
                    {isToday && (
                      <div className="absolute inset-0 bg-saffron-200/50 animate-pulse pointer-events-none rounded-sm" />
                    )}

                    {/* Cell Top Header */}
                    <div className="flex items-center justify-between gap-0.5 border-b border-amber-100/60 pb-0.5 z-10">
                      {/* Date number in top-left corner */}
                      <div className="flex items-center gap-0.5">
                        <div className="inline-block transition-transform duration-200 group-hover:scale-110">
                          {isSunday ? (
                            <span className={`text-[10px] sm:text-base md:text-lg font-black font-sans ${isToday ? 'text-saffron-900' : 'text-[#dc2626]'}`}>
                              {day.dayNumber}
                            </span>
                          ) : (
                            <span className={`text-[10px] sm:text-base md:text-lg font-black font-sans ${isToday ? 'text-saffron-900' : 'text-blue-700'}`}>
                              {day.dayNumber}
                            </span>
                          )}
                        </div>
                        {isToday && (
                          <span className="text-[6.5px] sm:text-[9px] bg-red-600 text-white font-extrabold px-0.5 py-0.2 rounded shadow-xs font-devanagari shrink-0">
                            {lang === 'mr' ? 'आज' : lang === 'hi' ? 'आज' : 'Today'}
                          </span>
                        )}
                      </div>

                      {/* Right top corner: Shubh label & icon */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {day.imageIcon && renderCellIcon(day.imageIcon)}
                        {day.shubhLabel && (
                          <span className={`text-[5.5px] sm:text-[7.5px] md:text-[8.5px] font-black px-0.5 py-0.2 rounded leading-none ${
                            day.shubhLabel === 'शुभ दिवस' || day.shubhLabel === 'चांगला दिवस' || day.shubhLabel === 'आनंदी दिवस'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-800 border border-amber-100'
                          }`}>
                            {day.shubhLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cell Center & Content: Concise tithi & key event indicator */}
                    <div className="flex-1 flex flex-col justify-start mt-0.5 z-10 relative overflow-hidden">
                      {/* Tithi Details in a prominent bold Marathi font */}
                      <div className="text-[7px] sm:text-[9.5px] md:text-[11px] font-extrabold text-slate-800 font-devanagari leading-tight bg-amber-50/50 px-0.5 py-0.5 rounded border border-amber-100/50 truncate">
                        {day.tithi}
                      </div>

                      {/* Complete Event Details list */}
                      {day.events && day.events.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {day.events.slice(0, 1).map((ev, i) => (
                            <div 
                              key={i} 
                              className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-extrabold text-blue-900 leading-none font-devanagari bg-blue-50/60 p-0.5 rounded-xs border-l-2 border-blue-500 truncate"
                              title={ev}
                            >
                              {ev}
                            </div>
                          ))}
                          {day.events.length > 1 && (
                            <span className="text-[7px] sm:text-[8px] text-blue-700 font-bold block leading-none">+ {day.events.length - 1} अधिक</span>
                          )}
                        </div>
                      )}

                      {/* Yogs Details list */}
                      {day.yogs && day.yogs.length > 0 && (!day.events || day.events.length === 0) && (
                        <div className="mt-0.5 space-y-0.5">
                          {day.yogs.slice(0, 1).map((yg, i) => (
                            <div 
                              key={i} 
                              className="text-[7px] sm:text-[8px] md:text-[9px] font-semibold text-amber-800 leading-none font-devanagari bg-amber-50/40 p-0.5 rounded-xs border-l-2 border-amber-500 truncate"
                              title={yg}
                            >
                              {yg}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tiny info text indicator */}
                    <div className="text-right mt-0.5">
                      <span className="text-[7px] text-gray-300 font-sans group-hover:text-saffron-400 transition-colors">अधिक माहिती...</span>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>

          {/* Calendar Traditional Footer Slogan */}
          <div className="mt-6 bg-gradient-to-r from-saffron-500/10 to-amber-500/10 rounded-2xl p-4 border border-saffron-100 text-center">
            <p className="text-xs font-bold text-saffron-800 font-devanagari leading-relaxed">
              ॥ सर्वज्ञ श्रीचक्रधर स्वामी की जय ॥
            </p>
            <p className="text-[10px] text-gray-500 font-sans mt-1">
              *ही दिनदर्शिका महानुभाव पंथाच्या प्राचीन परंपरा आणि तिथी गणनेनुसार तयार करण्यात आली आहे.
            </p>
          </div>

        </div>
      ) : (
        /* Events List View (Existing implementation preserved) */
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1">
          {/* Events list */}
          <div className="lg:col-span-2 p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {lang === 'mr' ? `आगामी कार्यक्रम सूची (${filteredEvents.length})` : lang === 'hi' ? `आगामी कार्यक्रम सूची (${filteredEvents.length})` : `Upcoming Events List (${filteredEvents.length})`}
              </h3>
              
              {/* Inner Search inside List View */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder={lang === 'mr' ? 'शोधा...' : lang === 'hi' ? 'खोजें...' : 'Search...'}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Event Category filter tabs */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {eventTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    selectedType === type.id
                      ? 'bg-saffron-500 text-white shadow-xs'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-saffron-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-sans">
                  {lang === 'mr' ? 'या वर्गात कोणताही आगामी कार्यक्रम उपलब्ध नाही.' : lang === 'hi' ? 'इस श्रेणी में कोई आगामी कार्यक्रम निर्धारित नहीं है।' : 'No upcoming events scheduled in this category.'}
                </p>
              </div>
            ) : (
              filteredEvents.map(ev => {
                const [year, month, day] = ev.date.split('-');
                const monthNamesMR = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
                const monthNamesHI = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
                const monthNamesEN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                
                const monthIndex = parseDevanagariInt(month) - 1;
                const safeMonthName = lang === 'mr' 
                  ? (monthNamesMR[monthIndex] || "महिना") 
                  : lang === 'hi' 
                  ? (monthNamesHI[monthIndex] || "महीना") 
                  : (monthNamesEN[monthIndex] || "Month");
                
                const formattedDate = `${day} ${safeMonthName} ${year}`;

                return (
                  <div
                    key={ev.id}
                    id={`event-card-${ev.id}`}
                    className="bg-white border border-saffron-100/70 p-5 rounded-2xl hover:border-saffron-300 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5"
                  >
                    {/* Left Date Circle */}
                    <div className="flex sm:flex-col items-center justify-center bg-saffron-50/70 border border-saffron-100 rounded-2xl p-4 min-w-[90px] h-[90px] text-center shrink-0">
                      <span className="text-2xl font-black text-saffron-600 font-mono leading-none">{day}</span>
                      <span className="text-xs font-semibold text-gray-600 mt-1 font-sans">{safeMonthName.slice(0, 5)}</span>
                    </div>

                    {/* Right Event details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getEventBadgeColor(ev.type)}`}>
                          {getEventBadgeLabel(ev.type)}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{formattedDate}</span>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm md:text-base font-devanagari">
                        {ev.title}
                      </h4>

                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-sans line-clamp-3">
                        {ev.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 border-t border-gray-50 pt-3">
                        <span className="flex items-center gap-1.5 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                          {ev.location}
                        </span>
                        {ev.contact && (
                          <span className="flex items-center gap-1.5 font-sans">
                            <Phone className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                            {lang === 'mr' ? 'संपर्क:' : lang === 'hi' ? 'सम्पर्क:' : 'Contact:'} {ev.contact}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right side Quotes & Highlights */}
          <div className="p-6 bg-saffron-50/30 border-t lg:border-t-0 lg:border-l border-saffron-100 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800 font-devanagari border-b border-gray-100 pb-1.5 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-saffron-500" />
                {lang === 'mr' ? 'दैनिक सुविचार आणि लीला' : lang === 'hi' ? 'दैनिक सुविचार व लीला' : "Today's Grace"}
              </h4>

              {/* Daily Quote Box */}
              <div className="bg-white border border-saffron-100 p-5 rounded-2xl shadow-sm mb-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-saffron-100 font-display text-4xl select-none">“</div>
                <span className="text-[10px] bg-saffron-100 text-saffron-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                  {lang === 'mr' ? 'आजचा सुविचार' : lang === 'hi' ? 'आज का सुविचार' : "Today's Quote"}
                </span>
                <p className="text-sm font-bold font-devanagari text-gray-800 leading-relaxed mt-3">
                  "परिग्रहा पासौनि निवृत्ति करावी। असंभोगु रक्षीजे।"
                </p>
                <p className="text-xs text-saffron-600 font-sans mt-2 text-right">
                  {lang === 'mr' ? '— श्रीचक्रधर स्वामी (सूत्रपाठ)' : lang === 'hi' ? '— श्रीचक्रधर स्वामी (सूत्रपाठ)' : '— Shri Chakradhar Swami (Sutrapath)'}
                </p>
              </div>

              {/* Daily Leela Box */}
              <div className="bg-white border border-saffron-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                  {lang === 'mr' ? 'दैनिक पावन लीला' : lang === 'hi' ? 'दैनिक पावन लीला' : "Daily Divine Leela"}
                </span>
                <h5 className="font-bold text-gray-900 text-sm font-devanagari mt-3">
                  {lang === 'mr' ? 'पैठण गमन आणि गोदावरी उपदेश' : lang === 'hi' ? 'पैठण गमन और गोदावरी उपदेश' : 'Journey to Paithan & Godavari Discourse'}
                </h5>
                <p className="text-xs text-gray-600 font-sans mt-1.5 leading-relaxed">
                  {lang === 'mr' 
                    ? 'स्वामी पैठण नगरीत दाखल झाल्यावर त्यांनी गोदावरी घाटावरील लोकांना सोप्या भाषेत अहिंसेचा संदेश दिला, सर्व प्राणिमात्रांवर दया करण्याचा उपदेश केला.' 
                    : lang === 'hi' 
                    ? 'स्वामी पैठण नगरी में प्रवेश करने के बाद उन्होंने गोदावरी घाट पर उपस्थित लोगों को सरल भाषा में अहिंसा का संदेश दिया तथा सभी जीवों पर दया करने का उपदेश दिया।' 
                    : 'Upon entering Paithan, Swami delivered a profound message of non-violence in simple terms at the Godavari banks, teaching mercy toward all living beings.'
                  }
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 font-sans">
                {lang === 'mr' 
                  ? '*तुमच्या परिसरात कोणताही उत्सव किंवा कार्यक्रम असल्यास, कृपया ॲडमिन पॅनेलद्वारे येथे जोडा.' 
                  : lang === 'hi' 
                  ? '*यदि आपके क्षेत्र में कोई महोत्सव या सभा आयोजित हो रही है, तो कृपया एडमिन पैनल के माध्यम से यहाँ जोड़ें।' 
                  : '*If an event or festival is happening in your area, please add it here using the Admin Panel.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================================== */}
      {/* EXTREMELY DETAILED INTERACTIVE CALENDAR CELL MODAL */}
      {/* ==================================================================================== */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border-2 border-saffron-200 transform transition-transform duration-300 scale-100 animate-zoom-in">
            
            {/* Modal Saffron Header Banner */}
            <div className="bg-gradient-to-r from-saffron-600 to-amber-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <CalendarIcon className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg font-devanagari leading-tight">
                    {selectedDay.dayNumber} {
                      selectedDay.month === 'jan' ? 'जानेवारी' :
                      selectedDay.month === 'feb' ? 'फेब्रुवारी' :
                      selectedDay.month === 'mar' ? 'मार्च' :
                      selectedDay.month === 'apr' ? 'एप्रिल' :
                      selectedDay.month === 'may' ? 'मे' :
                      selectedDay.month === 'jun' ? 'जून' :
                      selectedDay.month === 'jul' ? 'जुलै' :
                      selectedDay.month === 'aug' ? 'ऑगस्ट' :
                      selectedDay.month === 'sep' ? 'सप्टेंबर' :
                      selectedDay.month === 'oct' ? 'ऑक्टोबर' :
                      selectedDay.month === 'nov' ? 'नोव्हेंबर' : 'डिसेंबर'
                    } २०२६
                  </h3>
                  <p className="text-xs opacity-90 font-medium font-sans">
                    {selectedDay.isSunday ? 'रविवार (Sunday)' : weekdays[selectedDay.weekdayIndex].labelFull}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDay(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable Contents */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Tithi Detail Box */}
              <div className="bg-gradient-to-r from-amber-50/50 to-saffron-50/20 p-4 rounded-2xl border border-saffron-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-saffron-700 tracking-wider uppercase">महानुभावीय तिथी</span>
                  <p className="font-black text-gray-900 text-lg font-devanagari mt-0.5">
                    {selectedDay.tithi}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">दिवस प्रकार</span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full mt-0.5 ${
                    selectedDay.shubhLabel === 'शुभ दिवस' || selectedDay.shubhLabel === 'चांगला दिवस' || selectedDay.shubhLabel === 'आनंदी दिवस'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedDay.shubhLabel}
                  </span>
                </div>
              </div>

              {/* Special Events & Festivals List */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-saffron-500" />
                  उत्सव / सण / धार्मिक विशेष
                </h4>
                {selectedDay.events && selectedDay.events.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedDay.events.map((ev, idx) => (
                      <div key={idx} className="bg-white border border-amber-100 rounded-2xl p-4 shadow-2xs flex gap-3 hover:border-saffron-200 transition-all">
                        <div className="bg-saffron-50 p-2 rounded-xl h-fit shrink-0">
                          <Sparkles className="w-4 h-4 text-saffron-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm font-devanagari leading-snug">
                            {ev}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic pl-6">या दिवशी कोणतीही विशिष्ट यात्रा किंवा उत्सव उपलब्ध नाही.</p>
                )}
              </div>

              {/* Astrological / Yogs Timings */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-saffron-500" />
                  पंचांग / शुभ योग व भद्रा काळ
                </h4>
                {selectedDay.yogs && selectedDay.yogs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDay.yogs.map((yog, idx) => (
                      <div key={idx} className="bg-amber-50/30 border border-amber-100/60 rounded-xl p-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-saffron-500 rounded-full shrink-0"></span>
                        <span className="text-xs font-extrabold text-gray-800 font-devanagari leading-snug">
                          {yog}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                    <span className="text-xs font-extrabold text-emerald-800 font-devanagari">
                      या दिवशी कोणताही अशुभ योग किंवा दोष नाही. सर्व वेळ शुचिर्भूत आहे.
                    </span>
                  </div>
                )}
              </div>

              {/* Spiritual Slogan Section inside Modal */}
              <div className="bg-saffron-50/50 p-4 rounded-2xl border border-dashed border-saffron-200 text-center relative overflow-hidden">
                <span className="absolute -top-1 -right-1 text-4xl text-saffron-100 font-serif">”</span>
                <p className="text-xs italic font-bold text-saffron-700 font-devanagari">
                  "भक्तीची व्याख्या: अनन्य शरणागती आणि पंचकृष्णांचे नामस्मरण होय."
                </p>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedDay(null)}
                className="bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>ठीक आहे (Close)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
