import React, { useState, useRef, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Heart, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface MuhurtViewProps {
  lang: 'mr' | 'hi' | 'en';
}

interface SpecialSection {
  title: string;
  dateInfo?: string;
  subTitle?: string;
  paragraphs?: string[];
  timingLabel?: string;
  timings?: { label: string; value: string }[];
  cityTimes?: { city: string; time: string }[];
}

interface MonthData {
  shubhDivas: string;
  ashubhDivas: string;
  vivahDin: string;
  upanayanDin: string;
  specialSectionPosition?: 'beforeVivah' | 'afterUpanayan';
  specialSection?: SpecialSection;
  tip?: string;
}

const muhurtData: Record<string, MonthData> = {
  january: {
    shubhDivas: '१, २ (सायं. ७ पर्यंत ), ३, ५, ७, ८, १०, ११, १२, १४, १९, २०, २१ (सायं. ७ नंतर), २२ (दुपारी ३ पर्यंत), २३, २४, २५, २६, २७ (सकाळी ११ पर्यंत), २८ (सकाळी ९ नंतर), २९ (दुपारी २ नंतर), ३० (सायं. ५ नंतर)',
    ashubhDivas: '४, ६, ९, १३, १५, १६, १७, १८, ३१',
    vivahDin: 'नाहीत',
    upanayanDin: 'नाहीत'
  },
  february: {
    shubhDivas: '१ (सायं. ५ नंतर), २, ३, ४ (दुपारी १२ पर्यंत), ५, ६, ७, ८ (दुपारी ४ नंतर), १०, ११ (सकाळी ११ पर्यंत), १२ (दुपारी २ नंतर), १३, १४ (दुपारी ४ पर्यंत), १८, १९, २०, २१ (दुपारी १ नंतर), २२, २५, २६, २७ (दुपारी १२ पर्यंत), २८',
    ashubhDivas: '९, १५, १६, १७, २३, २४',
    vivahDin: '३, ५, ६, ७, ८, १०, ११, १२, २०, २२, २५, २६ (टीप पहा.)',
    upanayanDin: '४, ६, २२, २६, २७ (टीप पहा.)',
    specialSection: {
      title: 'महाशिवरात्र : शिवपूजनासाठीची वेळ',
      dateInfo: '१५ फेब्रुवारी (माघ कृ. १३), रविवार',
      subTitle: 'शिवपूजनासाठी काही नगरांच्या वेळा',
      cityTimes: [
        { city: 'मुंबई', time: 'उ.रा. १२.२८ ते उ.रा. १.१८' },
        { city: 'सोलापूर', time: 'उ.रा. १२.१५ ते उ.रा. १.०५' },
        { city: 'नागपूर', time: 'उ.रा. १२.०२ ते उ.रा. १२.५२' },
        { city: 'कर्णावती', time: 'उ.रा. १२.३१ ते उ.रा. १.१९' },
        { city: 'वाराणसी', time: 'रा. ११.४६ ते उ.रा. १२.३७' },
        { city: 'मंगळूरू', time: 'उ.रा. १२.२० ते उ.रा. १.०९' },
        { city: 'बंगळूरु', time: 'उ.रा. १२.०९ ते उ.रा. १२.५८' }
      ]
    },
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  march: {
    shubhDivas: '१, ५, ६ (सायं. ६ नंतर), ७, ८ (दुपारी २ पर्यंत), ९ (दुपारी ४ नंतर), १२ (सकाळी १० पर्यंत), १४ (सकाळी ८ नंतर), १५, १६ (सकाळी १० पर्यंत), १९, २०, २१ (सायं. ७ प.), २४, २५ (दु. २ प.), २६, २७, २८, २९, ३०, ३१',
    ashubhDivas: '२, ३, ४, १०, ११, १३, १७, १८, २२, २३',
    vivahDin: '५, ७, ८, १२, १४, १५, १६ (टीप पहा.)',
    upanayanDin: '५, ८, २०, २९ (टीप पहा.)',
    specialSection: {
      title: 'ग्रहण',
      subTitle: 'खग्रास चंद्रग्रहण (ग्रस्तोदित) (३ मार्च)',
      paragraphs: [
        'भारतात हे ग्रहण ग्रस्तोदित, म्हणजे ग्रहण लागलेल्या स्थितीत चंद्रोदय होतांना दिसेल. गुजरातमधील राजकोट, पोरबंदर अशा सायं. ६.४८ नंतर सूर्यास्त होणाऱ्या प्रदेशांत हे ग्रहण दिसणार नाही. त्यामुळे तिथे ग्रहणाचे नियम पाळू नयेत.',
        'वेधकाळ : सूर्योदय ते ग्रहणमोक्ष. बाल, वृद्ध, अशक्त, रुग्ण व्यक्ती व गर्भवती महिला यांनी स. ११ पासून वेध पाळावेत.',
        'वेधकाळातील विधिनिषेध : देवपूजा, नामजप व श्राद्ध, ही कर्मे करावीत. भोजन करू नये. पर्वकाळ (स्थानिक सूर्यास्त ते ग्रहणमोक्ष) सुरू होईपर्यंत पाणी पिणे, मल-मूत्रोत्सर्ग करणे व झोप घेणे करू शकतो; मात्र पर्वकाळात ही कर्मे करू नयेत.',
        'पुण्यकाळ : चंद्रोदय (स्थानिक सूर्यास्त) ते ग्रहणमोक्ष'
      ],
      timingLabel: 'ग्रहणाशी संबंधित वेळा (संपूर्ण भारतासाठी)',
      timings: [
        { label: 'स्पर्श', value: 'दु. ३.२०' },
        { label: 'मध्य', value: 'सायं. ५.०४' },
        { label: 'मोक्ष', value: 'सायं. ६.४८' }
      ]
    },
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  april: {
    shubhDivas: '१ (सकाळी ७ पर्यंत), २, ३, ४, ६ (दुपारी ३ पर्यंत), ८ (सायं. ७ पर्यंत), ९ (सकाळी ८ नंतर), १०, ११, १२ (दुपारी १ पर्यंत), १३, १४, १८, १९, २१, २२, २३, २४ (सकाळी ८ नंतर), २५, २६, २७ (सायं. ६ नंतर), २८, २९, ३०',
    ashubhDivas: '५, ७, १५, १६, १७, २०',
    vivahDin: '२१, २६, २८, २९, ३० (टीप पहा.)',
    upanayanDin: '२१ (टीप पहा.)',
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  may: {
    shubhDivas: '१ (सकाळी १० नंतर), ३, ४ (सकाळी १० पर्यंत), ६, ७, ८ (दुपारी १२ पर्यंत), ९, १०, ११, १३, १४ (सकाळी ११ पर्यंत), १८, १९, २० (सकाळी ११ नंतर), २१, २३ (सायं. ५ नंतर), २४, २५, २८, २९ (सकाळी ११ पर्यंत), ३१ (दुपारी ४ पर्यंत)',
    ashubhDivas: '२, ५, १२, १५, १६, १७, २२, २६, २७, ३०',
    vivahDin: '१, ३, ६, ७, ८, ९, १०, १३, १४ (टीप पहा.)',
    upanayanDin: '३, ६, ७ (टीप पहा.)',
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  june: {
    shubhDivas: '१ (सायं. ७ नंतर), २, ३ (सकाळी ८ पर्यंत), ४, ५, ६ (सकाळी १० पर्यंत), ७ (दुपारी ३ नंतर), ८, ९, १० (दुपारी २ पर्यंत), ११, १२ (रात्री ८ पर्यंत), १६, १७, १८ (सकाळी ८ पर्यंत), १९, २०, २१ (सकाळी ११ पर्यंत), २२ (स.११ नं.), २३, २४, २५ (स. ७ प.), २६ (सायं. ७ नं.), २७, २९ (दु. ४ नं.)',
    ashubhDivas: '१३, १४, १५, २८, ३०',
    vivahDin: '१९, २०, २२, २३, २४, २७ (टीप पहा.)',
    upanayanDin: '१६, १९ (टीप पहा.)',
    specialSection: {
      title: 'पेरणीचे दिनांक आणि मुहूर्त',
      paragraphs: [
        '१७ (दु. २ नं.), १८ (स. ८ प.), १९ (स. १० नं.), २० (स. ९ प.), २१ (स. १० ते ११), २३ (दु. १२ नं.), २४, २५ (स. ७ प.)'
      ]
    },
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  july: {
    shubhDivas: '१ (दुपारी ४ पर्यंत), २ (सायं. ५ नंतर), ३ (सकाळी ११ नंतर), ४, ५, ६ (दुपारी २ पर्यंत), ७, ८, ९, ११ (सकाळी ११ नंतर), १५, १६, १८, १९, २०, २१ (सायं. ५ नंतर), २४, २५, २८ (सायं. ६ पर्यंत), २९, ३०, ३१',
    ashubhDivas: '१०, १२, १३, १४, १७, २२, २३, २५, २७',
    vivahDin: '१, २, ३, ४, ७, ८, ९, ११ (टीप पहा.)',
    upanayanDin: 'नाहीत',
    specialSection: {
      title: 'पेरणीचे दिनांक आणि मुहूर्त',
      paragraphs: [
        '२०, २१ (सायं. ५ नंतर)'
      ]
    },
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  august: {
    shubhDivas: '१ (सकाळी ११ पर्यंत), २, ३, ४, ५ (सकाळी ९ नंतर), ६, ७ (सायं. ७ नंतर), ८ (दुपारी २ नंतर), ९, १३, १४, १५, १६ (सायं. ५ नंतर), १७, १८, २० (सकाळी ९ नंतर), २२ (दुपारी ३ नंतर), २३ (दुपारी ३ पर्यंत), २४, २६, २७ (सकाळी ९ पर्यंत), २८, २९, ३०, ३१ (सकाळी ९ नंतर)',
    ashubhDivas: '१०, ११, १२, १९, २१, २५',
    vivahDin: 'नाहीत',
    upanayanDin: 'नाहीत'
  },
  september: {
    shubhDivas: '२, ४, ५, ६ (सकाळी ९ पर्यंत), ७ (सकाळी ७ नंतर), ८ (दुपारी ३ पर्यंत), १२, १३, १४, १६ (सायं. ५ नंतर), १७ (रात्री ८ पर्यंत), १८, १९, २०, २१, २२ (सकाळी ९ पर्यंत), २३, २४, २५, २६ (सकाळी ११ नंतर), २७, २८, २९ (सायं. ५ नंतर)',
    ashubhDivas: '१, ३, ९, १०, ११, १५, ३०',
    vivahDin: 'नाहीत',
    upanayanDin: 'नाहीत'
  },
  october: {
    shubhDivas: '१, ४, ५ (दुपारी ३ पर्यंत), ६, ७, १२, १४ (दुपारी १२ पर्यंत), १६, १८ (सकाळी ८ पर्यंत), १९, २०, २१, २२ (दु. ३ नं.), २३, २४, २५ (दु. १२ प.), २६, २९, ३०, ३१ (सायं. ५ प.)',
    ashubhDivas: '२, ३, ८, ९, १०, ११, १३, १५, १७, २७, २८',
    vivahDin: 'नाहीत',
    upanayanDin: 'नाहीत',
    specialSection: {
      title: 'कापणीचे दिनांक आणि मुहूर्त',
      paragraphs: [
        '५ (दुपारी ३ पर्यंत), ७, १२, १५, १६, १८ (सकाळी ८ पर्यंत), १९ (सकाळी ११ पर्यंत), २१, २३, २६ (सायं. ६ नंतर), २८ (सकाळी ७ ते दुपारी १), ३०'
      ]
    },
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  november: {
    shubhDivas: '१, २, ३, ४ (सकाळी ११ नंतर), ६ (सकाळी ११ पर्यंत), ८, १०, ११, १२ (दुपारी २ नंतर), १४, १५, १६, १७ (सायं. ५ नंतर), १९, २१, २३, २५, २६, २८, २९',
    ashubhDivas: '५, ७, ९, १३, १८, २०, २२, २४, २७, ३०',
    specialSectionPosition: 'beforeVivah',
    specialSection: {
      title: 'दीपावलीतील विशेष मुहूर्त',
      paragraphs: [
        'लक्ष्मीपूजन (८ नोव्हेंबर) : सायं. ५.५० ते रात्री १०.५०',
        'वहीपूजन (१० नोव्हेंबर) : (९ नोव्हेंबर) उत्तर रात्री २.१० ते (१० नोव्हेंबर) पहाटे ५.१०, सकाळी ६.३५ ते ७.२५, सकाळी ११ ते दुपारी २'
      ]
    },
    vivahDin: 'नाहीत',
    upanayanDin: 'नाहीत',
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  },
  december: {
    shubhDivas: '१ (दुपारी १२ नंतर), २, ३ (सकाळी ११ पर्यंत), ४, ५, १०, ११, १२, १३ (सायं. ५ नंतर), १४, १५, १६, १८ (दुपारी १२ नंतर), १९, २० (सकाळी ९ पर्यंत), २१ (दुपारी १ पर्यंत), २२ (सकाळी ११ नंतर), २४, २५, २७, २८, २९ (दुपारी १ पर्यंत), ३०, ३१',
    ashubhDivas: '६, ७, ८, ९, १७, २३, २६',
    vivahDin: 'नाहीत',
    upanayanDin: 'नाहीत',
    tip: 'मुहूर्तांच्या वेळा स्थानानुसार पालटत असल्याने त्यांविषयी स्थानिक पुरोहितांना विचारावे.'
  }
};

const monthsList = [
  { id: 'january', mr: 'जानेवारी', hi: 'जनवरी', en: 'January' },
  { id: 'february', mr: 'फेब्रुवारी', hi: 'फरवरी', en: 'February' },
  { id: 'march', mr: 'मार्च', hi: 'मार्च', en: 'March' },
  { id: 'april', mr: 'एप्रिल', hi: 'अप्रैल', en: 'April' },
  { id: 'may', mr: 'मे', hi: 'मई', en: 'May' },
  { id: 'june', mr: 'जून', hi: 'जून', en: 'June' },
  { id: 'july', mr: 'जुलै', hi: 'जुलाई', en: 'July' },
  { id: 'august', mr: 'ऑगस्ट', hi: 'अगस्त', en: 'August' },
  { id: 'september', mr: 'सप्टेंबर', hi: 'सितंबर', en: 'September' },
  { id: 'october', mr: 'ऑक्टोबर', hi: 'अक्टूबर', en: 'October' },
  { id: 'november', mr: 'नोव्हेंबर', hi: 'नवंबर', en: 'November' },
  { id: 'december', mr: 'डिसेंबर', hi: 'दिसंबर', en: 'December' }
];

export const MuhurtView: React.FC<MuhurtViewProps> = ({ lang }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentMonthIdx = new Date().getMonth();
    return monthsList[currentMonthIdx]?.id || 'august';
  });
  const monthScrollRef = useRef<HTMLDivElement>(null);

  const currentData = muhurtData[selectedMonth];
  const activeMonthObj = monthsList.find(m => m.id === selectedMonth);

  useEffect(() => {
    if (monthScrollRef.current) {
      const activeBtn = monthScrollRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedMonth]);

  const handleSlide = (direction: 'left' | 'right') => {
    if (monthScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      monthScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* MONTH SELECTOR BAR WITH SLIDE OPTIONS */}
      <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-amber-200/90 shadow-md relative flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleSlide('left')}
          title="मागील महिने"
          className="p-2.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-900 transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 border border-amber-300/60"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div
          ref={monthScrollRef}
          className="flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar scroll-smooth w-full touch-pan-x"
        >
          {monthsList.map(m => {
            const isActive = m.id === selectedMonth;
            const hasData = !!muhurtData[m.id];

            return (
              <button
                key={m.id}
                data-active={isActive}
                onClick={(e) => {
                  setSelectedMonth(m.id);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-devanagari transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 border border-amber-500 scale-105'
                    : 'bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-200/60'
                }`}
              >
                <span>{m[lang]}</span>
                {hasData && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-200' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleSlide('right')}
          title="पुढील महिने"
          className="p-2.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-900 transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 border border-amber-300/60"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* MUHURT CARDS DISPLAY */}
      {currentData ? (
        <div className="space-y-4">
          {/* CARD 1: शुभ दिवस */}
          <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari">
                {lang === 'mr' ? 'शुभ दिवस' : lang === 'hi' ? 'शुभ दिवस' : 'Auspicious Days'}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-devanagari leading-relaxed pl-1 font-semibold">
              {currentData.shubhDivas}
            </p>
          </div>

          {/* CARD 2: अशुभ दिवस */}
          <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-800 shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari">
                {lang === 'mr' ? 'अशुभ दिवस' : lang === 'hi' ? 'अशुभ दिवस' : 'Inauspicious Days'}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-devanagari leading-relaxed pl-1 font-semibold">
              {currentData.ashubhDivas}
            </p>
          </div>

          {/* SPECIAL SECTION IF POSITIONED BEFORE VIVAH */}
          {currentData.specialSection && currentData.specialSectionPosition === 'beforeVivah' && (
            <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400 space-y-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari">
                  {currentData.specialSection.title}
                </h3>
                {currentData.specialSection.dateInfo && (
                  <p className="text-sm sm:text-base text-indigo-900 font-devanagari font-bold mt-1">
                    {currentData.specialSection.dateInfo}
                  </p>
                )}
              </div>

              {currentData.specialSection.subTitle && (
                <p className="text-sm sm:text-base text-indigo-900 font-devanagari font-bold pt-1">
                  {currentData.specialSection.subTitle}
                </p>
              )}

              {currentData.specialSection.paragraphs && (
                <div className="space-y-3 pt-1">
                  {currentData.specialSection.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-sky-950 font-devanagari leading-relaxed font-semibold">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {currentData.specialSection.timingLabel && (
                <p className="text-sm sm:text-base text-indigo-900 font-devanagari font-bold pt-2">
                  {currentData.specialSection.timingLabel}
                </p>
              )}

              {currentData.specialSection.timings && (
                <div className="space-y-1 pt-1 pl-1">
                  {currentData.specialSection.timings.map((t, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-sky-900 font-devanagari font-bold">
                      {t.label} : {t.value}
                    </p>
                  ))}
                </div>
              )}

              {currentData.specialSection.cityTimes && (
                <div className="space-y-1.5 pt-1 pl-1">
                  {currentData.specialSection.cityTimes.map((item, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-sky-900 font-devanagari font-bold">
                      {item.city} : {item.time}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CARD 3: विवाहदिन */}
          <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-amber-800 shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari">
                {lang === 'mr' ? 'विवाहदिन' : lang === 'hi' ? 'विवाहदिन' : 'Marriage Dates'}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-devanagari leading-relaxed pl-1 font-semibold">
              {currentData.vivahDin}
            </p>
          </div>

          {/* CARD 4: उपनयनदिन */}
          <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-5 h-5 text-amber-800 shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari">
                {lang === 'mr' ? 'उपनयनदिन' : lang === 'hi' ? 'उपनयनदिन' : 'Upanayan Dates'}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-devanagari leading-relaxed pl-1 font-semibold">
              {currentData.upanayanDin}
            </p>
          </div>

          {/* CARD 5: SPECIAL SECTION (if not positioned before vivah) */}
          {currentData.specialSection && currentData.specialSectionPosition !== 'beforeVivah' && (
            <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400 space-y-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari">
                  {currentData.specialSection.title}
                </h3>
                {currentData.specialSection.dateInfo && (
                  <p className="text-sm sm:text-base text-indigo-900 font-devanagari font-bold mt-1">
                    {currentData.specialSection.dateInfo}
                  </p>
                )}
              </div>

              {currentData.specialSection.subTitle && (
                <p className="text-sm sm:text-base text-indigo-900 font-devanagari font-bold pt-1">
                  {currentData.specialSection.subTitle}
                </p>
              )}

              {currentData.specialSection.paragraphs && (
                <div className="space-y-3 pt-1">
                  {currentData.specialSection.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-sky-950 font-devanagari leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {currentData.specialSection.timingLabel && (
                <p className="text-sm sm:text-base text-indigo-900 font-devanagari font-bold pt-2">
                  {currentData.specialSection.timingLabel}
                </p>
              )}

              {currentData.specialSection.timings && (
                <div className="space-y-1 pt-1 pl-1">
                  {currentData.specialSection.timings.map((t, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-sky-900 font-devanagari font-bold">
                      {t.label} : {t.value}
                    </p>
                  ))}
                </div>
              )}

              {currentData.specialSection.cityTimes && (
                <div className="space-y-1.5 pt-1 pl-1">
                  {currentData.specialSection.cityTimes.map((item, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-sky-900 font-devanagari font-bold">
                      {item.city} : {item.time}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CARD 6: टीप (TIP) */}
          {currentData.tip && (
            <div className="bg-[#FAF8F5] border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm transition-all hover:border-amber-400">
              <h3 className="text-base sm:text-lg font-black text-[#800000] font-devanagari mb-2">
                {lang === 'mr' ? 'टीप' : lang === 'hi' ? 'टीप' : 'Note'}
              </h3>
              <p className="text-sm sm:text-base text-indigo-900 font-devanagari leading-relaxed font-bold">
                {currentData.tip}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* FALLBACK FOR MONTHS WITHOUT DATA YET */
        <div className="bg-white/90 border border-amber-200/80 rounded-3xl p-8 text-center space-y-4 shadow-md my-4">
          <Clock className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-lg font-bold text-amber-950 font-devanagari">
            {activeMonthObj ? activeMonthObj[lang] : ''} मुहूर्त
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-devanagari">
            {lang === 'mr'
              ? 'या महिन्याची मुहूर्त माहिती लवकरच अद्ययावत केली जाईल.'
              : 'Data for this month will be updated soon.'}
          </p>
        </div>
      )}
    </div>
  );
};
