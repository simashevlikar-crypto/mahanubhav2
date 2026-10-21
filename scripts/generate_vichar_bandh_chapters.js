import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/vicharBandhData.ts');
const fullFile = fs.readFileSync(filePath, 'utf8');

const startMarker = 'content: `';
const startIdx = fullFile.indexOf(startMarker);
const rest = fullFile.substring(startIdx + startMarker.length);
const endIdx = rest.lastIndexOf('`');
const content = rest.substring(0, endIdx);
const lines = content.split('\n');

// Deduplicate: lines 250 to 282
const cleanedLines = [...lines.slice(0, 250), ...lines.slice(283)];
cleanedLines[248] = cleanedLines[248].replace(
  'मग जीव साधनत्वें पिंड  दुसरें :',
  'मग जीव साधनत्वें पिंडस्तेचां ठायीं वेधूनि साध्य पावे : ॥ २८ ॥\n\n  दुसरें :'
);

// Find prakaran boundaries:
const prakarans = [];
cleanedLines.forEach((l, idx) => {
  const t = l.trim();
  if (t.startsWith('प्र.') || t.startsWith('प्रकरण') || t.startsWith('॥ प्रकरण')) {
    if (!t.includes('समाप्त')) {
      prakarans.push({ idx, line: t });
    }
  }
});

const titlesInfo = [
  { no: 1, title: 'प्रकरण १ : माया निरूपण (वचनें १ ते १४)', titleEn: 'Prakaran 1 : Maya Nirupan (Vachane 1 to 14)' },
  { no: 2, title: 'प्रकरण २ : परा-व्यापार निरूपण (वचनें १५ ते १७)', titleEn: 'Prakaran 2 : Para-Vyapar Nirupan (Vachane 15 to 17)' },
  { no: 3, title: 'प्रकरण ३ : स्वगोरा विद्या बहिर्याग कर्तृत्व निरूपण (वचनें १८ ते २३)', titleEn: 'Prakaran 3 : Swagora Vidya Nirupan (Vachane 18 to 23)' },
  { no: 4, title: 'प्रकरण ४ : विद्या-संचार निरूपण (वचनें २४ ते ३१ व ४९)', titleEn: 'Prakaran 4 : Vidya-Sanchar Nirupan (Vachane 24 to 31 & 49)' },
  { no: 5, title: 'प्रकरण १२ : केवळ भाव-प्रशंसा तत्स्वरूप निरूपण (वचनें ५० ते ५३)', titleEn: 'Prakaran 12 : Bhava-Prashansa Nirupan (Vachane 50 to 53)' },
  { no: 6, title: 'प्रकरण १३ : विधि-भाव-व्यावृत्ती व मिश्र अनुष्ठान (वचनें ५४ ते ५६)', titleEn: 'Prakaran 13 : Vidhi-Bhava-Vyavrutti (Vachane 54 to 56)' },
  { no: 7, title: 'प्रकरण १४ : विश्व-मूर्ति-विशेष व प्रपंच-स्वरूप (वचनें ५७ ते ६३)', titleEn: 'Prakaran 14 : Vishwa-Murti-Vishesh (Vachane 57 to 63)' },
  { no: 8, title: 'प्रकरण १५ : सकळ देवता-मूर्ती व मनुष्यत्व-प्रशंसा (वचनें ६४ ते ७१)', titleEn: 'Prakaran 15 : Sakal Devata-Murti (Vachane 64 to 71)' },
  { no: 9, title: 'प्रकरण १६ : सकळ युगधर्म ज्ञान व उत्तम युग प्रशंसा (वचनें ७२ ते ७४)', titleEn: 'Prakaran 16 : Sakal Yougdharm (Vachane 72 to 74)' },
  { no: 10, title: 'प्रकरण १७ : हीन युगीं ऊच धर्म व राम-प्रशंसा (वचनें ७५ ते ७७)', titleEn: 'Prakaran 17 : Heen Yougi Ooch Dharm (Vachane 75 to 77)' },
  { no: 11, title: 'प्रकरण १८ : श्रीकृष्ण अवतारांगिकार व विद्यावंत प्रतीती (वचनें ७८ ते ८५)', titleEn: 'Prakaran 18 : Shrikrishna Avatarangikar (Vachane 78 to 85)' },
  { no: 12, title: 'प्रकरण १९ : अर्जुन सामग्रीयुक्त स्वरूप-दर्शन निरूपण (वचनें ८६ ते ९०)', titleEn: 'Prakaran 19 : Arjun Samagriyukta (Vachane 86 to 90)' },
  { no: 13, title: 'प्रकरण २० : वेध-विशेष व ईश्वर विलक्षण निरूपण (वचनें ९१ ते ९३)', titleEn: 'Prakaran 20 : Vedha-Vishesh (Vachane 91 to 93)' },
  { no: 14, title: 'प्रकरण २१ : विद्या-आगमादि व कळी-दोष नाश निरूपण (वचनें ९४ ते १००)', titleEn: 'Prakaran 21 : Vidya-Agamadi (Vachane 94 to 100)' },
  { no: 15, title: 'प्रकरण २२ : त्रेतादि सौंदर्य-प्रशंसा व दैवी तत्ज्ञान (वचनें १०१ ते १०३)', titleEn: 'Prakaran 22 : Tretadi Saundarya-Prashansa (Vachane 101 to 103)' },
  { no: 16, title: 'प्रकरण २३ : परा-माया-शरीर व स्व-विद्यास्वीकार निरूपण (वचनें १०४ ते ११०)', titleEn: 'Prakaran 23 : Para-Maya-Sharir (Vachane 104 to 110)' },
  { no: 17, title: 'प्रकरण २४ : प्रेमस्रवित बोधदान व ईशालुत्व-स्वीकार (वचनें १११ ते ११९)', titleEn: 'Prakaran 24 : Premsravit Bodhadan (Vachane 111 to 119)' },
  { no: 18, title: 'प्रकरण २५ : मूर्ती ग्रहणा ग्रहण दयादि गुण व स्वसकळ नित्य (वचनें १२० ते १२२)', titleEn: 'Prakaran 25 : Murti Grahana (Vachane 120 to 122)' },
  { no: 19, title: 'प्रकरण २६ : नित्यबंधु स्वामित्व व स्ववैजायत्य निरूपण (वचनें १२३ ते १२७)', titleEn: 'Prakaran 26 : Nityabandhu Swamitva (Vachane 123 to 127)' },
  { no: 20, title: 'प्रकरण २७ : विघ्नोपशम व उभे कैवल्यत्व रमण निरूपण (वचनें १२८ ते १३१)', titleEn: 'Prakaran 27 : Vighnopasham (Vachane 128 to 131)' },
  { no: 21, title: 'प्रकरण २८ : मोक्ष-व्यवस्था निरूपण (वचनें १३२ ते १३३)', titleEn: 'Prakaran 28 : Moksha-Vyavastha (Vachane 132 to 133)' },
  { no: 22, title: 'प्रकरण २९ : स्वरूप साधन भावत्व व भक्त असाधारण महिमा (वचनें १३४ ते १४१)', titleEn: 'Prakaran 29 : Swarup Sadhan (Vachane 134 to 141)' },
  { no: 23, title: 'प्रकरण ३० : संनिधान-लक्षण व ज्ञान-महिमा निरूपण (वचनें १४२ ते १४९)', titleEn: 'Prakaran 30 : Sannidhan-Lakshan (Vachane 142 to 149)' },
  { no: 24, title: 'प्रकरण ३१ : अनधिकाराधिकार-संभव व असतीपरी ज्ञानियासि असती (वचनें १५० ते १६८)', titleEn: 'Prakaran 31 : Anadhikaradhikar (Vachane 150 to 168)' },
  { no: 25, title: 'प्रकरण ३२ : बळवत्तरात् दुर्बळं बाध्यते व कैवल्यदान (वचनें १६९ ते १८२)', titleEn: 'Prakaran 32 : Balavattarat Durbalam (Vachane 169 to 182)' }
];

