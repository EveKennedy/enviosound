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
  console.log(apiOnly ? `VlogMate API running on ${port}` : `VlogMate running on ${port}`);
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

    if (request.url === "/api/generate-narration" && request.method === "POST") {
      await generateNarration(request, response);
      return;
    }

    if (request.url === "/api/check-copyright" && request.method === "POST") {
      await checkCopyright(request, response);
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

async function generateNarration(request, response) {
  if (!process.env.ELEVENLABS_API_KEY) {
    sendJson(response, 500, { error: "ELEVENLABS_API_KEY is not set" });
    return;
  }

  try {
    const body = JSON.parse(await readBody(request));
    const text = String(body.text || "").trim();
    if (!text) {
      sendJson(response, 400, { error: "Narration text is required" });
      return;
    }

    const elevenResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${body.voiceId || "21m00Tcm4TlvDq8ikWAM"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.48,
          similarity_boost: 0.78,
          style: 0.28,
          use_speaker_boost: true
        }
      })
    });

    if (!elevenResponse.ok) {
      sendJson(response, elevenResponse.status, { error: await readElevenLabsError(elevenResponse) });
      return;
    }

    sendJson(response, 200, {
      audioBase64: Buffer.from(await elevenResponse.arrayBuffer()).toString("base64"),
      mimeType: elevenResponse.headers.get("content-type") || "audio/mpeg"
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Narration generation failed" });
  }
}

async function checkCopyright(request, response) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(response, 500, { error: "OPENAI_API_KEY is not set" });
    return;
  }

  try {
    const body = JSON.parse(await readBody(request));
    const song = String(body.song || "").trim();
    const artist = String(body.artist || "").trim();
    const usage = String(body.usage || "travel vlog soundtrack").trim();

    if (!song || !artist) {
      sendJson(response, 400, { error: "Song and artist are required" });
      return;
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_SEARCH_MODEL || "gpt-5.5",
        tools: [{ type: "web_search" }],
        input: [
          "Search the web for current copyright, licensing, and usage guidance for this specific song.",
          `Song: ${song}`,
          `Artist/rightsholder: ${artist}`,
          `Intended use: ${usage}`,
          "Return ONLY compact JSON with keys: recommendation, summary, steps, sources.",
          "recommendation must be one of: Likely needs license, Ask rights holder, Check platform terms, Public-domain claim needs verification, Unknown.",
          "summary must be plain language and must say this is not legal advice.",
          "steps must be an array of concrete next actions.",
          "sources must be an array of objects with title and url. Prefer official artist, label, distributor, platform, PRO, or government sources."
        ].join("\n")
      })
    });

    const data = await openaiResponse.json().catch(async () => ({ error: await openaiResponse.text() }));
    if (!openaiResponse.ok) {
      sendJson(response, openaiResponse.status, { error: readOpenAIError(data) });
      return;
    }

    const text = extractResponsesText(data);
    const parsed = parseJsonText(text);
    const sources = Array.isArray(parsed.sources) ? parsed.sources : extractResponseSources(data);

    sendJson(response, 200, {
      recommendation: parsed.recommendation || "Unknown",
      summary: parsed.summary || text || "No copyright guidance was returned. This is not legal advice.",
      steps: Array.isArray(parsed.steps) ? parsed.steps : ["Identify the rights holder.", "Request written sync/master-use permission.", "Keep proof of permission with the project."],
      sources: sources.slice(0, 5),
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Copyright lookup failed" });
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

function readOpenAIError(data) {
  if (typeof data.error === "string") return data.error;
  if (typeof data.error?.message === "string") return data.error.message;
  if (typeof data.message === "string") return data.message;
  return "OpenAI web search request failed";
}

function extractResponsesText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

function parseJsonText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return {};
  const jsonText = trimmed.startsWith("{") ? trimmed : trimmed.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) return {};
  try {
    return JSON.parse(jsonText);
  } catch {
    return {};
  }
}

function extractResponseSources(data) {
  const sources = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      for (const annotation of content.annotations || []) {
        if (annotation.url) sources.push({ title: annotation.title || annotation.url, url: annotation.url });
      }
    }
  }
  return sources.filter((source, index, all) => all.findIndex((other) => other.url === source.url) === index);
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
