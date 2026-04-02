const fs = require('fs');
let c = fs.readFileSync('src/pages/GraphicLibraryV2.tsx', 'utf8');

const regexBadge = /\s*\{\/\* Top Right Labels \*\/\}\s*<div className="absolute top-2 right-2 flex flex-col gap-1 items-end">\s*\{isSystemCardRecord && \(\s*<div className="text-\[10px\] text-white\/80 bg-\[#135c4a\]\/60 px-1\.5 py-0\.5 rounded backdrop-blur-sm">\s*系统内置\s*<\/div>\s*\)\}\s*<\/div>/g;

c = c.replace(regexBadge, '');

const regexHover = /{card\.isUpload \? '用户上传' : 'AI生成'}/g;
c = c.replace(regexHover, "{isSystemCardRecord ? '系统内置' : card.isUpload ? '用户上传' : 'AI生成'}");

fs.writeFileSync('src/pages/GraphicLibraryV2.tsx', c);
console.log('done regex update');
