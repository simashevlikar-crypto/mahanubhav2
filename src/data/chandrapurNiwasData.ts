import { NiwasItem } from '../types';

export const CHANDRAPUR_RAW_DATA_TUPLES: [
  string, // taluka
  string, // village
  string, // fullTitle
  string, // headPerson
  string, // phone
  number, // bhikshuk
  number, // tapasvini
  number, // children
  number  // total
][] = [
  // १. ता. चंद्रपूर
  ['चंद्रपूर', 'खुटाळा', 'खुटाळा : घुग्गस रोड, प.पू.म. श्रीएकोबास शास्त्री (६+८+१)', 'प.पू.म. श्रीएकोबास शास्त्री', '९३७३३७१७९५, ८८८८७०१०२५', 6, 8, 1, 15],

  // २. ता. चिमूर
  ['चिमूर', 'चिंचोली', 'चिंचोली : आडगाव टेकडी प.पू.त. करूणाबाई दर्यापूरकर (२+१०+०)', 'प.पू.त. करूणाबाई दर्यापूरकर', '९१३०२७७९९५', 2, 10, 0, 12],

  // ३. ता. भद्रावती
  ['भद्रावती', 'लोणारा', 'लोणारा : प.पू.म.श्रीदिवाकरबाबा गुर्जर (१+१+१)', 'प.पू.म.श्रीदिवाकरबाबा गुर्जर', '९३७३३७१७९५, ८२७५९७३९०५', 1, 1, 1, 3],

  // ४. ता. वरोरा
  ['वरोरा', 'सिंदोला नवीन', 'सिंदोला नवीन : प.पू.श्रीपरसराजबा दर्यापूरकर (१+०+०)', 'प.पू.श्रीपरसराजबा दर्यापूरकर', '९९२३४५५३०३, ९४२०३११५९२', 1, 0, 0, 1],
  ['वरोरा', 'वरोरा', 'वरोरा शहर : प.पू.म.श्रीमुधोव्यासबाबा शास्त्री (५+८+१)', 'प.पू.म.श्रीमुधोव्यासबाबा शास्त्री', '९७६५९७७४२१, ९९२१०९४१०९', 5, 8, 1, 14]
];

const EN_MAP: Record<string, string> = {
  // Talukas
  'चंद्रपूर': 'Chandrapur',
  'चिमूर': 'Chimur',
  'भद्रावती': 'Bhadravati',
  'वरोरा': 'Warora',

  // Villages
  'खुटाळा': 'Khutala',
  'चिंचोली': 'Chincholi',
  'लोणारा': 'Lonara',
  'सिंदोला नवीन': 'Sindola Navin'
};

const sanitizeId = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

export const CHANDRAPUR_NIWAS_ITEMS: NiwasItem[] = CHANDRAPUR_RAW_DATA_TUPLES.map(
  ([taluka, village, fullTitle, headPerson, phone, bhikshuk, tapasvini, children, total], index) => {
    const id = `niwas_chandrapur_${index}_${sanitizeId(village)}_${sanitizeId(headPerson)}`;
    const villageEn = EN_MAP[village] || village;
    const talukaEn = EN_MAP[taluka] || taluka;

    return {
      id,
      name: fullTitle,
      nameEn: `Mahanubhav Ashram (${villageEn}) - ${headPerson}`,
      location: `${village}, ता. ${taluka}, जि. चंद्रपूर`,
      state: 'महाराष्ट्र',
      district: 'चंद्रपूर',
      taluka,
      village,
      facilities: {
        mr: ['नित्य पूजावसर व विधी', 'भोजन प्रसाद', 'अन्नछत्र'],
        hi: ['नित्य पूजावसर एवं विधि', 'भोजन प्रसाद', 'अन्नछत्र'],
        en: ['Daily Prayers & Rituals', 'Bhojan Prasad', 'Free Food']
      },
      rooms: {
        mr: ['साधारण खोल्या', 'भक्त निवास'],
        hi: ['साधारण कमरे', 'भक्त निवास'],
        en: ['Standard Rooms', 'Devotee Residence']
      },
      contactPerson: headPerson,
      phone: phone !== '-' ? phone : '+91 94230 00000',
      sevaCharge: {
        mr: 'ऐच्छिक सहकार्य',
        hi: 'ऐच्छिक सहयोग',
        en: 'Voluntary Donation'
      },
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
      bhikshuk,
      tapasvini,
      children,
      totalMembers: total
    };
  }
);
