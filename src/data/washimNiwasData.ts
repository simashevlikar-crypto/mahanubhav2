import { NiwasItem } from '../types';

interface RawWashimNiwas {
  taluka: string;
  village: string;
  name: string;
  contact: string;
  phone: string;
  b: number;
  t: number;
  c: number;
  tot: number;
}

const EN_MAP: Record<string, string> = {
  // Talukas
  'वाशिम': 'Washim',
  'मालेगाव': 'Malegaon',
  'मंगरुळपीर': 'Mangrulpir',
  'रिसोद': 'Risod',
  
  // Villages / Cities
  'रिसोद शहर': 'Risod City',
  'वाशिम शहर': 'Washim City',
  'काटा': 'Kata',
  'तांदळी शेवई': 'Tandali Shevai',
  'मालेगांव शहर': 'Malegaon City',
  'करंजी': 'Karanji',
  'मंगळूर शहर': 'Mangrul City',
  'बिटोडा भोयर': 'Bitoda Bhoyer',
  'चिखली': 'Chikhali',
  'खंडाळा': 'Khandala',
  'मसलापेन': 'Maslapen',
  'गोभणी': 'Gobhani',
  'भाळगांव': 'Bhalgaon'
};

function marathiToEnglish(text: string): string {
  // Transliterate common words & names
  let result = text
    .replace(/महानुभाव/g, 'Mahanubhav')
    .replace(/आश्रम/g, 'Ashram')
    .replace(/मंदिर/g, 'Mandir')
    .replace(/श्रीकृष्ण/g, 'Shree Krishna')
    .replace(/श्रीचक्रधरस्वामी/g, 'Shree Chakradhar Swami')
    .replace(/संस्थान/g, 'Sansthan')
    .replace(/खडकेश्वर/g, 'Khadkeshwar')
    .replace(/प\.पू\.म\./g, 'P.P.M.')
    .replace(/प\.पू\./g, 'P.P.')
    .replace(/त\./g, 'T.')
    .replace(/श्री/g, 'Shree')
    .replace(/बाबा/g, 'baba')
    .replace(/दादा/g, 'dada')
    .replace(/बुवा/g, 'buva')
    .replace(/शास्त्री/g, 'Shastri')
    .replace(/श्रीमंत/g, 'Shrimant')
    .replace(/भक्त निवास/g, 'Bhakt Niwas')
    .replace(/शहर/g, 'City')
    .replace(/लाड/g, 'Lad')
    .replace(/संतोष/g, 'Santosh')
    .replace(/रुक्मिणीताई/g, 'Rukminitai')
    .replace(/मेहकरकर/g, 'Meharkar')
    .replace(/बिडकर/g, 'Bidkar')
    .replace(/विजयराज/g, 'Vijayraj')
    .replace(/गोविंदराजबाबा/g, 'Govindrajbaba')
    .replace(/सरळ/g, 'Saral')
    .replace(/बोरीकर/g, 'Borikar')
    .replace(/सुनंदाबाई/g, 'Sunandabai')
    .replace(/रत्नाबाई/g, 'Ratnabai')
    .replace(/पुसदेकर/g, 'Pusdekar')
    .replace(/अमृतदादा/g, 'Amritdada')
    .replace(/साधैराजबाबा/g, 'Sadhavrajbaba')
    .replace(/लोणारकर/g, 'Lonarkar')
    .replace(/उद्धवराजदादा/g, 'Uddhavrajdada')
    .replace(/राघवमुनी/g, 'Raghavmuni')
    .replace(/जोतीताई/g, 'Jotitai')
    .replace(/कपाटे/g, 'Kapate')
    .replace(/संतमंडळी/g, 'Santmandali');

  return result;
}

