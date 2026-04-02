const fs = require('fs');
let c = fs.readFileSync('src/pages/GraphicLibraryV2.tsx', 'utf8');

// 1. Sort folders
c = c.replace(
  'const currentFolders = folders.filter(f => f.parentId === currentFolderId);',
  'const currentFolders = folders.filter(f => f.parentId === currentFolderId).sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0));'
);

// 2. Sort folder cards
c = c.replace(
  "const folderCards = currentFolderId ? filteredCards.filter(c => folders.find(f => f.id === currentFolderId)?.cardIds.includes(c.id)) : [];",
  "const folderCards = currentFolderId ? filteredCards.filter(c => folders.find(f => f.id === currentFolderId)?.cardIds.includes(c.id)).sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0)) : [];"
);

// 3. Sort unclassified cards
c = c.replace(
  "const unclassifiedCards = filteredCards.filter(c => !folders.some(f => f.cardIds.includes(c.id)));",
  "const unclassifiedCards = filteredCards.filter(c => !folders.some(f => f.cardIds.includes(c.id))).sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0));"
);

// 4. Update modal condition
c = c.replace(/selectedDetailCard\.isUpload/g, '(selectedDetailCard.isUpload || selectedDetailCard.isSystem)');

fs.writeFileSync('src/pages/GraphicLibraryV2.tsx', c);
console.log('done updating sorting and modal');
