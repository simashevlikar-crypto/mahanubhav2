import fs from 'fs';

const filePath = 'src/data/vicharBandhData.ts';
let text = fs.readFileSync(filePath, 'utf8');

// Specific line fixes for remaining unclosed/lone straight quotes:
text = text.replace(
  /"(यस्यांघ्रिपंकज[^"]+?॥ २ ॥)/g,
  '**“ $1 ”**'
);

text = text.replace(
  /"भक्ति जैसी रामाची लक्ष्मणें केली : ॥/g,
  '**“ भक्ति जैसी रामाची लक्ष्मणें केली : ”** ॥'
);

text = text.replace(
  /"येथ प्रवृत्तिनिवृत्तिसि कारण :"/g,
  '**“ येथ प्रवृत्तिनिवृत्तिसि कारण : ”**'
);

text = text.replace(
  /"आद्यंतवंत :"/g,
  '**“ आद्यंतवंत : ”**'
);

text = text.replace(
  /" अडला सकळ जीवातें पावे : /g,
  '**“ अडला सकळ जीवातें पावे : ”** '
);

// If there are any stray double quotes remaining, convert them or remove stray quotes:
// Let's replace any `"([^"]+?)"` with `**“$1”**`
text = text.replace(/"([^"\n]+?)"/g, '**“$1”**');

// Now check if any single stray `"` remains and replace with `”` or remove
text = text.replace(/"/g, '');

// Clean up any double bold markers:
text = text.replace(/\*\*\*\*“/g, '**“');
text = text.replace(/”\*\*\*\*/g, '”**');
text = text.replace(/\*\*“\s*”\*\*/g, '');

fs.writeFileSync(filePath, text, 'utf8');
console.log('Fixed all remaining straight quotes!');

const allCurved = (text.match(/“/g) || []).length;
const boldCurved = (text.match(/\*\*“/g) || []).length;
const straightRemaining = (text.match(/\"/g) || []).length;
console.log('Final “ count:', allCurved);
console.log('Final **“ bold count:', boldCurved);
console.log('Final straight quote count:', straightRemaining);