const WASHIM_RAW_DATA_TUPLES: [
  string, // Taluka (must match exactly the Marathi keys in data.ts)
  string, // Village
  string, // Name
  string, // Contact
  string, // Phone
  number, // b (bhikshuk)
  number, // t (tapasvini)
  number, // c (children)
  number  // tot (total)
][] = [
  // १. ता. वाशिम
  ["वाशिम", "वाशिम शहर", "महानुभाव आश्रम, वाशिम शहर (आवेराजबाबा लाड)", "प.पू.म.श्रीआवेराजबाबा लाड", "७५८८९५६१०७, ९९२१२५५२३५", 2, 2, 0, 4],
  ["वाशिम", "वाशिम शहर", "महानुभाव आश्रम, वाशिम शहर (संतोषदादा)", "प.पू.श्रीसंतोषदादा", "-", 1, 1, 0, 2],
  ["वाशिम", "काटा", "महानुभाव मंदिर, काटा (रुक्मिणीताई मेहकरकर)", "प.पू.त.रुक्मिणीताई मेहकरकर", "९७६५०७८२८१", 0, 3, 1, 4],
  ["वाशिम", "काटा", "महानुभाव आश्रम, काटा (बिडकर दादा)", "प.पू.श्रीबिडकर दादा", "-", 1, 1, 0, 2],
  ["वाशिम", "तांदळी शेवई", "महानुभाव मंदिर, तांदळी शेवई", "संतमंडळी", "-", 1, 0, 0, 1],

  // २. ता. मालेगांव
  ["मालेगाव", "मालेगांव शहर", "महानुभाव मंदिर, मालेगांव शहर (विजयराज दादा)", "प.पू.त.विजयराज दादा", "९६७३९५४३८८", 1, 1, 1, 3],
  ["मालेगाव", "करंजी", "महानुभाव आश्रम, करंजी (गोविंदराजबाबा सरळ)", "प.पू.म. श्रीगोविंदराजबाबा सरळ", "९६२३७३८२२५", 2, 3, 4, 9],
  ["मालेगाव", "करंजी", "महानुभाव आश्रम, करंजी (बोरीकरबाबा)", "प.पू.म. श्रीबोरीकरबाबा", "९९२११२७११६", 2, 1, 2, 5],
  ["मालेगाव", "करंजी", "महानुभाव आश्रम, करंजी (सुनंदाबाई बोरीकर)", "प.पू.त.सुनंदाबाई बोरीकर", "९७६५६५९५८७, ९३२५८९७२४८", 1, 4, 2, 7],

  // ३. ता. मंगळूर
  ["मंगरुळपीर", "मंगळूर शहर", "श्रीचक्रधरस्वामी मंदिर खडकेश्वर संस्थान, मंगळूर शहर (लाडबाबा)", "प.पू.म.श्रीलाडबाबा", "९६०४५४७५२६", 4, 6, 2, 12],
  ["मंगरुळपीर", "बिटोडा भोयर", "महानुभाव आश्रम, बिटोडा भोयर (रत्नाबाई पुसदेकर)", "प.पू.त.रत्नाबाई पुसदेकर", "९७६३७३९०४१", 1, 1, 0, 2],
  ["मंगरुळपीर", "बिटोडा भोयर", "महानुभाव आश्रम, बिटोडा भोयर (अमृतदादा बिडकर)", "प.पू.श्रीअमृतदादा बिडकर", "९५५२०८०००६", 1, 5, 2, 8],

  // ४. ता. रिसोड
  ["रिसोद", "रिसोद शहर", "महानुभाव आश्रम, रिसोद शहर (शास्त्रीबाबा)", "प.पू.म.श्रीशास्त्रीबाबा / प.पू.श्रीउद्धवराजदादा", "९४२२१७७४३१, ९८८१६९६७३३", 3, 4, 2, 9],
  ["रिसोद", "चिखली", "महानुभाव आश्रम, चिखली (साधैराजबाबा लोणारकर)", "प.पू.म.श्रीसाधैराजबाबा लोणारकर", "९७६४२२८१८०", 1, 1, 1, 3],
  ["रिसोद", "खंडाळा", "महानुभाव मंदिर, खंडाळा (उद्धवराजदादा)", "प.पू.श्रीउद्धवराजदादा", "९८२२५६७३९०", 1, 2, 0, 3],
  ["रिसोद", "मसलापेन", "महानुभाव मंदिर, मसलापेन (राघवमुनी)", "प.पू.श्रीराघवमुनी", "९०२१३५५८१२", 1, 0, 0, 1],
  ["रिसोद", "गोभणी", "महानुभाव मंदिर, गोभणी (जोतीताई कपाटे)", "प.पू.त. जोतीताई कपाटे", "७७९६४६३३९७", 1, 1, 0, 2],
  ["रिसोद", "भाळगांव", "महानुभाव मंदिर, भाळगांव (गोपाळदादा)", "प.पू.श्रीगोपाळदादा / संतमंडळी", "९५४५३८९७६१", 1, 2, 0, 3]
];

export const WASHIM_NIWAS_ITEMS: NiwasItem[] = WASHIM_RAW_DATA_TUPLES.map((tuple, index) => {
  const [taluka, village, name, contact, phone, b, t, c, tot] = tuple;
  const id = `niwas_washim_${EN_MAP[taluka]?.toLowerCase()}_${village.replace(/[\s\(\)\:\.\-\,]/g, '_').toLowerCase()}_${index}`;
  const talukaEn = EN_MAP[taluka] || taluka;
  const villageEn = EN_MAP[village] || village;
  const nameEn = marathiToEnglish(name);

  return {
    id,
    name,
    nameEn,
    location: `${village}, ता. ${taluka}, जि. वाशिम`,
    state: 'महाराष्ट्र',
    district: 'वाशिम',
    taluka,
    village,
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
    contactPerson: contact,
    phone,
    sevaCharge: {
      mr: 'ऐच्छिक सहकार्य',
      hi: 'ऐच्छिक सहयोग',
      en: 'Voluntary Donation'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    bhikshuk: b,
    tapasvini: t,
    children: c,
    totalMembers: tot
  };
});
