const fs = require('fs');
const path = require('path');

const dirs = [
  'languages/catalog',
  'languages/compatibility',
  'languages/generators',
  'languages/examples'
];

dirs.forEach(d => {
  const targetDir = path.join(__dirname, '..', d);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
});

const activeLanguages = [
  {
    id: "lang_typescript",
    name: "TypeScript",
    family: "JavaScript",
    paradigms: ["object-oriented", "functional"],
    status: "active",
    website: "https://www.typescriptlang.org/",
    repository: "https://github.com/microsoft/TypeScript",
    packageManagers: ["npm", "yarn", "pnpm"],
    apiSupport: {}
  },
  {
    id: "lang_python",
    name: "Python",
    family: "Python",
    paradigms: ["object-oriented", "imperative", "functional"],
    status: "active",
    website: "https://www.python.org/",
    repository: "https://github.com/python/cpython",
    packageManagers: ["pip", "poetry"],
    apiSupport: {}
  }
];

fs.writeFileSync(
  path.join(__dirname, '../languages/catalog/active.json'),
  JSON.stringify(activeLanguages, null, 2)
);

console.log('✅ Phase 3: Language Universe Catalog scaffolded successfully!');
