import { Book, Chapter } from '../types';

export interface GalfaMeasurement {
  id: string;
  village: string;
  villageEn: string;
  sthan: string;
  sthanEn: string;
  length: string;
  width: string;
  height: string;
  note?: string;
  district?: string;
}

export const galfaMeasurementsList: GalfaMeasurement[] = [
  // १. जाळीचादेव
  { id: 'gm_1', village: 'जाळीचादेव', villageEn: 'Jalichadev', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '६०', width: '२४', height: '२०', district: 'बुलढाणा' },

  // २. पांचाळेश्वर
  { id: 'gm_2', village: 'पांचाळेश्वर', villageEn: 'Panchaleshwar', sthan: 'आत्मतिर्थ', sthanEn: 'Atmatirtha', length: '१०९', width: '५६', height: '१८', district: 'छ. संभाजीनगर' },
  { id: 'gm_3', village: 'पांचाळेश्वर', villageEn: 'Panchaleshwar', sthan: 'गुंफा', sthanEn: 'Gumphe Sthan', length: '५५', width: '३०', height: '१८', district: 'छ. संभाजीनगर' },
  { id: 'gm_4', village: 'पांचाळेश्वर', villageEn: 'Panchaleshwar', sthan: 'अवस्थान', sthanEn: 'Avasthan', length: '६१', width: '३७', height: '२०', district: 'छ. संभाजीनगर' },

  // ३. बेलापूर
  { id: 'gm_5', village: 'बेलापूर', villageEn: 'Belapur', sthan: 'मुख्य', sthanEn: 'Mukhya', length: '७२', width: '३७.५०', height: '२२', district: 'अहिल्यानगर' },
  { id: 'gm_6', village: 'बेलापूर', villageEn: 'Belapur', sthan: 'वज्री घडवणे', sthanEn: 'Vajri Ghadavane', length: '३७', width: '२७.५०', height: '१८', district: 'अहिल्यानगर' },

  // ४. डोमेग्राम
  { id: 'gm_7', village: 'डोमेग्राम', villageEn: 'Domegram', sthan: 'राजमठ', sthanEn: 'Rajmath', length: '८८', width: '४४', height: '२२', district: 'अहिल्यानगर' },
  { id: 'gm_8', village: 'डोमेग्राम', villageEn: 'Domegram', sthan: 'उंचमठ', sthanEn: 'Unchmath', length: '५१', width: '३१', height: '१८', district: 'अहिल्यानगर' },
  { id: 'gm_9', village: 'डोमेग्राम', villageEn: 'Domegram', sthan: 'प्रसन्नमठ', sthanEn: 'Prasannmath', length: '६६', width: '३४', height: '१८', district: 'अहिल्यानगर' },

  // ५. फलटण
  { id: 'gm_10', village: 'फलटण', villageEn: 'Phaltan', sthan: 'आबासाहेब', sthanEn: 'Abasaheb Sthan', length: '६२', width: '३०', height: '१८', district: 'सातारा' },
  { id: 'gm_11', village: 'फलटण', villageEn: 'Phaltan', sthan: 'सभामंडपातले', sthanEn: 'Sabhamandapatle', length: '५०', width: '५०', height: '१२', note: 'सभामंडपाबाहेरील अष्टकोनी १९ इंचाचा एक कोन', district: 'सातारा' },
  { id: 'gm_12', village: 'फलटण', villageEn: 'Phaltan', sthan: 'बाबासाहेब', sthanEn: 'Babasaheb Sthan', length: '६०', width: '३७', height: '१८', note: 'खांबाचा मध्य १४ इंचावर', district: 'सातारा' },
  { id: 'gm_13', village: 'फलटण', villageEn: 'Phaltan', sthan: 'बाबासाहेब गाभारा ओटा', sthanEn: 'Babasaheb Gabhara Ota', length: '५२', width: '३१', height: '२२', district: 'सातारा' },
  { id: 'gm_14', village: 'फलटण', villageEn: 'Phaltan', sthan: 'जन्मस्थान', sthanEn: 'Janmasthan', length: '६४', width: '३१', height: '१८', note: 'दोन खांब १२ इंचावर', district: 'सातारा' },
  { id: 'gm_15', village: 'फलटण (मळा)', villageEn: 'Phaltan (Mala)', sthan: 'रंगशिळा (मळा)', sthanEn: 'Rangashila (Mala)', length: '५०', width: '३५', height: '१३', district: 'सातारा' },
  { id: 'gm_16', village: 'फलटण', villageEn: 'Phaltan', sthan: 'रंगशिळा (पेठेतील)', sthanEn: 'Rangashila (Pethetil)', length: '६३', width: '४६', height: '१८', district: 'सातारा' },

  // ६. मलठण
  { id: 'gm_17', village: 'मलठण', villageEn: 'Malthan', sthan: 'मुख्य', sthanEn: 'Mukhya', length: '११५', width: '११५', height: '५ झालर', district: 'पुणे' },
  { id: 'gm_18', village: 'मलठण', villageEn: 'Malthan', sthan: 'बाहेरील ओटा', sthanEn: 'Baheril Ota', length: '४८', width: '३२', height: '११', district: 'पुणे' },

  // ७. रिध्दपूर
  { id: 'gm_19', village: 'रिध्दपूर', villageEn: 'Riddhapur', sthan: 'राजमठ', sthanEn: 'Rajmath', length: '४९', width: '१९', height: '९', district: 'अमरावती' },
  { id: 'gm_20', village: 'रिध्दपूर', villageEn: 'Riddhapur', sthan: 'आवार', sthanEn: 'Aavar Sthan', length: '४८', width: '२५', height: '२२', district: 'अमरावती' },
  { id: 'gm_21', village: 'रिध्दपूर', villageEn: 'Riddhapur', sthan: 'भैरव बुरुज', sthanEn: 'Bhairav Buruj', length: '४४', width: '२७', height: '२३', district: 'अमरावती' },
  { id: 'gm_22', village: 'रिध्दपूर', villageEn: 'Riddhapur', sthan: 'द्वारका दर्शन', sthanEn: 'Dwarka Darshan', length: '६३', width: '४१', height: '२३', district: 'अमरावती' },
  { id: 'gm_23', village: 'रिध्दपूर', villageEn: 'Riddhapur', sthan: 'वाजेश्वरी', sthanEn: 'Vajeshwari', length: '४२', width: '२३', height: '२२', district: 'अमरावती' },

  // ८. सालबर्डी
  { id: 'gm_24', village: 'सालबर्डी', villageEn: 'Salbardi', sthan: 'ससिकरक्षण', sthanEn: 'Sasikarshan', length: '४३', width: '२६', height: '२१', district: 'अमरावती' },
  { id: 'gm_25', village: 'सालबर्डी', villageEn: 'Salbardi', sthan: 'मौन्यदेव', sthanEn: 'Maunyadev', length: '५२', width: '३२', height: '२१', district: 'अमरावती' },
  { id: 'gm_26', village: 'सालबर्डी', villageEn: 'Salbardi', sthan: 'मुक्ताबाई', sthanEn: 'Muktabai', length: '४२', width: '२०', height: '२१', district: 'अमरावती' },

  // ९. अंबाळी
  { id: 'gm_27', village: 'अंबाळी', villageEn: 'Ambali', sthan: 'मुख्य', sthanEn: 'Mukhya', length: '५८', width: '३१', height: '२२', district: 'अमरावती' },
  { id: 'gm_28', village: 'अंबाळी', villageEn: 'Ambali', sthan: 'वनदेव', sthanEn: 'Vandev', length: '६३', width: '३८', height: '१९', district: 'अमरावती' },

  // १०. पैठण
  { id: 'gm_29', village: 'पैठण', villageEn: 'Paithan', sthan: 'पाषाणमठ', sthanEn: 'Pashanmath', length: '७४', width: '३०', height: '१७', district: 'छ. संभाजीनगर' },
  { id: 'gm_30', village: 'पैठण', villageEn: 'Paithan', sthan: 'चौक', sthanEn: 'Chouk Sthan', length: '९२', width: '७९', height: 'सुडा', district: 'छ. संभाजीनगर' },
  { id: 'gm_31', village: 'पैठण', villageEn: 'Paithan', sthan: 'बाईसाप्रेमदान', sthanEn: 'Baisapremdan', length: '७२', width: '४०', height: '१८', district: 'छ. संभाजीनगर' },
  { id: 'gm_32', village: 'पैठण', villageEn: 'Paithan', sthan: 'दोन्ही स्थाने', sthanEn: 'Donhi Sthane', length: '३०', width: '१८', height: '१८', district: 'छ. संभाजीनगर' },
  { id: 'gm_33', village: 'पैठण', villageEn: 'Paithan', sthan: 'भोगनारायण', sthanEn: 'Bhognarayan', length: '६१', width: '३६', height: '१८', district: 'छ. संभाजीनगर' },

  // ११. सावळेद्वार
  { id: 'gm_34', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. १', sthanEn: 'Sthan No. 1', length: '६९', width: '३५', height: '२५', district: 'छ. संभाजीनगर' },
  { id: 'gm_35', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. २', sthanEn: 'Sthan No. 2', length: '२८', width: '२७', height: '१६', district: 'छ. संभाजीनगर' },
  { id: 'gm_36', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ३', sthanEn: 'Sthan No. 3', length: '३७', width: '२९', height: '१६', district: 'छ. संभाजीनगर' },
  { id: 'gm_37', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ४', sthanEn: 'Sthan No. 4', length: '३३', width: '२४', height: '२०', district: 'छ. संभाजीनगर' },
  { id: 'gm_38', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ५', sthanEn: 'Sthan No. 5', length: '७५', width: '२३', height: '२१.५०', district: 'छ. संभाजीनगर' },
  { id: 'gm_39', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ६', sthanEn: 'Sthan No. 6', length: '६६', width: '३२', height: '२०', district: 'छ. संभाजीनगर' },
  { id: 'gm_40', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ७', sthanEn: 'Sthan No. 7', length: '४३.५०', width: '२५', height: '२४', district: 'छ. संभाजीनगर' },
  { id: 'gm_41', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ८', sthanEn: 'Sthan No. 8', length: '५७.५०', width: '२६', height: '२१', district: 'छ. संभाजीनगर' },
  { id: 'gm_42', village: 'सावळेद्वार', villageEn: 'Savaledwar', sthan: 'स्थान क्रं. ९', sthanEn: 'Sthan No. 9', length: '२९.५०', width: '२८', height: '१६', district: 'छ. संभाजीनगर' },

  // १२. वांबोरी
  { id: 'gm_43', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७२', width: '३६', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_44', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '३६', width: '२१', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_45', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '४२', width: '२४', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_46', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ४', sthanEn: 'Sthan No. 4', length: '४२', width: '२५', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_47', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ५', sthanEn: 'Sthan No. 5', length: '४२', width: '२५', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_48', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ६', sthanEn: 'Sthan No. 6', length: '४१', width: '२४', height: '२२', district: 'अहिल्यानगर' },
  { id: 'gm_49', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ७', sthanEn: 'Sthan No. 7', length: '४२', width: '२५', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_50', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ८', sthanEn: 'Sthan No. 8', length: '४०', width: '२५', height: '२१', district: 'अहिल्यानगर' },
  { id: 'gm_51', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ९', sthanEn: 'Sthan No. 9', length: '४२', width: '२५', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_52', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. १०', sthanEn: 'Sthan No. 10', length: '४२', width: '२५', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_53', village: 'वांबोरी', villageEn: 'Vambori', sthan: 'स्थान क्र. ११', sthanEn: 'Sthan No. 11', length: '२८', width: '२३', height: '०५', district: 'अहिल्यानगर' },

  // १३. पुणतांबा
  { id: 'gm_54', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७५', width: '३९', height: '१५', district: 'अहिल्यानगर' },
  { id: 'gm_55', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'भोजनता', sthanEn: 'Bhojanta', length: '४१', width: '३९', height: '१५', district: 'अहिल्यानगर' },
  { id: 'gm_56', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_57', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ४', sthanEn: 'Sthan No. 4', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_58', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ५', sthanEn: 'Sthan No. 5', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_59', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ६', sthanEn: 'Sthan No. 6', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_60', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ७', sthanEn: 'Sthan No. 7', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_61', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ८', sthanEn: 'Sthan No. 8', length: '४४', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_62', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ९', sthanEn: 'Sthan No. 9', length: '४६', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_63', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. १०', sthanEn: 'Sthan No. 10', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },
  { id: 'gm_64', village: 'पुणतांबा', villageEn: 'Puntamba', sthan: 'स्थान क्र. ११', sthanEn: 'Sthan No. 11', length: '४३', width: '३०', height: '२०', district: 'अहिल्यानगर' },

  // १४. संवत्सर
  { id: 'gm_65', village: 'संवत्सर', villageEn: 'Sanvatsar', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७४', width: '३६', height: '३१.५०', district: 'अहिल्यानगर' },
  { id: 'gm_66', village: 'संवत्सर', villageEn: 'Sanvatsar', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '४९', width: '३२', height: '२५', district: 'अहिल्यानगर' },

  // १५. आडगाव (नाशिक)
  { id: 'gm_67', village: 'आडगाव (नाशिक)', villageEn: 'Adgaon (Nashik)', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '६६', width: '३१', height: '१८.५०', district: 'नाशिक' },
  { id: 'gm_68', village: 'आडगाव (नाशिक)', villageEn: 'Adgaon (Nashik)', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '३९', width: '२८', height: '२१.५०', district: 'नाशिक' },

  // १६. खोपडी (सिन्नर)
  { id: 'gm_69', village: 'खोपडी (सिन्नर)', villageEn: 'Khopadi (Sinnar)', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७३', width: '४०', height: '२२', district: 'नाशिक' },
  { id: 'gm_70', village: 'खोपडी (सिन्नर)', villageEn: 'Khopadi (Sinnar)', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '४१', width: '३३', height: '२२', district: 'नाशिक' },
  { id: 'gm_71', village: 'खोपडी (सिन्नर)', villageEn: 'Khopadi (Sinnar)', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '३६', width: '३६', height: '२५', district: 'नाशिक' },
  { id: 'gm_72', village: 'खोपडी (सिन्नर)', villageEn: 'Khopadi (Sinnar)', sthan: 'स्थान क्र. ४', sthanEn: 'Sthan No. 4', length: '४०', width: '४०', height: '२२', district: 'नाशिक' },

  // १७. खनेपूरी (जालना)
  { id: 'gm_73', village: 'खनेपूरी (जालना)', villageEn: 'Khanepuri (Jalna)', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३१', width: '३६', height: '१२', district: 'जालना' },

  // १८. कनाशी
  { id: 'gm_74', village: 'कनाशी', villageEn: 'Kanashi', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७२', width: '३६', height: '१८', district: 'नाशिक' },
  { id: 'gm_75', village: 'कनाशी', villageEn: 'Kanashi', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '२४', width: '२४', height: '१५', district: 'नाशिक' },
  { id: 'gm_76', village: 'कनाशी', villageEn: 'Kanashi', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '२८', width: '२८', height: '१७', district: 'नाशिक' },
  { id: 'gm_77', village: 'कनाशी', villageEn: 'Kanashi', sthan: 'स्थान क्र. ४', sthanEn: 'Sthan No. 4', length: '५८', width: '३९', height: '१९', district: 'नाशिक' },

  // १९. नांदनी
  { id: 'gm_78', village: 'नांदनी', villageEn: 'Nandani', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '४५', width: '२५', height: '१६', district: 'जालना' },

  // २०. निफाड
  { id: 'gm_79', village: 'निफाड', villageEn: 'Niphad', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७०', width: '४०', height: '२३', district: 'नाशिक' },
  { id: 'gm_80', village: 'निफाड', villageEn: 'Niphad', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '२९', width: '२३', height: '२३.५०', district: 'नाशिक' },
  { id: 'gm_81', village: 'निफाड', villageEn: 'Niphad', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '२८', width: '२४', height: '३१.५०', district: 'नाशिक' },
  { id: 'gm_82', village: 'निफाड', villageEn: 'Niphad', sthan: 'स्थान क्र. ४ (बाहेरील)', sthanEn: 'Sthan No. 4 (Baheril)', length: '२७', width: '१९', height: '२१', district: 'नाशिक' },
  { id: 'gm_83', village: 'निफाड', villageEn: 'Niphad', sthan: 'स्थान (बाहेरील)', sthanEn: 'Sthan (Baheril)', length: '२७', width: '२०', height: '२१', district: 'नाशिक' },

  // २१. कोकमठाण
  { id: 'gm_84', village: 'कोकमठाण', villageEn: 'Kokamthan', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '६०', width: '२५.५०', height: '२४', district: 'अहिल्यानगर' },

  // २२. नाऊर
  { id: 'gm_85', village: 'नाऊर', villageEn: 'Naur', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '६०', width: '३०', height: '१५', district: 'अहिल्यानगर' },

  // २३. वांजरगाव
  { id: 'gm_86', village: 'वांजरगाव', villageEn: 'Vanjargaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७१', width: '३२', height: '२०.५०', district: 'अहिल्यानगर' },

  // २४. चांदेगाव
  { id: 'gm_87', village: 'चांदेगाव', villageEn: 'Chandegaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '६१', width: '२९.५०', height: '३०', district: 'अहिल्यानगर' },
  { id: 'gm_88', village: 'चांदेगाव', villageEn: 'Chandegaon', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '३१.५०', width: '२४.५०', height: '१९.५०', district: 'अहिल्यानगर' },

  // २५. नागमठाण
  { id: 'gm_89', village: 'नागमठाण', villageEn: 'Nagamthan', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३५', width: '२३', height: '१९', district: 'अहिल्यानगर' },

  // २६. पुरणगाव
  { id: 'gm_90', village: 'पुरणगाव', villageEn: 'Purangaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '४३.५०', width: '३४.५०', height: '२१.५०', district: 'अहिल्यानगर' },

  // २७. ममदापूर
  { id: 'gm_91', village: 'ममदापूर', villageEn: 'Mamdapur', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '५३', width: '२९', height: '२४', district: 'अहिल्यानगर' },

  // २८. बाजाठाण
  { id: 'gm_92', village: 'बाजाठाण', villageEn: 'Bajathan', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३९', width: '२६', height: '२०', district: 'अहिल्यानगर' },

  // २९. घुमनदेव
  { id: 'gm_93', village: 'घुमनदेव', villageEn: 'Ghumandev', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३४', width: '२३', height: '२०', district: 'अहिल्यानगर' },

  // ३०. टाकळीभाण
  { id: 'gm_94', village: 'टाकळीभाण', villageEn: 'Taklibhan', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३६', width: '२४.५०', height: '२०.५०', district: 'अहिल्यानगर' },

  // ३१. ममदापूर (२)
  { id: 'gm_95', village: 'ममदापूर (गाव)', villageEn: 'Mamdapur (Village)', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३१', width: '२२.५०', height: '१६', district: 'अहिल्यानगर' },

  // ३२. बगडी
  { id: 'gm_96', village: 'बगडी', villageEn: 'Bagadi', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३०', width: '२०', height: '२२', district: 'अहिल्यानगर' },

  // ३३. जामगाव
  { id: 'gm_97', village: 'जामगाव', villageEn: 'Jamgaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '८६.५०', width: '५०', height: '२४.५०', district: 'अहिल्यानगर' },

  // ३४. वडकाळी
  { id: 'gm_98', village: 'वडकाळी', villageEn: 'Vadkali', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '२४.५०', width: '२१', height: '११', district: 'अहिल्यानगर' },

  // ३५. माहेगाव
  { id: 'gm_99', village: 'माहेगाव', villageEn: 'Mahegaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '५४.५०', width: '२८.५०', height: '१३', district: 'अहिल्यानगर' },

  // ३६. मीरगाव
  { id: 'gm_100', village: 'मीरगाव', villageEn: 'Mirgaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '५१', width: '३१.५०', height: '१८', district: 'अहिल्यानगर' },

  // ३७. पांढरी
  { id: 'gm_101', village: 'पांढरी', villageEn: 'Pandhari', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '४७', width: '२२.५०', height: '२२.५०', district: 'जालना' },

  // ३८. साडेगाव
  { id: 'gm_102', village: 'साडेगाव', villageEn: 'Sadegaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '२६.५०', width: '१७', height: '२०', district: 'जालना' },

  // ३९. जोगलादेवी
  { id: 'gm_103', village: 'जोगलादेवी', villageEn: 'Jogladevi', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '४०.५०', width: '२८', height: '२०.५०', district: 'बीड' },

  // ४०. बागपिंपळगाव
  { id: 'gm_104', village: 'बागपिंपळगाव', villageEn: 'Bagpimpalgaon', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '४५.५०', width: '२३.५०', height: '२५', district: 'बीड' },

  // ४१. माणिकदंड
  { id: 'gm_105', village: 'माणिकदंड', villageEn: 'Manikdand', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '२३.५०', width: '२४', height: '२०', district: 'बीड' },
  { id: 'gm_106', village: 'माणिकदंड (शेत)', villageEn: 'Manikdand (Farm)', sthan: 'शेतामध्ये', sthanEn: 'Shetamadhe', length: '३८', width: '२३', height: '०८', district: 'बीड' },

  // ४२. ढाकेफळ
  { id: 'gm_107', village: 'ढाकेफळ', villageEn: 'Dhakephal', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३१', width: '१६.५०', height: '२१', district: 'जालना' },
  { id: 'gm_108', village: 'ढाकेफळ', villageEn: 'Dhakephal', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '५२', width: '२४.५०', height: '२२', district: 'जालना' },

  // ४३. आहेरमल
  { id: 'gm_109', village: 'आहेरमल', villageEn: 'Ahermal', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '३८.५०', width: '२६', height: '२०', district: 'नाशिक' },

  // ४४. वाघळी
  { id: 'gm_110', village: 'वाघळी', villageEn: 'Waghali', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '७९', width: '३१', height: '२२', district: 'जळगाव' },

  // ४५. नांदुरमधमेश्वर
  { id: 'gm_111', village: 'नांदुरमधमेश्वर', villageEn: 'Nandur Madhameshwar', sthan: 'मुख्यस्थान', sthanEn: 'Mukhya Sthan', length: '६०', width: '२४', height: '२४', district: 'नाशिक' },
  { id: 'gm_112', village: 'नांदुरमधमेश्वर', villageEn: 'Nandur Madhameshwar', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '३६', width: '२४', height: '२४', district: 'नाशिक' },
  { id: 'gm_113', village: 'नांदुरमधमेश्वर', villageEn: 'Nandur Madhameshwar', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '३६', width: '२४', height: '२४', district: 'नाशिक' },

  // ४६. वालसांगवी
  { id: 'gm_114', village: 'वालसांगवी', villageEn: 'Valsangvi', sthan: 'स्थान क्र. १', sthanEn: 'Sthan No. 1', length: '६२', width: '३०', height: '३५', district: 'जालना' },
  { id: 'gm_115', village: 'वालसांगवी', villageEn: 'Valsangvi', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '३३', width: '२६', height: '२५', district: 'जालना' },
  { id: 'gm_116', village: 'वालसांगवी', villageEn: 'Valsangvi', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '३९', width: '२७', height: '२५', district: 'जालना' },
  { id: 'gm_117', village: 'वालसांगवी', villageEn: 'Valsangvi', sthan: 'स्थान क्र. ४', sthanEn: 'Sthan No. 4', length: '५०', width: '३४', height: '२५', district: 'जालना' },
  { id: 'gm_118', village: 'वालसांगवी', villageEn: 'Valsangvi', sthan: 'स्थान क्र. ५', sthanEn: 'Sthan No. 5', length: '३०', width: '२५', height: '२५', district: 'जालना' },

  // ४७. मासरूळ
  { id: 'gm_119', village: 'मासरूळ', villageEn: 'Masrul', sthan: 'स्थान क्र. १', sthanEn: 'Sthan No. 1', length: '७५', width: '४०', height: '२३', district: 'बुलढाणा' },
  { id: 'gm_120', village: 'मासरूळ', villageEn: 'Masrul', sthan: 'स्थान क्र. २', sthanEn: 'Sthan No. 2', length: '३९.५०', width: '२९', height: '२१', note: 'मूळ नोंद: ३९.१/२ (३९.५० इंच)', district: 'बुलढाणा' },
  { id: 'gm_121', village: 'मासरूळ', villageEn: 'Masrul', sthan: 'स्थान क्र. ३', sthanEn: 'Sthan No. 3', length: '३२', width: '३०', height: '१४', district: 'बुलढाणा' },
  { id: 'gm_122', village: 'मासरूळ', villageEn: 'Masrul', sthan: 'स्थान क्र. ४', sthanEn: 'Sthan No. 4', length: '४५', width: '३१', height: '१३', district: 'बुलढाणा' },
  { id: 'gm_123', village: 'मासरूळ', villageEn: 'Masrul', sthan: 'स्थान क्र. ५', sthanEn: 'Sthan No. 5', length: '४२', width: '३२', height: '१२', district: 'बुलढाणा' },
  { id: 'gm_124', village: 'मासरूळ', villageEn: 'Masrul', sthan: 'स्थान क्र. ६', sthanEn: 'Sthan No. 6', length: '४०', width: '२९', height: '१८', district: 'बुलढाणा' }
];

export const sthanGalfaMaapBook: Book = {
  id: 'sthan_galfa_maap',
  title: '📐 सर्व स्थानांची गल्फ माप सारणी (४९ गावे व १२४ स्थाने)',
  titleEn: 'Sarva Sthananchi Galfa Maap Sarani (49 Gave va 124 Sthane)',
  author: 'महानुभाव पंथ / स्थान सेवा व्यवस्थापन',
  description: 'सर्व प्रमुख स्थानांच्या गल्फांचे (पवित्र आसनावरील रेशमी/मखमली वस्त्र) अधिकृत प्रमाणबद्ध लांबी, रुंदी व उंची (इंचामध्ये) नोंदविणारी डिजिटल सारणी. यात ४९ गावे आणि १२४ पवित्र स्थानांच्या गल्फांचे तंतोतंत माप दिले आहे.',
  descriptionEn: 'Authoritative table and directory of Galfa measurements (Length, Width, Height in inches) for 124 sacred altars across 49 prominent pilgrimage places.',
  category: 'pramukh_granth',
  chaptersCount: 10,
  coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop'
};

export const sthanGalfaMaapChapters: Chapter[] = [
  {
    id: 'sgm_ch1',
    bookId: 'sthan_galfa_maap',
    number: 1,
    title: 'प्रस्तावना व संपूर्ण गल्फा माप सूची (सर्व ४९ गावे व १२४ स्थाने)',
    titleEn: 'Introduction & Complete Master Table of Galfa Measurements',
    content: `॥ श्रीचक्रधराय नमः ॥

**"प्रमुख स्थानांच्या गल्फाचे माप"**
(सर्व आकडे इंचामध्ये आहेत - लांबी × रुंदी × उंची)

**गल्फ म्हणजे काय?**
महानुभाव पंथात श्रीचक्रधर स्वामी, श्रीगोविंदप्रभू महाराज व पंचकृष्णांच्या पदस्पर्शाने पावन झालेल्या प्रत्येक पवित्र स्थानावर (ओटा, चरण, पलंग, आसन, गाभारा) रेशमी, मखमली किंवा जरीकामयुक्त सुंदर वस्त्र परिधान केले जाते, त्यास "गल्फ" असे म्हणतात. प्रत्येक स्थानाचा ओटा आणि आसन वेगवेगळ्या आकाराचे असल्याने गल्फाची लांबी, रुंदी आणि उंची निश्चित ठरलेली असते.

खाली सर्व प्रमुख ४९ गावे व १२४ स्थानांची अधिकृत प्रमाणबद्ध मापे दिली आहेत:

-----------------------------------------------------------------------
गाव               | स्थान                 | लांबी (इंच) | रुंदी (इंच) | उंची (इंच) | विशेष टीप
-----------------------------------------------------------------------
जाळीचादेव         | मुख्यस्थान            | ६०          | २४          | २०         | 
पांचाळेश्वर       | आत्मतिर्थ             | १०९         | ५६          | १८         | 
पांचाळेश्वर       | गुंफा                 | ५५          | ३०          | १८         | 
पांचाळेश्वर       | अवस्थान               | ६१          | ३७          | २०         | 
बेलापूर           | मुख्य                 | ७२          | ३७.५०       | २२         | 
बेलापूर           | वज्री घडवणे           | ३७          | २७.५०       | १८         | 
डोमेग्राम         | राजमठ                 | ८८          | ४४          | २२         | 
डोमेग्राम         | उंचमठ                 | ५१          | ३१          | १८         | 
डोमेग्राम         | प्रसन्नमठ             | ६६          | ३४          | १८         | 
फलटण             | आबासाहेब              | ६२          | ३०          | १८         | 
फलटण             | सभामंडपातले           | ५०          | ५०          | १२         | सभामंडपाबाहेरील अष्टकोनी १९ इंचाचा एक कोन
फलटण             | बाबासाहेब              | ६०          | ३७          | १८         | खांबाचा मध्य १४ इंचावर
फलटण             | बाबासाहेब गाभारा ओटा   | ५२          | ३१          | २२         | 
फलटण             | जन्मस्थान              | ६४          | ३१          | १८         | दोन खांब १२ इंचावर
फलटण             | रंगशिळा (मळा)         | ५०          | ३५          | १३         | 
फलटण             | रंगशिळा (पेठेतील)     | ६३          | ४६          | १८         | 
मलठण             | मुख्य                 | ११५         | ११५         | ५ झालर     | 
मलठण             | बाहेरील ओटा           | ४८          | ३२          | ११         | 
रिध्दपूर          | राजमठ                 | ४९          | १९          | ९          | 
रिध्दपूर          | आवार                  | ४८          | २५          | २२         | 
रिध्दपूर          | भैरव बुरुज            | ४४          | २७          | २३         | 
रिध्दपूर          | द्वारका दर्शन         | ६३          | ४१          | २३         | 
रिध्दपूर          | वाजेश्वरी              | ४२          | २३          | २२         | 
सालबर्डी          | ससिकरक्षण             | ४३          | २६          | २१         | 
सालबर्डी          | मौन्यदेव              | ५२          | ३२          | २१         | 
सालबर्डी          | मुक्ताबाई             | ४२          | २०          | २१         | 
अंबाळी            | मुख्य                 | ५८          | ३१          | २२         | 
अंबाळी            | वनदेव                 | ६३          | ३८          | १९         | 
पैठण              | पाषाणमठ               | ७४          | ३०          | १७         | 
पैठण              | चौक                   | ९२          | ७९          | सुडा        | 
पैठण              | बाईसाप्रेमदान         | ७२          | ४०          | १८         | 
पैठण              | दोन्ही स्थाने         | ३०          | १८          | १८         | 
पैठण              | भोगनारायण             | ६१          | ३६          | १८         | 
सावळेद्वार        | स्थान क्रं. १         | ६९          | ३५          | २५         | 
सावळेद्वार        | स्थान क्रं. २         | २८          | २७          | १६         | 
सावळेद्वार        | स्थान क्रं. ३         | ३७          | २९          | १६         | 
सावळेद्वार        | स्थान क्रं. ४         | ३३          | २४          | २०         | 
सावळेद्वार        | स्थान क्रं. ५         | ७५          | २३          | २१.५०      | 
सावळेद्वार        | स्थान क्रं. ६         | ६६          | ३२          | २०         | 
सावळेद्वार        | स्थान क्रं. ७         | ४३.५०       | २५          | २४         | 
सावळेद्वार        | स्थान क्रं. ८         | ५७.५०       | २६          | २१         | 
सावळेद्वार        | स्थान क्रं. ९         | २९.५०       | २८          | १६         | 
वांबोरी           | मुख्यस्थान            | ७२          | ३६          | २१         | 
वांबोरी           | स्थान क्र. २          | ३६          | २१          | २१         | 
वांबोरी           | स्थान क्र. ३          | ४२          | २४          | २१         | 
वांबोरी           | स्थान क्र. ४          | ४२          | २५          | २१         | 
वांबोरी           | स्थान क्र. ५          | ४२          | २५          | २१         | 
वांबोरी           | स्थान क्र. ६          | ४१          | २४          | २२         | 
वांबोरी           | स्थान क्र. ७          | ४२          | २५          | २१         | 
वांबोरी           | स्थान क्र. ८          | ४०          | २५          | २१         | 
वांबोरी           | स्थान क्र. ९          | ४२          | २५          | २०         | 
वांबोरी           | स्थान क्र. १०         | ४२          | २५          | २०         | 
वांबोरी           | स्थान क्र. ११         | २८          | २३          | ०५         | 
पुणतांबा          | मुख्यस्थान            | ७५          | ३९          | १५         | 
पुणतांबा          | भोजनता                | ४१          | ३९          | १५         | 
पुणतांबा          | स्थान क्र. ३          | ४३          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ४          | ४३          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ५          | ४३          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ६          | ४३          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ७          | ४३          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ८          | ४४          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ९          | ४६          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. १०         | ४३          | ३०          | २०         | 
पुणतांबा          | स्थान क्र. ११         | ४३          | ३०          | २०         | 
संवत्सर           | मुख्यस्थान            | ७४          | ३६          | ३१.५०      | 
संवत्सर           | स्थान क्र. २          | ४९          | ३२          | २५         | 
आडगाव (नाशिक)    | मुख्यस्थान            | ६६          | ३१          | १८.५०      | 
आडगाव (नाशिक)    | स्थान क्र. २          | ३९          | २८          | २१.५०      | 
खोपडी (सिन्नर)   | मुख्यस्थान            | ७३          | ४०          | २२         | 
खोपडी (सिन्नर)   | स्थान क्र. २          | ४१          | ३३          | २२         | 
खोपडी (सिन्नर)   | स्थान क्र. ३          | ३६          | ३६          | २५         | 
खोपडी (सिन्नर)   | स्थान क्र. ४          | ४०          | ४०          | २२         | 
खनेपूरी (जालना)   | मुख्यस्थान            | ३१          | ३६          | १२         | 
कनाशी             | मुख्यस्थान            | ७२          | ३६          | १८         | 
कनाशी             | स्थान क्र. २          | २४          | २४          | १५         | 
कनाशी             | स्थान क्र. ३          | २८          | २८          | १७         | 
कनाशी             | स्थान क्र. ४          | ५८          | ३९          | १९         | 
नांदनी            | मुख्यस्थान            | ४५          | २५          | १६         | 
निफाड             | मुख्यस्थान            | ७०          | ४०          | २३         | 
निफाड             | स्थान क्र. २          | २९          | २३          | २३.५०      | 
निफाड             | स्थान क्र. ३          | २८          | २४          | ३१.५०      | 
निफाड             | स्थान क्र. ४ (बाहेरील)| २७          | १९          | २१         | 
निफाड             | स्थान (बाहेरील)       | २७          | २०          | २१         | 
कोकमठाण           | मुख्यस्थान            | ६०          | २५.५०       | २४         | 
नाऊर              | मुख्यस्थान            | ६०          | ३०          | १५         | 
वांजरगाव          | मुख्यस्थान            | ७१          | ३२          | २०.५०      | 
चांदेगाव          | मुख्यस्थान            | ६१          | २९.५०       | ३०         | 
चांदेगाव          | स्थान क्र. २          | ३१.५०       | २४.५०       | १९.५०      | 
नागमठाण           | मुख्यस्थान            | ३५          | २३          | १९         | 
पुरणगाव           | मुख्यस्थान            | ४३.५०       | ३४.५०       | २१.५०      | 
ममदापूर           | मुख्यस्थान            | ५३          | २९          | २४         | 
बाजाठाण           | मुख्यस्थान            | ३९          | २६          | २०         | 
घुमनदेव           | मुख्यस्थान            | ३४          | २३          | २०         | 
टाकळीभाण          | मुख्यस्थान            | ३६          | २४.५०       | २०.५०      | 
ममदापूर (गाव)     | मुख्यस्थान            | ३१          | २२.५०       | १६         | 
बगडी              | मुख्यस्थान            | ३०          | २०          | २२         | 
जामगाव            | मुख्यस्थान            | ८६.५०       | ५०          | २४.५०      | 
वडकाळी            | मुख्यस्थान            | २४.५०       | २१          | ११         | 
माहेगाव           | मुख्यस्थान            | ५४.५०       | २८.५०       | १३         | 
मीरगाव            | मुख्यस्थान            | ५१          | ३१.५०       | १८         | 
पांढरी            | मुख्यस्थान            | ४७          | २२.५०       | २२.५०      | 
साडेगाव           | मुख्यस्थान            | २६.५०       | १७          | २०         | 
जोगलादेवी         | मुख्यस्थान            | ४०.५०       | २८          | २०.५०      | 
बागपिंपळगाव       | मुख्यस्थान            | ४५.५०       | २३.५०       | २५         | 
माणिकदंड          | मुख्यस्थान            | २३.५०       | २४          | २०         | 
माणिकदंड          | शेतामध्ये             | ३८          | २३          | ०८         | 
ढाकेफळ            | मुख्यस्थान            | ३१          | १६.५०       | २१         | 
ढाकेफळ            | स्थान क्र. २          | ५२          | २४.५०       | २२         | 
आहेरमल            | मुख्यस्थान            | ३८.५०       | २६          | २०         | 
वाघळी             | मुख्यस्थान            | ७९          | ३१          | २२         | 
नांदुरमधमेश्वर     | मुख्यस्थान            | ६०          | २४          | २४         | 
नांदुरमधमेश्वर     | स्थान क्र. २          | ३६          | २४          | २४         | 
नांदुरमधमेश्वर     | स्थान क्र. ३          | ३६          | २४          | २४         | 
वालसांगवी         | स्थान क्र. १          | ६२          | ३०          | ३५         | 
वालसांगवी         | स्थान क्र. २          | ३३          | २६          | २५         | 
वालसांगवी         | स्थान क्र. ३          | ३९          | २७          | २५         | 
वालसांगवी         | स्थान क्र. ४          | ५०          | ३४          | २५         | 
वालसांगवी         | स्थान क्र. ५          | ३०          | २५          | २५         | 
मासरूळ            | स्थान क्र. १          | ७५          | ४०          | २३         | 
मासरूळ            | स्थान क्र. २          | ३९.५०       | २९          | २१         | ३९.१/२ (३९.५० इंच)
मासरूळ            | स्थान क्र. ३          | ३२          | ३०          | १४         | 
मासरूळ            | स्थान क्र. ४          | ४५          | ३१          | १३         | 
मासरूळ            | स्थान क्र. ५          | ४२          | ३२          | १२         | 
मासरूळ            | स्थान क्र. ६          | ४०          | २९          | १८         | 
-----------------------------------------------------------------------`,
    explanation: `१. प्रसंग व संदर्भ : महानुभाव पंथातील प्रमुख तीर्थस्थानावरील गल्फांची माप नोंद ही पारंपरिक हस्तलिखित व मुद्रित संदर्भग्रंथामधून संकलित केलेली आहे.
२. सविस्तर भावार्थ : या नोंदीनुसार भाविक, भक्त व मंडळे स्थानावर अर्पण करण्यासाठी योग्य मापाचे रेशमी/मखमली गल्फ शिवून आणू शकतात.`
  },
  {
    id: 'sgm_ch2',
    bookId: 'sthan_galfa_maap',
    number: 2,
    title: 'जाळीचादेव, पांचाळेश्वर, बेलापूर व डोमेग्राम',
    titleEn: 'Jalichadev, Panchaleshwar, Belapur & Domegram',
    content: `॥ श्री चक्रधराय नमः ॥

**१. जाळीचादेव (बुलढाणा जिल्हा)**
* मुख्यस्थान : लांबी ६० इंच | रुंदी २४ इंच | उंची २० इंच

**२. पांचाळेश्वर (छत्रपती संभाजीनगर जिल्हा - गोदावरी तीर)**
* आत्मतिर्थ : लांबी १०९ इंच | रुंदी ५६ इंच | उंची १८ इंच
* गुंफा : लांबी ५५ इंच | रुंदी ३० इंच | उंची १८ इंच
* अवस्थान : लांबी ६१ इंच | रुंदी ३७ इंच | उंची २० इंच

**३. बेलापूर (अहिल्यानगर जिल्हा - प्रवरा तीर)**
* मुख्यस्थान : लांबी ७२ इंच | रुंदी ३७.५० इंच | उंची २२ इंच
* वज्री घडवणे : लांबी ३७ इंच | रुंदी २७.५० इंच | उंची १८ इंच

**४. डोमेग्राम / कमळापूर (अहिल्यानगर जिल्हा)**
* राजमठ : लांबी ८८ इंच | रुंदी ४४ इंच | उंची २२ इंच
* उंचमठ : लांबी ५१ इंच | रुंदी ३१ इंच | उंची १८ इंच
* प्रसन्नमठ : लांबी ६६ इंच | रुंदी ३४ इंच | उंची १८ इंच`,
    explanation: `पांचाळेश्वर व डोमेग्राम ही श्रीचक्रधर स्वामींच्या लीळांनी पावन झालेली अतिशय पवित्र क्षेत्रे आहेत. येथील तिन्ही मठांचे (राजमठ, उंचमठ, प्रसन्नमठ) गल्फ प्रमाणबद्ध शिवले जातात.`
  },
  {
    id: 'sgm_ch3',
    bookId: 'sthan_galfa_maap',
    number: 3,
    title: 'फलटण व मलठण येथील स्थाने',
    titleEn: 'Phaltan & Malthan Sthan Measurements',
    content: `॥ श्री चक्रधराय नमः ॥

**५. फलटण (सातारा जिल्हा - श्री चांगदेव राऊळ / चक्रधर स्वामी अवतार स्थळ)**
* आबासाहेब स्थान : लांबी ६२ इंच | रुंदी ३० इंच | उंची १८ इंच
* सभामंडपातले स्थान : लांबी ५० इंच | रुंदी ५० इंच | उंची १२ इंच
  *(विशेष टीप : सभामंडपाबाहेरील अष्टकोनी १९ इंचाचा एक कोन)*
* बाबासाहेब स्थान : लांबी ६० इंच | रुंदी ३७ इंच | उंची १८ इंच
  *(विशेष टीप : खांबाचा मध्य १४ इंचावर)*
* बाबासाहेब गाभारा ओटा : लांबी ५२ इंच | रुंदी ३१ इंच | उंची २२ इंच
* जन्मस्थान : लांबी ६४ इंच | रुंदी ३१ इंच | उंची १८ इंच
  *(विशेष टीप : दोन खांब १२ इंचावर)*
* रंगशिळा (मळा) : लांबी ५० इंच | रुंदी ३५ इंच | उंची १३ इंच
* रंगशिळा (पेठेतील) : लांबी ६३ इंच | रुंदी ४६ इंच | उंची १८ इंच

**६. मलठण (पुणे जिल्हा)**
* मुख्यस्थान : लांबी ११५ इंच | रुंदी ११५ इंच | उंची ५ झालर
* बाहेरील ओटा : लांबी ४८ इंच | रुंदी ३२ इंच | उंची ११ इंच`,
    explanation: `फलटण हे महानुभाव पंथातील अद्वितीय अवतारस्थान आहे. येथील जन्मस्थान, आबासाहेब व बाबासाहेब गाभारा ओटा यांच्या गल्फांचे माप विशेष अचूक असावे लागते.`
  },
  {
    id: 'sgm_ch4',
    bookId: 'sthan_galfa_maap',
    number: 4,
    title: 'रिध्दपूर, सालबर्डी व अंबाळी (विदर्भ परिसर)',
    titleEn: 'Riddhapur, Salbardi & Ambali (Vidarbha Region)',
    content: `॥ श्री चक्रधराय नमः ॥

**७. रिध्दपूर धाम (अमरावती जिल्हा - श्री गोविंदप्रभू अवतारभूमी व लीळास्थान)**
* राजमठ : लांबी ४९ इंच | रुंदी १९ इंच | उंची ९ इंच
* आवार : लांबी ४८ इंच | रुंदी २५ इंच | उंची २२ इंच
* भैरव बुरुज : लांबी ४४ इंच | रुंदी २७ इंच | उंची २३ इंच
* द्वारका दर्शन : लांबी ६३ इंच | रुंदी ४१ इंच | उंची २३ इंच
* वाजेश्वरी : लांबी ४२ इंच | रुंदी २३ इंच | उंची २२ इंच

**८. सालबर्डी (अमरावती / मध्य प्रदेश सीमा)**
* ससिकरक्षण : लांबी ४३ इंच | रुंदी २६ इंच | उंची २१ इंच
* मौन्यदेव : लांबी ५२ इंच | रुंदी ३२ इंच | उंची २१ इंच
* मुक्ताबाई : लांबी ४२ इंच | रुंदी २० इंच | उंची २१ इंच

**९. अंबाळी (अमरावती जिल्हा)**
* मुख्यस्थान : लांबी ५८ इंच | रुंदी ३१ इंच | उंची २२ इंच
* वनदेव : लांबी ६३ इंच | रुंदी ३८ इंच | उंची १९ इंच`,
    explanation: `रिध्दपूर ही महानुभाव पंथाची काशी मानली जाते. श्रीप्रभूंच्या वास्तव्याने पावन झालेल्या राजमठ, आवार, भैरव बुरुज, द्वारका दर्शन येथील गल्फांचे हे अधिकृत माप आहे.`
  },
  {
    id: 'sgm_ch5',
    bookId: 'sthan_galfa_maap',
    number: 5,
    title: 'पैठण व सावळेद्वार (गोदावरी तीर)',
    titleEn: 'Paithan & Savaledwar Sthan Measurements',
    content: `॥ श्री चक्रधराय नमः ॥

**१०. पैठण (छत्रपती संभाजीनगर जिल्हा - दक्षिण काशी)**
* पाषाणमठ : लांबी ७४ इंच | रुंदी ३० इंच | उंची १७ इंच
* चौक : लांबी ९२ इंच | रुंदी ७९ इंच | उंची सुडा
* बाईसाप्रेमदान : लांबी ७२ इंच | रुंदी ४० इंच | उंची १८ इंच
* दोन्ही स्थाने : लांबी ३० इंच | रुंदी १८ इंच | उंची १८ इंच
* भोगनारायण : लांबी ६१ इंच | रुंदी ३६ इंच | उंची १८ इंच

**११. सावळेद्वार (छत्रपती संभाजीनगर जिल्हा)**
* स्थान क्रं. १ : लांबी ६९ इंच | रुंदी ३५ इंच | उंची २५ इंच
* स्थान क्रं. २ : लांबी २८ इंच | रुंदी २७ इंच | उंची १६ इंच
* स्थान क्रं. ३ : लांबी ३७ इंच | रुंदी २९ इंच | उंची १६ इंच
* स्थान क्रं. ४ : लांबी ३३ इंच | रुंदी २४ इंच | उंची २० इंच
* स्थान क्रं. ५ : लांबी ७५ इंच | रुंदी २३ इंच | उंची २१.५० इंच
* स्थान क्रं. ६ : लांबी ६६ इंच | रुंदी ३२ इंच | उंची २० इंच
* स्थान क्रं. ७ : लांबी ४३.५० इंच | रुंदी २५ इंच | उंची २४ इंच
* स्थान क्रं. ८ : लांबी ५७.५० इंच | रुंदी २६ इंच | उंची २१ इंच
* स्थान क्रं. ९ : लांबी २९.५० इंच | रुंदी २८ इंच | उंची १६ इंच`,
    explanation: `पैठण येथील पाषाणमठ व सावळेद्वार येथील १ ते ९ स्थाने भक्तांच्या नित्य दर्शनाची पावन केंद्रे आहेत.`
  },
  {
    id: 'sgm_ch6',
    bookId: 'sthan_galfa_maap',
    number: 6,
    title: 'वांबोरी व पुणतांबा (अहिल्यानगर परिसर)',
    titleEn: 'Vambori & Puntamba Sthan Measurements',
    content: `॥ श्री चक्रधराय नमः ॥

**१२. वांबोरी (अहिल्यानगर जिल्हा - ११ स्थाने)**
* मुख्यस्थान : लांबी ७२ इंच | रुंदी ३६ इंच | उंची २१ इंच
* स्थान क्र. २ : लांबी ३६ इंच | रुंदी २१ इंच | उंची २१ इंच
* स्थान क्र. ३ : लांबी ४२ इंच | रुंदी २४ इंच | उंची २१ इंच
* स्थान क्र. ४ : लांबी ४२ इंच | रुंदी २५ इंच | उंची २१ इंच
* स्थान क्र. ५ : लांबी ४२ इंच | रुंदी २५ इंच | उंची २१ इंच
* स्थान क्र. ६ : लांबी ४१ इंच | रुंदी २४ इंच | उंची २२ इंच
* स्थान क्र. ७ : लांबी ४२ इंच | रुंदी २५ इंच | उंची २१ इंच
* स्थान क्र. ८ : लांबी ४० इंच | रुंदी २५ इंच | उंची २१ इंच
* स्थान क्र. ९ : लांबी ४२ इंच | रुंदी २५ इंच | उंची २० इंच
* स्थान क्र. १० : लांबी ४२ इंच | रुंदी २५ इंच | उंची २० इंच
* स्थान क्र. ११ : लांबी २८ इंच | रुंदी २३ इंच | उंची ०५ इंच

**१३. पुणतांबा (अहिल्यानगर जिल्हा - ११ स्थाने)**
* मुख्यस्थान : लांबी ७५ इंच | रुंदी ३९ इंच | उंची १५ इंच
* भोजनता : लांबी ४१ इंच | रुंदी ३९ इंच | उंची १५ इंच
* स्थान क्र. ३ : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ४ : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ५ : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ६ : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ७ : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ८ : लांबी ४४ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ९ : लांबी ४६ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. १० : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच
* स्थान क्र. ११ : लांबी ४३ इंच | रुंदी ३० इंच | उंची २० इंच`,
    explanation: `वांबोरी आणि पुणतांबा या दोन्ही तीर्थक्षेत्रांवर प्रत्येकी ११-११ स्थानांचा अत्यंत महत्त्वाचा समूह आहे.`
  },
  {
    id: 'sgm_ch7',
    bookId: 'sthan_galfa_maap',
    number: 7,
    title: 'नाशिक व सिन्नर परिसर (संवत्सर, आडगाव, खोपडी, कनाशी, निफाड)',
    titleEn: 'Nashik & Sinnar Region (Sanvatsar, Adgaon, Khopadi, Kanashi, Niphad)',
    content: `॥ श्री चक्रधराय नमः ॥

**१४. संवत्सर (अहिल्यानगर / नाशिक सीमा)**
* मुख्यस्थान : लांबी ७४ इंच | रुंदी ३६ इंच | उंची ३१.५० इंच
* स्थान क्र. २ : लांबी ४९ इंच | रुंदी ३२ इंच | उंची २५ इंच

**१५. आडगाव (नाशिक)**
* मुख्यस्थान : लांबी ६६ इंच | रुंदी ३१ इंच | उंची १८.५० इंच
* स्थान क्र. २ : लांबी ३९ इंच | रुंदी २८ इंच | उंची २१.५० इंच

**१६. खोपडी (सिन्नर, नाशिक जिल्हा)**
* मुख्यस्थान : लांबी ७३ इंच | रुंदी ४० इंच | उंची २२ इंच
* स्थान क्र. २ : लांबी ४१ इंच | रुंदी ३३ इंच | उंची २२ इंच
* स्थान क्र. ३ : लांबी ३६ इंच | रुंदी ३६ इंच | उंची २५ इंच
* स्थान क्र. ४ : लांबी ४० इंच | रुंदी ४० इंच | उंची २२ इंच

**१७. खनेपूरी (जालना जिल्हा)**
* मुख्यस्थान : लांबी ३१ इंच | रुंदी ३६ इंच | उंची १२ इंच

**१८. कनाशी (नाशिक जिल्हा)**
* मुख्यस्थान : लांबी ७२ इंच | रुंदी ३६ इंच | उंची १८ इंच
* स्थान क्र. २ : लांबी २४ इंच | रुंदी २४ इंच | उंची १५ इंच
* स्थान क्र. ३ : लांबी २८ इंच | रुंदी २८ इंच | उंची १७ इंच
* स्थान क्र. ४ : लांबी ५८ इंच | रुंदी ३९ इंच | उंची १९ इंच

**१९. नांदनी (जालना जिल्हा)**
* मुख्यस्थान : लांबी ४५ इंच | रुंदी २५ इंच | उंची १६ इंच

**२०. निफाड (नाशिक जिल्हा)**
* मुख्यस्थान : लांबी ७० इंच | रुंदी ४० इंच | उंची २३ इंच
* स्थान क्र. २ : लांबी २९ इंच | रुंदी २३ इंच | उंची २३.५० इंच
* स्थान क्र. ३ : लांबी २८ इंच | रुंदी २४ इंच | उंची ३१.५० इंच
* स्थान क्र. ४ (बाहेरील) : लांबी २७ इंच | रुंदी १९ इंच | उंची २१ इंच
* स्थान (बाहेरील) : लांबी २७ इंच | रुंदी २० इंच | उंची २१ इंच`,
    explanation: `नाशिक व सिन्नर परिसरातील खोपडी, निफाड, कनाशी व आडगाव येथील स्थानांचे माप.`
  },
  {
    id: 'sgm_ch8',
    bookId: 'sthan_galfa_maap',
    number: 8,
    title: 'गोदावरी व प्रवरा संगम परिसर (कोकमठाण ते मीरगाव - १६ स्थाने)',
    titleEn: 'Godavari & Pravara Belt (Kokamthan to Mirgaon - 16 Sthans)',
    content: `॥ श्री चक्रधराय नमः ॥

**२१. कोकमठाण :** मुख्यस्थान - लांबी ६० इंच | रुंदी २५.५० इंच | उंची २४ इंच
**२२. नाऊर :** मुख्यस्थान - लांबी ६० इंच | रुंदी ३० इंच | उंची १५ इंच
**२३. वांजरगाव :** मुख्यस्थान - लांबी ७१ इंच | रुंदी ३२ इंच | उंची २०.५० इंच
**२४. चांदेगाव :**
* मुख्यस्थान - लांबी ६१ इंच | रुंदी २९.५० इंच | उंची ३० इंच
* स्थान क्र. २ - लांबी ३१.५० इंच | रुंदी २४.५० इंच | उंची १९.५० इंच
**२५. नागमठाण :** मुख्यस्थान - लांबी ३५ इंच | रुंदी २३ इंच | उंची १९ इंच
**२६. पुरणगाव :** मुख्यस्थान - लांबी ४३.५० इंच | रुंदी ३४.५० इंच | उंची २१.५० इंच
**२७. ममदापूर :** मुख्यस्थान - लांबी ५३ इंच | रुंदी २९ इंच | उंची २४ इंच
**२८. बाजाठाण :** मुख्यस्थान - लांबी ३९ इंच | रुंदी २६ इंच | उंची २० इंच
**२९. घुमनदेव :** मुख्यस्थान - लांबी ३४ इंच | रुंदी २३ इंच | उंची २० इंच
**३०. टाकळीभाण :** मुख्यस्थान - लांबी ३६ इंच | रुंदी २४.५० इंच | उंची २०.५० इंच
**३१. ममदापूर (गाव) :** मुख्यस्थान - लांबी ३१ इंच | रुंदी २२.५० इंच | उंची १६ इंच
**३२. बगडी :** मुख्यस्थान - लांबी ३० इंच | रुंदी २० इंच | उंची २२ इंच
**३३. जामगाव :** मुख्यस्थान - लांबी ८६.५० इंच | रुंदी ५० इंच | उंची २४.५० इंच
**३४. वडकाळी :** मुख्यस्थान - लांबी २४.५० इंच | रुंदी २१ इंच | उंची ११ इंच
**३५. माहेगाव :** मुख्यस्थान - लांबी ५४.५० इंच | रुंदी २८.५० इंच | उंची १३ इंच
**३६. मीरगाव :** मुख्यस्थान - लांबी ५१ इंच | रुंदी ३१.५० इंच | उंची १८ इंच`,
    explanation: `गोदावरी आणि प्रवरा नदीकाठच्या पावन गावांमध्ये स्वामींनी केलेल्या पदभ्रमणातील स्थानांची गल्फा मापे.`
  },
  {
    id: 'sgm_ch9',
    bookId: 'sthan_galfa_maap',
    number: 9,
    title: 'मराठवाडा व खान्देश परिसर (पांढरी ते नांदुरमधमेश्वर)',
    titleEn: 'Marathwada & Khandesh Region (Pandhari to Nandur Madhameshwar)',
    content: `॥ श्री चक्रधराय नमः ॥

**३७. पांढरी (जालना जिल्हा) :** मुख्यस्थान - लांबी ४७ इंच | रुंदी २२.५० इंच | उंची २२.५० इंच
**३८. साडेगाव (जालना जिल्हा) :** मुख्यस्थान - लांबी २६.५० इंच | रुंदी १७ इंच | उंची २० इंच
**३९. जोगलादेवी (बीड जिल्हा) :** मुख्यस्थान - लांबी ४०.५० इंच | रुंदी २८ इंच | उंची २०.५० इंच
**४०. बागपिंपळगाव (बीड जिल्हा) :** मुख्यस्थान - लांबी ४५.५० इंच | रुंदी २३.५० इंच | उंची २५ इंच
**४१. माणिकदंड (बीड जिल्हा) :**
* मुख्यस्थान - लांबी २३.५० इंच | रुंदी २४ इंच | उंची २० इंच
* (शेतामध्ये) - लांबी ३८ इंच | रुंदी २३ इंच | उंची ०८ इंच
**४२. ढाकेफळ (जालना जिल्हा) :**
* मुख्यस्थान - लांबी ३१ इंच | रुंदी १६.५० इंच | उंची २१ इंच
* स्थान क्र. २ - लांबी ५२ इंच | रुंदी २४.५० इंच | उंची २२ इंच
**४३. आहेरमल (नाशिक जिल्हा) :** मुख्यस्थान - लांबी ३८.५० इंच | रुंदी २६ इंच | उंची २० इंच
**४४. वाघळी (जळगाव जिल्हा - खान्देश) :** मुख्यस्थान - लांबी ७९ इंच | रुंदी ३१ इंच | उंची २२ इंच
**४५. नांदुरमधमेश्वर (नाशिक जिल्हा) :**
* मुख्यस्थान - लांबी ६० इंच | रुंदी २४ इंच | उंची २४ इंच
* स्थान क्र. २ - लांबी ३६ इंच | रुंदी २४ इंच | उंची २४ इंच
* स्थान क्र. ३ - लांबी ३६ इंच | रुंदी २४ इंच | उंची २४ इंच`,
    explanation: `बीड, जालना, नाशिक व जळगाव जिल्ह्यातील स्थानांची नोंद.`
  },
  {
    id: 'sgm_ch10',
    bookId: 'sthan_galfa_maap',
    number: 10,
    title: 'वालसांगवी व मासरूळ (सविस्तर ११ स्थाने)',
    titleEn: 'Valsangvi & Masrul (Detailed 11 Sthans)',
    content: `॥ श्री चक्रधराय नमः ॥

**४६. वालसांगवी (जालना जिल्हा - ५ स्थाने)**
* स्थान क्र. १ : लांबी ६२ इंच | रुंदी ३० इंच | उंची ३५ इंच
* स्थान क्र. २ : लांबी ३३ इंच | रुंदी २६ इंच | उंची २५ इंच
* स्थान क्र. ३ : लांबी ३९ इंच | रुंदी २७ इंच | उंची २५ इंच
* स्थान क्र. ४ : लांबी ५० इंच | रुंदी ३४ इंच | उंची २५ इंच
* स्थान क्र. ५ : लांबी ३० इंच | रुंदी २५ इंच | उंची २५ इंच

**४७. मासरूळ (बुलढाणा जिल्हा - ६ स्थाने)**
* स्थान क्र. १ : लांबी ७५ इंच | रुंदी ४० इंच | उंची २३ इंच
* स्थान क्र. २ : लांबी ३९.५० इंच (३९.१/२) | रुंदी २९ इंच | उंची २१ इंच
* स्थान क्र. ३ : लांबी ३२ इंच | रुंदी ३० इंच | उंची १४ इंच
* स्थान क्र. ४ : लांबी ४५ इंच | रुंदी ३१ इंच | उंची १३ इंच
* स्थान क्र. ५ : लांबी ४२ इंच | रुंदी ३२ इंच | उंची १२ इंच
* स्थान क्र. ६ : लांबी ४० इंच | रुंदी २९ इंच | उंची १८ इंच`,
    explanation: `वालसांगवी व मासरूळ या दोन्ही गावांमधील सर्व स्थानांची गल्फा मापे.`
  }
];

export const pramukhSthanancheGalfeBook = sthanGalfaMaapBook;
export const pramukhSthanancheGalfeChapters = sthanGalfaMaapChapters;
