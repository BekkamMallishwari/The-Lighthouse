const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');
code = code.replace('const searchText = menuSearch', 'const searchText2 = menuSearch');
fs.writeFileSync('script_fixed.js', code);
