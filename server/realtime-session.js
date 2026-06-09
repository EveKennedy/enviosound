import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

for (const line of readDotEnv()) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
  const [key, ...valueParts] = trimmed.split('=')
  if (!process.env[key]) process.env[key] = valueParts.join('=').replace(/^["']|["']$/g, '')
}

const PORT = Number(process.env.REALTIME_SERVER_PORT || 8787)
const MODEL = process.env.REALTIME_MODEL || 'gpt-realtime-2'
const VOICE = process.env.REALTIME_VOICE || 'marin'

const instructions = `You are World Room, a live worldbuilding companion.
Speak with playful, low-latency energy. Keep spoken turns short: 1-3 vivid sentences, then ask a useful question.
Help invent settings, characters, conflicts, cultures, magic, technology, maps, mysteries, and scene hooks.
When the user sounds unsure, offer two or three concrete choices. Build on the user's ideas rather than replacing them.`

function readDotEnv() {
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return []
  return fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  })
  res.end(JSON.stringify(payload))
}

function safetyIdentifier(req) {
  const address = req.socket.remoteAddress || 'local-dev'
  return crypto.createHash('sha256').update(`world-room:${address}`).digest('hex')
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
    res.end()
    return
  }

  if (req.method !== 'GET' || req.url !== '/api/realtime-token') {
    sendJson(res, 404, { error: 'Not found' })
    return
  }

  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, { error: 'OPENAI_API_KEY is not set on the server.' })
    return
  }

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Safety-Identifier': safetyIdentifier(req)
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: MODEL,
          instructions,
          output_modalities: ['audio'],
          audio: {
            input: {
              turn_detection: {
                type: 'semantic_vad',
                create_response: true,
                interrupt_response: true
              }
            },
            output: {
              voice: VOICE
            }
          }
        }
      })
    })

    const text = await response.text()
    if (!response.ok) {
      sendJson(res, response.status, {
        error: 'OpenAI could not create a Realtime client secret.',
        details: text
      })
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    })
    res.end(text)
  } catch (error) {
    sendJson(res, 500, {
      error: 'Failed to create Realtime client secret.',
      details: error.message
    })
  }
})

server.listen(PORT, () => {
  console.log(`World Room Realtime token server listening on http://localhost:${PORT}`)
})
