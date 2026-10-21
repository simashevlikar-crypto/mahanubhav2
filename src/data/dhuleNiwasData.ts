import { NiwasItem } from '../types';

interface RawDhuleNiwas {
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

const DHULE_RAW_DATA: RawDhuleNiwas[] = [
  // १. ता. धुळे (Dhule Taluka) - ४ पदे / स्थाने
  {
    id: 'niwas_dhule_dhule_city_salkarbaba',
    taluka: 'धुळे',
    village: 'धुळे शहर',
    name: 'धुळे शहर : अ) प.पू.म. श्रीसाळकरबाबा म.',
    nameEn: 'Dhule City: A) Salkarbaba M.',
    contact: 'प.पू.म. श्रीसाळकरबाबा म.',
    phone: '९४०३९८५०११, ९६७३४३८५१४',
    b: 10,
    t: 15,
    c: 10,
    tot: 35,
    loc: 'धुळे शहर, जि. धुळे'
  },
  {
    id: 'niwas_dhule_dhule_city_anitatai',
    taluka: 'धुळे',
    village: 'धुळे शहर',
    name: 'धुळे शहर : ब) श्रीकृष्ण महानुभाव आश्रम, भुजल कॉलनी (प.पू.त. अनिताताई मराठे)',
    nameEn: 'Dhule City: B) Shree Krishna Mahanubhav Ashram, Bhujal Colony (Anitatai Marathe)',
    contact: 'प.पू.त. अनिताताई मराठे',
    phone: '९४२०५३६१८०, ८९९९४५७६२७',
    b: 0,
    t: 2,
    c: 0,
    tot: 2,
    loc: 'भुजल कॉलनी, गॅस गोडाऊन जवळ, धुळे शहर'
  },
  {
    id: 'niwas_dhule_dhule_mohadi_jayarababa',
    taluka: 'धुळे',
    village: 'मोहाडी उपनगर',
    name: 'मोहाडी उपनगर : प.पू.म. श्रीजायराबाबा म.',
    nameEn: 'Mohadi Suburb: Jayarababa M.',
    contact: 'प.पू.म. श्रीजायराबाबा म.',
    phone: '९४०३९८८३३३, ९४०३९८६४४४',
    b: 15,
    t: 15,
    c: 5,
    tot: 35,
    loc: 'मोहाडी उपनगर, धुळे'
  },
  {
    id: 'niwas_dhule_dhule_darna_kavitatai',
    taluka: 'धुळे',
    village: 'दरना रव्हाणे',
    name: 'दरना रव्हाणे : प.पू.त. कविताताई भोजने',
    nameEn: 'Darna Ravhane: Kavitatai Bhojane',
    contact: 'प.पू.त. कविताताई भोजने',
    phone: '७०३०५४८९०६',
    b: 0,
    t: 2,
    c: 3,
    tot: 5
  },
  {
    id: 'niwas_dhule_dhule_vinchur_rituraj',
    taluka: 'धुळे',
    village: 'विंचूर',
    name: 'विंचूर : प.पू.श्रीऋतुराज दख्खनकर',
    nameEn: 'Vinchur: Rituraj Dakhankar',
    contact: 'प.पू.श्रीऋतुराज दख्खनकर',
    phone: '९१७२१४९२८६',
    b: 1,
    t: 1,
    c: 1,
    tot: 3
  },

  // २. ता. सिंदखेड (Sindkheda Taluka) - ३ पदे
  {
    id: 'niwas_dhule_sindkheda_sondle_ranjanatai',
    taluka: 'सिंदखेड',
    village: 'सोंडले',
    name: 'सोंडले : प.पू.त.रंजनाताई म.',
    nameEn: 'Sondle: Ranjanatai M.',
    contact: 'प.पू.त.रंजनाताई म.',
    phone: '९४०३४६९९८१',
    b: 0,
    t: 3,
    c: 1,
    tot: 4
  },
  {
    id: 'niwas_dhule_sindkheda_dondaicha_prabhakardada',
    taluka: 'सिंदखेड',
    village: 'दोंडाईचा',
    name: 'दोंडाईचा : प.पू.श्रीप्रभाकरदादा भोजने',
    nameEn: 'Dondaicha: Prabhakardada Bhojane',
    contact: 'प.पू.श्रीप्रभाकरदादा भोजने',
    phone: '९९२३०४६११२',
    b: 1,
    t: 2,
    c: 0,
    tot: 3
  },
  {
    id: 'niwas_dhule_sindkheda_borkud_santoshda',
    taluka: 'सिंदखेड',
    village: 'बोरकूड',
    name: 'बोरकूड : प.पू.श्रीसंतोषदा अंजनगावकर',
    nameEn: 'Borkud: Santoshda Anjangaonkar',
    contact: 'प.पू.श्रीसंतोषदा अंजनगावकर',
    phone: '९४०५२७५०२६',
    b: 1,
    t: 1,
    c: 3,
    tot: 5
  },

  // ३. ता. शिरपूर (Shirpur Taluka) - ७ स्थाने / पदे
  {
    id: 'niwas_dhule_shirpur_manjrod_nanerajbaba',
    taluka: 'शिरपूर',
    village: 'मांजरौद',
    name: 'मांजरौद : म. आश्रम (प.पू. श्रीनानेराजबाबा पातूरकर)',
    nameEn: 'Manjrod: M. Ashram (Nanerajbaba Paturkar)',
    contact: 'प.पू. श्रीनानेराजबाबा पातूरकर',
    phone: '९४२०६००३३२, ९६०४३८०४९८',
    b: 29,
    t: 32,
    c: 0,
    tot: 61
  },
  {
    id: 'niwas_dhule_shirpur_gujarkherde_yelherajbaba',
    taluka: 'शिरपूर',
    village: 'गुजरखर्दे',
    name: 'गुजरखर्दे : अ) प.पू.म. येल्हेराजबाबा',
    nameEn: 'Gujarkharde: A) Yelherajbaba',
    contact: 'प.पू.म. येल्हेराजबाबा',
    phone: '८७६६५५४६०८, ९४०५४०२९३५',
    b: 3,
    t: 3,
    c: 1,
    tot: 7
  },
  {
    id: 'niwas_dhule_shirpur_gujarkherde_rishirajdada',
    taluka: 'शिरपूर',
    village: 'गुजरखर्दे',
    name: 'गुजरखर्दे : ब) प.पू.श्रीऋषिराजदादा भोजने',
    nameEn: 'Gujarkharde: B) Rishirajdada Bhojane',
    contact: 'प.पू.श्रीऋषिराजदादा भोजने',
    phone: '९८२२६५१४०७',
    b: 1,
    t: 0,
    c: 0,
    tot: 1
  },
  {
    id: 'niwas_dhule_shirpur_savalda',
    taluka: 'शिरपूर',
    village: 'सावळदा',
    name: 'सावळदा',
    nameEn: 'Savalda',
    contact: 'संतमंडळी',
    phone: '+91 94227 88990',
    b: 1,
    t: 1,
    c: 0,
    tot: 2
  },
  {
    id: 'niwas_dhule_shirpur_waghali_sudamdada',
    taluka: 'शिरपूर',
    village: 'वाघाळी',
    name: 'वाघाळी : प.पू.श्रीसुदामदादा रेलकर',
    nameEn: 'Waghali: Sudamdada Relkar',
    contact: 'प.पू.श्रीसुदामदादा रेलकर',
    phone: '९५५२९२२५८९',
    b: 1,
    t: 0,
    c: 0,
    tot: 1
  },
  {
    id: 'niwas_dhule_shirpur_garvade',
    taluka: 'शिरपूर',
    village: 'गरवाडे',
    name: 'गरवाडे : संतमंडळी',
    nameEn: 'Garvade: Santmandali',
    contact: 'संतमंडळी',
    phone: '+91 94227 88990',
    b: 2,
    t: 1,
    c: 0,
    tot: 3
  },
  {
    id: 'niwas_dhule_shirpur_vikhran_shreeramchandra',
    taluka: 'शिरपूर',
    village: 'विखरण',
    name: 'विखरण : अ) प.पू.म. श्रीरामचंद्रबाबा गुर्जर',
    nameEn: 'Vikhran: A) Shreeramchandrababa Gurjar',
    contact: 'प.पू.म. श्रीरामचंद्रबाबा गुर्जर',
    phone: '९३५९८२९१४०, ९४०५२७४८४५',
    b: 2,
    t: 4,
    c: 3,
    tot: 9
  },
  {
    id: 'niwas_dhule_shirpur_vikhran_shantabai',
    taluka: 'शिरपूर',
    village: 'विखरण',
    name: 'विखरण : ब) प.पू.त.शांताबाई भोजने',
    nameEn: 'Vikhran: B) Shantabai Bhojane',
    contact: 'प.पू.त.शांताबाई भोजने',
    phone: '९९७५५४४२८२',
    b: 0,
    t: 6,
    c: 2,
    tot: 8
  },
  {
    id: 'niwas_dhule_shirpur_gartad_dattarajdada',
    taluka: 'शिरपूर',
    village: 'गरताड',
    name: 'गरताड : प.पू.श्रीदत्तराजदादा',
    nameEn: 'Gartad: Dattarajdada',
    contact: 'प.पू.श्रीदत्तराजदादा',
    phone: '+91 94227 88990',
    b: 1,
    t: 2,
    c: 0,
    tot: 3
  }
];

export const DHULE_NIWAS_ITEMS: NiwasItem[] = DHULE_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: item.loc || `${item.village}, ता. ${item.taluka}, जि. धुळे`,
  state: 'महाराष्ट्र',
  district: 'धुळे',
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
