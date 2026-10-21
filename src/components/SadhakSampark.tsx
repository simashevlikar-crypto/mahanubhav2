import React, { useState, useMemo, useEffect } from 'react';
import { sadhakContactsList, SadhakContact } from '../data/sadhakSamparkData';
import SadhakAdminModal from './SadhakAdminModal';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Phone,
  Search,
  MapPin,
  Building,
  User,
  Share2,
  Copy,
  Check,
  Grid,
  List,
  Sparkles,
  PhoneCall,
  Info,
  ArrowUpDown,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface Props {
  lang: 'mr' | 'hi' | 'en';
}

// Authentic WhatsApp Brand Logo Icon
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Official WhatsApp Green circular speech bubble */}
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2Z"
        fill="#25D366"
      />
      {/* Official WhatsApp White telephone handset */}
      <path
        d="M16.57 14.43C16.32 14.3 15.1 13.7 14.87 13.62C14.64 13.53 14.48 13.49 14.31 13.74C14.15 13.99 13.68 14.54 13.53 14.71C13.39 14.87 13.24 14.89 12.99 14.77C12.74 14.64 11.94 14.38 10.99 13.53C10.25 12.87 9.75 12.06 9.6 11.81C9.46 11.56 9.59 11.43 9.71 11.3C9.82 11.19 9.96 11.01 10.08 10.86C10.21 10.72 10.25 10.61 10.33 10.45C10.41 10.28 10.37 10.14 10.31 10.01C10.25 9.89 9.75 8.67 9.55 8.17C9.35 7.68 9.14 7.75 8.99 7.74C8.84 7.73 8.68 7.73 8.51 7.73C8.35 7.73 8.08 7.79 7.85 8.04C7.62 8.29 6.98 8.89 6.98 10.11C6.98 11.33 7.87 12.51 7.99 12.67C8.11 12.84 9.74 15.34 12.22 16.42C12.81 16.68 13.27 16.83 13.63 16.94C14.22 17.13 14.76 17.1 15.19 17.04C15.67 16.97 16.66 16.44 16.86 15.86C17.07 15.28 17.07 14.79 17.01 14.68C16.95 14.58 16.81 14.54 16.57 14.43Z"
        fill="white"
      />
    </svg>
  );
}

