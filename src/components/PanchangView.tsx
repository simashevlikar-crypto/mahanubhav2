import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, X, ZoomIn, ZoomOut, RotateCcw, LayoutGrid, Table, Moon } from 'lucide-react';

interface PanchangViewProps {
  lang?: 'mr' | 'hi' | 'en';
}

interface PanchangRow {
  date: string;
  tithi: string;
  tithiEnd: string;
  nakshatra: string;
  nakshatraEnd: string;
  yoga: string;
  yogaEnd: string;
  karana: string;
  karanaEnd: string;
  rashi: string;
  isRed?: boolean; // Highlight in red/pink like traditional Panchang
}

export const PanchangView: React.FC<PanchangViewProps> = ({ lang = 'mr' }) => {
  const months = [
    { id: 'nov_2025', month: 10, year: 2025, name: lang === 'mr' ? 'नोव्हेंबर २०२५' : lang === 'hi' ? 'नवंबर २०२५' : 'November 2025' },
    { id: 'dec_2025', month: 11, year: 2025, name: lang === 'mr' ? 'डिसेंबर २०२५' : lang === 'hi' ? 'दिसंबर २०२५' : 'December 2025' },
    { id: 'jan_2026', month: 0, year: 2026, name: lang === 'mr' ? 'जानेवारी २०२६' : lang === 'hi' ? 'जनवरी २०२६' : 'January 2026' },
    { id: 'feb_2026', month: 1, year: 2026, name: lang === 'mr' ? 'फेब्रुवारी २०२६' : lang === 'hi' ? 'फरवरी २०२६' : 'February 2026' },
    { id: 'mar_2026', month: 2, year: 2026, name: lang === 'mr' ? 'मार्च २०२६' : lang === 'hi' ? 'मार्च २०२६' : 'March 2026' },
    { id: 'apr_2026', month: 3, year: 2026, name: lang === 'mr' ? 'एप्रिल २०२६' : lang === 'hi' ? 'अप्रैल २०२६' : 'April 2026' },
    { id: 'may_2026', month: 4, year: 2026, name: lang === 'mr' ? 'मे २०२६' : lang === 'hi' ? 'मई २०२६' : 'May 2026' },
    { id: 'jun_2026', month: 5, year: 2026, name: lang === 'mr' ? 'जून २०२६' : lang === 'hi' ? 'जून २०२६' : 'June 2026' },
    { id: 'jul_2026', month: 6, year: 2026, name: lang === 'mr' ? 'जुलै २०२६' : lang === 'hi' ? 'जुलाई २०२६' : 'July 2026' },
    { id: 'aug_2026', month: 7, year: 2026, name: lang === 'mr' ? 'ऑगस्ट २०२६' : lang === 'hi' ? 'अगस्त २०२६' : 'August 2026' },
    { id: 'sep_2026', month: 8, year: 2026, name: lang === 'mr' ? 'सप्टेंबर २०२६' : lang === 'hi' ? 'सितंबर २०२६' : 'September 2026' },
    { id: 'oct_2026', month: 9, year: 2026, name: lang === 'mr' ? 'ऑक्टोबर २०२६' : lang === 'hi' ? 'अक्टूबर २०२६' : 'October 2026' },
    { id: 'nov_2026', month: 10, year: 2026, name: lang === 'mr' ? 'नोव्हेंबर २०२६' : lang === 'hi' ? 'नवंबर २०२६' : 'November 2026' },
    { id: 'dec_2026', month: 11, year: 2026, name: lang === 'mr' ? 'डिसेंबर २०२६' : lang === 'hi' ? 'दिसंबर २०२६' : 'December 2026' },
  ];

  // Dynamically calculate current running month index
  const getCurrentMonthIndex = () => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();

    const idx = months.findIndex(m => m.year === curYear && m.month === curMonth);
    if (idx !== -1) return idx;

    if (curYear === 2026) {
      return Math.min(months.length - 1, Math.max(2, curMonth + 2));
    }
    return 9; // August 2026
  };

  const currentRunningMonthIndex = getCurrentMonthIndex();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentRunningMonthIndex);
  const [selectedDayRow, setSelectedDayRow] = useState<PanchangRow | null>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  // Zoom state & touch gesture handlers for Pinch to Zoom
  const [zoomScale, setZoomScale] = useState<number>(0.60); // 60% zoom by default for full grid
  const touchStartDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(0.60);

  const tableRef = useRef<HTMLTableElement | HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState<number | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [selectedMonthIndex, zoomScale, lang, viewMode]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      initialZoomRef.current = zoomScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = currentDist / touchStartDistRef.current;
      const newScale = Math.min(2.5, Math.max(0.30, initialZoomRef.current * scaleFactor));
      setZoomScale(Number(newScale.toFixed(2)));
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = null;
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(2.5, Number((prev + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoomScale(prev => Math.max(0.30, Number((prev - 0.15).toFixed(2))));
  const handleZoomReset = () => setZoomScale(0.60);

  // Ref & auto-scroll effect for Month Pills Slider
  const monthListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monthListRef.current) {
      const activeEl = monthListRef.current.children[selectedMonthIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedMonthIndex]);

  // January 2026 full traditional Panchang data
  const jan2026Data: PanchangRow[] = [
    { date: '१ गुरु', tithi: 'शु. १३', tithiEnd: '२२.२३', nakshatra: 'रोहिणी', nakshatraEnd: '२२.४९', yoga: 'शुभ', yogaEnd: '१७.१३', karana: 'कौलव', karanaEnd: '१२.०७', rashi: 'वृषभ' },
    { date: '२ शुक्र', tithi: 'शु. १४', tithiEnd: '१८.५४', nakshatra: 'मृग', nakshatraEnd: '२०.०४', yoga: 'शुक्ल', yogaEnd: '१३.०७', karana: 'गरज / विष्टि', karanaEnd: '०८.३८ / २९.१२', rashi: '०९.२६ नं. मिथुन' },
    { date: '३ शनि', tithi: 'पौर्णिमा', tithiEnd: '१५.३३', nakshatra: 'आर्द्र', nakshatraEnd: '१७.२८', yoga: 'ब्रह्मा / ऐंद्र', yogaEnd: '०९.०५ / २९.१६', karana: 'बालव', karanaEnd: '२५.५९', rashi: 'मिथुन', isRed: true },
    { date: '४ रवि', tithi: 'कृ. १', tithiEnd: '१२.३०', nakshatra: 'पुनर्वसु', nakshatraEnd: '१५.११', yoga: 'वैधृति', yogaEnd: '२५.४७', karana: 'तैतिल', karanaEnd: '२३.१०', rashi: '०९.४३ नं. कर्क', isRed: true },
    { date: '५ सोम', tithi: 'कृ. २', tithiEnd: '०९.५७', nakshatra: 'पुष्य', nakshatraEnd: '१३.२५', yoga: 'विष्कंभ', yogaEnd: '२२.४७', karana: 'वणिज', karanaEnd: '२०.५४', rashi: 'कर्क' },
    { date: '६ मंगळ', tithi: 'कृ. ३ / कृ. ४', tithiEnd: '०८.०२ / ३०.५३', nakshatra: 'आश्लेषा', nakshatraEnd: '१२.१८', yoga: 'प्रीति', yogaEnd: '२०.२१', karana: 'बव', karanaEnd: '१९.२२', rashi: '१२.१८ नं. सिंह', isRed: true },
    { date: '७ बुध', tithi: 'कृ. ५', tithiEnd: '३०.३४', nakshatra: 'मघा', nakshatraEnd: '११.५७', yoga: 'आयुष्मान्', yogaEnd: '१८.३४', karana: 'कौलव', karanaEnd: '१८.३७', rashi: 'सिंह' },
    { date: '८ गुरु', tithi: 'कृ. ६', tithiEnd: '३१.०६', nakshatra: 'पूर्वा', nakshatraEnd: '१२.२५', yoga: 'सौभाग्य', yogaEnd: '१७.२६', karana: 'गरज', karanaEnd: '१८.४४', rashi: '१८.३९ नं. कन्या' },
    { date: '९ शुक्र', tithi: 'कृ. ७', tithiEnd: 'अहोरात्र', nakshatra: 'उत्तरा', nakshatraEnd: '१३.४१', yoga: 'शोभन', yogaEnd: '१६.५६', karana: 'विष्टि', karanaEnd: '१९.४०', rashi: 'कन्या' },
    { date: '१० शनि', tithi: 'कृ. ७', tithiEnd: '०८.२४', nakshatra: 'हस्त', nakshatraEnd: '१५.४०', yoga: 'अतिगंड', yogaEnd: '१६.५८', karana: 'बालव', karanaEnd: '२१.१८', rashi: '२८.५३ नं. तुला' },
    { date: '११ रवि', tithi: 'कृ. ८', tithiEnd: '१०.२१', nakshatra: 'चित्रा', nakshatraEnd: '१८.१२', yoga: 'सुकर्मा', yogaEnd: '१७.२७', karana: 'तैतिल', karanaEnd: '२३.३०', rashi: 'तुला', isRed: true },
    { date: '१२ सोम', tithi: 'कृ. ९', tithiEnd: '१२.४३', nakshatra: 'स्वाती', nakshatraEnd: '२१.०६', yoga: 'धृति', yogaEnd: '१८.१२', karana: 'वणिज', karanaEnd: '२६.००', rashi: 'तुला' },
    { date: '१३ मंगळ', tithi: 'कृ. १०', tithiEnd: '१५.१८', nakshatra: 'विशाखा', nakshatraEnd: '२४.०७', yoga: 'शूल', yogaEnd: '१९.०५', karana: 'बव', karanaEnd: '२८.३७', rashi: '१७.२१ नं. वृश्चिक', isRed: true },
    { date: '१४ बुध', tithi: 'कृ. ११', tithiEnd: '१७.५३', nakshatra: 'अनुराधा', nakshatraEnd: '२७.०४', yoga: 'गंड', yogaEnd: '१९.५६', karana: 'कौलव', karanaEnd: '३१.०७', rashi: 'वृश्चिक', isRed: true },
    { date: '१५ गुरु', tithi: 'कृ. १२', tithiEnd: '२०.१७', nakshatra: 'ज्येष्ठा', nakshatraEnd: '२९.४८', yoga: 'वृद्धि', yogaEnd: '२०.३८', karana: 'गरज', karanaEnd: 'अहोरात्र', rashi: '२९.४८ नं. धनु' },
    { date: '१६ शुक्र', tithi: 'कृ. १३', tithiEnd: '२२.२२', nakshatra: 'मूळ', nakshatraEnd: 'अहोरात्र', yoga: 'ध्रुव', yogaEnd: '२१.०६', karana: 'गरज', karanaEnd: '०९.२२', rashi: 'धनु' },
    { date: '१७ शनि', tithi: 'कृ. १४', tithiEnd: '२४.०४', nakshatra: 'मूळ', nakshatraEnd: '०८.१२', yoga: 'व्याघात', yogaEnd: '२१.१८', karana: 'विष्टि', karanaEnd: '११.१६', rashi: 'धनु' },
    { date: '१८ रवि', tithi: 'अमावास्या', tithiEnd: '२५.२२', nakshatra: 'पू.षा.', nakshatraEnd: '१०.१४', yoga: 'हर्षण', yogaEnd: '२१.११', karana: 'चतुष्पाद', karanaEnd: '१२.४६', rashi: '१६.४१ नं. मकर', isRed: true },
    { date: '१९ सोम', tithi: 'शु. १', tithiEnd: '२६.१५', nakshatra: 'उ.षा.', nakshatraEnd: '११.५२', yoga: 'वज्र', yogaEnd: '२०.४५', karana: 'किंस्तुघ्न', karanaEnd: '१३.५१', rashi: 'मकर' },
    { date: '२० मंगळ', tithi: 'शु. २', tithiEnd: '२६.४३', nakshatra: 'श्रवण', nakshatraEnd: '१३.०७', yoga: 'सिद्धि', yogaEnd: '२०.०१', karana: 'बालव', karanaEnd: '१४.३२', rashi: '२५.३६ नं. कुंभ' },
    { date: '२१ बुध', tithi: 'शु. ३', tithiEnd: '२६.४८', nakshatra: 'धनिष्ठा', nakshatraEnd: '१३.५८', yoga: 'व्यतीपात', yogaEnd: '१८.५८', karana: 'तैतिल', karanaEnd: '१४.४८', rashi: 'कुंभ' },
    { date: '२२ गुरु', tithi: 'शु. ४', tithiEnd: '२६.२९', nakshatra: 'शततारा', nakshatraEnd: '१४.२७', yoga: 'वरीयान', yogaEnd: '१७.३८', karana: 'वणिज', karanaEnd: '१४.४१', rashi: 'कुंभ', isRed: true },
    { date: '२३ शुक्र', tithi: 'शु. ५', tithiEnd: '२५.४७', nakshatra: 'पू.भा.', nakshatraEnd: '१४.३३', yoga: 'परिघ', yogaEnd: '१५.५९', karana: 'बव', karanaEnd: '१४.११', rashi: '०८.३४ नं. मीन' },
    { date: '२४ शनि', tithi: 'शु. ६', tithiEnd: '२४.४०', nakshatra: 'उ.भा.', nakshatraEnd: '१४.१६', yoga: 'शिव', yogaEnd: '१४.०२', karana: 'कौलव', karanaEnd: '१३.१६', rashi: 'मीन' },
    { date: '२५ रवि', tithi: 'शु. ७', tithiEnd: '२३.११', nakshatra: 'रेवती', nakshatraEnd: '१३.३६', yoga: 'सिद्ध', yogaEnd: '११.४६', karana: 'गरज', karanaEnd: '११.५९', rashi: '१३.३६ नं. मेष', isRed: true },
    { date: '२६ सोम', tithi: 'शु. ८', tithiEnd: '२१.१९', nakshatra: 'अश्विनी', nakshatraEnd: '१२.३३', yoga: 'साध्य / शुभ', yogaEnd: '०९.११ / ३०.२०', karana: 'विष्टि', karanaEnd: '१०.१७', rashi: 'मेष' },
    { date: '२७ मंगळ', tithi: 'शु. ९', tithiEnd: '१९.०६', nakshatra: 'भरणी', nakshatraEnd: '११.०९', yoga: 'शुक्ल', yogaEnd: '२७.१३', karana: 'बालव / तैतिल', karanaEnd: '०८.१५ / २९.५३', rashi: '१६.४५ नं. वृषभ' },
    { date: '२८ बुध', tithi: 'शु. १०', tithiEnd: '१६.३७', nakshatra: 'कृत्तिका', nakshatraEnd: '०९.२७', yoga: 'ब्रह्मा', yogaEnd: '२३.५४', karana: 'वणिज', karanaEnd: '२७.१७', rashi: 'वृषभ' },
    { date: '२९ गुरु', tithi: 'शु. ११', tithiEnd: '१३.५६', nakshatra: 'रोहिणी', nakshatraEnd: '०७.३२', yoga: 'ऐंद्र', yogaEnd: '२०.२७', karana: 'बव', karanaEnd: '२४.३३', rashi: '१८.३१ नं. मिथुन' },
    { date: '३० शुक्र', tithi: 'शु. १२', tithiEnd: '११.१०', nakshatra: 'मृग / आर्द्रा', nakshatraEnd: '०५.३१ / २७.२७', yoga: 'वैधृति', yogaEnd: '१६.५९', karana: 'कौलव', karanaEnd: '२१.४७', rashi: 'मिथुन' },
    { date: '३१ शनि', tithi: 'शु. १३ / शु. १४', tithiEnd: '०८.२६ / २९.५३', nakshatra: 'पुनर्वसु', nakshatraEnd: '२५.३४', yoga: 'विष्कंभ', yogaEnd: '१३.३३', karana: 'गरज', karanaEnd: '१९.०८', rashi: '२०.०१ नं. कर्क' },
  ];

  // February 2026 Panchang Data from image
  const feb2026Data: PanchangRow[] = [
    { date: '१ रवि', tithi: 'पौर्णिमा', tithiEnd: '२७.३९', nakshatra: 'पुष्य', nakshatraEnd: '२३.५८', yoga: 'प्रीति', yogaEnd: '१०.१९', karana: 'विष्टि', karanaEnd: '१६.४३', rashi: 'कर्क', isRed: true },
    { date: '२ सोम', tithi: 'कृ. १', tithiEnd: '२५.५३', nakshatra: 'आश्लेषा', nakshatraEnd: '२२.४८', yoga: 'आयुष्मान् / सौभाग्य', yogaEnd: '०७.२१ / २८.४६', karana: 'बालव', karanaEnd: '१४.४२', rashi: '२२.४८ नं. सिंह' },
    { date: '३ मंगळ', tithi: 'कृ. २', tithiEnd: '२४.४१', nakshatra: 'मघा', nakshatraEnd: '२२.१९', yoga: 'शोभन', yogaEnd: '२६.३९', karana: 'तैतिल', karanaEnd: '१३.१२', rashi: 'सिंह' },
    { date: '४ बुध', tithi: 'कृ. ३', tithiEnd: '२४.१०', nakshatra: 'पूर्वा', nakshatraEnd: '२२.१३', yoga: 'अतिगंड', yogaEnd: '२५.०५', karana: 'वणिज', karanaEnd: '१२.२०', rashi: '२८.२० नं. कन्या' },
    { date: '५ गुरु', tithi: 'कृ. ४', tithiEnd: '२४.२३', nakshatra: 'उत्तरा', nakshatraEnd: '२२.५७', yoga: 'सुकर्मा', yogaEnd: '२४.०४', karana: 'बव', karanaEnd: '१२.११', rashi: 'कन्या', isRed: true },
    { date: '६ शुक्र', tithi: 'कृ. ५', tithiEnd: '२५.१९', nakshatra: 'हस्त', nakshatraEnd: '२४.२४', yoga: 'धृति', yogaEnd: '२३.३७', karana: 'कौलव', karanaEnd: '१२.४६', rashi: 'कन्या' },
    { date: '७ शनि', tithi: 'कृ. ६', tithiEnd: '२६.५५', nakshatra: 'चित्रा', nakshatraEnd: '२६.२९', yoga: 'शूल', yogaEnd: '२३.४१', karana: 'गरज', karanaEnd: '१४.०२', rashi: '१३.२२ नं. तुला' },
    { date: '८ रवि', tithi: 'कृ. ७', tithiEnd: '२९.०२', nakshatra: 'स्वाती', nakshatraEnd: '२९.०३', yoga: 'गंड', yogaEnd: '२४.०८', karana: 'विष्टि', karanaEnd: '१५.५५', rashi: 'तुला', isRed: true },
    { date: '९ सोम', tithi: 'कृ. ८', tithiEnd: 'अहोरात्र', nakshatra: 'विशाखा', nakshatraEnd: 'अहोरात्र', yoga: 'वृद्धि', yogaEnd: '२४.५२', karana: 'बालव', karanaEnd: '१८.१३', rashi: '२५.११ नं. वृश्चिक' },
    { date: '१० मंगळ', tithi: 'कृ. ८', tithiEnd: '०७.२८', nakshatra: 'विशाखा', nakshatraEnd: '०७.५५', yoga: 'ध्रुव', yogaEnd: '२५.४२', karana: 'तैतिल', karanaEnd: '२०.४४', rashi: 'वृश्चिक' },
    { date: '११ बुध', tithi: 'कृ. ९', tithiEnd: '०९.५९', nakshatra: 'अनुराधा', nakshatraEnd: '१०.५३', yoga: 'व्याघात', yogaEnd: '२६.३०', karana: 'वणिज', karanaEnd: '२३.१३', rashi: 'वृश्चिक' },
    { date: '१२ गुरु', tithi: 'कृ. १०', tithiEnd: '१२.२३', nakshatra: 'ज्येष्ठा', nakshatraEnd: '१३.४२', yoga: 'हर्षण', yogaEnd: '२७.०६', karana: 'बव', karanaEnd: '२५.२८', rashi: '१३.४२ नं. धनु' },
    { date: '१३ शुक्र', tithi: 'कृ. ११', tithiEnd: '१४.२६', nakshatra: 'मूळ', nakshatraEnd: '१६.१३', yoga: 'वज्र', yogaEnd: '२७.२३', karana: 'कौलव', karanaEnd: '२७.१८', rashi: 'धनु' },
    { date: '१४ शनि', tithi: 'कृ. १२', tithiEnd: '१६.०२', nakshatra: 'पू.षा.', nakshatraEnd: '१८.१६', yoga: 'सिद्धि', yogaEnd: '२७.१८', karana: 'गरज', karanaEnd: '२८.३८', rashi: '२४.४२ नं. मकर' },
    { date: '१५ रवि', tithi: 'कृ. १३', tithiEnd: '१७.०५', nakshatra: 'उ.षा.', nakshatraEnd: '१९.४८', yoga: 'व्यतीपात', yogaEnd: '२६.४७', karana: 'विष्टि', karanaEnd: '२९.२४', rashi: 'मकर', isRed: true },
    { date: '१६ सोम', tithi: 'कृ. १४', tithiEnd: '१७.३५', nakshatra: 'श्रवण', nakshatraEnd: '२०.४८', yoga: 'वरीयान', yogaEnd: '२५.५०', karana: 'चतुष्पाद', karanaEnd: '२९.३७', rashi: 'मकर' },
    { date: '१७ मंगळ', tithi: 'अमावास्या', tithiEnd: '१७.३१', nakshatra: 'धनिष्ठा', nakshatraEnd: '२१.१६', yoga: 'परिघ', yogaEnd: '२४.२९', karana: 'किंस्तुघ्न', karanaEnd: '२९.१८', rashi: '०९.०६ नं. कुंभ', isRed: true },
    { date: '१८ बुध', tithi: 'शु. १', tithiEnd: '१६.५८', nakshatra: 'शततारा', nakshatraEnd: '२१.१६', yoga: 'शिव', yogaEnd: '२२.४५', karana: 'बालव', karanaEnd: '२८.३२', rashi: 'कुंभ' },
    { date: '१९ गुरु', tithi: 'शु. २', tithiEnd: '१५.५९', nakshatra: 'पू. भा.', nakshatraEnd: '२०.५२', yoga: 'सिद्ध', yogaEnd: '२०.४२', karana: 'तैतिल', karanaEnd: '२७.२२', rashi: '१५.०० नं. मीन' },
    { date: '२० शुक्र', tithi: 'शु. ३', tithiEnd: '१४.३९', nakshatra: 'उ. भा.', nakshatraEnd: '२०.०८', yoga: 'साध्य', yogaEnd: '१८.२३', karana: 'वणिज', karanaEnd: '२५.५२', rashi: 'मीन' },
    { date: '२१ शनि', tithi: 'शु. ४', tithiEnd: '१३.०१', nakshatra: 'रेवती', nakshatraEnd: '१९.०७', yoga: 'शुभ', yogaEnd: '१५.५१', karana: 'बव', karanaEnd: '२४.०७', rashi: '१९.०७ नं. मेष' },
    { date: '२२ रवि', tithi: 'शु. ५', tithiEnd: '११.१०', nakshatra: 'अश्विनी', nakshatraEnd: '१७.५५', yoga: 'शुक्ल', yogaEnd: '१३.०९', karana: 'कौलव', karanaEnd: '२२.११', rashi: 'मेष', isRed: true },
    { date: '२३ सोम', tithi: 'शु. ६ / शु. ७', tithiEnd: '०९.१० / ३१.०३', nakshatra: 'भरणी', nakshatraEnd: '१६.३४', yoga: 'ब्रह्मा', yogaEnd: '१०.१९', karana: 'गरज', karanaEnd: '२०.०७', rashi: '२२.१२ नं. वृषभ' },
    { date: '२४ मंगळ', tithi: 'शु. ८', tithiEnd: '२८.५२', nakshatra: 'कृत्तिका', nakshatraEnd: '१५.०७', yoga: 'ऐंद्र / वैधृति', yogaEnd: '०७.२४ / २८.२६', karana: 'विष्टि', karanaEnd: '१७.५८', rashi: 'वृषभ' },
    { date: '२५ बुध', tithi: 'शु. ९', tithiEnd: '२६.४१', nakshatra: 'रोहिणी', nakshatraEnd: '१३.३९', yoga: 'विष्कंभ', yogaEnd: '२५.२९', karana: 'बालव', karanaEnd: '१५.४७', rashi: '२४.५५ नं. मिथुन' },
    { date: '२६ गुरु', tithi: 'शु. १०', tithiEnd: '२४.३४', nakshatra: 'मृग', nakshatraEnd: '१२.१२', yoga: 'प्रीति', yogaEnd: '२२.३३', karana: 'तैतिल', karanaEnd: '१३.३७', rashi: 'मिथुन' },
    { date: '२७ शुक्र', tithi: 'शु. ११', tithiEnd: '२२.३३', nakshatra: 'आर्द्रा', nakshatraEnd: '१०.४९', yoga: 'आयुष्मान्', yogaEnd: '१९.४४', karana: 'वणिज', karanaEnd: '११.३३', rashi: '२७.५३ नं. कर्क' },
    { date: '२८ शनि', tithi: 'शु. १२', tithiEnd: '२०.४४', nakshatra: 'पुनर्वसु', nakshatraEnd: '०९.३५', yoga: 'सौभाग्य', yogaEnd: '१७.०२', karana: 'बव', karanaEnd: '०९.३७', rashi: 'कर्क' },
  ];

  // March 2026 Panchang Data from image
  const mar2026Data: PanchangRow[] = [
    { date: '१ रवि', tithi: 'शु. १३', tithiEnd: '१९.१०', nakshatra: 'पुष्य', nakshatraEnd: '०८.३४', yoga: 'शोभन', yogaEnd: '१४.३३', karana: 'कौलव / गरज', karanaEnd: '०७.५४ / ३०.३०', rashi: 'कर्क', isRed: true },
    { date: '२ सोम', tithi: 'शु. १४', tithiEnd: '१७.५६', nakshatra: 'आश्लेषा', nakshatraEnd: '०७.५२', yoga: 'अतिगंड', yogaEnd: '१२.१९', karana: 'विष्टि', karanaEnd: '२९.२९', rashi: '०७.५२ नं. सिंह', isRed: true },
    { date: '३ मंगळ', tithi: 'पौर्णिमा', tithiEnd: '१७.०८', nakshatra: 'मघा', nakshatraEnd: '०७.३२', yoga: 'सुकर्मा', yogaEnd: '१०.२५', karana: 'बालव', karanaEnd: '२८.५५', rashi: 'सिंह', isRed: true },
    { date: '४ बुध', tithi: 'कृ. १', tithiEnd: '१६.४९', nakshatra: 'पूर्वा', nakshatraEnd: '०७.३९', yoga: 'धृति', yogaEnd: '०८.५२', karana: 'तैतिल', karanaEnd: '२८.५३', rashi: '१३.४६ नं. कन्या' },
    { date: '५ गुरु', tithi: 'कृ. २', tithiEnd: '१७.०४', nakshatra: 'उत्तरा', nakshatraEnd: '०८.१८', yoga: 'शूल', yogaEnd: '०७.४६', karana: 'वणिज', karanaEnd: '२९.२५', rashi: 'कन्या' },
    { date: '६ शुक्र', tithi: 'कृ. ३', tithiEnd: '१७.५४', nakshatra: 'हस्त', nakshatraEnd: '०९.३०', yoga: 'गंड / वृद्धि', yogaEnd: '०७.०६ / ३०.५२', karana: 'बव', karanaEnd: '३०.३२', rashi: '२२.१९ नं. तुला', isRed: true },
    { date: '७ शनि', tithi: 'कृ. ४', tithiEnd: '१९.१८', nakshatra: 'चित्रा', nakshatraEnd: '११.१६', yoga: 'ध्रुव', yogaEnd: 'अहोरात्र', karana: 'कौलव', karanaEnd: 'अहोरात्र', rashi: 'तुला' },
    { date: '८ रवि', tithi: 'कृ. ५', tithiEnd: '२१.१२', nakshatra: 'स्वाती', nakshatraEnd: '१३.३२', yoga: 'ध्रुव', yogaEnd: '०७.०४', karana: 'कौलव', karanaEnd: '०८.११', rashi: 'तुला', isRed: true },
    { date: '९ सोम', tithi: 'कृ. ६', tithiEnd: '२३.२८', nakshatra: 'विशाखा', nakshatraEnd: '१६.१२', yoga: 'व्याघात', yogaEnd: '०७.३६', karana: 'गरज', karanaEnd: '१०.१७', rashi: '०९.३० नं. वृश्चिक' },
    { date: '१० मंगळ', tithi: 'कृ. ७', tithiEnd: '२५.५५', nakshatra: 'अनुराधा', nakshatraEnd: '१९.०५', yoga: 'हर्षण', yogaEnd: '०८.२१', karana: 'विष्टि', karanaEnd: '१२.४१', rashi: 'वृश्चिक' },
    { date: '११ बुध', tithi: 'कृ. ८', tithiEnd: '२८.२०', nakshatra: 'ज्येष्ठा', nakshatraEnd: '२२.००', yoga: 'वज्र', yogaEnd: '०९.१२', karana: 'बालव', karanaEnd: '१५.०९', rashi: '२२.०० नं. धनु' },
    { date: '१२ गुरु', tithi: 'कृ. ९', tithiEnd: '३०.३०', nakshatra: 'मूळ', nakshatraEnd: '२४.४४', yoga: 'सिद्धि', yogaEnd: '०९.५९', karana: 'तैतिल', karanaEnd: '१७.२८', rashi: 'धनु' },
    { date: '१३ शुक्र', tithi: 'कृ. १०', tithiEnd: 'अहोरात्र', nakshatra: 'पू.षा.', nakshatraEnd: '२७.०३', yoga: 'व्यतीपात', yogaEnd: '१०.३२', karana: 'वणिज', karanaEnd: '१९.२५', rashi: 'धनु' },
    { date: '१४ शनि', tithi: 'कृ. १०', tithiEnd: '०८.११', nakshatra: 'उ.षा.', nakshatraEnd: '२८.४९', yoga: 'वरीयान', yogaEnd: '१०.४३', karana: 'बव', karanaEnd: '२०.४९', rashi: '०९.३३ नं. मकर' },
    { date: '१५ रवि', tithi: 'कृ. ११', tithiEnd: '०९.१७', nakshatra: 'श्रवण', nakshatraEnd: '२९.५६', yoga: 'परिघ', yogaEnd: '१०.२५', karana: 'कौलव', karanaEnd: '२१.३५', rashi: 'मकर', isRed: true },
    { date: '१६ सोम', tithi: 'कृ. १२', tithiEnd: '०९.४१', nakshatra: 'धनिष्ठा', nakshatraEnd: '३०.२२', yoga: 'शिव', yogaEnd: '०९.३७', karana: 'गरज', karanaEnd: '२१.३८', rashi: '१८.१४ नं. कुंभ' },
    { date: '१७ मंगळ', tithi: 'कृ. १३', tithiEnd: '०९.२४', nakshatra: 'शततारा', nakshatraEnd: '३०.०९', yoga: 'सिद्ध / साध्य', yogaEnd: '०८.१५ / ३०.२२', karana: 'विष्टि', karanaEnd: '२०.५१', rashi: 'कुंभ' },
    { date: '१८ बुध', tithi: 'कृ. १४', tithiEnd: '०८.२६', nakshatra: 'पू.भा.', nakshatraEnd: '२९.२१', yoga: 'शुभ', yogaEnd: '२८.०१', karana: 'चतुष्पाद', karanaEnd: '१९.४४', rashi: '२३.३६ नं. मीन' },
    { date: '१९ गुरु', tithi: 'अमावास्या / शु. १', tithiEnd: '०६.५४ / २८.५३', nakshatra: 'उ.भा.', nakshatraEnd: '२८.०५', yoga: 'शुक्ल', yogaEnd: '२५.१७', karana: 'किंस्तुघ्न', karanaEnd: '१७.५६', rashi: 'मीन', isRed: true },
    { date: '२० शुक्र', tithi: 'शु. २', tithiEnd: '२६.३१', nakshatra: 'रेवती', nakshatraEnd: '२६.२८', yoga: 'ब्रह्मा', yogaEnd: '२२.१५', karana: 'बालव', karanaEnd: '१५.४४', rashi: '२६.२८ नं. मेष' },
    { date: '२१ शनि', tithi: 'शु. ३', tithiEnd: '२३.५७', nakshatra: 'अश्विनी', nakshatraEnd: '२४.३८', yoga: 'ऐंद्र', yogaEnd: '१९.०१', karana: 'तैतिल', karanaEnd: '१३.१५', rashi: 'मेष' },
    { date: '२२ रवि', tithi: 'शु. ४', tithiEnd: '२१.१७', nakshatra: 'भरणी', nakshatraEnd: '२२.४३', yoga: 'वैधृति', yogaEnd: '१५.४२', karana: 'वणिज', karanaEnd: '१०.३७', rashi: '२८.१४ नं. वृषभ', isRed: true },
    { date: '२३ सोम', tithi: 'शु. ५', tithiEnd: '१८.३९', nakshatra: 'कृत्तिका', nakshatraEnd: '२०.५०', yoga: 'विष्कंभ', yogaEnd: '१२.२२', karana: 'बव / कौलव', karanaEnd: '०७.५७ / २९.२२', rashi: 'वृषभ' },
    { date: '२४ मंगळ', tithi: 'शु. ६', tithiEnd: '१६.०८', nakshatra: 'रोहिणी', nakshatraEnd: '१९.०५', yoga: 'प्रीति / आयुष्मान्', yogaEnd: '०९.०७ / ३०.०२', karana: 'गरज', karanaEnd: '२६.५८', rashi: '३०.१७ नं. मिथुन' },
    { date: '२५ बुध', tithi: 'शु. ७', tithiEnd: '१३.५१', nakshatra: 'मृग', nakshatraEnd: '१७.३४', yoga: 'सौभाग्य', yogaEnd: '२७.०९', karana: 'विष्टि', karanaEnd: '२४.४८', rashi: 'मिथुन' },
    { date: '२६ गुरु', tithi: 'शु. ८', tithiEnd: '११.४९', nakshatra: 'आर्द्रा', nakshatraEnd: '१६.१९', yoga: 'शोभन', yogaEnd: '२४.३२', karana: 'बालव', karanaEnd: '२२.५६', rashi: 'मिथुन', isRed: true },
    { date: '२७ शुक्र', tithi: 'शु. ९', tithiEnd: '१०.०७', nakshatra: 'पुनर्वसु', nakshatraEnd: '१५.२४', yoga: 'अतिगंड', yogaEnd: '२२.१०', karana: 'तैतिल', karanaEnd: '२१.२४', rashi: '०९.३६ नं. कर्क' },
    { date: '२८ शनि', tithi: 'शु. १०', tithiEnd: '०८.४६', nakshatra: 'पुष्य', nakshatraEnd: '१४.५०', yoga: 'सुकर्मा', yogaEnd: '२०.०६', karana: 'वणिज', karanaEnd: '२०.१४', rashi: 'कर्क' },
    { date: '२९ रवि', tithi: 'शु. ११', tithiEnd: '०७.४७', nakshatra: 'आश्लेषा', nakshatraEnd: '१४.३८', yoga: 'धृति', yogaEnd: '१८.२०', karana: 'बव', karanaEnd: '१९.२६', rashi: '१४.३८ नं. सिंह', isRed: true },
    { date: '३० सोम', tithi: 'शु. १२', tithiEnd: '०७.१०', nakshatra: 'मघा', nakshatraEnd: '१४.४८', yoga: 'शूल', yogaEnd: '१६.५१', karana: 'कौलव', karanaEnd: '१९.००', rashi: 'सिंह' },
    { date: '३१ मंगळ', tithi: 'शु. १३', tithiEnd: '०६.५६', nakshatra: 'पूर्वा', nakshatraEnd: '१५.२१', yoga: 'गंड', yogaEnd: '१५.४१', karana: 'गरज', karanaEnd: '१८.५९', rashi: '२१.३३ नं. कन्या' },
  ];

  // April 2026 Panchang Data from image
  const apr2026Data: PanchangRow[] = [
    { date: '१ बुध', tithi: 'शु. १४', tithiEnd: '०७.०७', nakshatra: 'उत्तरा', nakshatraEnd: '१६.१८', yoga: 'वृद्धि', yogaEnd: '१४.५१', karana: 'विष्टि', karanaEnd: '१९.२१', rashi: 'कन्या' },
    { date: '२ गुरु', tithi: 'पौर्णिमा', tithiEnd: '०७.४२', nakshatra: 'हस्त', nakshatraEnd: '१७.३९', yoga: 'ध्रुव', yogaEnd: '१४.२०', karana: 'बालव', karanaEnd: '२०.०९', rashi: '३०.२९ नं. तुला', isRed: true },
    { date: '३ शुक्र', tithi: 'कृ. १', tithiEnd: '०८.४३', nakshatra: 'चित्रा', nakshatraEnd: '१९.२५', yoga: 'व्याघात', yogaEnd: '१४.०९', karana: 'तैतिल', karanaEnd: '२१.२३', rashi: 'तुला' },
    { date: '४ शनि', tithi: 'कृ. २', tithiEnd: '१०.१०', nakshatra: 'स्वाती', nakshatraEnd: '२१.३६', yoga: 'हर्षण', yogaEnd: '१४.१७', karana: 'वणिज', karanaEnd: '२३.०२', rashi: 'तुला' },
    { date: '५ रवि', tithi: 'कृ. ३', tithiEnd: '१२.००', nakshatra: 'विशाखा', nakshatraEnd: '२४.०८', yoga: 'वज्र', yogaEnd: '१४.४४', karana: 'बव', karanaEnd: '२५.०४', rashi: '१७.२८ नं. वृश्चिक', isRed: true },
    { date: '६ सोम', tithi: 'कृ. ४', tithiEnd: '१४.११', nakshatra: 'अनुराधा', nakshatraEnd: '२६.५७', yoga: 'सिद्धि', yogaEnd: '१५.२५', karana: 'कौलव', karanaEnd: '२७.२२', rashi: 'वृश्चिक' },
    { date: '७ मंगळ', tithi: 'कृ. ५', tithiEnd: '१६.३५', nakshatra: 'ज्येष्ठा', nakshatraEnd: '२९.५४', yoga: 'व्यतीपात', yogaEnd: '१६.१६', karana: 'गरज', karanaEnd: '२९.४९', rashi: '२९.५४ नं. धनु' },
    { date: '८ बुध', tithi: 'कृ. ६', tithiEnd: '१९.०२', nakshatra: 'मूळ', nakshatraEnd: 'अहोरात्र', yoga: 'वरीयान', yogaEnd: '१७.१०', karana: 'विष्टि', karanaEnd: 'अहोरात्र', rashi: 'धनु' },
    { date: '९ गुरु', tithi: 'कृ. ७', tithiEnd: '२१.२०', nakshatra: 'मूळ', nakshatraEnd: '०८.४९', yoga: 'परिघ', yogaEnd: '१७.५८', karana: 'विष्टि', karanaEnd: '०८.१३', rashi: 'धनु' },
    { date: '१० शुक्र', tithi: 'कृ. ८', tithiEnd: '२३.१६', nakshatra: 'पू.षा.', nakshatraEnd: '११.२८', yoga: 'शिव', yogaEnd: '१८.३१', karana: 'बालव', karanaEnd: '१०.२२', rashi: '१८.०४ नं. मकर' },
    { date: '११ शनि', tithi: 'कृ. ९', tithiEnd: '२४.३८', nakshatra: 'उ.षा.', nakshatraEnd: '१३.४०', yoga: 'सिद्ध', yogaEnd: '१८.३९', karana: 'तैतिल', karanaEnd: '१२.०२', rashi: 'मकर' },
    { date: '१२ रवि', tithi: 'कृ. १०', tithiEnd: '२५.१७', nakshatra: 'श्रवण', nakshatraEnd: '१५.१४', yoga: 'साध्य', yogaEnd: '१८.१६', karana: 'वणिज', karanaEnd: '१३.०४', rashi: '२७.४५ नं. कुंभ', isRed: true },
    { date: '१३ सोम', tithi: 'कृ. ११', tithiEnd: '२५.०९', nakshatra: 'धनिष्ठा', nakshatraEnd: '१६.०४', yoga: 'शुभ', yogaEnd: '१७.१७', karana: 'बव', karanaEnd: '१३.१९', rashi: 'कुंभ' },
    { date: '१४ मंगळ', tithi: 'कृ. १२', tithiEnd: '२४.१३', nakshatra: 'शततारा', nakshatraEnd: '१६.०६', yoga: 'शुक्ल', yogaEnd: '१५.३९', karana: 'कौलव', karanaEnd: '१२.४७', rashi: 'कुंभ' },
    { date: '१५ बुध', tithi: 'कृ. १३', tithiEnd: '२२.३२', nakshatra: 'पू.भा.', nakshatraEnd: '१५.२३', yoga: 'ब्रह्मा', yogaEnd: '१३.२५', karana: 'गरज', karanaEnd: '११.२८', rashi: '०९.३८ नं. मीन' },
    { date: '१६ गुरु', tithi: 'कृ. १४', tithiEnd: '२०.१२', nakshatra: 'उ.भा.', nakshatraEnd: '१३.५९', yoga: 'ऐंद्र', yogaEnd: '१०.३७', karana: 'विष्टि', karanaEnd: '०९.२६', rashi: 'मीन' },
    { date: '१७ शुक्र', tithi: 'अमावास्या', tithiEnd: '१७.२२', nakshatra: 'रेवती', nakshatraEnd: '१२.०२', yoga: 'वैधृति / विष्कंभ', yogaEnd: '०७.२२ / २७.४५', karana: 'चतुष्पाद / किंस्तुघ्न', karanaEnd: '०६.५० / २७.४८', rashi: '१२.०२ नं. मेष', isRed: true },
    { date: '१८ शनि', tithi: 'शु. १', tithiEnd: '१४.११', nakshatra: 'अश्विनी', nakshatraEnd: '०९.४३', yoga: 'प्रीति', yogaEnd: '२३.५६', karana: 'बालव', karanaEnd: '२४.३१', rashi: 'मेष' },
    { date: '१९ रवि', tithi: 'शु. २', tithiEnd: '१०.५०', nakshatra: 'भरणी / कृत्तिका', nakshatraEnd: '०७.१० / २८.३५', yoga: 'आयुष्मान्', yogaEnd: '२०.०२', karana: 'तैतिल', karanaEnd: '२१.०८', rashi: '१२.३१ नं. वृषभ', isRed: true },
    { date: '२० सोम', tithi: 'शु. ३ / शु. ४', tithiEnd: '०७.२८ / २८.१५', nakshatra: 'रोहिणी', nakshatraEnd: '२६.०८', yoga: 'सौभाग्य', yogaEnd: '१६.११', karana: 'वणिज', karanaEnd: '१७.५०', rashi: 'वृषभ' },
    { date: '२१ मंगळ', tithi: 'शु. ५', tithiEnd: '२५.२०', nakshatra: 'मृग', nakshatraEnd: '२३.४९', yoga: 'शोभन', yogaEnd: '१२.३१', karana: 'बव', karanaEnd: '१४.४५', rashi: '१३.०१ नं. मिथुन' },
    { date: '२२ बुध', tithi: 'शु. ६', tithiEnd: '२२.५०', nakshatra: 'आर्द्रा', nakshatraEnd: '२२.१३', yoga: 'अतिगंड / सुकर्मा', yogaEnd: '०९.०८ / ३०.०८', karana: 'कौलव', karanaEnd: '१२.०२', rashi: 'मिथुन' },
    { date: '२३ गुरु', tithi: 'शु. ७', tithiEnd: '२०.५०', nakshatra: 'पुनर्वसु', nakshatraEnd: '२०.५७', yoga: 'धृति', yogaEnd: '२७.३२', karana: 'गरज', karanaEnd: '०९.४६', rashi: '१५.१३ नं. कर्क' },
    { date: '२४ शुक्र', tithi: 'शु. ८', tithiEnd: '१९.२२', nakshatra: 'पुष्य', nakshatraEnd: '२०.१५', yoga: 'शूल', yogaEnd: '२५.२४', karana: 'विष्टि', karanaEnd: '०८.०२', rashi: 'कर्क' },
    { date: '२५ शनि', tithi: 'शु. ९', tithiEnd: '१८.२९', nakshatra: 'आश्लेषा', nakshatraEnd: '२०.०५', yoga: 'गंड', yogaEnd: '२३.४३', karana: 'बालव / तैतिल', karanaEnd: '०६.५१ / ३०.१४', rashi: '२०.०५ नं. सिंह' },
    { date: '२६ रवि', tithi: 'शु. १०', tithiEnd: '१८.०७', nakshatra: 'मघा', nakshatraEnd: '२०.२७', yoga: 'वृद्धि', yogaEnd: '२२.२८', karana: 'वणिज', karanaEnd: '३०.०८', rashi: 'सिंह', isRed: true },
    { date: '२७ सोम', tithi: 'शु. ११', tithiEnd: '१८.१६', nakshatra: 'पूर्वा', nakshatraEnd: '२१.१९', yoga: 'ध्रुव', yogaEnd: '२१.३६', karana: 'बव', karanaEnd: 'अहोरात्र', rashi: '२७.३६ नं. कन्या' },
    { date: '२८ मंगळ', tithi: 'शु. १२', tithiEnd: '१८.५२', nakshatra: 'उत्तरा', nakshatraEnd: '२२.३६', yoga: 'व्याघात', yogaEnd: '२१.०४', karana: 'बव', karanaEnd: '०६.३१', rashi: 'कन्या' },
    { date: '२९ बुध', tithi: 'शु. १३', tithiEnd: '१९.५२', nakshatra: 'हस्त', nakshatraEnd: '२४.१७', yoga: 'हर्षण', yogaEnd: '२०.५१', karana: 'कौलव', karanaEnd: '०७.१९', rashi: 'कन्या' },
    { date: '३० गुरु', tithi: 'शु. १४', tithiEnd: '२१.१३', nakshatra: 'चित्रा', nakshatraEnd: '२६.१७', yoga: 'वज्र', yogaEnd: '२०.५५', karana: 'गरज', karanaEnd: '०८.३०', rashi: '१३.१४ नं. तुला' },
  ];

  // May 2026 Panchang Data from image
  const may2026Data: PanchangRow[] = [
    { date: '१ शुक्र', tithi: 'पौर्णिमा', tithiEnd: '२२.५३', nakshatra: 'स्वाती', nakshatraEnd: '२८.३५', yoga: 'सिद्धि', yogaEnd: '२१.१३', karana: 'विष्टि', karanaEnd: '१०.०१', rashi: 'तुला' },
    { date: '२ शनि', tithi: 'कृ. १', tithiEnd: '२४.५०', nakshatra: 'विशाखा', nakshatraEnd: 'अहोरात्र', yoga: 'व्यतीपात', yogaEnd: '२१.४५', karana: 'बालव', karanaEnd: '११.५०', rashi: '२४.३० नं. वृश्चिक' },
    { date: '३ रवि', tithi: 'कृ. २', tithiEnd: '२७.०२', nakshatra: 'विशाखा', nakshatraEnd: '०७.१०', yoga: 'वरीयान', yogaEnd: '२२.२८', karana: 'तैतिल', karanaEnd: '१३.५५', rashi: 'वृश्चिक', isRed: true },
    { date: '४ सोम', tithi: 'कृ. ३', tithiEnd: '२९.२५', nakshatra: 'अनुराधा', nakshatraEnd: '०९.५८', yoga: 'परिघ', yogaEnd: '२३.२०', karana: 'वणिज', karanaEnd: '१६.१३', rashi: 'वृश्चिक' },
    { date: '५ मंगळ', tithi: 'कृ. ४', tithiEnd: 'अहोरात्र', nakshatra: 'ज्येष्ठा', nakshatraEnd: '१२.५५', yoga: 'शिव', yogaEnd: '२४.१६', karana: 'बव', karanaEnd: '१८.३८', rashi: '१२.५५ नं. धनु', isRed: true },
    { date: '६ बुध', tithi: 'कृ. ४', tithiEnd: '०७.५२', nakshatra: 'मूळ', nakshatraEnd: '१५.५४', yoga: 'सिद्ध', yogaEnd: '२५.१२', karana: 'कौलव', karanaEnd: '२१.०४', rashi: 'धनु' },
    { date: '७ गुरु', tithi: 'कृ. ५', tithiEnd: '१०.१४', nakshatra: 'पू.षा.', nakshatraEnd: '१८.४६', yoga: 'साध्य', yogaEnd: '२५.५९', karana: 'गरज', karanaEnd: '२३.२१', rashi: '२५.२७ नं. मकर' },
    { date: '८ शुक्र', tithi: 'कृ. ६', tithiEnd: '१२.२२', nakshatra: 'उ.षा.', nakshatraEnd: '२१.२०', yoga: 'शुभ', yogaEnd: '२६.३०', karana: 'विष्टि', karanaEnd: '२५.१७', rashi: 'मकर' },
    { date: '९ शनि', tithi: 'कृ. ७', tithiEnd: '१४.०३', nakshatra: 'श्रवण', nakshatraEnd: '२३.२५', yoga: 'शुक्ल', yogaEnd: '२६.३६', karana: 'बालव', karanaEnd: '२६.४०', rashi: 'मकर' },
    { date: '१० रवि', tithi: 'कृ. ८', tithiEnd: '१५.०७', nakshatra: 'धनिष्ठा', nakshatraEnd: '२४.५०', yoga: 'ब्रह्मा', yogaEnd: '२६.०९', karana: 'तैतिल', karanaEnd: '२७.२२', rashi: '१२.१३ नं. कुंभ', isRed: true },
    { date: '११ सोम', tithi: 'कृ. ९', tithiEnd: '१५.२५', nakshatra: 'शततारा', nakshatraEnd: '२५.२९', yoga: 'ऐंद्र', yogaEnd: '२५.०४', karana: 'वणिज', karanaEnd: '२७.१५', rashi: 'कुंभ' },
    { date: '१२ मंगळ', tithi: 'कृ. १०', tithiEnd: '१४.५३', nakshatra: 'पू.भा.', nakshatraEnd: '२५.१८', yoga: 'वैधृति', yogaEnd: '२३.१९', karana: 'बव', karanaEnd: '२६.१८', rashi: '१९.२५ नं. मीन' },
    { date: '१३ बुध', tithi: 'कृ. ११', tithiEnd: '१३.३०', nakshatra: 'उ.भा.', nakshatraEnd: '२४.१८', yoga: 'विष्कंभ', yogaEnd: '२०.५५', karana: 'कौलव', karanaEnd: '२४.३१', rashi: 'मीन' },
    { date: '१४ गुरु', tithi: 'कृ. १२', tithiEnd: '११.२१', nakshatra: 'रेवती', nakshatraEnd: '२२.३४', yoga: 'प्रीति', yogaEnd: '१७.५३', karana: 'गरज', karanaEnd: '२२.०१', rashi: '२२.३४ नं. मेष' },
    { date: '१५ शुक्र', tithi: 'कृ. १३ / कृ. १४', tithiEnd: '०८.३२ / २९.१२', nakshatra: 'अश्विनी', nakshatraEnd: '२०.१५', yoga: 'आयुष्मान', yogaEnd: '१४.२१', karana: 'विष्टि', karanaEnd: '१८.५५', rashi: 'मेष' },
    { date: '१६ शनि', tithi: 'अमावास्या', tithiEnd: '२५.३१', nakshatra: 'भरणी', nakshatraEnd: '१७.३०', yoga: 'सौभाग्य', yogaEnd: '१०.२६', karana: 'चतुष्पाद', karanaEnd: '१५.२३', rashi: '२२.४७ नं. वृषभ', isRed: true },
    { date: '१७ रवि', tithi: 'शु. १', tithiEnd: '२१.४१', nakshatra: 'कृत्तिका', nakshatraEnd: '१४.३२', yoga: 'शोभन / अतिगंड', yogaEnd: '०६.१५ / २६.००', karana: 'किंस्तुघ्न', karanaEnd: '११.३७', rashi: 'वृषभ', isRed: true },
    { date: '१८ सोम', tithi: 'शु. २', tithiEnd: '१७.५४', nakshatra: 'रोहिणी', nakshatraEnd: '११.३२', yoga: 'सुकर्मा', yogaEnd: '२१.४८', karana: 'बालव / तैतिल', karanaEnd: '०७.४६ / २८.०४', rashi: '२२.०५ नं. मिथुन' },
    { date: '१९ मंगळ', tithi: 'शु. ३', tithiEnd: '१४.१९', nakshatra: 'मृग', nakshatraEnd: '०८.४२', yoga: 'धृति', yogaEnd: '१७.४९', karana: 'वणिज', karanaEnd: '२४.४०', rashi: 'मिथुन' },
    { date: '२० बुध', tithi: 'शु. ४', tithiEnd: '११.०७', nakshatra: 'आर्द्रा / पुनर्वसु', nakshatraEnd: '०६.१२ / २८.१२', yoga: 'शूल', yogaEnd: '१४.१०', karana: 'बव', karanaEnd: '२१.४३', rashi: '२२.३९ नं. कर्क' },
    { date: '२१ गुरु', tithi: 'शु. ५', tithiEnd: '०८.२७', nakshatra: 'पुष्य', nakshatraEnd: '२६.५०', yoga: 'गंड', yogaEnd: '१०.५९', karana: 'कौलव', karanaEnd: '१९.२१', rashi: 'कर्क' },
    { date: '२२ शुक्र', tithi: 'शु. ६ / शु. ७', tithiEnd: '०६.२५ / २९.०५', nakshatra: 'आश्लेषा', nakshatraEnd: '२६.०८', yoga: 'वृद्धि', yogaEnd: '०८.१९', karana: 'गरज', karanaEnd: '१७.४०', rashi: '२६.०८ नं. सिंह' },
    { date: '२३ शनि', tithi: 'शु. ८', tithiEnd: '२८.२८', nakshatra: 'मघा', nakshatraEnd: '२६.०९', yoga: 'ध्रुव / व्याघात', yogaEnd: '०६.१४ / २८.४३', karana: 'विष्टि', karanaEnd: '१६.४१', rashi: 'सिंह' },
    { date: '२४ रवि', tithi: 'शु. ९', tithiEnd: '२८.३१', nakshatra: 'पूर्वा', nakshatraEnd: '२६.५१', yoga: 'हर्षण', yogaEnd: '२७.४५', karana: 'बालव', karanaEnd: '१६.२५', rashi: 'सिंह', isRed: true },
    { date: '२५ सोम', tithi: 'शु. १०', tithiEnd: '२९.११', nakshatra: 'उत्तरा', nakshatraEnd: '२८.०९', yoga: 'वज्र', yogaEnd: '२७.१५', karana: 'तैतिल', karanaEnd: '१६.४७', rashi: '०९.०७ नं. कन्या' },
    { date: '२६ मंगळ', tithi: 'शु. ११', tithiEnd: 'अहोरात्र', nakshatra: 'हस्त', nakshatraEnd: '२९.५७', yoga: 'सिद्धि', yogaEnd: '२७.१०', karana: 'वणिज', karanaEnd: '१७.४३', rashi: 'कन्या' },
    { date: '२७ बुध', tithi: 'शु. ११', tithiEnd: '०६.२२', nakshatra: 'चित्रा', nakshatraEnd: 'अहोरात्र', yoga: 'व्यतीपात', yogaEnd: '२७.२५', karana: 'बव', karanaEnd: '१९.०७', rashi: '१९.०० नं. तुला' },
    { date: '२८ गुरु', tithi: 'शु. १२', tithiEnd: '०७.५७', nakshatra: 'चित्रा', nakshatraEnd: '०८.०९', yoga: 'वरीयान', yogaEnd: '२७.५५', karana: 'कौलव', karanaEnd: '२०.५२', rashi: 'तुला' },
    { date: '२९ शुक्र', tithi: 'शु. १३', tithiEnd: '०९.५१', nakshatra: 'स्वाती', nakshatraEnd: '१०.३८', yoga: 'परिघ', yogaEnd: '२८.३६', karana: 'गरज', karanaEnd: '२२.५३', rashi: 'तुला' },
    { date: '३० शनि', tithi: 'शु. १४', tithiEnd: '११.५८', nakshatra: 'विशाखा', nakshatraEnd: '१३.२१', yoga: 'शिव', yogaEnd: '२९.२५', karana: 'विष्टि', karanaEnd: '२५.०६', rashi: '०६.३९ नं. वृश्चिक' },
    { date: '३१ रवि', tithi: 'पौर्णिमा', tithiEnd: '१४.१५', nakshatra: 'अनुराधा', nakshatraEnd: '१६.१२', yoga: 'सिद्ध', yogaEnd: 'अहोरात्र', karana: 'बालव', karanaEnd: '२७.२६', rashi: 'वृश्चिक', isRed: true },
  ];

  // June 2026 Panchang Data from image
  const jun2026Data: PanchangRow[] = [
    { date: '१ सोम', tithi: 'कृ. १', tithiEnd: '१६.३८', nakshatra: 'ज्येष्ठा', nakshatraEnd: '१९.०९', yoga: 'सिद्ध', yogaEnd: '०६.१९', karana: 'तैतिल', karanaEnd: '२९.५०', rashi: '१९.०९ नं. धनु' },
    { date: '२ मंगळ', tithi: 'कृ. २', tithiEnd: '१९.०२', nakshatra: 'मूळ', nakshatraEnd: '२२.०६', yoga: 'साध्य', yogaEnd: '०७.१६', karana: 'वणिज', karanaEnd: 'अहोरात्र', rashi: 'धनु' },
    { date: '३ बुध', tithi: 'कृ. ३', tithiEnd: '२१.२२', nakshatra: 'पू.षा.', nakshatraEnd: '२५.००', yoga: 'शुभ', yogaEnd: '०८.१२', karana: 'वणिज', karanaEnd: '०८.१३', rashi: 'धनु', isRed: true },
    { date: '४ गुरु', tithi: 'कृ. ४', tithiEnd: '२३.३१', nakshatra: 'उ.षा.', nakshatraEnd: '२७.४२', yoga: 'शुक्ल', yogaEnd: '०९.०३', karana: 'बव', karanaEnd: '१०.२८', rashi: '०७.४२ नं. मकर' },
    { date: '५ शुक्र', tithi: 'कृ. ५', tithiEnd: '२५.२१', nakshatra: 'श्रवण', nakshatraEnd: 'अहोरात्र', yoga: 'ब्रह्मा', yogaEnd: '०९.४३', karana: 'कौलव', karanaEnd: '१२.२९', rashi: 'मकर' },
    { date: '६ शनि', tithi: 'कृ. ६', tithiEnd: '२६.४२', nakshatra: 'श्रवण', nakshatraEnd: '०६.०४', yoga: 'ऐंद्र', yogaEnd: '१०.०५', karana: 'गरज', karanaEnd: '१४.०५', rashi: '१९.०४ नं. कुंभ' },
    { date: '७ रवि', tithi: 'कृ. ७', tithiEnd: '२७.२५', nakshatra: 'धनिष्ठा', nakshatraEnd: '०७.५६', yoga: 'वैधृति', yogaEnd: '१०.०२', karana: 'विष्टि', karanaEnd: '१५.०९', rashi: 'कुंभ', isRed: true },
    { date: '८ सोम', tithi: 'कृ. ८', tithiEnd: '२७.२४', nakshatra: 'शततारा', nakshatraEnd: '०९.१०', yoga: 'विष्कंभ', yogaEnd: '०९.२८', karana: 'बालव', karanaEnd: '१५.३०', rashi: '२७.३७ नं. मीन' },
    { date: '९ मंगळ', tithi: 'कृ. ९', tithiEnd: '२६.३५', nakshatra: 'पू.भा.', nakshatraEnd: '०९.४०', yoga: 'प्रीति', yogaEnd: '०८.१८', karana: 'तैतिल', karanaEnd: '१५.०६', rashi: 'मीन' },
    { date: '१० बुध', tithi: 'कृ. १०', tithiEnd: '२४.५८', nakshatra: 'उ.भा.', nakshatraEnd: '०९.२२', yoga: 'आयुष्मान् / सौभाग्य', yogaEnd: '०६.३० / २८.०३', karana: 'वणिज', karanaEnd: '१३.४३', rashi: 'मीन' },
    { date: '११ गुरु', tithi: 'कृ. ११', tithiEnd: '२२.३७', nakshatra: 'रेवती', nakshatraEnd: '०८.१७', yoga: 'शोभन', yogaEnd: '२५.००', karana: 'बव', karanaEnd: '११.५३', rashi: '०८.१७ नं. मेष' },
    { date: '१२ शुक्र', tithi: 'कृ. १२', tithiEnd: '१९.३७', nakshatra: 'अश्विनी / भरणी', nakshatraEnd: '०६.२९ / २८.०६', yoga: 'अतिगंड', yogaEnd: '२१.२६', karana: 'कौलव / गरज', karanaEnd: '०९.११ / २९.५६', rashi: 'मेष' },
    { date: '१३ शनि', tithi: 'कृ. १३', tithiEnd: '१६.०८', nakshatra: 'कृत्तिका', nakshatraEnd: '२५.१७', yoga: 'सुकर्मा', yogaEnd: '१७.२९', karana: 'विष्टि', karanaEnd: '२६.१६', rashi: '०९.२६ नं. वृषभ' },
    { date: '१४ रवि', tithi: 'कृ. १४', tithiEnd: '१२.२०', nakshatra: 'रोहिणी', nakshatraEnd: '२२.१४', yoga: 'धृति', yogaEnd: '१३.१५', karana: 'चतुष्पाद', karanaEnd: '२२.२२', rashi: 'वृषभ', isRed: true },
    { date: '१५ सोम', tithi: 'अमावास्या / शु. १', tithiEnd: '०८.२४ / २८.३१', nakshatra: 'मृग', nakshatraEnd: '१९.०९', yoga: 'शूल / गंड', yogaEnd: '०८.५६ / २८.३९', karana: 'किंस्तुघ्न', karanaEnd: '१८.२७', rashi: '०८.४१ नं. मिथुन', isRed: true },
    { date: '१६ मंगळ', tithi: 'शु. २', tithiEnd: '२४.५३', nakshatra: 'आर्द्रा', nakshatraEnd: '१६.१२', yoga: 'वृद्धि', yogaEnd: '२४.३५', karana: 'बालव', karanaEnd: '१४.४०', rashi: 'मिथुन' },
    { date: '१७ बुध', tithi: 'शु. ३', tithiEnd: '२१.३९', nakshatra: 'पुनर्वसु', nakshatraEnd: '१३.३७', yoga: 'ध्रुव', yogaEnd: '२०.५१', karana: 'तैतिल', karanaEnd: '११.१२', rashi: '०८.१३ नं. कर्क' },
    { date: '१८ गुरु', tithi: 'शु. ४', tithiEnd: '१८.५१', nakshatra: 'पुष्य', nakshatraEnd: '११.३३', yoga: 'व्याघात', yogaEnd: '१७.३५', karana: 'वणिज / बव', karanaEnd: '०८.१४ / २९.५४', rashi: 'कर्क' },
    { date: '१९ शुक्र', tithi: 'शु. ५', tithiEnd: '१७.००', nakshatra: 'आश्लेषा', nakshatraEnd: '१०.०७', yoga: 'हर्षण', yogaEnd: '१४.५३', karana: 'कौलव', karanaEnd: '२८.१८', rashi: '१०.०७ नं. सिंह' },
    { date: '२० शनि', tithi: 'शु. ६', tithiEnd: '१५.४७', nakshatra: 'मघा', nakshatraEnd: '०९.२६', yoga: 'वज्र', yogaEnd: '१२.४८', karana: 'गरज', karanaEnd: '२७.२८', rashi: 'सिंह' },
    { date: '२१ रवि', tithi: 'शु. ७', tithiEnd: '१५.२१', nakshatra: 'पूर्वा', nakshatraEnd: '०९.३२', yoga: 'सिद्धि', yogaEnd: '११.२१', karana: 'विष्टि', karanaEnd: '२७.२५', rashi: '१५.४० नं. कन्या', isRed: true },
    { date: '२२ सोम', tithi: 'शु. ८', tithiEnd: '१५.४०', nakshatra: 'उत्तरा', nakshatraEnd: '१०.२२', yoga: 'व्यतीपात', yogaEnd: '१०.३१', karana: 'बालव', karanaEnd: '२८.०६', rashi: 'कन्या' },
    { date: '२३ मंगळ', tithi: 'शु. ९', tithiEnd: '१६.४०', nakshatra: 'हस्त', nakshatraEnd: '११.५४', yoga: 'वरीयान', yogaEnd: '१०.१३', karana: 'तैतिल', karanaEnd: '२९.२३', rashi: '२४.५३ नं. तुला' },
    { date: '२४ बुध', tithi: 'शु. १०', tithiEnd: '१८.१३', nakshatra: 'चित्रा', nakshatraEnd: '१३.५९', yoga: 'परिघ', yogaEnd: '१०.२३', karana: 'वणिज', karanaEnd: 'अहोरात्र', rashi: 'तुला' },
    { date: '२५ गुरु', tithi: 'शु. ११', tithiEnd: '२०.१०', nakshatra: 'स्वाती', nakshatraEnd: '१६.२९', yoga: 'शिव', yogaEnd: '१०.५४', karana: 'वणिज', karanaEnd: '०७.०९', rashi: 'तुला' },
    { date: '२६ शुक्र', tithi: 'शु. १२', tithiEnd: '२२.२३', nakshatra: 'विशाखा', nakshatraEnd: '१९.१६', yoga: 'सिद्ध', yogaEnd: '११.३९', karana: 'बव', karanaEnd: '०९.१५', rashi: '१२.३३ नं. वृश्चिक' },
    { date: '२७ शनि', tithi: 'शु. १३', tithiEnd: '२४.४४', nakshatra: 'अनुराधा', nakshatraEnd: '२२.११', yoga: 'साध्य', yogaEnd: '१२.३२', karana: 'कौलव', karanaEnd: '११.३३', rashi: 'वृश्चिक' },
    { date: '२८ रवि', tithi: 'शु. १४', tithiEnd: '२७.०७', nakshatra: 'ज्येष्ठा', nakshatraEnd: '२५.०९', yoga: 'शुभ', yogaEnd: '१३.३०', karana: 'गरज', karanaEnd: '१३.५६', rashi: '२५.०९ नं. धनु', isRed: true },
    { date: '२९ सोम', tithi: 'पौर्णिमा', tithiEnd: '२९.२७', nakshatra: 'मूळ', nakshatraEnd: '२८.०४', yoga: 'शुक्ल', yogaEnd: '१४.२६', karana: 'विष्टि', karanaEnd: '१६.१७', rashi: 'धनु', isRed: true },
    { date: '३० मंगळ', tithi: 'कृ. १', tithiEnd: 'अहोरात्र', nakshatra: 'पू.षा.', nakshatraEnd: 'अहोरात्र', yoga: 'ब्रह्मा', yogaEnd: '१५.१९', karana: 'बालव', karanaEnd: '१८.३४', rashi: 'धनु' },
  ];

  // July 2026 Panchang Data from image
  const jul2026Data: PanchangRow[] = [
    { date: '१ बुध', tithi: 'कृ. १', tithiEnd: '०७.३९', nakshatra: 'पू.षा.', nakshatraEnd: '०६.५२', yoga: 'ऐंद्र', yogaEnd: '१६.०४', karana: 'तैतिल', karanaEnd: '२०.४०', rashi: '१३.३२ नं. मकर' },
    { date: '२ गुरु', tithi: 'कृ. २', tithiEnd: '०९.३८', nakshatra: 'उ.षा.', nakshatraEnd: '०९.२८', yoga: 'वैधृति', yogaEnd: '१६.३९', karana: 'वणिज', karanaEnd: '२२.३२', rashi: 'मकर' },
    { date: '३ शुक्र', tithi: 'कृ. ३', tithiEnd: '११.२१', nakshatra: 'श्रवण', nakshatraEnd: '११.४७', yoga: 'विष्कंभ', yogaEnd: '१७.००', karana: 'बव', karanaEnd: '२४.०४', rashi: '२४.४९ नं. कुंभ', isRed: true },
    { date: '४ शनि', tithi: 'कृ. ४', tithiEnd: '१२.४०', nakshatra: 'धनिष्ठा', nakshatraEnd: '१३.४४', yoga: 'प्रीति', yogaEnd: '१७.०२', karana: 'कौलव', karanaEnd: '२५.१०', rashi: 'कुंभ' },
    { date: '५ रवि', tithi: 'कृ. ५', tithiEnd: '१३.३१', nakshatra: 'शततारा', nakshatraEnd: '१५.१३', yoga: 'आयुष्मान्', yogaEnd: '१६.४०', karana: 'गरज', karanaEnd: '२५.४४', rashi: 'कुंभ', isRed: true },
    { date: '६ सोम', tithi: 'कृ. ६', tithiEnd: '१३.४८', nakshatra: 'पू.भा.', nakshatraEnd: '१६.०८', yoga: 'सौभाग्य', yogaEnd: '१५.५१', karana: 'विष्टि', karanaEnd: '२५.४२', rashi: '०९.५८ नं. मीन' },
    { date: '७ मंगळ', tithi: 'कृ. ७', tithiEnd: '१३.२५', nakshatra: 'उ.भा.', nakshatraEnd: '१६.२४', yoga: 'शोभन', yogaEnd: '१४.३१', karana: 'बालव', karanaEnd: '२४.५९', rashi: 'मीन' },
    { date: '८ बुध', tithi: 'कृ. ८', tithiEnd: '१२.२२', nakshatra: 'रेवती', nakshatraEnd: '१६.००', yoga: 'अतिगंड', yogaEnd: '१२.३८', karana: 'तैतिल', karanaEnd: '२३.३५', rashi: '१६.०० नं. मेष' },
    { date: '९ गुरु', tithi: 'कृ. ९', tithiEnd: '१०.३८', nakshatra: 'अश्विनी', nakshatraEnd: '१४.५६', yoga: 'सुकर्मा', yogaEnd: '१०.१२', karana: 'वणिज', karanaEnd: '२१.३२', rashi: 'मेष' },
    { date: '१० शुक्र', tithi: 'कृ. १० / कृ. ११', tithiEnd: '०८.१७ / २९.२३', nakshatra: 'भरणी', nakshatraEnd: '१३.१५', yoga: 'धृति / शूल', yogaEnd: '०७.१५ / २७.५१', karana: 'बव', karanaEnd: '१८.५४', rashi: '१८.४५ नं. वृषभ' },
    { date: '११ शनि', tithi: 'कृ. १२', tithiEnd: '२६.०५', nakshatra: 'कृत्तिका', nakshatraEnd: '११.०४', yoga: 'गंड', yogaEnd: '२४.०६', karana: 'कौलव', karanaEnd: '१५.४७', rashi: 'वृषभ' },
    { date: '१२ रवि', tithi: 'कृ. १३', tithiEnd: '२२.३०', nakshatra: 'रोहिणी', nakshatraEnd: '०८.२९', yoga: 'वृद्धि', yogaEnd: '२०.०६', karana: 'गरज', karanaEnd: '१२.१९', rashi: '१९.०७ नं. मिथुन', isRed: true },
    { date: '१३ सोम', tithi: 'कृ. १४', tithiEnd: '१८.५०', nakshatra: 'मृग / आर्द्रा', nakshatraEnd: '२९.४२ / २६.५२', yoga: 'ध्रुव', yogaEnd: '१६.०१', karana: 'विष्टि / चतुष्पाद', karanaEnd: '०८.४० / २९.०१', rashi: 'मिथुन' },
    { date: '१४ मंगळ', tithi: 'अमावास्या', tithiEnd: '१४.१४', nakshatra: 'पुनर्वसु', nakshatraEnd: '२४.१०', yoga: 'व्याघात', yogaEnd: '११.५७', karana: 'किंस्तुघ्न', karanaEnd: '२५.३०', rashi: '१८.४९ नं. कर्क', isRed: true },
    { date: '१५ बुध', tithi: 'शु. १', tithiEnd: '११.५१', nakshatra: 'पुष्य', nakshatraEnd: '२१.४७', yoga: 'हर्षण / वज्र', yogaEnd: '०८.०४ / २८.३०', karana: 'बालव', karanaEnd: '२२.१९', rashi: 'कर्क' },
    { date: '१६ गुरु', tithi: 'शु. २', tithiEnd: '०८.५३', nakshatra: 'आश्लेषा', nakshatraEnd: '१९.५२', yoga: 'सिद्धि', yogaEnd: '२५.२२', karana: 'तैतिल', karanaEnd: '१९.३६', rashi: '१९.५२ नं. सिंह' },
    { date: '१७ शुक्र', tithi: 'शु. ३ / शु. ४', tithiEnd: '०६.२८ / २८.४३', nakshatra: 'मघा', nakshatraEnd: '१८.३५', yoga: 'व्यतीपात', yogaEnd: '२२.४६', karana: 'वणिज', karanaEnd: '१७.३०', rashi: 'सिंह' },
    { date: '१८ शनि', tithi: 'शु. ५', tithiEnd: '२७.४३', nakshatra: 'पूर्वा', nakshatraEnd: '१८.००', yoga: 'वरीयान', yogaEnd: '२०.४६', karana: 'बव', karanaEnd: '१६.०७', rashi: '२३.५९ नं. कन्या' },
    { date: '१९ रवि', tithi: 'शु. ६', tithiEnd: '२७.३०', nakshatra: 'उत्तरा', nakshatraEnd: '१८.१२', yoga: 'परिघ', yogaEnd: '१९.२३', karana: 'कौलव', karanaEnd: '१५.३१', rashi: 'कन्या', isRed: true },
    { date: '२० सोम', tithi: 'शु. ७', tithiEnd: '२८.०३', nakshatra: 'हस्त', nakshatraEnd: '१९.१०', yoga: 'शिव', yogaEnd: '१८.३७', karana: 'गरज', karanaEnd: '१५.४१', rashi: 'कन्या' },
    { date: '२१ मंगळ', tithi: 'शु. ८', tithiEnd: '२९.१७', nakshatra: 'चित्रा', nakshatraEnd: '२०.४९', yoga: 'सिद्ध', yogaEnd: '१८.२५', karana: 'विष्टि', karanaEnd: '१६.३६', rashi: '०७.५५ नं. तुला' },
    { date: '२२ बुध', tithi: 'शु. ९', tithiEnd: 'अहोरात्र', nakshatra: 'स्वाती', nakshatraEnd: '२३.०४', yoga: 'साध्य', yogaEnd: '१८.४२', karana: 'बालव', karanaEnd: '१८.०७', rashi: 'तुला' },
    { date: '२३ गुरु', tithi: 'शु. ९', tithiEnd: '०७.०४', nakshatra: 'विशाखा', nakshatraEnd: '२५.४३', yoga: 'शुभ', yogaEnd: '१९.२०', karana: 'तैतिल', karanaEnd: '२०.०६', rashi: '१९.०१ नं. वृश्चिक' },
    { date: '२४ शुक्र', tithi: 'शु. १०', tithiEnd: '०९.१३', nakshatra: 'अनुराधा', nakshatraEnd: '२८.३७', yoga: 'शुक्ल', yogaEnd: '२०.१२', karana: 'वणिज', karanaEnd: '२२.२३', rashi: 'वृश्चिक' },
    { date: '२५ शनि', tithi: 'शु. ११', tithiEnd: '११.३५', nakshatra: 'ज्येष्ठा', nakshatraEnd: 'अहोरात्र', yoga: 'ब्रह्मा', yogaEnd: '२१.०९', karana: 'बव', karanaEnd: '२४.४७', rashi: 'वृश्चिक', isRed: true },
    { date: '२६ रवि', tithi: 'शु. १२', tithiEnd: '१३.५८', nakshatra: 'ज्येष्ठा', nakshatraEnd: '०७.३५', yoga: 'ऐंद्र', yogaEnd: '२२.०५', karana: 'कौलव', karanaEnd: '२७.०८', rashi: '०७.३५ नं. धनु', isRed: true },
    { date: '२७ सोम', tithi: 'शु. १३', tithiEnd: '१६.१५', nakshatra: 'मूळ', nakshatraEnd: '१०.२९', yoga: 'वैधृति', yogaEnd: '२२.५५', karana: 'गरज', karanaEnd: '२९.१९', rashi: 'धनु' },
    { date: '२८ मंगळ', tithi: 'शु. १४', tithiEnd: '१८.१९', nakshatra: 'पू.षा.', nakshatraEnd: '१३.११', yoga: 'विष्कंभ', yogaEnd: '२३.३३', karana: 'विष्टि', karanaEnd: 'अहोरात्र', rashi: '१९.४९ नं. मकर' },
    { date: '२९ बुध', tithi: 'पौर्णिमा', tithiEnd: '२०.०६', nakshatra: 'उ.षा.', nakshatraEnd: '१५.३७', yoga: 'प्रीति', yogaEnd: '२३.५८', karana: 'विष्टि', karanaEnd: '०७.१५', rashi: 'मकर', isRed: true },
    { date: '३० गुरु', tithi: 'कृ. १', tithiEnd: '२१.३१', nakshatra: 'श्रवण', nakshatraEnd: '१७.४४', yoga: 'आयुष्मान्', yogaEnd: '२४.०५', karana: 'बालव', karanaEnd: '०८.५१', rashi: 'मकर' },
    { date: '३१ शुक्र', tithi: 'कृ. २', tithiEnd: '२२.३२', nakshatra: 'धनिष्ठा', nakshatraEnd: '१९.२७', yoga: 'सौभाग्य', yogaEnd: '२३.५४', karana: 'तैतिल', karanaEnd: '१०.०५', rashi: '०६.३८ नं. कुंभ' },
  ];

  // August 2026 Panchang Data from image
  const aug2026Data: PanchangRow[] = [
    { date: '१ शनि', tithi: 'कृ. ३', tithiEnd: '२३.०८', nakshatra: 'शततारा', nakshatraEnd: '२०.४६', yoga: 'शोभन', yogaEnd: '२३.२३', karana: 'वणिज', karanaEnd: '१०.५३', rashi: 'कुंभ' },
    { date: '२ रवि', tithi: 'कृ. ४', tithiEnd: '२३.१६', nakshatra: 'पू.भा.', nakshatraEnd: '२१.३७', yoga: 'अतिगंड', yogaEnd: '२२.३०', karana: 'बव', karanaEnd: '११.१५', rashi: '१५.२७ नं. मीन', isRed: true },
    { date: '३ सोम', tithi: 'कृ. ५', tithiEnd: '२२.५५', nakshatra: 'उ.भा.', nakshatraEnd: '२२.०१', yoga: 'सुकर्मा', yogaEnd: '२१.१४', karana: 'कौलव', karanaEnd: '११.०९', rashi: 'मीन' },
    { date: '४ मंगळ', tithi: 'कृ. ६', tithiEnd: '२२.०४', nakshatra: 'रेवती', nakshatraEnd: '२१.५४', yoga: 'धृति', yogaEnd: '१९.३३', karana: 'गरज', karanaEnd: '१०.३३', rashi: '२१.५४ नं. मेष' },
    { date: '५ बुध', tithi: 'कृ. ७', tithiEnd: '२०.४३', nakshatra: 'अश्विनी', nakshatraEnd: '२१.१८', yoga: 'शूल', yogaEnd: '१७.२९', karana: 'विष्टि', karanaEnd: '०९.२७', rashi: 'मेष' },
    { date: '६ गुरु', tithi: 'कृ. ८', tithiEnd: '१८.५३', nakshatra: 'भरणी', nakshatraEnd: '२०.१४', yoga: 'गंड', yogaEnd: '१५.०१', karana: 'बालव / तैतिल', karanaEnd: '०७.५१ / २९.४८', rashi: '२५.५४ नं. वृषभ' },
    { date: '७ शुक्र', tithi: 'कृ. ९', tithiEnd: '१६.३७', nakshatra: 'कृत्तिका', nakshatraEnd: '१८.४३', yoga: 'वृद्धि', yogaEnd: '१२.११', karana: 'वणिज', karanaEnd: '२७.२१', rashi: 'वृषभ' },
    { date: '८ शनि', tithi: 'कृ. १०', tithiEnd: '१४.००', nakshatra: 'रोहिणी', nakshatraEnd: '१६.५१', yoga: 'ध्रुव / व्याघात', yogaEnd: '०९.०२ / २९.३८', karana: 'बव', karanaEnd: '२४.३४', rashi: '२७.४९ नं. मिथुन' },
    { date: '९ रवि', tithi: 'कृ. ११', tithiEnd: '११.०६', nakshatra: 'मृग', nakshatraEnd: '१४.४४', yoga: 'हर्षण', yogaEnd: '२६.०५', karana: 'कौलव', karanaEnd: '२१.३४', rashi: 'मिथुन', isRed: true },
    { date: '१० सोम', tithi: 'कृ. १२ / कृ. १३', tithiEnd: '०८.०१ / २८.५५', nakshatra: 'आर्द्रा', nakshatraEnd: '१२.२७', yoga: 'वज्र', yogaEnd: '२२.२७', karana: 'गरज', karanaEnd: '१८.२८', rashi: '२८.४४ नं. कर्क' },
    { date: '११ मंगळ', tithi: 'कृ. १४', tithiEnd: '२५.५४', nakshatra: 'पुनर्वसु', nakshatraEnd: '१०.१०', yoga: 'सिद्धि', yogaEnd: '१८.५२', karana: 'विष्टि', karanaEnd: '१५.२३', rashi: 'कर्क' },
    { date: '१२ बुध', tithi: 'अमावास्या', tithiEnd: '२३.०७', nakshatra: 'पुष्य / आश्लेषा', nakshatraEnd: '०८.०० / ३०.०७', yoga: 'व्यतीपात', yogaEnd: '१५.२६', karana: 'चतुष्पाद', karanaEnd: '१२.२८', rashi: '३०.०७ नं. सिंह', isRed: true },
    { date: '१३ गुरु', tithi: 'शु. १', tithiEnd: '२०.४२', nakshatra: 'मघा', nakshatraEnd: '२८.३९', yoga: 'वरीयान', yogaEnd: '१२.१६', karana: 'किंस्तुघ्न', karanaEnd: '०९.५१', rashi: 'सिंह' },
    { date: '१४ शुक्र', tithi: 'शु. २', tithiEnd: '१८.४७', nakshatra: 'पूर्वा', nakshatraEnd: '२७.४३', yoga: 'परिघ', yogaEnd: '०९.२९', karana: 'बालव / तैतिल', karanaEnd: '०७.४० / ३०.०३', rashi: 'सिंह' },
    { date: '१५ शनि', tithi: 'शु. ३', tithiEnd: '१७.२९', nakshatra: 'उत्तरा', nakshatraEnd: '२७.२६', yoga: 'शिव / सिद्ध', yogaEnd: '०७.०९ / २९.२१', karana: 'वणिज', karanaEnd: '२९.०६', rashi: '०९.३५ नं. कन्या' },
    { date: '१६ रवि', tithi: 'शु. ४', tithiEnd: '१६.५३', nakshatra: 'हस्त', nakshatraEnd: '२७.५१', yoga: 'साध्य', yogaEnd: '२८.०८', karana: 'बव', karanaEnd: '२८.५१', rashi: 'कन्या', isRed: true },
    { date: '१७ सोम', tithi: 'शु. ५', tithiEnd: '१७.०१', nakshatra: 'चित्रा', nakshatraEnd: '२८.५९', yoga: 'शुभ', yogaEnd: '२७.२९', karana: 'कौलव', karanaEnd: '२९.२१', rashi: '१६.२० नं. तुला', isRed: true },
    { date: '१८ मंगळ', tithi: 'शु. ६', tithiEnd: '१७.५१', nakshatra: 'स्वाती', nakshatraEnd: 'अहोरात्र', yoga: 'शुक्ल', yogaEnd: '२७.२३', karana: 'गरज', karanaEnd: 'अहोरात्र', rashi: 'तुला' },
    { date: '१९ बुध', tithi: 'शु. ७', tithiEnd: '१९.२०', nakshatra: 'स्वाती', nakshatraEnd: '०६.४७', yoga: 'ब्रह्मा', yogaEnd: '२७.४४', karana: 'गरज', karanaEnd: '०६.३१', rashi: '२६.३० नं. वृश्चिक' },
    { date: '२० गुरु', tithi: 'शु. ८', tithiEnd: '२१.१९', nakshatra: 'विशाखा', nakshatraEnd: '०९.०८', yoga: 'ऐंद्र', yogaEnd: '२८.२५', karana: 'विष्टि', karanaEnd: '०८.१६', rashi: 'वृश्चिक' },
    { date: '२१ शुक्र', tithi: 'शु. ९', tithiEnd: '२३.३७', nakshatra: 'अनुराधा', nakshatraEnd: '११.५३', yoga: 'वैधृति', yogaEnd: '२९.१९', karana: 'बालव', karanaEnd: '१०.२६', rashi: 'वृश्चिक' },
    { date: '२२ शनि', tithi: 'शु. १०', tithiEnd: '२६.०१', nakshatra: 'ज्येष्ठा', nakshatraEnd: '१४.४९', yoga: 'विष्कंभ', yogaEnd: '३०.१४', karana: 'तैतिल', karanaEnd: '१२.४९', rashi: '१४.४९ नं. धनु' },
    { date: '२३ रवि', tithi: 'शु. ११', tithiEnd: '२८.१९', nakshatra: 'मूळ', nakshatraEnd: '१७.४५', yoga: 'प्रीति', yogaEnd: 'अहोरात्र', karana: 'वणिज', karanaEnd: '१५.११', rashi: 'धनु', isRed: true },
    { date: '२४ सोम', tithi: 'शु. १२', tithiEnd: '३०.२१', nakshatra: 'पू.षा.', nakshatraEnd: '२०.२८', yoga: 'प्रीति', yogaEnd: '०७.०४', karana: 'बव', karanaEnd: '१७.२३', rashi: '२७.०६ नं. मकर' },
    { date: '२५ मंगळ', tithi: 'शु. १३', tithiEnd: 'अहोरात्र', nakshatra: 'उ.षा.', nakshatraEnd: '२२.५१', yoga: 'आयुष्मान', yogaEnd: '०७.४१', karana: 'कौलव', karanaEnd: '१९.१४', rashi: 'मकर' },
    { date: '२६ बुध', tithi: 'शु. १३', tithiEnd: '०८.००', nakshatra: 'श्रवण', nakshatraEnd: '२४.४८', yoga: 'सौभाग्य', yogaEnd: '०७.५९', karana: 'गरज', karanaEnd: '२०.३८', rashi: 'मकर' },
    { date: '२७ गुरु', tithi: 'शु. १४', tithiEnd: '०९.०९', nakshatra: 'धनिष्ठा', nakshatraEnd: '२६.१६', yoga: 'शोभन', yogaEnd: '०७.५६', karana: 'विष्टि', karanaEnd: '२१.३३', rashi: '१३.३६ नं. कुंभ', isRed: true },
    { date: '२८ शुक्र', tithi: 'पौर्णिमा', tithiEnd: '०९.४९', nakshatra: 'शततारा', nakshatraEnd: '२७.१३', yoga: 'अतिगंड', yogaEnd: '०७.२८', karana: 'बालव', karanaEnd: '२१.५७', rashi: 'कुंभ', isRed: true },
    { date: '२९ शनि', tithi: 'कृ. १', tithiEnd: '०९.५७', nakshatra: 'पू.भा.', nakshatraEnd: '२७.४२', yoga: 'सुकर्मा / धृति', yogaEnd: '०६.३६ / २९.२२', karana: 'तैतिल', karanaEnd: '२१.५१', rashi: '२१.३८ नं. मीन' },
    { date: '३० रवि', tithi: 'कृ. २', tithiEnd: '०९.३८', nakshatra: 'उ.भा.', nakshatraEnd: '२७.४५', yoga: 'शूल', yogaEnd: '२७.४६', karana: 'वणिज', karanaEnd: '२१.१८', rashi: 'मीन', isRed: true },
    { date: '३१ सोम', tithi: 'कृ. ३', tithiEnd: '०८.५२', nakshatra: 'रेवती', nakshatraEnd: '२७.२४', yoga: 'गंड', yogaEnd: '२५.५१', karana: 'बव', karanaEnd: '२०.२०', rashi: '२७.२४ नं. मेष' },
  ];

  // September 2026 Panchang Data from image
  const sep2026Data: PanchangRow[] = [
    { date: '१ मंगळ', tithi: 'कृ. ४ / कृ. ५', tithiEnd: '०७.४२ / ३०.१३', nakshatra: 'अश्विनी', nakshatraEnd: '२६.४२', yoga: 'वृद्धि', yogaEnd: '२३.३९', karana: 'कौलव', karanaEnd: '१९.००', rashi: 'मेष' },
    { date: '२ बुध', tithi: 'कृ. ६', tithiEnd: '२८.२७', nakshatra: 'भरणी', nakshatraEnd: '२५.४३', yoga: 'ध्रुव', yogaEnd: '२१.१२', karana: 'गरज', karanaEnd: '१७.२२', rashi: 'मेष' },
    { date: '३ गुरु', tithi: 'कृ. ७', tithiEnd: '२६.२६', nakshatra: 'कृत्तिका', nakshatraEnd: '२४.३०', yoga: 'व्याघात', yogaEnd: '१८.३३', karana: 'विष्टि', karanaEnd: '१५.२८', rashi: '०७.२६ नं. वृषभ' },
    { date: '४ शुक्र', tithi: 'कृ. ८', tithiEnd: '२४.१४', nakshatra: 'रोहिणी', nakshatraEnd: '२३.०४', yoga: 'हर्षण', yogaEnd: '१५.४४', karana: 'बालव', karanaEnd: '१३.२१', rashi: 'वृषभ' },
    { date: '५ शनि', tithi: 'कृ. ९', tithiEnd: '२१.५४', nakshatra: 'मृग', nakshatraEnd: '२१.३१', yoga: 'वज्र', yogaEnd: '१२.४७', karana: 'तैतिल', karanaEnd: '११.०५', rashi: '१०.१९ नं. मिथुन' },
    { date: '६ रवि', tithi: 'कृ. १०', tithiEnd: '१९.३०', nakshatra: 'आर्द्रा', nakshatraEnd: '१९.५३', yoga: 'सिद्धि', yogaEnd: '०९.४५', karana: 'वणिज / बव', karanaEnd: '०८.४२ / ३०.१७', rashi: 'मिथुन', isRed: true },
    { date: '७ सोम', tithi: 'कृ. ११', tithiEnd: '१७.०५', nakshatra: 'पुनर्वसु', nakshatraEnd: '१८.१४', yoga: 'व्यतीपात / वरीयान', yogaEnd: '०६.४१ / २७.३८', karana: 'कौलव', karanaEnd: '२७.५३', rashi: '१२.३९ नं. कर्क' },
    { date: '८ मंगळ', tithi: 'कृ. १२', tithiEnd: '१४.४३', nakshatra: 'पुष्य', nakshatraEnd: '१६.४०', yoga: 'परिघ', yogaEnd: '२४.४१', karana: 'गरज', karanaEnd: '२५.३६', rashi: 'कर्क' },
    { date: '९ बुध', tithi: 'कृ. १३', tithiEnd: '१२.३१', nakshatra: 'आश्लेषा', nakshatraEnd: '१५.१५', yoga: 'शिव', yogaEnd: '२१.५२', karana: 'विष्टि', karanaEnd: '२३.३०', rashi: '१५.१५ नं. सिंह' },
    { date: '१० गुरु', tithi: 'कृ. १४', tithiEnd: '१०.३४', nakshatra: 'मघा', nakshatraEnd: '१४.०५', yoga: 'सिद्ध', yogaEnd: '१९.१८', karana: 'चतुष्पाद', karanaEnd: '२१.४२', rashi: 'सिंह', isRed: true },
    { date: '११ शुक्र', tithi: 'अमावास्या', tithiEnd: '०८.५७', nakshatra: 'पूर्वा', nakshatraEnd: '१३.१६', yoga: 'साध्य', yogaEnd: '१७.०२', karana: 'किंस्तुघ्न', karanaEnd: '२०.१८', rashi: '१९.०८ नं. कन्या', isRed: true },
    { date: '१२ शनि', tithi: 'शु. १', tithiEnd: '०७.४७', nakshatra: 'उत्तरा', nakshatraEnd: '१२.५५', yoga: 'शुभ', yogaEnd: '१५.०९', karana: 'बालव', karanaEnd: '१९.२४', rashi: 'कन्या' },
    { date: '१३ रवि', tithi: 'शु. २', tithiEnd: '०७.०९', nakshatra: 'हस्त', nakshatraEnd: '१३.०७', yoga: 'शुक्ल', yogaEnd: '१३.४३', karana: 'तैतिल', karanaEnd: '१९.०३', rashi: '२५.२७ नं. तुला', isRed: true },
    { date: '१४ सोम', tithi: 'शु. ३', tithiEnd: '०७.०७', nakshatra: 'चित्रा', nakshatraEnd: '१३.५५', yoga: 'ब्रह्मा', yogaEnd: '१२.४७', karana: 'वणिज', karanaEnd: '१९.२१', rashi: 'तुला' },
    { date: '१५ मंगळ', tithi: 'शु. ४', tithiEnd: '०७.४५', nakshatra: 'स्वाती', nakshatraEnd: '१५.२१', yoga: 'ऐंद्र', yogaEnd: '१२.२०', karana: 'बव', karanaEnd: '२०.१८', rashi: 'तुला' },
    { date: '१६ बुध', tithi: 'शु. ५', tithiEnd: '०९.००', nakshatra: 'विशाखा', nakshatraEnd: '१७.२३', yoga: 'वैधृति', yogaEnd: '१२.२३', karana: 'कौलव', karanaEnd: '२१.५०', rashi: '१०.४९ नं. वृश्चिक', isRed: true },
    { date: '१७ गुरु', tithi: 'शु. ६', tithiEnd: '१०.४८', nakshatra: 'अनुराधा', nakshatraEnd: '१९.५४', yoga: 'विष्कंभ', yogaEnd: '१२.५०', karana: 'गरज', karanaEnd: '२३.५३', rashi: 'वृश्चिक', isRed: true },
    { date: '१८ शुक्र', tithi: 'शु. ७', tithiEnd: '१३.०२', nakshatra: 'ज्येष्ठा', nakshatraEnd: '२२.४५', yoga: 'प्रीति', yogaEnd: '१३.३५', karana: 'विष्टि', karanaEnd: '२६.१४', rashi: '२२.४५ नं. धनु', isRed: true },
    { date: '१९ शनि', tithi: 'शु. ८', tithiEnd: '१५.२७', nakshatra: 'मूळ', nakshatraEnd: '२५.४३', yoga: 'आयुष्मान', yogaEnd: '१४.२९', karana: 'बालव', karanaEnd: '२८.४१', rashi: 'धनु' },
    { date: '२० रवि', tithi: 'शु. ९', tithiEnd: '१७.५२', nakshatra: 'पू.षा.', nakshatraEnd: '२८.३५', yoga: 'सौभाग्य', yogaEnd: '१५.२३', karana: 'तैतिल', karanaEnd: 'अहोरात्र', rashi: 'धनु', isRed: true },
    { date: '२१ सोम', tithi: 'शु. १०', tithiEnd: '२०.०१', nakshatra: 'उ.षा.', nakshatraEnd: 'अहोरात्र', yoga: 'शोभन', yogaEnd: '१६.०६', karana: 'तैतिल', karanaEnd: '०६.५९', rashi: '११.१५ नं. मकर' },
    { date: '२२ मंगळ', tithi: 'शु. ११', tithiEnd: '२१.४४', nakshatra: 'उ.षा.', nakshatraEnd: '०७.०७', yoga: 'अतिगंड', yogaEnd: '१६.२९', karana: 'वणिज', karanaEnd: '०८.५७', rashi: 'मकर' },
    { date: '२३ बुध', tithi: 'शु. १२', tithiEnd: '२२.५१', nakshatra: 'श्रवण', nakshatraEnd: '०९.०९', yoga: 'सुकर्मा', yogaEnd: '१६.२७', karana: 'बव', karanaEnd: '१०.२२', rashi: '२१.५७ नं. कुंभ' },
    { date: '२४ गुरु', tithi: 'शु. १३', tithiEnd: '२३.१९', nakshatra: 'धनिष्ठा', nakshatraEnd: '१०.३५', yoga: 'धृति', yogaEnd: '१५.५५', karana: 'कौलव', karanaEnd: '११.१०', rashi: 'कुंभ' },
    { date: '२५ शुक्र', tithi: 'शु. १४', tithiEnd: '२३.०७', nakshatra: 'शततारा', nakshatraEnd: '११.२३', yoga: 'शूल', yogaEnd: '१४.५१', karana: 'गरज', karanaEnd: '११.१८', rashi: '२९.३३ नं. मीन' },
    { date: '२६ शनि', tithi: 'पौर्णिमा', tithiEnd: '२२.१९', nakshatra: 'पू.भा.', nakshatraEnd: '११.३२', yoga: 'गंड', yogaEnd: '१३.१८', karana: 'विष्टि', karanaEnd: '१०.४७', rashi: 'मीन', isRed: true },
    { date: '२७ रवि', tithi: 'कृ. १', tithiEnd: '२०.५९', nakshatra: 'उ.भा.', nakshatraEnd: '११.०८', yoga: 'वृद्धि', yogaEnd: '११.१७', karana: 'बालव', karanaEnd: '०९.४३', rashi: 'मीन', isRed: true },
    { date: '२८ सोम', tithi: 'कृ. २', tithiEnd: '१९.१४', nakshatra: 'रेवती', nakshatraEnd: '१०.१६', yoga: 'ध्रुव / व्याघात', yogaEnd: '०८.५४ / ३०.१३', karana: 'तैतिल / वणिज', karanaEnd: '०८.०९ / ३०.१४', rashi: '१०.१६ नं. मेष' },
    { date: '२९ मंगळ', tithi: 'कृ. ३', tithiEnd: '१७.११', nakshatra: 'अश्विनी', nakshatraEnd: '०९.०४', yoga: 'हर्षण', yogaEnd: '२७.२०', karana: 'बव', karanaEnd: '२८.०४', rashi: 'मेष', isRed: true },
    { date: '३० बुध', tithi: 'कृ. ४', tithiEnd: '१४.५६', nakshatra: 'भरणी / कृत्तिका', nakshatraEnd: '०७.३७ / ३०.०३', yoga: 'वज्र', yogaEnd: '२४.२१', karana: 'कौलव', karanaEnd: '२५.४६', rashi: '१३.१४ नं. वृषभ' },
  ];

  // October 2026 Panchang Data from image
  const oct2026Data: PanchangRow[] = [
    { date: '१ गुरु', tithi: 'कृ. ५', tithiEnd: '१२.३६', nakshatra: 'रोहिणी', nakshatraEnd: '२८.२७', yoga: 'सिद्धि', yogaEnd: '२१.१८', karana: 'गरज', karanaEnd: '२३.२५', rashi: 'वृषभ' },
    { date: '२ शुक्र', tithi: 'कृ. ६', tithiEnd: '१०.१६', nakshatra: 'मृग', nakshatraEnd: '२६.५५', yoga: 'व्यतीपात', yogaEnd: '१८.१८', karana: 'विष्टि', karanaEnd: '२१.०७', rashi: '१५.४१ नं. मिथुन' },
    { date: '३ शनि', tithi: 'कृ. ७ / कृ. ८', tithiEnd: '०८.०० / २९.५२', nakshatra: 'आर्द्रा', nakshatraEnd: '२५.३०', yoga: 'वरीयान', yogaEnd: '१५.२२', karana: 'बालव', karanaEnd: '१८.५५', rashi: 'मिथुन' },
    { date: '४ रवि', tithi: 'कृ. ९', tithiEnd: '२७.५४', nakshatra: 'पुनर्वसु', nakshatraEnd: '२४.१४', yoga: 'परिघ', yogaEnd: '१२.३२', karana: 'तैतिल', karanaEnd: '१६.५२', rashi: '१८.३२ नं. कर्क', isRed: true },
    { date: '५ सोम', tithi: 'कृ. १०', tithiEnd: '२६.०८', nakshatra: 'पुष्य', nakshatraEnd: '२३.०९', yoga: 'शिव', yogaEnd: '०९.५२', karana: 'वणिज', karanaEnd: '१५.००', rashi: 'कर्क' },
    { date: '६ मंगळ', tithi: 'कृ. ११', tithiEnd: '२४.३५', nakshatra: 'आश्लेषा', nakshatraEnd: '२२.१८', yoga: 'सिद्ध / साध्य', yogaEnd: '०७.२० / २९.००', karana: 'बव', karanaEnd: '१३.२०', rashi: '२२.१८ नं. सिंह' },
    { date: '७ बुध', tithi: 'कृ. १२', tithiEnd: '२३.१७', nakshatra: 'मघा', nakshatraEnd: '२१.४१', yoga: 'शुभ', yogaEnd: '२६.५२', karana: 'कौलव', karanaEnd: '११.५४', rashi: 'सिंह' },
    { date: '८ गुरु', tithi: 'कृ. १३', tithiEnd: '२२.१६', nakshatra: 'पूर्वा', nakshatraEnd: '२१.२०', yoga: 'शुक्ल', yogaEnd: '२४.५८', karana: 'गरज', karanaEnd: '१०.४४', rashi: '२७.१८ नं. कन्या' },
    { date: '९ शुक्र', tithi: 'कृ. १४', tithiEnd: '२१.३६', nakshatra: 'उत्तरा', nakshatraEnd: '२१.२०', yoga: 'ब्रह्मा', yogaEnd: '२३.२१', karana: 'विष्टि', karanaEnd: '०९.५४', rashi: 'कन्या' },
    { date: '१० शनि', tithi: 'अमावास्या', tithiEnd: '२१.२०', nakshatra: 'हस्त', nakshatraEnd: '२१.४३', yoga: 'ऐंद्र', yogaEnd: '२२.०२', karana: 'चतुष्पाद', karanaEnd: '०९.२५', rashi: 'कन्या', isRed: true },
    { date: '११ रवि', tithi: 'शु. १', tithiEnd: '२१.३२', nakshatra: 'चित्रा', nakshatraEnd: '२२.३३', yoga: 'वैधृति', yogaEnd: '२१.०६', karana: 'किंस्तुघ्न', karanaEnd: '०९.२२', rashi: '१०.०४ नं. तुला', isRed: true },
    { date: '१२ सोम', tithi: 'शु. २', tithiEnd: '२२.१४', nakshatra: 'स्वाती', nakshatraEnd: '२३.५२', yoga: 'विष्कंभ', yogaEnd: '२०.३२', karana: 'बालव', karanaEnd: '०९.४९', rashi: 'तुला' },
    { date: '१३ मंगळ', tithi: 'शु. ३', tithiEnd: '२३.२८', nakshatra: 'विशाखा', nakshatraEnd: '२५.४३', yoga: 'प्रीति', yogaEnd: '२०.२४', karana: 'तैतिल', karanaEnd: '१०.४७', rashi: '१९.१३ नं. वृश्चिक', isRed: true },
    { date: '१४ बुध', tithi: 'शु. ४', tithiEnd: '२५.१४', nakshatra: 'अनुराधा', nakshatraEnd: '२८.०३', yoga: 'आयुष्मान', yogaEnd: '२०.३९', karana: 'वणिज', karanaEnd: '१२.१७', rashi: 'वृश्चिक' },
    { date: '१५ गुरु', tithi: 'शु. ५', tithiEnd: '२७.२६', nakshatra: 'ज्येष्ठा', nakshatraEnd: 'अहोरात्र', yoga: 'सौभाग्य', yogaEnd: '२१.१५', karana: 'बव', karanaEnd: '१४.१७', rashi: 'वृश्चिक' },
    { date: '१६ शुक्र', tithi: 'शु. ६', tithiEnd: '२९.५५', nakshatra: 'ज्येष्ठा', nakshatraEnd: '०६.४८', yoga: 'शोभन', yogaEnd: '२२.०६', karana: 'कौलव', karanaEnd: '१६.३९', rashi: '०६.४८ नं. धनु' },
    { date: '१७ शनि', tithi: 'शु. ७', tithiEnd: 'अहोरात्र', nakshatra: 'मूळ', nakshatraEnd: '०९.४७', yoga: 'अतिगंड', yogaEnd: '२३.०३', karana: 'गरज', karanaEnd: '१९.१२', rashi: 'धनु', isRed: true },
    { date: '१८ रवि', tithi: 'शु. ७', tithiEnd: '०८.२९', nakshatra: 'पू.षा.', nakshatraEnd: '१२.४९', yoga: 'सुकर्मा', yogaEnd: '२३.५६', karana: 'विष्टि', karanaEnd: '२१.४३', rashi: '१९.३३ नं. मकर', isRed: true },
    { date: '१९ सोम', tithi: 'शु. ८', tithiEnd: '१०.५२', nakshatra: 'उ.षा.', nakshatraEnd: '१५.३९', yoga: 'धृति', yogaEnd: '२४.३५', karana: 'बालव', karanaEnd: '२३.५६', rashi: 'मकर' },
    { date: '२० मंगळ', tithi: 'शु. ९', tithiEnd: '१२.५१', nakshatra: 'श्रवण', nakshatraEnd: '१८.०२', yoga: 'शूल', yogaEnd: '२४.५०', karana: 'तैतिल', karanaEnd: '२५.३७', rashi: 'मकर', isRed: true },
    { date: '२१ बुध', tithi: 'शु. १०', tithiEnd: '१४.१२', nakshatra: 'धनिष्ठा', nakshatraEnd: '१९.४८', yoga: 'गंड', yogaEnd: '२४.३३', karana: 'वणिज', karanaEnd: '२६.३६', rashi: '०७.०० नं. कुंभ' },
    { date: '२२ गुरु', tithi: 'शु. ११', tithiEnd: '१४.४९', nakshatra: 'शततारा', nakshatraEnd: '२०.४९', yoga: 'वृद्धि', yogaEnd: '२३.४०', karana: 'बव', karanaEnd: '२६.४९', rashi: 'कुंभ' },
    { date: '२३ शुक्र', tithi: 'शु. १२', tithiEnd: '१४.३६', nakshatra: 'पू.भा.', nakshatraEnd: '२१.०३', yoga: 'ध्रुव', yogaEnd: '२२.०९', karana: 'कौलव', karanaEnd: '२६.१३', rashi: '१५.०४ नं. मीन' },
    { date: '२४ शनि', tithi: 'शु. १३', tithiEnd: '१३.३७', nakshatra: 'उ.भा.', nakshatraEnd: '२०.३२', yoga: 'व्याघात', yogaEnd: '२०.०९', karana: 'गरज', karanaEnd: '२४.५२', rashi: 'मीन' },
    { date: '२५ रवि', tithi: 'शु. १४', tithiEnd: '११.५७', nakshatra: 'रेवती', nakshatraEnd: '१९.२२', yoga: 'हर्षण', yogaEnd: '१७.२२', karana: 'विष्टि', karanaEnd: '२२.५३', rashi: '१९.२२ नं. मेष', isRed: true },
    { date: '२६ सोम', tithi: 'पौर्णिमा', tithiEnd: '०९.४२', nakshatra: 'अश्विनी', nakshatraEnd: '१७.४१', yoga: 'वज्र', yogaEnd: '१४.१७', karana: 'बालव', karanaEnd: '२०.२४', rashi: 'मेष', isRed: true },
    { date: '२७ मंगळ', tithi: 'कृ. १ / कृ. २', tithiEnd: '०७.०२ / २८.०७', nakshatra: 'भरणी', nakshatraEnd: '१५.३९', yoga: 'सिद्धि', yogaEnd: '१०.५३', karana: 'तैतिल', karanaEnd: '१७.३६', rashi: '२१.०७ नं. वृषभ' },
    { date: '२८ बुध', tithi: 'कृ. ३', tithiEnd: '२५.०७', nakshatra: 'कृत्तिका', nakshatraEnd: '१३.२६', yoga: 'व्यतीपात / वरीयान', yogaEnd: '०७.१९ / २७.४१', karana: 'वणिज', karanaEnd: '१४.३७', rashi: 'वृषभ' },
    { date: '२९ गुरु', tithi: 'कृ. ४', tithiEnd: '२२.११', nakshatra: 'रोहिणी', nakshatraEnd: '११.१२', yoga: 'परिघ', yogaEnd: '२४.०६', karana: 'बव', karanaEnd: '११.३८', rashi: '२२.०७ नं. मिथुन', isRed: true },
    { date: '३० शुक्र', tithi: 'कृ. ५', tithiEnd: '१९.२५', nakshatra: 'मृग', nakshatraEnd: '०९.०५', yoga: 'शिव', yogaEnd: '२०.४२', karana: 'कौलव / गरज', karanaEnd: '०८.४६ / ३०.०९', rashi: 'मिथुन' },
    { date: '३१ शनि', tithi: 'कृ. ६', tithiEnd: '१६.५८', nakshatra: 'आर्द्रा / पुनर्वसु', nakshatraEnd: '०७.१२ / २९.४०', yoga: 'सिद्ध', yogaEnd: '१७.३२', karana: 'विष्टि', karanaEnd: '२७.५२', rashi: '२४.०१ नं. कर्क' },
  ];

  // November 2026 Panchang Data from image
  const nov2026Data: PanchangRow[] = [
    { date: '१ रवि', tithi: 'कृ. ७', tithiEnd: '१४.५२', nakshatra: 'पुष्य', nakshatraEnd: '२८.३१', yoga: 'साध्य', yogaEnd: '१४.३९', karana: 'बालव', karanaEnd: '२५.५८', rashi: 'कर्क' },
    { date: '२ सोम', tithi: 'कृ. ८', tithiEnd: '१३.११', nakshatra: 'आश्लेषा', nakshatraEnd: '२७.४७', yoga: 'शुभ', yogaEnd: '१२.०७', karana: 'तैतिल', karanaEnd: '२४.३०', rashi: '२७.४७ नं. सिंह' },
    { date: '३ मंगळ', tithi: 'कृ. ९', tithiEnd: '११.५५', nakshatra: 'मघा', nakshatraEnd: '२७.२७', yoga: 'शुक्ल', yogaEnd: '०९.५४', karana: 'वणिज', karanaEnd: '२३.२६', rashi: 'सिंह' },
    { date: '४ बुध', tithi: 'कृ. १०', tithiEnd: '११.०४', nakshatra: 'पूर्वा', nakshatraEnd: '२७.३०', yoga: 'ब्रह्मा / ऐंद्र', yogaEnd: '०८.०१ / ३०.२६', karana: 'बव', karanaEnd: '२२.४७', rashi: 'सिंह' },
    { date: '५ गुरु', tithi: 'कृ. ११', tithiEnd: '१०.३६', nakshatra: 'उत्तरा', nakshatraEnd: '२७.५६', yoga: 'वैधृति', yogaEnd: '२९.१०', karana: 'कौलव', karanaEnd: '२२.३१', rashi: '०९.३५ नं. कन्या' },
    { date: '६ शुक्र', tithi: 'कृ. १२', tithiEnd: '१०.३१', nakshatra: 'हस्त', nakshatraEnd: '२८.४३', yoga: 'विष्कंभ', yogaEnd: '२८.१०', karana: 'गरज', karanaEnd: '२२.३७', rashi: 'कन्या' },
    { date: '७ शनि', tithi: 'कृ. १३', tithiEnd: '१०.४८', nakshatra: 'चित्रा', nakshatraEnd: '२९.५३', yoga: 'प्रीति', yogaEnd: '२७.२८', karana: 'विष्टि', karanaEnd: '२३.०५', rashi: '१७.१५ नं. तुला' },
    { date: '८ रवि', tithi: 'कृ. १४', tithiEnd: '११.२८', nakshatra: 'स्वाती', nakshatraEnd: 'अहोरात्र', yoga: 'आयुष्मान', yogaEnd: '२७.०३', karana: 'चतुष्पाद', karanaEnd: '२३.५७', rashi: 'तुला', isRed: true },
    { date: '९ सोम', tithi: 'अमावास्या', tithiEnd: '१२.३२', nakshatra: 'स्वाती', nakshatraEnd: '०७.२४', yoga: 'सौभाग्य', yogaEnd: '२६.५७', karana: 'किंस्तुघ्न', karanaEnd: '२५.१३', rashi: '२६.४८ नं. वृश्चिक', isRed: true },
    { date: '१० मंगळ', tithi: 'शु. १', tithiEnd: '१४.०१', nakshatra: 'विशाखा', nakshatraEnd: '०९.१९', yoga: 'शोभन', yogaEnd: '२७.१०', karana: 'बालव', karanaEnd: '२६.५४', rashi: 'वृश्चिक', isRed: true },
    { date: '११ बुध', tithi: 'शु. २', tithiEnd: '१५.५४', nakshatra: 'अनुराधा', nakshatraEnd: '११.३८', yoga: 'अतिगंड', yogaEnd: '२७.४०', karana: 'तैतिल', karanaEnd: '२८.५९', rashi: 'वृश्चिक' },
    { date: '१२ गुरु', tithi: 'शु. ३', tithiEnd: '१८.१०', nakshatra: 'ज्येष्ठा', nakshatraEnd: '१४.१९', yoga: 'सुकर्मा', yogaEnd: '२८.२६', karana: 'वणिज', karanaEnd: 'अहोरात्र', rashi: '१४.१९ नं. धनु' },
    { date: '१३ शुक्र', tithi: 'शु. ४', tithiEnd: '२०.४३', nakshatra: 'मूळ', nakshatraEnd: '१७.१७', yoga: 'धृति', yogaEnd: '२९.२३', karana: 'वणिज', karanaEnd: '०७.२५', rashi: 'धनु' },
    { date: '१४ शनि', tithi: 'शु. ५', tithiEnd: '२३.२४', nakshatra: 'पू.षा.', nakshatraEnd: '२०.२५', yoga: 'शूल', yogaEnd: '३०.२३', karana: 'बव', karanaEnd: '१०.०३', rashi: '२७.११ नं. मकर' },
    { date: '१५ रवि', tithi: 'शु. ६', tithiEnd: '२६.०२', nakshatra: 'उ.षा.', nakshatraEnd: '२३.२९', yoga: 'गंड', yogaEnd: 'अहोरात्र', karana: 'कौलव', karanaEnd: '१२.४४', rashi: 'मकर', isRed: true },
    { date: '१६ सोम', tithi: 'शु. ७', tithiEnd: '२८.२०', nakshatra: 'श्रवण', nakshatraEnd: '२६.१७', yoga: 'गंड', yogaEnd: '०७.१६', karana: 'गरज', karanaEnd: '१५.१४', rashi: 'मकर' },
    { date: '१७ मंगळ', tithi: 'शु. ८', tithiEnd: '३०.०६', nakshatra: 'धनिष्ठा', nakshatraEnd: '२८.३५', yoga: 'वृद्धि', yogaEnd: '०७.५४', karana: 'विष्टि', karanaEnd: '१७.१८', rashi: '१५.३१ नं. कुंभ' },
    { date: '१८ बुध', tithi: 'शु. ९', tithiEnd: 'अहोरात्र', nakshatra: 'शततारा', nakshatraEnd: '३०.११', yoga: 'ध्रुव', yogaEnd: '०८.०५', karana: 'बालव', karanaEnd: '१८.४२', rashi: 'कुंभ' },
    { date: '१९ गुरु', tithi: 'शु. ९', tithiEnd: '०७.०७', nakshatra: 'पू.भा.', nakshatraEnd: 'अहोरात्र', yoga: 'व्याघात / हर्षण', yogaEnd: '०७.४३ / ३०.४०', karana: 'तैतिल', karanaEnd: '१९.१८', rashi: '२४.५० नं. मीन' },
    { date: '२० शुक्र', tithi: 'शु. १० / शु. ११', tithiEnd: '०७.१६ / ३०.३२', nakshatra: 'पू.भा.', nakshatraEnd: '०६.५७', yoga: 'वज्र', yogaEnd: '२८.५६', karana: 'वणिज', karanaEnd: '१९.०१', rashi: 'मीन' },
    { date: '२१ शनि', tithi: 'शु. १२', tithiEnd: '२८.५७', nakshatra: 'उ.भा. / रेवती', nakshatraEnd: '०६.५१ / २९.५५', yoga: 'सिद्धि', yogaEnd: '२६.३१', karana: 'बव', karanaEnd: '१७.५१', rashi: '२९.५५ नं. मेष', isRed: true },
    { date: '२२ रवि', tithi: 'शु. १३', tithiEnd: '२६.३८', nakshatra: 'अश्विनी', nakshatraEnd: '२८.१६', yoga: 'व्यतीपात', yogaEnd: '२३.३०', karana: 'कौलव', karanaEnd: '१५.५२', rashi: 'मेष', isRed: true },
    { date: '२३ सोम', tithi: 'शु. १४', tithiEnd: '२३.४३', nakshatra: 'भरणी', nakshatraEnd: '२६.०२', yoga: 'वरीयान', yogaEnd: '१९.५९', karana: 'गरज', karanaEnd: '१३.१४', rashi: 'मेष' },
    { date: '२४ मंगळ', tithi: 'पौर्णिमा', tithiEnd: '२०.२४', nakshatra: 'कृत्तिका', nakshatraEnd: '२३.२५', yoga: 'परिघ', yogaEnd: '१६.०६', karana: 'विष्टि / बालव', karanaEnd: '१०.०६ / ३०.३८', rashi: '०७.२५ नं. वृषभ', isRed: true },
    { date: '२५ बुध', tithi: 'कृ. १', tithiEnd: '१६.५१', nakshatra: 'रोहिणी', nakshatraEnd: '२०.३६', yoga: 'शिव', yogaEnd: '१२.००', karana: 'तैतिल', karanaEnd: '२७.०३', rashi: 'वृषभ' },
    { date: '२६ गुरु', tithi: 'कृ. २', tithiEnd: '१३.१६', nakshatra: 'मृग', nakshatraEnd: '१७.४७', yoga: 'सिद्ध / साध्य', yogaEnd: '०७.५० / २७.४४', karana: 'वणिज', karanaEnd: '२३.३१', rashi: '०७.११ नं. मिथुन' },
    { date: '२७ शुक्र', tithi: 'कृ. ३ / कृ. ४', tithiEnd: '०९.४९ / ३०.४०', nakshatra: 'आर्द्रा', nakshatraEnd: '१५.०९', yoga: 'शुभ', yogaEnd: '२३.५२', karana: 'बव', karanaEnd: '२०.१२', rashi: 'मिथुन', isRed: true },
    { date: '२८ शनि', tithi: 'कृ. ५', tithiEnd: '२७.५८', nakshatra: 'पुनर्वसु', nakshatraEnd: '१२.५०', yoga: 'शुक्ल', yogaEnd: '२०.१८', karana: 'कौलव', karanaEnd: '१७.१५', rashi: '०७.२३ नं. कर्क' },
    { date: '२९ रवि', tithi: 'कृ. ६', tithiEnd: '२५.४७', nakshatra: 'पुष्य', nakshatraEnd: '११.००', yoga: 'ब्रह्मा', yogaEnd: '१७.०९', karana: 'गरज', karanaEnd: '१४.४८', rashi: 'कर्क', isRed: true },
    { date: '३० सोम', tithi: 'कृ. ७', tithiEnd: '२४.१२', nakshatra: 'आश्लेषा', nakshatraEnd: '०९.४२', yoga: 'ऐंद्र', yogaEnd: '१४.२७', karana: 'विष्टि', karanaEnd: '१२.५५', rashi: '०९.४२ नं. सिंह' },
  ];

  // December 2026 Panchang Data from image
  const dec2026Data: PanchangRow[] = [
    { date: '१ मंगळ', tithi: 'कृ. ८', tithiEnd: '२३.१४', nakshatra: 'मघा', nakshatraEnd: '०९.०१', yoga: 'वैधृति', yogaEnd: '१२.१५', karana: 'बालव', karanaEnd: '११.३९', rashi: 'सिंह' },
    { date: '२ बुध', tithi: 'कृ. ९', tithiEnd: '२२.५३', nakshatra: 'पूर्वा', nakshatraEnd: '०८.५५', yoga: 'विष्कंभ', yogaEnd: '१०.३२', karana: 'तैतिल', karanaEnd: '१०.५९', rashi: '१४.५९ नं. कन्या' },
    { date: '३ गुरु', tithi: 'कृ. १०', tithiEnd: '२३.०४', nakshatra: 'उत्तरा', nakshatraEnd: '०९.२४', yoga: 'प्रीति', yogaEnd: '०९.१५', karana: 'वणिज', karanaEnd: '१०.५४', rashi: 'कन्या' },
    { date: '४ शुक्र', tithi: 'कृ. ११', tithiEnd: '२३.४५', nakshatra: 'हस्त', nakshatraEnd: '१०.२३', yoga: 'आयुष्मान', yogaEnd: '०८.२४', karana: 'बव', karanaEnd: '११.२१', rashi: '२३.०३ नं. तुला' },
    { date: '५ शनि', tithi: 'कृ. १२', tithiEnd: '२४.५२', nakshatra: 'चित्रा', nakshatraEnd: '११.४९', yoga: 'सौभाग्य', yogaEnd: '०७.५३', karana: 'कौलव', karanaEnd: '१२.१६', rashi: 'तुला' },
    { date: '६ रवि', tithi: 'कृ. १३', tithiEnd: '२६.२३', nakshatra: 'स्वाती', nakshatraEnd: '१३.३८', yoga: 'शोभन', yogaEnd: '०७.४२', karana: 'गरज', karanaEnd: '१३.३५', rashi: 'तुला', isRed: true },
    { date: '७ सोम', tithi: 'कृ. १४', tithiEnd: '२८.१३', nakshatra: 'विशाखा', nakshatraEnd: '१५.४८', yoga: 'अतिगंड', yogaEnd: '०७.४७', karana: 'विष्टि', karanaEnd: '१५.१५', rashi: '०९.१४ नं. वृश्चिक' },
    { date: '८ मंगळ', tithi: 'अमावास्या', tithiEnd: '३०.२२', nakshatra: 'अनुराधा', nakshatraEnd: '१८.१६', yoga: 'सुकर्मा', yogaEnd: '०८.०७', karana: 'चतुष्पाद', karanaEnd: '१७.१५', rashi: 'वृश्चिक', isRed: true },
    { date: '९ बुध', tithi: 'शु. १', tithiEnd: 'अहोरात्र', nakshatra: 'ज्येष्ठा', nakshatraEnd: '२१.०१', yoga: 'धृति', yogaEnd: '०८.४०', karana: 'किंस्तुघ्न', karanaEnd: '१९.३२', rashi: '२१.०१ नं. धनु' },
    { date: '१० गुरु', tithi: 'शु. १', tithiEnd: '०८.४७', nakshatra: 'मूळ', nakshatraEnd: '२३.५८', yoga: 'शूल', yogaEnd: '०९.२५', karana: 'बालव', karanaEnd: '२२.०४', rashi: 'धनु' },
    { date: '११ शुक्र', tithi: 'शु. २', tithiEnd: '११.२३', nakshatra: 'पू.षा.', nakshatraEnd: '२७.०५', yoga: 'गंड', yogaEnd: '१०.१८', karana: 'तैतिल', karanaEnd: '२४.४५', rashi: 'धनु' },
    { date: '१२ शनि', tithi: 'शु. ३', tithiEnd: '१४.०७', nakshatra: 'उ.षा.', nakshatraEnd: '३०.१२', yoga: 'वृद्धि', yogaEnd: '११.१७', karana: 'वणिज', karanaEnd: '२७.२८', rashi: '०९.५२ नं. मकर' },
    { date: '१३ रवि', tithi: 'शु. ४', tithiEnd: '१६.४८', nakshatra: 'श्रवण', nakshatraEnd: 'अहोरात्र', yoga: 'ध्रुव', yogaEnd: '१२.१५', karana: 'बव', karanaEnd: '३०.०५', rashi: 'मकर', isRed: true },
    { date: '१४ सोम', tithi: 'शु. ५', tithiEnd: '१९.१७', nakshatra: 'श्रवण', nakshatraEnd: '०९.१२', yoga: 'व्याघात', yogaEnd: '१३.०५', karana: 'कौलव', karanaEnd: 'अहोरात्र', rashi: '२२.३६ नं. कुंभ' },
    { date: '१५ मंगळ', tithi: 'शु. ६', tithiEnd: '२१.२०', nakshatra: 'धनिष्ठा', nakshatraEnd: '११.५३', yoga: 'हर्षण', yogaEnd: '१३.३८', karana: 'कौलव', karanaEnd: '०८.२२', rashi: 'कुंभ' },
    { date: '१६ बुध', tithi: 'शु. ७', tithiEnd: '२२.४६', nakshatra: 'शततारा', nakshatraEnd: '१४.०३', yoga: 'वज्र', yogaEnd: '१३.४६', karana: 'गरज', karanaEnd: '१०.०८', rashi: 'कुंभ' },
    { date: '१७ गुरु', tithi: 'शु. ८', tithiEnd: '२३.२७', nakshatra: 'पू.भा.', nakshatraEnd: '१५.३१', yoga: 'सिद्धि', yogaEnd: '१३.२२', karana: 'विष्टि', karanaEnd: '११.१३', rashi: '०९.१३ नं. मीन' },
    { date: '१८ शुक्र', tithi: 'शु. ९', tithiEnd: '२३.१५', nakshatra: 'उ.भा.', nakshatraEnd: '१६.१०', yoga: 'व्यतीपात', yogaEnd: '१२.१९', karana: 'बालव', karanaEnd: '११.२७', rashi: 'मीन' },
    { date: '१९ शनि', tithi: 'शु. १०', tithiEnd: '२२.१०', nakshatra: 'रेवती', nakshatraEnd: '१५.५८', yoga: 'वरीयान', yogaEnd: '१०.३५', karana: 'तैतिल', karanaEnd: '१०.४९', rashi: '१५.५८ नं. मेष' },
    { date: '२० रवि', tithi: 'शु. ११', tithiEnd: '२०.१५', nakshatra: 'अश्विनी', nakshatraEnd: '१४.५६', yoga: 'परिघ / शिव', yogaEnd: '०८.१० / २९.०७', karana: 'वणिज / बव', karanaEnd: '०९.१८ / ३१.०१', rashi: 'मेष', isRed: true },
    { date: '२१ सोम', tithi: 'शु. १२', tithiEnd: '१७.३७', nakshatra: 'भरणी', nakshatraEnd: '१३.०९', yoga: 'सिद्ध', yogaEnd: '२५.३२', karana: 'कौलव', karanaEnd: '२८.०४', rashi: '१८.३६ नं. वृषभ' },
    { date: '२२ मंगळ', tithi: 'शु. १३', tithiEnd: '१४.२४', nakshatra: 'कृत्तिका', nakshatraEnd: '१०.४६', yoga: 'साध्य', yogaEnd: '२१.३२', karana: 'गरज', karanaEnd: '२४.३८', rashi: 'वृषभ' },
    { date: '२३ बुध', tithi: 'शु. १४ / पौर्णिमा', tithiEnd: '१०.४८ / ३०.५८', nakshatra: 'रोहिणी / मृग', nakshatraEnd: '०७.५७ / २८.५३', yoga: 'शुभ', yogaEnd: '१७.१६', karana: 'विष्टि', karanaEnd: '२०.५४', rashi: '१८.२६ नं. मिथुन', isRed: true },
    { date: '२४ गुरु', tithi: 'कृ. १', tithiEnd: '२७.०८', nakshatra: 'आर्द्रा', nakshatraEnd: '२५.४७', yoga: 'शुक्ल', yogaEnd: '१२.५१', karana: 'बालव', karanaEnd: '१७.०२', rashi: 'मिथुन' },
    { date: '२५ शुक्र', tithi: 'कृ. २', tithiEnd: '२३.२६', nakshatra: 'पुनर्वसु', nakshatraEnd: '२२.५०', yoga: 'ब्रह्मा / ऐंद्र', yogaEnd: '०८.२९ / २८.१६', karana: 'तैतिल', karanaEnd: '१३.१५', rashi: '१७.३३ नं. कर्क', isRed: true },
    { date: '२६ शनि', tithi: 'कृ. ३', tithiEnd: '२०.०६', nakshatra: 'पुष्य', nakshatraEnd: '२०.१३', yoga: 'वैधृति', yogaEnd: '२४.२२', karana: 'वणिज / बव', karanaEnd: '०९.४३ / ३०.३५', rashi: 'कर्क' },
    { date: '२७ रवि', tithi: 'कृ. ४', tithiEnd: '१७.१४', nakshatra: 'आश्लेषा', nakshatraEnd: '१८.०५', yoga: 'विष्कंभ', yogaEnd: '२०.५४', karana: 'कौलव', karanaEnd: '२८.०१', rashi: '१८.०५ नं. सिंह', isRed: true },
    { date: '२८ सोम', tithi: 'कृ. ५', tithiEnd: '१४.५९', nakshatra: 'मघा', nakshatraEnd: '१६.३३', yoga: 'प्रीति', yogaEnd: '१७.५५', karana: 'गरज', karanaEnd: '२६.०७', rashi: 'सिंह' },
    { date: '२९ मंगळ', tithi: 'कृ. ६', tithiEnd: '१३.२५', nakshatra: 'पूर्वा', nakshatraEnd: '१५.४३', yoga: 'आयुष्मान', yogaEnd: '१५.३१', karana: 'विष्टि', karanaEnd: '२४.५६', rashi: '२१.३८ नं. कन्या' },
    { date: '३० बुध', tithi: 'कृ. ७', tithiEnd: '१२.३७', nakshatra: 'उत्तरा', nakshatraEnd: '१५.३७', yoga: 'सौभाग्य', yogaEnd: '१३.४१', karana: 'बालव', karanaEnd: '२४.३०', rashi: 'कन्या' },
    { date: '३१ गुरु', tithi: 'कृ. ८', tithiEnd: '१२.३३', nakshatra: 'हस्त', nakshatraEnd: '१६.१४', yoga: 'शोभन', yogaEnd: '१२.२७', karana: 'तैतिल', karanaEnd: '२४.४७', rashi: '२८.४७ नं. तुला' },
  ];

  const currentMonth = months[selectedMonthIndex];
  const currentMonthData = currentMonth.id === 'dec_2026'
    ? dec2026Data
    : currentMonth.id === 'nov_2026'
    ? nov2026Data
    : currentMonth.id === 'oct_2026'
    ? oct2026Data
    : currentMonth.id === 'sep_2026'
    ? sep2026Data
    : currentMonth.id === 'aug_2026'
    ? aug2026Data
    : currentMonth.id === 'jul_2026'
    ? jul2026Data
    : currentMonth.id === 'jun_2026'
    ? jun2026Data
    : currentMonth.id === 'may_2026'
    ? may2026Data
    : currentMonth.id === 'apr_2026'
    ? apr2026Data
    : currentMonth.id === 'mar_2026'
    ? mar2026Data
    : currentMonth.id === 'feb_2026'
    ? feb2026Data
    : jan2026Data;

  const monthTitleHeader = currentMonth.id === 'dec_2026'
    ? 'कार्तिक – मार्गशीर्ष'
    : currentMonth.id === 'nov_2026'
    ? 'आश्विन – कार्तिक'
    : currentMonth.id === 'oct_2026'
    ? 'भाद्रपद–आश्विन'
    : currentMonth.id === 'sep_2026'
    ? 'श्रावण – भाद्रपद'
    : currentMonth.id === 'aug_2026'
    ? 'आषाढ–श्रावण'
    : currentMonth.id === 'jul_2026'
    ? 'निज ज्येष्ठ – आषाढ'
    : currentMonth.id === 'jun_2026'
    ? 'अधिक ज्येष्ठ – निज ज्येष्ठ'
    : currentMonth.id === 'may_2026'
    ? 'वैशाख – अधिक ज्येष्ठ'
    : currentMonth.id === 'apr_2026'
    ? 'चैत्र – वैशाख'
    : currentMonth.id === 'mar_2026'
    ? 'फाल्गुन – चैत्र'
    : currentMonth.id === 'feb_2026'
    ? 'माघ – फाल्गुन'
    : 'पौष – माघ';

  const samvatRituHeader = currentMonth.id === 'dec_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, दक्षिणायन–उत्तरायण, सौर हेमंत–शिशिर ऋतू'
    : currentMonth.id === 'nov_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, दक्षिणायन, सौर हेमंत ऋतू'
    : currentMonth.id === 'oct_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, दक्षिणायन, सौर शरद-हेमंत ऋतू'
    : currentMonth.id === 'sep_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, दक्षिणायन, सौर शरद ऋतू'
    : currentMonth.id === 'aug_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, दक्षिणायन, सौर वर्षा–शरद ऋतू'
    : currentMonth.id === 'jul_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, दक्षिणायन, सौर वर्षा ऋतू'
    : currentMonth.id === 'jun_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, उत्तरायण–दक्षिणायन, सौर ग्रीष्म–वर्षा ऋतू'
    : currentMonth.id === 'may_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, उत्तरायण, सौर ग्रीष्म ऋतू'
    : currentMonth.id === 'apr_2026'
    ? 'कलियुग वर्ष ५१२८, श्री शालिवाहन संवत् (शक) १९४८, पराभव नाम संवत्सर, उत्तरायण, सौर वसंत-ग्रीष्म ऋतू'
    : currentMonth.id === 'mar_2026'
    ? 'कलियुग वर्ष ५१२७-५१२८, श्री शालिवाहन संवत् (शक) १९४७-१९४८, विश्वावसु-पराभव नाम संवत्सर, उत्तरायण, सौर वसंत ऋतू'
    : currentMonth.id === 'feb_2026'
    ? 'कलियुग वर्ष ५१२७, श्री शालिवाहन संवत् (शक) १९४७, विश्वावसुनाम संवत्सर, उत्तरायण, सौर शिशिर-वसंत ऋतू'
    : 'कलियुग वर्ष ५१२७, श्री शालिवाहन संवत् (शक) १९४७, विश्वावसुनाम संवत्सर, उत्तरायण, सौर शिशिर ऋतू';

  // Weekday row definitions with traditional colors matching the calendar
  const WEEKDAYS = [
    { key: 'रवि', label: 'रवि', full: 'रविवार', bg: 'bg-red-600 text-white border-red-700' },
    { key: 'सोम', label: 'सोम', full: 'सोमवार', bg: 'bg-blue-600 text-white border-blue-700' },
    { key: 'मंगळ', label: 'मंगळ', full: 'मंगळवार', bg: 'bg-fuchsia-600 text-white border-fuchsia-700' },
    { key: 'बुध', label: 'बुध', full: 'बुधवार', bg: 'bg-emerald-600 text-white border-emerald-700' },
    { key: 'गुरु', label: 'गुरु', full: 'गुरुवार', bg: 'bg-purple-600 text-white border-purple-700' },
    { key: 'शुक्र', label: 'शुक्र', full: 'शुक्रवार', bg: 'bg-indigo-700 text-white border-indigo-800' },
    { key: 'शनि', label: 'शनि', full: 'शनिवार', bg: 'bg-rose-900 text-white border-rose-950' },
  ];

  // Calculate 7-row x 5-column calendar matrix for current month
  const firstDayShort = currentMonthData[0]?.date.split(' ')[1] || 'रवि';
  const startWeekdayIdx = WEEKDAYS.findIndex(w => w.key === firstDayShort);
  const safeStartIdx = startWeekdayIdx !== -1 ? startWeekdayIdx : 0;

  const calendarGrid: (PanchangRow | null)[][] = Array.from({ length: 7 }, () => Array(5).fill(null));

  currentMonthData.forEach((row, idx) => {
    const totalPos = safeStartIdx + idx;
    const rowIdx = totalPos % 7;
    const colIdx = Math.floor(totalPos / 7);
    if (colIdx < 5) {
      calendarGrid[rowIdx][colIdx] = row;
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-3 font-devanagari animate-fade-in">
      {/* 1. TOP BLUE BANNER MATCHING TRADITIONAL MAHANUBHAV SHAK CALENDAR */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 text-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-sky-300 text-center font-bold">
        <div className="text-base sm:text-xl font-black tracking-wide drop-shadow-xs">
          सर्वज्ञ श्रीचक्रधर शक ८०४
        </div>
        <div className="text-xs sm:text-base text-sky-100 font-extrabold mt-0.5">
          महानुभावीय {monthTitleHeader}
        </div>
      </div>

      {/* 2. INSTRUCTION & TIP NOTICE BOX */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-2 sm:p-2.5 text-center text-xs text-amber-950 font-bold space-y-0.5 shadow-2xs">
        <div className="flex items-center justify-center gap-1.5 text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>तारखेवर क्लिक करून संपूर्ण धार्मिक माहिती व शुभ योग पहा</span>
        </div>
        <div className="text-amber-800 text-[11px] font-semibold">
          संपूर्ण दिनदर्शिका पाहण्यासाठी डावीकडे/उजवीकडे स्क्रोल करा →
        </div>
      </div>

      {/* 3. MONTH SLIDER WITH PREV/NEXT BUTTONS */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setSelectedMonthIndex(prev => Math.max(0, prev - 1))}
          disabled={selectedMonthIndex === 0}
          className="p-1.5 sm:p-2 bg-amber-500 text-white hover:bg-amber-600 active:scale-95 disabled:opacity-30 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer flex items-center justify-center"
          title="मागील महिना"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={monthListRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 no-scrollbar flex-1 scroll-smooth"
        >
          {months.map((m, idx) => {
            const isSelected = idx === selectedMonthIndex;
            const isCurrent = idx === currentRunningMonthIndex;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMonthIndex(idx)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105 z-10'
                    : isCurrent
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                    : 'bg-amber-50 text-amber-950 border-amber-200/80 hover:bg-amber-100'
                }`}
              >
                <span>{m.name}</span>
                {isCurrent && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-white text-amber-900' : 'bg-emerald-600 text-white'}`}>
                    चालू
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSelectedMonthIndex(prev => Math.min(months.length - 1, prev + 1))}
          disabled={selectedMonthIndex === months.length - 1}
          className="p-1.5 sm:p-2 bg-amber-500 text-white hover:bg-amber-600 active:scale-95 disabled:opacity-30 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer flex items-center justify-center"
          title="पुढील महिना"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 4. VIEW MODE TOGGLE & ZOOM CONTROL TOOLBAR */}
      <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-lg border border-amber-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-950 hover:bg-amber-50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>दिनदर्शिका ग्रिड</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-950 hover:bg-amber-50'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>तालिका रूप</span>
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          <button
            onClick={handleZoomOut}
            disabled={zoomScale <= 0.30}
            className="p-1.5 bg-white border border-amber-300 hover:bg-amber-50 disabled:opacity-40 rounded-lg text-amber-950 shadow-2xs font-bold transition-all cursor-pointer"
            title="झूम कमी करा (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="px-2 py-1 bg-amber-900 text-amber-100 font-mono font-bold text-xs rounded-lg shadow-2xs min-w-[46px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoomScale >= 2.5}
            className="p-1.5 bg-white border border-amber-300 hover:bg-amber-50 disabled:opacity-40 rounded-lg text-amber-950 shadow-2xs font-bold transition-all cursor-pointer"
            title="झूम वाढवा (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 border-l border-amber-300 pl-1.5 ml-0.5 flex-wrap">
            {[0.6, 0.8, 1.0, 1.2].map(scale => (
              <button
                key={scale}
                onClick={() => setZoomScale(scale)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  Math.abs(zoomScale - scale) < 0.05
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white/80 hover:bg-white text-amber-950 border border-amber-200'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>

          {zoomScale !== 0.60 && (
            <button
              onClick={handleZoomReset}
              className="p-1.5 bg-amber-200 border border-amber-400 hover:bg-amber-300 rounded-lg text-amber-950 shadow-2xs font-bold transition-all flex items-center gap-1 text-xs cursor-pointer ml-0.5"
              title="रीसेट"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">रीसेट</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. MAIN CALENDAR DISPLAY CONTAINER (GRID OR TABLE) WITH PINCH ZOOM SUPPORT */}
      <div 
        ref={containerRef}
        className="bg-white rounded-2xl border-2 border-amber-400 shadow-xl overflow-hidden touch-pan-x touch-pan-y p-1 sm:p-2"
        style={{
          height: tableHeight ? `${tableHeight * zoomScale}px` : 'auto',
          overflow: 'hidden'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          style={{ 
            transform: `scale(${zoomScale})`, 
            transformOrigin: 'top left',
            width: `${100 / zoomScale}%`,
            transition: touchStartDistRef.current !== null ? 'none' : 'transform 0.15s ease-out'
          }}
          className="overflow-hidden"
        >
          {viewMode === 'grid' ? (
            /* TRADITIONAL 7-ROW x 5-COLUMN MONTHLY CALENDAR GRID */
            <div ref={tableRef as any} className="w-full bg-amber-50/30">
              <table className="w-full border-collapse border-2 border-amber-300 bg-white shadow-xs">
                <tbody>
                  {WEEKDAYS.map((dayHeader, rowIdx) => (
                    <tr key={dayHeader.key} className="border-b-2 border-amber-200">
                      {/* Left Column: Weekday Badge Header */}
                      <td className={`p-1 sm:p-2 text-center font-bold ${dayHeader.bg} w-16 sm:w-22 border-r-2 border-amber-400 select-none`}>
                        <div className="text-base sm:text-xl font-black tracking-tight">{dayHeader.label}</div>
                        <div className="text-[10px] sm:text-xs opacity-90 font-semibold">{dayHeader.full}</div>
                      </td>

                      {/* 5 Columns for Dates */}
                      {[0, 1, 2, 3, 4].map(colIdx => {
                        const cellData = calendarGrid[rowIdx][colIdx];
                        if (!cellData) {
                          return (
                            <td 
                              key={colIdx} 
                              className="p-1 sm:p-2 border-r border-amber-200 bg-amber-50/20 text-center min-w-[55px] sm:min-w-[85px] h-16 sm:h-20"
                            />
                          );
                        }

                        const isSunday = rowIdx === 0;
                        const isPurnima = cellData.tithi.includes('पौर्णिमा');
                        const isAmavasya = cellData.tithi.includes('अमावास्या') || cellData.tithi.includes('अमावस्या');
                        const isEkadashi = cellData.tithi.includes('११') || cellData.tithi.includes('एकादशी');
                        const isRedText = isSunday || cellData.isRed || isPurnima || isAmavasya;

                        const dayNumStr = cellData.date.split(' ')[0];

                        return (
                          <td
                            key={colIdx}
                            onClick={() => setSelectedDayRow(cellData)}
                            className="p-1 sm:p-2 border-r border-amber-200 bg-white hover:bg-amber-100/90 active:bg-amber-200 cursor-pointer transition-colors text-center relative min-w-[55px] sm:min-w-[85px] h-16 sm:h-20 align-top"
                            title="माहिती पाहण्यासाठी क्लिक करा"
                          >
                            <div className="flex flex-col items-center justify-between h-full py-0.5">
                              {/* Big Bold Date Number */}
                              <div className={`text-xl sm:text-3xl leading-none font-black ${isRedText ? 'text-red-600' : 'text-blue-900'}`}>
                                {dayNumStr}
                              </div>

                              {/* Special Religious Icons & Badges */}
                              <div className="flex items-center justify-center gap-0.5 mt-0.5 flex-wrap">
                                {isPurnima && (
                                  <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5" title="पौर्णिमा">
                                    <Moon className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                                    <span className="text-[9px] text-amber-900 font-bold hidden sm:inline">पौर्णिमा</span>
                                  </span>
                                )}
                                {isAmavasya && (
                                  <span className="text-xs text-gray-800 font-bold flex items-center gap-0.5" title="अमावास्या">
                                    <Moon className="w-3.5 h-3.5 fill-gray-900 text-gray-900 shrink-0" />
                                    <span className="text-[9px] text-gray-900 font-bold hidden sm:inline">अमावास्या</span>
                                  </span>
                                )}
                                {isEkadashi && (
                                  <span className="text-[11px]" title="एकादशी">
                                    ⚙️
                                  </span>
                                )}
                                {!isPurnima && !isAmavasya && !isEkadashi && cellData.isRed && (
                                  <span className="text-[11px]" title="विशेष सण / पर्वकाळ">
                                    🚩
                                  </span>
                                )}
                              </div>

                              {/* Short Tithi Label */}
                              <div className="text-[9px] sm:text-[10px] text-gray-600 font-bold truncate max-w-full">
                                {cellData.tithi}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* TRADITIONAL TABULAR LIST VIEW */
            <table 
              ref={tableRef as any}
              className="w-full text-left border-collapse min-w-0 text-[10px] sm:text-xs"
            >
              <thead>
                <tr className="bg-pink-100/90 text-pink-900 border-b-2 border-pink-400 font-bold text-center">
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300">
                    {months[selectedMonthIndex].name.split(' ')[0]}
                    <span className="block text-[9px] font-normal text-pink-700">तारीख व वार</span>
                  </th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300">
                    {monthTitleHeader}
                    <span className="block text-[9px] font-normal text-pink-700">तिथी</span>
                  </th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300 text-pink-800">पर्यंत</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300">नक्षत्र</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300 text-pink-800">पर्यंत</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300">योग</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300 text-pink-800">पर्यंत</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300">करण</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2 border-r border-pink-300 text-pink-800">पर्यंत</th>
                  <th className="py-1 px-1 sm:py-1.5 sm:px-2">चंद्र राशी</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-pink-200">
                {currentMonthData.map((row, idx) => {
                  const isSunday = row.date.includes('रवि');
                  const isPurnima = row.tithi.includes('पौर्णिमा');
                  const isAmavasya = row.tithi.includes('अमावास्या') || row.tithi.includes('अमावस्या');
                  const isHighlight = row.isRed || isSunday || isPurnima || isAmavasya;

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedDayRow(row)}
                      title="दिवसाची माहिती पाहण्यासाठी क्लिक करा"
                      className={`transition-colors text-center cursor-pointer active:bg-amber-200 ${
                        isHighlight
                          ? 'bg-rose-50/90 hover:bg-rose-100/90 text-rose-700 font-bold'
                          : idx % 2 === 0
                          ? 'bg-white hover:bg-pink-50/50 text-gray-800'
                          : 'bg-pink-50/30 hover:bg-pink-50/80 text-gray-800'
                      }`}
                    >
                      <td className={`py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 whitespace-nowrap ${isHighlight ? 'text-rose-700 font-extrabold' : 'text-purple-950 font-bold'}`}>
                        {row.date}
                      </td>
                      <td className={`py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 whitespace-nowrap ${isPurnima || isAmavasya ? 'text-rose-800 font-extrabold underline' : isHighlight ? 'text-rose-700 font-bold' : 'text-gray-900'}`}>
                        {row.tithi}
                      </td>
                      <td className="py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 font-mono text-[9px] sm:text-[11px] text-gray-700">
                        {row.tithiEnd}
                      </td>
                      <td className={`py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 whitespace-nowrap ${isHighlight ? 'text-rose-700' : 'text-gray-900 font-medium'}`}>
                        {row.nakshatra}
                      </td>
                      <td className="py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 font-mono text-[9px] sm:text-[11px] text-gray-700">
                        {row.nakshatraEnd}
                      </td>
                      <td className={`py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 whitespace-nowrap ${isHighlight ? 'text-rose-700' : 'text-gray-900'}`}>
                        {row.yoga}
                      </td>
                      <td className="py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 font-mono text-[9px] sm:text-[11px] text-gray-700">
                        {row.yogaEnd}
                      </td>
                      <td className={`py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 whitespace-nowrap ${isHighlight ? 'text-rose-700' : 'text-gray-900'}`}>
                        {row.karana}
                      </td>
                      <td className="py-0.5 px-1 sm:py-1 sm:px-2 border-r border-pink-200 font-mono text-[9px] sm:text-[11px] text-gray-700">
                        {row.karanaEnd}
                      </td>
                      <td className={`py-0.5 px-1 sm:py-1 sm:px-2 whitespace-nowrap ${isHighlight ? 'text-rose-700 font-bold' : 'text-purple-900 font-medium'}`}>
                        {row.rashi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 6. SAMVAT & RITU HEADER FOOTER */}
      <div className="bg-pink-50/90 border-2 border-pink-300 rounded-2xl p-2.5 sm:p-3 text-center text-pink-900 shadow-2xs">
        <p className="text-xs sm:text-sm font-bold leading-relaxed">
          {samvatRituHeader}
        </p>
      </div>

      {/* 7. FOOTER INFO LEGEND */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 font-bold text-rose-700">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span>
            लाल रंग: विशेष तिथी, सण, रविवारी व पर्वकाळ
          </span>
          <span className="flex items-center gap-1 font-bold text-blue-900">
            <span className="w-2.5 h-2.5 bg-blue-900 rounded-full inline-block"></span>
            निळा रंग: इतर वार व तारखा
          </span>
        </div>
        <span className="text-amber-800 text-[11px] font-bold">
          ॥ श्री चक्रधर स्वामी कृपा ॥
        </span>
      </div>

      {/* 8. DAY DETAILS MODAL POPUP */}
      {selectedDayRow && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedDayRow(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full border-2 border-amber-400 shadow-2xl p-5 space-y-4 font-devanagari text-gray-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div>
                <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <span>{selectedDayRow.date}</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-md font-semibold">
                    {months[selectedMonthIndex].name}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">दैनिक पंचांग सविस्तर माहिती</p>
              </div>
              <button
                onClick={() => setSelectedDayRow(null)}
                className="p-1.5 rounded-full hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                title="बंद करा"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-amber-50/90 p-3 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-amber-800">तिथी (Tithi)</p>
                <p className="font-extrabold text-amber-950 text-base mt-0.5">{selectedDayRow.tithi}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">समाप्ती: {selectedDayRow.tithiEnd}</p>
              </div>

              <div className="bg-amber-50/90 p-3 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-amber-800">नक्षत्र (Nakshatra)</p>
                <p className="font-extrabold text-amber-950 text-base mt-0.5">{selectedDayRow.nakshatra}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">समाप्ती: {selectedDayRow.nakshatraEnd}</p>
              </div>

              <div className="bg-amber-50/90 p-3 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-amber-800">योग (Yoga)</p>
                <p className="font-extrabold text-amber-950 text-base mt-0.5">{selectedDayRow.yoga}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">समाप्ती: {selectedDayRow.yogaEnd}</p>
              </div>

              <div className="bg-amber-50/90 p-3 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-amber-800">करण (Karana)</p>
                <p className="font-extrabold text-amber-950 text-base mt-0.5">{selectedDayRow.karana}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">समाप्ती: {selectedDayRow.karanaEnd}</p>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-sm flex justify-between items-center">
              <span className="font-bold text-purple-900">चंद्र राशी प्रवेश:</span>
              <span className="font-extrabold text-purple-950 text-base">{selectedDayRow.rashi}</span>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setSelectedDayRow(null)}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer text-sm"
              >
                बंद करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanchangView;
