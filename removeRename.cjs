const fs = require('fs');
let c = fs.readFileSync('src/pages/GraphicLibraryV2.tsx', 'utf8');

const targetIdx = c.indexOf('setRenameCardId(card.id);');
if (targetIdx !== -1) {
  // Find the preceding `<button `
  const startIdx = c.lastIndexOf('<button', targetIdx);
  // Find the following `</button>`
  const endIdx = c.indexOf('</button>', targetIdx) + '</button>'.length;
  
  if (startIdx !== -1 && endIdx !== -1) {
    c = c.substring(0, startIdx) + c.substring(endIdx);
    fs.writeFileSync('src/pages/GraphicLibraryV2.tsx', c);
    console.log('done via indexOf');
  }
}
