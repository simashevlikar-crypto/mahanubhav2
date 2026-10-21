const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/vicharBandhData.ts');
let fullText = fs.readFileSync(filePath, 'utf8');

// The content starts after `content: \`` and ends before the closing `\``
const contentStartMarker = 'content: `';
const contentEndMarker = '\n  }\n];';

const startIdx = fullText.indexOf(contentStartMarker);
if (startIdx === -1) {
  console.error('Cannot find contentStartMarker');
  process.exit(1);
}

const header = fullText.substring(0, startIdx + contentStartMarker.length);
const rest = fullText.substring(startIdx + contentStartMarker.length);
const endIdx = rest.lastIndexOf('`');
if (endIdx === -1) {
  console.error('Cannot find endIdx');
  process.exit(1);
}

let content = rest.substring(0, endIdx);
const footer = rest.substring(endIdx);

console.log('Original content lines:', content.split('\n').length);
console.log('Original content length:', content.length);

// Step 1: Normalize any existing **"..."** to **“...”**
content = content.replace(/\*\*"([^"\n]+?)"\*\*/g, '**“$1”**');
content = content.replace(/\*\*"([^"\n]+?)/g, '**“$1');
content = content.replace(/([^"\n]+?)"\*\*/g, '$1”**');

// Step 2: Handle straight quotes pairs "..." -> **“...”**
// We process line by line
const lines = content.split('\n');
let fixedLines = lines.map((line, lineIdx) => {
  let l = line;

  // Fix line 1256 odd quote issue:
  // "वारें **“ प्रमाद ही “ होये : ”** तरि" -> "वारें **“ प्रमाद ही होये : ”** तरि"
  if (l.includes('वारें **“ प्रमाद ही “ होये : ”**')) {
    l = l.replace('वारें **“ प्रमाद ही “ होये : ”**', 'वारें **“ प्रमाद ही होये : ”**');
  }

  // Fix line 1268 unbolded quote:
  // "ते “ कां ? तैसिया अवतारा ”**" -> "ते **“ कां ? तैसिया अवतारा ”**"
  l = l.replace(/ते “ कां \? तैसिया अवतारा ”\*\*/g, 'ते **“ कां ? तैसिया अवतारा ”**');

  // Fix line 1314 nested quotes and unclosed quotes
  l = l.replace(/सर्वज्ञे म्हणितलें : “ म्हातारिया महात्मयाचा संबंध केला तेतुला विषय-संबंध केला : ”\*\*/g,
    'सर्वज्ञे म्हणितलें : **“ म्हातारिया महात्मयाचा संबंध केला तेतुला विषय-संबंध केला : ”**');
  l = l.replace(/॥ मग अनुताप उपनला : “ जी जी : इत्तुलें जन्म वाया गेलें जी : ”\*\*/g,
    '॥ मग अनुताप उपनला : **“ जी जी : इत्तुलें जन्म वाया गेलें जी : ”**');
  l = l.replace(/यितुलेनि आपुली अनुचीतें देखों लागलीं : ”/g,
    'यितुलेनि **“ आपुली अनुचीतें देखों लागलीं : ”**');
  l = l.replace(/तरि सत्यांचे लोक होति : ” तथा शेषशाय्याचे लोक होति : ”/g,
    'तरि **“ सत्यांचे लोक होति : ”** तथा **“ शेषशाय्याचे लोक होति : ”**');

  // Fix line 1324 unbolded start:
  l = l.replace(/सर्वज्ञे म्हणितलें : “ देखिलें गा भोजया :/g,
    'सर्वज्ञे म्हणितलें : **“ देखिलें गा भोजया :');

  // Fix line 1326 unbolded start and end:
  l = l.replace(/सर्वज्ञे म्हणितलें : “ एथची प्रीति जयासि तें मनुष्य बाइसासि आवडे : ”\*\*/g,
    'सर्वज्ञे म्हणितलें : **“ एथची प्रीति जयासि तें मनुष्य बाइसासि आवडे : ”**');
  l = l.replace(/मनन : निदिध्यासन करावें : ” ॥/g,
    'मनन : निदिध्यासन करावें : **”** ॥');

  // Fix line 1332 unbolded quotes:
  l = l.replace(/सर्वज्ञे म्हणितलें : “ एथोनि तुमचे दोष बाहीर घालिजाति तरि पोरे हो : पोट/g,
    'सर्वज्ञे म्हणितलें : **“ एथोनि तुमचे दोष बाहीर घालिजाति तरि पोरे हो : पोट');
  l = l.replace(/सर्वज्ञे म्हणितलें : “ कव्हणा कव्हणी व्यसन : कव्हणा कव्हणी व्यसन : एथ ज/g,
    'सर्वज्ञे म्हणितलें : **“ कव्हणा कव्हणी व्यसन : कव्हणा कव्हणी व्यसन : एथ ज');

  // Fix line 1334 unbolded quote:
  l = l.replace(/म्हणौनि “ आत्मज्ञानें मोक्ष : ”\*\*/g,
    'म्हणौनि **“ आत्मज्ञानें मोक्ष : ”**');

  // Fix line 1344 unbolded quote:
  l = l.replace(/जीवाचे “ आच्छादति \[ इथुलेंचि : ”\*\* \]/g,
    'जीवाचे **“ आच्छादति [ इथुलेंचि : ”** ]');

  // Fix line 1436 unbolded quote:
  l = l.replace(/संनिधानीं : “ मा म्हणवील काइ \? ”/g,
    'संनिधानीं : **“ मा म्हणवील काइ ? ”**');

  // Fix line 1444 unbolded quote:
  l = l.replace(/\*\*“ माहादाइसीं म्हणितलें : “ हें काइ जी : एतुलचि करी \? ”\*\*/g,
    '**“ माहादाइसीं म्हणितलें : ‘ हें काइ जी : एतुलचि करी ? ’ ”**');
  l = l.replace(/सर्वज्ञे \*\*“ म्हणितलें : “ हें काइ सानें \? ”\*\*/g,
    'सर्वज्ञे **“ म्हणितलें : ‘ हें काइ सानें ? ’ ”**');
  l = l.replace(/मागिली वचनींचें : ” म्हणिजे/g,
    'मागिली वचनींचें : ”** म्हणिजे');

  // Fix line 1502:
  l = l.replace(/सकळ अवतार उभयदिशें /g, 'सकळ अवतार उभयदिशें ');

  // Fix line 1506:
  l = l.replace(/ज्ञानें “ च्यारी ठाये ”/g, 'ज्ञानें **“ च्यारी ठाये ”**');

  // Fix line 1518:
  l = l.replace(/\*\*“ सर्वज्ञे म्हणितलें : “ या चैतन्यविद्यावंता नाहीं : ”\*\*/g,
    'सर्वज्ञे **“ म्हणितलें : ‘ या चैतन्यविद्यावंता नाहीं : ’ ”**');

  // Fix line 1522:
  l = l.replace(/विशेषें लाभे “ स्वस्थता ते सांगाविचि न लगे : ”\*\*/g,
    'विशेषें लाभे **“ स्वस्थता ते सांगाविचि न लगे : ”**');

  // Fix line 1530:
  l = l.replace(/\*\*“ हा ठावोव्येव्ह्रीं तादात्म्यनिवृत्ति : ”\*\*/g,
    '**“ हा ठावोव्येव्ह्रीं तादात्म्यनिवृत्ति : ”**');

  // Fix line 1645:
  l = l.replace(/म्हणौनि “ देहाची सीमा : ”\*\* म्हणितली :/g,
    'म्हणौनि **“ देहाची सीमा : ”** म्हणितली :');

  // Fix line 1647:
  l = l.replace(/ना “ दोनि चारि राइकीं : ”\*\* म्हणिजे/g,
    'ना **“ दोनि चारि राइकीं : ”** म्हणिजे');

  // Now replace all straight quote pairs "..." on this line with **“...”**
  // Make sure not to match if already wrapped in **
  // A straight quote pair is "([^"\n]+?)"
  l = l.replace(/"([^"\n]+?)"/g, (match, inner) => {
    // If inner already starts/ends with spaces or punct, preserve cleanly
    return `**“${inner}”**`;
  });

  // Also replace any remaining curved quotes that are NOT yet bolded:
  // (?<!\*\*)“([^”\n]+?)”(?:(?!\*\*))
  l = l.replace(/(?<!\*\*)“([^”\n]+?)”(?:(?!\*\*))/g, (match, inner) => {
    return `**“${inner}”**`;
  });

  // In case of “([^”\n]+?)”** without leading **
  l = l.replace(/(?<!\*\*)“([^”\n]+?)”\*\*/g, (match, inner) => {
    return `**“${inner}”**`;
  });

  // In case of **“([^”\n]+?)”(?:(?!\*\*))
  l = l.replace(/\*\*“([^”\n]+?)”(?:(?!\*\*))/g, (match, inner) => {
    return `**“${inner}”**`;
  });

  return l;
});

let updatedContent = fixedLines.join('\n');

// Clean up any double-wrapped bold quotes: ****“...”**** -> **“...”**
updatedContent = updatedContent.replace(/\*\*\*\*“/g, '**“');
updatedContent = updatedContent.replace(/”\*\*\*\*/g, '”**');

// Clean up empty bold quotes if any: **“”** -> "" or remove if alone
updatedContent = updatedContent.replace(/\*\*“”\*\*/g, '');

const finalFileContent = header + updatedContent + footer;
fs.writeFileSync(filePath, finalFileContent, 'utf8');

console.log('Successfully updated vicharBandhData.ts');

// Stats check
const allCurved = (finalFileContent.match(/“/g) || []).length;
const boldCurved = (finalFileContent.match(/\*\*“/g) || []).length;
const straightRemaining = (finalFileContent.match(/\"/g) || []).length;
console.log('Total “ quotes:', allCurved);
console.log('Total **“ bold quotes:', boldCurved);
console.log('Remaining straight quotes:', straightRemaining);
