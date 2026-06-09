import { useMemo, useState } from "react";

const places = [
  {
    id: "galway",
    name: "Galway",
    vibe: "Indie coastal city",
    tracks: 42,
    image: "https://images.unsplash.com/photo-1522872527593-0f30223eb522?auto=format&fit=crop&w=900&q=80",
    sounds: ["buskers", "harbour wind", "cafe chatter"],
    reco: "Atlantic Light",
    desc: "Warm indie guitars, soft hand percussion, and a sea-air lift for creator montages."
  },
  {
    id: "dublin",
    name: "Dublin",
    vibe: "City reel energy",
    tracks: 58,
    image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=900&q=80",
    sounds: ["tram bells", "street crowds", "pub doors"],
    reco: "Liffey Motion",
    desc: "A bright urban pulse for reels, walking shots, and fast-cut city edits."
  },
  {
    id: "cliffs",
    name: "Cliffs of Moher",
    vibe: "Epic cinematic nature",
    tracks: 31,
    image: "https://images.unsplash.com/photo-1609501676725-7186f734d4db?auto=format&fit=crop&w=900&q=80",
    sounds: ["waves", "high wind", "distant gulls"],
    reco: "Edge of the Atlantic",
    desc: "Wide strings and low drums built for dramatic drone footage and scenic reveals."
  },
  {
    id: "london",
    name: "London",
    vibe: "Modern city documentary",
    tracks: 73,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
    sounds: ["underground", "rain", "crosswalks"],
    reco: "Afterlight Camden",
    desc: "Moody synths and polished beats for cinematic city vlogs."
  },
  {
    id: "paris",
    name: "Paris",
    vibe: "Dreamy cafe cinema",
    tracks: 64,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    sounds: ["accordion", "metro", "terrace voices"],
    reco: "Rue Lumiere",
    desc: "Romantic piano textures with a soft pulse for aesthetic travel films."
  },
  {
    id: "barcelona",
    name: "Barcelona",
    vibe: "Sunlit street rhythm",
    tracks: 49,
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80",
    sounds: ["plazas", "guitar", "scooters"],
    reco: "Golden Ramblas",
    desc: "Percussive, bright, and breezy for food markets and beach transitions."
  },
  {
    id: "cork",
    name: "Cork",
    vibe: "Warm local story",
    tracks: 27,
    image: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=900&q=80",
    sounds: ["market stalls", "river steps", "acoustic sets"],
    reco: "Marina Morning",
    desc: "Organic rhythm and soft folk color for slower travel storytelling."
  }
];

const vlogTypes = ["Travel montage", "Day in my life", "Food vlog", "Adventure", "Calm aesthetic", "City vlog"];
const moods = ["Cinematic", "Peaceful", "Energetic", "Dreamy", "Indie", "Traditional"];
const lengths = ["15 sec", "30 sec", "60 sec", "3 min"];

const artists = [
  { name: "Aoife Lane", location: "Galway", song: "Spanish Arch Sunrise", vibe: "indie folk" },
  { name: "Mika Dubois", location: "Paris", song: "Cafe After Rain", vibe: "dreamy piano" },
  { name: "Rafa Sol", location: "Barcelona", song: "Gracia Noon", vibe: "sunlit guitar" },
  { name: "Niamh K.", location: "Dublin", song: "Liffey Gold", vibe: "city pop" }
];

