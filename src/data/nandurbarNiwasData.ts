import { NiwasItem } from '../types';

interface RawNandurbarNiwas {
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

const NANDURBAR_RAW_DATA: RawNandurbarNiwas[] = [
  // १. ता. नंदुरबार (Nandurbar Taluka) - २ पदे
  {
    id: 'niwas_nandurbar_nandurbar_samsherpur_sarangdharbaba',
    taluka: 'नंदुरबार',
    village: 'समशेरपूर',
    name: 'समशेरपूर : प.पू.म. श्रीसारंगधरबाबा भोजने',
    nameEn: 'Samsherpur: Sarangdharbaba Bhojane',
    contact: 'प.पू.म.श्रीसारंगधरबाबा भोजने',
    phone: '९४०५२७४३७५, ९४०५२७४३७६',
    b: 2,
    t: 1,
    c: 1,
    tot: 4
  },
  {
    id: 'niwas_nandurbar_nandurbar_ranale_gavatesaheb',
    taluka: 'नंदुरबार',
    village: 'रनाळे',
    name: 'रनाळे : प.पू.श्रीगवतेसाहेब',
    nameEn: 'Ranale: Gavatesaheb',
    contact: 'प.पू.श्रीगवतेसाहेब',
    phone: '+91 94227 11223',
    b: 1,
    t: 0,
    c: 0,
    tot: 1
  },

  // २. ता. शहादा (Shahada Taluka) - १९ स्थाने / पदे
  {
    id: 'niwas_nandurbar_shahada_hingani_demerajubuva',
    taluka: 'शहादा',
    village: 'हिंगणी',
    name: 'हिंगणी : प.पू.श्रीदेमेराजुबुवा विद्वांस',
    nameEn: 'Hingani: Demerajubuva Vidvans',
    contact: 'प.पू.श्रीदेमेराजुबुवा विद्वांस',
    phone: '९३५९९१९०९९, ७५८८९४९५४१',
    b: 2,
    t: 2,
    c: 0,
    tot: 4
  },
  {
    id: 'niwas_nandurbar_shahada_fais_vairagibuva',
    taluka: 'शहादा',
    village: 'फेस',
    name: 'फेस : प.पू.म. श्रीवैरागी बुवा पंजाबी',
    nameEn: 'Fais: Vairagibuva Punjabi',
    contact: 'प.पू.म. श्रीवैरागी बुवा पंजाबी',
    phone: '९७६३५४४९२१, ९४०५२७४३९०',
    b: 9,
    t: 14,
    c: 2,
    tot: 25
  },
  {
    id: 'niwas_nandurbar_shahada_bamkheda_damodarmuni',
    taluka: 'शहादा',
    village: 'बामखेडी',
    name: 'बामखेडी : प.प.दामोदरमुनी सोनपेटकर',
    nameEn: 'Bamkhedi: Damodarmuni Sonpetkar',
    contact: 'प.प.दामोदरमुनी सोनपेटकर',
    phone: '९८५०४६२५१७',
    b: 1,
    t: 0,
    c: 0,
    tot: 1
  },
  {
    id: 'niwas_nandurbar_shahada_jayanagar_divakarbuva',
    taluka: 'शहादा',
    village: 'जयनगर',
    name: 'जयनगर : प.पू.म.श्रीदिवाकरबुवा बीडकर',
    nameEn: 'Jayanagar: Divakarbuva Bidkar',
    contact: 'प.पू.म.श्रीदिवाकरबुवा बीडकर',
    phone: '९४०५२७६०५३, ९९२१२०१०६२',
    b: 1,
    t: 4,
    c: 3,
    tot: 8
  },
  {
    id: 'niwas_nandurbar_shahada_kahatul_krishnarajba',
    taluka: 'शहादा',
    village: 'काहाटूळ',
    name: 'काहाटूळ : प.पू.म. श्रीकृष्णराजबा कवीश्वर',
    nameEn: 'Kahatul: Krishnarajba Kaveeshwar',
    contact: 'प.पू.म.श्रीकृष्णराजबा कवीश्वर',
    phone: '९८२२७६२०४३',
    b: 2,
    t: 3,
    c: 2,
    tot: 7
  },
  {
    id: 'niwas_nandurbar_shahada_kahatulphata_gopalvyas',
    taluka: 'शहादा',
    village: 'काहाटूळ फाटा',
    name: 'काहाटूळ फाटा : प.पू.श्रीगोपालव्यास शेवलीकर',
    nameEn: 'Kahatul Phata: Gopalvyas Shevalikar',
    contact: 'प.पू.श्रीगोपालव्यास शेवलीकर',
    phone: '९९६०९२१०७०',
    b: 1,
    t: 0,
    c: 1,
    tot: 2
  },
  {
    id: 'niwas_nandurbar_shahada_sarangkheda_divakarbaba',
    taluka: 'शहादा',
    village: 'सारंगखेडा',
    name: 'सारंगखेडा : प.प.म.श्रीदिवाकरबाबा पंजाबी',
    nameEn: 'Sarangkheda: Divakarbaba Punjabi',
    contact: 'प.प.म.श्रीदिवाकरबाबा पंजाबी',
    phone: '९४०५२७५७०५',
    b: 1,
    t: 2,
    c: 0,
    tot: 3
  },
  {
    id: 'niwas_nandurbar_shahada_pusanad_arunatai',
    taluka: 'शहादा',
    village: 'पुसनद',
    name: 'पुसनद : प.पू.त.अरूणाताई जावळे',
    nameEn: 'Pusanad: Arunatai Jawale',
    contact: 'प.पू.त.अरूणाताई जावळे',
    phone: '९७६३७६७५२३',
    b: 0,
    t: 2,
    c: 1,
    tot: 3
  },
  {
    id: 'niwas_nandurbar_shahada_varud_santoshmuni',
    taluka: 'शहादा',
    village: 'वरूड कानडी',
    name: 'वरूड कानडी : प.पू.श्रीसंतोषमुनी बीडकर',
    nameEn: 'Varud Kanadi: Santoshmuni Bidkar',
    contact: 'प.पू.श्रीसंतोषमुनी बीडकर',
    phone: '८५५१८९८९१२',
    b: 1,
    t: 2,
    c: 0,
    tot: 3
  },
  {
    id: 'niwas_nandurbar_shahada_shirud_gopaldada',
    taluka: 'शहादा',
    village: 'शिरूड',
    name: 'शिरूड : प.पू.म.श्रीगोपालदादा भोजने',
    nameEn: 'Shirud: Gopaldada Bhojane',
    contact: 'प.पू.म.श्रीगोपालदादा भोजने',
    phone: '७५८८९४९४९२',
    b: 1,
    t: 3,
    c: 1,
    tot: 5
  },
  {
    id: 'niwas_nandurbar_shahada_sutgirani_paturkarbaba',
    taluka: 'शहादा',
    village: 'सूतगिरणी',
    name: 'सूतगिरणी : प.पू.म. श्रीपातूरकरबा (जुने)',
    nameEn: 'Sutgirani: Paturkarbaba (Old)',
    contact: 'प.पू.म. श्रीपातूरकरबा (जुने)',
    phone: '९४०३४३१०२०',
    b: 2,
    t: 8,
    c: 1,
    tot: 11
  },
  {
    id: 'niwas_nandurbar_shahada_mhasavad_gomerajba',
    taluka: 'शहादा',
    village: 'म्हसावद',
    name: 'म्हसावद : अ) प.पू.म.श्रीगोमेराजबा नांदेडकर',
    nameEn: 'Mhasavad: A) Gomerajba Nandedkar',
    contact: 'प.पू.म.श्रीगोमेराजबा नांदेडकर',
    phone: '९७६३९०१५९२',
    b: 1,
    t: 1,
    c: 1,
    tot: 3
  },
  {
    id: 'niwas_nandurbar_shahada_lonakheda_paturkarbaba',
    taluka: 'शहादा',
    village: 'लोणखेडा',
    name: 'लोणखेडा : अ) प.पू.म.श्रीपातूरकरबाबा (नवे)',
    nameEn: 'Lonakheda: A) Paturkarbaba (New)',
    contact: 'प.पू.म.श्रीपातूरकरबाबा (नवे)',
    phone: '९९२२५९३२९३',
    b: 4,
    t: 5,
    c: 2,
    tot: 11
  },
  {
    id: 'niwas_nandurbar_shahada_lonakheda_vanadevmandir',
    taluka: 'शहादा',
    village: 'लोणखेडा',
    name: 'लोणखेडा : ब) वनदेव मंदिर : द्वारकाधिश संस्थान (प.पू.श्रीयोगिराजदा महंत बाबा)',
    nameEn: 'Lonakheda: B) Vanadev Mandir: Dwarkadhish Sansthan (Yogirajda Mahant Baba)',
    contact: 'प.पू.श्रीयोगिराजदा (महंत बाबा)',
    phone: '९४०३९८७०७०',
    b: 1,
    t: 1,
    c: 0,
    tot: 2
  },
  {
    id: 'niwas_nandurbar_shahada_lonakheda_dattanagar',
    taluka: 'शहादा',
    village: 'लोणखेडा',
    name: 'लोणखेडा : क) दत्तनगर (प.पू. श्रीयोगिराजदा पंडित)',
    nameEn: 'Lonakheda: C) Dattanagar (Yogirajda Pandit)',
    contact: 'प.पू. श्रीयोगिराजदा पंडित',
    phone: '९४०५४००६६६',
    b: 1,
    t: 2,
    c: 1,
    tot: 4
  },
  {
    id: 'niwas_nandurbar_shahada_purushottamnagar_virat',
    taluka: 'शहादा',
    village: 'पुरुषोत्तमनगर',
    name: 'पुरुषोत्तमनगर कारखाना : ड) प.पू.त. कल्पनाताई विराट',
    nameEn: 'Purushottamnagar Karkhana: D) Kalpanatai Virat',
    contact: 'प.पू.त. कल्पनाताई विराट',
    phone: '९०६७५१७७२४',
    b: 0,
    t: 1,
    c: 0,
    tot: 1
  },
  {
    id: 'niwas_nandurbar_shahada_vadachhil_kolhekarbaba',
    taluka: 'शहादा',
    village: 'वडछील',
    name: 'वडछील : प.पू.म.श्रीकोल्हेकरबाबा',
    nameEn: 'Vadachhil: Kolhekarbaba',
    contact: 'प.पू.म.श्रीकोल्हेकरबाबा',
    phone: '९५२७२२३०२३',
    b: 4,
    t: 3,
    c: 3,
    tot: 10
  },
  {
    id: 'niwas_nandurbar_shahada_city_bhaskarbaba',
    taluka: 'शहादा',
    village: 'शहादा',
    name: 'शहादा : १) श्रीकृष्णज्ञान मंदिर, गोविंदनगर (प.पू.म.श्रीभास्करबाबा महानुभाव)',
    nameEn: 'Shahada: 1) Shree Krishna Gyan Mandir, Govindnagar (Bhaskarbaba Mahanubhav)',
    contact: 'प.पू.म.श्रीभास्करबाबा महानुभाव',
    phone: '९४२२२१३०६४, ७९७२२०३५१२',
    b: 2,
    t: 0,
    c: 0,
    tot: 2,
    loc: 'श्रीकृष्णज्ञान मंदिर, गोविंदनगर, शहादा'
  },
  {
    id: 'niwas_nandurbar_shahada_city_vasanikerbaba',
    taluka: 'शहादा',
    village: 'शहादा',
    name: 'शहादा : २) ब्रिजभूषण परमार्ग आश्रम (प.पू.म.श्रीवासनिकरबाबा)',
    nameEn: 'Shahada: 2) Brijbhushan Parmarg Ashram (Vasanikerbaba)',
    contact: 'प.पू.म.श्रीवासनिकरबाबा',
    phone: '९८८१७६६२३१',
    b: 2,
    t: 4,
    c: 3,
    tot: 9,
    loc: 'ब्रिजभूषण परमार्ग आश्रम, शहादा'
  },
  {
    id: 'niwas_nandurbar_shahada_city_yogirajdada',
    taluka: 'शहादा',
    village: 'शहादा',
    name: 'शहादा : ३) श्रीदत्तमंदिर म.आ. (प.पू.श्रीयोगिराजदादा कोल्हेकर)',
    nameEn: 'Shahada: 3) Shree Dattamandir M.A. (Yogirajdada Kolhekar)',
    contact: 'प.पू.श्रीयोगिराजदादा कोल्हेकर',
    phone: '८२७५६१७०७५',
    b: 1,
    t: 2,
    c: 2,
    tot: 5,
    loc: 'श्रीदत्तमंदिर म.आ., शहादा'
  },
  {
    id: 'niwas_nandurbar_shahada_city_sushilatai',
    taluka: 'शहादा',
    village: 'शहादा',
    name: 'शहादा : ४) प.पू.त.सुशिलाताई पातूरकर',
    nameEn: 'Shahada: 4) Sushilatai Paturkar',
    contact: 'प.पू.त.सुशिलाताई पातूरकर',
    phone: '+91 94227 11223',
    b: 0,
    t: 2,
    c: 0,
    tot: 2,
    loc: 'शहादा'
  },
  {
    id: 'niwas_nandurbar_shahada_brahmanpuri_mandal',
    taluka: 'शहादा',
    village: 'ब्राह्मणपुरी',
    name: 'ब्राह्मणपुरी : प.पू.त.यशोदाताई',
    nameEn: 'Brahmanpuri: Yashodatai',
    contact: 'प.पू.त.यशोदाताई',
    phone: '+91 94227 11223',
    b: 1,
    t: 0,
    c: 0,
    tot: 1
  },
  {
    id: 'niwas_nandurbar_shahada_manarad_sunildada',
    taluka: 'शहादा',
    village: 'मनरद',
    name: 'मनरद : प.पू.श्रीसुनीलदादा पंजाबी',
    nameEn: 'Manarad: Sunildada Punjabi',
    contact: 'प.पू.श्रीसुनीलदादा पंजाबी',
    phone: '९०२२५१५५२२, ८९९९६६२९९३, ९७६३६२२१७३',
    b: 1,
    t: 2,
    c: 0,
    tot: 3
  },
  {
    id: 'niwas_nandurbar_shahada_damarkheda_minashitai',
    taluka: 'शहादा',
    village: 'डामरखेडा',
    name: 'डामरखेडा : प.पू.त.मिनाक्षीताई जावळे',
    nameEn: 'Damarkheda: Minashitai Jawale',
    contact: 'प.पू.त.मिनाक्षीताई जावळे',
    phone: '९६८९५१६२१८, ९८३४१८१६२४',
    b: 7,
    t: 5,
    c: 5,
    tot: 17
  },
  {
    id: 'niwas_nandurbar_shahada_londhare_mandal',
    taluka: 'शहादा',
    village: 'लोंढरे',
    name: 'लोंढरे',
    nameEn: 'Londhare',
    contact: 'संतमंडळी',
    phone: '+91 94227 11223',
    b: 1,
    t: 1,
    c: 0,
    tot: 2
  }
];

export const NANDURBAR_NIWAS_ITEMS: NiwasItem[] = NANDURBAR_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: item.loc || `${item.village}, ता. ${item.taluka}, जि. नंदुरबार`,
  state: 'महाराष्ट्र',
  district: 'नंदुरबार',
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
