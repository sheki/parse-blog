// scripts/tts.ts — idempotent OpenAI TTS sync for the stretches app.
// Run: OPENAI_API_KEY=sk-... bun run scripts/tts.ts
// Writes mp3s into public/stretches/audio/. Skips files that already exist.

import { mkdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

import { exercises, fixedCues } from "../src/data/stretches";

const OPENAI_URL = "https://api.openai.com/v1/audio/speech";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    model: { type: "string", default: "tts-1" },
    voice: { type: "string", default: "nova" },
    out: { type: "string", default: "public/stretches/audio" },
    force: { type: "boolean", default: false },
  },
});

interface Clip {
  name: string;
  text: string;
}

function buildClipList(): Clip[] {
  const clips: Clip[] = [];
  for (const [name, text] of Object.entries(fixedCues)) {
    clips.push({ name, text });
  }
  for (const ex of exercises) {
    clips.push({ name: `ex_${ex.slug}`, text: `${ex.name}.` });
  }
  return clips;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function synth(text: string, dest: string): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const resp = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: values.model,
      voice: values.voice,
      input: text,
      response_format: "mp3",
    }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`openai ${resp.status}: ${body.slice(0, 400)}`);
  }
  const buf = Buffer.from(await resp.arrayBuffer());
  const tmp = `${dest}.part`;
  await writeFile(tmp, buf);
  try {
    await rename(tmp, dest);
  } catch (err) {
    await unlink(tmp).catch(() => {});
    throw err;
  }
}

async function main(): Promise<void> {
  const outDir = resolve(values.out);
  await mkdir(outDir, { recursive: true });

  const clips = buildClipList();
  const pending: Clip[] = [];
  for (const c of clips) {
    const path = resolve(outDir, `${c.name}.mp3`);
    if (!values.force && (await fileExists(path))) continue;
    pending.push(c);
  }

  if (pending.length === 0) {
    console.log(`nothing to do (${clips.length} clips already present in ${outDir})`);
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error(`OPENAI_API_KEY is not set, but ${pending.length} clips need to be generated`);
    process.exit(1);
  }

  console.log(
    `generating ${pending.length} clips into ${outDir} (model=${values.model} voice=${values.voice})`,
  );
  for (let i = 0; i < pending.length; i++) {
    const c = pending[i];
    const dest = resolve(outDir, `${c.name}.mp3`);
    console.log(`  [${i + 1}/${pending.length}] ${c.name}.mp3 ← ${JSON.stringify(c.text)}`);
    await synth(c.text, dest);
  }
  console.log("done");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
