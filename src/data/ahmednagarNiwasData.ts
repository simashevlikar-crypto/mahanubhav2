import { NiwasItem } from '../types';

interface RawAhmednagarNiwas {
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

const AHMEDNAGAR_RAW_DATA: RawAhmednagarNiwas[] = [
  // १. ता. अहिल्यानगर (अहमदनगर)
  { id: 'niwas_ahmednagar_savedi_kapat', taluka: 'अहिल्यानगर', village: 'सावेडी', name: 'सावेडी (प.पू.त. शकुंतलाबाई कपाटे)', nameEn: 'Savedi (Shakuntalabai Kapate)', contact: 'प.पू.त. शकुंतलाबाई कपाटे', phone: '९७६३२५७४४१, ७४९९७७४३२३', b: 1, t: 2, c: 0, tot: 3 },
  { id: 'niwas_ahmednagar_nagapur_bidkar', taluka: 'अहिल्यानगर', village: 'नागापूर', name: 'श्रीचक्रधर मंदिर, नागापूर (प.पू.म. श्रीवाल्हेराजबाबा बिडकर)', nameEn: 'Nagapur (Valherajbaba Bidkar)', contact: 'प.पू.म. श्रीवाल्हेराजबाबा बिडकर', phone: '९८५०२०३८७६, ७५८८९४९५५५, ८८३०८८२९५४', b: 11, t: 18, c: 8, tot: 37 },
  { id: 'niwas_ahmednagar_borude_vidvans', taluka: 'अहिल्यानगर', village: 'बोरूडे मळा', name: 'श्रीदत्त मंदिर, बोरूडे मळा (प.पू.त. मंगलताई विद्वांस)', nameEn: 'Borude Mala (Mangaltai Vidvans)', contact: 'प.पू.त. मंगलताई विद्वांस', phone: '७०७५५९०२३३', b: 0, t: 1, c: 2, tot: 3 },
  { id: 'niwas_ahmednagar_arangaon_nimgaonkar', taluka: 'अहिल्यानगर', village: 'अरणगांव', name: 'अरणगांव (प.पू.म. श्रीनिमगावकरबाबा)', nameEn: 'Arangaon (Nimgaonkarbaba)', contact: 'प.पू.म. श्रीनिमगावकरबाबा', phone: '९८३४२७६४२३, ९४०५२७६१०६', b: 5, t: 16, c: 4, tot: 25 },
  { id: 'niwas_ahmednagar_arangaon_santmali', taluka: 'अहिल्यानगर', village: 'अरणगांव', name: 'अरणगांव (संतमळी)', nameEn: 'Arangaon (Santmali)', contact: 'संतमळी', phone: '९४२३४६४००५', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_ahmednagar_vrde_punambai', taluka: 'अहिल्यानगर', village: 'व्ही.आर.डी.ई.', name: 'व्ही.आर.डी.ई. (प.पू. आचार्या पूनमबाईजी)', nameEn: 'VRDE (Poonambaiji)', contact: 'प.पू. आचार्या पूनमबाईजी', phone: '९८८१७७३१४४, ९८२२३७१२५२, ७४९८१८३७४७', b: 6, t: 105, c: 15, tot: 126 },
  { id: 'niwas_ahmednagar_bhingar_bidkar', taluka: 'अहिल्यानगर', village: 'भिंगार', name: 'भिंगार स्थान (प.पू. श्रीसुदामराजदादा बिडकर)', nameEn: 'Bhingar Sthan (Sudamrajdada Bidkar)', contact: 'प.पू. श्रीसुदामराजदादा बिडकर', phone: '९७३०९५३७६७', b: 1, t: 0, c: 2, tot: 3 },
  { id: 'niwas_ahmednagar_shendi_fatebaba', taluka: 'अहिल्यानगर', village: 'शेंडी', name: 'शेंडी जावळे वस्ती (प.पू.म. श्रीफाटेबाबा)', nameEn: 'Shendi Javale Vasti (Fatebaba)', contact: 'प.पू.म. श्रीफाटेबाबा', phone: '९४०५२७५१७७, ९४०५२७५१७८, ९९२१३५७४४७', b: 3, t: 2, c: 1, tot: 6 },
  { id: 'niwas_ahmednagar_shendi_gunjatkar', taluka: 'अहिल्यानगर', village: 'शेंडी', name: 'शेंडी स्थान (प.पू. गुंजटकरबाबा)', nameEn: 'Shendi Sthan (Gunjatkarbaba)', contact: 'प.पू. गुंजटकरबाबा', phone: '९७६२८०२८८०, ९८८१३९६२७७', b: 2, t: 2, c: 2, tot: 6 },
  { id: 'niwas_ahmednagar_malvi_rishiraj', taluka: 'अहिल्यानगर', village: 'माळवी पिंपळगाव', name: 'माळवी पिंपळगाव तलाव (प.पू.आ. श्रीऋषिराजजी शास्त्री मामाजी म.)', nameEn: 'Malvi Pimpalgaon (Rishirajji Shastri)', contact: 'प.पू.आ. श्रीऋषिराजजी शास्त्री (मामाजी) म.', phone: '९६८९४९७२७७', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_ahmednagar_shingve_kolhekar', taluka: 'अहिल्यानगर', village: 'शिंगवे नाईक', name: 'शिंगवे नाईक (प.पू. श्रीअमोलदादा कोल्हेकर)', nameEn: 'Shingve Naik (Amoldada Kolhekar)', contact: 'प.पू. श्रीअमोलदादा कोल्हेकर', phone: '८६६८६४८४१४, ९४०५२७५७७७', b: 1, t: 2, c: 3, tot: 6 },
  { id: 'niwas_ahmednagar_madhpimpri_bidkar', taluka: 'अहिल्यानगर', village: 'मढपिंप्री', name: 'मढपिंप्री (प.पू. श्रीऋषिराजदादा बिडकर)', nameEn: 'Madhpimpri (Rishirajdada Bidkar)', contact: 'प.पू. श्रीऋषिराजदादा बिडकर', phone: '९४०३३७८६११', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_ahmednagar_madhpimpri_dharashiv', taluka: 'अहिल्यानगर', village: 'मढपिंप्री', name: 'मढपिंप्री (प.पू.त. मंगलाताई धाराशिवकर)', nameEn: 'Madhpimpri (Mangaltai Dharashivkar)', contact: 'प.पू.त. मंगलाताई धाराशिवकर', phone: '९७६७०४८४९२', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_ahmednagar_madhpimpri_suman', taluka: 'अहिल्यानगर', village: 'मढपिंप्री', name: 'मढपिंप्री (प.पू.त. सुमनताई विराट)', nameEn: 'Madhpimpri (Sumantai Virat)', contact: 'प.पू.त. सुमनताई विराट', phone: '+91 94222 34567', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_ahmednagar_madhpimpri_sulochana', taluka: 'अहिल्यानगर', village: 'मढपिंप्री', name: 'मढपिंप्री (प.पू.त. सुलोचनाताई विराट)', nameEn: 'Madhpimpri (Sulochana Virat)', contact: 'प.पू.त. सुलोचनाताई विराट', phone: '७६२०६१७२०९', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_ahmednagar_madhpimpri_shamdada', taluka: 'अहिल्यानगर', village: 'मढपिंप्री', name: 'मढपिंप्री (प.पू. श्रीशामदादा धाराशिवकर)', nameEn: 'Madhpimpri (Shamdada Dharashivkar)', contact: 'प.पू. श्रीशामदादा धाराशिवकर', phone: '९५७९१५६७२०', b: 1, t: 1, c: 0, tot: 2 },

  // २. ता. श्रीगोंदा
  { id: 'niwas_shrigonda_mandavgan_punjabi', taluka: 'श्रीगोंदा', village: 'मांडवगण', name: 'मांडवगण (प.पू.त. निर्मलाबाई पंजाबी)', nameEn: 'Mandavgan (Nirmalabai Punjabi)', contact: 'प.पू.त. निर्मलाबाई पंजाबी', phone: '९०९६३६०५०४, ९६६५७८४९०४', b: 1, t: 3, c: 2, tot: 6 },
  { id: 'niwas_shrigonda_mirajgaon_yelheraj', taluka: 'श्रीगोंदा', village: 'मिरजगांव', name: 'मिरजगांव (प.पू.श्री येल्हेराजबाबा धाराशिवकर)', nameEn: 'Mirajgaon (Yelherajbaba Dharashivkar)', contact: 'प.पू.श्री येल्हेराजबाबा धाराशिवकर', phone: '९४२२७४३५१३, ९४०५४००६७६, ९०११५३९४७५', b: 24, t: 15, c: 1, tot: 40 },
  { id: 'niwas_shrigonda_mirajgaon_santraj', taluka: 'श्रीगोंदा', village: 'मिरजगांव', name: 'मिरजगांव (प.पू.श्री संतराजदादा धाराशिवकर)', nameEn: 'Mirajgaon (Santrajdada Dharashivkar)', contact: 'प.पू.श्री संतराजदादा धाराशिवकर', phone: '८२७५४६८२७५, ९७६७६५३६७०', b: 1, t: 6, c: 1, tot: 8 },
  { id: 'niwas_shrigonda_ghogargaon_avinash', taluka: 'श्रीगोंदा', village: 'घोगरगांव', name: 'घोगरगांव (प.पू.श्री अविनाशदादा धाराशिवकर)', nameEn: 'Ghogargaon (Avinashdada Dharashivkar)', contact: 'प.पू.श्री अविनाशदादा धाराशिवकर', phone: '९७६७६५३६५२, ९४०५४००६५७', b: 4, t: 7, c: 3, tot: 14 },
  { id: 'niwas_shrigonda_ghutewadi_balkrishna', taluka: 'श्रीगोंदा', village: 'घुटेवाडी', name: 'घुटेवाडी (प.पू. शेवलीकर श्री बाळकृष्णदादा)', nameEn: 'Ghutewadi (Balkrishnadada Shevalikar)', contact: 'प.पू. शेवलीकर श्री बाळकृष्णदादा', phone: '७०२०५०४९४८', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_shrigonda_belvandi_mirabai', taluka: 'श्रीगोंदा', village: 'बेलवंडी', name: 'बेलवंडी (प.पू.त. मिराबाई मानेकर)', nameEn: 'Belvandi (Mirabai Manekar)', contact: 'प.पू.त. मिराबाई मानेकर', phone: '९४०६४०११६९', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_shrigonda_erandoli_bhandare', taluka: 'श्रीगोंदा', village: 'एरंडोली', name: 'एरंडोली (प.पू.श्री भंडारे गुरुजी)', nameEn: 'Erandoli (Bhandare Guruji)', contact: 'प.पू.श्री भंडारे गुरुजी', phone: '+91 94222 34567', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_shrigonda_chikhali_manekar', taluka: 'श्रीगोंदा', village: 'चिखली', name: 'चिखली नगर दौंड रोड (प.पू.म. श्रीसाधेराजबा मानेकर)', nameEn: 'Chikhali (Sadherajba Manekar)', contact: 'प.पू.म. श्रीसाधेराजबा मानेकर', phone: '९४०३७६५९५३', b: 2, t: 2, c: 0, tot: 4 },
  { id: 'niwas_shrigonda_visapur_balapurkar', taluka: 'श्रीगोंदा', village: 'विसापूर', name: 'विसापूर (प.पू.श्री गोपीराजदा बाळापूरकर)', nameEn: 'Visapur (Gopirajda Balapurkar)', contact: 'प.पू.श्री गोपीराजदा बाळापूरकर', phone: '८२७५८९७०१७, ९३२२५५६१६५', b: 3, t: 3, c: 1, tot: 7 },
  { id: 'niwas_shrigonda_mhatarpimpri_amrute', taluka: 'श्रीगोंदा', village: 'म्हातार पिंप्री', name: 'म्हातार पिंप्री (प.पू.श्री अशोकराजदादा अमृते शास्त्री)', nameEn: 'Mhatar Pimpri (Ashokrajdada Amrute)', contact: 'प.पू.श्री अशोकराजदादा अमृते शास्त्री', phone: '९४०५४०२७७७, ९३५९०८७६२८', b: 2, t: 1, c: 2, tot: 5 },

  // ३. ता. पारनेर
  { id: 'niwas_parner_palve_mallebaba', taluka: 'पारनेर', village: 'पळवे', name: 'पळवे (प.पू.म. श्रीबाळकृष्ण मल्लेबाबा)', nameEn: 'Palve (Balkrishna Mallebaba)', contact: 'प.पू.म. श्रीबाळकृष्ण मल्लेबाबा', phone: '९४०५२७६११३', b: 2, t: 2, c: 2, tot: 6 },
  { id: 'niwas_parner_city_kapate', taluka: 'पारनेर', village: 'पारनेर शहर', name: 'पारनेर शहर (प.पू.म. श्रीभानुव्यास बाबा कपाटे)', nameEn: 'Parner City (Bhanuvyas Baba)', contact: 'प.पू.म. श्रीभानुव्यास बाबा कपाटे', phone: '९४९९५०४८६६, ९४०५२७५९९४', b: 2, t: 4, c: 4, tot: 10 },
  { id: 'niwas_parner_city_ashutosh', taluka: 'पारनेर', village: 'पारनेर शहर', name: 'पारनेर शहर (प.पू. श्रीअशुतोषमुनी म.)', nameEn: 'Parner City (Ashutoshmuni)', contact: 'प.पू. श्रीअशुतोषमुनी म.', phone: '८४९९४४०९४९', b: 2, t: 0, c: 0, tot: 2 },
  { id: 'niwas_parner_lonihaveli_balapurkar', taluka: 'पारनेर', village: 'लोणी हवेली', name: 'लोणी हवेली (प.पू.म. श्रीबाळापूरकर बाबा)', nameEn: 'Loni Haveli (Balapurkar Baba)', contact: 'प.पू.म. श्रीबाळापूरकर बाबा', phone: '७६२०४७९६४५, ८७६७४२६०७९', b: 9, t: 13, c: 8, tot: 30 },
  { id: 'niwas_parner_lonihaveli_dattamandir', taluka: 'पारनेर', village: 'लोणी हवेली', name: 'श्रीदत्त म. आश्रम, लोणी हवेली (प.पू. श्रीमुनीबा)', nameEn: 'Shree Datta Ashram, Loni Haveli', contact: 'प.पू. श्रीमुनीबा', phone: '९७६३७४७७८४', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_parner_alkuti_kapate', taluka: 'पारनेर', village: 'अळकुटी', name: 'अळकुटी (प.पू. श्रीप्रदीपराजदादा कपाटे)', nameEn: 'Alkuti (Pradiprajdada Kapate)', contact: 'प.पू. श्रीप्रदीपराजदादा कपाटे', phone: '७४९९५०४७६६, ९४०५२७५९९४', b: 2, t: 6, c: 2, tot: 10 },
  { id: 'niwas_parner_vadzire_pusedkar', taluka: 'पारनेर', village: 'वडझिरे', name: 'वडझिरे (प.पू.म. श्रीमाधवराजबाबा पुसेदकर)', nameEn: 'Vadzire (Madhavrajbaba Pusedkar)', contact: 'प.पू.म. श्रीमाधवराजबाबा पुसेदकर', phone: '८८०५५६७१४३, ९४०५२७५८७६', b: 2, t: 2, c: 0, tot: 4 },
  { id: 'niwas_parner_vadzire_shevalikar', taluka: 'पारनेर', village: 'वडझिरे', name: 'वडझिरे (प.पू. कमलताई शेवलीकर)', nameEn: 'Vadzire (Kamaltai Shevalikar)', contact: 'प.पू. कमलताई शेवलीकर', phone: '९७६७४०७८९५', b: 0, t: 2, c: 2, tot: 4 },
  { id: 'niwas_parner_katalvedha_vidvans', taluka: 'पारनेर', village: 'काटाळवेढा', name: 'काटाळवेढा (प.पू.म. श्रीगोमेराजबाबा विद्वांस)', nameEn: 'Katalvedha (Gomerajbaba Vidvans)', contact: 'प.पू.म. श्रीगोमेराजबाबा विद्वांस', phone: '९८२२८७२१८९, ७०३८३९९७३५', b: 5, t: 5, c: 0, tot: 10 },

  // ४. ता. संगमनेर
  { id: 'niwas_sangamner_bota_ankulnerkar', taluka: 'संगमनेर', village: 'बोटा', name: 'बोटा अकलापूर रोड (प.पू. श्रीविराजदादा अंकुळनेरकर)', nameEn: 'Bota (Virajdada Ankulnerkar)', contact: 'प.पू. श्रीविराजदादा अंकुळनेरकर', phone: '९८९०५९६०२२, ९५०३५१२१२५', b: 1, t: 1, c: 8, tot: 10 },
  { id: 'niwas_sangamner_bota_bypass_anjan', taluka: 'संगमनेर', village: 'बोटा', name: 'बोटा बायपास (प.पू.म. श्रीकेशवराजबाबा अंजनगावकर)', nameEn: 'Bota Bypass (Keshavrajbaba Anjangavkar)', contact: 'प.पू.म. श्रीकेशवराजबाबा अंजनगावकर', phone: '९८८१७६५४७४, ९८८१०४९३४४', b: 4, t: 5, c: 1, tot: 10 },
  { id: 'niwas_sangamner_malwadibota_ankul', taluka: 'संगमनेर', village: 'माळवाडी बोटा', name: 'माळवाडी बोटा (प.पू.म. श्रीअंकुळनेरकर बाबा)', nameEn: 'Malwadi Bota (Ankulnerkar Baba)', contact: 'प.पू.म. श्रीअंकुळनेरकर बाबा', phone: '७०३०४८८४९५, ९३५९९५९६५१', b: 9, t: 10, c: 1, tot: 20 },
  { id: 'niwas_sangamner_kurkutwadi_vain', taluka: 'संगमनेर', village: 'कुरकुटवाडी', name: 'कुरकुटवाडी (प.पू.म. श्रीवाईंदेशकरबाबा म.)', nameEn: 'Kurkutwadi (Vaindeshkarbaba)', contact: 'प.पू.म. श्रीवाईंदेशकरबाबा म.', phone: '९४०३९८६४६४, ९९२२१७६१९३, ९४०५२७५९६०', b: 9, t: 8, c: 3, tot: 20 },
  { id: 'niwas_sangamner_kurkutwadi_taleg', taluka: 'संगमनेर', village: 'कुरकुटवाडी', name: 'कुरकुटवाडी (प.पू.त. मंगलाताई तळेगावकर)', nameEn: 'Kurkutwadi (Mangaltai Talegaonkar)', contact: 'प.पू.त. मंगलाताई तळेगावकर', phone: '९५५२७३०८८३', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_sangamner_aklapur_vidvans', taluka: 'संगमनेर', village: 'अकलापूर मुंजेवाडी', name: 'अकलापूर मुंजेवाडी (प.पू. श्रीअर्जुनदादा विद्वांस)', nameEn: 'Aklapur Munjewadi (Arjundada Vidvans)', contact: 'प.पू. श्रीअर्जुनदादा विद्वांस', phone: '९०७५३७७२१२', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_sangamner_gokulwadi_anjan', taluka: 'संगमनेर', village: 'गोकूळवाडी', name: 'गोकूळवाडी (प.पू. श्रीगोविंदराज शास्त्री अंजनगावकर)', nameEn: 'Gokulwadi (Govindraj Shastri)', contact: 'प.पू. श्रीगोविंदराज शास्त्री अंजनगावकर', phone: '९८८१७६५४७५, ९४०६४०३५७५', b: 2, t: 4, c: 2, tot: 8 },
  { id: 'niwas_sangamner_ghargaon_gumfekar', taluka: 'संगमनेर', village: 'घारगाव', name: 'घारगाव (प.पू. श्रीउत्तमराज गुंफेकर)', nameEn: 'Ghargaon (Uttamraj Gumfekar)', contact: 'प.पू. श्रीउत्तमराज गुंफेकर', phone: '९३२०६५९१४४', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_sangamner_ghargaon_ankulnerkar', taluka: 'संगमनेर', village: 'घारगाव', name: 'घारगाव (प.पू. श्रीगोपालदादा अंकुळनेरकर)', nameEn: 'Ghargaon (Gopaldada Ankulnerkar)', contact: 'प.पू. श्रीगोपालदादा अंकुळनेरकर', phone: '९६२३६५९६९६, ८३२९५६५३५२', b: 2, t: 2, c: 1, tot: 5 },
  { id: 'niwas_sangamner_koreddara', taluka: 'संगमनेर', village: 'कोरेडदरा', name: 'कोरेडदरा (व्यवस्थापक)', nameEn: 'Koreddara Ashram', contact: 'व्यवस्थापक', phone: '+91 94222 34567', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_sangamner_vadadara', taluka: 'संगमनेर', village: 'वडदरा', name: 'वडदरा (व्यवस्थापक)', nameEn: 'Vadadara Ashram', contact: 'व्यवस्थापक', phone: '+91 94222 34567', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_sangamner_abhalwadi_anjan', taluka: 'संगमनेर', village: 'आभाळवाडी', name: 'आभाळवाडी (प.पू.त. शांताबाई अंजनगावकर)', nameEn: 'Abhalwadi (Shantabai Anjangavkar)', contact: 'प.पू.त. शांताबाई अंजनगावकर', phone: '+91 94222 34567', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_sangamner_raytewadi_kamlakar', taluka: 'संगमनेर', village: 'रायतेवाडी', name: 'रायतेवाडी (प.पू.म. श्रीकमळाकरबाबा)', nameEn: 'Raytewadi (Kamlakarbaba)', contact: 'प.पू.म. श्रीकमळाकरबाबा', phone: '८३२९५५०७७१', b: 3, t: 7, c: 1, tot: 11 },
  { id: 'niwas_sangamner_jantnagar_anjan', taluka: 'संगमनेर', village: 'जनता नगर', name: 'जनता नगर (प.पू.म. श्रीदादेराजबुवा अंजनगावकर)', nameEn: 'Janta Nagar (Daderajbuva Anjangavkar)', contact: 'प.पू.म. श्रीदादेराजबुवा अंजनगावकर', phone: '+91 94222 34567', b: 1, t: 2, c: 5, tot: 8 },
  { id: 'niwas_sangamner_chandanap_pandit', taluka: 'संगमनेर', village: 'चंदनापुरी', name: 'चंदनापुरी (प.पू.म. श्रीपंडितबुवा)', nameEn: 'Chandanapuri (Panditbuva)', contact: 'प.पू.म. श्रीपंडितबुवा', phone: '९४०५४०३०३, ९५१८५५९३०७', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_sangamner_chandanap_lahanubai', taluka: 'संगमनेर', village: 'चंदनापुरी', name: 'चंदनापुरी (प.पू.त. लहानुबाई अंजनगावकर)', nameEn: 'Chandanapuri (Lahanubai Anjangavkar)', contact: 'प.पू.त. लहानुबाई अंजनगावकर', phone: '८६२३०१८७२८, ८६६८७४५४४१', b: 1, t: 3, c: 0, tot: 4 },
  { id: 'niwas_sangamner_nimaj_nimajkar', taluka: 'संगमनेर', village: 'निमज', name: 'निमज (प.पू.म. श्रीनिमजकरबाबा)', nameEn: 'Nimaj (Nimajkarbaba)', contact: 'प.पू.म. श्रीनिमजकरबाबा', phone: '९३७२०१३६६२, ९४०५४००४९५', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_sangamner_nimaj_krishnaraj', taluka: 'संगमनेर', village: 'निमज', name: 'निमज (प.पू.म. श्रीकृष्णराजबुवा)', nameEn: 'Nimaj (Krishnarajbuva)', contact: 'प.पू.म. श्रीकृष्णराजबुवा', phone: '९४०५४०३५३०', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_sangamner_vadgaon_sukinekar', taluka: 'संगमनेर', village: 'वडगांव लांडगा', name: 'वडगांव लांडगा (प.पू. श्रीभास्करदादा सुकिनेकर)', nameEn: 'Vadgaon Landga (Bhaskardada Sukinekar)', contact: 'प.पू. श्रीभास्करदादा सुकिनेकर', phone: '९२८४२७०८८२, ९४०५२७४४५२', b: 2, t: 1, c: 1, tot: 4 },
  { id: 'niwas_sangamner_ashvi_parandekar', taluka: 'संगमनेर', village: 'आश्वी', name: 'आश्वी (प.पू.म. श्रीबायराजबुवा परांडेकर)', nameEn: 'Ashvi (Bayrajbuva Parandekar)', contact: 'प.पू.म. श्रीबायराजबुवा परांडेकर', phone: '९९२१५२९६९९, ९२८४२३०३७८', b: 1, t: 5, c: 3, tot: 9 },
  { id: 'niwas_sangamner_ashvi_kapate', taluka: 'संगमनेर', village: 'आश्वी', name: 'आश्वी (प.पू.त. सुभद्राबाई कपाटे)', nameEn: 'Ashvi (Subhadrabai Kapate)', contact: 'प.पू.त. सुभद्राबाई कपाटे', phone: '९२२६४०४३८५, ७७२१८२५१९७', b: 1, t: 4, c: 0, tot: 5 },
  { id: 'niwas_sangamner_varvandi_punjabi', taluka: 'संगमनेर', village: 'वरवंडी', name: 'वरवंडी खांब (प.पू.त. श्रद्धाताई पंजाबी)', nameEn: 'Varvandi Khamb (Shraddhatai Punjabi)', contact: 'प.पू.त. श्रद्धाताई पंजाबी', phone: '७०५७५४७५४१', b: 0, t: 3, c: 0, tot: 3 },
  { id: 'niwas_sangamner_varvandi_varpe', taluka: 'संगमनेर', village: 'वरवंडी', name: 'वरवंडी (प.पू.त. सिताबाई वर्पे)', nameEn: 'Varvandi (Sitabai Varpe)', contact: 'प.पू.त. सिताबाई वर्पे', phone: '+91 94222 34567', b: 0, t: 3, c: 0, tot: 3 },
  { id: 'niwas_sangamner_ciplapur_khamnikar', taluka: 'संगमनेर', village: 'सिप्लापूर', name: 'सिप्लापूर (प.पू.त. रेखाताई खामनीकर)', nameEn: 'Ciplapur (Rekhatai Khamnikar)', contact: 'प.पू.त. रेखाताई खामनीकर', phone: '८२६५०२८०५४', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_sangamner_ciplapur_shevalikar', taluka: 'संगमनेर', village: 'सिप्लापूर', name: 'सिप्लापूर (प.पू. श्रीकृष्णराजबाबा शेवलीकर)', nameEn: 'Ciplapur (Krishnarajbaba Shevalikar)', contact: 'प.पू. श्रीकृष्णराजबाबा शेवलीकर', phone: '९४०५२७६२७९', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_sangamner_nimon_kapate1', taluka: 'संगमनेर', village: 'निमोण', name: 'निमोण (प.पू.त. हिराबाई कपाटे)', nameEn: 'Nimon (Hirabai Kapate)', contact: 'प.पू.त. हिराबाई कपाटे', phone: '९९२१०६४२२६', b: 0, t: 4, c: 0, tot: 4 },
  { id: 'niwas_sangamner_nimon_kapate2', taluka: 'संगमनेर', village: 'निमोण', name: 'निमोण (प.पू.त. मिराबाई कपाटे)', nameEn: 'Nimon (Mirabai Kapate)', contact: 'प.पू.त. मिराबाई कपाटे', phone: '९४०३९८७०८०', b: 1, t: 3, c: 4, tot: 8 },
  { id: 'niwas_sangamner_nimon_anjan', taluka: 'संगमनेर', village: 'निमोण', name: 'निमोण (प.पू.त. अलकाबाई अंजनगावकर)', nameEn: 'Nimon (Alkabai Anjangavkar)', contact: 'प.पू.त. अलकाबाई अंजनगावकर', phone: '९६५७१३३०७२, ९९७०६४७६४७', b: 0, t: 3, c: 0, tot: 3 },
  { id: 'niwas_sangamner_dhandarfal_shevalikar', taluka: 'संगमनेर', village: 'धांदरफळ', name: 'धांदरफळ कारमळा (प.पू.त. अरूणाताई शेवलीकर)', nameEn: 'Dhandarfal (Arunatai Shevalikar)', contact: 'प.पू.त. अरूणाताई शेवलीकर', phone: '९४२०१०९२१३', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_sangamner_chiravali_ankulnerkar', taluka: 'संगमनेर', village: 'चिरवली', name: 'चिरवली (प.पू.त. सोनाली अंकुळनेरकर)', nameEn: 'Chiravali (Sonali Ankulnerkar)', contact: 'प.पू.त. सोनाली अंकुळनेरकर', phone: '७८२२०७७४८९', b: 1, t: 2, c: 0, tot: 3 },
  { id: 'niwas_sangamner_manglapur_ankulnerkar', taluka: 'संगमनेर', village: 'मंगळापूर', name: 'मंगळापूर (प.पू. श्रीकृष्णराजबा अंकुळनेरकर)', nameEn: 'Manglapur (Krishnarajba Ankulnerkar)', contact: 'प.पू. श्रीकृष्णराजबा अंकुळनेरकर', phone: '९४०५४०३५३०, ९४०५४०३५२०', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_sangamner_manglapur_shevalikar', taluka: 'संगमनेर', village: 'मंगळापूर', name: 'मंगळापूर (प.पू.त. सरुबाई शेवलीकर)', nameEn: 'Manglapur (Sarubai Shevalikar)', contact: 'प.पू.त. सरुबाई शेवलीकर', phone: '+91 94222 34567', b: 0, t: 1, c: 0, tot: 1 },

  // ५. ता. अकोले
  { id: 'niwas_akole_dhumalwadi_kapate', taluka: 'अकोले', village: 'धुमाळवाडी', name: 'धुमाळवाडी (प.पू.म. श्रीचक्रपाणीबाबा कपाटे)', nameEn: 'Dhumalwadi (Chakrapanibaba Kapate)', contact: 'प.पू.म. श्रीचक्रपाणीबाबा कपाटे', phone: '९८५०४४३२०४, ७८७५९३६७३९', b: 3, t: 4, c: 4, tot: 11 },
  { id: 'niwas_akole_vithe_ankulnerkar', taluka: 'अकोले', village: 'विठे', name: 'विठे (प.पू.म. श्रीमुकुंदराजदादा अंकुळनेरकर)', nameEn: 'Vithe (Mukundrajdada Ankulnerkar)', contact: 'प.पू.म. श्रीमुकुंदराजदादा अंकुळनेरकर', phone: '९४२२२३२७४३, ९४०५४००७७७', b: 2, t: 4, c: 3, tot: 9 },
  { id: 'niwas_akole_rumbhodi_kolhekar', taluka: 'अकोले', village: 'रुंभोडी', name: 'रुंभोडी (प.पू.त. कविताबाई कोल्हेकर)', nameEn: 'Rumbhodi (Kavitabai Kolhekar)', contact: 'प.पू.त. कविताबाई कोल्हेकर', phone: '९५१८९८८७४८, ८२७५४६९२१५, ९९२१७५२४१४', b: 1, t: 1, c: 2, tot: 4 },
  { id: 'niwas_akole_virgaon_sonalkar', taluka: 'अकोले', village: 'वीरगांव फाटा', name: 'वीरगांव फाटा (प.पू.म. श्रीसोनाळकरबुवा)', nameEn: 'Virgaon Phata (Sonalkarbuva)', contact: 'प.पू.म. श्रीसोनाळकरबुवा', phone: '९९२१९६२६२९', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_akole_samsherpur_shevalikar', taluka: 'अकोले', village: 'समशेरपूर', name: 'समशेरपूर (प.पू.त. अर्चनाताई शेवलीकर)', nameEn: 'Samsherpur (Archanatai Shevalikar)', contact: 'प.पू.त. अर्चनाताई शेवलीकर', phone: '९११२७४४२३५, ९४०३३८७२१६, ९४२०३६५७६४', b: 1, t: 2, c: 0, tot: 3 },
  { id: 'niwas_akole_brahmanvada_fatebaba', taluka: 'अकोले', village: 'ब्राह्मणवाडा', name: 'ब्राह्मणवाडा (प.पू.म. श्रीफाटेबाबा)', nameEn: 'Brahmanvada (Fatebaba)', contact: 'प.पू.म. श्रीफाटेबाबा', phone: '९६०४९६८०९५, ९३७२१४८८९६', b: 2, t: 3, c: 2, tot: 7 },

  // ६. ता. कोपरगाव
  { id: 'niwas_kopargaon_samvatsar_rajdhar', taluka: 'कोपरगाव', village: 'संवत्सर', name: 'संवत्सर स्थान (प.पू.म.आचार्य श्रीराजधरबाबा)', nameEn: 'Samvatsar Sthan (Rajdharbaba)', contact: 'प.पू.म.आचार्य श्रीराजधरबाबा', phone: '९४०५४००५०१, ९८२२८४६३६३', b: 65, t: 120, c: 45, tot: 230 },
  { id: 'niwas_kopargaon_jeur_yashraj', taluka: 'कोपरगाव', village: 'जेऊर कुंभारी', name: 'जेऊर कुंभारी (प.पू.डॉ. यशराजशास्त्री)', nameEn: 'Jeur Kumbhari (Yashrajshastri)', contact: 'प.पू.डॉ. यशराजशास्त्री', phone: '९८३४८१०९६६, ९४२३७८३६८२', b: 4, t: 18, c: 5, tot: 27 },
  { id: 'niwas_kopargaon_baktarpur_ghugge1', taluka: 'कोपरगाव', village: 'बक्तरपूर', name: 'सर्वतीर्थ आश्रम, बक्तरपूर (प.पू.म. कानळसकरबाबा घुग्गे)', nameEn: 'Sarvatirtha Ashram, Baktarpur', contact: 'प.पू.म. कानळसकरबाबा घुग्गे', phone: '९४०५२७४४१२, ९०११२०७३०१', b: 2, t: 3, c: 3, tot: 8 },
  { id: 'niwas_kopargaon_baktarpur_ghugge2', taluka: 'कोपरगाव', village: 'बक्तरपूर', name: 'बक्तरपूर (प.पू.त. द्वारकाबाई घुग्गे)', nameEn: 'Baktarpur (Dwarkabai Ghugge)', contact: 'प.पू.त. द्वारकाबाई घुग्गे', phone: '९४०५४०३०४३', b: 1, t: 1, c: 5, tot: 7 },
  { id: 'niwas_kopargaon_baktarpur_meenabai', taluka: 'कोपरगाव', village: 'बक्तरपूर', name: 'बक्तरपूर (प.पू.त. मीनाबाई)', nameEn: 'Baktarpur (Meenabai)', contact: 'प.पू.त. मीनाबाई', phone: '९०११२४०३३२', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_kopargaon_suregaon_anant', taluka: 'कोपरगाव', village: 'सुरेगाव', name: 'सुरेगाव (प.पू. श्रीअनंतराजदादा)', nameEn: 'Suregaon (Anantrajdada)', contact: 'प.पू. श्रीअनंतराजदादा', phone: '९२०९२३४५८९, ८८३००८६५४६', b: 4, t: 4, c: 0, tot: 8 },
  { id: 'niwas_kopargaon_sonari_prem', taluka: 'कोपरगाव', village: 'सोनारी', name: 'सोनारी (प.पू. श्रीप्रेममुनी अंजनगावकर)', nameEn: 'Sonari (Premmuni Anjangavkar)', contact: 'प.पू. श्रीप्रेममुनी अंजनगावकर', phone: '७६२०८५१४६६', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_kopargaon_ranjangaon_bhoj', taluka: 'कोपरगाव', village: 'रांजणगांव देशमुख', name: 'रांजणगांव देशमुख (प.पू. श्रीजितेंद्रमुनी भोजने)', nameEn: 'Ranjangaon Deshmukh (Jitendramuni)', contact: 'प.पू. श्रीजितेंद्रमुनी भोजने', phone: '९४२०९९०६१५, ७०५७६४९४०७, ९४०५२७५१६७', b: 4, t: 6, c: 5, tot: 15 },
  { id: 'niwas_kopargaon_ranjangaon_vinod', taluka: 'कोपरगाव', village: 'रांजणगांव देशमुख', name: 'रांजणगांव देशमुख (प.पू. श्रीविनोददादा लालबाबा)', nameEn: 'Ranjangaon Deshmukh (Vinoddada)', contact: 'प.पू. श्रीविनोददादा (लालबाबा)', phone: '८२७५९७४२८९', b: 2, t: 1, c: 1, tot: 4 },
  { id: 'niwas_kopargaon_shingnapur_kapate', taluka: 'कोपरगाव', village: 'शिंगणापूर', name: 'शिंगणापूर कोपरगांव रेल्वे फाटक (प.पू.त. नंदाबाई कपाटे)', nameEn: 'Shingnapur (Nandabai Kapate)', contact: 'प.पू.त. नंदाबाई कपाटे', phone: '८०१०४४४६५०', b: 0, t: 1, c: 4, tot: 5 },
  { id: 'niwas_kopargaon_kauthe_sujata', taluka: 'कोपरगाव', village: 'कौठे कमळेश्वर', name: 'कौठे कमळेश्वर (प.पू.त. सुजाता म.)', nameEn: 'Kauthe Kamleshwar (Sujata M.)', contact: 'प.पू.त. सुजाता म.', phone: '९६२३६७७९४८', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_kopargaon_karanji_indrabai', taluka: 'कोपरगाव', village: 'करंजी', name: 'करंजी (प.पू.त. इंद्राबाई)', nameEn: 'Karanji (Indrabai)', contact: 'प.पू.त. इंद्राबाई', phone: '८९७५३३४३०२', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_kopargaon_javalka_marathe', taluka: 'कोपरगाव', village: 'जवळका वेस', name: 'जवळका वेस (प.पू.म. श्रीमुरारीमल्लबाबा मराठे)', nameEn: 'Javalka Ves (Murarimallbaba Marathe)', contact: 'प.पू.म. श्रीमुरारीमल्लबाबा मराठे', phone: '९६८९०९८७२९', b: 1, t: 2, c: 0, tot: 3 },

  // ७. ता. श्रीरामपूर
  { id: 'niwas_shrirampur_belapur_ane', taluka: 'श्रीरामपूर', village: 'बेलापूर वनदेव', name: 'बेलापूर वनदेव (प.पू. श्रीआनेराजशास्त्री)', nameEn: 'Belapur Vandev (Anerajshastri)', contact: 'प.पू. श्रीआनेराजशास्त्री', phone: '+91 94222 34567', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_shrirampur_belapur_lad1', taluka: 'श्रीरामपूर', village: 'बेलापूर स्थान', name: 'बेलापूर स्थान (प.पू.त. विद्याताई लाड)', nameEn: 'Belapur Sthan (Vidyatai Lad)', contact: 'प.पू.त. विद्याताई लाड', phone: '९९३०८०७७७७, ८८३०८३२७९५', b: 1, t: 3, c: 2, tot: 6 },
  { id: 'niwas_shrirampur_belapur_kemkar', taluka: 'श्रीरामपूर', village: 'बेलापूर स्थान', name: 'बेलापूर स्थान (प.पू.म. श्रीकेमकरबाबा)', nameEn: 'Belapur Sthan (Kemkarbaba)', contact: 'प.पू.म. श्रीकेमकरबाबा', phone: '९४०५४०३५१९, ९६६५३४०१४०', b: 1, t: 2, c: 2, tot: 5 },
  { id: 'niwas_shrirampur_belapur_lad2', taluka: 'श्रीरामपूर', village: 'बेलापूर स्थान', name: 'बेलापूर स्थान (प.पू.म. कृष्णराजबुवा लाड)', nameEn: 'Belapur Sthan (Krishnarajbuva Lad)', contact: 'प.पू.म. कृष्णराजबुवा लाड', phone: '९८६००३७५९६', b: 3, t: 6, c: 6, tot: 15 },
  { id: 'niwas_shrirampur_khamnikar_nanda', taluka: 'श्रीरामपूर', village: 'खामनीकर आश्रम', name: 'खामनीकर आश्रम (प.पू.त. नंदाताई खामनीकर)', nameEn: 'Khamnikar Ashram (Nandatai)', contact: 'प.पू.त. नंदाताई खामनीकर', phone: '९८५०४७५०९०, ९८६००३७५९६', b: 4, t: 4, c: 4, tot: 12 },
  { id: 'niwas_shrirampur_khamnikar_pand', taluka: 'श्रीरामपूर', village: 'खामनीकर आश्रम', name: 'खामनीकर आश्रम (प.पू. श्रीपंडीतराजदादा खामनीकर)', nameEn: 'Khamnikar Ashram (Panditrajdada)', contact: 'प.पू. श्रीपंडीतराजदादा खामनीकर', phone: '७२७६२२१७७१, ९९२१७६७८८०', b: 2, t: 3, c: 0, tot: 5 },
  { id: 'niwas_shrirampur_khandagle_balap', taluka: 'श्रीरामपूर', village: 'खंडागळे वस्ती', name: 'खंडागळे वस्ती (श्रीमुरलीधरदादा बाळापूरकर)', nameEn: 'Khandagle Vasti (Murlidhardada Balapurkar)', contact: 'श्रीमुरलीधरदादा बाळापूरकर', phone: '९५५२६५६२६३', b: 1, t: 3, c: 0, tot: 4 },
  { id: 'niwas_shrirampur_bansi_ane', taluka: 'श्रीरामपूर', village: 'बन्सीवाले श्रीकृष्ण मंदिर', name: 'बन्सीवाले श्रीकृष्ण मंदिर (प.पू. श्रीआनेराजबाबा)', nameEn: 'Bansiwale Shree Krishna Mandir', contact: 'प.पू. श्रीआनेराजबाबा', phone: '९२७०५०२८३४', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_shrirampur_city_pantbuva', taluka: 'श्रीरामपूर', village: 'श्रीरामपूर', name: 'श्रीरामपूर (प.पू. पंतबुवा)', nameEn: 'Shrirampur (Pantbuva)', contact: 'प.पू. पंतबुवा', phone: '९४०५४०३५१८', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_shrirampur_othamba_vidvans', taluka: 'श्रीरामपूर', village: 'ओथंबांमठ', name: 'ओथंबांमठ (प.पू. श्रीविशालदादा विद्वांस)', nameEn: 'Othambamath (Vishaldada Vidvans)', contact: 'प.पू. श्रीविशालदादा विद्वांस', phone: '९४०५४०३४९५', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_shrirampur_chakradhar_kolh', taluka: 'श्रीरामपूर', village: 'श्रीचक्रधर मंदिर', name: 'श्रीचक्रधर मंदिर (प.पू. श्रीदेवेंद्रमुनी कोल्हेकर)', nameEn: 'Shree Chakradhar Mandir (Devendramuni)', contact: 'प.पू. श्रीदेवेंद्रमुनी कोल्हेकर', phone: '९६९९८६०४८४, ९९२१९७९९८१', b: 1, t: 0, c: 1, tot: 2 },
  { id: 'niwas_shrirampur_bhokersthan_ank', taluka: 'श्रीरामपूर', village: 'भोकर स्थान', name: 'भोकर स्थान (प.पू.म. श्रीसाधैराजबाबा अंकुळनेरकर)', nameEn: 'Bhoker Sthan (Sadhairajbaba)', contact: 'प.पू.म. श्रीसाधैराजबाबा अंकुळनेरकर', phone: '९४०५४०३५१४, ९०६०८७७६४८', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_shrirampur_bhokersthan_dwa', taluka: 'श्रीरामपूर', village: 'भोकर स्थान', name: 'भोकर स्थान (प.पू.त. द्वारकाबाई)', nameEn: 'Bhoker Sthan (Dwarkabai)', contact: 'प.पू.त. द्वारकाबाई', phone: '+91 94222 34567', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_shrirampur_bhoker_gumfe', taluka: 'श्रीरामपूर', village: 'भोकर', name: 'भोकर (प.पू.म. श्रीगुंफेकरबाबा म.)', nameEn: 'Bhoker (Gumfekarbaba)', contact: 'प.पू.म. श्रीगुंफेकरबाबा म.', phone: '९४२०६३७८५४, ९४०५४०३५३१', b: 15, t: 22, c: 4, tot: 41 },
  { id: 'niwas_shrirampur_bhoker_gumfesh', taluka: 'श्रीरामपूर', village: 'भोकर', name: 'भोकर (प.पू. श्रीशामदादा गुंफेकर)', nameEn: 'Bhoker (Shamdada Gumfekar)', contact: 'प.पू. श्रीशामदादा गुंफेकर', phone: '९४०३९८५२५२', b: 1, t: 1, c: 2, tot: 4 },
  { id: 'niwas_shrirampur_taklibhan_dar', taluka: 'श्रीरामपूर', village: 'टाकळीभान', name: 'टाकळीभान (प.पू.म. श्रीमुरलीधरदादा दर्यापूरकर)', nameEn: 'Taklibhan (Murlidhardada Daryapurkar)', contact: 'प.पू.म. श्रीमुरलीधरदादा दर्यापूरकर', phone: '९८२२३०९४२६, ८२७५४६९२१६', b: 1, t: 1, c: 2, tot: 4 },
  { id: 'niwas_shrirampur_ghumandev_vidv', taluka: 'श्रीरामपूर', village: 'घुमनदेव', name: 'घुमनदेव (प.पू.त. मंगलताई विद्वांस)', nameEn: 'Ghumandev (Mangaltai Vidvans)', contact: 'प.पू.त. मंगलताई विद्वांस', phone: '९४०५४०३५१७', b: 0, t: 4, c: 0, tot: 4 },
  { id: 'niwas_shrirampur_dome_vidvans', taluka: 'श्रीरामपूर', village: 'डोमेग्राम', name: 'राजमठ, डोमेग्राम (प.पू. श्रीप्रभाकरदादा विद्वांस)', nameEn: 'Rajmath, Domegram (Prabhakardada)', contact: 'प.पू. श्रीप्रभाकरदादा विद्वांस', phone: '९२७०४६९९१८, ९४०५२७४९८८', b: 5, t: 15, c: 5, tot: 25 },
  { id: 'niwas_shrirampur_dome_bidkar', taluka: 'श्रीरामपूर', village: 'डोमेग्राम', name: 'राजमठ, डोमेग्राम (प.पू.त. सुजाताताई बिडकर)', nameEn: 'Rajmath, Domegram (Sujatatai)', contact: 'प.पू.त. सुजाताताई बिडकर', phone: '८२७५८९३३०८, ८२७५८४४२२०', b: 0, t: 4, c: 0, tot: 4 },
  { id: 'niwas_shrirampur_dome_annachatra', taluka: 'श्रीरामपूर', village: 'डोमेग्राम', name: 'देवदत्त आश्रम अन्नछत्र, डोमेग्राम (प.पू. श्रीवामनमुनी अंकुळनेरकर)', nameEn: 'Devdatta Ashram Annachatra, Domegram', contact: 'प.पू. श्रीवामनमुनी अंकुळनेरकर', phone: '९४०५४००३०४, ९३७३८४७९८०', b: 0, t: 0, c: 0, tot: 0 },
  { id: 'niwas_shrirampur_dome_saing', taluka: 'श्रीरामपूर', village: 'डोमेग्राम', name: 'देवदत्त आश्रम, डोमेग्राम (प.पू. श्रीसैंगमुनी)', nameEn: 'Devdatta Ashram, Domegram (Saingmuni)', contact: 'प.पू. श्रीसैंगमुनी', phone: '+91 94222 34567', b: 4, t: 11, c: 1, tot: 16 },
  { id: 'niwas_shrirampur_dome_yelamkar', taluka: 'श्रीरामपूर', village: 'डोमेग्राम', name: 'डोमेग्राम (प.पू.त. रजनीताई येळमकर)', nameEn: 'Domegram (Rajnitaoi Yelamkar)', contact: 'प.पू.त. रजनीताई येळमकर', phone: '९९२३०५१०६६, ८८८८७३३३८७', b: 2, t: 2, c: 2, tot: 6 },
  { id: 'niwas_shrirampur_dome_gunfa', taluka: 'श्रीरामपूर', village: 'डोमेग्राम', name: 'महातीर्थराज श्रीचक्रधर मंदिर गुंफा, डोमेग्राम (प.पू.त. निर्मलाताई कपाटे)', nameEn: 'Shree Chakradhar Cave, Domegram', contact: 'प.पू.त. निर्मलाताई कपाटे', phone: '८२७५४६७९५५, ९६०४९८२३७२', b: 7, t: 17, c: 2, tot: 26 },
  { id: 'niwas_shrirampur_khairi_pravin', taluka: 'श्रीरामपूर', village: 'खैरी निमगांव', name: 'खैरी निमगांव (प.पू. श्रीप्रवीनकुमार शास्त्री)', nameEn: 'Khairi Nimgaon (Pravinkumar Shastri)', contact: 'प.पू. श्रीप्रवीनकुमार शास्त्री', phone: '९२८४०३३७४०, ९८५०६३१४६९', b: 2, t: 7, c: 2, tot: 11 },
  { id: 'niwas_shrirampur_gondeg_bhoj', taluka: 'श्रीरामपूर', village: 'गोंडेगाव', name: 'गोंडेगाव (प.पू. श्रीगोविंदराज भोजने)', nameEn: 'Gondegaon (Govindraj Bhojane)', contact: 'प.पू. श्रीगोविंदराज भोजने', phone: '९१४६६५०१४१', b: 2, t: 2, c: 1, tot: 5 },
  { id: 'niwas_shrirampur_naur_virat', taluka: 'श्रीरामपूर', village: 'नाऊर', name: 'नाऊर (प.पू. श्रीशिवव्यासबुवा विराट)', nameEn: 'Naur (Shivvyasbuva Virat)', contact: 'प.पू. श्रीशिवव्यासबुवा विराट', phone: '+91 94222 34567', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_shrirampur_nayg_chakrapani', taluka: 'श्रीरामपूर', village: 'नायगांव', name: 'नायगांव (प.पू.म. श्रीचक्रपाणीबुवा)', nameEn: 'Naygaon (Chakrapanibuva)', contact: 'प.पू.म. श्रीचक्रपाणीबुवा', phone: '+91 94222 34567', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_shrirampur_padeg_aradhye', taluka: 'श्रीरामपूर', village: 'पढेगाव', name: 'पढेगाव (प.पू. श्रीमुरलीधरदादा आराध्य)', nameEn: 'Padegaon (Murlidhardada Aradhye)', contact: 'प.पू. श्रीमुरलीधरदादा आराध्य', phone: '+91 94222 34567', b: 1, t: 1, c: 1, tot: 3 },

  // ८. ता. राहुरी
  { id: 'niwas_rahuri_vambori_rishiraj', taluka: 'राहुरी', village: 'वांबोरी', name: 'वांबोरी (प.पू. आचार्य श्रीऋषिराजजी शास्त्री म.)', nameEn: 'Vambori (Rishirajji Shastri)', contact: 'प.पू. आचार्य श्रीऋषिराजजी शास्त्री म.', phone: '९४०५२७५२७५, ९४०५२७५२०२, ९४०५२७४४२७', b: 125, t: 185, c: 130, tot: 440 },
  { id: 'niwas_rahuri_vambori_marathe', taluka: 'राहुरी', village: 'वांबोरी', name: 'वांबोरी स्थान (प.पू. श्रीउद्धवराज मराठे)', nameEn: 'Vambori Sthan (Uddhavraj Marathe)', contact: 'प.पू. श्रीउद्धवराज मराठे', phone: '९४०५२७५२०२', b: 2, t: 2, c: 3, tot: 7 },
  { id: 'niwas_rahuri_katrad_pandekar', taluka: 'राहुरी', village: 'कात्रड', name: 'कात्रड (प.पू.म. श्रीपांडेकरबाबा म.)', nameEn: 'Katrad (Pandekarbaba)', contact: 'प.पू.म. श्रीपांडेकरबाबा म.', phone: '९९२१७५६४४७, ९४०५२७४४१४', b: 2, t: 4, c: 4, tot: 10 },
  { id: 'niwas_rahuri_kukkad_bidkar', taluka: 'राहुरी', village: 'कुक्कड वेढा', name: 'कुक्कड वेढा (प.पू. श्रीसंतराजदादा बिडकर)', nameEn: 'Kukkad Vedha (Santrajdada Bidkar)', contact: 'प.पू. श्रीसंतराजदादा बिडकर', phone: '९५६१२७५०९२', b: 1, t: 2, c: 0, tot: 3 },

  // ९. ता. राहता
  { id: 'niwas_rahata_punatamba_shev', taluka: 'राहता', village: 'पुणतांबा', name: 'पुणतांबा स्थान (प.पू. पंडितराजदादा शेवलीकर)', nameEn: 'Puntamba Sthan (Panditrajdada)', contact: 'प.पू. पंडितराजदादा शेवलीकर', phone: '९८२२४२४१५८', b: 1, t: 2, c: 3, tot: 6 },
  { id: 'niwas_rahata_punatamba_punj', taluka: 'राहता', village: 'पुणतांबा', name: 'पुणतांबा (प.पू. श्रीविलासदादा पंजाबी)', nameEn: 'Puntamba (Vilasdada Punjabi)', contact: 'प.पू. श्रीविलासदादा पंजाबी', phone: '९९५८१४९९४५, ९०२२८५७६१०', b: 3, t: 6, c: 3, tot: 12 },
  { id: 'niwas_rahata_city_kapate', taluka: 'राहता', village: 'राहाता', name: 'राहाता (प.पू.त. सारिका कपाटे)', nameEn: 'Rahata (Sarika Kapate)', contact: 'प.पू.त. सारिका कपाटे', phone: '८२७५५७३८८५', b: 1, t: 2, c: 2, tot: 5 },
  { id: 'niwas_rahata_city_ghugge', taluka: 'राहता', village: 'राहाता', name: 'राहाता (प.पू.त. संगिताताई घुग्गे)', nameEn: 'Rahata (Sangitatai Ghugge)', contact: 'प.पू.त. संगिताताई घुग्गे', phone: '+91 94222 34567', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_rahata_kanhe_kham', taluka: 'राहता', village: 'कान्हेगांव फाटा', name: 'कान्हेगांव फाटा (प.पू. श्रीमहेेशकुमार खामनीकर)', nameEn: 'Kanhegaon Phata (Maheshkumar)', contact: 'प.पू. श्रीमहेेशकुमार खामनीकर', phone: '+91 94222 34567', b: 3, t: 0, c: 0, tot: 3 },

  // १०. ता. नेवासा
  { id: 'niwas_nevasa_bel_faltankar', taluka: 'नेवासा', village: 'बेल पिंपळगाव', name: 'बेल पिंपळगाव (प.पू.त. मंदाबाई फलटणकर)', nameEn: 'Bel Pimpalgaon (Mandabai)', contact: 'प.पू.त. मंदाबाई फलटणकर', phone: '८७६७१४३१५०, ७३५०१३७४८८', b: 0, t: 3, c: 2, tot: 5 },
  { id: 'niwas_nevasa_suregaon_aradhye', taluka: 'नेवासा', village: 'सुरेगांव', name: 'सुरेगांव (प.पू. श्रीवेदमनी आराध्य)', nameEn: 'Suregaon (Vedmani Aradhye)', contact: 'प.पू. श्रीवेदमनी आराध्य', phone: '९४०३९८५५३४, ८३०८१३७३२०', b: 3, t: 2, c: 0, tot: 5 },
  { id: 'niwas_nevasa_sthan_ankul', taluka: 'नेवासा', village: 'नेवासा स्थान', name: 'नेवासा स्थान (प.पू. श्रीशाममुनी अंकुळनेरकर)', nameEn: 'Nevasa Sthan (Shammuni Ankulnerkar)', contact: 'प.पू. श्रीशाममुनी अंकुळनेरकर', phone: '९४०३९८५२८८, ९४०३९८५२६६', b: 1, t: 2, c: 4, tot: 7 },
  { id: 'niwas_nevasa_bhan_yelamkar', taluka: 'नेवासा', village: 'भानसहिवरा वस्ती', name: 'भानसहिवरा वस्ती (प.पू. श्रीसुधाकरदादा येळमकर)', nameEn: 'Bhansahivra Vasti (Sudhakardada)', contact: 'प.पू. श्रीसुधाकरदादा येळमकर', phone: '९४०५४०३५२१', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nevasa_patare_aradhye', taluka: 'नेवासा', village: 'पटारे वस्ती', name: 'पटारे वस्ती (प.पू.त. आशाताई आराध्य)', nameEn: 'Patare Vasti (Ashatai Aradhye)', contact: 'प.पू.त. आशाताई आराध्य', phone: '७७९६४८३३६८', b: 0, t: 3, c: 3, tot: 6 },
  { id: 'niwas_nevasa_bhan_aradhye', taluka: 'नेवासा', village: 'भानसहिवरा गाव', name: 'भानसहिवरा गाव (प.पू.म. श्रीदिगंबरबाबा आराध्य)', nameEn: 'Bhansahivra Village (Digambarbaba)', contact: 'प.पू.म. श्रीदिगंबरबाबा आराध्य', phone: '८७९६६४१४२१', b: 3, t: 3, c: 0, tot: 6 },
  { id: 'niwas_nevasa_bhange_dharashiv', taluka: 'नेवासा', village: 'भनगेवस्ती', name: 'भनगेवस्ती (प.पू.म. श्रीप्रभाकरबावा धाराशिवकर)', nameEn: 'Bhange Vasti (Prabhakarbawa)', contact: 'प.पू.म. श्रीप्रभाकरबावा धाराशिवकर', phone: '९४०३९५५२७७, ९४०३९८५५७७', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nevasa_ranjangaon_punj', taluka: 'नेवासा', village: 'आऊवेचे रांजणगांव देवी', name: 'आऊवेचे रांजणगांव देवी (प.पू. श्रीसुखदेवमुनी पंजाबी)', nameEn: 'Ranjangaon Devi (Sukhdevmuni)', contact: 'प.पू. श्रीसुखदेवमुनी पंजाबी', phone: '+91 94222 34567', b: 1, t: 0, c: 0, tot: 1 },

  // ११. ता. शेवगाव
  { id: 'niwas_shevgaon_avhane_salkar', taluka: 'शेवगाव', village: 'आव्हाणे', name: 'आव्हाणे (प.पू. श्रीसारंगधर दादा साळकर)', nameEn: 'Avhane (Sarangdhar Dada Salkar)', contact: 'प.पू. श्रीसारंगधर दादा साळकर', phone: '८७८८३०८५९३', b: 1, t: 2, c: 4, tot: 7 },
  { id: 'niwas_shevgaon_ladjal_bidkar', taluka: 'शेवगाव', village: 'लाडजळगांव', name: 'लाडजळगांव (प.पू. श्रीपंडितराजदादा बिडकर)', nameEn: 'Ladjalgaon (Panditrajdada Bidkar)', contact: 'प.पू. श्रीपंडितराजदादा बिडकर', phone: '९४०५२७४४३०, ९४२३७५६९०३', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_shevgaon_chaklamba', taluka: 'शेवगाव', village: 'चकलांबा स्थान', name: 'चकलांबा स्थान (व्यवस्थापक)', nameEn: 'Chaklamba Sthan', contact: 'व्यवस्थापक', phone: '+91 94222 34567', b: 2, t: 1, c: 0, tot: 3 },

  // १२. ता. पाथर्डी
  { id: 'niwas_pathardi_miri_jamodekar', taluka: 'पाथर्डी', village: 'मिरी स्थान', name: 'मिरी स्थान (प.पू. श्रीधन:शामदादा जामोदेकर)', nameEn: 'Miri Sthan (Dhanashamdada Jamodekar)', contact: 'प.पू. श्रीधन:शामदादा जामोदेकर', phone: '९०७५१५१२५०, ९८७५२३२७५९', b: 1, t: 3, c: 1, tot: 5 },
  { id: 'niwas_pathardi_lohasar_satarkar', taluka: 'पाथर्डी', village: 'लोहसर खांडगांव', name: 'लोहसर खांडगांव (प.पू. श्रीमुकुंदराज दादा सातारकर)', nameEn: 'Lohasar Khandgaon (Mukundrajdada)', contact: 'प.पू. श्रीमुकुंदराज दादा सातारकर', phone: '९५५२९१७७०९, ८७६६८२३४७८', b: 1, t: 2, c: 2, tot: 5 },
  { id: 'niwas_pathardi_bhetichavad', taluka: 'पाथर्डी', village: 'भेटीचा वड', name: 'भेटीचा वड (व्यवस्थापक)', nameEn: 'Bheticha Vad', contact: 'व्यवस्थापक', phone: '+91 94222 34567', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_pathardi_yeli', taluka: 'पाथर्डी', village: 'येळी', name: 'येळी (व्यवस्थापक)', nameEn: 'Yeli Ashram', contact: 'व्यवस्थापक', phone: '+91 94222 34567', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_pathardi_kharvandi', taluka: 'पाथर्डी', village: 'खरवंडी कासार', name: 'खरवंडी कासार (व्यवस्थापक)', nameEn: 'Kharvandi Kasar', contact: 'व्यवस्थापक', phone: '+91 94222 34567', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_pathardi_shiral_prabhakar', taluka: 'पाथर्डी', village: 'शिराळचिचोंडी', name: 'शिराळचिचोंडी (प.पू. श्रीप्रभाकर दादा)', nameEn: 'Shiralchichondi (Prabhakar Dada)', contact: 'प.पू. श्रीप्रभाकर दादा', phone: '९४२२३४१४५६', b: 1, t: 2, c: 2, tot: 5 },

  // १३. ता. कर्जत
  { id: 'niwas_karjat_mhalangi_hingoli', taluka: 'कर्जत', village: 'म्हाळंगी', name: 'म्हाळंगी (प.पू. श्रीहिंगोलीकर बाबा)', nameEn: 'Mhalangi (Hingolikar Baba)', contact: 'प.पू. श्रीहिंगोलीकर बाबा', phone: '९८२२७११३५८, ९४०५२७६३२३', b: 2, t: 3, c: 0, tot: 5 },

  // १४. ता. जामखेड
  { id: 'niwas_jamkhed_city_lasurkar', taluka: 'जामखेड', village: 'आधी-जामखेड', name: 'आधी-जामखेड (प.पू. श्रीविजयराजदादा लासूरकर)', nameEn: 'Jamkhed (Vijayrajdada Lasurkar)', contact: 'प.पू. श्रीविजयराजदादा लासूरकर', phone: '९४०५२७५७९३', b: 2, t: 0, c: 0, tot: 2 },
  { id: 'niwas_jamkhed_khamgaon_dharur', taluka: 'जामखेड', village: 'खामगांव', name: 'खामगांव (प.पू.म. श्रीधारुरकरबाबा म.)', nameEn: 'Khamgaon (Dharurkarbaba)', contact: 'प.पू.म. श्रीधारुरकरबाबा म.', phone: '+91 94222 34567', b: 2, t: 4, c: 2, tot: 8 }
];

export const AHMEDNAGAR_NIWAS_ITEMS: NiwasItem[] = AHMEDNAGAR_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: `${item.village}, ता. ${item.taluka}`,
  state: 'महाराष्ट्र',
  district: 'अहिल्यानगर',
  taluka: item.taluka,
  village: item.village,
  facilities: {
    mr: ['पिण्याचे पाणी', 'भोजन व्यवस्था', 'विश्रांती गृह'],
    hi: ['पीने का पानी', 'भोजन व्यवस्था', 'विश्राम गृह'],
    en: ['Drinking Water', 'Food Facility', 'Rest House']
  },
  rooms: {
    mr: ['सामूहिक हॉल', 'वैयक्तिक खोली'],
    hi: ['सामूहिक हॉल', 'व्यक्तिगत कमरा'],
    en: ['Common Hall', 'Private Room']
  },
  contactPerson: item.contact,
  phone: item.phone,
  sevaCharge: {
    mr: 'ऐच्छिक / विनामूल्य',
    hi: 'ऐच्छिक / निःशुल्क',
    en: 'Voluntary / Free'
  },
  imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf592320752?auto=format&fit=crop&w=800&q=80',
  rating: 4.8,
  bhikshuk: item.b || 0,
  tapasvini: item.t || 0,
  children: item.c || 0,
  totalMembers: item.tot || 0
}));