// Helper to escape backticks and interpolation in template literals if needed
function makeContentString(str) {
  // Replace any unescaped `${` with `\${` and `\` with `\\` before backtick
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

let code = `import { Book, Chapter } from '../types';

export const vicharBandhBook: Book = {
  id: 'vichar_bandh',
  title: 'विचार बंद (Vichar Bandh)',
  titleEn: 'Vichar Bandh',
  author: 'श्री वाईंदेशकर महानुभाव',
  description: 'श्री वाईंदेशकर महानुभाव विरचित प्रमाणभूत विचार ग्रंथ. प्रकरण १ ते ३२ संपूर्ण निरूपण, वचनें व टीका क्रमवारी.',
  descriptionEn: 'Vichar Bandh by Shri Vaindeshkar Mahanubhav - Sequential authoritative scripture chapters with authentic commentary.',
  category: 'pramukh_granth',
  chaptersCount: 26,
  coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?q=80&w=600&auto=format&fit=crop'
};

export const vicharBandhChapters: Chapter[] = [
`;

// Build each chapter 1 to 25
prakarans.forEach((p, idx) => {
  const nextIdx = (idx + 1 < prakarans.length) ? prakarans[idx + 1].idx : cleanedLines.length;
  // If first chapter, include preamble lines (lines 0 to p.idx - 1)
  let chunkLines = [];
  if (idx === 0) {
    chunkLines = cleanedLines.slice(0, nextIdx);
  } else {
    chunkLines = cleanedLines.slice(p.idx, nextIdx);
  }

  const chunkText = chunkLines.join('\n').trim();
  const info = titlesInfo[idx];
  const chapNum = idx + 1;
  const chapId = `vb_ch${chapNum}`;

  code += `  {
    id: '${chapId}',
    bookId: 'vichar_bandh',
    number: ${chapNum},
    title: '${info.title}',
    titleEn: '${info.titleEn}',
    content: \`${makeContentString(chunkText)}\`
  },\n`;
});

// Add Chapter 26: Complete continuous book
const allContinuous = cleanedLines.join('\n').trim();
code += `  {
    id: 'vb_ch26',
    bookId: 'vichar_bandh',
    number: 26,
    title: 'विचार बंद : संपूर्ण ग्रंथ (प्रकरण १ ते ३२ अखंड वाचन)',
    titleEn: 'Vichar Bandh : Complete Scripture (Continuous)',
    content: \`${makeContentString(allContinuous)}\`
  }
];
`;

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully written new vicharBandhData.ts with', prakarans.length + 1, 'chapters!');
