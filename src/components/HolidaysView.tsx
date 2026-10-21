import React, { useState } from 'react';
import { Calendar, Search, Sparkles, Sun, Gift, Heart, Shield, CheckCircle2, Building, Flag, MapPin, Filter } from 'lucide-react';

interface HolidaysViewProps {
  lang: 'mr' | 'hi' | 'en';
}

export interface HolidayItem {
  id: string;
  date: string;
  day: string;
  monthId: string;
  monthNameMr: string;
  monthNameHi: string;
  monthNameEn: string;
  titleMr: string;
  titleHi: string;
  titleEn: string;
  category: 'public' | 'religious' | 'mahanubhav' | 'bank';
  descriptionMr: string;
  descriptionHi: string;
  descriptionEn: string;
  isMandatory?: boolean;
}

export const holidaysData: HolidayItem[] = [
  {
    id: 'h1',
    date: '१५ जानेवारी २०२६',
    day: 'गुरुवार',
    monthId: 'jan',
    monthNameMr: 'जानेवारी',
    monthNameHi: 'जनवरी',
    monthNameEn: 'January',
    titleMr: 'मकर संक्रांती',
    titleHi: 'मकर संक्रांति',
    titleEn: 'Makar Sankranti',
    category: 'religious',
    descriptionMr: 'सूर्याचे धनू राशीतून मकर राशीत संक्रमण. तीळगुळ वाटप व स्नेहाचा सण.',
    descriptionHi: 'सूर्य का मकर राशि में प्रवेश। तिल-गुड़ वितरण व हर्षोल्लास का पर्व।',
    descriptionEn: 'Harvest festival celebrating the sun transition into Capricorn.'
  },
  {
    id: 'h2',
    date: '२६ जानेवारी २०२६',
    day: 'सोमवार',
    monthId: 'jan',
    monthNameMr: 'जानेवारी',
    monthNameHi: 'जनवरी',
    monthNameEn: 'January',
    titleMr: 'प्रजासत्ताक दिन',
    titleHi: 'गणतंत्र दिवस',
    titleEn: 'Republic Day',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'भारताचा राष्ट्रीय प्रजासत्ताक दिन. ध्वजारोहण व राष्ट्रवंदन.',
    descriptionHi: 'भारत का राष्ट्रीय गणतंत्र दिवस। ध्वजारोहण व राष्ट्रीय समारोह।',
    descriptionEn: 'National holiday marking the adoption of the Constitution of India.'
  },
  {
    id: 'h3',
    date: '१५ फेब्रुवारी २०२६',
    day: 'रविवार',
    monthId: 'feb',
    monthNameMr: 'फेब्रुवारी',
    monthNameHi: 'फरवरी',
    monthNameEn: 'February',
    titleMr: 'महाशिवरात्री',
    titleHi: 'महाशिवरात्रि',
    titleEn: 'Mahashivratri',
    category: 'religious',
    descriptionMr: 'भगवान श्री शिवशंकराची महापूजा, उपवास व जागरणाचा दिवस.',
    descriptionHi: 'भगवान शिव की विशेष पूजा, उपवास व जागरण दिवस।',
    descriptionEn: 'Sacred festival celebrating Shiva, observed with fasting and worship.'
  },
  {
    id: 'h4',
    date: '१९ फेब्रुवारी २०२६',
    day: 'गुरुवार',
    monthId: 'feb',
    monthNameMr: 'फेब्रुवारी',
    monthNameHi: 'फरवरी',
    monthNameEn: 'February',
    titleMr: 'छत्रपती शिवाजी महाराज जयंती',
    titleHi: 'छत्रपति शिवाजी महाराज जयंती',
    titleEn: 'Chhatrapati Shivaji Maharaj Jayanti',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'महाराष्ट्राचे आराध्य दैवत हिंदवी स्वराज्याचे संस्थापक शिवछत्रपतींची जयंती.',
    descriptionHi: 'हिंदवी स्वराज्य के संस्थापक छत्रपति शिवाजी महाराज जयंती।',
    descriptionEn: 'State holiday celebrating the birth anniversary of Shivaji Maharaj.'
  },
  {
    id: 'h5',
    date: '३ मार्च २०२६',
    day: 'मंगळवार',
    monthId: 'mar',
    monthNameMr: 'मार्च',
    monthNameHi: 'मार्च',
    monthNameEn: 'March',
    titleMr: 'धुलीवंदन (होळी)',
    titleHi: 'धुलेंडी / होली',
    titleEn: 'Dhulivandan / Holi',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'रंगांचा व आनंदाचा सण. धूलिवंदन व वसंतोत्सवाची सार्वजनिक सुट्टी.',
    descriptionHi: 'रंगों व उल्लास का त्योहार। धूलिवंदन सार्वजनिक अवकाश।',
    descriptionEn: 'Festival of Colors celebrated with joy and spring festivities.'
  },
  {
    id: 'h6',
    date: '१९ मार्च २०२६',
    day: 'गुरुवार',
    monthId: 'mar',
    monthNameMr: 'मार्च',
    monthNameHi: 'मार्च',
    monthNameEn: 'March',
    titleMr: 'गुढीपाडवा (मराठी नववर्ष)',
    titleHi: 'गुड़ी पड़वा (नव संवत्सर)',
    titleEn: 'Gudi Padwa (New Year)',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'महाराष्ट्रीय हिंदू नववर्षाची सुरुवात. गुढी उभारून नवीन वर्षाचा प्रारंभ.',
    descriptionHi: 'महाराष्ट्र में हिंदू नववर्ष का शुभारंभ। गुड़ी स्थापना व मिष्ठान।',
    descriptionEn: 'Traditional New Year day for Maharashtrians.'
  },
  {
    id: 'h7',
    date: '२७ मार्च २०२६',
    day: 'शुक्रवार',
    monthId: 'mar',
    monthNameMr: 'मार्च',
    monthNameHi: 'मार्च',
    monthNameEn: 'March',
    titleMr: 'श्रीराम नवमी',
    titleHi: 'श्रीराम नवमी',
    titleEn: 'Shri Ram Navami',
    category: 'religious',
    descriptionMr: 'मर्यादा पुरुषोत्तम प्रभू श्री रामचंद्रांचा जन्मदिवस उत्सव.',
    descriptionHi: 'प्रभु श्री राम का पावन जन्मोत्सव।',
    descriptionEn: 'Celebration of the birth of Lord Shri Rama.'
  },
  {
    id: 'h8',
    date: '३० मार्च २०२६',
    day: 'सोमवार',
    monthId: 'mar',
    monthNameMr: 'मार्च',
    monthNameHi: 'मार्च',
    monthNameEn: 'March',
    titleMr: 'महावीर जयंती',
    titleHi: 'महावीर जयंती',
    titleEn: 'Mahavir Jayanti',
    category: 'public',
    descriptionMr: 'जैन धर्माचे २४ वे तीर्थंकर भगवान महावीर यांचा जन्मकल्याणक दिन.',
    descriptionHi: 'भगवान महावीर स्वामी का पावन जन्म कल्याणक।',
    descriptionEn: 'Birth anniversary of Bhagwan Mahavir.'
  },
  {
    id: 'h9',
    date: '३ एप्रिल २०२६',
    day: 'शुक्रवार',
    monthId: 'apr',
    monthNameMr: 'एप्रिल',
    monthNameHi: 'अप्रैल',
    monthNameEn: 'April',
    titleMr: 'गुड फ्रायडे',
    titleHi: 'गुड फ्राइडे',
    titleEn: 'Good Friday',
    category: 'public',
    descriptionMr: 'प्रभू येशू ख्रिस्तांच्या बलिदानाचा स्मृती दिन.',
    descriptionHi: 'प्रभु ईसा मसीह के बलिदान का स्मरण दिवस।',
    descriptionEn: 'Christian holiday commemorating the crucifixion of Jesus.'
  },
  {
    id: 'h10',
    date: '१४ एप्रिल २०२६',
    day: 'मंगळवार',
    monthId: 'apr',
    monthNameMr: 'एप्रिल',
    monthNameHi: 'अप्रैल',
    monthNameEn: 'April',
    titleMr: 'डॉ. बाबासाहेब आंबेडकर जयंती',
    titleHi: 'डॉ. बाबासाहेब आंबेडकर जयंती',
    titleEn: 'Dr. B.R. Ambedkar Jayanti',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'भारतीय राज्यघटनेचे शिल्पकार भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती.',
    descriptionHi: 'भारतीय संविधान के निर्माता डॉ. बी.आर. आंबेडकर जयंती।',
    descriptionEn: 'Commemorating the birth anniversary of Dr. B. R. Ambedkar.'
  },
  {
    id: 'h11',
    date: '२० एप्रिल २०२६',
    day: 'सोमवार',
    monthId: 'apr',
    monthNameMr: 'एप्रिल',
    monthNameHi: 'अप्रैल',
    monthNameEn: 'April',
    titleMr: 'रमझान ईद (ईद-उल-फितर)',
    titleHi: 'ईद-उल-फ़ितर',
    titleEn: 'Eid-ul-Fitr',
    category: 'public',
    descriptionMr: 'मुस्लिम बांधवांचा पवित्र सण. रमझान महिन्याच्या सांगतेचा आनंदोत्सव.',
    descriptionHi: 'मुस्लिम समुदाय का पवित्र त्योहार। ईद का पावन अवसर।',
    descriptionEn: 'Islamic festival celebrating the end of Ramadan fasting.'
  },
  {
    id: 'h12',
    date: '१ मे २०२६',
    day: 'शुक्रवार',
    monthId: 'may',
    monthNameMr: 'मे',
    monthNameHi: 'मई',
    monthNameEn: 'May',
    titleMr: 'महाराष्ट्र दिन व कामगार दिन',
    titleHi: 'महाराष्ट्र दिवस व श्रमिक दिवस',
    titleEn: 'Maharashtra Day & Labor Day',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'महाराष्ट्र राज्य निर्मिती दिन व आंतरराष्ट्रीय कामगार दिन.',
    descriptionHi: 'महाराष्ट्र राज्य स्थापना दिवस व अंतर्राष्ट्रीय श्रमिक दिवस।',
    descriptionEn: 'Statehood day of Maharashtra and International Workers\' Day.'
  },
  {
    id: 'h13',
    date: '३१ मे २०२६',
    day: 'रविवार',
    monthId: 'may',
    monthNameMr: 'मे',
    monthNameHi: 'मई',
    monthNameEn: 'May',
    titleMr: 'बुद्ध पौर्णिमा',
    titleHi: 'बुद्ध पूर्णिमा',
    titleEn: 'Buddha Purnima',
    category: 'public',
    descriptionMr: 'तथागत भगवान बुद्ध यांचा जन्म, ज्ञानप्राप्ती व महापरिनिर्वाण दिन.',
    descriptionHi: 'भगवान बुद्ध का जन्मोत्सव व महापरिनिर्वाण दिवस।',
    descriptionEn: 'Festival commemorating the birth and enlightenment of Buddha.'
  },
  {
    id: 'h14',
    date: '२७ जून २०२६',
    day: 'शनिवार',
    monthId: 'jun',
    monthNameMr: 'जून',
    monthNameHi: 'जून',
    monthNameEn: 'June',
    titleMr: 'बकरी ईद (ईद-उल-झुहा)',
    titleHi: 'ईद-उल-ज़ुहा (बकरीद)',
    titleEn: 'Bakri Eid (Eid-al-Adha)',
    category: 'public',
    descriptionMr: 'त्याग व समर्पणाचा पवित्र मुस्लिम सण.',
    descriptionHi: 'त्याग व समर्पण का पवित्र त्योहार।',
    descriptionEn: 'Islamic holiday celebrating faith and sacrifice.'
  },
  {
    id: 'h15',
    date: '१५ ऑगस्ट २०२६',
    day: 'शनिवार',
    monthId: 'aug',
    monthNameMr: 'ऑगस्ट',
    monthNameHi: 'अगस्त',
    monthNameEn: 'August',
    titleMr: 'स्वातंत्र्य दिन',
    titleHi: 'स्वतंत्रता दिवस',
    titleEn: 'Independence Day',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'भारताचा ७९ वा स्वातंत्र्य दिन. राष्ट्रीय ध्वजारोहण व सोहळा.',
    descriptionHi: 'भारत का ७९वां स्वतंत्रता दिवस। राष्ट्रीय ध्वजारोहण।',
    descriptionEn: 'National holiday marking Indian independence from British rule.'
  },
  {
    id: 'h16',
    date: '२८ ऑगस्ट २०२६',
    day: 'शुक्रवार',
    monthId: 'aug',
    monthNameMr: 'ऑगस्ट',
    monthNameHi: 'अगस्त',
    monthNameEn: 'August',
    titleMr: 'श्रीकृष्ण जन्माष्टमी',
    titleHi: 'श्रीकृष्ण जन्माष्टमी',
    titleEn: 'Shri Krishna Janmashtami',
    category: 'mahanubhav',
    descriptionMr: 'महानुभाव पंथाचे आराध्य दैवत योगेश्वर भगवान श्रीकृष्णांचा अवतार दिन.',
    descriptionHi: 'भगवान श्रीकृष्ण का पावन प्राकट्य पर्व।',
    descriptionEn: 'Birth celebration of Lord Shri Krishna, supreme deity of Mahanubhav sect.'
  },
  {
    id: 'h17',
    date: '१४ सप्टेंबर २०२६',
    day: 'सोमवार',
    monthId: 'sep',
    monthNameMr: 'सप्टेंबर',
    monthNameHi: 'सितंबर',
    monthNameEn: 'September',
    titleMr: 'श्री गणेश चतुर्थी',
    titleHi: 'गणेश चतुर्थी',
    titleEn: 'Ganesh Chaturthi',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'विद्या व बुद्धीची देवता श्री गणरायाचे आगमन व प्रतिष्ठापना.',
    descriptionHi: 'भगवान गणेश जी का आगमन व स्थापना पर्व।',
    descriptionEn: 'Festival celebrating the arrival of Lord Ganesha.'
  },
  {
    id: 'h18',
    date: '२८ सप्टेंबर २०२६',
    day: 'सोमवार',
    monthId: 'sep',
    monthNameMr: 'सप्टेंबर',
    monthNameHi: 'सितंबर',
    monthNameEn: 'September',
    titleMr: 'सर्वज्ञ श्रीचक्रधर स्वामी अवतार दिन',
    titleHi: 'सर्वज्ञ श्रीचक्रधर स्वामी अवतार दिवस',
    titleEn: 'Shri Chakradhar Swami Avatar Din',
    category: 'mahanubhav',
    isMandatory: true,
    descriptionMr: 'महानुभाव पंथाचे संस्थापक सर्वज्ञ श्रीचक्रधर स्वामींचा पावन अवतार दिन सोहळा.',
    descriptionHi: 'महानुभाव पंथ संस्थापक सर्वज्ञ श्रीचक्रधर स्वामी का पावन प्राकट्य दिवस।',
    descriptionEn: 'Sacred Avatar Day of Lord Shri Chakradhar Swami, founder of Mahanubhav sect.'
  },
  {
    id: 'h19',
    date: '२ ऑक्टोबर २०२६',
    day: 'शुक्रवार',
    monthId: 'oct',
    monthNameMr: 'ऑक्टोबर',
    monthNameHi: 'अक्टूबर',
    monthNameEn: 'October',
    titleMr: 'महात्मा गांधी व लाल बहादूर शास्त्री जयंती',
    titleHi: 'महात्मा गांधी व लाल बहादुर शास्त्री जयंती',
    titleEn: 'Mahatma Gandhi Jayanti',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'राष्ट्रपिता महात्मा गांधी व माजी पंतप्रधान लाल बहादूर शास्त्री जयंती.',
    descriptionHi: 'राष्ट्रपिता महात्मा गांधी व लाल बहादुर शास्त्री जी की जयंती।',
    descriptionEn: 'National holiday honoring Mahatma Gandhi & Lal Bahadur Shastri.'
  },
  {
    id: 'h20',
    date: '२० ऑक्टोबर २०२६',
    day: 'मंगळवार',
    monthId: 'oct',
    monthNameMr: 'ऑक्टोबर',
    monthNameHi: 'अक्टूबर',
    monthNameEn: 'October',
    titleMr: 'विजयादशमी (दसरा)',
    titleHi: 'विजयादशमी (दशहरा)',
    titleEn: 'Vijayadashami (Dasara)',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'सत्याचा असत्यावर विजय. आपट्याची पाने (सोने) वाटप व सीमांघण.',
    descriptionHi: 'बुराई पर अच्छाई की विजय का प्रतीक दशहरा पर्व।',
    descriptionEn: 'Major festival symbolizing victory of good over evil.'
  },
  {
    id: 'h20_valmiki',
    date: '२६ ऑक्टोबर २०२६',
    day: 'सोमवार',
    monthId: 'oct',
    monthNameMr: 'ऑक्टोबर',
    monthNameHi: 'अक्टूबर',
    monthNameEn: 'October',
    titleMr: 'महर्षी वाल्मीकि जयंती व कोजागिरी पौर्णिमा',
    titleHi: 'महर्षि वाल्मीकि जयंती व कोजागिरी पूर्णिमा',
    titleEn: 'Maharshi Valmiki Jayanti & Kojagiri Purnima',
    category: 'public',
    isMandatory: false,
    descriptionMr: 'आद्यकवी महर्षी वाल्मीकि जयंती व अश्विन पौर्णिमा (कोजागिरी पौर्णिमा).',
    descriptionHi: 'महर्षि वाल्मीकि जयंती व आश्विन मास की कोजागिरी पूर्णिमा।',
    descriptionEn: 'Celebration of Maharshi Valmiki Jayanti and Kojagiri Purnima.'
  },
  {
    id: 'h20_chakrapani',
    date: '३ नोव्हेंबर २०२६',
    day: 'मंगळवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'श्रीचक्रपाणि प्रभू जन्मोत्सव',
    titleHi: 'श्रीचक्रपाणि प्रभु जन्मोत्सव',
    titleEn: 'Shri Chakrapani Prabhu Janmotsav',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'द्वितीय अवतार श्रीचक्रपाणि प्रभू पावन जन्मोत्सव, पहाटे जन्मकाळ, फलटण व अरणगाव पालखी सोहळा.',
    descriptionHi: 'द्वितीय अवतार श्री चक्रपाणि प्रभु का पावन जन्मोत्सव।',
    descriptionEn: 'Sacred birth anniversary celebration of Shri Chakrapani Prabhu.'
  },
  {
    id: 'h21',
    date: '८ नोव्हेंबर २०२६',
    day: 'रविवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'नरक चतुर्दशी / दिवाळी',
    titleHi: 'दीपावली (नरक चतुर्दशी)',
    titleEn: 'Diwali (Narak Chaturdashi)',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'दीपोत्सव व अभ्यंगस्नान. मांगल्याचा व प्रकाशाचा सण.',
    descriptionHi: 'दीपोत्सव व पावन प्रकाश पर्व।',
    descriptionEn: 'Festival of Lights celebrating brightness and joy.'
  },
  {
    id: 'h22',
    date: '९ नोव्हेंबर २०२६',
    day: 'सोमवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'लक्ष्मीपूजन',
    titleHi: 'लक्ष्मी पूजन',
    titleEn: 'Lakshmi Pujan',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'धनधान्य व समृद्धीची देवता माता लक्ष्मी व कुबेर पूजन.',
    descriptionHi: 'माता लक्ष्मी व कुबेर देव का पावन पूजन।',
    descriptionEn: 'Auspicious Lakshmi Pujan day during Diwali.'
  },
  {
    id: 'h23',
    date: '१० नोव्हेंबर २०२६',
    day: 'मंगळवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'बळीप्रतिपदा (दिवाळी पाडवा)',
    titleHi: 'बलीप्रतिपदा (दीपावली पड़वा)',
    titleEn: 'Balipratipada (Diwali Padwa)',
    category: 'public',
    descriptionMr: 'पति-पत्नीच्या प्रेमाचा पाडवा व राजा बळीचे स्मरण.',
    descriptionHi: 'दीपावली पड़वा व राजा बलि स्मरण दिवस।',
    descriptionEn: 'Celebration of marital harmony and King Bali during Diwali.'
  },
  {
    id: 'h23_bhaubeej',
    date: '११ नोव्हेंबर २०२६',
    day: 'बुधवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'भाऊबीज (यमद्वितीया)',
    titleHi: 'भाई दूज (यम द्वितीया)',
    titleEn: 'Bhai Dooj (Yama Dwitiya)',
    category: 'public',
    descriptionMr: 'बहीण-भावाच्या अतूट प्रेमाचा सण व महानुभावीय ज्येष्ठ मासारंभ.',
    descriptionHi: 'भाई-बहन के प्रेम का पावन पर्व व ज्येष्ठ मासारंभ।',
    descriptionEn: 'Celebration of bond between brothers and sisters.'
  },
  {
    id: 'h23_tulsi',
    date: '२० नोव्हेंबर २०२६',
    day: 'शुक्रवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'प्रबोधिनी एकादशी व तुलसी विवाह प्रारंभ',
    titleHi: 'प्रबोधिनी एकादशी व तुलसी विवाह',
    titleEn: 'Prabodhini Ekadashi & Tulsi Vivah',
    category: 'public',
    descriptionMr: 'स्मार्त प्रबोधिनी एकादशी व मंगल तुलसी विवाह सोहळा प्रारंभ.',
    descriptionHi: 'प्रबोधिनी एकादशी व तुलसी विवाह का मंगल प्रारंभ।',
    descriptionEn: 'Beginning of auspicious Tulsi Vivah wedding rituals.'
  },
  {
    id: 'h24',
    date: '२४ नोव्हेंबर २०२६',
    day: 'मंगळवार',
    monthId: 'nov',
    monthNameMr: 'नोव्हेंबर',
    monthNameHi: 'नवंबर',
    monthNameEn: 'November',
    titleMr: 'त्रिपुरी पौर्णिमा व गुरुनानक जयंती',
    titleHi: 'त्रिपुरी पूर्णिमा व गुरु नानक जयंती',
    titleEn: 'Tripuri Purnima & Guru Nanak Jayanti',
    category: 'public',
    descriptionMr: 'कार्तिक पौर्णिमा, त्रिपुरारी दीपदान, श्रीक्षेत्र सावखेडा व वडनेर भुजंग यात्रा तसेच गुरुनानक देव जी प्रकाश पर्व.',
    descriptionHi: 'त्रिपुरी पूर्णिमा, सावखेडा यात्रा व गुरु नानक देव जी का पावन प्रकाश पर्व।',
    descriptionEn: 'Tripuri Purnima and birth anniversary of Guru Nanak Dev Ji.'
  },
  {
    id: 'h24_ambedkar',
    date: '०६ डिसेंबर २०२६',
    day: 'रविवार',
    monthId: 'dec',
    monthNameMr: 'डिसेंबर',
    monthNameHi: 'दिसंबर',
    monthNameEn: 'December',
    titleMr: 'डॉ. बाबासाहेब आंबेडकर महापरिनिर्वाण दिन',
    titleHi: 'डॉ. बाबासाहेब आंबेडकर महापरिनिर्वाण दिवस',
    titleEn: 'Dr. B.R. Ambedkar Mahaparinirvan Diwas',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'भारतीय राज्यघटनेचे शिल्पकार भारतरत्न डॉ. बाबासाहेब आंबेडकर यांचा महापरिनिर्वाण स्मृती दिन.',
    descriptionHi: 'संविधान निर्माता भारतरत्न डॉ. बी.आर. आंबेडकर जी का महापरिनिर्वाण स्मृति दिवस।',
    descriptionEn: 'Remembrance day of Bharat Ratna Dr. B.R. Ambedkar.'
  },
  {
    id: 'h24_gita',
    date: '२० डिसेंबर २०२६',
    day: 'रविवार',
    monthId: 'dec',
    monthNameMr: 'डिसेंबर',
    monthNameHi: 'दिसंबर',
    monthNameEn: 'December',
    titleMr: 'श्रीमद भगवद्गीता जयंती व मोक्षदा एकादशी',
    titleHi: 'श्रीमद भगवद्गीता जयंती व मोक्षदा एकादशी',
    titleEn: 'Gita Jayanti & Mokshada Ekadashi',
    category: 'religious',
    descriptionMr: 'श्रीमद्भगवद्गीता प्राकट्य दिन, मोक्षदा एकादशी उपवास व महानुभाव विशेष प्रवचन सोहळा.',
    descriptionHi: 'श्रीमद्भगवद्गीता प्रकट दिवस व मोक्षदा एकादशी पावन पर्व।',
    descriptionEn: 'Advent of Srimad Bhagavad Gita and Mokshada Ekadashi.'
  },
  {
    id: 'h25',
    date: '२४ डिसेंबर २०२६',
    day: 'गुरुवार',
    monthId: 'dec',
    monthNameMr: 'डिसेंबर',
    monthNameHi: 'दिसंबर',
    monthNameEn: 'December',
    titleMr: 'श्रीदत्त जयंती / अवतार दिन',
    titleHi: 'श्रीदत्त जयंती / अवतार दिवस',
    titleEn: 'Shri Datta Jayanti',
    category: 'mahanubhav',
    isMandatory: true,
    descriptionMr: 'महानुभाव पंथाचे आद्य दैवत भगवान श्री दत्तात्रेयांचा अवतार उत्सव.',
    descriptionHi: 'भगवान श्री दत्तात्रेय जी का पावन प्राकट्य उत्सव।',
    descriptionEn: 'Sacred Avatar Celebration of Lord Dattatreya.'
  },
  {
    id: 'h26',
    date: '२५ डिसेंबर २०२६',
    day: 'शुक्रवार',
    monthId: 'dec',
    monthNameMr: 'डिसेंबर',
    monthNameHi: 'दिसंबर',
    monthNameEn: 'December',
    titleMr: 'ख्रिसमस (नाताळ)',
    titleHi: 'क्रिसमस (नाताल)',
    titleEn: 'Christmas',
    category: 'public',
    isMandatory: true,
    descriptionMr: 'प्रभू येशू ख्रिस्तांचा जन्मदिवस उत्सव व सार्वजनिक सुट्टी.',
    descriptionHi: 'प्रभु ईसा मसीह का पावन जन्मोत्सव।',
    descriptionEn: 'Christian festival celebrating the birth of Jesus Christ.'
  }
];

