/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Chapter } from '../types';

export const shrichakrapaniStotraBook: Book = {
  id: 'shrichakrapani_stotra',
  title: 'श्री चक्रपाणी स्तोत्र (Shree Chakrapani Stotra)',
  titleEn: 'Shree Chakrapani Stotra',
  author: 'महानुभाव पंथ',
  description: 'भगवान श्री चक्रपाणी प्रभू (फलटण निवास) यांचे पावन व संकटहारक स्तोत्र.',
  descriptionEn: 'Sacred hymn praising Bhagavan Shree Chakrapani Prabhu of Phaltan.',
  category: 'stavan_stotra',
  chaptersCount: 1,
  coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop'
};

export const shrichakrapaniStotraChapters: Chapter[] = [
  {
    id: 'shrichakrapani_stotra_complete',
    bookId: 'shrichakrapani_stotra',
    number: 1,
    title: 'श्री चक्रपाणी स्तोत्र (संपूर्ण पावन पाठ)',
    titleEn: 'Shree Chakrapani Stotra (Complete Sacred Recital)',
    content: `॥ श्री चक्रपाणी स्तोत्र ॥

॥ श्री चक्रपाणी प्रभू नमः ॥

चार्वांग देवा परमेश्वरारा ।
अनंत वेधा कर सर्वसारा ।
असंख्य सिद्धि प्रकरा वरारा ।
वंदू फलेठाण निवासकारा ॥ १ ॥

ज्याचेनि नामे परमार्ग वेधे ।
ज्याचिया नामे परमार्ग बोधे ।
ज्याचेनि नामे परलाभ साधे ।
वंदू फलेठाण निवासकारा ॥ २ ॥

ज्याचेनि नामे भवताप नाशे ।
ज्याचेनि नामे निजविघ्न नाशे ।
ज्याचेनि नामे स्मरण प्रकाशे ।
वंदू फलेठाण निवासकारा ॥ ३ ॥

कैवल्यादानी वरमोक्षदानी ।
विद्यादिदानी सकलार्थदानी ।
अज्ञानतिमिर संहारक ज्ञानी ।
वंदू फलेठाण निवासकारा ॥ ४ ॥

जे अवधूत वेषे क्रीडा करिती ।
सुपी पुंजे भरूनी गोमतीमध्ये घालिती ।
बावन्न पुरुषां विद्यादान देती ।
तया नमन श्री चक्रपाणी ॥ ५ ॥

जो नित्य तेज अधिष्ठाता ।
स्वयंप्रकाश आनंद सविता ।
तो उदेला चैतन्याचळ माथा ।
तया नमू श्री चक्रपाणी ॥ ६ ॥`
  }
];
