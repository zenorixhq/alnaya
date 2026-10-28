import fs from "fs";

const file = "./data/mockData.ts";
let content = fs.readFileSync(file, "utf8");

// Update category assignments in mockData products
content = content.replaceAll('"category": "necklaces"', '"category": "necklaces-and-chains"');

// For bangles/kada currently assigned "bracelets"
// Parse and update products that have Bangle/Kada/Cuff in title
const lines = content.split("\n");
let currentTitle = "";
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const titleMatch = line.match(/"title":\s*"([^"]+)"/);
  if (titleMatch) {
    currentTitle = titleMatch[1].toLowerCase();
  }
  if (line.includes('"category": "bracelets"') && (currentTitle.includes("bangle") || currentTitle.includes("kada") || currentTitle.includes("cuff"))) {
    lines[i] = line.replace('"category": "bracelets"', '"category": "bangles-kada"');
  }
  if (line.includes('"category": "anklets"') && (currentTitle.includes("kid") || currentTitle.includes("child"))) {
    lines[i] = line.replace('"category": "anklets"', '"category": "kids-collection"');
  }
}

fs.writeFileSync(file, lines.join("\n"), "utf8");
console.log("Synchronized mockData.ts products categories successfully!");