export const HolidaysView: React.FC<HolidaysViewProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const months = [
    { id: 'all', mr: 'सर्व महिने', hi: 'सभी महीने', en: 'All Months' },
    { id: 'jan', mr: 'जानेवारी', hi: 'जनवरी', en: 'January' },
    { id: 'feb', mr: 'फेब्रुवारी', hi: 'फरवरी', en: 'February' },
    { id: 'mar', mr: 'मार्च', hi: 'मार्च', en: 'March' },
    { id: 'apr', mr: 'एप्रिल', hi: 'अप्रैल', en: 'April' },
    { id: 'may', mr: 'मे', hi: 'मई', en: 'May' },
    { id: 'jun', mr: 'जून', hi: 'जून', en: 'June' },
    { id: 'aug', mr: 'ऑगस्ट', hi: 'अगस्त', en: 'August' },
    { id: 'sep', mr: 'सप्टेंबर', hi: 'सितंबर', en: 'September' },
    { id: 'oct', mr: 'ऑक्टोबर', hi: 'अक्टूबर', en: 'October' },
    { id: 'nov', mr: 'नोव्हेंबर', hi: 'नवंबर', en: 'November' },
    { id: 'dec', mr: 'डिसेंबर', hi: 'दिसंबर', en: 'December' }
  ];

  const categories = [
    { id: 'all', mr: 'सर्व सुट्ट्या', hi: 'सभी छुट्टियां', en: 'All Holidays' },
    { id: 'public', mr: 'सार्वजनिक व शासकीय', hi: 'सार्वजनिक व सरकारी', en: 'Public & Govt' },
    { id: 'mahanubhav', mr: 'महानुभाव पंथ पर्व', hi: 'महानुभाव पंथ पर्व', en: 'Mahanubhav Sect' },
    { id: 'religious', mr: 'धार्मिक व सण', hi: 'धार्मिक व त्यौहार', en: 'Religious Festivals' },
  ];

  const filteredHolidays = holidaysData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesMonth = selectedMonth === 'all' || item.monthId === selectedMonth;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      item.titleMr.toLowerCase().includes(query) ||
      item.titleHi.toLowerCase().includes(query) ||
      item.titleEn.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query) ||
      item.day.toLowerCase().includes(query) ||
      item.descriptionMr.toLowerCase().includes(query);

    return matchesCategory && matchesMonth && matchesSearch;
  });

  const totalPublicCount = holidaysData.filter(h => h.category === 'public').length;
  const totalMahanubhavCount = holidaysData.filter(h => h.category === 'mahanubhav').length;
  const totalReligiousCount = holidaysData.filter(h => h.category === 'religious').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-700 via-amber-600 to-purple-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-amber-300/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#FFD54F] font-bold text-xs font-devanagari border border-white/30 mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              {lang === 'mr' ? 'वर्षभर सुट्ट्यांची यादी २०२६' : lang === 'hi' ? 'वर्षभर छुट्टियों की सूची २०२६' : 'Yearly Holidays List 2026'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-devanagari tracking-wide">
              {lang === 'mr' ? 'सार्वजनिक, धार्मिक व पंथीय सुट्ट्या' : lang === 'hi' ? 'सार्वजनिक, धार्मिक व पंथीय छुट्टियां' : 'Public & Sacred Holidays'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 font-devanagari mt-1">
              {lang === 'mr' ? 'महाराष्ट्र शासन मान्यताप्राप्त सार्वजनिक सुट्ट्या व महानुभाव पंथाचे विशेष पर्व' : 'Government & Sectoral Holidays List'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shrink-0">
            <Gift className="w-5 h-5 text-amber-300" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-amber-200 font-devanagari">एकूण सुट्ट्या</div>
              <div className="font-extrabold font-sans text-base text-white">{holidaysData.length} दिवस</div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS COUNTER BAR */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 font-devanagari">सार्वजनिक सुट्ट्या</div>
            <div className="text-sm sm:text-lg font-black text-rose-900 font-sans">{totalPublicCount} दिवस</div>
          </div>
        </div>

        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 font-devanagari">महानुभाव पर्व</div>
            <div className="text-sm sm:text-lg font-black text-amber-900 font-sans">{totalMahanubhavCount} दिवस</div>
          </div>
        </div>

        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-purple-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 font-devanagari">धार्मिक व सण</div>
            <div className="text-sm sm:text-lg font-black text-purple-900 font-sans">{totalReligiousCount} दिवस</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black font-devanagari whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
                    : 'bg-amber-50 border border-amber-200 text-gray-700 hover:bg-amber-100'
                }`}
              >
                {cat[lang]}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'mr' ? 'सुट्टी किंवा सण शोधा...' : 'Search holiday...'}
              className="w-full pl-9 pr-3 py-1.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-devanagari focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-amber-100 no-scrollbar">
          <span className="text-xs font-bold text-gray-500 font-devanagari shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            महिना:
          </span>
          {months.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMonth(m.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-devanagari whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedMonth === m.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-900'
              }`}
            >
              {m[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* HOLIDAYS CARDS LIST */}
      <div className="space-y-3">
        {filteredHolidays.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 shadow-xs">
            <Gift className="w-10 h-10 text-amber-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-600 font-devanagari">
              {lang === 'mr' ? 'कोणतीही सुट्टी किंवा सण सापडला नाही' : 'No holidays found'}
            </p>
          </div>
        ) : (
          filteredHolidays.map((holiday) => {
            const isMahanubhav = holiday.category === 'mahanubhav';
            const isPublic = holiday.category === 'public';

            return (
              <div
                key={holiday.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isMahanubhav
                    ? 'border-amber-300 bg-gradient-to-r from-amber-50/70 to-orange-50/40 ring-1 ring-amber-200'
                    : isPublic
                    ? 'border-rose-200 hover:border-rose-300'
                    : 'border-purple-200'
                }`}
              >
                {/* Date Badge */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl text-center min-w-[90px] shrink-0 ${
                    isMahanubhav
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md'
                      : isPublic
                      ? 'bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-md'
                      : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md'
                  }`}>
                    <div className="text-xs font-black font-devanagari leading-tight">
                      {holiday.date.split(' ')[0]} {holiday.date.split(' ')[1]}
                    </div>
                    <div className="text-[10px] font-bold font-devanagari opacity-90 mt-0.5">
                      {holiday.day}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {isMahanubhav ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black font-devanagari">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          महानुभाव पंथ पर्व
                        </span>
                      ) : isPublic ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black font-devanagari">
                          <Flag className="w-3 h-3 text-rose-600" />
                          सार्वजनिक सुट्टी
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black font-devanagari">
                          <Heart className="w-3 h-3 text-purple-600" />
                          धार्मिक सण
                        </span>
                      )}

                      {holiday.isMandatory && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-devanagari">
                          शासकीय मान्यताप्राप्त
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-gray-900 font-devanagari">
                      {holiday[`title${lang === 'hi' ? 'Hi' : lang === 'en' ? 'En' : 'Mr'}`]}
                    </h3>
                    <p className="text-xs text-gray-600 font-devanagari mt-0.5 leading-relaxed">
                      {holiday[`description${lang === 'hi' ? 'Hi' : lang === 'en' ? 'En' : 'Mr'}`]}
                    </p>
                  </div>
                </div>

                {/* Right Indicator */}
                <div className="shrink-0 flex items-center justify-end">
                  <span className="text-xs font-bold font-mono px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                    {holiday.date.split(' ')[2] || '२०२६'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