const projects = [
  { name: "Galway Weekend Vlog", location: "Galway", mood: "Cinematic", track: "Atlantic Light", status: "Ready to export" },
  { name: "Dublin City Reel", location: "Dublin", mood: "Energetic", track: "Liffey Motion", status: "Ready to export" },
  { name: "Cliffs of Moher Montage", location: "Cliffs of Moher", mood: "Dreamy", track: "Edge of the Atlantic", status: "Ready to export" }
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
  const [vlogType, setVlogType] = useState("Travel montage");
  const [mood, setMood] = useState("Cinematic");
  const [length, setLength] = useState("30 sec");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(false);
  const [playing, setPlaying] = useState(false);
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

  const generate = () => {
    setGenerating(true);
    setResult(false);
    setTimeout(() => {
      setGenerating(false);
      setResult(true);
    }, 1900);
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
              {tab === "map" && <MapScreen selected={selectedPlace} onSelect={choosePlace} onCreate={(place) => choosePlace(place, "generate")} />}
              {tab === "generate" && (
                <Generator
                  location={location}
                  setLocation={setLocation}
                  vlogType={vlogType}
                  setVlogType={setVlogType}
                  mood={mood}
                  setMood={setMood}
                  length={length}
                  setLength={setLength}
                  generating={generating}
                  result={result}
                  place={currentPlace}
                  onGenerate={generate}
                  onPreview={() => setTab("preview")}
                />
              )}
              {tab === "preview" && (
                <Preview
                  place={currentPlace}
                  mood={mood}
                  playing={playing}
                  setPlaying={setPlaying}
                  onUse={() => {
                    setTab("saved");
                    setShowProfile(false);
                  }}
                />
              )}
              {tab === "artists" && <Artists />}
              {tab === "saved" && (showProfile ? <Profile onBack={() => setShowProfile(false)} /> : <Saved onProfile={() => setShowProfile(true)} />)}
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
        <p>Copyright-safe for creators</p>
        <h1>Soundtrack your journey</h1>
        <span>Find music that matches where you are filming.</span>
      </div>
      <div className="glass-panel">
        <div>
          <strong>Galway</strong>
          <span>Indie coastal city</span>
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
        <span>Soundtracks matched to real places</span>
        <span>Made for travel vlogs, reels and short films</span>
      </div>
      <section>
        <div className="section-title">
          <h3>Trending travel soundtracks</h3>
          <small>Creator-safe picks</small>
        </div>
        <div className="place-list">
          {places.slice(0, 5).map((place) => (
            <article className="place-card" key={place.id} style={{ backgroundImage: `linear-gradient(180deg, rgba(7,10,18,.1), rgba(7,10,18,.86)), url(${place.image})` }}>
              <div>
                <strong>{place.name}</strong>
                <span>{place.vibe}</span>
              </div>
              <div className="card-footer">
                <small>{place.tracks} tracks</small>
                <button onClick={() => onChoose(place, "generate")}>Find soundtrack</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MapScreen({ selected, onSelect, onCreate }) {
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
      <header className="top-header compact">
        <div>
          <p>Location map</p>
          <h2>Tap a place to hear its vibe</h2>
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
          <strong>Recommended soundtrack: {selected.reco}</strong>
          <button onClick={() => onCreate(selected)}>Create vlog soundtrack</button>
        </div>
      </div>
    </div>
  );
}

function Generator(props) {
  const { location, setLocation, vlogType, setVlogType, mood, setMood, length, setLength, generating, result, place, onGenerate, onPreview } = props;
  const loadingLines = ["Listening to the place…", "Matching the vibe…", "Creating your travel soundtrack…"];

  return (
    <div className="stack generator">
      <header className="top-header compact">
        <div>
          <p>Vlog soundtrack generator</p>
          <h2>Create music for this exact place</h2>
        </div>
      </header>
      <SelectRow label="Location" value={location} setValue={setLocation} options={places.slice(0, 6).map((place) => place.name)} />
      <PillGroup title="Vlog type" options={vlogTypes} value={vlogType} onChange={setVlogType} />
      <PillGroup title="Mood" options={moods} value={mood} onChange={setMood} />
      <PillGroup title="Video length" options={lengths} value={length} onChange={setLength} />
      <button className="primary-action" onClick={onGenerate}>Generate soundtrack</button>
      {generating && (
        <div className="loading-card">
          <div className="spinner" />
          {loadingLines.map((line) => <span key={line}>{line}</span>)}
        </div>
      )}
      {result && (
        <div className="result-card">
          <div className="mini-cover" style={{ backgroundImage: `url(${place.image})` }} />
          <div className="result-copy">
            <p>Generated result</p>
            <h3>{place.reco}</h3>
            <span>{location} · {mood} · {length}</span>
            <div className="meta-grid">
              <small>BPM <b>{mood === "Energetic" ? 126 : 88}</b></small>
              <small>Instruments <b>guitar, pads, field drums</b></small>
              <small>License <b>Creator-safe</b></small>
            </div>
            <div className="button-row">
              <button onClick={onPreview}>Preview</button>
              <button>Save to project</button>
              <button className="dark" onClick={onPreview}>Use in vlog</button>
            </div>
          </div>
        </div>
      )}
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

function PillGroup({ title, options, value, onChange }) {
  return (
    <section className="picker">
      <h3>{title}</h3>
      <div>
        {options.map((option) => (
          <button className={value === option ? "chosen" : ""} key={option} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function Preview({ place, mood, playing, setPlaying, onUse }) {
  return (
    <div className="preview-screen">
      <button className="back-link" onClick={onUse}>Done</button>
      <div className="cover-art" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,10,16,.05), rgba(8,10,16,.82)), url(${place.image})` }}>
        <span>vlog-safe</span>
        <h2>{place.reco}</h2>
        <p>{place.name}</p>
      </div>
      <div className="waveform" aria-label="Placeholder waveform">
        {Array.from({ length: 34 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 13) % 52)}px` }} />)}
      </div>
      <button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</button>
      <div className="chips large">
        {["cinematic", place.name, "vlog-safe", mood.toLowerCase()].map((tag) => <small key={tag}>{tag}</small>)}
      </div>
      <button className="primary-action">Export for video</button>
      <button className="secondary-action">Copy credit</button>
    </div>
  );
}

function Artists() {
  return (
    <div className="stack">
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

function Saved({ onProfile }) {
  return (
    <div className="stack">
      <header className="top-header">
        <div>
          <p>Saved projects</p>
          <h2>Ready for your next edit</h2>
        </div>
        <button className="avatar button-avatar" onClick={onProfile}>TC</button>
      </header>
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
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

export default App;
