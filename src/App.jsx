import React, { useMemo, useRef, useState } from "react";

const places = [
  { id: "galway", name: "Galway", vibe: "Coastal busker mood", tracks: 42, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Galway%20-%20Spanish%20Arch.JPG?width=900", sounds: ["waves", "wind", "buskers", "soft crowds"], reco: "Atlantic Drift", desc: "Waves, wind, buskers, soft crowds, and a coastal music profile." },
  { id: "dublin", name: "Dublin", vibe: "Urban rhythm", tracks: 58, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dublin%20Ha%27Penny%20bridge%20768.jpg?width=900", sounds: ["traffic", "footsteps", "street performers"], reco: "Street Pulse", desc: "Traffic, footsteps, street performers, and a busy city rhythm." },
  { id: "cliffs", name: "Cliffs of Moher", vibe: "Cinematic calm", tracks: 31, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cliffs-Of-Moher-OBriens-From-South.JPG?width=900", sounds: ["wind", "waves", "open space"], reco: "Atlantic Vast", desc: "Wind, waves, open space, and slow cinematic calm." },
  { id: "london", name: "London", vibe: "Modern city documentary", tracks: 73, image: "https://commons.wikimedia.org/wiki/Special:FilePath/London%20Skyline%20%28125508655%29.jpeg?width=900", sounds: ["underground", "rain", "crosswalks"], reco: "Afterlight Camden", desc: "Moody synths and polished beats for cinematic city vlogs." },
  { id: "paris", name: "Paris", vibe: "Romantic city mood", tracks: 64, image: "https://commons.wikimedia.org/wiki/Special:FilePath/La%20Tour%20Eiffel%20vue%20de%20la%20Tour%20Saint-Jacques%2C%20Paris%20ao%C3%BBt%202014%20%282%29.jpg?width=900", sounds: ["cafes", "footsteps", "metro"], reco: "Rue Lumiere", desc: "Cafes, footsteps, metro texture, and a romantic city profile." },
  { id: "barcelona", name: "Barcelona", vibe: "Energetic street rhythm", tracks: 49, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%20Barcelona%2C%20Spain%20%2851227309370%29%20edited.jpg?width=900", sounds: ["crowds", "waves", "street rhythm"], reco: "Golden Ramblas", desc: "Crowds, waves, street rhythm, and energetic percussion." },
  { id: "cork", name: "Cork", vibe: "Warm indie mood", tracks: 27, image: "https://commons.wikimedia.org/wiki/Special:FilePath/River%20Lee%20at%20Cork.jpg?width=900", sounds: ["city ambience", "cafes", "river"], reco: "Marina Morning", desc: "City ambience, cafes, river movement, and a warm indie profile." },
  { id: "lisbon", name: "Lisbon", vibe: "Golden tram sunset", tracks: 38, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lisboa%20-%20Portugal%20%2852597836992%29.jpg?width=900", sounds: ["trams", "hillside streets", "guitar"], reco: "Alfama Glow", desc: "Trams, tiled streets, guitar echoes, and warm evening movement." },
  { id: "rome", name: "Rome", vibe: "Ancient city warmth", tracks: 46, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Trevi%20Fountain%2C%20Rome%2C%20Italy%202%20-%20May%202007.jpg?width=900", sounds: ["piazzas", "fountains", "scooters"], reco: "Piazza Memory", desc: "Fountains, scooters, footsteps, and a romantic documentary pulse." },
  { id: "reykjavik", name: "Reykjavik", vibe: "Nordic open air", tracks: 22, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reykjav%C3%ADk%2C%20view%20from%20Hallgr%C3%ADmskirkja%20%282%29.jpg?width=900", sounds: ["wind", "harbour", "open roads"], reco: "Northern Quiet", desc: "Cold wind, harbour ambience, open roads, and spacious ambient tones." },
  { id: "tokyo", name: "Tokyo", vibe: "Night walk energy", tracks: 81, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Skyscrapers%20of%20Shinjuku%202009%20January.jpg?width=900", sounds: ["crossings", "train chimes", "rain signs"], reco: "Shibuya Afterimage", desc: "Train chimes, rain, crossings, and bright night rhythm." },
  { id: "marrakech", name: "Marrakech", vibe: "Market dusk texture", tracks: 34, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pavillon%20Menarag%C3%A4rten.jpg?width=900", sounds: ["markets", "hand drums", "courtyards"], reco: "Medina Dust", desc: "Market voices, hand drums, courtyards, and warm textured percussion." },
  { id: "newyork", name: "New York", vibe: "Street film rhythm", tracks: 76, image: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Empire%20State%20Building%20from%20Rockefeller%20Center%20New%20York%20City%20dllu%20%28cropped%29.jpg?width=900", sounds: ["subway", "traffic", "footsteps"], reco: "Avenue Cut", desc: "Subway movement, traffic, footsteps, and a fast documentary groove." }
];

const locationProfiles = {
  Galway: { averageVolume: 0.42, dynamicRange: 0.44, brightness: 0.48, lowEnergy: 0.46, noiseLevel: 0.38, pulseIntensity: 0.34, calmBusy: "calm", natureUrban: "nature", detected: ["waves", "wind", "buskers", "soft crowds"] },
  Dublin: { averageVolume: 0.68, dynamicRange: 0.62, brightness: 0.66, lowEnergy: 0.62, noiseLevel: 0.72, pulseIntensity: 0.72, calmBusy: "busy", natureUrban: "urban", detected: ["traffic", "footsteps", "street performers"] },
  "Cliffs of Moher": { averageVolume: 0.36, dynamicRange: 0.58, brightness: 0.42, lowEnergy: 0.54, noiseLevel: 0.31, pulseIntensity: 0.22, calmBusy: "calm", natureUrban: "nature", detected: ["wind", "waves", "open space"] },
  Cork: { averageVolume: 0.49, dynamicRange: 0.46, brightness: 0.52, lowEnergy: 0.44, noiseLevel: 0.44, pulseIntensity: 0.43, calmBusy: "balanced", natureUrban: "urban", detected: ["city ambience", "cafes", "river"] },
  Paris: { averageVolume: 0.52, dynamicRange: 0.45, brightness: 0.58, lowEnergy: 0.48, noiseLevel: 0.50, pulseIntensity: 0.46, calmBusy: "balanced", natureUrban: "urban", detected: ["cafes", "footsteps", "metro"] },
  Barcelona: { averageVolume: 0.73, dynamicRange: 0.60, brightness: 0.72, lowEnergy: 0.58, noiseLevel: 0.65, pulseIntensity: 0.78, calmBusy: "busy", natureUrban: "urban", detected: ["crowds", "waves", "street rhythm"] },
  Lisbon: { averageVolume: 0.54, dynamicRange: 0.50, brightness: 0.64, lowEnergy: 0.42, noiseLevel: 0.48, pulseIntensity: 0.52, calmBusy: "balanced", natureUrban: "urban", detected: ["trams", "hillside streets", "guitar"] },
  Rome: { averageVolume: 0.60, dynamicRange: 0.52, brightness: 0.58, lowEnergy: 0.50, noiseLevel: 0.56, pulseIntensity: 0.54, calmBusy: "balanced", natureUrban: "urban", detected: ["piazzas", "fountains", "scooters"] },
  Reykjavik: { averageVolume: 0.32, dynamicRange: 0.55, brightness: 0.38, lowEnergy: 0.58, noiseLevel: 0.30, pulseIntensity: 0.20, calmBusy: "calm", natureUrban: "nature", detected: ["wind", "harbour", "open roads"] },
  Tokyo: { averageVolume: 0.74, dynamicRange: 0.66, brightness: 0.76, lowEnergy: 0.60, noiseLevel: 0.78, pulseIntensity: 0.82, calmBusy: "busy", natureUrban: "urban", detected: ["crossings", "train chimes", "rain signs"] },
  Marrakech: { averageVolume: 0.63, dynamicRange: 0.62, brightness: 0.68, lowEnergy: 0.52, noiseLevel: 0.58, pulseIntensity: 0.70, calmBusy: "busy", natureUrban: "urban", detected: ["markets", "hand drums", "courtyards"] },
  "New York": { averageVolume: 0.78, dynamicRange: 0.64, brightness: 0.70, lowEnergy: 0.68, noiseLevel: 0.82, pulseIntensity: 0.80, calmBusy: "busy", natureUrban: "urban", detected: ["subway", "traffic", "footsteps"] }
};

const artists = [
  { name: "Aoife Lane", location: "Galway", song: "Spanish Arch Sunrise", vibe: "indie folk", tone: 392, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80" },
  { name: "Mika Dubois", location: "Paris", song: "Cafe After Rain", vibe: "dreamy piano", tone: 330, image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=500&q=80" },
  { name: "Rafa Sol", location: "Barcelona", song: "Gracia Noon", vibe: "sunlit guitar", tone: 440, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80" },
  { name: "Niamh K.", location: "Dublin", song: "Liffey Gold", vibe: "city pop", tone: 523, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80" },
  { name: "Leila Amrani", location: "Marrakech", song: "Medina Hands", vibe: "warm percussion", tone: 294, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" },
  { name: "Ren Sato", location: "Tokyo", song: "Rain Crossing", vibe: "night synth", tone: 587, image: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=500&q=80" }
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

export function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [location, setLocation] = useState("Galway");
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState("");

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

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2400);
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
              {tab === "home" && <Home onChoose={choosePlace} notify={notify} />}
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
                  notify={notify}
                />
              )}
              {tab === "preview" && (
                <Preview
                  track={generatedTrack}
                  place={currentPlace}
                  onBack={() => setTab("generate")}
                  notify={notify}
                  onUse={() => {
                    setTab("saved");
                    setShowProfile(false);
                  }}
                />
              )}
              {tab === "artists" && <Artists onBack={() => setTab("home")} notify={notify} />}
              {tab === "saved" && (showProfile ? <Profile onBack={() => setShowProfile(false)} notify={notify} /> : <Saved onBack={() => setTab("home")} onProfile={() => setShowProfile(true)} notify={notify} />)}
            </div>
            {toast && <div className="toast">{toast}</div>}
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
        <p>Place-to-Music Generator</p>
        <h1>Generate music from a place</h1>
        <span>Record 15 seconds or choose a location profile.</span>
      </div>
      <div className="glass-panel">
        <div>
          <strong>Start with Galway</strong>
          <span>Record, analyse, generate, preview.</span>
        </div>
        <button onClick={onStart}>Start</button>
        <button className="ghost" onClick={onExplore}>Browse locations</button>
      </div>
    </div>
  );
}

function Home({ onChoose, notify }) {
  const [query, setQuery] = useState("");
  const visiblePlaces = places
    .filter((place) => `${place.name} ${place.vibe} ${place.sounds.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="stack">
      <header className="top-header">
        <div>
          <p>EnvioSound</p>
          <h2>Choose a location</h2>
        </div>
        <div className="avatar">TC</div>
      </header>
      <label className="search">
        <span>⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a city, landmark, or vibe" />
      </label>
      <section>
        <div className="section-title">
          <h3>Locations</h3>
          <small>{visiblePlaces.length} available</small>
        </div>
        <div className="place-list">
          {visiblePlaces.map((place) => (
            <article className="place-card" key={place.id} style={{ backgroundImage: `url(${place.image})` }}>
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
          {!visiblePlaces.length && (
            <div className="empty-state">
              <strong>No exact match yet</strong>
              <span>Try “coastal”, “urban”, “waves”, “Tokyo”, “Lisbon”, or “Dublin”.</span>
              <button onClick={() => { setQuery(""); notify("Search cleared"); }}>Clear search</button>
            </div>
          )}
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
    Barcelona: [78, 76],
    Lisbon: [54, 70],
    Rome: [68, 67],
    Reykjavik: [42, 15],
    Tokyo: [88, 46],
    Marrakech: [59, 83],
    "New York": [24, 47]
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

function Generator({ location, setLocation, place, generatedTrack, setGeneratedTrack, onPreview, onBack, notify }) {
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
    try {
      await wait(320);
      const profile = locationProfiles[location] || locationProfiles.Galway;
      const soundDna = createSoundDna(profile, location);
      setStatus("generating");
      const track = await createElevenLabsTrack(profile, `selected location: ${location}`, null, soundDna, location);
      setGeneratedTrack(track);
      setStatus("ready");
    } catch (generateError) {
      setStatus("idle");
      setError(generateError.message || "ElevenLabs music generation failed.");
    }
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
        try {
          stopInput(streamRef, audioContextRef, rafRef);
          setStatus("analysing");
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          const arrayBuffer = await blob.arrayBuffer();
          const decodeContext = new AudioContext();
          const audioBuffer = await decodeContext.decodeAudioData(arrayBuffer.slice(0));
          await decodeContext.close();
          const profile = analyseAudioBuffer(audioBuffer);
          const soundDna = createSoundDna(profile, "Recorded environment");
          setStatus("generating");
          const track = await createElevenLabsTrack(profile, "recorded 15-second environment", blob, soundDna, location);
          setGeneratedTrack(track);
          setStatus("ready");
        } catch (generateError) {
          setStatus("idle");
          setError(generateError.message || "ElevenLabs music generation failed.");
        }
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
          <p>Generator</p>
          <h2>Create soundtrack</h2>
          <span>Record 15 seconds or use the selected location profile.</span>
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
          <span>{status === "recording" ? "Recording your environment..." : status === "analysing" ? "Building Sound DNA..." : "Generating with ElevenLabs..."}</span>
          <small>Extracting sound features.</small>
        </div>
      )}

      {generatedTrack && (
        <GeneratedResult track={generatedTrack} place={place} onPreview={onPreview} sourceRef={sourceRef} notify={notify} />
      )}
    </div>
  );
}

function GeneratedResult({ track, place, onPreview, sourceRef, notify }) {
  return (
    <div className="generated-stack">
      <SoundDnaPanel soundDna={track.soundDna} place={place} notify={notify} />
      <div className="result-card expanded">
        <div className="mini-cover" style={{ backgroundImage: `url(${place.image})` }} />
        <div className="result-copy">
          <p>Soundtrack</p>
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
            <button onClick={() => { playTrack(track, sourceRef); notify("Playing ElevenLabs track"); }}>Play</button>
            <button onClick={() => { saveTrack(track); notify("Saved to projects"); }}>Save</button>
            <a className="download-button" href={track.audioUrl} onClick={() => notify("Exporting generated track")} download={track.downloadName}>Export</a>
            <button className="dark" onClick={onPreview}>Preview</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SoundDnaPanel({ soundDna, place, notify }) {
  const points = soundDna.radar.map((value, index) => {
    const angle = -90 + index * 72;
    const radius = 18 + value * 30;
    return `${50 + Math.cos(angle * Math.PI / 180) * radius},${50 + Math.sin(angle * Math.PI / 180) * radius}`;
  }).join(" ");

  return (
    <section className="sound-dna-card">
      <div className="sound-dna-heading">
        <div>
          <p>Sound DNA</p>
          <h3>{soundDna.title}</h3>
        </div>
        <button onClick={() => {
          navigator.clipboard?.writeText(`Sound DNA of ${place.name}: Natural ${soundDna.scores.natural}%, Human Activity ${soundDna.scores.human}%, Urban Activity ${soundDna.scores.urban}%.`);
          notify("Sound DNA card copied");
        }}>Share card</button>
      </div>
      <div className="sound-dna-visuals">
        <svg className="radar-chart" viewBox="0 0 100 100" aria-label="Sound DNA radar chart">
          <polygon points="50,14 84,38 71,78 29,78 16,38" />
          <polygon points={points} />
          {soundDna.radar.map((value, index) => {
            const angle = -90 + index * 72;
            return <circle key={index} cx={50 + Math.cos(angle * Math.PI / 180) * (18 + value * 30)} cy={50 + Math.sin(angle * Math.PI / 180) * (18 + value * 30)} r="2.4" />;
          })}
        </svg>
        <div className="score-rings">
          <ScoreRing label="Natural" value={soundDna.scores.natural} />
          <ScoreRing label="Human" value={soundDna.scores.human} />
          <ScoreRing label="Urban" value={soundDna.scores.urban} />
        </div>
      </div>
      <div className="dna-breakdown">
        <DnaGroup title="Natural sounds" items={soundDna.groups.natural} />
        <DnaGroup title="Human activity" items={soundDna.groups.human} />
        <DnaGroup title="Urban activity" items={soundDna.groups.urban} />
        <DnaGroup title="Acoustic characteristics" items={soundDna.acoustics} />
      </div>
      <div className="dna-characteristics">
        {soundDna.characteristics.map((item) => <span key={item}>{item}</span>)}
      </div>
    </section>
  );
}

function ScoreRing({ label, value }) {
  return (
    <div className="score-ring" style={{ "--score": `${value * 3.6}deg` }}>
      <strong>{value}%</strong>
      <span>{label}</span>
    </div>
  );
}

function DnaGroup({ title, items }) {
  return (
    <div>
      <strong>{title}</strong>
      {Object.entries(items).map(([label, value]) => (
        <div className="dna-row" key={label}>
          <span>{label}</span>
          <b>{value}%</b>
        </div>
      ))}
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

function Preview({ track, place, onBack, onUse, notify }) {
  const sourceRef = useRef(null);
  const safeTrack = track || createFallbackTrack(place);

  return (
    <div className="preview-screen">
      <div className="preview-actions">
        <button className="back-link dark-text" onClick={onBack}>Return to generator</button>
        <button className="back-link dark-text" onClick={() => { saveTrack(safeTrack); notify("Added to saved projects"); onUse(); }}>Use in vlog</button>
      </div>
      <div className="cover-art" style={{ backgroundImage: `url(${place.image})` }}>
        <span>Generated loop</span>
        <h2>{safeTrack.title}</h2>
        <p>{safeTrack.mood}</p>
      </div>
      <div className="waveform" aria-label="Generated waveform">
        {safeTrack.waveform.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      </div>
      <button className="play-button" onClick={() => { playTrack(safeTrack, sourceRef); notify("Playing generated music"); }}>Play generated music</button>
      <div className="chips large">
        {[safeTrack.mood, safeTrack.source, "creator-safe", "ElevenLabs"].map((tag) => <small key={tag}>{tag}</small>)}
      </div>
      <FeatureGrid features={safeTrack.features} />
      <a className="primary-action download-link" href={safeTrack.audioUrl} onClick={() => notify("Exporting video-ready audio")} download={safeTrack.downloadName || `${safeTrack.title.replaceAll(" ", "-").toLowerCase()}.mp3`}>Export for video</a>
      <button className="secondary-action" onClick={() => { navigator.clipboard?.writeText(`${safeTrack.title} - generated with EnvioSound from environmental sound features.`); notify("Credit copied"); }}>Copy credit</button>
    </div>
  );
}

function Artists({ onBack, notify }) {
  const artistSourceRef = useRef(null);

  return (
    <div className="stack">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Artists</p>
          <h2>Local music</h2>
          <span>Use location-linked tracks with credit.</span>
        </div>
      </header>
      <div className="artist-list">
        {artists.map((artist) => (
          <article className="artist-card" key={artist.name}>
            <img className="artist-image" src={artist.image} alt="" />
            <div>
              <h3>{artist.name}</h3>
              <p>{artist.location} · {artist.song}</p>
              <span>{artist.vibe}</span>
            </div>
            <button onClick={() => { playArtistClip(artist, artistSourceRef); notify(`Playing ${artist.song}`); }}>Play</button>
            <button className="credit" onClick={() => { saveArtistCredit(artist); notify(`${artist.name} credit added`); }}>Use with credit</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Saved({ onBack, onProfile, notify }) {
  const [openProject, setOpenProject] = useState("");
  const saved = JSON.parse(localStorage.getItem("enviosound-saved") || "[]");
  const credits = JSON.parse(localStorage.getItem("enviosound-credits") || "[]");
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
          <img className="project-image" src={(places.find((place) => project.location.includes(place.name)) || places[0]).image} alt="" />
          <div>
            <h3>{project.name}</h3>
            <p>{project.location} · {project.mood}</p>
            <span>{project.track}</span>
          </div>
          <div className="project-actions">
            <strong>{project.status}</strong>
            <button onClick={() => { setOpenProject(openProject === project.name ? "" : project.name); notify(openProject === project.name ? "Project closed" : `Opened ${project.name}`); }}>Open</button>
            <button onClick={() => {
              const blob = new Blob([`EnvioSound Project\n\nTitle: ${project.name}\nLocation: ${project.location}\nMood: ${project.mood}\nTrack: ${project.track}\nStatus: ${project.status}\n`], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${project.name.replaceAll(" ", "-").toLowerCase()}-export.txt`;
              link.click();
              URL.revokeObjectURL(url);
              notify(`${project.name} export downloaded`);
            }}>Export</button>
          </div>
          {openProject === project.name && (
            <div className="project-detail">
              <span>Location profile</span>
              <strong>{project.location}</strong>
              <span>Soundtrack</span>
              <strong>{project.track}</strong>
              <span>Use case</span>
              <strong>{project.mood} travel edit</strong>
            </div>
          )}
        </article>
      ))}
      <section className="credits-panel">
        <h3>Artist credits used</h3>
        {credits.length ? credits.map((credit) => (
          <div key={`${credit.artist}-${credit.song}`}>
            <span>{credit.song}</span>
            <strong>{credit.artist}</strong>
          </div>
        )) : <p>No local artist credits added yet.</p>}
      </section>
    </div>
  );
}

function Profile({ onBack, notify }) {
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
        <button className="settings-row" key={label} onClick={() => notify(`${label} opened`)}>
          <span>{label}</span>
          <strong>{value}</strong>
        </button>
      ))}
    </div>
  );
}

async function createElevenLabsTrack(profile, source, recordingBlob = null, soundDna = createSoundDna(profile, source), location = source) {
  const bpm = chooseBpm(profile, soundDna);
  const mood = chooseMood(profile);
  const title = chooseTitle(profile, source);
  const instruments = chooseInstruments(profile, soundDna);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/generate-music`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, soundDna, source, location, mood, bpm, instruments, durationMs: profile.calmBusy === "busy" ? 18000 : 22000 })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "ElevenLabs music generation failed.");

  const audioBlob = base64ToBlob(data.audioBase64, data.mimeType || "audio/mpeg");
  const audioUrl = URL.createObjectURL(audioBlob);
  const waveform = await extractAudioWaveform(audioBlob, profile);

  return {
    title,
    source,
    recordingBlob,
    mood,
    bpm,
    instruments,
    profile,
    soundDna,
    audioBlob,
    audioUrl,
    songId: data.songId,
    prompt: data.prompt,
    downloadName: `${title.replaceAll(" ", "-").toLowerCase()}.${audioBlob.type.includes("wav") ? "wav" : "mp3"}`,
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

function createSoundDna(profile, label) {
  const natural = Math.round(clamp((profile.natureUrban === "nature" ? 0.34 : 0.08) + profile.lowEnergy * 0.22 + (1 - profile.noiseLevel) * 0.20 + (1 - profile.pulseIntensity) * 0.14 + (profile.brightness > 0.62 ? 0.10 : 0.04)) * 100);
  const urban = Math.round(clamp((profile.natureUrban === "urban" ? 0.28 : 0.06) + profile.noiseLevel * 0.34 + profile.pulseIntensity * 0.22 + profile.lowEnergy * 0.10) * 100);
  const human = Math.max(0, Math.min(100, 100 - natural - urban));
  const complexity = Math.round(clamp(profile.noiseLevel * 0.34 + profile.dynamicRange * 0.30 + profile.brightness * 0.20 + profile.pulseIntensity * 0.16) * 100);
  const frequencyRange = Math.round(clamp(profile.brightness * 0.52 + profile.lowEnergy * 0.38 + profile.dynamicRange * 0.10) * 100);

  return {
    title: `${label.replace("selected location: ", "")} Sound DNA`,
    scores: { natural, human, urban },
    groups: {
      natural: {
        birds: Math.round(profile.brightness * natural),
        waves: Math.round(profile.lowEnergy * natural),
        wind: Math.round((1 - profile.pulseIntensity) * natural),
        water: Math.round((profile.lowEnergy * 0.7 + (1 - profile.noiseLevel) * 0.3) * natural),
        insects: Math.round(profile.brightness * (1 - profile.averageVolume) * natural)
      },
      human: {
        conversation: Math.round(profile.noiseLevel * human),
        footsteps: Math.round(profile.pulseIntensity * human),
        crowds: Math.round(profile.averageVolume * human),
        performers: Math.round(profile.brightness * human)
      },
      urban: {
        traffic: Math.round(profile.noiseLevel * urban),
        engines: Math.round(profile.lowEnergy * urban),
        construction: Math.round(profile.dynamicRange * urban),
        "public transport": Math.round(profile.pulseIntensity * urban)
      }
    },
    characteristics: [
      complexity > 62 ? "High ambient texture" : "Soft ambient texture",
      profile.pulseIntensity > 0.58 ? "Strong rhythmic activity" : profile.pulseIntensity > 0.34 ? "Medium rhythmic activity" : "Low rhythmic activity",
      frequencyRange > 58 ? "Wide frequency range" : "Narrow frequency range",
      profile.calmBusy === "busy" ? "Busy atmosphere" : profile.calmBusy === "calm" ? "Calm atmosphere" : "Balanced atmosphere"
    ],
    acoustics: {
      "average volume": Math.round(profile.averageVolume * 100),
      "sound complexity": complexity,
      "rhythm intensity": Math.round(profile.pulseIntensity * 100),
      "frequency distribution": frequencyRange,
      "dynamic range": Math.round(profile.dynamicRange * 100)
    },
    radar: [natural / 100, human / 100, urban / 100, complexity / 100, frequencyRange / 100]
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

function chooseBpm(profile, soundDna) {
  return Math.round(68 + profile.pulseIntensity * 34 + profile.noiseLevel * 12 + profile.averageVolume * 10 + soundDna.scores.urban * 0.24 + soundDna.scores.human * 0.10 - soundDna.scores.natural * 0.08);
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

function chooseInstruments(profile, soundDna) {
  const instruments = [];
  instruments.push(soundDna.scores.natural > 55 ? "soft pads" : profile.averageVolume > 0.55 ? "strong drums" : "warm keys");
  if (profile.brightness > 0.55 || soundDna.groups.natural.birds > 20) instruments.push("bells/plucks");
  if (profile.lowEnergy > 0.44) instruments.push("bass line");
  if (profile.pulseIntensity > 0.42 || soundDna.scores.human > 26) instruments.push("rhythmic percussion");
  instruments.push(soundDna.scores.urban > 48 ? "city synth texture" : "ambient field texture");
  return instruments;
}

function playTrack(track, sourceRef) {
  if (!track?.audioUrl) return;
  sourceRef.current?.pause?.();
  const audio = new Audio(track.audioUrl);
  audio.play();
  sourceRef.current = audio;
}

function saveTrack(track) {
  const saved = JSON.parse(localStorage.getItem("enviosound-saved") || "[]");
  localStorage.setItem("enviosound-saved", JSON.stringify([{ title: track.title, mood: track.mood, source: track.source }, ...saved].slice(0, 10)));
}

function playArtistClip(artist, sourceRef) {
  const context = new AudioContext();
  if (sourceRef.current) sourceRef.current.stop();
  const destination = context.createGain();
  destination.gain.value = 0.22;
  destination.connect(context.destination);
  const notes = [0, 4, 7, 12, 7, 4, 2, 0];
  notes.forEach((semi, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = artist.vibe.includes("piano") ? "triangle" : artist.vibe.includes("city") ? "square" : "sine";
    oscillator.frequency.value = artist.tone * Math.pow(2, semi / 12);
    const start = context.currentTime + index * 0.22;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
    oscillator.connect(gain).connect(destination);
    oscillator.start(start);
    oscillator.stop(start + 0.26);
    if (index === 0) sourceRef.current = oscillator;
  });
}

function saveArtistCredit(artist) {
  const credits = JSON.parse(localStorage.getItem("enviosound-credits") || "[]");
  const next = [{ artist: artist.name, song: artist.song, location: artist.location }, ...credits.filter((credit) => credit.song !== artist.song)].slice(0, 8);
  localStorage.setItem("enviosound-credits", JSON.stringify(next));
}

function createFallbackTrack(place) {
  const profile = locationProfiles[place.name] || locationProfiles.Galway;
  return { title: place.reco, source: place.name, mood: chooseMood(profile), waveform: fallbackWaveform(profile), features: { "Average volume": profile.averageVolume, Brightness: profile.brightness, Pulse: profile.pulseIntensity }, audioUrl: "" };
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

async function extractAudioWaveform(blob, profile) {
  try {
    const context = new AudioContext();
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const waveform = extractWaveform(buffer);
    await context.close();
    return waveform;
  } catch {
    return fallbackWaveform(profile);
  }
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

function fallbackWaveform(profile) {
  return Array.from({ length: 34 }, (_, index) => 18 + clamp(profile.averageVolume + Math.sin(index * profile.pulseIntensity * 3) * 0.28 + ((index * 13) % 17) / 50) * 62);
}

function base64ToBlob(base64, type) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}
