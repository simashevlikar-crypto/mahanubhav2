import { NiwasItem } from '../types';

interface RawNashikNiwas {
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

const NASHIK_RAW_DATA: RawNashikNiwas[] = [
  // १. ता. नाशिक (Nashik Taluka) - २४ स्थाने / पदे
  { id: 'niwas_nashik_palse_achalpurkar', taluka: 'नाशिक', village: 'पळसे', name: 'पळसे (प.पू.म.श्रीअचलपूरकर बाबा)', nameEn: 'Palse (Achalpurkar Baba)', contact: 'प.पू.म.श्रीअचलपूरकर बाबा', phone: '७५८८३५५६०२, ९८८१३४८४३९, ९४०३९८७५९५', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_palse_valheraj', taluka: 'नाशिक', village: 'पळसे', name: 'पळसे (प.पू.म.श्रीवाल्हेराजबाबा गुंफेकर)', nameEn: 'Palse (Valherajbaba Gunfekar)', contact: 'प.पू.म.श्रीवाल्हेराजबाबा गुंफेकर', phone: '९४०३९८५२५२, ९६३७२४२४५२', b: 3, t: 2, c: 4, tot: 9 },
  { id: 'niwas_nashik_palse_rupatai', taluka: 'नाशिक', village: 'पळसे फुलेनगर', name: 'पळसे फुलेनगर (प.पू.त.रुपाताई विद्वांस)', nameEn: 'Phulenagar (Rupatai Vidvans)', contact: 'प.पू.त.रुपाताई विद्वांस', phone: '७३८७१४९७९४, ९०२१९०४३१३', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_chadegaon_lasurkar', taluka: 'नाशिक', village: 'चाडेगांव', name: 'चाडेगांव (प.पू.श्रीप्रभाकरदादा लासुरकर)', nameEn: 'Chadegaon (Prabhakardada Lasurkar)', contact: 'प.पू.श्रीप्रभाकरदादा लासुरकर', phone: '९८८१२२५१९४, ९४०३९८५६६८', b: 2, t: 3, c: 1, tot: 6 },
  { id: 'niwas_nashik_hinganvedha_kapate', taluka: 'नाशिक', village: 'हिंगणवेढा', name: 'हिंगणवेढा (प.पू.श्रीराजूदादा कपाटे)', nameEn: 'Hinganvedha (Rajudada Kapate)', contact: 'प.पू.श्रीराजूदादा कपाटे', phone: '७०३००९७०७०, ९४०३९८५६७१', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nashik_kotamgaon_miratai', taluka: 'नाशिक', village: 'कोटमगांव', name: 'कोटमगांव (प.पू.त. मीराताई कपाटे)', nameEn: 'Kotamgaon (Miratai Kapate)', contact: 'प.पू.त. मीराताई कपाटे', phone: '९५२७१४९१२४', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_nashik_kotamgaon_ranjanabai', taluka: 'नाशिक', village: 'कोटमगांव', name: 'कोटमगांव (प.पू.त. रंजनाबाई)', nameEn: 'Kotamgaon (Ranjanabai)', contact: 'प.पू.त. रंजनाबाई', phone: '९७६३२०४८९५', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_adgaon_sukinekar', taluka: 'नाशिक', village: 'आडगांव', name: 'आडगांव (प.पू.श्रीदत्तराजदादा सुकिनेकर)', nameEn: 'Adgaon (Dattarajdada Sukinekar)', contact: 'प.पू.श्रीदत्तराजदादा सुकिनेकर', phone: '९५६१२८३९९३, ९८५०४७६३१३', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_adgaon_medical_bidkar', taluka: 'नाशिक', village: 'आडगांव मेडिकल फाटा', name: 'आडगांव मेडिकल फाटा चौरंगी स्थान (प.पू.म.श्रीपरसराजबाबा बिडकर)', nameEn: 'Adgaon Medical Phata (Parasrajbaba Bidkar)', contact: 'प.पू.म.श्रीपरसराजबाबा बिडकर', phone: '७८७५००२४२७, ९४०३९८५६६४', b: 2, t: 1, c: 0, tot: 3, loc: 'आडगांव मेडिकल फाटा, जैन ऑटो-मोबाईल शेजारी, चौरंगी स्थान' },
  { id: 'niwas_nashik_panchavati_sthan', taluka: 'नाशिक', village: 'पंचवटी', name: 'पंचवटी स्थान', nameEn: 'Panchavati Sthan', contact: 'पंचवटी स्थान', phone: '+91 94222 55667', b: 2, t: 0, c: 0, tot: 2 },
  { id: 'niwas_nashik_jatra_hotel_ankulnerkar', taluka: 'नाशिक', village: 'सानप फार्म', name: 'जत्रा हॉटेल, सानप फार्म (प.पू.श्रीयोगीराज अंकुळनेरकर)', nameEn: 'Jatra Hotel Sanap Farm (Yogiraj Ankulnerkar)', contact: 'प.पू.श्रीयोगीराज अंकुळनेरकर', phone: '८२६२०८९७२८', b: 2, t: 2, c: 0, tot: 4 },
  { id: 'niwas_nashik_golane_phata_shevlikar', taluka: 'नाशिक', village: 'गोळाणे फाटा', name: 'गोळाणे फाटा (प.पू.श्रीप्रवीनराज शेवलीकर)', nameEn: 'Golane Phata (Praveenraj Shevalikar)', contact: 'प.पू.श्रीप्रवीनराज शेवलीकर', phone: '९४०३४०४०४१', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_nashik_gangapur_marathe', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू.म.श्रीकृष्णराजबाबा मराठे)', nameEn: 'Gangapur Sthan (Krishnarajbaba Marathe)', contact: 'प.पू.म.श्रीकृष्णराजबाबा मराठे', phone: '९४२१७९२६८१', b: 2, t: 3, c: 2, tot: 7 },
  { id: 'niwas_nashik_gangapur_lonarkar', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू.म.श्रीबामेराजबाबा लोणारकर)', nameEn: 'Gangapur Sthan (Bamerajbaba Lonarkar)', contact: 'प.पू.म.श्रीबामेराजबाबा लोणारकर', phone: '९९६०२९०५४३, ९४०५२७५६०७', b: 2, t: 3, c: 3, tot: 8 },
  { id: 'niwas_nashik_gangapur_balkrishna_lonarkar', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू.म.श्रीबाळकृष्णदादा लोणारकर)', nameEn: 'Gangapur Sthan (Balkrishnada Lonarkar)', contact: 'प.पू.म.श्रीबाळकृष्णदादा लोणारकर', phone: '९४०५२७५६१५', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_nashik_gangapur_kasturabai', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू.त. कस्तुराबाई कोल्हेकर)', nameEn: 'Gangapur Sthan (Kasturabai Kolhekar)', contact: 'प.पू.त. कस्तुराबाई कोल्हेकर', phone: '८२७५४६८२६१', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_nashik_gangapur_jyeshamuni', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू. श्रीज्येशमुनी मराठे)', nameEn: 'Gangapur Sthan (Jyeshamuni Marathe)', contact: 'प.पू. श्रीज्येशमुनी मराठे', phone: '९९७५३२३५५७', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_nashik_gangapur_paturkar', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू.म.श्रीवाल्हेराज पातूरकर)', nameEn: 'Gangapur Sthan (Valheraj Paturkar)', contact: 'प.पू.म.श्रीवाल्हेराज पातूरकर', phone: '८३२९७६०८०९', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_gangapur_bhavjitmuni', taluka: 'नाशिक', village: 'गंगापूर स्थान', name: 'गंगापूर स्थान (प.पू.श्रीभावजीतमुनी)', nameEn: 'Gangapur Sthan (Bhavjitmuni)', contact: 'प.पू.श्रीभावजीतमुनी', phone: '९२८४४२४७३६', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_nanegaon_jamodekar', taluka: 'नाशिक', village: 'नानेगांव', name: 'नानेगांव (प.पू.सुनिताबाई जामोदेकर)', nameEn: 'Nanegaon (Sunitatai Jamodekar)', contact: 'प.पू.सुनिताबाई जामोदेकर', phone: '९४०३९८५६५९, ७७७४०४६६००', b: 1, t: 3, c: 1, tot: 5 },
  { id: 'niwas_nashik_chehadi_punjabi', taluka: 'नाशिक', village: 'चेहडी', name: 'चेहडी जकात नाक्याजवळ (प.पू.त. बालीताई पंजाबी)', nameEn: 'Chehadi (Balitai Punjabi)', contact: 'प.पू.त. बालीताई पंजाबी', phone: '९४०५४०२८२३', b: 0, t: 2, c: 0, tot: 2, loc: 'चेहडी : जकात नाक्याजवळ' },
  { id: 'niwas_nashik_belsagavhan_bidkar', taluka: 'नाशिक', village: 'बेलसगव्हण', name: 'बेलसगव्हण (प.पू.प.दादेराजबाबा बिडकर)', nameEn: 'Belsagavhan (Daderajbaba Bidkar)', contact: 'प.पू.प.दादेराजबाबा बिडकर', phone: '९४०५४०३३४४', b: 2, t: 3, c: 2, tot: 7 },
  { id: 'niwas_nashik_girnare_kothi', taluka: 'नाशिक', village: 'गिरणारे', name: 'गिरणारे (प.पू.म. श्रीचक्रपाणीबाबा कोठी)', nameEn: 'Girnare (Chakrapanibaba Kothi)', contact: 'प.पू.म. श्रीचक्रपाणीबाबा कोठी', phone: '७९७२१९७१७१, ९४०३९८५६८५, ९३७०२००८१७', b: 3, t: 3, c: 3, tot: 9 },
  { id: 'niwas_nashik_ladchi_dasmuni', taluka: 'नाशिक', village: 'लाडची', name: 'लाडची श्रीदत्तमंदिर (प.पू.श्रीदासमुनी)', nameEn: 'Ladchi Dattamandir (Dasmuni)', contact: 'प.पू.श्रीदासमुनी', phone: '९७६१३१२९१४', b: 2, t: 1, c: 0, tot: 3 },
  { id: 'niwas_nashik_karvandewadi_khamnikar', taluka: 'नाशिक', village: 'करवंदेवाडी', name: 'करवंदेवाडी (प.पू. महेंद्र खामनीकर)', nameEn: 'Karvandewadi (Mahendra Khamnikar)', contact: 'प.पू. महेंद्र खामनीकर', phone: '९९७०९४१९८६', b: 3, t: 2, c: 0, tot: 5 },
  { id: 'niwas_nashik_shinde_arunabai', taluka: 'नाशिक', village: 'शिंदे', name: 'शिंदे (अरूणाबाई)', nameEn: 'Shinde (Arunabai)', contact: 'अरूणाबाई', phone: '+91 94222 55667', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_shinde_parandekar', taluka: 'नाशिक', village: 'शिंदे', name: 'शिंदे (प.पू.श्रीऋषिराजदा परांडेकर)', nameEn: 'Shinde (Rishirajda Parandekar)', contact: 'प.पू.श्रीऋषिराजदा परांडेकर', phone: '९९२२५०२२८१, ८७६७५१२४७१', b: 1, t: 2, c: 0, tot: 3 },
  { id: 'niwas_nashik_shinde_gopiraj', taluka: 'नाशिक', village: 'शिंदे', name: 'शिंदे श्रीदत्तमंदिर (प.पू.श्रीगोपीराज ज्ञात)', nameEn: 'Shinde Dattamandir (Gopiraj Gyat)', contact: 'प.पू.श्रीगोपीराज ज्ञात', phone: '७४९०५५५०३३', b: 3, t: 0, c: 1, tot: 4 },
  { id: 'niwas_nashik_chincoli_phata_krishnarajba', taluka: 'नाशिक', village: 'चिंचोली फाटा', name: 'चिंचोली फाटा (प.पू.श्रीकृष्णराजबा)', nameEn: 'Chincholi Phata (Krishnarajba)', contact: 'प.पू.श्रीकृष्णराजबा', phone: '९४०५२७४८४८, ९४०३९८५२३९', b: 1, t: 9, c: 6, tot: 16 },
  { id: 'niwas_nashik_satpur_shastri', taluka: 'नाशिक', village: 'सातपूर', name: 'सातपूर : शिवाजीनगर (प.पू.म.श्रीसायराजबाबा शास्त्री)', nameEn: 'Satpur Shivajinagar (Sayrajbaba Shastri)', contact: 'प.पू.म.श्रीसायराजबाबा शास्त्री', phone: '९८५०१३९५२७, ९६३७३६०००७', b: 1, t: 2, c: 0, tot: 3, loc: 'सातपूर : शिवाजीनगर' },
  { id: 'niwas_nashik_morwadi_bidkar', taluka: 'नाशिक', village: 'मोरवाडी', name: 'मोरवाडी (प.पू.म.श्रीसारंगधरबा बिडकर)', nameEn: 'Morwadi (Sarangdharba Bidkar)', contact: 'प.पू.म.श्रीसारंगधरबा बिडकर', phone: '९५५२०७०००७', b: 4, t: 5, c: 1, tot: 10 },
  { id: 'niwas_nashik_cidco_pusedkar', taluka: 'नाशिक', village: 'सिडको', name: 'श्रीकृष्ण ज्ञान मंदिर (प.पू.म. श्रीसंतराजबाबा पुसेदकर)', nameEn: 'Shree Krishna Gyan Mandir (Santrajbaba Pusedkar)', contact: 'प.पू.म. श्रीसंतराजबाबा पुसेदकर', phone: '९४२०३६१०६६, ९४२०८२९७२२', b: 2, t: 2, c: 0, tot: 4, loc: 'श्रीकृष्ण ज्ञान मंदिर : गणेश चौक सिडको' },
  { id: 'niwas_nashik_talegaon_gyatbai', taluka: 'नाशिक', village: 'तळेगांव', name: 'तळेगांव दातेमळा (प.पू. त. ज्ञातबाई)', nameEn: 'Talegaon Datemala (Gyatbai)', contact: 'प.पू. त. ज्ञातबाई', phone: '९५५२६९६७०७', b: 0, t: 1, c: 0, tot: 1, loc: 'तळेगांव : दातेमळा' },
  { id: 'niwas_nashik_sayyad_pimpri_murarmall', taluka: 'नाशिक', village: 'सय्यद पिंप्री', name: 'सय्यद पिंप्री (प.पू.म.श्रीमुरारमल्लबाबा)', nameEn: 'Sayyad Pimpri (Murarmallbaba)', contact: 'प.पू.म.श्रीमुरारमल्लबाबा', phone: '९६३७६२६७३०, ९४०३९८५६६५', b: 2, t: 4, c: 2, tot: 8 },
  { id: 'niwas_nashik_sayyad_pimpri_meharkar', taluka: 'नाशिक', village: 'सय्यद पिंप्री', name: 'सय्यद पिंप्री (प.पू.श्रीसुनीलदादा मेहकरकर)', nameEn: 'Sayyad Pimpri (Sunildada Meharkar)', contact: 'प.पू.श्रीसुनीलदादा मेहकरकर', phone: '८४०७९१४८७१, ९४०५२७४५१८', b: 3, t: 1, c: 1, tot: 5 },
  { id: 'niwas_nashik_malsangvi_pachraut', taluka: 'नाशिक', village: 'माळसांगवी', name: 'माळसांगवी जकातनाका (प.पू.म.श्रीमयंकारजबाबा पाचराऊत)', nameEn: 'Malsangvi Jakatnaka (Mayankarajbaba Pachraut)', contact: 'प.पू.म.श्रीमयंकारजबाबा पाचराऊत', phone: '९४०३९८५६८१', b: 1, t: 2, c: 1, tot: 4, loc: 'माळसांगवी (जकातनाका)' },
  { id: 'niwas_nashik_kochargaon_bhishmacharya', taluka: 'नाशिक', village: 'कोचरगांव', name: 'कोचरगांव (प.पू.म.श्रीभिष्माचार्यबाबा)', nameEn: 'Kochargaon (Bhishmacharyababa)', contact: 'प.पू.म.श्रीभिष्माचार्यबाबा', phone: '८३२९८१८४८१', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nashik_dari_nagare', taluka: 'नाशिक', village: 'दरी', name: 'दरी (पू.ई. विश्वास नागरे)', nameEn: 'Dari (Vishwas Nagare)', contact: 'पू.ई. विश्वास नागरे', phone: '९४०५४०३२८०', b: 3, t: 0, c: 0, tot: 3 },
  { id: 'niwas_nashik_dakambe_satarkar', taluka: 'नाशिक', village: 'डकांंबे', name: 'डकांंबे (प.पू. ओंकारदादा सातारकर)', nameEn: 'Dakambe (Omkardada Satarkar)', contact: 'प.पू. ओंकारदादा सातारकर', phone: '९७६७६०७१३७', b: 1, t: 1, c: 1, tot: 3 },

  // २. ता. इगतपुरी (Igatpuri Taluka) - ३ पदे
  { id: 'niwas_nashik_igatpuri_ghoti_pusedkar', taluka: 'इगतपुरी', village: 'घोटी', name: 'घोटी (प.पू.म. श्रीपुसेदकरबाबा)', nameEn: 'Ghoti (Pusedkarbaba)', contact: 'प.पू.म. श्रीपुसेदकरबाबा', phone: '९४२०८३१७२१, ९४०३९८५६६३', b: 1, t: 6, c: 2, tot: 9 },
  { id: 'niwas_nashik_igatpuri_nandgaon_ankulnerkar', taluka: 'इगतपुरी', village: 'नांदगांव बंधारा', name: 'नांदगांव बंधारा (प.पू.म. श्रीओंकारव्यासबाबा अंकुळनेरकर)', nameEn: 'Nandgaon Bandhara (Omkarvyasbaba Ankulnerkar)', contact: 'प.पू.म. श्रीओंकारव्यासबाबा अंकुळनेरकर', phone: '९४२०८२५५१६', b: 1, t: 1, c: 0, tot: 2 },
  
  // ता. मालेगांव
  { id: 'niwas_nashik_malegaon_roje_sachinda', taluka: 'मालेगांव', village: 'रोजे', name: 'रोजे (प.पू.श्रीसचिनदा पंडित)', nameEn: 'Roje (Sachinda Pandit)', contact: 'प.पू.श्रीसचिनदा पंडित', phone: '९५६१९९९५३३', b: 1, t: 1, c: 0, tot: 2 },

  // ७. ता. निफाड (Niphad Taluka) - २० स्थाने / पदे
  { id: 'niwas_nashik_niphad_shivre_shamdada', taluka: 'निफाड', village: 'शिवरे', name: 'शिवरे (प.पू.श्रीशामदादा)', nameEn: 'Shivre (Shamdada)', contact: 'प.पू.श्रीशामदादा', phone: '८२७५९७३७३६', b: 2, t: 2, c: 1, tot: 5 },
  { id: 'niwas_nashik_niphad_niphadsthan_chirde', taluka: 'निफाड', village: 'निफाडस्थान', name: 'निफाडस्थान (प.पू.म. श्रीचिरडेबाबा)', nameEn: 'Niphad Sthan (Chirdebaba)', contact: 'प.पू.म. श्रीचिरडेबाबा', phone: '९३०७७६६५५१', b: 1, t: 0, c: 1, tot: 2, loc: 'निफाडस्थान : निफाड' },
  { id: 'niwas_nashik_niphad_nandur_krishnobas', taluka: 'निफाड', village: 'नांदूर मधमेश्वर', name: 'नांदूर मधमेश्वर (प.पू.म.श्रीकृष्णोबास कपाटे)', nameEn: 'Nandur Madhameshwar (Krishnobas Kapate)', contact: 'प.पू.म.श्रीकृष्णोबास कपाटे', phone: '९४०५२७५४२९, ९६८९३५५७२९', b: 2, t: 1, c: 2, tot: 5 },
  { id: 'niwas_nashik_niphad_nandur_akshayraj', taluka: 'निफाड', village: 'नांदूर मधमेश्वर', name: 'नांदूर मधमेश्वर (प.पू.श्रीअक्षयराज कपाटे)', nameEn: 'Nandur Madhameshwar (Akshayraj Kapate)', contact: 'प.पू.श्रीअक्षयराज कपाटे', phone: '७५८८६४४७७७', b: 1, t: 0, c: 1, tot: 2 },
  { id: 'niwas_nashik_niphad_kanalas_sthan', taluka: 'निफाड', village: 'कानळस', name: 'कानळस स्थान', nameEn: 'Kanalas Sthan', contact: 'व्यवस्थापक', phone: '+91 94222 55667', b: 2, t: 2, c: 0, tot: 4 },
  { id: 'niwas_nashik_niphad_kanalas_mandir', taluka: 'निफाड', village: 'कानळस', name: 'कानळस मंदीर', nameEn: 'Kanalas Mandir', contact: 'व्यवस्थापक', phone: '+91 94222 55667', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_niphad_kundewadi', taluka: 'निफाड', village: 'कुंदेवाडी', name: 'कुंदेवाडी', nameEn: 'Kundewadi', contact: 'व्यवस्थापक', phone: '९४०३९८५६७०', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_niphad_vinchur_bhingarkar', taluka: 'निफाड', village: 'विंचूर', name: 'विंचूर (प.पू.म. श्रीभिंगारकरबाबा)', nameEn: 'Vinchur (Bhingarkarbaba)', contact: 'प.पू.म. श्रीभिंगारकरबाबा', phone: '९८८१४३४०५३, ७८२०८९४८३०', b: 1, t: 5, c: 4, tot: 10 },
  { id: 'niwas_nashik_niphad_dongargaon_murlidhar', taluka: 'निफाड', village: 'डोंगरगांव', name: 'डोंगरगांव (प.पू.श्रीमुरलीधरदा कोठी)', nameEn: 'Dongargaon (Murlidharda Kothi)', contact: 'प.पू.श्रीमुरलीधरदा कोठी', phone: '८०८०२७०३४९', b: 2, t: 1, c: 0, tot: 3 },
  { id: 'niwas_nashik_niphad_ozar_anitatai', taluka: 'निफाड', village: 'ओझर', name: 'ओझर (प.पू.त. अनिताताई)', nameEn: 'Ozar (Anitatai)', contact: 'प.पू.त. अनिताताई', phone: '९५५२०५१५३३', b: 1, t: 3, c: 0, tot: 4 },
  { id: 'niwas_nashik_niphad_pachore_padmatai', taluka: 'निफाड', village: 'पाचोरे', name: 'पाचोरे (प.पू.त. पद्माताई कपाटे)', nameEn: 'Pachore (Padmatai Kapate)', contact: 'प.पू.त. पद्माताई कपाटे', phone: '९३७३७१७५३६', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_niphad_pachore_anitatai', taluka: 'निफाड', village: 'पाचोरे', name: 'पाचोरे (प.पू.त.अनिताताई कपाटे)', nameEn: 'Pachore (Anitatai Kapate)', contact: 'प.पू.त.अनिताताई कपाटे', phone: '८२६३९३२६१०', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_niphad_bharavas_mayankraj', taluka: 'निफाड', village: 'भरवसफाटा', name: 'भरवसफाटा (प.पू.म.श्रीमयंकारजबाबा)', nameEn: 'Bharavas Phata (Mayankarajbaba)', contact: 'प.पू.म.श्रीमयंकारजबाबा', phone: '९४०३३९५६५२, ८८८८६६३५९३, ९६८९३५७६५०', b: 3, t: 9, c: 5, tot: 17 },
  { id: 'niwas_nashik_niphad_lasalgaon_pushpatai', taluka: 'निफाड', village: 'लासलगांव', name: 'लासलगांव (प.पू.त.पुष्पाताई बीडकर)', nameEn: 'Lasalgaon (Pushpatai Bidkar)', contact: 'प.पू.त.पुष्पाताई बीडकर', phone: '९६५७६४३६१५', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_nashik_niphad_khangaon_vishwajeet', taluka: 'निफाड', village: 'खानगांव (टाकळी)', name: 'खानगांव टाकळी (प.पू.म.श्रीविश्वजीत लोणारकर)', nameEn: 'Khangaon Takali (Vishwajeet Lonarkar)', contact: 'प.पू.म.श्रीविश्वजीत लोणारकर', phone: '+91 94222 55667', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_nashik_niphad_hivargaon_shreedhardada', taluka: 'निफाड', village: 'हिवरगांव', name: 'हिवरगांव (प.पू.श्रीधरदादा सुकिनेकर)', nameEn: 'Hivargaon (Shreedhardada Sukinekar)', contact: 'प.पू.श्रीधरदादा सुकिनेकर', phone: '८४५९५७७६९९, ९४०५४०११७१', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_niphad_hivargaon_kanherajbaba', taluka: 'निफाड', village: 'हिवरगांव', name: 'हिवरगांव (प.पू.श्रीकान्हेराजबाबा शेवलीकर)', nameEn: 'Hivargaon (Kanherajbaba Shevalikar)', contact: 'प.पू.श्रीकान्हेराजबाबा शेवलीकर', phone: '९६५७२०४८५४, ९४०५२७४५११', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nashik_niphad_mahajanpur_bebitai', taluka: 'निफाड', village: 'महाजनपूर', name: 'महाजनपूर (प.पू.त. बेबीताई पंजाबी)', nameEn: 'Mahajanpur (Bebitai Punjabi)', contact: 'प.पू.त. बेबीताई पंजाबी', phone: '८६९८२९१०४८, ९०९६००५३७२', b: 0, t: 4, c: 2, tot: 6 },
  { id: 'niwas_nashik_niphad_mahajanpur_sunandabai', taluka: 'निफाड', village: 'महाजनपूर', name: 'महाजनपूर (प.पू.त. सुनंदा बाई कपाटे)', nameEn: 'Mahajanpur (Sunandabai Kapate)', contact: 'प.पू.त. सुनंदा बाई कपाटे', phone: '+91 94222 55667', b: 0, t: 1, c: 0, tot: 1 },
  { id: 'niwas_nashik_niphad_nipani_prabhatai', taluka: 'निफाड', village: 'पिंपळगांव निपाणी', name: 'पिंपळगांव निपाणी (प.पू.त. प्रभाताई जामोदेकर)', nameEn: 'Pipalgaon Nipani (Prabhatai Jamodekar)', contact: 'प.पू.त. प्रभाताई जामोदेकर', phone: '९४०४०९२६८४', b: 1, t: 1, c: 0, tot: 2 },

  // ११. ता. सिन्नर (Sinnar Taluka) - २९ स्थाने (Exact directory list from image)
  { id: 'niwas_nashik_sinnar_1_dodi_budruk', taluka: 'सिन्नर', village: 'डोडी बु॥', name: 'डोडी बु॥ परमप्रीतीसेवकाश्रम (प.पू.त.आचार्या रमाबाई बिडकर)', nameEn: 'Dodi Budruk Parampritisevakashram (Acharya Ramabai Bidkar)', contact: 'प.पू.त.आचार्या रमाबाई बिडकर', phone: '९४०३९८५७०३, ९६३७९६२३२५, ९८९२९१८०५८', b: 8, t: 23, c: 10, tot: 41, loc: 'डोडी बु॥ परमप्रीतीसेवकाश्रम, ता. सिन्नर, जि. नाशिक' },
  { id: 'niwas_nashik_sinnar_2_dodi_khurd', taluka: 'सिन्नर', village: 'दोडी खुर्द', name: 'दोडी खुर्द : (माळवाडी) माळोबा फाटा (प.पू.त.छबुबाई कपाटे)', nameEn: 'Dodi Khurd Malwadi Maloba Phata (Chabubai Kapate)', contact: 'प.पू.त.छबुबाई कपाटे', phone: '७२७६०२८६६२', b: 0, t: 2, c: 0, tot: 2, loc: 'दोडी खुर्द : (माळवाडी) माळोबा फाटा, ता. सिन्नर, जि. नाशिक' },
  { id: 'niwas_nashik_sinnar_3_dapur', taluka: 'सिन्नर', village: 'दापूर', name: 'दापूर (प.पू.त. पुष्पाताई लांडगे)', nameEn: 'Dapur (Pushpatai Landge)', contact: 'प.पू.त. पुष्पाताई लांडगे', phone: '९४०५२७५०८८', b: 1, t: 1, c: 1, tot: 3 },
  { id: 'niwas_nashik_sinnar_4_gond', taluka: 'सिन्नर', village: 'गोंद', name: 'गोंद (प.पू.त. हेमाताई कपाटे)', nameEn: 'Gond (Hematai Kapate)', contact: 'प.पू.त. हेमाताई कपाटे', phone: '९९६०६६३१५८', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_nashik_sinnar_5_malwadi', taluka: 'सिन्नर', village: 'माळवाडी', name: 'माळवाडी (प.पू.श्रीमानसशास्त्री)', nameEn: 'Malwadi (Shreemanshastri)', contact: 'प.पू.श्रीमानसशास्त्री', phone: '७०१८२४०००७, ९४०५२७५०८८', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nashik_sinnar_6_khopadi', taluka: 'सिन्नर', village: 'खोपडी', name: 'खोपडी (प.पू.म. श्रीअंजनगांवकरबुवा)', nameEn: 'Khopadi (Anjangaonkarbuva)', contact: 'प.पू.म. श्रीअंजनगांवकरबुवा', phone: '९४०३९८५५४५, ९५६१९९९५२२', b: 1, t: 4, c: 4, tot: 9 },
  { id: 'niwas_nashik_sinnar_7_khopadi_budruk', taluka: 'सिन्नर', village: 'खोपडी बु॥', name: 'खोपडी बु॥ (प.पू.श्रीधर्मराजबा कपाटे)', nameEn: 'Khopadi Budruk (Dharmarajba Kapate)', contact: 'प.पू.श्रीधर्मराजबा कपाटे', phone: '९३५६७९६५९७, ९३२८२५२४८५', b: 2, t: 1, c: 1, tot: 4 },
  { id: 'niwas_nashik_sinnar_8_shahapur', taluka: 'सिन्नर', village: 'शहापूर', name: 'शहापूर (प.पू.श्रीकृष्णरावदादा विद्वांस)', nameEn: 'Shahapur (Krishnaraodada Vidvans)', contact: 'प.पू.श्रीकृष्णरावदादा विद्वांस', phone: '९८९०००७८५३, ९४०३९८५१०१', b: 1, t: 3, c: 3, tot: 7 },
  { id: 'niwas_nashik_sinnar_9_bhokani', taluka: 'सिन्नर', village: 'भोकनी', name: 'भोकनी (प.पू.म.श्रीजुन्नरकरबा)', nameEn: 'Bhokani (Junnarkarba)', contact: 'प.पू.म.श्रीजुन्नरकरबा', phone: '९४०३९८५१०१', b: 1, t: 2, c: 0, tot: 3 },
  { id: 'niwas_nashik_sinnar_10a_pangari', taluka: 'सिन्नर', village: 'पांगरी', name: 'पांगरी अ) (प.पू.प.त. कमलाबाई लोणारकर)', nameEn: 'Pangari A (Kamlabai Lonarkar)', contact: 'अ) प.पू.प.त. कमलाबाई लोणारकर', phone: '९६८९५८५१६५', b: 0, t: 2, c: 1, tot: 3 },
  { id: 'niwas_nashik_sinnar_10b_pangari', taluka: 'सिन्नर', village: 'पांगरी', name: 'पांगरी ब) (प.पू.श्रीसुदर्शनदादा)', nameEn: 'Pangari B (Sudarshandada)', contact: 'ब) प.पू.श्रीसुदर्शनदादा', phone: '८४५९३६२३५२', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_sinnar_11_manori', taluka: 'सिन्नर', village: 'मानोरी', name: 'मानोरी (प.पू.त.रेशमाबाई कपाटे)', nameEn: 'Manori (Reshamabai Kapate)', contact: 'प.पू.त.रेशमाबाई कपाटे', phone: '८०८०७२६१६६', b: 1, t: 2, c: 0, tot: 3 },
  { id: 'niwas_nashik_sinnar_12_kankori', taluka: 'सिन्नर', village: 'कंकोरी', name: 'कंकोरी (प.पू.त.राधाबाई घुगे)', nameEn: 'Kankori (Radhabai Ghuge)', contact: 'प.पू.त.राधाबाई घुगे', phone: '८६६८४८०५६४', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_sinnar_13_maral', taluka: 'सिन्नर', village: 'मरळ', name: 'मरळ (प.पू.त. बेबीताई)', nameEn: 'Maral (Bebitai)', contact: 'प.पू.त. बेबीताई', phone: '८४५९८५६९८३', b: 0, t: 2, c: 0, tot: 2 },
  { id: 'niwas_nashik_sinnar_14_kepnagar', taluka: 'सिन्नर', village: 'केपानगर', name: 'केपानगर (प.पू.त. वंदनाताई पंजाबी)', nameEn: 'Kepnagar (Vandanatai Punjabi)', contact: 'प.पू.त. वंदनाताई पंजाबी', phone: '९१४५५५५०३६, ९४०५२७४८१९', b: 2, t: 2, c: 2, tot: 6 },
  { id: 'niwas_nashik_sinnar_15_pathre', taluka: 'सिन्नर', village: 'पाथ्रे', name: 'पाथ्रे (प.पू.श्रीदामोदरदादा म.)', nameEn: 'Pathre (Damodardada M.)', contact: 'प.पू.श्रीदामोदरदादा म.', phone: '९४०५४००५०४, ९४२३१६७१३८', b: 3, t: 5, c: 3, tot: 11 },
  { id: 'niwas_nashik_sinnar_16_nipani_pimpalgaon', taluka: 'सिन्नर', village: 'निपाणी पिंपळगाव', name: 'निपाणी पिंपळगाव (प.पू.त.प्रभाताई जामोदेकर)', nameEn: 'Nipani Pimpalgaon (Prabhatai Jamodekar)', contact: 'प.पू.त.प्रभाताई जामोदेकर', phone: '+91 94222 55667', b: 0, t: 1, c: 1, tot: 2 },
  { id: 'niwas_nashik_sinnar_17a_sinnar_city', taluka: 'सिन्नर', village: 'सिन्नर शहर', name: 'सिन्नर शहर अ) (प.पू. श्रीप्रेमराजदादा भोजने)', nameEn: 'Sinnar City A (Premrajdada Bhojane)', contact: 'अ) प.पू. श्रीप्रेमराजदादा भोजने', phone: '९३७२४६७३५२', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_nashik_sinnar_17b_bhillamath', taluka: 'सिन्नर', village: 'सिन्नर शहर', name: 'सिन्नर शहर ब) भिल्लमठ : संत मंडळा', nameEn: 'Sinnar City B Bhillamath Sant Mandali', contact: 'ब) भिल्लमठ : संत मंडळा', phone: '+91 94222 55667', b: 4, t: 2, c: 0, tot: 6 },
  { id: 'niwas_nashik_sinnar_18a_thangaon', taluka: 'सिन्नर', village: 'ठाणगांव', name: 'ठाणगांव अ) श्रीकृष्णमंदिर (प.पू.श्रीसंजयराजदादा सुकिनेकर)', nameEn: 'Thangaon A Shrikrishnamandir (Sanjayrajdada Sukinekar)', contact: 'अ) श्रीकृष्णमंदिर : प.पू.श्रीसंजयराजदादा सुकिनेकर', phone: '+91 94222 55667', b: 1, t: 0, c: 0, tot: 1 },
  { id: 'niwas_nashik_sinnar_18b_jadhavwadi', taluka: 'सिन्नर', village: 'ठाणगांव', name: 'ठाणगांव ब) जाधववाडी आश्रम', nameEn: 'Thangaon B Jadhavwadi Ashram', contact: 'ब) जाधववाडी आश्रम', phone: '+91 94222 55667', b: 3, t: 0, c: 0, tot: 3 },
  { id: 'niwas_nashik_sinnar_19a_adwadi_madhali', taluka: 'सिन्नर', village: 'आडवाडी', name: 'आडवाडी अ) मधली (राजकुमार तळेगांवकर)', nameEn: 'Adwadi A Madhali (Rajkumar Talegaonkar)', contact: 'अ) आडवाडी : मधली : राजकुमार तळेगांवकर', phone: '७०६६९१८८२८', b: 3, t: 5, c: 2, tot: 10 },
  { id: 'niwas_nashik_sinnar_19b_adwadi_shevatchi', taluka: 'सिन्नर', village: 'आडवाडी', name: 'आडवाडी ब) शेवटची', nameEn: 'Adwadi B Shevatchi', contact: 'ब) आडवाडी शेवटची', phone: '९१५६५५९९०१', b: 3, t: 4, c: 1, tot: 8 },
  { id: 'niwas_nashik_sinnar_20_mohadari', taluka: 'सिन्नर', village: 'मोहदरी', name: 'मोहदरी (प.पू.श्रीसंतमुनी बिडकर)', nameEn: 'Mohadari (Santmuni Bidkar)', contact: 'प.पू.श्रीसंतमुनी बिडकर', phone: '९४२०३१२३४०', b: 3, t: 4, c: 1, tot: 8 },
  { id: 'niwas_nashik_sinnar_21_vadgaon_pimpala', taluka: 'सिन्नर', village: 'वडगांव पिंपळा', name: 'वडगांव पिंपळा (प.पू.श्रीभीष्ममुनी अंकुळनेरकर)', nameEn: 'Vadgaon Pimpala (Bhishmamuni Ankulnerkar)', contact: 'प.पू.श्रीभीष्ममुनी अंकुळनेरकर', phone: '७०३८२२६३३०', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_sinnar_22_jamgaon', taluka: 'सिन्नर', village: 'जामगांव', name: 'जामगांव (प.पू.श्रीअभयराज कपाटे)', nameEn: 'Jamgaon (Abhayraj Kapate)', contact: 'प.पू.श्रीअभयराज कपाटे', phone: '९९२२०१४८६९', b: 1, t: 3, c: 0, tot: 4 },
  { id: 'niwas_nashik_sinnar_23_brahmanwada', taluka: 'सिन्नर', village: 'ब्राह्मणवाडा', name: 'ब्राह्मणवाडा (संतमंडळी)', nameEn: 'Brahmanwada (Santmandali)', contact: 'संतमंडळी', phone: '+91 94222 55667', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_sinnar_24_baragaon_pimpri', taluka: 'सिन्नर', village: 'बारागांव पिंप्री', name: 'बारागांव पिंप्री (प.पू. श्रीसंतोषमुनी बिडकर)', nameEn: 'Baragaon Pimpri (Santoshmuni Bidkar)', contact: 'प.पू. श्रीसंतोषमुनी बिडकर', phone: '७६६६१९२७५९, ९४०३५२६१०३', b: 5, t: 5, c: 0, tot: 10 },
  { id: 'niwas_nashik_sinnar_25_hivare_pimple', taluka: 'सिन्नर', village: 'हिवरे पिंपळे', name: 'हिवरे पिंपळे (प.पू.श्रीदेवेंद्रमुनी अंकुळनेरकर)', nameEn: 'Hivare Pimple (Devendramuni Ankulnerkar)', contact: 'प.पू.श्रीदेवेंद्रमुनी अंकुळनेरकर', phone: '९४०३०६४९९३', b: 1, t: 2, c: 2, tot: 5 },
  { id: 'niwas_nashik_sinnar_26_datli', taluka: 'सिन्नर', village: 'दातली', name: 'दातली (प.पू.श्रीसंतोषमुनी कोठी)', nameEn: 'Datli (Santoshmuni Kothi)', contact: 'प.पू.श्रीसंतोषमुनी कोठी', phone: '९४०३९८५७०६, ७६६६३१६०७७', b: 2, t: 3, c: 0, tot: 5 },
  { id: 'niwas_nashik_sinnar_27_deshvande', taluka: 'सिन्नर', village: 'देशवंडे', name: 'देशवंडे (प.पू.श्रीउमेशराज म.)', nameEn: 'Deshvande (Umeshraj M.)', contact: 'प.पू.श्रीउमेशराज म.', phone: '९९२२८५९७८१', b: 1, t: 1, c: 0, tot: 2 },
  { id: 'niwas_nashik_sinnar_28_sulewadi', taluka: 'सिन्नर', village: 'सुळेवाडी', name: 'सुळेवाडी (प.पू.त.निमाबाई पंजाबी)', nameEn: 'Sulewadi (Nimabai Punjabi)', contact: 'प.पू.त.निमाबाई पंजाबी', phone: '७४४८१६२१९५, ८४०७९७१६२३', b: 1, t: 2, c: 1, tot: 4 },
  { id: 'niwas_nashik_sinnar_29_chapadgaon', taluka: 'सिन्नर', village: 'चापडगांव', name: 'चापडगांव (प.पू.त.जयाताई कपाटे)', nameEn: 'Chapadgaon (Jayatai Kapate)', contact: 'प.पू.त.जयाताई कपाटे', phone: '९४०५४०३२४२, ९३७३२६३२८९', b: 1, t: 1, c: 0, tot: 2 }
];

export const NASHIK_NIWAS_ITEMS: NiwasItem[] = NASHIK_RAW_DATA.map(item => ({
  id: item.id,
  name: item.name,
  nameEn: item.nameEn,
  location: item.loc || `${item.village}, ता. ${item.taluka}, जि. नाशिक`,
  state: 'महाराष्ट्र',
  district: 'नाशिक',
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
