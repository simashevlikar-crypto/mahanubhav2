export interface GuruInfo {
  id: number;
  name: {
    mr: string;
    hi: string;
    en: string;
  };
  symbol: string; // Emoji representing the guru
  category: {
    mr: string;
    hi: string;
    en: string;
  };
  observation: {
    mr: string;
    hi: string;
    en: string;
  };
  lesson: {
    mr: string;
    hi: string;
    en: string;
  };
  explanation: {
    mr: string;
    hi: string;
    en: string;
  };
}

export const dattatreyaGurus: GuruInfo[] = [
  {
    id: 1,
    name: {
      mr: "पृथ्वी (Earth)",
      hi: "पृथ्वी (Earth)",
      en: "Earth"
    },
    symbol: "🌍",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "लोकांनी पृथ्वीवर अनेक आघात केले, तिच्यावर नांगर चालवला, खोदकाम केले, मलमूत्र विसर्जन केले, तरीही ती आपला संयम आणि शांतता कधीही सोडत नाही. उलट ती जगाला धान्य, फुले, फळे आणि आश्रय देऊन त्यांचे पोषण करत राहते.",
      hi: "लोगों ने पृथ्वी पर अनेक आघात किए, खुदाई की, हल चलाया, कूड़ा-कचरा डाला, फिर भी उसने अपना धैर्य और सहनशीलता कभी नहीं छोड़ी। इसके विपरीत, वह सबको अन्न, जल, फूल-फल और आश्रय देकर उनका निरंतर पोषण करती रहती है।",
      en: "People dig, plow, and dump waste on the Earth, yet she never loses her patience or composure. Instead, she selflessly provides crops, flowers, fruits, and shelter to nourish everyone."
    },
    lesson: {
      mr: "परोपकार आणि क्षमाशीलता. कितीही संकटे आली किंवा लोकांनी अपशब्द बोलले, तरी साधकाने स्वतःचा सहनशील आणि क्षमाशील स्वभाव कधीही सोडू नये आणि प्रत्येकाचे कल्याण करावे.",
      hi: "सहनशीलता, क्षमा और परोपकार। साधक पर चाहे कितनी भी विपत्तियां आएं या लोग कैसा भी व्यवहार करें, उसे अपने धैर्य, सहनशीलता और परोपकार के स्वभाव को कभी नहीं छोड़ना चाहिए।",
      en: "Patience, forgiveness, and benevolence. No matter how many hardships arise or how poorly people treat a seeker, they should never lose their forgiving nature and should always strive for the welfare of others."
    },
    explanation: {
      mr: "पृथ्वी आपल्याला शिकवते की, निंदा किंवा स्तुतीने विचलित न होता आपले कर्तव्य करत राहावे. जीवनातील सर्व त्रासांना हसतमुखाने सहन करून इतरांना आनंद देणे हाच खरा धर्म आहे.",
      hi: "पृथ्वी हमें सिखाती है कि निंदा या प्रशंसा से विचलित हुए बिना अपना कर्तव्य करते रहना चाहिए। जीवन के सभी कष्टों को मुस्कुराते हुए सहना और दूसरों को सुख देना ही सच्चा धर्म है।",
      en: "Earth teaches us to perform our duties without being disturbed by praise or blame. Smilingly enduring all pain while giving joy to others is the true essence of righteousness."
    }
  },
  {
    id: 2,
    name: {
      mr: "वायू (Wind / Air)",
      hi: "वायु (Wind / Air)",
      en: "Wind"
    },
    symbol: "💨",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "वायू हा सुगंधित फुलांवरून किंवा दुर्गंधीयुक्त कचऱ्यावरूनही वाहतो. पण तो स्वतः सुगंध किंवा दुर्गंधीने मलीन होत नाही. तो दोन्ही गंधांमध्ये कधीही अडकून पडत नाही आणि सतत वाहत राहतो.",
      hi: "वायु सुवासित फूलों के ऊपर से भी बहती है और दुर्गंधयुक्त कचरे के ऊपर से भी। परंतु वह स्वयं सुगंध या दुर्गंध से मलीन नहीं होती। वह दोनों में बिना फंसे अपनी पवित्रता बनाए रखती है और निरंतर गतिशील रहती है।",
      en: "The wind blows over both fragrant flowers and foul-smelling waste, yet it never becomes permanently stained by either. It maintains its inherent purity and continues to move freely."
    },
    lesson: {
      mr: "अनासक्ती आणि अलिप्तता. साधकाने या संसारात राहूनही चांगल्या-वाईट विषयांमध्ये अडकू नये. आपल्या इंद्रियांना जगाच्या विषयात मुक्त ठेवले तरी मनात आसक्ती निर्माण होऊ देऊ नये.",
      hi: "अनासक्ति और अलिप्तता। साधक को इस संसार में रहते हुए भी अच्छे-बुरे विषयों में नहीं फंसना चाहिए। अपनी इंद्रियों को विषयों में तटस्थ रखना चाहिए और मन में किसी के प्रति मोह उत्पन्न नहीं होने देना चाहिए।",
      en: "Non-attachment and neutrality. A seeker should live in this world without being entangled in pleasant or unpleasant sensory experiences, remaining internally unattached."
    },
    explanation: {
      mr: "वायू आपल्याला शिकवतो की संन्याशाचे किंवा साधकाचे मन मोकळे आणि निरपेक्ष असावे. जगात अनेक प्रकारचे लोक मिळतील, पण कोणाच्याही मोहात किंवा रागात स्वतःला अडकवून न घेता नेहमी पुढे चालत राहावे.",
      hi: "वायु हमें सिखाती है कि साधक का मन सदैव मुक्त और निरपेक्ष होना चाहिए। संसार में हर तरह के लोग मिलेंगे, लेकिन किसी के प्रति मोह या द्वेष रखे बिना निरंतर आत्ममार्ग पर आगे बढ़ते रहना चाहिए।",
      en: "Wind teaches us that a seeker's mind should be free and unconditioned. While interacting with all types of people, one must move forward on the spiritual path without attachment or aversion."
    }
  },
  {
    id: 3,
    name: {
      mr: "आकाश (Space / Sky)",
      hi: "आकाश (Space / Sky)",
      en: "Space"
    },
    symbol: "🌌",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "आकाश हे सर्वव्यापी आहे. आकाशात ढग येतात, वीज कडकडते, वादळ येते आणि निघून जाते. या सर्व घडामोडींनी आकाश कधीही रंगत नाही, बदलत नाही किंवा डागाळत नाही. ते नेहमी अनंत, अलिप्त आणि शुद्ध असते.",
      hi: "आकाश सर्वव्यापी है। आकाश में बादल आते हैं, बिजली कड़कती है, आंधी-तूफान आते हैं और चले जाते हैं। इन सब हलचलों से आकाश कभी प्रभावित या दूषित नहीं होता। वह सदैव अनंत, अलिप्त और शुद्ध रहता है।",
      en: "Space is omnipresent. Clouds gather, lightning strikes, and storms pass through it, yet space remains entirely unaffected, unstained, and pure."
    },
    lesson: {
      mr: "आत्म्याचे सर्वव्यापी आणि निर्लेप स्वरूप. आपले शरीर आणि मन जरी सुखा-दुःखाच्या ढगांनी घेरलेले असले, तरी आपल्यातील मूळ 'आत्मा' हा आकाशासारखा अलिप्त, शुद्ध आणि अमर आहे.",
      hi: "आत्मा का सर्वव्यापी और निर्लेप स्वरूप। हमारा शरीर और मन भले ही सुख-दुख के बादलों से घिरा हो, परंतु हमारे भीतर स्थित मूल 'आत्मा' आकाश की भांति अलिप्त, शुद्ध और शाश्वत है।",
      en: "The omnipresent and untouched nature of the soul. Although the body and mind may be surrounded by the clouds of joy and sorrow, the inner soul remains as detached and eternal as space."
    },
    explanation: {
      mr: "आकाशाकडून आपल्याला बोध मिळतो की संसारातील तात्पुरत्या सुख-दुःखाच्या लाटांनी आपण विचलित होऊ नये. स्वतःला नेहमी शरीरापलीकडील 'मुक्त आत्मा' मानून साक्षी भावाने जगावे.",
      hi: "आकाश से हमें यह सीख मिलती है कि संसार के क्षणिक सुख-दुखों से हमें विचलित नहीं होना चाहिए। स्वयं को सदैव शरीर से परे 'मुक्त आत्मा' मानकर साक्षी भाव से जीना चाहिए।",
      en: "From space, we learn not to be swayed by temporary worldly conditions. One should live with a witness-consciousness, identifying with the unbound spirit rather than the mortal vessel."
    }
  },
  {
    id: 4,
    name: {
      mr: "जल (Water)",
      hi: "जल (Water)",
      en: "Water"
    },
    symbol: "💧",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "जल हे स्वभावतः अत्यंत पवित्र, स्वच्छ, पारदर्शक आणि मधुर असते. ते कोणाचाही भेदभाव न करता सर्वांची तहान भागवते, मळ धुवून काढते आणि सर्वांना जीवन व प्रफुल्लितता प्रदान करते.",
      hi: "जल स्वभाव से अत्यंत पवित्र, स्वच्छ, पारदर्शी और मधुर होता है। वह बिना किसी भेदभाव के सभी की प्यास बुझाता है, गंदगी को साफ करता है और सबमें नवजीवन तथा शीतलता का संचार करता है।",
      en: "Water is naturally pure, clear, transparent, and sweet. It quenches everyone's thirst without discrimination, cleanses impurities, and sustains life."
    },
    lesson: {
      mr: "पवित्रता, नम्रता आणि कल्याणकारी वृत्ती. साधकाचे चारित्र्य नेहमी पाण्यासारखे स्वच्छ असावे. त्याच्या वाणीत आणि वर्तनात गोडवा असावा आणि त्याने संपर्कात येणाऱ्या प्रत्येक जीवाला शांतता द्यावी.",
      hi: "पवित्रता, कोमलता और लोक-कल्याण। साधक का चरित्र जल की भांति स्वच्छ और निर्मल होना चाहिए। उसकी वाणी में मधुरता होनी चाहिए और जो भी उसके संपर्क में आए, उसका अंतःकरण शांत होना चाहिए।",
      en: "Purity, humility, and absolute benevolence. A seeker's character should be as crystal clear as water, their words sweet and comforting, bringing peace to any soul they encounter."
    },
    explanation: {
      mr: "ज्याप्रमाणे पाणी सदैव खालच्या दिशेने वाहते (नम्रता दर्शवते) आणि शेवटी सागराला मिळते, तसेच माणसाने कितीही मोठे पद मिळवले तरी नम्र राहावे आणि आपली बुद्धी ईश्वराकडे लावावी.",
      hi: "जिस प्रकार जल सदैव नीचे की ओर बहता है (जो नम्रता का प्रतीक है) और अंत में सागर में मिल जाता है, उसी प्रकार मनुष्य को सदैव विनम्र रहना चाहिए और अपनी बुद्धि को परमात्मा में लीन करना चाहिए।",
      en: "Just as water always flows downward (representing humility) and eventually merges with the ocean, a person should remain humble regardless of their status and merge their consciousness with the Divine."
    }
  },
  {
    id: 5,
    name: {
      mr: "अग्नी (Fire)",
      hi: "अग्नि (Fire)",
      en: "Fire"
    },
    symbol: "🔥",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "अग्नी प्रत्येक लाकूड किंवा वस्तूला भस्म करून स्वतःमध्ये सामावून घेतो आणि स्वतः नेहमी देदीप्यमान व पवित्र राहतो. अग्नी स्वतः अंधार नाहीसा करतो आणि थंडीत ऊब देतो.",
      hi: "अग्नि सूखी-गीली सभी लकड़ियों और वस्तुओं को भस्म कर उन्हें अपने समान बना लेती है, परंतु वह स्वयं कभी अपवित्र नहीं होती। वह अंधकार को दूर कर प्रकाश और शीत में उष्णता देती है।",
      en: "Fire consumes diverse firewood, transforming everything into its own luminous essence, yet remaining entirely pure. It dispels darkness and provides warmth."
    },
    lesson: {
      mr: "ज्ञान आणि तपाचे तेज. साधकाने आपल्या ज्ञानरूपी अग्नीने सर्व वाईट वासना आणि अज्ञान भस्म करावे. त्याच्याजवळ जे काही ज्ञान येईल, ते त्याने पवित्र करून घ्यावे.",
      hi: "ज्ञान और तपस्या का तेज। साधक को अपने ज्ञानरूपी अग्नि से सभी वासनाओं और अज्ञान को भस्म कर देना चाहिए। वह जो भी ग्रहण करे, उसे पवित्र कर दे।",
      en: "The radiance of knowledge and austerity. A seeker should burn away all impurities, bad desires, and ignorance using the fire of spiritual wisdom."
    },
    explanation: {
      mr: "अग्नीची ज्वाला नेहमी वरच्या दिशेने झेपावते. यावरून माणसाने आपले विचार आणि ध्येय सदैव उच्च ठेवावे, परिस्थिती कशीही असली तरी अधोगतीकडे जाऊ नये, हा महत्त्वाचा धडा मिळतो.",
      hi: "अग्नि की लौ सदैव ऊपर की ओर उठती है। इससे सीख मिलती है कि मनुष्य को अपने विचार और लक्ष्य सदैव ऊंचे रखने चाहिए, चाहे परिस्थितियां कैसी भी हों, कभी नीचे की ओर नहीं गिरना चाहिए।",
      en: "The flame of fire always points upward. This teaches us that a person's thoughts and aspirations should always remain lofty, never succumbing to degradation under any circumstances."
    }
  },
  {
    id: 6,
    name: {
      mr: "चंद्र (Moon)",
      hi: "चन्द्र (Moon)",
      en: "Moon"
    },
    symbol: "🌙",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "चंद्राचा आकार शुक्लपक्षात वाढत जातो आणि कृष्णपक्षात कमी होत जातो (अमावस्या व पौर्णिमा). पण यामुळे चंद्राच्या मूळ तत्त्वात किंवा स्वरूपात कोणतीही घट किंवा वाढ होत नाही. तो नित्य समानच राहतो.",
      hi: "चंद्रमा का आकार शुक्लपक्ष में बढ़ता है और कृष्णपक्ष में घटता जाता है। परंतु इससे चंद्रमा के वास्तविक रूप या अस्तित्व में कोई कमी-बढ़ती नहीं होती। वह सदैव एक समान रहता है।",
      en: "The moon waxes and wanes through different phases, yet the actual moon itself remains whole and unchanged in its essence throughout the cycles."
    },
    lesson: {
      mr: "देहाच्या अवस्था आणि आत्म्याची नित्यता. बालपण, तारुण्य, वृद्धत्व आणि मृत्यू या केवळ शरीराच्या अवस्था आहेत. आपल्या शरीरात असणारा 'आत्मा' कधीही वाढत नाही किंवा कमी होत नाही; तो सदैव स्थिर व अविनाशी असतो.",
      hi: "देह की अवस्थाएं और आत्मा की शाश्वतता। बचपन, जवानी, बुढ़ापा और मृत्यु केवल शरीर की अवस्थाएं हैं। हमारे भीतर निवास करने वाली 'आत्मा' न कभी बढ़ती है और न घटती है, वह सदैव अचल और अविनाशी है।",
      en: "The phases of the body vs. the changelessness of the soul. Childhood, youth, old age, and decay are phases that belong only to the physical body. The soul is changeless and indestructible."
    },
    explanation: {
      mr: "चंद्राकडून आपल्याला संदेश मिळतो की शरीरात होणाऱ्या बदलांमुळे आपण दुःख करू नये. संसारात परिस्थिती बदलत राहील, पण आपल्या आत्मिक आनंदाला धक्का बसू देऊ नये.",
      hi: "चंद्रमा से हमें यह संदेश मिलता है कि शरीर में होने वाले परिवर्तनों से हमें दुखी नहीं होना चाहिए। संसार में परिस्थितियां बदलती रहेंगी, लेकिन अपने आत्मिक आनंद को स्थिर रखना चाहिए।",
      en: "The moon reminds us not to grieve over physical changes. Worldly situations will wax and wane, but our inner spiritual joy should remain steadfast."
    }
  },
  {
    id: 7,
    name: {
      mr: "सूर्य (Sun)",
      hi: "सूर्य (Sun)",
      en: "Sun"
    },
    symbol: "☀️",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "सूर्य आपल्या किरणांनी पृथ्वीवरील दूषित पाणी शोषून घेतो, पण स्वतः दूषित होत नाही. योग्य वेळ आल्यावर तोच पाणी शुद्ध आणि मधुर पाऊस म्हणून पुन्हा सृष्टीच्या कल्याणासाठी अर्पण करतो.",
      hi: "सूर्य अपनी किरणों से पृथ्वी से जल (नमी) सोखता है, लेकिन स्वयं अपवित्र नहीं होता। उचित समय आने पर वह उसी जल को वर्षा के रूप में संसार के कल्याण के लिए वापस लौटा देता है।",
      en: "The sun absorbs moisture from the Earth with its rays without becoming polluted. When the time is right, it showers it back as pure rain for the welfare of all life."
    },
    lesson: {
      mr: "अनासक्त भोग आणि त्याग. साधकाने जगातील विषय (सुख-साधने) केवळ तात्पुरत्या गरजेसाठी घ्यावेत, पण त्यात अडकू नये. वेळ येताच ते सर्व परोपकारासाठी आणि समाजाच्या कल्याणासाठी उदार हस्ते सोडून द्यावेत.",
      hi: "अनासक्त भोग और उदार दान। साधक को सांसारिक वस्तुओं का संग्रह केवल आवश्यकतानुसार करना चाहिए, उसमें आसक्त नहीं होना चाहिए। उचित समय पर उसे लोक-कल्याण के लिए उदारतापूर्वक अर्पित कर देना चाहिए।",
      en: "Detached consumption and generous charity. A seeker may accept resources from the world to sustain life, but must not cling to them, readily returning them to society when needed."
    },
    explanation: {
      mr: "सूर्य वेगवेगळ्या पाण्याच्या पात्रांमध्ये (तलाव, घागर) वेगवेगळा दिसतो, पण मूळ सूर्य एकच असतो. त्याचप्रमाणे, वेगवेगळ्या शरीरांमध्ये वेगळा भासणारा आत्मा मुळात एकच परमात्मा आहे.",
      hi: "सूर्य अलग-अलग जलपात्रों (तालाब, घड़े) में अलग-अलग दिखाई देता है, परंतु मूल सूर्य एक ही है। उसी प्रकार, विभिन्न शरीरों में अलग दिखाई देने वाली आत्मा वास्तव में एक ही परमात्मा का अंश है।",
      en: "The sun appears reflected as many in different pots of water, though there is only one sun. Similarly, the soul appears diverse in various bodies, but is ultimately one universal consciousness."
    }
  },
  {
    id: 8,
    name: {
      mr: "कपोत पक्षी (Pigeon)",
      hi: "कपोत पक्षी (Pigeon)",
      en: "Pigeon"
    },
    symbol: "🐦",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "एक कपोत (पारवा) आपल्या कुटुंबावर अती प्रेम करत होता. पारध्याने त्याच्या घरट्यातील पिलांना जाळ्यात पकडले. पिलांचा विलाप पाहून अत्यंत मोहापोटी आधी त्याची पत्नी आणि नंतर तो स्वतःही स्वतःहून जाळ्यात उडी मारून अडकला आणि सर्वांचा अंत झाला.",
      hi: "एक कबूतर अपने परिवार और बच्चों से अत्यधिक मोह रखता था। एक शिकारी ने उसके घोंसले के बच्चों को जाल में पकड़ लिया। बच्चों को तड़पता देख, मोह के वशीभूत होकर पहले उसकी पत्नी और फिर वह स्वयं भी जाल में कूद पड़ा और पूरे परिवार का अंत हो गया।",
      en: "A pigeon loved his family and nestlings excessively. When a hunter caught his chicks in a net, the mother pigeon, overwhelmed by grief, threw herself into the net, followed by the father. All perished."
    },
    lesson: {
      mr: "अति-आसक्ती आणि मोह हाच विनाशाचा मार्ग आहे. कौटुंबिक किंवा कोणत्याही नातेसंबंधात अति-गुंतणे माणसाच्या आध्यात्मिक पतनाचे आणि दुःखाचे कारण बनते.",
      hi: "अति-आसक्ति और मोह ही विनाश का कारण है। पारिवारिक या सांसारिक संबंधों में अत्यधिक लिप्त होना मनुष्य के पतन और दुखों का मुख्य कारण बनता है।",
      en: "Excessive attachment is the path to destruction. Getting overly entangled in relationships or material attachments leads to immense grief and spiritual downfall."
    },
    explanation: {
      mr: "प्रेम आणि कर्तव्य योग्य आहे, पण मोहाच्या आहारी जाऊन स्वतःचे विवेकबुद्धी गमावणे चुकीचे आहे. संसारात अलिप्त राहून कर्तव्य पार पाडणे हाच खरा शहाणपणा आहे.",
      hi: "प्रेम और कर्तव्य ठीक है, लेकिन मोह के वशीभूत होकर विवेक खो देना अनुचित है। संसार में अलिप्त रहकर अपने कर्तव्यों का पालन करना ही सच्ची बुद्धिमानी है।",
      en: "Love and duty are natural, but losing one's discrimination due to blind attachment is fatal. Loving with detatchment and executing duties with wisdom is the way."
    }
  },
  {
    id: 9,
    name: {
      mr: "अजगर (Python)",
      hi: "अजगर (Python)",
      en: "Python"
    },
    symbol: "🐍",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "अजगर कधीही भक्ष्यासाठी इकडेतिकडे धावत नाही. तो एका जागी पडून राहतो. दैवयोगाने किंवा निसर्ग नियमाने जे काही भक्ष्य त्याच्या तोंडात येईल, ते खाऊन तो तृप्त राहतो. काही न मिळाल्यास तो उपाशीही शांत राहतो.",
      hi: "अजगर कभी अपने भोजन के लिए इधर-उधर नहीं भटकता। वह एक स्थान पर शांत पड़ा रहता है। दैवयोग से जो कुछ भी उसे प्राप्त हो जाता है, उसे ग्रहण कर वह संतुष्ट रहता है। कुछ न मिलने पर भी वह विचलित नहीं होता।",
      en: "A python never runs around searching for prey. It remains in one place. Whatever food happens to come its way by destiny, it accepts and is satisfied. If nothing comes, it patiently fasts."
    },
    lesson: {
      mr: "संतोष आणि दैववादाचा स्वीकार (प्रारब्ध). माणसाने पोट भरण्यासाठी व संपत्तीसाठी अतोनात धावपळ न करता, देवाने जे आपल्या नशिबात ठेवले आहे त्यावर समाधानी असावे. अतिहाव सोडून संतुष्ट राहावे.",
      hi: "संतोष और संतोषी वृत्ति। मनुष्य को अपनी भूख या संग्रह के लिए अत्यधिक भागदौड़ करने के बजाय, ईश्वर और भाग्य द्वारा जो कुछ भी सहज रूप से प्राप्त हो, उसमें संतुष्ट रहना सीखना चाहिए।",
      en: "Contentment and acceptance of destiny. Instead of frantically running after material gains and luxuries, a person should remain content with whatever comes to them naturally."
    },
    explanation: {
      mr: "अजगराकडून आपल्याला 'अजगर वृत्ती' समजते, ज्याचा अर्थ आळस नव्हे, तर 'अति-लोभ आणि वासनेचा त्याग' करून शांत चित्ताने आत्मचिंतन करणे असा आहे.",
      hi: "अजगर से हमें 'अजगर वृत्ति' की सीख मिलती है, जिसका अर्थ आलस्य नहीं, बल्कि 'अति-लोभ और तृष्णा का त्याग' कर शांत मन से आत्मचिंतन में मग्न रहना है।",
      en: "The python teaches us the 'Ajagar Vritti', which does not mean laziness, but rather the renunciation of greed and anxiety, keeping the mind at peace for spiritual inquiry."
    }
  },
  {
    id: 10,
    name: {
      mr: "समुद्र (Ocean)",
      hi: "समुद्र (Ocean)",
      en: "Ocean"
    },
    symbol: "🌊",
    category: {
      mr: "पंचमहाभूत",
      hi: "पंचमहाभूत",
      en: "Elements"
    },
    observation: {
      mr: "पावसाळ्यात शेकडो नद्या दुथडी भरून समुद्राला येऊन मिळतात, तरीही समुद्र आपली मर्यादा सोडून कधीही बाहेर येत नाही. उन्हाळ्यात नद्या आटल्या तरी तो कधी कोरडा पडत नाही. तो नेहमी अथांग, गंभीर आणि शांत असतो.",
      hi: "वर्षा ऋतु में सैकड़ों नदियां उफान पर आकर समुद्र में मिलती हैं, फिर भी समुद्र अपनी मर्यादा को पार नहीं करता। ग्रीष्म ऋतु में नदियां सूख जाने पर भी वह कभी घटता नहीं। वह सदैव गंभीर और अचल रहता है।",
      en: "In the rainy season, countless overflowing rivers merge into the ocean, yet the ocean never breaches its boundaries. In summer, even if rivers dry up, the ocean does not shrink. It remains vast and calm."
    },
    lesson: {
      mr: "स्थितप्रज्ञता आणि मर्यादेचे पालन. माणसाच्या आयुष्यात कितीही सुख (नद्यांसारखे) आले तरी त्याने गर्वाने हुरळून जाऊ नये, आणि संकटे किंवा दुःख आले तरी धीर सोडू नये. नेहमी गंभीर व शांत राहावे.",
      hi: "स्थिरबुद्धि (स्थितप्रज्ञता) और मर्यादा। मनुष्य के जीवन में कितने भी सुख आएं, उसे घमंड से फूलना नहीं चाहिए, और कितने भी दुख आएं, उसे अपना धैर्य नहीं खोना चाहिए। सदैव शांत और गंभीर रहना चाहिए।",
      en: "Equanimity and self-control. No matter how much prosperity flows into a person's life, they should not become arrogant; and no matter how much adversity strikes, they must not lose heart."
    },
    explanation: {
      mr: "समुद्रासारखा विशाल आणि खोल विचार असणारा मनुष्य जगातील कोणत्याही सुख-दुःखाच्या वादळाने विचलित होत नाही. तो आपल्या मर्यादांचे पालन करतो.",
      hi: "समुद्र की भांति विशाल और गंभीर विचारों वाला व्यक्ति संसार के किसी भी सुख-दुख के थपेड़ों से विचलित नहीं होता। वह सदैव अपनी नैतिक मर्यादा में स्थिर रहता है।",
      en: "A person whose thoughts are as deep as the ocean is never shaken by the storm of worldly happiness or grief. They always adhere to their high principles."
    }
  },
  {
    id: 11,
    name: {
      mr: "पतंग कीटक (Moth)",
      hi: "पतंग कीटक (Moth)",
      en: "Moth"
    },
    symbol: "🦋",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "पतंग (एक कीटक) दिव्याच्या किंवा अग्नीच्या मोहक प्रकाशावर भुलतो. त्या सौंदर्याच्या आकर्षणात तो स्वतःचे भान गमावतो आणि थेट आगीत उडी घेतो, ज्यामुळे त्याचे पंख जळतात आणि तो मरण पावतो.",
      hi: "पतंगा (एक कीड़ा) दीपक या आग की चमकीली लौ पर मोहित हो जाता है। उस रूप-सौंदर्य के आकर्षण में वह अपना विवेक खो देता है और सीधे आग में कूद पड़ता है, जिससे जलकर उसकी मृत्यु हो जाती है।",
      en: "A moth is instantly attracted to the mesmerizing flame of a candle. Enchanted by the visual light, it flies straight into the fire, burns its wings, and loses its life."
    },
    lesson: {
      mr: "बाह्य रूप आणि सौंदर्याचा मोह टाळावा. केवळ डोळ्यांना दिसणाऱ्या तात्पुरत्या आकर्षणांच्या मागे धावल्यास माणसाचा आध्यात्मिक आणि भौतिक विनाश ठरलेला असतो.",
      hi: "रूप और बाह्य सौंदर्य के मोह का त्याग। केवल आंखों को अच्छे लगने वाले क्षणिक और झूठे आकर्षणों के पीछे भागने से मनुष्य का आत्मिक और बौद्धिक विनाश निश्चित हो जाता है।",
      en: "Overcoming visual infatuation and sensory lust. Blindly chasing superficial beauty and temporary worldly pleasures leads to physical and spiritual destruction."
    },
    explanation: {
      mr: "माणूस जगात अनेक चकचकीत गोष्टी पाहून आकर्षित होतो. पण पतंगाची कथा आपल्याला सावध करते की, प्रत्येक आकर्षक दिसणारी गोष्ट हितकारक नसते. वासनेवर ताबा ठेवणे अत्यंत गरजेचे आहे.",
      hi: "मनुष्य संसार की चमक-दमक देखकर आकर्षित होता है। परंतु पतंगे की यह कथा सचेत करती है कि हर आकर्षक दिखने वाली वस्तु हितकारी नहीं होती। वासना और कामेच्छा पर नियंत्रण अत्यंत आवश्यक है।",
      en: "People are easily lured by the glitz and glamour of the material world. The moth warns us that not everything that glitters is good, and conquering our visual impulses is vital."
    }
  },
  {
    id: 12,
    name: {
      mr: "मधमाशी (Honeybee)",
      hi: "मधमक्खी (Honeybee)",
      en: "Honeybee"
    },
    symbol: "🐝",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "मधमाशी फुलांवर बसते, तिथून केवळ गोड मध (सार) अत्यंत नम्रतेने गोळा करते आणि निघून जाते. ती फुलाला कधीही कोणतीही इजा करत नाही किंवा फूल तोडत नाही.",
      hi: "मधमक्खी फूलों पर बैठती है, वहां से केवल मीठा रस (सार तत्व) अत्यंत विनम्रतापूर्वक ग्रहण करती है और उड़ जाती है। वह कभी फूल को कोई क्षति नहीं पहुंचाती और न ही उसे नष्ट करती है।",
      en: "A honeybee hovers from flower to flower, collecting only the sweet nectar (the essence) with great gentleness, without causing any harm to the flowers."
    },
    lesson: {
      mr: "शास्त्रांमधून केवळ 'सार' निवडावा. साधकाने समाजात किंवा शास्त्रांमध्ये असणाऱ्या चांगल्या-वाईट गोष्टींमधून केवळ चांगल्या गोष्टी (सार) स्वीकाराव्यात आणि वाईट गोष्टी सोडून द्याव्यात. गृहस्थाला त्रास न देता भिक्षा मागणे हेही यातून शिकता येते.",
      hi: "शास्त्रों से केवल 'सार' ग्रहण करना। साधक को विभिन्न ग्रंथों या समाज से केवल अच्छी बातें (सार तत्व) ही ग्रहण करनी चाहिए। साथ ही, गृहस्थों को कष्ट दिए बिना केवल जीवनयापन योग्य भिक्षा मांगनी चाहिए।",
      en: "Extracting only the essence of wisdom. A seeker should study various scriptures and observe society, accepting only the pure truth (essence) while ignoring irrelevant details. They should also accept alms gently without bothering householders."
    },
    explanation: {
      mr: "ज्याप्रमाणे मधमाशी लहान-लहान थेंब गोळा करून गोड मध बनवते, तसेच आपणही प्रत्येक अनुभवातून आणि माणसाकडून चांगुलपणाचा स्वीकार करून आपले जीवन समृद्ध केले पाहिजे.",
      hi: "जिस प्रकार मधमक्खी बूंद-बूंद एकत्र कर मीठा शहद बनाती है, उसी प्रकार हमें भी हर अनुभव और व्यक्ति से केवल अच्छाई ग्रहण कर अपने जीवन को सुंदर और ज्ञानमय बनाना चाहिए।",
      en: "Just as the bee builds sweet honey drop by drop from different flowers, we should enrich our lives by collecting goodness and wisdom from every person and experience."
    }
  },
  {
    id: 13,
    name: {
      mr: "हत्ती / गजेंद्र (Elephant)",
      hi: "हाथी (Elephant)",
      en: "Elephant"
    },
    symbol: "🐘",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "अतिशय बलशाली असणारा हत्ती जंगलात सहज कोणाच्याही ताब्यात येत नाही. पण शिकारी एक खड्डा खणून त्यावर कागदी किंवा लाकडी हत्तीण ठेवतात. तिच्या स्पर्शाच्या मोहाने हत्ती तिथे धावतो आणि खड्ड्यात पडून आयुष्यभरासाठी बंधनात अडकतो.",
      hi: "अत्यंत बलशाली हाथी को कोई आसानी से वश में नहीं कर सकता। परंतु शिकारी एक बड़ा गड्ढा खोदकर उसे सूखी घास से ढक देते हैं और उस पर कागजी हथिनी रख देते हैं। उसके स्पर्श के मोह में हाथी वहां दौड़ता है और गड्ढे में गिरकर जीवनभर के लिए गुलामी के बंधन में बंध जाता है।",
      en: "The mighty elephant cannot be easily captured in the wild. However, hunters dig a pit, cover it, and place a dummy female elephant on top. Lured by the desire for physical touch, the elephant rushes forward, falls into the pit, and is enslaved for life."
    },
    lesson: {
      mr: "कामवासना आणि स्पर्श सुखाचा मोह विनाशाचे कारण ठरतो. साधकाने कामवासनेवर आणि कामुक विचारांवर नियंत्रण ठेवावे, अन्यथा कितीही शक्ती असली तरी मनुष्य बंधनात पडतो.",
      hi: "कामवासना और स्पर्श सुख का मोह विनाशकारी है। साधक को कामवासना और कामुक आकर्षणों से सदैव दूर रहना चाहिए, अन्यथा कितनी भी शक्ति या बुद्धिमत्ता हो, मनुष्य माया के बंधनों में फंस जाता है।",
      en: "Lust and the craving for physical sensation lead to bondage. No matter how strong or intelligent a person is, succumbing to sensory urges binds them in misery."
    },
    explanation: {
      mr: "हत्तीच्या उदाहरणावरून स्पष्ट होते की, केवळ एका 'स्पर्श' इंद्रियाच्या आहारी गेल्याने जंगलाचा राजा असणारा प्राणी गुलाम बनतो. म्हणून साधकाने ब्रह्मचर्य आणि इंद्रियनिग्रहाचे पालन करावे.",
      hi: "हाथी के उदाहरण से स्पष्ट है कि केवल एक 'स्पर्श' इंद्रिय के वशीभूत होने से वन का राजा भी गुलाम बन जाता है। इसलिए साधक को इंद्रियनिग्रह और वासनाओं पर विजय प्राप्त करनी चाहिए।",
      en: "The elephant's fate shows how craving for physical touch can enslave even the king of the forest. Thus, a seeker must practice self-restraint and master their physical impulses."
    }
  },
  {
    id: 14,
    name: {
      mr: "मधू-हारी / मध काढणारा (Honey-Gatherer)",
      hi: "मधु-हारी / शहद निकालने वाला (Honey-Gatherer)",
      en: "Honey-Gatherer"
    },
    symbol: "🧑‍🌾",
    category: {
      mr: "मानव",
      hi: "मानव",
      en: "Human"
    },
    observation: {
      mr: "मधमाश्या अत्यंत कष्ट करून, उपाशी राहून फुलाफुलांतून मध जमा करतात. पण त्या स्वतः तो मध कधी खात नाहीत की कोणाला देत नाहीत. शेवटी मध काढणारा मनुष्य येतो, जाळ लावून मधमाश्यांना पळवतो आणि सर्व मध स्वतः घेऊन जातो.",
      hi: "मधुमक्खियां दिन-रात कड़ी मेहनत करके फूलों से शहद इकट्ठा करती हैं। वे स्वयं न तो उस शहद का उपभोग करती हैं और न किसी को दान देती हैं। अंत में एक शहद निकालने वाला व्यक्ति आता है, उन्हें भगा देता है और सारा शहद लेकर चला जाता है।",
      en: "Honeybees labor relentlessly to store honey in their hives, neither consuming it themselves nor sharing it. Eventually, a honey-gatherer comes along, smokes out the bees, and takes away all the honey."
    },
    lesson: {
      mr: "अति-संचय करणे व्यर्थ आहे. जे धन आपण स्वतः उपभोगत नाही किंवा योग्य कामात दान करत नाही, ते धन शेवटी तिसराच कोणीतरी लुटून नेतो. म्हणून दानशूर व्हावे.",
      hi: "अत्यधिक संचय करना व्यर्थ है। जो धन हम स्वयं उपभोग नहीं करते और न ही धर्म-कर्म में दान करते हैं, उस धन को कोई तीसरा व्यक्ति (या चोर/काल) आकर छीन लेता है। इसलिए धन का सदुपयोग करना चाहिए।",
      en: "The futility of excessive hoarding. Wealth that is neither enjoyed nor shared with the needy is eventually lost or taken away by someone else. One should practice timely charity."
    },
    explanation: {
      mr: "हा धडा आपल्याला कंजूषपणा सोडायला शिकवतो. जमा केलेले वैभव मृत्यूनंतर आपल्यासोबत येत नाही, केवळ सत्कर्म आणि दानच आपल्यासोबत राहते.",
      hi: "यह सीख हमें कृपणता (कंजूसी) छोड़ने के लिए प्रेरित करती है। संचित की हुई धन-संपत्ति मृत्यु के पश्चात यहीं रह जाएगी, केवल सत्कर्म और परोपकार ही जीव के साथ जाते हैं।",
      en: "This teaches us to avoid miserliness. The wealth we hoard will remain behind after death; only our righteous deeds and charity accompany us."
    }
  },
  {
    id: 15,
    name: {
      mr: "हरीण (Deer)",
      hi: "हिरण (Deer)",
      en: "Deer"
    },
    symbol: "🦌",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "हरीण अत्यंत चपळ आणि वेगवान असते. पण त्याला मधुर संगीताचा प्रचंड नाद असतो. शिकारी जंगलात गोड संगीत वाजवतात. त्या सुरांनी मोहित होऊन हरीण आपली सावधगिरी विसरते, शांत उभे राहते आणि शिकारी सहज त्याचा वेध घेतो.",
      hi: "हिरण अत्यंत फुर्तीला और तेज दौड़ने वाला जीव है। परंतु वह मधुर संगीत का प्रेमी होता है। शिकारी वन में मीठी बांसुरी या संगीत बजाते हैं। उस धुन पर मोहित होकर हिरण अपनी सुध-बुध खो बैठता है और शिकारी का निशाना बन जाता है।",
      en: "The deer is extremely agile and fast. However, it is deeply enchanted by sweet music. Hunters play melodious music in the forest, causing the deer to freeze in absolute fascination, making it an easy target."
    },
    lesson: {
      mr: "श्रवण सुखाचा किंवा गोड शब्दांचा मोह टाळावा. केवळ गोड बोलणाऱ्या आणि खुशामत करणाऱ्या लोकांमुळे माणूस गाफील राहतो आणि संकटात पडतो. इंद्रिय सुखांचे संगीत माणसाला नाशाकडे नेते.",
      hi: "कर्णप्रिय शब्दों और खुशामद के जाल से बचना। केवल मीठी बातों या प्रशंसा के मोह में आकर मनुष्य अपना विवेक खो बैठता है और धोखे का शिकार हो जाता है। इंद्रियों के सुख का संगीत पतन की ओर ले जाता है।",
      en: "Overcoming the trap of sweet praise and auditory pleasure. Getting captivated by flattery or sweet talk blinds a person to imminent dangers."
    },
    explanation: {
      mr: "हरणाच्या कथेवरून कळते की, कानाला सुखावणारे आवाज किंवा संगीत आपल्याला मोहात पाडू शकतात. साधकाने आपली विवेकबुद्धी जागृत ठेवून खोट्या स्तुतीपासून दूर राहावे.",
      hi: "हिरण की इस कथा से पता चलता है कि कानों को प्रिय लगने वाले शब्द या संगीत हमें भ्रम में डाल सकते हैं। साधक को सदैव सजग रहकर झूठी प्रशंसा और वासनापूर्ण संगीत से दूर रहना चाहिए।",
      en: "The deer's story reveals how sounds pleasing to the ear can lure us into traps. A seeker must remain vigilant and not fall prey to hollow praises or deceptive words."
    }
  },
  {
    id: 16,
    name: {
      mr: "मीन / मासा (Fish)",
      hi: "मछली (Fish)",
      en: "Fish"
    },
    symbol: "🐟",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "मासा पाण्यात अत्यंत सुरक्षित असतो, त्याला कोणी सहज पकडू शकत नाही. पण कोळी गळाला अन्न (भक्ष) लावतो. केवळ जिभेच्या चवीपोटी मासा त्या अन्नाकडे झेपावतो आणि तोंडात गळ रुतून स्वतःचे प्राण गमावतो.",
      hi: "मछली पानी के भीतर अत्यंत सुरक्षित रहती है, उसे पकड़ना कठिन होता है। परंतु मछुआरा कांटे में थोड़ा सा चारा लगाता है। केवल जीभ के स्वाद (रस-लोलुपता) के कारण मछली उस चारे को निगलने दौड़ती है और कांटे में फंसकर तड़प-तड़प कर मर जाती है।",
      en: "A fish is highly secure underwater and hard to catch. However, a fisherman attaches bait to a hook. Driven entirely by the craving of its tongue, the fish swallows the bait and gets hooked to death."
    },
    lesson: {
      mr: "जिव्हा नियंत्रण (स्वादलोलुपता) हाच आत्मसंयमाचा पाया आहे. जोपर्यंत आपण जिभेच्या चवीवर ताबा मिळवत नाही, तोपर्यंत इतर सर्व इंद्रिये ताब्यात ठेवणे अशक्य आहे. चवीच्या आहारी जाणे विनाशाचे कारण बनते.",
      hi: "जीभ पर नियंत्रण (रस-इंद्रिय का निग्रह)। जब तक मनुष्य अपने स्वाद की लालसा पर विजय प्राप्त नहीं करता, तब तक अन्य इंद्रियों को वश में करना असंभव है। जीभ का लोभ मनुष्य को पतन की ओर ले जाता है।",
      en: "Mastery over the tongue (taste buds) is the foundation of self-control. Until one conquers the craving for tasty food, it is impossible to master the other senses."
    },
    explanation: {
      mr: "सर्व इंद्रियांमध्ये जीभ सर्वात चंचल मानली जाते. तिच्या हव्यासापोटी माणूस चुकीचे अन्न आणि चुकीचे मार्ग स्वीकारतो. मिताहार (संतुलित भोजन) आणि ईश्वरी नामाचा जप याने जिव्हा शुद्ध ठेवावी.",
      hi: "सभी इंद्रियों में जीभ को सबसे चंचल माना गया है। इसकी लालसा में मनुष्य गलत आहार और मार्ग चुनता है। सात्विक भोजन और ईश्वरीय नाम स्मरण से जीभ को पवित्र रखना चाहिए।",
      en: "The tongue is considered the most volatile sense organ. Driven by appetite, a person often consumes toxic things. Eating pure, moderate food and chanting holy names helps cleanse it."
    }
  },
  {
    id: 17,
    name: {
      mr: "पिंगला वेश्या (Pingala the Courtesan)",
      hi: "पिंगला वेश्या (Pingala the Courtesan)",
      en: "Pingala the Courtesan"
    },
    symbol: "💃",
    category: {
      mr: "मानव",
      hi: "मानव",
      en: "Human"
    },
    observation: {
      mr: "पिंगला नावाची एक वेश्या दररोज रात्री श्रीमंत ग्राहकांच्या आशेने नटून-थटून दारात उभी राहत असे. एक रात्र अशी आली की पहाटेपर्यंत एकही ग्राहक आला नाही. ती खूप अस्वस्थ आणि दुःखी झाली. पण शेवटी तिच्या मनात तीव्र वैराग्य आले. तिने सर्व आशा सोडल्या, दारात उभे राहणे बंद केले आणि शांतपणे झोपी गेली.",
      hi: "पिंगला नामक एक वेश्या प्रतिदिन धनवान पुरुषों की प्रतीक्षा में सज-धजकर अपने द्वार पर खड़ी रहती थी। एक रात ऐसी आई जब भोर होने तक कोई ग्राहक नहीं आया। वह अत्यंत व्याकुल और दुखी हुई। परंतु अंत में उसके भीतर गहरा वैराग्य जागा। उसने अपनी सारी झूठी आशाओं का त्याग कर दिया, द्वार बंद किया और गहरी तथा शांत नींद में सो गई।",
      en: "Pingala, a courtesan, used to dress up and wait at her doorstep every night, hoping for wealthy customers. One night, no one showed up until dawn. Frustrated and miserable, she suddenly experienced a wave of detachment. She renounced all expectations, closed the door, and slept peacefully."
    },
    lesson: {
      mr: "अपेक्षा किंवा आशा हेच दुःखाचे कारण आहे, आणि अपेक्षा नसणे (आशा सोडणे) हेच खरे सुख आहे. जेव्हा आपण संसारातील नाशवंत गोष्टींची आशा सोडतो, तेव्हाच आपल्याला खरी शांतती लाभते.",
      hi: "आशा ही परम दुख है, और निराशा (इच्छाशून्य होना) ही परम सुख है। जब हम सांसारिक वस्तुओं और लोगों से झूठी आशाएं रखना छोड़ देते हैं, तभी हमारे अंतःकरण को सच्ची और स्थायी शांति मिलती है।",
      en: "Expectation/Desire is the root of all misery, and desirelessness (letting go of expectations) is the highest peace. When we stop clinging to temporary material hopes, we attain absolute peace."
    },
    explanation: {
      mr: "पिंगला आपल्याला शिकवते की, परक्या माणसांकडून सुख मिळवण्याची इच्छा माणसाला अस्वस्थ करते. जेव्हा ती ईश्वराला शरण गेली आणि इच्छाशून्य झाली, तेव्हा तिला आत्मानंद मिळाला.",
      hi: "पिंगला हमें सिखाती है कि दूसरों से सुख और मान पाने की इच्छा ही मनुष्य को बेचैन करती है। जब वह ईश्वर की शरण में गई और निष्काम हुई, तब उसे परम सुख और शांति प्राप्त हुई।",
      en: "Pingala teaches us that looking to others for happiness makes one restless. The moment she surrendered to the Divine and became desireless, she experienced inner bliss."
    }
  },
  {
    id: 18,
    name: {
      mr: "कुरर पक्षी / घार (Osprey / Eagle)",
      hi: "कुरर पक्षी (Osprey / Eagle)",
      en: "Osprey / Eagle"
    },
    symbol: "🦅",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "एक कुरर पक्षी तोंडात माशाचा तुकडा धरून उडत होता. त्याच्याकडे अन्न पाहून इतर अनेक बलवान पक्षी त्याचा पाठलाग करू लागले आणि चोची मारून त्याला जखमी करू लागले. जेव्हा कुरर पक्षाने कंटाळून तो माशाचा तुकडा खाली पाडून टाकला, तेव्हा सर्व पक्षी त्या तुकड्याच्या मागे निघून गेले आणि कुरर पक्षाला तात्काळ शांतता व मुक्ती मिळाली.",
      hi: "एक कुरर (चील या बाज जैसा पक्षी) अपने मुंह में मांस का टुकड़ा दबाकर उड़ रहा था। उसके पास भोजन देखकर अन्य शक्तिशाली पक्षी उस पर हमला करने लगे और चोंच मारकर उसे घायल करने लगे। जब कुरर पक्षी ने थककर उस टुकड़े को नीचे गिरा दिया, तो सभी पक्षी मांस के पीछे चले गए और कुरर पक्षी को तुरंत शांति तथा सुरक्षा मिल गई।",
      en: "An osprey was flying with a piece of fish in its beak. Seeing this food, other larger birds attacked and chased him, pecking and wounding him. The moment the osprey dropped the piece of fish, the other birds flew after it, leaving him in immediate peace."
    },
    lesson: {
      mr: "संग्रह आणि मालकी हक्काचा त्याग. संसारात जोपर्यंत आपण भौतिक गोष्टी किंवा मालकी हक्क घट्ट पकडून ठेवतो, तोपर्यंत लोक आपल्याला त्रास देतात आणि चिंता सतावते. त्याग केल्यानेच खरा मोक्ष मिळतो.",
      hi: "संग्रह और ममता का त्याग। संसार में जब तक हम वस्तुओं का अधिकार या मालकियत पकड़े रहते हैं, तब तक चिंता, शत्रुता और पीड़ा बनी रहती है। संग्रह का परित्याग करने से ही जीवन में वास्तविक मुक्ति और शांति मिलती है।",
      en: "Renunciation of possession and ownership. As long as we hold on tightly to material ownership and ego, we face worries and conflicts. Letting go of attachments brings instant peace."
    },
    explanation: {
      mr: "या पक्षाकडून शिकायला मिळते की, जगात सुखी राहायचे असेल तर 'माझे' म्हणण्याची वृत्ती सोडावी लागेल. आपण जितक्या गोष्टींचा संग्रह करू, तितके आपले शत्रू आणि काळजी वाढतील.",
      hi: "इस पक्षी से सीख मिलती है कि यदि संसार में सुखी रहना है, तो 'यह मेरा है' की भावना का त्याग करना होगा। हम जितना अधिक संग्रह करेंगे, उतनी ही हमारी चिंताएं और शत्रु बढ़ेंगे।",
      en: "This bird teaches us that to be happy in this world, we must drop the sense of 'mine' (possessiveness). The more we hoard, the more anxieties and rivals we attract."
    }
  },
  {
    id: 19,
    name: {
      mr: "बालक (Child)",
      hi: "बालक (Child)",
      en: "Child"
    },
    symbol: "👶",
    category: {
      mr: "मानव",
      hi: "मानव",
      en: "Human"
    },
    observation: {
      mr: "लहान बाळ मानापमान, भूतकाळ किंवा भविष्यकाळ, संपत्ती किंवा गरिबी या सर्वांच्या पलीकडे असते. ते क्षणात रडते आणि आईने जवळ घेताच पुन्हा हसून खेळायला लागते. त्याला कोणाविषयीही द्वेष किंवा पूर्वग्रह नसतो.",
      hi: "एक छोटा बच्चा मान-अपमान, भूतकाल-भविष्यकाल, अमीरी-गरीबी जैसी सभी द्वंद्वों से परे रहता है। वह क्षणभर में रोता है और मां के गले लगते ही तुरंत मुस्कुराने और खेलने लगता है। उसके मन में किसी के प्रति बैर या ईर्ष्या नहीं होती।",
      en: "A young child is beyond honor and insult, past and future, wealth and poverty. It cries one moment and giggles the next when embraced by its mother, harboring no malice or prejudice."
    },
    lesson: {
      mr: "निरागसता, अहंकारशून्यता आणि वर्तमानात जगणे. साधकाने लहान मुलाप्रमाणे निष्पाप बनावे. मनात कोणतीही चिंता न ठेवता, चिंतामुक्त होऊन नेहमी वर्तमानात आनंदी राहावे.",
      hi: "निरागसता, अहंकारहीनता और वर्तमान में जीना। साधक को एक बालक की भांति निष्पाप और सरल होना चाहिए। मन में किसी के प्रति राग-द्वेष या भविष्य की चिंता रखे बिना सदैव वर्तमान क्षण में आनंदित रहना चाहिए।",
      en: "Innocence, egolessness, and living in the present. A spiritual seeker should become as simple and innocent as a child, completely free from anxieties and holding no grudges."
    },
    explanation: {
      mr: "ज्ञानाचा गर्व माणसाला अस्वस्थ करतो, पण लहान मुलाचे निरागस मन त्याला शांत ठेवते. परमात्म्याच्या प्राप्तीसाठी मनाची लहान मुलासारखी निरागस अवस्था होणे अत्यंत आवश्यक आहे.",
      hi: "ज्ञान का अहंकार मनुष्य को अशांत करता है, परंतु बालक का भोलापन और सरलता उसे सुखी रखती है। परमात्मा की प्राप्ति के लिए मन का निष्पाप और बालक समान होना अत्यंत आवश्यक है।",
      en: "The pride of intellect makes a person restless, whereas a child's simplicity keeps it blissful. To experience divine union, one must cultivate a pure and childlike heart."
    }
  },
  {
    id: 20,
    name: {
      mr: "कुमारी / लहान मुलगी (Maiden)",
      hi: "कुमारी (Maiden)",
      en: "Maiden"
    },
    symbol: "👧",
    category: {
      mr: "मानव",
      hi: "मानव",
      en: "Human"
    },
    observation: {
      mr: "एक मुलगी घरी पाहुणे आले असता घरात भात सडत होती (धान्य कांडत होती). तिच्या हातातील काचेच्या बांगड्यांचा खूप आवाज येत होता, ज्यामुळे पाहुण्यांच्या संभाषणात अडथळा येत होता. तिने आवाज बंद करण्यासाठी एकेक करून सर्व बांगड्या काढून टाकल्या आणि शेवटी फक्त एकच बांगडी हातात ठेवली. बांगडी एकच राहिल्यावर आवाज पूर्णपणे बंद झाला.",
      hi: "एक कन्या के घर पर कुछ मेहमान आए। वह रसोई में धान कूटने लगी। उसके हाथों में बहुत सारी कांच की चूड़ियां थीं, जो आपस में टकराकर जोर से आवाज कर रही थीं। मेहमानों को इसकी आवाज से बाधा न पहुंचे, इसलिए उसने एक-एक कर सभी चूड़ियां उतार दीं और हाथ में केवल एक ही चूड़ी छोड़ी। चूड़ी एक रह जाने पर आवाज पूरी तरह बंद हो गई।",
      en: "A young girl was husking grain at home when unexpected guests arrived. The multiple glass bangles on her wrists clinked loudly, causing noise. To stop the clatter, she removed the bangles one by one until only one was left on each wrist. Instantly, the noise ceased."
    },
    lesson: {
      mr: "एकांतवास आणि अखंडता. जास्त लोक एकत्र आले की तिथे कलह आणि निरर्थक चर्चा (आवाज) होतात. दोन लोक एकत्र राहिल्यास भांडण होण्याची शक्यता असते. म्हणून, ध्यान आणि आत्मचिंतनासाठी एकांतात राहणे आणि 'एकमेव' परमात्म्याशी एकरूप होणे श्रेष्ठ आहे.",
      hi: "मौन, एकांतवास और एकाग्रता। जहां बहुत से लोग इकट्ठे होते हैं, वहां व्यर्थ का वाद-विवाद (शोर) होता है। जहां दो भी रहते हैं, वहां चर्चा या कलह की संभावना होती है। इसलिए आत्मचिंतन और योग साधना के लिए साधक को एकांत में रहना चाहिए।",
      en: "Solitude, silence, and focused practice. Gathering in large crowds leads to gossip and noise; even having two together can create friction. For deep meditation and self-reflection, walking the path of solitude is ideal."
    },
    explanation: {
      mr: "हा धडा आपल्याला एकांताचे माहात्म्य शिकवतो. आपल्या मनातील चंचलता दूर करण्यासाठी आणि ईश्वराशी अनुसंधान साधण्यासाठी बाह्य कोलाहलापासून दूर राहून स्वतःमध्ये एकाग्र व्हावे.",
      hi: "यह प्रसंग हमें एकांत और मौन का महत्त्व समझाता है। मन की चंचलता को शांत करने और परमात्मा से जुड़ने के लिए हमें बाहरी शोर से दूर रहकर अपने भीतर अंतर्मुखी होना चाहिए।",
      en: "This teaches us the importance of solitude. To silence the inner chatter and connect with the Divine, one must retreat from external noise and look inward."
    }
  },
  {
    id: 21,
    name: {
      mr: "बाण बनवणारा / लोहार (Arrow-Maker)",
      hi: "बाण बनाने वाला (Arrow-Maker)",
      en: "Arrow-Maker"
    },
    symbol: "🏹",
    category: {
      mr: "मानव",
      hi: "मानव",
      en: "Human"
    },
    observation: {
      mr: "एक लोहार किंवा बाण बनवणारा कारागीर अत्यंत एकाग्रतेने बाणाचे टोक तयार करत होता. त्याचे लक्ष केवळ बाणावर केंद्रित होते. त्याच्या अगदी जवळून राजाची वाजतगाजत मोठी वरात आणि सैन्य निघून गेले. पण वरात निघून गेल्यावर कोणीतरी विचारले असता, त्याने सांगितले की त्याने कोणतीही वरात पाहिली नाही किंवा तिचा आवाज ऐकला नाही.",
      hi: "एक कारीगर अत्यंत तन्मयता से बाण की नोक को सीधा और पैना करने में लगा था। उसका पूरा ध्यान केवल अपने काम पर केंद्रित था। उसके पास से राजा की बड़ी सेना और गाजे-बाजे के साथ बारात गुजर गई। बाद में जब किसी ने उससे पूछा, तो उसने कहा कि उसने न तो कोई बारात देखी और न ही कोई आवाज सुनी।",
      en: "An artisan was deeply focused on shaping the tip of an arrow. His entire attention was locked onto his work. A massive royal wedding procession with loud music and elephants passed right next to him, but when asked afterward, he truly remarked that he neither saw nor heard a thing."
    },
    lesson: {
      mr: "चित्ताची एकाग्रता आणि ध्यान. साधना करताना आपले मन ध्येयावर (ईश्वरावर) इतके एकाग्र असावे की बाह्य जगातील कोणत्याही हालचालीने किंवा आवाजाने आपले लक्ष विचलित होऊ नये.",
      hi: "मन की एकाग्रता और ध्यान। साधना करते समय हमारा मन अपने लक्ष्य (परमात्मा) में इस प्रकार लीन होना चाहिए कि बाहरी संसार की कोई भी हलचल या शोर हमें हमारे ध्यान से विचलित न कर सके।",
      en: "Absolute concentration and single-pointed focus. While meditating or doing spiritual practice, one's mind should be so completely absorbed in the Divine that no external noise or event can distract them."
    },
    explanation: {
      mr: "बाण बनवणाऱ्या कारागिराकडून आपल्याला कळते की, एकाग्रतेशिवाय कोणतीही कला किंवा अध्यात्म साध्य होऊ शकत नाही. आपल्या मनाचे सर्व प्रवाह एकाच ईश्वरी तत्त्वाकडे वळवणे हीच खरी समाधी आहे.",
      hi: "बाण बनाने वाले से सीख मिलती है कि एकाग्रता के बिना कोई भी कार्य या साधना सफल नहीं हो सकती। मन के सभी विचारों को समेटकर केवल एक लक्ष्य पर टिका देना ही वास्तविक ध्यान है।",
      en: "The arrow-maker teaches us that success in any art or spirituality requires intense focus. Merging all mental currents into a single divine goal is the state of true meditation."
    }
  },
  {
    id: 22,
    name: {
      mr: "सर्प / साप (Serpent)",
      hi: "सर्प (Serpent)",
      en: "Serpent"
    },
    symbol: "🐍",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "साप कधीही स्वतःचे घर (बीळ) बनवण्यासाठी कष्ट करत नाही. तो मुंग्यांनी किंवा दुसऱ्या प्राण्यांनी बनवलेल्या बिळात राहतो. तो एका जागी स्थिर राहत नाही, सतत फिरत राहतो आणि शांतपणे जगतो.",
      hi: "साप कभी अपना घर (बिल) बनाने में समय और श्रम नष्ट नहीं करता। वह दूसरों (जैसे चींटियों) द्वारा बनाए गए बिल में जाकर रह लेता है। वह कभी एक स्थान पर स्थायी निवास नहीं बनाता और अकेला ही घूमता है।",
      en: "A snake never wastes effort building its own home. Instead, it lives in abandoned anthills or holes dug by other creatures, and wanders continuously, never staying permanently in one place."
    },
    lesson: {
      mr: "गृह आणि मठाच्या मोहाचा त्याग. संन्याशाने किंवा साधकाने स्वतःचे मोठे घर, आश्रम किंवा मठ बांधण्याच्या व्यापात पडू नये, कारण यामुळे बंधने वाढतात. जिथे जागा मिळेल तिथे विश्रांती घ्यावी आणि सतत प्रवासात राहावे.",
      hi: "आश्रम या गृह-निर्माण के मोह का त्याग। साधक या संन्यासी को अपने लिए बड़े-बड़े घर, मठ या आश्रम बनाने के प्रपंच में नहीं पड़ना चाहिए, क्योंकि यह बंधन का कारण बनता है। उसे जहां भी आश्रय मिले, वहीं ठहरकर साधना करनी चाहिए।",
      en: "Renouncing the desire for shelter or building properties. A wandering monk or seeker should not waste their life building grand houses or ashrams, which breed attachment. One should dwell wherever comfort is available and remain free."
    },
    explanation: {
      mr: "सर्प आपल्याला अलिप्त राहणे शिकवतो. घर किंवा मठ बांधण्याच्या मानसिकतेमुळे मनात मालकी हक्क निर्माण होतो, जो आध्यात्मिक प्रगतीत मोठा अडथळा आहे. निसर्गात अलिप्त राहणे हाच सर्वोत्तम मार्ग आहे.",
      hi: "सर्प हमें सिखाता है कि सांसारिक संपत्ति के निर्माण से बचना चाहिए। घर बनाने के फेर में मनुष्य का मन स्वामित्व की भावना में बंध जाता है। प्रकृति में बिना किसी स्थायी बंध के विचरना ही श्रेष्ठ है।",
      en: "The snake teaches us not to build physical roots. Building a permanent home creates a false sense of ownership, which hinders spiritual freedom. Wandering detachedly is the ideal way."
    }
  },
  {
    id: 23,
    name: {
      mr: "कोळी (Spider)",
      hi: "मकड़ी (Spider)",
      en: "Spider"
    },
    symbol: "🕷️",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "कोळी स्वतःच्या शरीरातून लाळ काढून अतिशय सुंदर आणि गुंतागुंतीचे जाळे विणतो. तो स्वतः त्या जाळ्यात फिरतो आणि खेळतो. शेवटी, जेव्हा त्याला हवे असते, तेव्हा तो ते संपूर्ण जाळे स्वतःच्या तोंडात परत ओढून घेतो आणि जाळे नष्ट करून मोकळा होतो.",
      hi: "मकड़ी अपने भीतर से धागा निकालकर एक सुंदर और जटिल जाला बुनती है। वह स्वयं उस जाले में घूमती है और क्रीड़ा करती है। अंत में, वह उस पूरे जाले को पुनः अपने भीतर समेट लेती है और जाला समाप्त हो जाता है।",
      en: "A spider extracts thread from its own body to spin a beautiful and intricate web. It moves and plays within it. Eventually, when it wishes, it draws the entire web back into itself, leaving no trace behind."
    },
    lesson: {
      mr: "सृष्टीची उत्पत्ती, स्थिती आणि लय. ज्याप्रमाणे कोळी स्वतःमधून जाळे निर्माण करतो आणि स्वतःमध्येच सामावून घेतो, त्याचप्रमाणे देव स्वतःमधून या विश्वाची निर्मिती करतो, त्याचे पालन करतो आणि शेवटी सर्व विश्व स्वतःमध्येच विलीन (लय) करतो.",
      hi: "सृष्टि का चक्र (उत्पत्ति, स्थिति और लय)। जिस प्रकार मकड़ी स्वयं से जाला बनाकर अंत में उसे अपने भीतर समेट लेती है, उसी प्रकार परमात्मा स्वयं से ही इस संपूर्ण ब्रह्मांड की रचना करते हैं, इसका संचालन करते हैं और अंत में इसे स्वयं में ही लीन (प्रलय) कर लेते हैं।",
      en: "The cosmic cycle of creation, preservation, and dissolution. Just as the spider spins the web from within and absorbs it back, the Supreme Divine projects this universe from Himself, sustains it, and ultimately dissolves it back into His essence."
    },
    explanation: {
      mr: "कोळ्याच्या उदाहरणावरून आपल्याला आत्म्याचे कर्तृत्व आणि जगाचे स्वप्नवत स्वरूप समजते. हे जग ईश्वरापेक्षा वेगळे नाही, सर्वत्र एकच ईश्वरी चैतन्य खेळत आहे.",
      hi: "मकड़ी के उदाहरण से हमें यह बोध होता है कि यह संसार परमात्मा से अलग नहीं है। यह पूरा विश्व उसी ईश्वर का प्रसार है, और अंत में सब कुछ उसी आदि तत्व में विलीन हो जाएगा।",
      en: "The spider's web demonstrates that the universe is not distinct from the Creator. The entire cosmos is a divine manifestation, and all will merge back into the absolute Source."
    }
  },
  {
    id: 24,
    name: {
      mr: "पेशाकृत कीटक / कुंभारमाशी (Wasp / Caterpillar)",
      hi: "भृंगी कीटक / कुम्हार मक्खी (Wasp / Caterpillar)",
      en: "Wasp / Caterpillar"
    },
    symbol: "🐝",
    category: {
      mr: "पक्षी व प्राणी",
      hi: "पक्षी व प्राणी",
      en: "Animals & Birds"
    },
    observation: {
      mr: "कुंभारमाशी (भृंगी) एका छोट्या अळीला उचलून आणते आणि आपल्या मातीच्या घरात बंद करते. ती अळी अतिशय घाबरते आणि सतत कुंभारमाशीच्या आवाजाचे आणि तिच्या रूपाचे तीव्र ध्यान करत राहते. सततच्या ध्यानामुळे काही दिवसांनी ती अळी स्वतः कुंभारमाशीचे रूप धारण करते आणि उडून जाते.",
      hi: "कुम्हार मक्खी (भृंगी) एक छोटे कीड़े या अळी को पकड़कर मिट्टी के घरौंदे में बंद कर देती है। वह कीड़ा भय और व्याकुलता के कारण लगातार उस भृंगी की आवाज का और उसके रूप का ध्यान करता रहता है। निरंतर ध्यान करने के कारण वह कीड़ा स्वयं भृंगी रूप में परिवर्तित हो जाता है और उड़ जाता है।",
      en: "A wasp catches a caterpillar, locks it inside a tiny mud nest, and constantly buzzes around it. Out of sheer intensity and focus, the caterpillar continuously contemplates the wasp. Due to this uninterrupted focus, the caterpillar transforms into a wasp and flies away."
    },
    lesson: {
      mr: "ध्यानयोगाची शक्ती (तद्रूपता). माणूस ज्या गोष्टीचे किंवा देवाचे अहोरात्र, मनापासून आणि निरंतर चिंतन करतो, तो अंततः त्याच तत्त्वाशी एकरूप होतो. ईश्वराचे ध्यान केल्यास जीव शिव बनतो (भ्रमरकीटक न्याय).",
      hi: "निरंतर ध्यान की शक्ति (तद्रूपता)। मनुष्य जिस भी वस्तु या ईश्वर का अहोरात्र, एकाग्रचित्त होकर चिंतन करता है, वह अंततः उसी रूप में बदल जाता है। परमात्मा का निरंतर ध्यान करने से साधक स्वयं ब्रह्मरूप हो जाता है।",
      en: "The power of constant meditation and absorption (Tadrupata). Whatever a person intensely and continuously contemplates with their entire heart, they ultimately transform into and merge with that very entity."
    },
    explanation: {
      mr: "हा २५ वा धडा (२४ वा गुरु) आपल्याला 'ध्यानयोगाचे अंतिम रहस्य' सांगतो. आपली बुद्धी आणि मन जर आपण सदैव सद्गुरूंच्या आणि ईश्वराच्या चरणी लावले, तर आपण सर्व बंधनांतून मुक्त होऊन ईश्वरी स्वरूप प्राप्त करू शकतो.",
      hi: "यह २४वां गुरु हमें 'ध्यानयोग का अंतिम रहस्य' सिखाता है। यदि हम अपना मन और बुद्धि सदैव परमात्मा और सद्गुरु के चरणों में लगाए रखें, तो हम सभी सांसारिक बंधनों से मुक्त होकर ईश्वरीय स्वरूप प्राप्त कर सकते हैं।",
      en: "The 24th Guru reveals the ultimate secret of meditation. By continuously anchoring our intellect and mind in the Divine, we transcend all limitations and realize our innate divine nature."
    }
  }
];
