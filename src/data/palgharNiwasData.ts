import { NiwasItem } from '../types';

interface RawPalgharNiwas {
  id: string;
  taluka: string;
  village: string;
  name: string;
  nameEn: string;
  contact: string;
  phone: string;
  b?: number;
  t?: number;
  c?: number;
  tot: number;
  loc?: string;
}

const PALGHAR_RAW_DATA: RawPalgharNiwas[] = [
  // १. ता. विक्रमगड (Vikramgad Taluka)
  {
    id: 'niwas_palghar_vikramgad_sukshala',
    taluka: 'विक्रमगड',
    village: 'सुकसाळा',
    name: 'महानुभाव आश्रम, सुकसाळा',
    nameEn: 'Mahanubhav Ashram, Suksala',
    contact: 'व्यवस्थापक',
    phone: '+91 98230 44556',
    b: 3,
    t: 1,
    c: 0,
    tot: 4,
    loc: 'सुकसाळा, ता. विक्रमगड, जि. पालघर'
  },
  {
    id: 'niwas_palghar_vikramgad_toplipada',
    taluka: 'विक्रमगड',
    village: 'टोपलीपाडा',
    name: 'महानुभाव आश्रम, टोपलीपाडा',
    nameEn: 'Mahanubhav Ashram, Toplipada',
    contact: 'व्यवस्थापक',
    phone: '+91 98230 44556',
    b: 2,
    t: 2,
    c: 0,
    tot: 4,
    loc: 'टोपलीपाडा, ता. विक्रमगड, जि. पालघर'
  },

  // २. ता. जव्हार (Jawhar Taluka)
  {
    id: 'niwas_palghar_jawhar_kogda_virajdada',
    taluka: 'जव्हार',
    village: 'कोगदा',
    name: 'महानुभाव आश्रम, कोगदा (प.पू. श्रीविराजदादा)',
    nameEn: 'Mahanubhav Ashram, Kogda (P.P. Shree Virajdada)',
    contact: 'प.पू. श्रीविराजदादा',
    phone: '+91 98230 44556',
    b: 1,
    t: 2,
    c: 0,
    tot: 3,
    loc: 'कोगदा, ता. जव्हार, जि. पालघर'
  },

  // ३. ता. मोखाडा (Mokhada Taluka) - In image: ता. मोरवाडा
  {
    id: 'niwas_palghar_mokhada_morchondi',
    taluka: 'मोखाडा',
    village: 'मोर्चोंडी',
    name: 'महानुभाव आश्रम, मोर्चोंडी',
    nameEn: 'Mahanubhav Ashram, Morchondi',
    contact: 'व्यवस्थापक',
    phone: '+91 98230 44556',
    b: 2,
    t: 0,
    c: 0,
    tot: 2,
    loc: 'मोर्चोंडी, ता. मोखाडा, जि. पालघर'
  },

  // ४. ता. वसई (Vasai Taluka)
  {
    id: 'niwas_palghar_vasai_vasai_sadhabai',
    taluka: 'वसई',
    village: 'वसई',
    name: 'महानुभाव आश्रम, वसई (प.पू. श्रीसाधाबाई खामनीकर)',
    nameEn: 'Mahanubhav Ashram, Vasai (P.P. Shree Sadhabai Khamnikar)',
    contact: 'प.पू. श्रीसाधाबाई खामनीकर',
    phone: '+91 98230 44556',
    b: 0,
    t: 2,
    c: 0,
    tot: 2,
    loc: 'वसई, ता. वसई, जि. पालघर'
  }
];

export const PALGHAR_NIWAS_ITEMS: NiwasItem[] = PALGHAR_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: item.loc || `${item.village}, ता. ${item.taluka}, जि. पालघर`,
  state: 'महाराष्ट्र', // Using same state label standard
  district: 'पालघर',
  taluka: item.taluka,
  village: item.village,
  facilities: {
    mr: ['नित्य पूजावसर व आरती'],
    hi: ['नित्य पूजावसर एवं आरती'],
    en: ['Daily Prayers & Aarti']
  },
  rooms: {
    mr: ['साधारण खोल्या'],
    hi: ['साधारण कमरे'],
    en: ['Standard Rooms']
  },
  contactPerson: item.contact,
  phone: item.phone,
  sevaCharge: {
    mr: 'ऐच्छिक सहकार्य',
    hi: 'ऐच्छिक सहयोग',
    en: 'Voluntary Donation'
  },
  imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
  rating: 4.8,
  bhikshuk: item.b || 0,
  tapasvini: item.t || 0,
  children: item.c || 0,
  totalMembers: item.tot
}));
