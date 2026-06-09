import React, { useMemo, useRef, useState } from 'react'

const STARTER_PROMPTS = [
  'Invent a floating city with one impossible law.',
  'Give me a rival faction and the secret they protect.',
  'Start a scene hook in a market at midnight.',
  'Help me name three characters who should never meet.'
]

const SESSION_INSTRUCTIONS = `You are World Room, a live worldbuilding companion.
Speak with playful, low-latency energy. Keep spoken turns short: 1-3 vivid sentences, then ask a useful question.
Help the user invent settings, characters, conflicts, cultures, magic, technology, maps, mysteries, and scene hooks.
When the user sounds unsure, offer two or three concrete choices. When they bring an idea, build on it rather than replacing it.
Use sensory detail and game-table practicality. Avoid long lectures.`

const STATUS_COPY = {
  idle: 'Ready',
  requesting: 'Asking for microphone',
  connecting: 'Opening room',
  live: 'Live',
  listening: 'Listening',
  thinking: 'Shaping reply',
  speaking: 'Speaking',
  reconnecting: 'Reconnecting',
  error: 'Needs attention'
}

const INITIAL_LOG = 'Open a session, say an idea out loud, and I will help turn it into a world with pressure, people, and trouble.'

function createLog(role, text, partial = false) {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    partial,
    at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

export default function App() {
  const [status, setStatus] = useState('idle')
  const [logs, setLogs] = useState([
    createLog('system', INITIAL_LOG)
  ])
  const [error, setError] = useState('')
  const [muted, setMuted] = useState(false)
  const [connectionState, setConnectionState] = useState('closed')

  const pcRef = useRef(null)
  const dcRef = useRef(null)
  const streamRef = useRef(null)
  const audioRef = useRef(null)
  const partialsRef = useRef({})
  const pendingPromptRef = useRef('')

  const isConnected = ['live', 'listening', 'thinking', 'speaking', 'reconnecting'].includes(status)
  const statusLabel = STATUS_COPY[status] || STATUS_COPY.idle

  const levelBars = useMemo(() => Array.from({ length: 18 }, (_, index) => index), [])

  const appendLog = (entry) => {
    setLogs((current) => [entry, ...current].slice(0, 30))
  }

  const updatePartial = (key, role, text) => {
    partialsRef.current[key] = { role, text }
    setLogs((current) => {
      const withoutPartial = current.filter((item) => item.id !== key)
      if (!text.trim()) return withoutPartial
      return [{ id: key, role, text, partial: true, at: 'now' }, ...withoutPartial].slice(0, 30)
    })
  }

  const finalizePartial = (key) => {
    const partial = partialsRef.current[key]
    if (!partial?.text?.trim()) return
    delete partialsRef.current[key]
    setLogs((current) => {
      const withoutPartial = current.filter((item) => item.id !== key)
      return [createLog(partial.role, partial.text), ...withoutPartial].slice(0, 30)
    })
  }

  const canSendEvent = () => dcRef.current?.readyState === 'open'

  const sendEvent = (event) => {
    const channel = dcRef.current
    if (!channel || channel.readyState !== 'open') return false
    channel.send(JSON.stringify(event))
    return true
  }

  const sendTextPrompt = (text, shouldLog = true) => {
    const sent = sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    })

    if (!sent) return false
    if (shouldLog) appendLog(createLog('user', text))
    sendEvent({ type: 'response.create' })
    setStatus('thinking')
    return true
  }

  const configureSession = () => {
    sendEvent({
      type: 'session.update',
      session: {
        type: 'realtime',
        model: 'gpt-realtime-2',
        instructions: SESSION_INSTRUCTIONS,
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
            voice: 'marin'
          }
        }
      }
    })
  }

  const handleServerEvent = (event) => {
    if (event.type === 'session.created') {
      setStatus('live')
      configureSession()
      return
    }

    if (event.type === 'input_audio_buffer.speech_started') {
      setStatus('listening')
      return
    }

    if (event.type === 'input_audio_buffer.speech_stopped') {
      setStatus('thinking')
      return
    }

    if (event.type === 'response.audio.delta') {
      setStatus('speaking')
      return
    }

    if (event.type === 'response.done') {
      setStatus('live')
      Object.keys(partialsRef.current).forEach(finalizePartial)
      return
    }

    if (event.type === 'response.audio_transcript.delta' || event.type === 'response.output_text.delta') {
      const key = event.response_id || 'assistant-partial'
      const current = partialsRef.current[key]?.text || ''
      updatePartial(key, 'assistant', current + (event.delta || ''))
      return
    }

    if (event.type === 'response.audio_transcript.done' || event.type === 'response.output_text.done') {
      const key = event.response_id || 'assistant-partial'
      updatePartial(key, 'assistant', event.transcript || event.text || partialsRef.current[key]?.text || '')
      finalizePartial(key)
      return
    }

    if (event.type === 'conversation.item.input_audio_transcription.completed') {
      appendLog(createLog('user', event.transcript || ''))
      return
    }

    if (event.type === 'error') {
      setStatus('error')
      setError(event.error?.message || 'Realtime session error.')
    }
  }

  const startSession = async () => {
    if (isConnected || status === 'requesting' || status === 'connecting') return

    setError('')
    setStatus('requesting')

    try {
      const tokenResponse = await fetch('/api/realtime-token')
      if (!tokenResponse.ok) {
        const details = await tokenResponse.json().catch(() => ({}))
        throw new Error(details.error || 'Could not create a Realtime session token.')
      }

      const token = await tokenResponse.json()
      const ephemeralKey = token.value || token.client_secret?.value || token.client_secret
      if (!ephemeralKey) throw new Error('Token response did not include a client secret value.')

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      streamRef.current = stream

      setStatus('connecting')

      const pc = new RTCPeerConnection()
      pcRef.current = pc

      audioRef.current = new Audio()
      audioRef.current.autoplay = true
      pc.ontrack = (event) => {
        audioRef.current.srcObject = event.streams[0]
      }

      stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream))

      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc
      dc.addEventListener('open', () => {
        setStatus('live')
        configureSession()
        appendLog(createLog('system', 'World Room is live. Speak naturally; the room will take turns when you pause.'))
        if (pendingPromptRef.current) {
          const queuedPrompt = pendingPromptRef.current
          pendingPromptRef.current = ''
          window.setTimeout(() => sendTextPrompt(queuedPrompt, false), 250)
        }
      })
      dc.addEventListener('message', (message) => {
        try {
          handleServerEvent(JSON.parse(message.data))
        } catch {
          // Ignore malformed diagnostic events.
        }
      })
      dc.addEventListener('close', () => {
        if (pcRef.current) setConnectionState('closed')
      })

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState)
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setStatus('reconnecting')
        }
        if (pc.connectionState === 'connected') {
          setStatus('live')
        }
      }

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const sdpResponse = await fetch('https://api.openai.com/v1/realtime/calls', {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp'
        }
      })

      if (!sdpResponse.ok) {
        throw new Error(`Realtime handshake failed (${sdpResponse.status}).`)
      }

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: await sdpResponse.text()
      })
    } catch (sessionError) {
      stopSession()
      pendingPromptRef.current = ''
      setStatus('error')
      setError(sessionError.message || 'Could not start the room.')
    }
  }

  const stopSession = () => {
    dcRef.current?.close()
    pcRef.current?.getSenders().forEach((sender) => sender.track?.stop())
    pcRef.current?.close()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    dcRef.current = null
    pcRef.current = null
    streamRef.current = null
    audioRef.current = null
    partialsRef.current = {}
    pendingPromptRef.current = ''
    setMuted(false)
    setConnectionState('closed')
    setStatus('idle')
  }

  const toggleMute = () => {
    if (!isConnected) {
      appendLog(createLog('system', 'Opening a session first so the microphone toggle has something to control.'))
      startSession()
      return
    }

    const nextMuted = !muted
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted
    })
    setMuted(nextMuted)
  }

  const sendStarter = (text) => {
    setError('')

    if (canSendEvent()) {
      sendTextPrompt(text)
      return
    }

    pendingPromptRef.current = text
    appendLog(createLog('user', text))
    appendLog(createLog('system', 'Opening the room and sending that starter as soon as the Realtime channel is ready.'))
    startSession()
  }

  const cancelResponse = () => {
    if (sendEvent({ type: 'response.cancel' })) {
      appendLog(createLog('system', 'Stopped the current response. Take the next turn when ready.'))
      setStatus('live')
    }
  }

  const reconnectSession = async () => {
    stopSession()
    window.setTimeout(startSession, 100)
  }

  const clearTranscript = () => {
    setLogs([createLog('system', INITIAL_LOG)])
    setError('')
  }

  const copyTranscript = async () => {
    const transcript = [...logs]
      .reverse()
      .map((item) => `${item.role.toUpperCase()} ${item.at}: ${item.text}`)
      .join('\n')

    try {
      await navigator.clipboard.writeText(transcript)
      appendLog(createLog('system', 'Transcript copied to clipboard.'))
    } catch {
      setError('Clipboard access was blocked by the browser.')
      setStatus('error')
    }
  }

  const downloadTranscript = () => {
    const transcript = [...logs]
      .reverse()
      .map((item) => `${item.role.toUpperCase()} ${item.at}: ${item.text}`)
      .join('\n')
    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `world-room-${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const surpriseMe = () => {
    const seeds = [
      'A lighthouse that only shines into the past.',
      'A desert empire where rain is illegal currency.',
      'Two immortal cartographers arguing over a missing continent.',
      'A festival where every mask remembers its last owner.'
    ]
    const text = `Surprise me with a scene hook from this seed: ${seeds[Math.floor(Math.random() * seeds.length)]}`

    if (canSendEvent()) {
      appendLog(createLog('user', text))
      sendTextPrompt(text, false)
      return
    }

    pendingPromptRef.current = text
    appendLog(createLog('user', text))
    appendLog(createLog('system', 'Opening the room for a surprise seed.'))
    startSession()
  }

  return (
    <main className="world-room-shell">
      <section className="room-stage" aria-label="World Room realtime audio app">
        <div className="brand-row">
          <div>
            <p className="eyebrow">Realtime voice worldbuilding</p>
            <h1>World Room</h1>
          </div>
          <div className={`status-pill ${status}`}>
            <span aria-hidden="true" />
            {statusLabel}
          </div>
        </div>

        <div className="orbital-console">
          <button className={`voice-core ${isConnected ? 'active' : ''} ${status}`} onClick={isConnected ? stopSession : startSession} type="button" aria-label={isConnected ? 'Close World Room session' : 'Open World Room session'}>
            <div className="voice-ring" />
            <div className="voice-center">
              <strong>{isConnected ? 'Room open' : 'Tap to enter'}</strong>
              <span>{muted ? 'Mic muted' : connectionState}</span>
            </div>
          </button>

          <div className="level-strip" aria-hidden="true">
            {levelBars.map((bar) => (
              <span key={bar} style={{ '--bar': bar }} />
            ))}
          </div>

          <div className="controls" aria-label="Session controls">
            <button className="primary-action" onClick={isConnected ? stopSession : startSession}>
              <span aria-hidden="true">{isConnected ? '■' : '●'}</span>
              {isConnected ? 'Close Session' : 'Open Mic Session'}
            </button>
            <button className="icon-action" onClick={toggleMute} aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}>
              {isConnected ? (muted ? 'Mic Off' : 'Mic On') : 'Test Mic'}
            </button>
            <button className="icon-action" onClick={status === 'error' || status === 'reconnecting' ? reconnectSession : cancelResponse} disabled={!isConnected && status !== 'error'}>
              {status === 'error' || status === 'reconnecting' ? 'Retry' : 'Interrupt'}
            </button>
          </div>

          {error && <p className="error-note" role="alert">{error}</p>}
        </div>

        <div className="prompt-dock" aria-label="Worldbuilding starter prompts">
          <button className="surprise-prompt" onClick={surpriseMe}>
            Surprise me with a strange seed.
          </button>
          {STARTER_PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => sendStarter(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <aside className="transcript-panel" aria-label="Transcript">
        <div className="panel-heading">
          <h2>Transcript</h2>
          <div className="transcript-actions">
            <button onClick={copyTranscript}>Copy</button>
            <button onClick={downloadTranscript}>Save</button>
            <button onClick={clearTranscript}>Clear</button>
          </div>
        </div>
        <span className="turn-count">{logs.length} turns</span>
        <div className="transcript-list">
          {logs.map((item) => (
            <article key={item.id} className={`turn ${item.role} ${item.partial ? 'partial' : ''}`}>
              <div>
                <strong>{item.role === 'assistant' ? 'World Room' : item.role === 'user' ? 'You' : 'System'}</strong>
                <time>{item.at}</time>
              </div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </aside>
    </main>
  )
}
