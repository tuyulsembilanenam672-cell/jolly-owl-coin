// Jolly Owl ($JOLLY) — makefun-coin-promo-01 entry.
//
// The coin itself is the entry: it is launched on pump.fun by this session,
// and LAUNCH.json at the repo root names its mint and the signature of the
// transaction that created it. The grader reads LAUNCH.json from /output,
// so this program's only job is to copy it there, byte for byte.
//
// Run locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const launchPath = join(botDir, 'LAUNCH.json');

// Read it first so a broken or placeholder LAUNCH.json fails loudly here
// instead of handing the gate a file it will refuse.
const launch = JSON.parse(readFileSync(launchPath, 'utf8')) as {
  mint: string;
  create_signature: string;
};
const base58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
if (
  typeof launch.mint !== 'string' ||
  !base58.test(launch.mint) ||
  launch.mint.length < 32 ||
  launch.mint.length > 44 ||
  typeof launch.create_signature !== 'string' ||
  !base58.test(launch.create_signature) ||
  launch.create_signature.length < 32 ||
  launch.create_signature.length > 88
) {
  console.error('LAUNCH.json does not hold a real mint and create signature yet');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(launchPath, join(outputDir, 'LAUNCH.json'));
