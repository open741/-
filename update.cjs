const fs = require('fs');
let c = fs.readFileSync('src/pages/GraphicLibraryV2.tsx', 'utf8');

c = c.replace(
  /      setCards\(prev => \{/,
  "      const deletedAiIds = new Set(JSON.parse(localStorage.getItem('deleted_ai_cards') || '[]'));\n      setCards(prev => {"
);

c = c.replace(
  /const uniqueNew = generatedCards\.filter\(\(c: any\) => !existingIds\.has\(c\.id\)\);/,
  "const uniqueNew = generatedCards.filter((c: any) => !existingIds.has(c.id) && !deletedAiIds.has(c.id));"
);

c = c.replace(
  /return \[\.\.\.uniqueNew, \.\.\.prev\];/,
  "return [...uniqueNew, ...prev.filter((c: any) => !deletedAiIds.has(c.id))];"
);

c = c.replace(
  /  const handleDrop = \(e: React\.DragEvent, targetFolderId: string\) => \{/,
  "  const handleDeleteCards = (idsToDelete: number[]) => {\n    const deletedIds = JSON.parse(localStorage.getItem('deleted_ai_cards') || '[]');\n    const newDeletedIds = [...new Set([...deletedIds, ...idsToDelete])];\n    localStorage.setItem('deleted_ai_cards', JSON.stringify(newDeletedIds));\n\n    setCards(prevCards => prevCards.filter(c => !idsToDelete.includes(c.id)));\n    setFolders(prevFolders => prevFolders.map(f => ({\n      ...f,\n      cardIds: f.cardIds.filter(id => !idsToDelete.includes(id))\n    })));\n    setSelectAll(false);\n  };\n\n  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {"
);

c = c.replace(
  /onClick=\{\(e\) => e\.stopPropagation\(\)\}>\s+<Trash2 className="w-3 h-3" \/> 删除\s+<\/button>/,
  "onClick={(e) => { e.stopPropagation(); handleDeleteCards([card.id]); }}>\n                <Trash2 className=\"w-3 h-3\" /> 删除\n              </button>"
);

c = c.replace(
  /<button className="px-4 py-1\.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors text-sm font-medium">\s+批量删除\s+<\/button>/,
  "<button onClick={() => handleDeleteCards(cards.filter(c => c.selected).map(c => c.id))} className=\"px-4 py-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors text-sm font-medium\">\n                        批量删除\n                      </button>"
);

fs.writeFileSync('src/pages/GraphicLibraryV2.tsx', c);
console.log('Update complete');
