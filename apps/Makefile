.PHONY: tts tts-force dev build install

# Synthesize any missing mp3 cues into public/stretches/audio/.
# Requires OPENAI_API_KEY in the environment. Idempotent — existing files are skipped.
tts:
	bun run scripts/tts.ts

# Regenerate every clip (use after changing voice / model).
tts-force:
	bun run scripts/tts.ts --force

dev:
	bun run dev

build:
	bun run build

install:
	bun install
