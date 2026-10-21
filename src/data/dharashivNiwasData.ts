import { NiwasItem } from '../types';

export const DHARASHIV_RAW_DATA_TUPLES: [
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
  // १. ता. भूम
  ['भूम', 'सुकटा', 'सुकटा : अ) प.पू.म.श्रीअनंतराजबा भोजने (२+०+०)', 'प.पू.म.श्रीअनंतराजबा भोजने', '८५५२८००२४५, ९०४९४१२२५७', 2, 0, 0, 2],
  ['भूम', 'सुकटा', 'सुकटा : ब) प.पू.श्रीआवेराजदादा (१+०+०)', 'प.पू.श्रीआवेराजदादा', '९७३०७१७२३३', 1, 0, 0, 1],
  ['भूम', 'सोनगीर', 'सोनगीर : प.पू.श्रीधरामानंद (१+२+१)', 'प.पू.श्रीधरामानंद', '९७६७९३७११६, ९८६०३४०५६३', 1, 2, 1, 4],
  ['भूम', 'घाटनांदूर', 'घाटनांदूर : त.स्वातीई बीडकर (०+३+०)', 'त.स्वातीई बीडकर', '७४९९८८५३७७', 0, 3, 0, 3],
  ['भूम', 'कारंडी', 'कारंडी (१+०+०)', 'कारंडी निवास', '-', 1, 0, 0, 1],

  // २. ता. कळंब
  ['कळंब', 'हावरगाव', 'हावरगाव : अ) प.पू.म.श्रीदादेराजबाबा शेवलीकर (१+१+१)', 'प.पू.म.श्रीदादेराजबाबा शेवलीकर', '९०११४८०२२२, ९५५२४१४५०९', 1, 1, 1, 3],
  ['कळंब', 'हावरगाव', 'हावरगाव : ब) प.पू.म.श्रीसस्तेदादा (५+४+२)', 'प.पू.म.श्रीसस्तेदादा', '९४९९८०९९९२', 5, 4, 2, 11],
  ['कळंब', 'हावरगाव', 'हावरगाव : क) प.पू.श्रीउत्तमराज (१+०+०)', 'प.पू.श्रीउत्तमराज', '९४२०४७८४०१', 1, 0, 0, 1],
  ['कळंब', 'शिराढोणा', 'शिराढोणा : प.पू.श्रीगोवर्धनदादा बीडकर (२+१+१)', 'प.पू.श्रीगोवर्धनदादा बीडकर', '७०८३१६१५९३', 2, 1, 1, 4],
  ['कळंब', 'आनेगाव', 'आनेगाव : प.पू.श्रीमुरलीधरदादा विद्वांस (१+१+०)', 'प.पू.श्रीमुरलीधरदादा विद्वांस', '९४०५२७४६६७', 1, 1, 0, 2]
];

export const DHARASHIV_NIWAS_ITEMS: NiwasItem[] = DHARASHIV_RAW_DATA_TUPLES.map(
  ([taluka, village, fullTitle, headPerson, phone, bhikshuk, tapasvini, children, total], index) => {
    const slug = `niwas_dharashiv_${taluka}_${village}_${index + 1}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');

    return {
      id: slug,
      name: `महानुभाव आश्रम (${fullTitle})`,
      nameEn: `Mahanubhav Ashram (${fullTitle})`,
      location: `${village}, ता. ${taluka}, जि. धाराशिव (उस्मानाबाद)`,
      state: 'महाराष्ट्र',
      district: 'धाराशिव',
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
