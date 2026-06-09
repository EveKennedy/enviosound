import React, { useMemo, useRef, useState } from "react";

const places = [
  { id: "galway", name: "Galway", vibe: "Coastal busker mood", tracks: 42, image: "https://images.unsplash.com/photo-1522872527593-0f30223eb522?auto=format&fit=crop&w=900&q=80", sounds: ["waves", "wind", "buskers", "soft crowds"], reco: "Atlantic Drift", desc: "Waves, wind, buskers, soft crowds, and a coastal music profile." },
  { id: "dublin", name: "Dublin", vibe: "Urban rhythm", tracks: 58, image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=900&q=80", sounds: ["traffic", "footsteps", "street performers"], reco: "Street Pulse", desc: "Traffic, footsteps, street performers, and a busy city rhythm." },
  { id: "cliffs", name: "Cliffs of Moher", vibe: "Cinematic calm", tracks: 31, image: "https://images.unsplash.com/photo-1609501676725-7186f734d4db?auto=format&fit=crop&w=900&q=80", sounds: ["wind", "waves", "open space"], reco: "Atlantic Vast", desc: "Wind, waves, open space, and slow cinematic calm." },
  { id: "london", name: "London", vibe: "Modern city documentary", tracks: 73, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80", sounds: ["underground", "rain", "crosswalks"], reco: "Afterlight Camden", desc: "Moody synths and polished beats for cinematic city vlogs." },
  { id: "paris", name: "Paris", vibe: "Romantic city mood", tracks: 64, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80", sounds: ["cafes", "footsteps", "metro"], reco: "Rue Lumiere", desc: "Cafes, footsteps, metro texture, and a romantic city profile." },
  { id: "barcelona", name: "Barcelona", vibe: "Energetic street rhythm", tracks: 49, image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80", sounds: ["crowds", "waves", "street rhythm"], reco: "Golden Ramblas", desc: "Crowds, waves, street rhythm, and energetic percussion." },
  { id: "cork", name: "Cork", vibe: "Warm indie mood", tracks: 27, image: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=900&q=80", sounds: ["city ambience", "cafes", "river"], reco: "Marina Morning", desc: "City ambience, cafes, river movement, and a warm indie profile." }
];

const locationProfiles = {
  Galway: { averageVolume: 0.42, dynamicRange: 0.44, brightness: 0.48, lowEnergy: 0.46, noiseLevel: 0.38, pulseIntensity: 0.34, calmBusy: "calm", natureUrban: "nature", detected: ["waves", "wind", "buskers", "soft crowds"] },
  Dublin: { averageVolume: 0.68, dynamicRange: 0.62, brightness: 0.66, lowEnergy: 0.62, noiseLevel: 0.72, pulseIntensity: 0.72, calmBusy: "busy", natureUrban: "urban", detected: ["traffic", "footsteps", "street performers"] },
  "Cliffs of Moher": { averageVolume: 0.36, dynamicRange: 0.58, brightness: 0.42, lowEnergy: 0.54, noiseLevel: 0.31, pulseIntensity: 0.22, calmBusy: "calm", natureUrban: "nature", detected: ["wind", "waves", "open space"] },
  Cork: { averageVolume: 0.49, dynamicRange: 0.46, brightness: 0.52, lowEnergy: 0.44, noiseLevel: 0.44, pulseIntensity: 0.43, calmBusy: "balanced", natureUrban: "urban", detected: ["city ambience", "cafes", "river"] },
  Paris: { averageVolume: 0.52, dynamicRange: 0.45, brightness: 0.58, lowEnergy: 0.48, noiseLevel: 0.50, pulseIntensity: 0.46, calmBusy: "balanced", natureUrban: "urban", detected: ["cafes", "footsteps", "metro"] },
  Barcelona: { averageVolume: 0.73, dynamicRange: 0.60, brightness: 0.72, lowEnergy: 0.58, noiseLevel: 0.65, pulseIntensity: 0.78, calmBusy: "busy", natureUrban: "urban", detected: ["crowds", "waves", "street rhythm"] }
};

const artists = [
  { name: "Aoife Lane", location: "Galway", song: "Spanish Arch Sunrise", vibe: "indie folk" },
  { name: "Mika Dubois", location: "Paris", song: "Cafe After Rain", vibe: "dreamy piano" },
  { name: "Rafa Sol", location: "Barcelona", song: "Gracia Noon", vibe: "sunlit guitar" },
  { name: "Niamh K.", location: "Dublin", song: "Liffey Gold", vibe: "city pop" }
];

const projects = [
  { name: "Galway Weekend Vlog", location: "Galway", mood: "Coastal cinematic", track: "Atlantic Drift", status: "Ready to export" },
  { name: "Dublin City Reel", location: "Dublin", mood: "Urban energetic", track: "Street Pulse", status: "Ready to export" },
  { name: "Cliffs of Moher Montage", location: "Cliffs of Moher", mood: "Cinematic calm", track: "Atlantic Vast", status: "Ready to export" }
];

const tabs = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "map", label: "Map", icon: "⌖" },
  { id: "generate", label: "Generate", icon: "✦" },
  { id: "artists", label: "Artists", icon: "♬" },
  { id: "saved", label: "Saved", icon: "▣" }
];

function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [location, setLocation] = useState("Galway");
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const currentPlace = useMemo(
    () => places.find((place) => place.name === location) || selectedPlace,
    [location, selectedPlace]
  );

  const startDemo = () => {
    setOnboarded(true);
    choosePlace(places[0], "generate");
  };

  const choosePlace = (place, nextTab = "map") => {
    setSelectedPlace(place);
    setLocation(place.name);
    setTab(nextTab);
  };

  return (
    <main className="app-shell">
      <section className="phone">
        <div className="status-bar">
          <span>9:41</span>
          <span>5G 100%</span>
        </div>

        {!onboarded ? (
          <Onboarding onStart={startDemo} onExplore={() => setOnboarded(true)} />
        ) : (
          <>
            <div className="screen">
              {tab === "home" && <Home onChoose={choosePlace} />}
              {tab === "map" && <MapScreen selected={selectedPlace} onBack={() => setTab("home")} onSelect={choosePlace} onCreate={(place) => choosePlace(place, "generate")} />}
              {tab === "generate" && (
                <Generator
                  location={location}
                  setLocation={setLocation}
                  place={currentPlace}
                  generatedTrack={generatedTrack}
                  setGeneratedTrack={setGeneratedTrack}
                  onPreview={() => setTab("preview")}
                  onBack={() => setTab("home")}
                />
              )}
              {tab === "preview" && (
                <Preview
                  track={generatedTrack}
                  place={currentPlace}
                  onBack={() => setTab("generate")}
                  onUse={() => {
                    setTab("saved");
                    setShowProfile(false);
                  }}
                />
              )}
              {tab === "artists" && <Artists onBack={() => setTab("home")} />}
              {tab === "saved" && (showProfile ? <Profile onBack={() => setShowProfile(false)} /> : <Saved onBack={() => setTab("home")} onProfile={() => setShowProfile(true)} />)}
            </div>
            {tab !== "preview" && (
              <nav className="tabbar">
                {tabs.map((item) => (
                  <button className={tab === item.id ? "active" : ""} key={item.id} onClick={() => setTab(item.id)}>
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Onboarding({ onStart, onExplore }) {
  return (
    <div className="onboarding">
      <div className="brand-pill">EnvioSound</div>
      <div className="hero-copy">
        <p>AI-assisted sound analysis and procedural music generation</p>
        <h1>Soundtrack your journey</h1>
        <span>Generate music from places, waves, streets, parks, and real environmental sound.</span>
      </div>
      <div className="glass-panel">
        <div>
          <strong>Place-to-Music Generator</strong>
          <span>Record 15 seconds or use a location profile.</span>
        </div>
        <button onClick={onStart}>Get Started</button>
        <button className="ghost" onClick={onExplore}>Explore Demo</button>
      </div>
    </div>
  );
}

function Home({ onChoose }) {
  return (
    <div className="stack">
      <header className="top-header">
        <div>
          <p>EnvioSound</p>
          <h2>Where are you filming today?</h2>
        </div>
        <div className="avatar">TC</div>
      </header>
      <label className="search">Search a city, landmark, or vibe</label>
      <div className="value-row">
        <span>Generated from environmental sound features</span>
        <span>Made for travel vlogs, reels and short films</span>
      </div>
      <section>
        <div className="section-title">
          <h3>Trending travel soundtracks</h3>
          <small>Creator-safe loops</small>
        </div>
        <div className="place-list">
          {places.slice(0, 5).map((place) => (
            <article className="place-card" key={place.id} style={{ backgroundImage: `linear-gradient(180deg, rgba(7,10,18,.1), rgba(7,10,18,.86)), url(${place.image})` }}>
              <div>
                <strong>{place.name}</strong>
                <span>{place.vibe}</span>
              </div>
              <div className="card-footer">
                <small>{place.tracks} profiles</small>
                <button onClick={() => onChoose(place, "generate")}>Find soundtrack</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MapScreen({ selected, onBack, onSelect, onCreate }) {
  const pinPositions = {
    Galway: [18, 23],
    Dublin: [36, 36],
    Cork: [29, 64],
    "Cliffs of Moher": [13, 41],
    Paris: [63, 54],
    Barcelona: [78, 76]
  };

  return (
    <div className="map-screen">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Location average mode</p>
          <h2>Tap a place to generate from its sound profile</h2>
        </div>
      </header>
      <div className="map-canvas">
        <div className="map-grid" />
        {places.filter((place) => pinPositions[place.name]).map((place) => (
          <button
            className={`pin ${selected.name === place.name ? "selected" : ""}`}
            key={place.id}
            style={{ left: `${pinPositions[place.name][0]}%`, top: `${pinPositions[place.name][1]}%` }}
            onClick={() => onSelect(place, "map")}
            aria-label={place.name}
          >
            <span />
            <small>{place.name}</small>
          </button>
        ))}
      </div>
      <div className="bottom-sheet">
        <img src={selected.image} alt="" />
        <div>
          <p>{selected.vibe}</p>
          <h3>{selected.name}</h3>
          <span>{selected.desc}</span>
          <div className="chips">
            {selected.sounds.map((sound) => <small key={sound}>{sound}</small>)}
          </div>
          <strong>Average profile track: {selected.reco}</strong>
          <button onClick={() => onCreate(selected)}>Create vlog soundtrack</button>
        </div>
      </div>
    </div>
  );
}

function Generator({ location, setLocation, place, generatedTrack, setGeneratedTrack, onPreview, onBack }) {
  const [mode, setMode] = useState("location");
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(15);
  const [error, setError] = useState("");
  const [bars, setBars] = useState(Array.from({ length: 24 }, () => 10));
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);
  const sourceRef = useRef(null);

  const generateFromLocation = async () => {
    setMode("location");
    setError("");
    setStatus("analysing");
    await wait(320);
    const profile = locationProfiles[location] || locationProfiles.Galway;
    setStatus("generating");
    await wait(320);
    const track = await createProceduralTrack(profile, `selected location: ${location}`);
    setGeneratedTrack(track);
    setStatus("ready");
  };

  const startRecording = async () => {
    setMode("recording");
    setError("");
    setGeneratedTrack(null);
    setCountdown(15);
    setStatus("recording");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      monitorInputBars(analyser, setBars, rafRef);

      const chunks = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        stopInput(streamRef, audioContextRef, rafRef);
        setStatus("analysing");
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const decodeContext = new AudioContext();
        const audioBuffer = await decodeContext.decodeAudioData(arrayBuffer.slice(0));
        await decodeContext.close();
        const profile = analyseAudioBuffer(audioBuffer);
        setStatus("generating");
        const track = await createProceduralTrack(profile, "recorded 15-second environment", blob);
        setGeneratedTrack(track);
        setStatus("ready");
      };

      recorder.start();
      let remaining = 15;
      const interval = window.setInterval(() => {
        remaining -= 1;
        setCountdown(Math.max(remaining, 0));
        if (remaining <= 0) {
          window.clearInterval(interval);
          recorder.stop();
        }
      }, 1000);
    } catch (recordingError) {
      setStatus("idle");
      setError("Microphone permission is needed to record your environment.");
      stopInput(streamRef, audioContextRef, rafRef);
    }
  };

  return (
    <div className="stack generator">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Place-to-Music Generator</p>
          <h2>AI-assisted sound analysis and procedural music generation</h2>
          <span>Record your environment or use an average place profile, then generate a real playable loop.</span>
        </div>
      </header>

      <div className="mode-switch">
        <button className={mode === "location" ? "selected" : ""} onClick={() => setMode("location")}>Location profile</button>
        <button className={mode === "recording" ? "selected" : ""} onClick={() => setMode("recording")}>Record my environment</button>
      </div>

      <SelectRow label="Location" value={location} setValue={setLocation} options={Object.keys(locationProfiles)} />

      <section className="record-card">
        <div>
          <h3>{mode === "recording" ? "Record exactly 15 seconds" : "Use average sound profile"}</h3>
          <p>{mode === "recording" ? "The microphone captures volume, brightness, rumble, rhythm and noise texture." : `${location} profile: ${(locationProfiles[location]?.detected || []).join(", ")}`}</p>
        </div>
        {mode === "recording" && (
          <>
            <div className="countdown">{status === "recording" ? countdown : 15}</div>
            <div className="live-bars">
              {bars.map((bar, index) => <i key={index} style={{ height: `${bar}%` }} />)}
            </div>
          </>
        )}
        <button className="primary-action" disabled={status === "recording" || status === "analysing" || status === "generating"} onClick={mode === "recording" ? startRecording : generateFromLocation}>
          {mode === "recording" ? "Record 15 seconds" : "Generate from location"}
        </button>
        {error && <strong className="error-text">{error}</strong>}
      </section>

      {status !== "idle" && status !== "ready" && (
        <div className="loading-card">
          <div className="spinner" />
          <span>{status === "recording" ? "Recording your environment..." : status === "analysing" ? "Analysing your environment..." : "Creating your travel soundtrack..."}</span>
          <small>Extracting volume, dynamic range, brightness, low energy, pulse and texture.</small>
        </div>
      )}

      {generatedTrack && (
        <GeneratedResult track={generatedTrack} place={place} onPreview={onPreview} sourceRef={sourceRef} />
      )}

      <GeneratorImageGallery activePlace={place} />
    </div>
  );
}

function GeneratorImageGallery({ activePlace }) {
  const galleryPlaces = [activePlace, ...places.filter((place) => place.id !== activePlace.id)].slice(0, 5);

  return (
    <section className="generator-gallery">
      <div className="section-title">
        <h3>Sound profiles by place</h3>
        <small>Visual mood board</small>
      </div>
      <div className="gallery-scroll">
        {galleryPlaces.map((place) => (
          <article className="gallery-card" key={place.id} style={{ backgroundImage: `linear-gradient(180deg, rgba(7,10,18,.05), rgba(7,10,18,.76)), url(${place.image})` }}>
            <span>{place.vibe}</span>
            <strong>{place.name}</strong>
            <small>{place.sounds.slice(0, 3).join(" · ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function GeneratedResult({ track, place, onPreview, sourceRef }) {
  return (
    <div className="result-card expanded">
      <div className="mini-cover" style={{ backgroundImage: `url(${place.image})` }} />
      <div className="result-copy">
        <p>Generated from environmental sound features</p>
        <h3>{track.title}</h3>
        <span>{track.source} · {track.mood}</span>
        <div className="profile-list">
          {track.profile.detected.map((item) => <small key={item}>{item}</small>)}
        </div>
        <div className="meta-grid">
          <small>BPM <b>{track.bpm}</b></small>
          <small>Instruments <b>{track.instruments.join(", ")}</b></small>
          <small>License <b>Creator-safe original loop</b></small>
        </div>
        <FeatureGrid features={track.features} />
        <div className="button-row">
          <button onClick={() => playTrack(track, sourceRef)}>Play</button>
          <button onClick={() => saveTrack(track)}>Save</button>
          <a className="download-button" href={track.wavUrl} download={`${track.title.replaceAll(" ", "-").toLowerCase()}.wav`}>Export</a>
          <button className="dark" onClick={onPreview}>Preview</button>
        </div>
      </div>
    </div>
  );
}

function FeatureGrid({ features }) {
  return (
    <div className="feature-grid">
      {Object.entries(features).map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <b>{typeof value === "number" ? `${Math.round(value * 100)}%` : value}</b>
        </div>
      ))}
    </div>
  );
}

function SelectRow({ label, value, setValue, options }) {
  return (
    <label className="select-row">
      <span>{label}</span>
      <select value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Preview({ track, place, onBack, onUse }) {
  const sourceRef = useRef(null);
  const safeTrack = track || createFallbackTrack(place);

  return (
    <div className="preview-screen">
      <div className="preview-actions">
        <button className="back-link dark-text" onClick={onBack}>Return to generator</button>
        <button className="back-link dark-text" onClick={onUse}>Use in vlog</button>
      </div>
      <div className="cover-art" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,10,16,.05), rgba(8,10,16,.82)), url(${place.image})` }}>
        <span>Generated loop</span>
        <h2>{safeTrack.title}</h2>
        <p>{safeTrack.mood}</p>
      </div>
      <div className="waveform" aria-label="Generated waveform">
        {safeTrack.waveform.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      </div>
      <button className="play-button" onClick={() => playTrack(safeTrack, sourceRef)}>Play generated music</button>
      <div className="chips large">
        {[safeTrack.mood, safeTrack.source, "creator-safe", "procedural"].map((tag) => <small key={tag}>{tag}</small>)}
      </div>
      <FeatureGrid features={safeTrack.features} />
      <a className="primary-action download-link" href={safeTrack.wavUrl} download={`${safeTrack.title.replaceAll(" ", "-").toLowerCase()}.wav`}>Export for video</a>
      <button className="secondary-action" onClick={() => navigator.clipboard?.writeText(`${safeTrack.title} - generated with EnvioSound from environmental sound features.`)}>Copy credit</button>
    </div>
  );
}

function Artists({ onBack }) {
  return (
    <div className="stack">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Support local artists</p>
          <h2>Local sounds from local artists</h2>
          <span>Artists can attach original songs to locations so vloggers can use local music with recognition.</span>
        </div>
      </header>
      <div className="artist-list">
        {artists.map((artist) => (
          <article className="artist-card" key={artist.name}>
            <div className="artist-orb">{artist.name.split(" ").map((part) => part[0]).join("")}</div>
            <div>
              <h3>{artist.name}</h3>
              <p>{artist.location} · {artist.song}</p>
              <span>{artist.vibe}</span>
            </div>
            <button>Play</button>
            <button className="credit">Use with credit</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Saved({ onBack, onProfile }) {
  const saved = JSON.parse(localStorage.getItem("enviosound-saved") || "[]");
  const allProjects = [...saved.map((track) => ({ name: `${track.title} Project`, location: track.source, mood: track.mood, track: track.title, status: "Ready to export" })), ...projects];

  return (
    <div className="stack">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header">
        <div>
          <p>Saved projects</p>
          <h2>Ready for your next edit</h2>
        </div>
        <button className="avatar button-avatar" onClick={onProfile}>TC</button>
      </header>
      {allProjects.map((project) => (
        <article className="project-card" key={`${project.name}-${project.track}`}>
          <div>
            <h3>{project.name}</h3>
            <p>{project.location} · {project.mood}</p>
            <span>{project.track}</span>
          </div>
          <strong>{project.status}</strong>
        </article>
      ))}
    </div>
  );
}

function Profile({ onBack }) {
  return (
    <div className="stack">
      <button className="back-link dark-text" onClick={onBack}>Back</button>
      <section className="profile-card">
        <div className="profile-avatar">TC</div>
        <h2>Travel Creator</h2>
        <p>Creator profile</p>
      </section>
      {[
        ["Saved tracks", "18"],
        ["Export history", "7 video exports"],
        ["Artist credits used", "4 local artists"],
        ["Settings", "Licenses, downloads, creator defaults"]
      ].map(([label, value]) => (
        <article className="settings-row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </div>
  );
}

async function createProceduralTrack(profile, source, recordingBlob = null) {
  const bpm = chooseBpm(profile);
  const mood = chooseMood(profile);
  const title = chooseTitle(profile, source);
  const instruments = chooseInstruments(profile);
  const duration = profile.calmBusy === "busy" ? 18 : 22;
  const sampleRate = 44100;
  const context = new OfflineAudioContext(2, duration * sampleRate, sampleRate);
  const master = context.createGain();
  master.gain.value = 0.74;
  master.connect(context.destination);

  const beat = 60 / bpm;
  const scale = profile.brightness > 0.62 ? [0, 2, 4, 7, 9, 12] : [0, 3, 5, 7, 10, 12];
  const root = profile.natureUrban === "urban" ? 146.83 : 130.81;
  const chords = [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]];

  addAmbientTexture(context, master, profile, duration);
  addChordProgression(context, master, root, chords, beat, duration, profile);
  addMelody(context, master, root, scale, beat, duration, profile);
  addBass(context, master, root, beat, duration, profile);
  addPercussion(context, master, beat, duration, profile);

  const buffer = await context.startRendering();
  const wavBlob = encodeWav(buffer);
  const wavUrl = URL.createObjectURL(wavBlob);
  const waveform = extractWaveform(buffer);

  return {
    title,
    source,
    recordingBlob,
    mood,
    bpm,
    instruments,
    profile,
    buffer,
    wavBlob,
    wavUrl,
    waveform,
    features: {
      "Average volume": profile.averageVolume,
      "Dynamic range": profile.dynamicRange,
      Brightness: profile.brightness,
      "Low energy": profile.lowEnergy,
      Noise: profile.noiseLevel,
      Pulse: profile.pulseIntensity,
      "Calm/busy": profile.calmBusy,
      "Nature/urban": profile.natureUrban
    }
  };
}

function analyseAudioBuffer(buffer) {
  const channel = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(channel.length / 22050));
  let sum = 0;
  let peak = 0;
  let zeroCrossings = 0;
  let previous = channel[0] || 0;
  const envelope = [];

  for (let i = 0; i < channel.length; i += step) {
    const value = channel[i];
    sum += value * value;
    peak = Math.max(peak, Math.abs(value));
    if ((value >= 0 && previous < 0) || (value < 0 && previous >= 0)) zeroCrossings += 1;
    previous = value;
  }

  const windowSize = Math.max(512, Math.floor(buffer.sampleRate * 0.08));
  for (let i = 0; i < channel.length; i += windowSize) {
    let windowSum = 0;
    for (let j = i; j < Math.min(i + windowSize, channel.length); j += 1) {
      windowSum += Math.abs(channel[j]);
    }
    envelope.push(windowSum / windowSize);
  }

  const rms = Math.sqrt(sum / Math.ceil(channel.length / step));
  const averageVolume = clamp(rms * 6);
  const dynamicRange = clamp((peak - rms) * 4);
  const brightness = clamp((zeroCrossings / Math.ceil(channel.length / step)) * 32);
  const lowEnergy = clamp(1 - brightness * 0.55 + averageVolume * 0.25);
  const pulseIntensity = clamp(calculatePulse(envelope) * 4);
  const noiseLevel = clamp(brightness * 0.45 + dynamicRange * 0.25 + averageVolume * 0.25);
  const calmBusy = pulseIntensity > 0.58 || noiseLevel > 0.62 ? "busy" : averageVolume < 0.35 ? "calm" : "balanced";
  const natureUrban = noiseLevel > 0.58 && pulseIntensity > 0.44 ? "urban" : "nature";
  const detected = detectSoundHints({ averageVolume, dynamicRange, brightness, lowEnergy, noiseLevel, pulseIntensity, calmBusy, natureUrban });

  return { averageVolume, dynamicRange, brightness, lowEnergy, noiseLevel, pulseIntensity, calmBusy, natureUrban, detected };
}

function calculatePulse(envelope) {
  if (envelope.length < 4) return 0.2;
  const mean = envelope.reduce((total, item) => total + item, 0) / envelope.length;
  const changes = envelope.map((value) => Math.abs(value - mean));
  const variance = changes.reduce((total, item) => total + item, 0) / changes.length;
  let repeated = 0;
  for (let i = 2; i < envelope.length; i += 1) {
    if (envelope[i] > mean && envelope[i - 2] > mean) repeated += 1;
  }
  return clamp(variance * 12 + repeated / envelope.length);
}

function detectSoundHints(profile) {
  const hints = [];
  if (profile.lowEnergy > 0.62) hints.push("low rumble");
  if (profile.brightness > 0.66) hints.push("birds or bright peaks");
  if (profile.noiseLevel > 0.62) hints.push(profile.natureUrban === "urban" ? "traffic/crowds" : "rain/wind texture");
  if (profile.pulseIntensity > 0.58) hints.push("repeated pulses");
  if (profile.calmBusy === "calm") hints.push("smooth ambience");
  if (hints.length < 3) hints.push(profile.natureUrban === "urban" ? "city texture" : "wind or waves");
  return hints.slice(0, 4);
}

function addAmbientTexture(context, master, profile, duration) {
  const gain = context.createGain();
  gain.gain.value = profile.averageVolume < 0.45 ? 0.18 : 0.10;
  gain.connect(master);
  for (let i = 0; i < duration; i += 0.25) {
    const oscillator = context.createOscillator();
    const toneGain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = profile.natureUrban === "nature" ? 220 + Math.sin(i) * 24 : 174 + Math.sin(i * 0.7) * 18;
    toneGain.gain.setValueAtTime(0, i);
    toneGain.gain.linearRampToValueAtTime(0.05, i + 0.08);
    toneGain.gain.linearRampToValueAtTime(0, i + 0.45);
    oscillator.connect(toneGain).connect(gain);
    oscillator.start(i);
    oscillator.stop(i + 0.5);
  }
}

function addChordProgression(context, master, root, chords, beat, duration, profile) {
  const chordGain = context.createGain();
  chordGain.gain.value = profile.averageVolume < 0.55 ? 0.16 : 0.11;
  chordGain.connect(master);
  const chordLength = beat * 4;
  for (let time = 0, index = 0; time < duration; time += chordLength, index += 1) {
    chords[index % chords.length].forEach((semi) => {
      addNote(context, chordGain, root * Math.pow(2, semi / 12), time, chordLength * 0.95, "triangle", 0.10);
    });
  }
}

function addMelody(context, master, root, scale, beat, duration, profile) {
  const melodyGain = context.createGain();
  melodyGain.gain.value = profile.brightness > 0.62 ? 0.18 : 0.12;
  melodyGain.connect(master);
  const interval = profile.pulseIntensity > 0.55 ? beat / 2 : beat;
  for (let time = beat, step = 0; time < duration; time += interval, step += 1) {
    if (step % 4 === 3 && profile.calmBusy === "calm") continue;
    const semi = scale[(step * 2 + Math.round(profile.brightness * 5)) % scale.length] + 12;
    addNote(context, melodyGain, root * Math.pow(2, semi / 12), time, interval * 0.65, profile.brightness > 0.62 ? "sine" : "triangle", 0.16);
    if (profile.brightness > 0.72 && step % 6 === 0) {
      addNote(context, melodyGain, root * Math.pow(2, (semi + 7) / 12), time + interval * 0.32, interval * 0.35, "sine", 0.10);
    }
  }
}

function addBass(context, master, root, beat, duration, profile) {
  if (profile.lowEnergy < 0.35 && profile.natureUrban !== "urban") return;
  const bassGain = context.createGain();
  bassGain.gain.value = 0.18 + profile.lowEnergy * 0.16;
  bassGain.connect(master);
  const pattern = profile.natureUrban === "urban" ? [0, 0, 7, 5] : [0, 0, 5, 3];
  for (let time = 0, step = 0; time < duration; time += beat, step += 1) {
    if (profile.calmBusy === "calm" && step % 2) continue;
    addNote(context, bassGain, (root / 2) * Math.pow(2, pattern[step % pattern.length] / 12), time, beat * 0.72, "sawtooth", 0.13);
  }
}

function addPercussion(context, master, beat, duration, profile) {
  const drumGain = context.createGain();
  drumGain.gain.value = 0.20 + profile.averageVolume * 0.25;
  drumGain.connect(master);
  for (let time = 0, step = 0; time < duration; time += beat / 2, step += 1) {
    if (step % 4 === 0 && profile.averageVolume > 0.38) addKick(context, drumGain, time, profile);
    if (step % 4 === 2 && profile.pulseIntensity > 0.35) addSnare(context, drumGain, time, profile);
    if (profile.brightness > 0.46 && (profile.calmBusy === "busy" || step % 2 === 0)) addHat(context, drumGain, time, profile);
  }
}

function addNote(context, destination, frequency, start, duration, type, volume) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + Math.max(0.05, duration));
  oscillator.connect(gain).connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function addKick(context, destination, time, profile) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(110 + profile.lowEnergy * 45, time);
  oscillator.frequency.exponentialRampToValueAtTime(42, time + 0.16);
  gain.gain.setValueAtTime(0.24 + profile.averageVolume * 0.22, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
  oscillator.connect(gain).connect(destination);
  oscillator.start(time);
  oscillator.stop(time + 0.24);
}

function addSnare(context, destination, time, profile) {
  const buffer = context.createBuffer(1, context.sampleRate * 0.16, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.value = 0.10 + profile.noiseLevel * 0.15;
  source.connect(gain).connect(destination);
  source.start(time);
}

function addHat(context, destination, time, profile) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = 6500 + profile.brightness * 1800;
  gain.gain.setValueAtTime(0.035 + profile.brightness * 0.045, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
  oscillator.connect(gain).connect(destination);
  oscillator.start(time);
  oscillator.stop(time + 0.05);
}

function chooseBpm(profile) {
  return Math.round(72 + profile.pulseIntensity * 42 + profile.noiseLevel * 18 + profile.averageVolume * 12);
}

function chooseMood(profile) {
  if (profile.natureUrban === "nature" && profile.calmBusy === "calm") return profile.brightness > 0.62 ? "Peaceful nature" : "Coastal cinematic";
  if (profile.natureUrban === "urban" && profile.calmBusy === "busy") return "Urban energetic";
  if (profile.brightness > 0.68) return "Bright travel montage";
  return "Warm cinematic";
}

function chooseTitle(profile, source) {
  if (profile.natureUrban === "urban" && profile.calmBusy === "busy") return "Street Pulse";
  if (profile.natureUrban === "nature" && profile.brightness > 0.62) return "Morning Canopy";
  if (source.includes("Galway") || profile.detected.includes("wind or waves") || profile.detected.includes("smooth ambience")) return "Atlantic Drift";
  return profile.calmBusy === "calm" ? "Soft Horizon" : "City Light Loop";
}

function chooseInstruments(profile) {
  const instruments = [];
  instruments.push(profile.averageVolume > 0.55 ? "strong drums" : "soft pads");
  if (profile.brightness > 0.55) instruments.push("bells/plucks");
  if (profile.lowEnergy > 0.44) instruments.push("bass line");
  if (profile.pulseIntensity > 0.42) instruments.push("rhythmic percussion");
  instruments.push(profile.natureUrban === "urban" ? "synth texture" : "ambient wave texture");
  return instruments;
}

function playTrack(track, sourceRef) {
  if (!track?.buffer) return;
  const context = new AudioContext();
  if (sourceRef.current) sourceRef.current.stop();
  const source = context.createBufferSource();
  source.buffer = track.buffer;
  source.connect(context.destination);
  source.start();
  sourceRef.current = source;
}

function saveTrack(track) {
  const saved = JSON.parse(localStorage.getItem("enviosound-saved") || "[]");
  localStorage.setItem("enviosound-saved", JSON.stringify([{ title: track.title, mood: track.mood, source: track.source }, ...saved].slice(0, 10)));
}

function createFallbackTrack(place) {
  const profile = locationProfiles[place.name] || locationProfiles.Galway;
  return { title: place.reco, source: place.name, mood: chooseMood(profile), waveform: Array.from({ length: 34 }, (_, index) => 18 + ((index * 13) % 52)), features: { "Average volume": profile.averageVolume, Brightness: profile.brightness, Pulse: profile.pulseIntensity }, wavUrl: "#", buffer: null };
}

function monitorInputBars(analyser, setBars, rafRef) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  const tick = () => {
    analyser.getByteFrequencyData(data);
    const bucketSize = Math.floor(data.length / 24);
    const nextBars = Array.from({ length: 24 }, (_, index) => {
      const bucket = data.slice(index * bucketSize, (index + 1) * bucketSize);
      const average = bucket.reduce((total, value) => total + value, 0) / Math.max(1, bucket.length);
      return 8 + (average / 255) * 88;
    });
    setBars(nextBars);
    rafRef.current = requestAnimationFrame(tick);
  };
  tick();
}

function stopInput(streamRef, audioContextRef, rafRef) {
  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  streamRef.current?.getTracks().forEach((track) => track.stop());
  audioContextRef.current?.close();
  streamRef.current = null;
  audioContextRef.current = null;
}

function encodeWav(buffer) {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels = Array.from({ length: numberOfChannels }, (_, index) => buffer.getChannelData(index));
  let offset = 0;

  writeString(view, offset, "RIFF"); offset += 4;
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString(view, offset, "WAVE"); offset += 4;
  writeString(view, offset, "fmt "); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numberOfChannels, true); offset += 2;
  view.setUint32(offset, buffer.sampleRate, true); offset += 4;
  view.setUint32(offset, buffer.sampleRate * numberOfChannels * 2, true); offset += 4;
  view.setUint16(offset, numberOfChannels * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(view, offset, "data"); offset += 4;
  view.setUint32(offset, length - offset - 4, true); offset += 4;

  for (let i = 0; i < buffer.length; i += 1) {
    for (let channel = 0; channel < numberOfChannels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i += 1) view.setUint8(offset + i, string.charCodeAt(i));
}

function extractWaveform(buffer) {
  const data = buffer.getChannelData(0);
  const bars = 34;
  const block = Math.floor(data.length / bars);
  return Array.from({ length: bars }, (_, index) => {
    let peak = 0;
    for (let i = index * block; i < (index + 1) * block; i += 1) peak = Math.max(peak, Math.abs(data[i] || 0));
    return 18 + clamp(peak * 4) * 72;
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}

export default App;
