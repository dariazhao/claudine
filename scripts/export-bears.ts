/**
 * Export all 16 EmotionBear faces as high-res PNG files.
 * Output: public/bears/png/{emotion}.png  (512×512 transparent background)
 *         public/bears/svg/{emotion}.svg  (60×60 source SVG)
 *
 * Run: npx tsx scripts/export-bears.ts
 */

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

// ── Shared SVG layers ─────────────────────────────────────────────────────────

const BASE = `
  <circle cx="11" cy="13" r="9" fill="#c8956c"/>
  <circle cx="11" cy="13" r="5.5" fill="#e8c4a0"/>
  <circle cx="49" cy="13" r="9" fill="#c8956c"/>
  <circle cx="49" cy="13" r="5.5" fill="#e8c4a0"/>
  <circle cx="30" cy="30" r="24" fill="#c8956c"/>
  <ellipse cx="30" cy="38" rx="12" ry="9" fill="#e8c4a0"/>
`;

const NOSE = `<ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848"/>`;

const blush = (opacity: number) => `
  <circle cx="17" cy="34" r="5" fill="#f4a0b0" opacity="${opacity}"/>
  <circle cx="43" cy="34" r="5" fill="#f4a0b0" opacity="${opacity}"/>
`;

// ── Face expressions ──────────────────────────────────────────────────────────

const FACES: Record<string, string> = {
  ecstatic: `
    <path d="M 14 22 Q 22 12 30 22" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 30 22 Q 38 12 46 22" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="17" cy="35" r="6" fill="#f4a0b0" opacity="0.6"/>
    <circle cx="43" cy="35" r="6" fill="#f4a0b0" opacity="0.6"/>
    ${NOSE}
    <path d="M 19 39 Q 30 50 41 39" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <text x="8" y="14" font-size="8" fill="#fbbf24" opacity="0.9">✦</text>
    <text x="42" y="14" font-size="8" fill="#fbbf24" opacity="0.9">✦</text>
  `,

  joyful: `
    <path d="M 18 23 Q 23 17 28 23" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 32 23 Q 37 17 42 23" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${blush(0.5)}
    ${NOSE}
    <path d="M 22 39 Q 30 47 38 39" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,

  excited: `
    <text x="16" y="29" font-size="11" fill="#f59e0b">★</text>
    <text x="32" y="29" font-size="11" fill="#f59e0b">★</text>
    ${blush(0.6)}
    ${NOSE}
    <path d="M 21 40 Q 30 49 39 40" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,

  hopeful: `
    <circle cx="22" cy="26" r="3" fill="#1a0a00"/>
    <circle cx="38" cy="26" r="3" fill="#1a0a00"/>
    <circle cx="23" cy="24" r="1.2" fill="white"/>
    <circle cx="39" cy="24" r="1.2" fill="white"/>
    ${blush(0.35)}
    ${NOSE}
    <path d="M 23 40 Q 30 45 37 40" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `,

  content: `
    <path d="M 18 24 Q 22 29 27 24" stroke="#1a0a00" stroke-width="2.5" fill="#1a0a00" stroke-linecap="round"/>
    <path d="M 33 24 Q 37 29 42 24" stroke="#1a0a00" stroke-width="2.5" fill="#1a0a00" stroke-linecap="round"/>
    ${blush(0.35)}
    ${NOSE}
    <path d="M 23 40 Q 30 45 37 40" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `,

  calm: `
    <path d="M 18 24 Q 22 29 27 24" stroke="#1a0a00" stroke-width="2.5" fill="#1a0a00" stroke-linecap="round"/>
    <path d="M 33 24 Q 37 29 42 24" stroke="#1a0a00" stroke-width="2.5" fill="#1a0a00" stroke-linecap="round"/>
    ${blush(0.35)}
    ${NOSE}
    <path d="M 23 39 Q 30 44 37 39" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
  `,

  peaceful: `
    <path d="M 18 25 Q 22 29 27 25" stroke="#1a0a00" stroke-width="2" fill="#1a0a00" stroke-linecap="round"/>
    <path d="M 33 25 Q 37 29 42 25" stroke="#1a0a00" stroke-width="2" fill="#1a0a00" stroke-linecap="round"/>
    ${blush(0.2)}
    ${NOSE}
    <path d="M 24 40 Q 30 43 36 40" stroke="#1a0a00" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,

  tired: `
    <path d="M 18 25 Q 22 30 27 25" stroke="#1a0a00" stroke-width="2.5" fill="#1a0a00" stroke-linecap="round"/>
    <path d="M 33 25 Q 37 30 42 25" stroke="#1a0a00" stroke-width="2.5" fill="#1a0a00" stroke-linecap="round"/>
    ${blush(0.25)}
    ${NOSE}
    <path d="M 25 40 Q 30 44 35 40" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <text x="40" y="18" font-size="7" fill="#c8956c" font-weight="bold" opacity="0.8">z</text>
  `,

  pensive: `
    <ellipse cx="22" cy="26" rx="3.5" ry="2" fill="#1a0a00"/>
    <ellipse cx="38" cy="26" rx="3.5" ry="2" fill="#1a0a00"/>
    <line x1="18" y1="23" x2="26" y2="24.5" stroke="#1a0a00" stroke-width="1.5"/>
    <line x1="34" y1="24.5" x2="42" y2="23" stroke="#1a0a00" stroke-width="1.5"/>
    ${blush(0.2)}
    ${NOSE}
    <line x1="24" y1="41" x2="36" y2="41" stroke="#1a0a00" stroke-width="1.8" stroke-linecap="round"/>
  `,

  lonely: `
    <circle cx="22" cy="26" r="2.5" fill="#1a0a00"/>
    <circle cx="38" cy="26" r="2.5" fill="#1a0a00"/>
    <circle cx="22.5" cy="25" r="0.8" fill="white"/>
    <circle cx="38.5" cy="25" r="0.8" fill="white"/>
    ${NOSE}
    <path d="M 24 42 Q 30 37 36 42" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="31" rx="1.2" ry="2" fill="#93c5fd" opacity="0.7"/>
  `,

  sad: `
    <circle cx="22" cy="25" r="3.5" fill="#1a0a00"/>
    <circle cx="38" cy="25" r="3.5" fill="#1a0a00"/>
    <circle cx="23.5" cy="23.5" r="1.2" fill="white"/>
    <circle cx="39.5" cy="23.5" r="1.2" fill="white"/>
    ${blush(0.2)}
    ${NOSE}
    <path d="M 22 43 Q 30 37 38 43" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="43" cy="31" rx="1.5" ry="2.5" fill="#93c5fd" opacity="0.8"/>
  `,

  afraid: `
    <circle cx="22" cy="25" r="5" fill="#1a0a00"/>
    <circle cx="38" cy="25" r="5" fill="#1a0a00"/>
    <circle cx="20" cy="23" r="2" fill="white"/>
    <circle cx="36" cy="23" r="2" fill="white"/>
    <path d="M 15 18 Q 22 14 28 19" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M 32 19 Q 38 14 45 18" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${blush(0.15)}
    ${NOSE}
    <path d="M 22 41 Q 24 38 27 41 Q 30 38 33 41 Q 36 38 38 41" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `,

  worried: `
    <circle cx="22" cy="25" r="3" fill="#1a0a00"/>
    <circle cx="38" cy="25" r="3" fill="#1a0a00"/>
    <circle cx="23" cy="23.5" r="1" fill="white"/>
    <circle cx="39" cy="23.5" r="1" fill="white"/>
    <path d="M 17 18 Q 22 15 27 19" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M 33 19 Q 38 15 43 18" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${blush(0.2)}
    ${NOSE}
    <path d="M 22 41 Q 27 37 30 39 Q 33 41 38 37" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `,

  overwhelmed: `
    <circle cx="22" cy="25" r="5.5" fill="#1a0a00"/>
    <circle cx="38" cy="25" r="5.5" fill="#1a0a00"/>
    <circle cx="20" cy="22.5" r="2.2" fill="white"/>
    <circle cx="36" cy="22.5" r="2.2" fill="white"/>
    <path d="M 15 16 Q 22 12 28 17" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 32 17 Q 38 12 45 16" stroke="#1a0a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${NOSE}
    <ellipse cx="30" cy="42" rx="4" ry="3" fill="#1a0a00" opacity="0.85"/>
    <path d="M 36 19 L 38 14" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M 40 22 L 44 17" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  `,

  frustrated: `
    <circle cx="22" cy="26" r="3.5" fill="#1a0a00"/>
    <circle cx="38" cy="26" r="3.5" fill="#1a0a00"/>
    <path d="M 16 17 L 27 21" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/>
    <path d="M 33 21 L 44 17" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/>
    <circle cx="17" cy="35" r="4" fill="#f4956b" opacity="0.4"/>
    <circle cx="43" cy="35" r="4" fill="#f4956b" opacity="0.4"/>
    ${NOSE}
    <path d="M 22 43 Q 30 38 38 43" stroke="#1a0a00" stroke-width="2" fill="none" stroke-linecap="round"/>
    <text x="42" y="12" font-size="8" fill="#f4956b" opacity="0.7">~</text>
  `,

  irritable: `
    <circle cx="22" cy="25" r="3.5" fill="#1a0a00"/>
    <circle cx="38" cy="25" r="3.5" fill="#1a0a00"/>
    <path d="M 16 18 L 27 21" stroke="#1a0a00" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 33 21 L 44 18" stroke="#1a0a00" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="17" cy="35" r="4" fill="#f4956b" opacity="0.3"/>
    <circle cx="43" cy="35" r="4" fill="#f4956b" opacity="0.3"/>
    ${NOSE}
    <path d="M 23 42 Q 27 38 30 40 Q 33 42 37 38" stroke="#1a0a00" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `,
};

