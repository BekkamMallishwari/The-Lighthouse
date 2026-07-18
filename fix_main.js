const fs = require('fs');
let code = fs.readFileSync('main_test.js', 'utf8');

// Replace the badly merged loops
let badBlock = `  menuItems.forEach((item) => {
    const h3 = item.querySelector('h3');
    const itemName = h3 ? h3.textContent.toLowerCase() : "";
    const category = item.dataset.category || "";
    const type = item.dataset.type || item.dataset.diet || "all";
  const searchLower = searchText2.toLowerCase();

  menuItems.forEach((item) => {`;

code = code.replace(badBlock, '  const searchLower = searchText2.toLowerCase();\n\n  menuItems.forEach((item) => {');

fs.writeFileSync('main_test3.js', code);
