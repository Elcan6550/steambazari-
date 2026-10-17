const fs = require('fs');
const buf = fs.readFileSync(process.env.TEMP + '/ch_hist.db');
const str = buf.toString('binary');
const matches = str.match(/http[s]?:\/\/[a-zA-Z0-9_\-\.:]+/g) || [];
const unique = [...new Set(matches)].filter(u => u.includes('3000') || u.includes('netlify') || u.includes('steambazari'));
console.log(unique);
