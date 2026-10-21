import { NiwasItem } from '../types';

export const BHANDARA_RAW_DATA_TUPLES: [
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
  // १. ता. भंडारा
  ['भंडारा', 'भंडारा', 'भंडारा : १. प.पू.त.दमयंती आंबेकर (१+१+०)', 'प.पू.त.दमयंती आंबेकर', '९६३७९०८५७७', 1, 1, 0, 2],
  ['भंडारा', 'भंडारा', 'भंडारा : २. प.पू.त.सागरबाई पंजाबी (०+२+०)', 'प.पू.त.सागरबाई पंजाबी', '८७८८०८०२७२', 0, 2, 0, 2],
  ['भंडारा', 'भंडारा', 'भंडारा : ३. प.पू.त.रमणाबाई कारंजेकर (१+१+०)', 'प.पू.त.रमणाबाई कारंजेकर', '-', 1, 1, 0, 2],
  ['भंडारा', 'भंडारा', 'भंडारा : ४. प.पू.श्रीलक्षराज कवीश्वर (१+१+२)', 'प.पू.श्रीलक्षराज कवीश्वर', '९४२३६७४७३२', 1, 1, 2, 4],
  ['भंडारा', 'भंडारा', 'भंडारा : ५. प.पू.त. अलकाताई आंबेकर (१+३+०)', 'प.पू.त. अलकाताई आंबेकर', '९४०४७६१४६०', 1, 3, 0, 4],
  ['भंडारा', 'भंडारा', 'भंडारा : ६. प.पू.त. अनुसया न्यायंबास (१+२+०)', 'प.पू.त. अनुसया न्यायंबास', '७८७५२५४४९६', 1, 2, 0, 3],
  ['भंडारा', 'भंडारा', 'भंडारा : ७. स्थानाजवळ (२+२+०)', 'स्थान प्रमुख / संस्था', '-', 2, 2, 0, 4],
  ['भंडारा', 'मांडवी', 'मांडवी : प.पू.श्रीसंतमुनी तळेगावकर (२+१+०)', 'प.पू.श्रीसंतमुनी तळेगावकर', '७४४७८९०६२९', 2, 1, 0, 3],

  // २. ता. मोहाडी
  ['मोहाडी', 'करडीगाव', 'करडीगाव : प.पू.त. वंदनाताई पंजाबी (०+३+१)', 'प.पू.त. वंदनाताई पंजाबी', '८३०८९४००९४', 0, 3, 1, 4],

  // ३. ता. तुमसर
  ['तुमसर', 'तुमसर', 'तुमसर शहर : अ) प.पू.म.श्रीमाधवव्यास बिडकर (२+२+१)', 'प.पू.म.श्रीमाधवव्यास बिडकर', '९७६३८९४४००, ९४०५४०९०१२', 2, 2, 1, 5],
  ['तुमसर', 'तुमसर', 'तुमसर शहर : ब) काटेनाइक: (म.प्र.) प.पू.श्रीगोपीराजदा (२+३+०)', 'प.पू.श्रीगोपीराजदा', '८३२९५१२४१४', 2, 3, 0, 5]
];

const EN_MAP: Record<string, string> = {
  // Talukas
  'भंडारा': 'Bhandara',
  'मोहाडी': 'Mohadi',
  'तुमसर': 'Tumsar',

  // Villages
  'करडीगाव': 'Kardigaon',
  'मांडवी': 'Mandavi'
};

const sanitizeId = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

export const BHANDARA_NIWAS_ITEMS: NiwasItem[] = BHANDARA_RAW_DATA_TUPLES.map(
  ([taluka, village, fullTitle, headPerson, phone, bhikshuk, tapasvini, children, total], index) => {
    const id = `niwas_bhandara_${index}_${sanitizeId(village)}_${sanitizeId(headPerson)}`;
    const villageEn = EN_MAP[village] || village;
    const talukaEn = EN_MAP[taluka] || taluka;

    return {
      id,
      name: fullTitle,
      nameEn: `Mahanubhav Ashram (${villageEn}) - ${headPerson}`,
      location: `${village}, ता. ${taluka}, जि. भंडारा`,
      state: 'महाराष्ट्र',
      district: 'भंडारा',
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
