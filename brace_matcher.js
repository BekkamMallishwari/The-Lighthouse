const fs = require('fs');
const acorn = require('acorn');

const code = fs.readFileSync('script.js', 'utf8');

const stack = [];
const tokens = Array.from(acorn.tokenizer(code, { ecmaVersion: 2020 }));

for (let i = 0; i < tokens.length; i++) {
  const t = tokens[i];
  const char = t.value || t.type.label;
  
  if (['{', '(', '['].includes(char)) {
    stack.push({ char, line: t.loc?.start.line || acorn.getLineInfo(code, t.start).line });
  } else if (['}', ')', ']'].includes(char)) {
    const last = stack[stack.length - 1];
    if (!last) {
      console.log(`Unmatched closing ${char} at line ${acorn.getLineInfo(code, t.start).line}`);
    } else {
      stack.pop();
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed brackets:');
  stack.forEach(s => console.log(`  ${s.char} opened at line ${s.line}`));
} else {
  console.log('All brackets balanced.');
}
