// Generates src/data/downloadSizes.json — a map of library doc key ("book|phb") -> byte size
// of the on-demand content file (src/data/data/{book,adventure}/{type}-{id}.json). These are
// the same files served from GitHub for download, so the byte size is an accurate estimate of
// the download size shown in the Library screen.
//
// Run after refreshing the book/adventure content:  node scripts/generate-download-sizes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data', 'data');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'downloadSizes.json');

const sizes = {};

for (const type of ['book', 'adventure']) {
    const dir = path.join(DATA_DIR, type);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
        const m = file.match(new RegExp(`^${type}-(.+)\\.json$`));
        if (!m) continue;
        const id = m[1].toLowerCase();
        const bytes = fs.statSync(path.join(dir, file)).size;
        sizes[`${type}|${id}`] = bytes;
    }
}

const ordered = Object.fromEntries(Object.keys(sizes).sort().map(k => [k, sizes[k]]));
fs.writeFileSync(OUT_FILE, JSON.stringify(ordered, null, 0) + '\n');
console.log(`wrote ${Object.keys(ordered).length} sizes -> ${path.relative(ROOT, OUT_FILE)}`);
