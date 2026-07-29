import { stat } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

const input = path.resolve("public/Water.mp4");
const output = path.resolve("public/Water-optimized.mp4");
const poster = path.resolve("public/Water-poster.webp");

async function fileSize(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg.path, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

await runFfmpeg([
  "-y",
  "-i", input,
  "-an",
  "-vf", "scale='min(1280,iw)':-2",
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "28",
  "-movflags", "+faststart",
  output,
]);

await runFfmpeg([
  "-y",
  "-i", output,
  "-ss", "00:00:01",
  "-frames:v", "1",
  "-vf", "scale='min(1280,iw)':-2",
  "-quality", "82",
  poster,
]);

const originalBytes = await fileSize(input);
const optimizedBytes = await fileSize(output);
const posterBytes = await fileSize(poster);

console.log("\nVideo optimization complete");
console.log(`Water.mp4: ${Math.round(originalBytes / 1024)} KB`);
console.log(`Water-optimized.mp4: ${Math.round(optimizedBytes / 1024)} KB`);
console.log(`Water-poster.webp: ${Math.round(posterBytes / 1024)} KB`);
console.log(`Saved: ${Math.round((originalBytes - optimizedBytes) / 1024)} KB`);