export default function SadhakSampark({ lang }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('सर्व');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'kram' | 'name' | 'location'>('kram');

  // Admin Modal state
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // Custom contacts added by Admin (stored in Firestore + localStorage cache)
  const [addedContacts, setAddedContacts] = useState<SadhakContact[]>(() => {
    try {
      const saved = localStorage.getItem('custom_sadhak_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real-time Firestore listener for sadhak_contacts
  useEffect(() => {
    try {
      const q = query(collection(db, 'sadhak_contacts'), orderBy('srNo', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: SadhakContact[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            srNo: Number(data.srNo) || 0,
            location: data.location || '',
            placeName: data.placeName || '',
            personName: data.personName || '',
            phones: Array.isArray(data.phones) ? data.phones : [],
            displayPhones: data.displayPhones || '',
            districtGroup: data.districtGroup || 'इतर'
          });
        });

        if (list.length > 0) {
          setAddedContacts(list);
          try {
            localStorage.setItem('custom_sadhak_contacts', JSON.stringify(list));
          } catch {
            // ignore
          }
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'sadhak_contacts');
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore subscription not available:', err);
    }
  }, []);

  // Combined contacts (Base 1232 + Admin Added)
  const allContacts = useMemo(() => {
    const map = new Map<string, SadhakContact>();
    sadhakContactsList.forEach(c => map.set(c.id, c));
    addedContacts.forEach(c => map.set(c.id, c));
    return Array.from(map.values());
  }, [addedContacts]);

  // Next sequential number
  const nextSrNo = useMemo(() => {
    if (allContacts.length === 0) return 1;
    const maxSr = Math.max(...allContacts.map(c => c.srNo));
    return maxSr + 1;
  }, [allContacts]);

  // Extract unique districts from all contacts
  const districts = useMemo(() => {
    const list = Array.from(new Set(allContacts.map(c => c.districtGroup).filter(Boolean))) as string[];
    return ['सर्व', ...list.sort((a, b) => a.localeCompare(b, 'mr'))];
  }, [allContacts]);

  // Filtered & sorted contacts
  const filteredContacts = useMemo(() => {
    const result = allContacts.filter(item => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phones.some(p => p.includes(searchTerm.trim())) ||
        item.displayPhones.includes(searchTerm.trim()) ||
        item.srNo.toString() === searchTerm.trim();

      const matchesDist =
        selectedDistrict === 'सर्व' || item.districtGroup === selectedDistrict;

      return matchesSearch && matchesDist;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'kram') {
        return a.srNo - b.srNo;
      }
      if (sortBy === 'name') {
        return a.personName.localeCompare(b.personName, 'mr');
      }
      if (sortBy === 'location') {
        return a.location.localeCompare(b.location, 'mr');
      }
      return 0;
    });
  }, [allContacts, searchTerm, selectedDistrict, sortBy]);

  const handleContactSaved = (saved: SadhakContact) => {
    setAddedContacts(prev => {
      const filtered = prev.filter(c => c.id !== saved.id);
      const updated = [...filtered, saved].sort((a, b) => a.srNo - b.srNo);
      try {
        localStorage.setItem('custom_sadhak_contacts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleContactDeleted = (id: string) => {
    setAddedContacts(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('custom_sadhak_contacts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCopyPhone = (phone: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2500);
    }
  };

  const handleShare = async (item: SadhakContact) => {
    const text = `॥ जय श्रीकृष्ण ॥\nक्र. ${item.srNo}. *${item.personName}*\n📍 ${item.location} - ${item.placeName}\n📞 संपर्क: ${item.phones.join(', ')}\n(महानुभाव विश्व - साधक संपर्क सूची)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.personName,
          text
        });
      } catch {
        // User dismissed share
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('संपर्क माहिती कॉपी झाली आहे!');
    }
  };

  // Convert number to Devanagari numerals
  const toDevanagariNum = (num: number) => {
    const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, d => devanagariDigits[parseInt(d, 10)]);
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in font-devanagari">
      {/* 1. HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-6 shadow-xl border-2 border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#FFD54F] font-bold text-xs border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>महानुभाव पंथ अधिकृत निर्देशिका</span>
                <span className="bg-[#FFD54F] text-amber-950 px-2 py-0.2 rounded-full font-black text-[10px]">
                  संपूर्ण क्रमवारी सूची (१ ते {toDevanagariNum(allContacts.length)})
                </span>
              </div>

              {/* Admin Menu Trigger Button */}
              <button
                onClick={() => setShowAdminModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-amber-950 font-black text-xs border border-amber-300 shadow-md transition-all cursor-pointer"
                title="नवीन संपर्क जोडण्यासाठी ॲडमिन मेनू उघडा"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-950" />
                <span>+ ॲडमिन मेनू : नवीन संपर्क जोडा</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black drop-shadow-md flex items-center gap-2">
              <PhoneCall className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD54F]" />
              <span>साधक संपर्क क्रमांक (क्रमवारी सूची)</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
              महानुभाव पंथातील आदरणीय महंत, साधक, तपस्वी, पूजक आणि श्रीकृष्ण मंदिर व आश्रम यांची मूळ क्रमाने १ ते {toDevanagariNum(allContacts.length)} पर्यंतची अधिकृत संपर्क सूची.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">एकूण नोंदी</div>
              <div className="text-xl sm:text-2xl font-black text-white">{allContacts.length}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-right">
              <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">उपलब्ध परिणाम</div>
              <div className="text-xl sm:text-2xl font-black text-[#FFD54F]">{filteredContacts.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-md space-y-3">
        {/* Search input with Quick Admin Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="साधक नाव, गाव, मंदिर, क्र. (उदा. 82 किंवा कनाशी) किंवा फोन नंबर शोधा..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-200 bg-amber-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdminModal(true)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            title="नवीन संपर्क जोडा"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">नवीन संपर्क जोडा</span>
            <span className="sm:hidden">+ संपर्क</span>
          </button>
        </div>

        {/* District, sorting and view mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* District dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-300">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>जिल्हा / प्रांत:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer max-w-[150px] sm:max-w-none truncate"
              >
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist === 'सर्व' ? 'सर्व जिल्हे' : dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>क्रम:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="kram">मूळ क्रम (१ ते {toDevanagariNum(sadhakContactsList.length)})</option>
                <option value="name">नावानुसार (अ-ज्ञ)</option>
                <option value="location">गावानुसार</option>
              </select>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-amber-700 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="कार्ड दृश्य"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-amber-700 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="सारणी / यादी दृश्य"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. CONTACTS CONTENT VIEW */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-amber-200 shadow-md space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">कोणताही संपर्क आढळला नाही</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            कृपया शोध शब्द तपासा किंवा जिल्हा फिल्टर 'सर्व' वर निवडून पुन्हा प्रयत्न करा.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('सर्व');
              setSortBy('kram');
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            सर्व संपर्क दाखवा
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-amber-200/90 shadow-sm hover:shadow-md hover:border-amber-400 transition-all p-4 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

              <div>
                {/* Header: Location & Sequential Number */}
                <div className="flex items-start justify-between gap-2 mb-2 pt-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{contact.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black font-devanagari text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-lg border border-amber-300">
                      क्र. {toDevanagariNum(contact.srNo)}
                    </span>
                  </div>
                </div>

                {/* Person Name */}
                <h3 className="text-sm sm:text-base font-black text-gray-900 leading-snug group-hover:text-amber-800 transition-colors flex items-start gap-1.5">
                  <User className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{contact.personName}</span>
                </h3>

                {/* Temple / Ashram Name */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1.5 font-semibold">
                  <Building className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">{contact.placeName}</span>
                </div>

                {/* Marathi display numerals */}
                <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-50/70 to-orange-50/50 border border-amber-200/60">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5 flex items-center justify-between">
                    <span>संपर्क क्रमांक:</span>
                    <span className="font-devanagari text-gray-600 font-semibold">{contact.displayPhones}</span>
                  </div>
                  
                  {/* Phone list with direct click-to-call */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {contact.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:border-amber-500 text-xs font-mono font-bold text-amber-950 shadow-2xs hover:bg-amber-50 transition-all cursor-pointer"
                        title="कॉल करा"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100">
                {/* Call Primary */}
                {contact.phones[0] && (
                  <a
                    href={`tel:${contact.phones[0]}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>कॉल करा</span>
                  </a>
                )}

                {/* WhatsApp */}
                {contact.phones[0] && (
                  <a
                    href={`https://wa.me/91${contact.phones[0]}?text=${encodeURIComponent(`॥ जय श्रीकृष्ण ॥\nदंडवत प्रणाम ${contact.personName},\nमी 'महानुभाव विश्व' ॲपवरून संपर्क करत आहे.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-1.5 bg-emerald-50 hover:bg-[#25D366]/20 border border-emerald-300 hover:border-[#25D366] rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs group"
                    title="व्हॉट्सॲपवर संदेश पाठवा"
                  >
                    <WhatsAppIcon className="w-4 h-4 transition-transform group-hover:scale-110 drop-shadow-2xs" />
                  </a>
                )}

                {/* Copy phone */}
                <button
                  onClick={() => handleCopyPhone(contact.phones.join(', '))}
                  className="flex items-center justify-center p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl transition-all cursor-pointer active:scale-95"
                  title="नंबर कॉपी करा"
                >
                  {copiedPhone === contact.phones.join(', ') ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Share */}
                <button
                  onClick={() => handleShare(contact)}
                  className="flex items-center justify-center p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl transition-all cursor-pointer active:scale-95"
                  title="माहिती शेअर करा"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-amber-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-black">
                  <th className="py-2.5 px-3 border-b border-amber-600 w-14 text-center">क्र.</th>
                  <th className="py-2.5 px-3 border-b border-amber-600">गाव / ठिकाण</th>
                  <th className="py-2.5 px-3 border-b border-amber-600">मंदिर / आश्रम / मठ</th>
                  <th className="py-2.5 px-3 border-b border-amber-600">साधक / महंत नाव</th>
                  <th className="py-2.5 px-3 border-b border-amber-600">संपर्क क्रमांक (फोन)</th>
                  <th className="py-2.5 px-3 border-b border-amber-600 text-center">क्रिया</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-xs sm:text-sm">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-950 font-devanagari bg-amber-50/30">
                      {toDevanagariNum(contact.srNo)}
                    </td>
                    <td className="py-2 px-3 font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{contact.location}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-700 font-medium">
                      <div className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{contact.placeName}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 font-bold text-amber-950">
                      <span>{contact.personName}</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs font-bold text-emerald-800">
                          {contact.phones.join(', ')}
                        </span>
                        <span className="text-[10px] text-gray-500 font-devanagari">
                          ({contact.displayPhones})
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {contact.phones[0] && (
                          <a
                            href={`tel:${contact.phones[0]}`}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-all cursor-pointer"
                            title="कॉल करा"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {contact.phones[0] && (
                          <a
                            href={`https://wa.me/91${contact.phones[0]}?text=${encodeURIComponent(`॥ जय श्रीकृष्ण ॥\nदंडवत प्रणाम ${contact.personName}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-[#25D366]/20 border border-emerald-200 hover:border-[#25D366] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center group active:scale-95"
                            title="व्हॉट्सॲपवर संदेश पाठवा"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          </a>
                        )}
                        <button
                          onClick={() => handleCopyPhone(contact.phones.join(', '))}
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-all cursor-pointer"
                          title="कॉपी करा"
                        >
                          {copiedPhone === contact.phones.join(', ') ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER NOTE */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">टीप:</span> ही अधिकृत साधक संपर्क सूची क्रमवारीनुसार (१ ते {toDevanagariNum(allContacts.length)}) उपलब्ध करण्यात आली आहे. यात सर्व महंत, साधक आणि मंदिरांचे संपर्क अखंड क्रमाने उपलब्ध आहेत. अधिकृत ॲडमिन नवीन नोंदी जोडण्यासाठी वरील <strong>'+ ॲडमिन मेनू'</strong> वापरू शकतात.
        </p>
      </div>

      {/* ADMIN MODAL */}
      <SadhakAdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        nextSrNo={nextSrNo}
        existingDistricts={districts}
        onContactSaved={handleContactSaved}
        onContactDeleted={handleContactDeleted}
        addedContacts={addedContacts}
      />
    </div>
  );
}