// ── Build SVG string ──────────────────────────────────────────────────────────

function buildSVG(emotion: string, sizePx = 512): string {
  const face = FACES[emotion];
  if (!face) throw new Error(`Unknown emotion: ${emotion}`);
  // Add padding: bear sits in 60×60 viewBox, add 6px padding on each side → 72×72 viewBox
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" viewBox="-6 -6 72 72">
  ${BASE}
  ${face}
</svg>`;
}

// ── Export ────────────────────────────────────────────────────────────────────

const SVG_DIR = path.join(process.cwd(), "public", "bears", "svg");
const PNG_DIR = path.join(process.cwd(), "public", "bears", "png");

async function main() {
  const emotions = Object.keys(FACES);
  console.log(`Exporting ${emotions.length} bear faces…\n`);

  for (const emotion of emotions) {
    const svgString = buildSVG(emotion);

    // Write SVG source
    const svgPath = path.join(SVG_DIR, `${emotion}.svg`);
    fs.writeFileSync(svgPath, svgString, "utf8");

    // Convert to PNG via sharp (512×512, transparent background)
    const pngPath = path.join(PNG_DIR, `${emotion}.png`);
    await sharp(Buffer.from(svgString))
      .resize(512, 512)
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(pngPath);

    const stat = fs.statSync(pngPath);
    console.log(`  ✓ ${emotion.padEnd(14)} → ${(stat.size / 1024).toFixed(0)} KB`);
  }

  console.log(`\nDone!`);
  console.log(`  SVGs: public/bears/svg/`);
  console.log(`  PNGs: public/bears/png/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
