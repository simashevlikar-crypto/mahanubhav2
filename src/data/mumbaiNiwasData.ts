import { NiwasItem } from '../types';

interface RawMumbaiNiwas {
  id: string;
  district: string;
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

const MUMBAI_RAW_DATA: RawMumbaiNiwas[] = [
  // १. वडाळा (Wadala)
  {
    id: 'niwas_mumbai_wadala_krishnamandir',
    district: 'मुंबई शहर',
    taluka: 'मुंबई शहर',
    village: 'वडाळा',
    name: 'श्रीकृष्णमंदिर, वडाळा स्टेशन (प.पू.म. श्रीविजयराज शास्त्री)',
    nameEn: 'Shree Krishna Mandir, Wadala Station (P.P.M. Shree Vijayraj Shastri)',
    contact: 'प.पू.म. श्रीविजयराज शास्त्री',
    phone: '+91 98200 12345',
    b: 3,
    t: 11,
    c: 6,
    tot: 20,
    loc: 'श्रीकृष्णमंदिर, वडाळा स्टेशन, वडाळा, मुंबई शहर'
  },

  // २. दादर (Dadar)
  {
    id: 'niwas_mumbai_dadar_gitapathshala',
    district: 'मुंबई शहर',
    taluka: 'मुंबई शहर',
    village: 'दादर',
    name: 'गीतापाठशाळा, शारदामाता शाळेजवळ',
    nameEn: 'Gitapathshala, Near Shardamata School',
    contact: 'व्यवस्थापक',
    phone: '+91 94039 84921',
    b: 0,
    t: 0,
    c: 0,
    tot: 0,
    loc: 'गीतापाठशाळा, शारदामाता शाळेजवळ, दादर, मुंबई शहर'
  },

  // ३. नवीन मुंबई : नेरूळ पूर्व (Navi Mumbai: Nerul East)
  {
    id: 'niwas_mumbai_nerul_krishnamandir',
    district: 'मुंबई शहर',
    taluka: 'नवी मुंबई',
    village: 'नेरूळ',
    name: 'श्रीकृष्णमंदिर, नेरूळ पूर्व (प.पू. श्रीप्रकाशमुनी वाईंदेशकर)',
    nameEn: 'Shree Krishna Mandir, Nerul East (P.P. Shree Prakashmuni Waindeshkar)',
    contact: 'प.पू. श्रीप्रकाशमुनी वाईंदेशकर',
    phone: '+91 93718 87932',
    b: 1,
    t: 0,
    c: 0,
    tot: 1,
    loc: 'नेरूळ पूर्व, श्रीकृष्णमंदिर, सेक्टर १९, गुरुद्वाराजवळ, नवी मुंबई'
  },

  // ४. भटवाडी (Bhatwadi, Ghatkopar)
  {
    id: 'niwas_mumbai_bhatwadi_dattamandir',
    district: 'मुंबई उपनगर',
    taluka: 'कुर्ला',
    village: 'भटवाडी',
    name: 'श्रीदत्त मंदिर, भटवाडी',
    nameEn: 'Shree Datta Mandir, Bhatwadi',
    contact: 'व्यवस्थापक',
    phone: '+91 98200 12345',
    b: 2,
    t: 3,
    c: 0,
    tot: 5,
    loc: 'श्रीदत्त मंदिर, भटवाडी, घाटकोपर, मुंबई उपनगर'
  }
];

export const MUMBAI_NIWAS_ITEMS: NiwasItem[] = MUMBAI_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: item.loc || `${item.village}, मुंबई`,
  state: 'महाराष्ट्र',
  district: item.district,
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

