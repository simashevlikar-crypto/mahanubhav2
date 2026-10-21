import { NiwasItem } from '../types';

interface RawThaneNiwas {
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

const THANE_RAW_DATA: RawThaneNiwas[] = [
  // १. ता. मुरबाड (Murbad Taluka) - १ पद
  {
    id: 'niwas_thane_murbad_temgaon_sandipdada',
    taluka: 'मुरबाड',
    village: 'टेमगाव',
    name: 'महानुभाव आश्रम, टेमगाव (प.पू.म. संदिपदादा पुणेकर)',
    nameEn: 'Mahanubhav Ashram, Temgaon (P.P.M. Sandipdada Punekar)',
    contact: 'प.पू.म. संदिपदादा पुणेकर',
    phone: '+91 98210 77889',
    b: 1,
    t: 1,
    c: 0,
    tot: 2,
    loc: 'टेमगाव, ता. मुरबाड, जि. ठाणे'
  },

  // २. ता. उल्हासनगर (Ulhasnagar Taluka) - २ पदे (अ आणि ब)
  {
    id: 'niwas_thane_ulhasnagar_lalchakki_sudamatibai',
    taluka: 'उल्हासनगर',
    village: 'उल्हासनगर',
    name: 'श्रीकृष्ण मंदिर, लालचक्की ४ नंबर (प.पू.त. सुदामती कोल्हेकर)',
    nameEn: 'Shree Krishna Mandir, Lalchakki No. 4 (P.P.T. Sudamati Kolhekar)',
    contact: 'प.पू.त. सुदामती कोल्हेकर',
    phone: '+91 99219 65811',
    b: 0,
    t: 2,
    c: 1,
    tot: 3,
    loc: 'श्रीकृष्ण मंदिर, लालचक्की ४ नंबर, उल्हासनगर, ता. उल्हासनगर, जि. ठाणे'
  },
  {
    id: 'niwas_thane_ulhasnagar_dattamandir_rahuldada',
    taluka: 'उल्हासनगर',
    village: 'उल्हासनगर',
    name: 'श्रीदत्त मंदिर, सरस्वती विद्या मंदिर समोर (प.पू. श्रीराहुलदादा तळेगांवकर)',
    nameEn: 'Shree Datta Mandir, Opp. Saraswati Vidya Mandir (P.P. Rahuldada Talegaonkar)',
    contact: 'प.पू. श्रीराहुलदादा तळेगांवकर',
    phone: '+91 98812 74741',
    b: 1,
    t: 0,
    c: 1,
    tot: 2,
    loc: 'श्रीदत्त मंदिर, सरस्वती विद्या मंदिर समोर, उल्हासनगर, ता. उल्हासनगर, जि. ठाणे'
  },

  // ३. ता. कल्याण (Kalyan Taluka) - १ पद
  {
    id: 'niwas_thane_kalyan_dombivli_ravindramuni',
    taluka: 'कल्याण',
    village: 'डोंबीवली',
    name: 'महानुभाव आश्रम, डोंबीवली (प.पू.म. श्रीरविंद्रमुनी सोनपेठकर)',
    nameEn: 'Mahanubhav Ashram, Dombivli (P.P.M. Shreeravindramuni Sonpethkar)',
    contact: 'प.पू.म. श्रीरविंद्रमुनी सोनपेठकर',
    phone: '+91 98210 77889',
    b: 1,
    t: 1,
    c: 0,
    tot: 2,
    loc: 'डोंबीवली, ता. कल्याण, जि. ठाणे'
  }
];

export const THANE_NIWAS_ITEMS: NiwasItem[] = THANE_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: item.loc || `${item.village}, ता. ${item.taluka}, जि. ठाणे`,
  state: 'महाराष्ट्र',
  district: 'ठाणे',
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
