import re

with open('script.js', 'r') as f:
    content = f.read()

# Remove single line comments
content = re.sub(r'//.*', '', content)
# Remove block comments
content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
# Remove strings (double, single, backtick)
content = re.sub(r'"(?:\\.|[^"\\])*"', '""', content)
content = re.sub(r"'(?:\\.|[^'\\])*'", "''", content)
content = re.sub(r"`(?:\\.|[^`\\])*`", "``", content)
# Now just check balance of { } ( ) [ ]
counts = {'{': 0, '(': 0, '[': 0}
matching = {'}': '{', ')': '(', ']': '['}

for i, char in enumerate(content):
    if char in counts:
        counts[char] += 1
    elif char in matching:
        counts[matching[char]] -= 1
        if counts[matching[char]] < 0:
            print(f"Extra closing {char} around character index {i}")
            counts[matching[char]] = 0 # reset to not double report

print("Remaining open brackets:", counts)
