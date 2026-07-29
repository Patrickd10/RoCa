import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve("public");
const inputExtensions = new Set([".jpg", ".jpeg", ".png"]);
const minBytes = 120 * 1024;
const quality = 82;
const maxWidth = 1600;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function webpPathFor(filePath) {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.webp`);
}

async function shouldSkip(inputPath, outputPath) {
  try {
    const [inputStats, outputStats] = await Promise.all([
      stat(inputPath),
      stat(outputPath),
    ]);

    return outputStats.mtimeMs >= inputStats.mtimeMs;
  } catch {
    return false;
  }
}

const files = (await walk(publicDir)).filter((filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return inputExtensions.has(ext);
});

let converted = 0;
let skipped = 0;
let savedBytes = 0;

for (const filePath of files) {
  const inputStats = await stat(filePath);
  if (inputStats.size < minBytes) {
    skipped += 1;
    continue;
  }

  const outputPath = webpPathFor(filePath);
  if (await shouldSkip(filePath, outputPath)) {
    skipped += 1;
    continue;
  }

  const image = sharp(filePath, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const needsResize = metadata.width && metadata.width > maxWidth;

  await image
    .resize(needsResize ? { width: maxWidth, withoutEnlargement: true } : undefined)
    .webp({ quality })
    .toFile(outputPath);

  const outputStats = await stat(outputPath);
  converted += 1;
  savedBytes += Math.max(0, inputStats.size - outputStats.size);

  const inputKb = Math.round(inputStats.size / 1024);
  const outputKb = Math.round(outputStats.size / 1024);
  console.log(`${path.relative(publicDir, filePath)} -> ${path.relative(publicDir, outputPath)} (${inputKb} KB -> ${outputKb} KB)`);
}

console.log(`\nConverted: ${converted}`);
console.log(`Skipped: ${skipped}`);
console.log(`Saved: ${Math.round(savedBytes / 1024)} KB`);
