import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const dist = join(root, "dist");
const apiOnly = process.argv.includes("--api-only");
loadEnv();
const port = Number(process.env.API_PORT || process.env.PORT || 8787);

createServer().listen(port, "0.0.0.0", () => {
  console.log(apiOnly ? `EnvioSound API running on ${port}` : `EnvioSound running on ${port}`);
});

function createServer() {
  return createHttpServer(async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.url === "/api/generate-music" && request.method === "POST") {
      await generateMusic(request, response);
      return;
    }

    if (apiOnly) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    await serveStatic(request, response);
  });
}

async function generateMusic(request, response) {
  if (!process.env.ELEVENLABS_API_KEY) {
    sendJson(response, 500, { error: "ELEVENLABS_API_KEY is not set" });
    return;
  }

  try {
    const body = JSON.parse(await readBody(request));
    const prompt = buildPrompt(body);
    const elevenResponse = await fetch("https://api.elevenlabs.io/v1/music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: Math.max(10000, Math.min(30000, Number(body.durationMs) || 15000)),
        model_id: "music_v1",
        force_instrumental: true
      })
    });

    if (!elevenResponse.ok) {
      sendJson(response, elevenResponse.status, { error: await readElevenLabsError(elevenResponse) });
      return;
    }

    const arrayBuffer = await elevenResponse.arrayBuffer();
    sendJson(response, 200, {
      audioBase64: Buffer.from(arrayBuffer).toString("base64"),
      mimeType: elevenResponse.headers.get("content-type") || "audio/mpeg",
      songId: elevenResponse.headers.get("song-id") || "",
      prompt
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Music generation failed" });
  }
}

function buildPrompt(body) {
  const profile = body.profile || {};
  const dna = body.soundDna || {};
  const scores = dna.scores || {};
  const instruments = Array.isArray(body.instruments) ? body.instruments.join(", ") : "warm keys, soft percussion, atmospheric texture";
  const detected = Array.isArray(profile.detected) ? profile.detected.join(", ") : "local ambience";
  const bpm = Number(body.bpm) || 90;
  const mood = body.mood || "cinematic travel";
  const location = body.location || "the selected place";

  return [
    `Create an original instrumental travel vlog soundtrack for ${location}.`,
    `Mood: ${mood}. Tempo around ${bpm} BPM.`,
    `Environmental sounds: ${detected}.`,
    `Sound DNA: natural ${scores.natural || 0}%, human activity ${scores.human || 0}%, urban activity ${scores.urban || 0}%.`,
    `Use ${instruments}.`,
    "Make it cinematic, warm, place-focused, loopable, and suitable as copyright-safe background music for travel video.",
    "No vocals, no lyrics, no artist references, no imitation of existing songs."
  ].join(" ");
}

async function serveStatic(request, response) {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const requested = pathname === "/" ? "index.html" : pathname.slice(1);
  const file = resolve(dist, requested);

  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) {
    createReadStream(join(dist, "index.html")).pipe(response);
    return;
  }

  response.setHeader("Content-Type", contentType(file));
  createReadStream(file).pipe(response);
}

function readBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy();
    });
    request.on("end", () => resolveBody(body));
    request.on("error", rejectBody);
  });
}

async function readElevenLabsError(response) {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.detail?.message === "string") return data.detail.message;
    if (typeof data.message === "string") return data.message;
    return text;
  } catch {
    return text || "ElevenLabs request failed";
  }
}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

function contentType(file) {
  return {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
  }[extname(file)] || "application/octet-stream";
}

function loadEnv() {
  const file = join(root, ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...value] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = value.join("=").replace(/^['"]|['"]$/g, "");
  }
}
