import fs from "fs";

const content = fs.readFileSync(
  "C:/Users/ACER/.gemini/antigravity/brain/b7d55dfc-98c8-432e-b0ad-30f55dadf269/.system_generated/steps/261/content.md",
  "utf-8"
);

// Check if products or catalog items are present in the HTML / JS payload
console.log("Length of content:", content.length);

const keywords = ["product", "catalog", "GleamNest", "price", "INR", "item"];
for (const kw of keywords) {
  const count = (content.match(new RegExp(kw, "gi")) || []).length;
  console.log(`Keyword "${kw}": ${count} occurrences`);
}

// Find any JSON blobs
const matches = content.match(/\{[^{}]*"name"[^{}]*\}/g);
if (matches) {
  console.log("Found JSON with name:", matches.slice(0, 10));
}

// Extract any text around GleamNest
const idx = content.indexOf("GleamNest");
if (idx !== -1) {
  console.log("Snippet around GleamNest:", content.substring(idx - 100, idx + 400));
}
