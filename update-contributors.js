import fs from "fs/promises";
const OWNER = "atakanbayil";        // <- change
const REPO  = "changelogR";         // <- change
const GH_TOKEN = process.env.GH_TOKEN;

if (!GH_TOKEN) {
  console.error("GH_TOKEN env var is required");
  process.exit(1);
}

const contributors = [];
let page = 1;
while (true) {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contributors?per_page=100&page=${page}`,
    { headers: { Authorization: `Bearer ${GH_TOKEN}`, "User-Agent": "contributors-script" } }
  );
  if (!res.ok) {
    console.error("GitHub API error:", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  if (!data.length) break;
  contributors.push(...data);
  page++;
}

// Build a simple SVG grid
const size = 48, gap = 8, cols = 12;
const rows = Math.ceil(contributors.length / cols);
const width = cols * (size + gap) - gap;
const height = rows * (size + gap) - gap;

const items = contributors.map((c, i) => {
  const x = (i % cols) * (size + gap);
  const y = Math.floor(i / cols) * (size + gap);
  const href = `https://github.com/${c.login}`;
  const avatar = `${c.avatar_url}&s=${size*2}`; // high-DPI
  return `
    <a xlink:href="${href}" target="_blank">
      <image x="${x}" y="${y}" width="${size}" height="${size}" href="${avatar}" clip-path="url(#r)"/>
    </a>`;
}).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs><clipPath id="r"><rect rx="8" ry="8" x="0" y="0" width="${size}" height="${size}"/></clipPath></defs>
  ${items}
</svg>`;

await fs.writeFile("contributors.svg", svg, "utf8");
console.log(`Wrote contributors.svg with ${contributors.length} avatars`);