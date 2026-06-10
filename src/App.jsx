import React, { useMemo, useRef, useState } from "react";

const places = [
  { id: "galway", name: "Galway", city: "Galway City", county: "County Galway", cityProfile: "Galway City", countyProfile: "County Galway", vibe: "Coastal busker mood", tracks: 42, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Galway%20-%20Spanish%20Arch.JPG?width=900", sounds: ["waves", "wind", "buskers", "soft crowds"], reco: "Atlantic Drift", desc: "Waves, wind, buskers, soft crowds, and a coastal music profile." },
  { id: "dublin", name: "Dublin", city: "Dublin City", county: "County Dublin", cityProfile: "Dublin City", countyProfile: "County Dublin", vibe: "Urban rhythm", tracks: 58, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dublin%20Ha%27Penny%20bridge%20768.jpg?width=900", sounds: ["traffic", "footsteps", "street performers"], reco: "Street Pulse", desc: "Traffic, footsteps, street performers, and a busy city rhythm." },
  { id: "cliffs", name: "Cliffs of Moher", city: "Doolin", county: "County Clare", cityProfile: "Doolin", countyProfile: "County Clare", vibe: "Cinematic calm", tracks: 31, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cliffs-Of-Moher-OBriens-From-South.JPG?width=900", sounds: ["wind", "waves", "open space"], reco: "Atlantic Vast", desc: "Wind, waves, open space, and slow cinematic calm." },
  { id: "london", name: "London", vibe: "Modern city documentary", tracks: 73, image: "https://commons.wikimedia.org/wiki/Special:FilePath/London%20Skyline%20%28125508655%29.jpeg?width=900", sounds: ["underground", "rain", "crosswalks"], reco: "Afterlight Camden", desc: "Moody synths and polished beats for cinematic city vlogs." },
  { id: "paris", name: "Paris", vibe: "Romantic city mood", tracks: 64, image: "https://commons.wikimedia.org/wiki/Special:FilePath/La%20Tour%20Eiffel%20vue%20de%20la%20Tour%20Saint-Jacques%2C%20Paris%20ao%C3%BBt%202014%20%282%29.jpg?width=900", sounds: ["cafes", "footsteps", "metro"], reco: "Rue Lumiere", desc: "Cafes, footsteps, metro texture, and a romantic city profile." },
  { id: "barcelona", name: "Barcelona", vibe: "Energetic street rhythm", tracks: 49, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%20Barcelona%2C%20Spain%20%2851227309370%29%20edited.jpg?width=900", sounds: ["crowds", "waves", "street rhythm"], reco: "Golden Ramblas", desc: "Crowds, waves, street rhythm, and energetic percussion." },
  { id: "cork", name: "Cork", city: "Cork City", county: "County Cork", cityProfile: "Cork City", countyProfile: "County Cork", vibe: "Warm indie mood", tracks: 27, image: "https://commons.wikimedia.org/wiki/Special:FilePath/River%20Lee%20at%20Cork.jpg?width=900", sounds: ["city ambience", "cafes", "river"], reco: "Marina Morning", desc: "City ambience, cafes, river movement, and a warm indie profile." },
  { id: "lisbon", name: "Lisbon", vibe: "Golden tram sunset", tracks: 38, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lisboa%20-%20Portugal%20%2852597836992%29.jpg?width=900", sounds: ["trams", "hillside streets", "guitar"], reco: "Alfama Glow", desc: "Trams, tiled streets, guitar echoes, and warm evening movement." },
  { id: "rome", name: "Rome", vibe: "Ancient city warmth", tracks: 46, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Trevi%20Fountain%2C%20Rome%2C%20Italy%202%20-%20May%202007.jpg?width=900", sounds: ["piazzas", "fountains", "scooters"], reco: "Piazza Memory", desc: "Fountains, scooters, footsteps, and a romantic documentary pulse." },
  { id: "reykjavik", name: "Reykjavik", vibe: "Nordic open air", tracks: 22, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reykjav%C3%ADk%2C%20view%20from%20Hallgr%C3%ADmskirkja%20%282%29.jpg?width=900", sounds: ["wind", "harbour", "open roads"], reco: "Northern Quiet", desc: "Cold wind, harbour ambience, open roads, and spacious ambient tones." },
  { id: "tokyo", name: "Tokyo", vibe: "Night walk energy", tracks: 81, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Skyscrapers%20of%20Shinjuku%202009%20January.jpg?width=900", sounds: ["crossings", "train chimes", "rain signs"], reco: "Shibuya Afterimage", desc: "Train chimes, rain, crossings, and bright night rhythm." },
  { id: "marrakech", name: "Marrakech", vibe: "Market dusk texture", tracks: 34, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pavillon%20Menarag%C3%A4rten.jpg?width=900", sounds: ["markets", "hand drums", "courtyards"], reco: "Medina Dust", desc: "Market voices, hand drums, courtyards, and warm textured percussion." },
  { id: "newyork", name: "New York", vibe: "Street film rhythm", tracks: 76, image: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Empire%20State%20Building%20from%20Rockefeller%20Center%20New%20York%20City%20dllu%20%28cropped%29.jpg?width=900", sounds: ["subway", "traffic", "footsteps"], reco: "Avenue Cut", desc: "Subway movement, traffic, footsteps, and a fast documentary groove." }
];

const locationProfiles = {
  "Galway City": { averageVolume: 0.52, dynamicRange: 0.50, brightness: 0.55, lowEnergy: 0.42, noiseLevel: 0.48, pulseIntensity: 0.46, humanActivity: 0.58, calmBusy: "balanced", natureUrban: "urban", detected: ["buskers", "soft crowds", "footsteps", "harbour traffic"] },
  "County Galway": { averageVolume: 0.36, dynamicRange: 0.46, brightness: 0.44, lowEnergy: 0.58, noiseLevel: 0.34, pulseIntensity: 0.24, humanActivity: 0.24, calmBusy: "calm", natureUrban: "nature", detected: ["Atlantic waves", "wind", "open roads", "shore birds"] },
  "Dublin City": { averageVolume: 0.72, dynamicRange: 0.64, brightness: 0.68, lowEnergy: 0.62, noiseLevel: 0.76, pulseIntensity: 0.76, humanActivity: 0.72, calmBusy: "busy", natureUrban: "urban", detected: ["traffic", "footsteps", "street performers", "crowds"] },
  "County Dublin": { averageVolume: 0.54, dynamicRange: 0.50, brightness: 0.58, lowEnergy: 0.50, noiseLevel: 0.52, pulseIntensity: 0.44, humanActivity: 0.38, calmBusy: "balanced", natureUrban: "nature", detected: ["coastal wind", "DART pass-bys", "suburban parks", "sea birds"] },
  Doolin: { averageVolume: 0.40, dynamicRange: 0.50, brightness: 0.46, lowEnergy: 0.52, noiseLevel: 0.38, pulseIntensity: 0.32, humanActivity: 0.34, calmBusy: "calm", natureUrban: "nature", detected: ["pub spillover", "footsteps", "coastal wind", "distant waves"] },
  "County Clare": { averageVolume: 0.34, dynamicRange: 0.58, brightness: 0.40, lowEnergy: 0.62, noiseLevel: 0.30, pulseIntensity: 0.18, humanActivity: 0.14, calmBusy: "calm", natureUrban: "nature", detected: ["cliff wind", "Atlantic waves", "open space", "sea spray"] },
  "Cork City": { averageVolume: 0.55, dynamicRange: 0.50, brightness: 0.56, lowEnergy: 0.44, noiseLevel: 0.52, pulseIntensity: 0.50, humanActivity: 0.56, calmBusy: "balanced", natureUrban: "urban", detected: ["city ambience", "cafes", "river traffic", "market voices"] },
  "County Cork": { averageVolume: 0.42, dynamicRange: 0.46, brightness: 0.48, lowEnergy: 0.54, noiseLevel: 0.38, pulseIntensity: 0.30, humanActivity: 0.26, calmBusy: "calm", natureUrban: "nature", detected: ["harbour water", "coastal roads", "farm texture", "small towns"] },
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
  { name: "Aoife Lane", location: "Galway City", song: "Spanish Arch Sunrise", vibe: "indie folk", tone: 392, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80" },
  { name: "Mika Dubois", location: "Paris", song: "Cafe After Rain", vibe: "dreamy piano", tone: 330, image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=500&q=80" },
  { name: "Rafa Sol", location: "Barcelona", song: "Gracia Noon", vibe: "sunlit guitar", tone: 440, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80" },
  { name: "Niamh K.", location: "Dublin City", song: "Liffey Gold", vibe: "city pop", tone: 523, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80" },
  { name: "Leila Amrani", location: "Marrakech", song: "Medina Hands", vibe: "warm percussion", tone: 294, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" },
  { name: "Ren Sato", location: "Tokyo", song: "Rain Crossing", vibe: "night synth", tone: 587, image: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=500&q=80" }
];

const projects = [
  { name: "Galway Weekend Vlog", location: "Galway City", mood: "Coastal cinematic", track: "Atlantic Drift", status: "Ready to export" },
  { name: "Dublin City Reel", location: "Dublin City", mood: "Urban energetic", track: "Street Pulse", status: "Ready to export" },
  { name: "Cliffs of Moher Montage", location: "County Clare", mood: "Cinematic calm", track: "Atlantic Vast", status: "Ready to export" }
];

const tabs = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "map", label: "Map", icon: "⌖" },
  { id: "generate", label: "Studio", icon: "✦" },
  { id: "artists", label: "Library", icon: "♬" },
  { id: "pro", label: "Pro", icon: "◆" },
  { id: "saved", label: "Saved", icon: "▣" },
  { id: "account", label: "Account", icon: "◉" }
];

const vlogStyles = ["Cinematic travel montage", "Fast TikTok/Reel edit", "Calm aesthetic vlog", "Documentary style", "Food/travel diary", "Adventure edit"];

const moodOptions = ["Warm and cinematic", "Energetic and punchy", "Calm and poetic", "Funny and casual", "Moody documentary", "Bright holiday"];

const exportFormats = ["TikTok", "Instagram Reels", "YouTube Shorts", "YouTube Travel Vlog"];

const narrationVoices = [
  { name: "Rachel", accent: "Warm documentary", id: "21m00Tcm4TlvDq8ikWAM" },
  { name: "Antoni", accent: "Calm creator", id: "ErXwobaYiN019PkySvjV" },
  { name: "Bella", accent: "Cinematic travel", id: "EXAVITQu4vr4xnSDxMaL" }
];

const locationProfileOptions = Object.keys(locationProfiles);

function placeDisplayName(place) {
  return place.city && place.county ? `${place.city} / ${place.county}` : place.name;
}

function placeSearchText(place) {
  return [place.name, place.city, place.county, place.cityProfile, place.countyProfile, place.vibe, ...place.sounds].filter(Boolean).join(" ");
}

function placeForProfile(profileName) {
  return places.find((place) => [place.name, place.cityProfile, place.countyProfile, place.city, place.county].includes(profileName)) || places[0];
}

function profileFallback() {
  return locationProfiles["Galway City"];
}

function loadStoredAccount() {
  try {
    return JSON.parse(localStorage.getItem("vlogmate-account") || localStorage.getItem("enviosound-account") || "null");
  } catch {
    return null;
  }
}

function storeAccount(account) {
  if (account) localStorage.setItem("vlogmate-account", JSON.stringify(account));
  else localStorage.removeItem("vlogmate-account");
}

function libraryKey(account) {
  return `vlogmate-library:${account?.email || "guest"}`;
}

function readPersonalLibrary(account) {
  if (!account?.email) return [];
  try {
    return JSON.parse(localStorage.getItem(libraryKey(account)) || localStorage.getItem(`enviosound-library:${account.email}`) || "[]");
  } catch {
    return [];
  }
}

function writePersonalLibrary(account, tracks) {
  if (!account?.email) return;
  localStorage.setItem(libraryKey(account), JSON.stringify(tracks));
}

export function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [location, setLocation] = useState("Galway City");
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [plan, setPlan] = useState(() => localStorage.getItem("vlogmate-plan") || localStorage.getItem("enviosound-plan") || "free");
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [narration, setNarration] = useState(null);
  const [vlogDraft, setVlogDraft] = useState(null);
  const [selectedLibraryTrack, setSelectedLibraryTrack] = useState(null);
  const [account, setAccount] = useState(() => loadStoredAccount());
  const [personalLibrary, setPersonalLibrary] = useState(() => readPersonalLibrary(loadStoredAccount()));
  const [toast, setToast] = useState("");

  const currentPlace = useMemo(
    () => placeForProfile(location) || selectedPlace,
    [location, selectedPlace]
  );

  const startDemo = () => {
    setOnboarded(true);
    setTab("home");
  };

  const choosePlace = (place, nextTab = "map") => {
    setSelectedPlace(place);
    setLocation(place.cityProfile || place.name);
    setTab(nextTab);
  };

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2400);
  };

  const choosePlan = (nextPlan) => {
    setPlan(nextPlan);
    localStorage.setItem("vlogmate-plan", nextPlan);
    notify(nextPlan === "pro" ? "VlogMate Pro enabled" : "Free plan enabled");
  };

  const chooseLibraryTrack = async (artist) => {
    const track = await createLibraryTrack(artist);
    setSelectedLibraryTrack(artist);
    setGeneratedTrack(track);
    setTab("generate");
    notify(`${artist.song} added to Studio`);
  };

  const signIn = (nextAccount) => {
    setAccount(nextAccount);
    storeAccount(nextAccount);
    setPersonalLibrary(readPersonalLibrary(nextAccount));
    notify(`Signed in as ${nextAccount.email}`);
  };

  const signOut = () => {
    setAccount(null);
    storeAccount(null);
    setPersonalLibrary([]);
    notify("Signed out");
  };

  const addPersonalTrack = (track) => {
    if (!account?.email) {
      notify("Register or sign in with email to add to your personal library");
      setTab("account");
      return;
    }
    const next = [{ ...track, id: `${track.name}-${track.song}-${Date.now()}`, personal: true }, ...personalLibrary].slice(0, 30);
    setPersonalLibrary(next);
    writePersonalLibrary(account, next);
    notify(`${track.song} added to your personal library`);
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
                  plan={plan}
                  setPlan={choosePlan}
                  uploadedAssets={uploadedAssets}
                  setUploadedAssets={setUploadedAssets}
                  narration={narration}
                  setNarration={setNarration}
                  vlogDraft={vlogDraft}
                  setVlogDraft={setVlogDraft}
                  selectedLibraryTrack={selectedLibraryTrack}
                  setSelectedLibraryTrack={setSelectedLibraryTrack}
                  onOpenLibrary={() => setTab("artists")}
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
              {tab === "artists" && <Library onBack={() => setTab("home")} notify={notify} onSelectTrack={chooseLibraryTrack} account={account} personalLibrary={personalLibrary} onAddPersonalTrack={addPersonalTrack} />}
              {tab === "pro" && <ProPage onBack={() => setTab("home")} plan={plan} setPlan={choosePlan} notify={notify} />}
              {tab === "saved" && (showProfile ? <Profile onBack={() => setShowProfile(false)} notify={notify} plan={plan} setPlan={choosePlan} /> : <Saved onBack={() => setTab("home")} onProfile={() => setTab("account")} notify={notify} />)}
              {tab === "account" && <Account onBack={() => setTab("home")} account={account} onSignIn={signIn} onSignOut={signOut} personalLibrary={personalLibrary} />}
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
      <div className="brand-pill">VlogMate</div>
      <div className="hero-copy">
        <p>AI travel vlog creator</p>
        <h1>Turn your trip into a story.</h1>
        <span>Generate soundtracks, voiceovers, captions and travel edits from your footage.</span>
      </div>
      <div className="glass-panel auth-panel">
        <div>
          <strong>Welcome to VlogMate</strong>
          <span>Log in, sign up, or keep exploring as a guest.</span>
        </div>
        <button onClick={onExplore}>Log In</button>
        <button onClick={onStart}>Sign Up</button>
        <button className="guest-link" onClick={onExplore}>Continue as guest</button>
      </div>
    </div>
  );
}

function Home({ onChoose, notify }) {
  const [query, setQuery] = useState("");
  const visiblePlaces = places
    .filter((place) => placeSearchText(place).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="stack">
      <header className="top-header">
        <div>
          <p>VlogMate</p>
          <h2>Turn places into stories</h2>
        </div>
        <div className="avatar">TC</div>
      </header>
      <section className="story-panel">
        <strong>Travel vlog studio</strong>
        <span>Upload clips, generate soundtrack and voiceover, then export the finished travel edit.</span>
        <button onClick={() => onChoose(places[0], "generate")}>Open Studio</button>
      </section>
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
                <span>{place.city && place.county ? `${place.city} sound profile · ${place.county} profile` : place.vibe}</span>
              </div>
              <div className="card-footer">
                <small>{place.cityProfile && place.countyProfile ? "2 sound profiles" : `${place.tracks} profiles`}</small>
                <button onClick={() => onChoose(place, "generate")}>Create story</button>
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
          <h2>Tap a place, then choose city or county in Studio</h2>
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
            aria-label={placeDisplayName(place)}
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
          <h3>{placeDisplayName(selected)}</h3>
          <span>{selected.desc}</span>
          <div className="chips">
            {selected.sounds.map((sound) => <small key={sound}>{sound}</small>)}
          </div>
          <strong>Default profile: {selected.cityProfile || selected.name}</strong>
          <button onClick={() => onCreate(selected)}>Create vlog soundtrack</button>
        </div>
      </div>
    </div>
  );
}

function Generator({ location, setLocation, place, generatedTrack, setGeneratedTrack, onBack, notify, plan, uploadedAssets, setUploadedAssets, narration, setNarration, vlogDraft, setVlogDraft, selectedLibraryTrack, setSelectedLibraryTrack, onOpenLibrary }) {
  const [vlogStyle, setVlogStyle] = useState("Cinematic travel montage");
  const [mood, setMood] = useState("Warm and cinematic");
  const [voiceoverPrompt, setVoiceoverPrompt] = useState("");
  const [musicSource, setMusicSource] = useState(selectedLibraryTrack ? "library" : "generated");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const sourceRef = useRef(null);
  const narrationRef = useRef(null);
  const currentProfile = locationProfiles[location] || profileFallback();
  const currentSoundDna = useMemo(() => createSoundDna(currentProfile, location), [currentProfile, location]);

  const addUploads = (files) => {
    const nextAssets = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type.startsWith("video/") ? "Video" : file.type.startsWith("image/") ? "Photo" : file.type.startsWith("audio/") ? "Audio" : "File",
      url: URL.createObjectURL(file)
    }));
    setUploadedAssets([...nextAssets, ...uploadedAssets].slice(0, 12));
    setVlogDraft(null);
    notify(`${nextAssets.length} clip${nextAssets.length === 1 ? "" : "s"} added`);
  };

  const createMyVlog = async () => {
    const clips = uploadedAssets.filter((asset) => asset.type === "Video" || asset.type === "Photo");
    if (!clips.length) {
      setError("Upload at least one clip or photo first.");
      return;
    }

    setError("");
    setStatus("creating");
    try {
      await wait(650);
      const edited = createEditedVlog(clips, vlogStyle, mood, location, voiceoverPrompt);
      const profile = locationProfiles[location] || profileFallback();
      const soundDna = createSoundDna(profile, location);
      const track = musicSource === "library" && generatedTrack
        ? generatedTrack
        : await createLocalTrack(profile, `${location} ${mood}`, null, soundDna);
      const nextNarration = createLocalNarration(edited.voiceoverScript, narrationVoices[0]);
      const draft = editedVlogToDraft({ edited, location, place, style: vlogStyle, mood, track });
      setGeneratedTrack(track);
      setNarration(nextNarration);
      setVlogDraft(draft);
      setStatus("ready");
      notify("Vlog created");
    } catch (createError) {
      setStatus("idle");
      setError(createError.message || "Could not create the vlog.");
    }
  };

  const resetStudio = () => {
    const urls = [
      ...uploadedAssets.map((asset) => asset.url),
      generatedTrack?.audioUrl,
      narration?.audioUrl
    ];
    try {
      sourceRef.current?.stop?.();
      narrationRef.current?.pause?.();
      window.speechSynthesis?.cancel?.();
    } catch {
      // Reset should still clear the Studio if audio is already stopped.
    }
    setUploadedAssets([]);
    setGeneratedTrack(null);
    setNarration(null);
    setVlogDraft(null);
    setSelectedLibraryTrack(null);
    setMusicSource("generated");
    setVoiceoverPrompt("");
    setStatus("idle");
    setError("");
    releaseObjectUrls(urls);
    notify("Studio reset");
  };

  return (
    <div className="stack generator">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Studio</p>
          <h2>Create your vlog</h2>
        </div>
      </header>

      <UploadPanel assets={uploadedAssets} onUpload={addUploads} />

      <section className="studio-card create-vlog-card">
        <SelectRow label="Location" value={location} setValue={setLocation} options={locationProfileOptions} />
        <SelectRow label="Vlog style" value={vlogStyle} setValue={setVlogStyle} options={vlogStyles} />
        <SelectRow label="Mood" value={mood} setValue={setMood} options={moodOptions} />
        <SoundDnaCard soundDna={currentSoundDna} profile={currentProfile} location={location} />
        <div className="music-picker">
          <span>Music</span>
          <div className="mode-switch">
            <button className={musicSource === "generated" ? "selected" : ""} onClick={() => { setMusicSource("generated"); setSelectedLibraryTrack(null); }}>Generated</button>
            <button className={musicSource === "library" ? "selected" : ""} onClick={() => setMusicSource("library")}>Library</button>
          </div>
          {musicSource === "library" ? (
            <div className="library-picker">
              {selectedLibraryTrack ? (
                <>
                  <div>
                    <strong>{selectedLibraryTrack.song}</strong>
                    <span>{selectedLibraryTrack.name} · {selectedLibraryTrack.location} · {selectedLibraryTrack.vibe}</span>
                  </div>
                  <button onClick={onOpenLibrary}>Change</button>
                </>
              ) : (
                <>
                  <div>
                    <strong>No Library track selected</strong>
                    <span>Pick a track from your Library for this vlog.</span>
                  </div>
                  <button onClick={onOpenLibrary}>Open Library</button>
                </>
              )}
            </div>
          ) : (
            <div className="library-picker">
              <div>
                <strong>{generatedTrack?.engine && generatedTrack?.engine !== "Library" ? generatedTrack.title : "Generated soundtrack"}</strong>
                <span>{generatedTrack?.engine && generatedTrack?.engine !== "Library" ? generatedTrack.mood : "VlogMate will create music for this vlog."}</span>
              </div>
            </div>
          )}
        </div>
        <label className="voiceover-prompt">
          <span>Voiceover prompt</span>
          <textarea className="notes-input" value={voiceoverPrompt} onChange={(event) => setVoiceoverPrompt(event.target.value)} placeholder="Mention coffee, the rain, and my walk by the harbour. Make it calm and poetic." />
        </label>
        <button className="primary-action" disabled={status === "creating"} onClick={createMyVlog}>
          {status === "creating" ? "Creating..." : "Create my vlog"}
        </button>
        {error && <strong className="error-text">{error}</strong>}
      </section>

      {status === "creating" && (
        <div className="loading-card">
          <div className="spinner" />
          <span>Creating your vlog...</span>
        </div>
      )}

      {vlogDraft && (
        <FinishedVlogPreview
          draft={vlogDraft}
          track={generatedTrack}
          narration={narration}
          sourceRef={sourceRef}
          narrationRef={narrationRef}
          notify={notify}
          onExport={() => exportVlogVideo(vlogDraft, generatedTrack, narration, notify)}
        />
      )}

      <button className="studio-reset-button" onClick={resetStudio}>Reset Studio</button>
    </div>
  );
}

function FinishedVlogPreview({ draft, track, narration, sourceRef, narrationRef, notify, onExport }) {
  const [exportStatus, setExportStatus] = useState("idle");
  const firstClip = draft.orderedClips?.[0] || draft.assets?.[0];

  const exportVlog = async () => {
    setExportStatus("rendering");
    try {
      await onExport();
      setExportStatus("done");
      window.setTimeout(() => setExportStatus("idle"), 1800);
    } catch {
      setExportStatus("idle");
    }
  };

  return (
    <section className="finished-vlog">
      <div className="studio-heading">
        <div>
          <p>Finished preview</p>
          <h3>{draft.title}</h3>
        </div>
        <button onClick={exportVlog} disabled={exportStatus === "rendering"}>{exportStatus === "rendering" ? "Exporting..." : "Export"}</button>
      </div>

      <div className="preview-window edited-video-frame">
        {firstClip?.type === "Video" ? (
          <video src={firstClip.url} muted playsInline controls />
        ) : firstClip?.url ? (
          <img src={firstClip.url} alt="" />
        ) : (
          <div className="preview-empty">{draft.location}</div>
        )}
        <div className="title-card-overlay">
          <strong>{draft.location}</strong>
          <span>{draft.mood}</span>
        </div>
        <div className="preview-caption">
          <span>{draft.style}</span>
          <p>{draft.captions?.[0] || draft.location}</p>
        </div>
      </div>

      <div className="clip-timeline">
        {draft.orderedClips.map((clip, index) => (
          <article key={clip.id || `${clip.name}-${index}`}>
            <div>
              <strong>{index === 0 ? "Title card" : clip.role}</strong>
              <span>{cleanOverlayText(clip.name) || polishedClipLabel(clip.shotType, index)}</span>
            </div>
            <small>{draft.transitions[index] || "Cut"}</small>
            <p>{draft.captions[index]}</p>
          </article>
        ))}
      </div>

      <div className="track-controls">
        <button onClick={() => { playTrack(track, sourceRef); notify("Playing soundtrack"); }}>Play music</button>
        <button onClick={() => playNarration(narration, narrationRef)}>Play voiceover</button>
      </div>

      <div className="voiceover-track">
        <strong>Voiceover</strong>
        <p>{draft.voiceoverScript}</p>
      </div>

      <div className="soundtrack-track">
        <strong>Soundtrack</strong>
        <span>{draft.soundtrack.title} · {draft.soundtrack.mood}</span>
      </div>

      <div className="edit-summary">
        <strong>Edit summary</strong>
        {draft.editSummary.map((item) => <span key={item}>{item}</span>)}
      </div>
    </section>
  );
}

function UploadPanel({ assets, onUpload }) {
  const counts = {
    videos: assets.filter((asset) => asset.type === "Video").length,
    photos: assets.filter((asset) => asset.type === "Photo").length,
    audio: assets.filter((asset) => asset.type === "Audio").length
  };

  return (
    <section className="studio-card">
      <div className="studio-heading">
        <div>
          <p>Step 1</p>
          <h3>Upload content</h3>
        </div>
        <label className="upload-button">
          Add files
          <input type="file" multiple accept="video/*,image/*,audio/*" onChange={(event) => onUpload(event.target.files)} />
        </label>
      </div>
      <div className="asset-summary">
        <span>{counts.videos} clips</span>
        <span>{counts.photos} photos</span>
        <span>{counts.audio} recordings</span>
      </div>
      <div className="asset-strip">
        {assets.length ? assets.map((asset) => (
          <div className="asset-tile" key={asset.id}>
            {asset.type === "Photo" ? <img src={asset.url} alt="" /> : <span>{asset.type}</span>}
            <strong>{asset.name}</strong>
          </div>
        )) : <p>Add video clips, photos, drone footage or environmental audio.</p>}
      </div>
    </section>
  );
}

function SoundDnaCard({ soundDna, profile, location }) {
  return (
    <section className="sound-dna-card compact">
      <div className="sound-dna-heading">
        <div>
          <p>Sound profile</p>
          <h3>{location}</h3>
          <span>{(profile.detected || []).join(", ")}</span>
        </div>
      </div>
      <div className="sound-dna-visuals">
        <svg className="radar-chart" viewBox="0 0 100 100" aria-label="Sound DNA radar chart">
          <polygon points="50,14 84,38 71,78 29,78 16,38" />
          <polygon points={soundDna.radar.map((value, index) => {
            const angle = -90 + index * 72;
            const radius = 18 + value * 30;
            return `${50 + Math.cos(angle * Math.PI / 180) * radius},${50 + Math.sin(angle * Math.PI / 180) * radius}`;
          }).join(" ")} />
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

function PlanCard({ plan, setPlan }) {
  return (
    <section className="plan-card">
      <div>
        <h3>{plan === "pro" ? "VlogMate Pro" : "Free plan"}</h3>
        <p>{plan === "pro" ? "Uses ElevenLabs Music API for studio AI tracks." : "Uses the local Sound DNA model. No API cost."}</p>
      </div>
      <div className="plan-actions">
        <button className={plan === "free" ? "selected" : ""} onClick={() => setPlan("free")}>Free</button>
        <button className={plan === "pro" ? "selected" : ""} onClick={() => setPlan("pro")}>Pro $6/mo</button>
      </div>
    </section>
  );
}

function ProPage({ onBack, plan, setPlan, notify }) {
  const tiers = [
    {
      id: "free",
      name: "Free",
      action: "Start Free",
      features: ["3 exports per month", "Basic soundtrack generation", "Watermarked exports"]
    },
    {
      id: "pro",
      name: "Creator Pro",
      action: "Upgrade to Pro",
      highlighted: true,
      features: ["Unlimited exports", "No watermark", "Advanced AI editing", "Higher quality music generation", "Commercial creator-safe license"]
    },
    {
      id: "studio",
      name: "Studio Pro",
      action: "Contact for Studio",
      features: ["Team projects", "Brand kits", "Batch exports", "Priority rendering", "Tourism board / agency tools"]
    }
  ];

  const chooseTier = (tier) => {
    if (tier.id === "studio") {
      notify("Studio Pro enquiry saved");
      return;
    }
    setPlan(tier.id);
  };

  return (
    <div className="stack">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Subscription</p>
          <h2>VlogMate Pro</h2>
          <span>Create cinematic travel vlogs faster.</span>
        </div>
      </header>
      <section className="pro-grid">
        {tiers.map((tier) => (
          <article className={`pro-card ${tier.highlighted ? "highlighted" : ""}`} key={tier.name}>
            <div>
              <p>{tier.id === plan ? "Current plan" : "Plan"}</p>
              <h3>{tier.name}</h3>
            </div>
            <ul>
              {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <button onClick={() => chooseTier(tier)}>{tier.action}</button>
          </article>
        ))}
      </section>
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
        {[safeTrack.mood, safeTrack.source, "creator-safe", safeTrack.engine || "Local model"].map((tag) => <small key={tag}>{tag}</small>)}
      </div>
      <FeatureGrid features={safeTrack.features} />
      <a className="primary-action download-link" href={safeTrack.audioUrl} onClick={() => notify("Exporting video-ready audio")} download={safeTrack.downloadName || `${safeTrack.title.replaceAll(" ", "-").toLowerCase()}.mp3`}>Export for video</a>
      <button className="secondary-action" onClick={() => { navigator.clipboard?.writeText(`${safeTrack.title} - generated with VlogMate from environmental sound features.`); notify("Credit copied"); }}>Copy credit</button>
    </div>
  );
}

function CopyrightPanel({ status, result, track, onCheck }) {
  return (
    <section className="copyright-card">
      <div className="studio-heading">
        <div>
          <p>Copyright lookup</p>
          <h3>{track.song}</h3>
        </div>
        <button onClick={onCheck} disabled={status === "checking"}>{status === "checking" ? "Searching..." : "Check copyright"}</button>
      </div>
      <p className="legal-note">Web guidance only. Confirm with the rights holder or a qualified legal adviser before publishing monetised or commercial work.</p>
      {status === "checking" && (
        <div className="loading-card compact">
          <div className="spinner" />
          <span>Searching current web sources...</span>
        </div>
      )}
      {result && (
        <div className="copyright-result">
          <strong>{result.recommendation || "Review required"}</strong>
          <p>{result.summary}</p>
          {Array.isArray(result.steps) && result.steps.length > 0 && (
            <ul>
              {result.steps.map((step) => <li key={step}>{step}</li>)}
            </ul>
          )}
          {Array.isArray(result.sources) && result.sources.length > 0 && (
            <div className="source-list">
              {result.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title || source.url}</a>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Library({ onBack, notify, onSelectTrack, account, personalLibrary, onAddPersonalTrack }) {
  const artistSourceRef = useRef(null);
  const [artistName, setArtistName] = useState("");
  const [artistLocation, setArtistLocation] = useState("Galway City");
  const [artistGenre, setArtistGenre] = useState("");
  const [songFile, setSongFile] = useState("");

  const addArtistSong = () => {
    if (!account?.email) {
      notify("Register or sign in with email to add to your personal library");
      return;
    }
    if (!artistName.trim() || !songFile) {
      notify("Artist name and song file needed");
      return;
    }
    onAddPersonalTrack({ name: artistName.trim(), location: artistLocation, song: songFile, vibe: artistGenre || "local original", tone: 440, image: placeForProfile(artistLocation).image || places[0].image });
    setArtistName("");
    setArtistGenre("");
    setSongFile("");
  };

  return (
    <div className="stack">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Library</p>
          <h2>Music library</h2>
      <span>{account ? `Signed in as ${account.email}` : "Register or sign in with email to save tracks to your personal library."}</span>
        </div>
      </header>
      <section className="studio-card">
        <div className="studio-heading">
          <div>
            <p>Personal library</p>
            <h3>Add a song to your account</h3>
          </div>
          <button onClick={addArtistSong}>Submit</button>
        </div>
        <input className="artist-input" value={artistName} onChange={(event) => setArtistName(event.target.value)} placeholder="Artist name" />
        <SelectRow label="Sound profile" value={artistLocation} setValue={setArtistLocation} options={locationProfileOptions} />
        <input className="artist-input" value={artistGenre} onChange={(event) => setArtistGenre(event.target.value)} placeholder="Genre or vibe" />
        <label className="upload-button wide">
          {songFile || "Choose song file"}
          <input type="file" accept="audio/*" onChange={(event) => setSongFile(event.target.files?.[0]?.name || "")} />
        </label>
      </section>
      {account && (
        <section className="personal-library-card">
          <div>
            <strong>Your personal library</strong>
            <span>{personalLibrary.length} saved track{personalLibrary.length === 1 ? "" : "s"}</span>
          </div>
        </section>
      )}
      <div className="artist-list">
        {[...personalLibrary, ...artists].map((artist) => (
          <article className="artist-card" key={artist.id || `${artist.name}-${artist.song}`}>
            <img className="artist-image" src={artist.image} alt="" />
            <div>
              <h3>{artist.name}</h3>
              <p>{artist.location} · {artist.song}</p>
              <span>{artist.personal ? "Personal library" : artist.vibe}</span>
            </div>
            <button onClick={() => { playArtistClip(artist, artistSourceRef); notify(`Playing ${artist.song}`); }}>Play</button>
            <button onClick={() => onSelectTrack(artist)}>Add to Studio</button>
            <button className="credit" onClick={() => { saveArtistCredit(artist); notify(`${artist.name} credit added`); }}>Use with credit</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Saved({ onBack, onProfile, notify }) {
  const [openProject, setOpenProject] = useState("");
  const saved = JSON.parse(localStorage.getItem("vlogmate-saved") || localStorage.getItem("enviosound-saved") || "[]");
  const credits = JSON.parse(localStorage.getItem("vlogmate-credits") || localStorage.getItem("enviosound-credits") || "[]");
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
          <img className="project-image" src={placeForProfile(project.location).image} alt="" />
          <div>
            <h3>{project.name}</h3>
            <p>{project.location} · {project.mood}</p>
            <span>{project.track}</span>
          </div>
          <div className="project-actions">
            <strong>{project.status}</strong>
            <button onClick={() => { setOpenProject(openProject === project.name ? "" : project.name); notify(openProject === project.name ? "Project closed" : `Opened ${project.name}`); }}>Open</button>
            <button onClick={() => {
              const blob = new Blob([`VlogMate Project\n\nTitle: ${project.name}\nLocation: ${project.location}\nMood: ${project.mood}\nTrack: ${project.track}\nStatus: ${project.status}\n`], { type: "text/plain" });
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

function Account({ onBack, account, onSignIn, onSignOut, personalLibrary }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const registerOrSignIn = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) return;
    onSignIn({ name: name.trim() || cleanEmail.split("@")[0], email: cleanEmail, image: "", provider: "Email account" });
    setEmail("");
    setName("");
  };

  return (
    <div className="stack">
      <button className="return-button" onClick={onBack}>Return home</button>
      <header className="top-header compact">
        <div>
          <p>Account</p>
          <h2>Your creator library</h2>
          <span>Register or sign in with email to save personal tracks and use them in Studio.</span>
        </div>
      </header>

      {account ? (
        <>
          <section className="account-card">
            <div className="profile-avatar">{account.email.slice(0, 2).toUpperCase()}</div>
            <div>
              <strong>{account.name || account.email}</strong>
              <span>{account.email}</span>
              <small>{account.provider}</small>
            </div>
            <button onClick={onSignOut}>Sign out</button>
          </section>
          <section className="credits-panel">
            <h3>Personal library</h3>
            {personalLibrary.length ? personalLibrary.map((track) => (
              <div key={track.id || `${track.name}-${track.song}`}>
                <span>{track.song}</span>
                <strong>{track.location}</strong>
              </div>
            )) : <p>No personal tracks yet. Add one from Library.</p>}
          </section>
        </>
      ) : (
        <section className="account-card sign-in">
          <div>
            <strong>Register or sign in</strong>
            <span>Enter an email address. Your personal Library is saved locally under that account.</span>
          </div>
          <div className="dev-login">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Display name" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            <button onClick={registerOrSignIn} disabled={!email.trim().includes("@")}>Continue</button>
          </div>
        </section>
      )}
    </div>
  );
}

function Profile({ onBack, notify, plan, setPlan }) {
  return (
    <div className="stack">
      <button className="back-link dark-text" onClick={onBack}>Back</button>
      <section className="profile-card">
        <div className="profile-avatar">TC</div>
        <h2>Travel Creator</h2>
        <p>Creator profile</p>
      </section>
      <PlanCard plan={plan} setPlan={setPlan} />
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

async function createElevenLabsTrack(profile, source, recordingBlob = null, soundDna = createSoundDna(profile, source), location = source, vlogStyle = "Travel Reel") {
  const bpm = chooseBpm(profile, soundDna);
  const mood = chooseMood(profile);
  const title = chooseTitle(profile, source);
  const instruments = chooseInstruments(profile, soundDna);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/generate-music`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, soundDna, source, location, mood: `${mood} for ${vlogStyle}`, bpm, instruments, durationMs: profile.calmBusy === "busy" ? 18000 : 22000 })
  });

  const data = await readApiJson(response);
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "ElevenLabs music generation failed.");
  if (!data.audioBase64) throw new Error("ElevenLabs did not return an audio file.");

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
    engine: "ElevenLabs",
    downloadName: `${title.replaceAll(" ", "-").toLowerCase()}.${audioBlob.type.includes("wav") ? "wav" : "mp3"}`,
    waveform,
    features: {
      "Average volume": profile.averageVolume,
      "Dynamic range": profile.dynamicRange,
      Brightness: profile.brightness,
      "Low energy": profile.lowEnergy,
      Noise: profile.noiseLevel,
      Pulse: profile.pulseIntensity,
      "Human activity": profile.humanActivity ?? 0,
      "Calm/busy": profile.calmBusy,
      "Nature/urban": profile.natureUrban
    }
  };
}

async function createElevenLabsNarration(text, voice) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/generate-narration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceId: voice.id })
  });
  const data = await readApiJson(response);
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Narration generation failed.");
  if (!data.audioBase64) throw new Error("ElevenLabs did not return narration audio.");
  const audioBlob = base64ToBlob(data.audioBase64, data.mimeType || "audio/mpeg");
  return { text, voiceName: voice.name, accent: voice.accent, engine: "ElevenLabs", audioBlob, audioUrl: URL.createObjectURL(audioBlob) };
}

function createLocalNarration(text, voice) {
  return { text, voiceName: voice.name, accent: voice.accent, engine: "Local browser voice", audioUrl: "" };
}

function createEditedVlog(clips, style, mood, location, voiceoverPrompt) {
  const classified = clips.map((clip, index) => ({
    ...clip,
    shotType: classifyShot(clip),
    score: scoreClipForEdit(clip, index)
  }));
  const scenic = classified.filter((clip) => clip.shotType === "establishing").sort((a, b) => b.score - a.score);
  const movement = classified.filter((clip) => ["action", "movement"].includes(clip.shotType)).sort((a, b) => b.score - a.score);
  const middle = classified.filter((clip) => ["detail", "local moment"].includes(clip.shotType)).sort((a, b) => b.score - a.score);
  const remaining = classified.filter((clip) => ![...scenic, ...movement, ...middle].includes(clip));
  const closingPool = [...classified].sort((a, b) => closingScore(b) - closingScore(a));
  const closing = closingPool[0];
  const ordered = uniqueClips([scenic[0], ...movement, ...middle, ...remaining, closing]).slice(0, 8);
  const orderedClips = ordered.map((clip, index) => ({
    ...clip,
    role: index === 0 ? "Opening hook" : index === ordered.length - 1 ? "Closing shot" : roleForShot(clip.shotType),
    duration: durationForEditedClip(clip, index, ordered.length, style)
  }));
  const transitions = orderedClips.map((clip, index) => index === 0 ? "Title card" : transitionForEditedVlog(style, clip.shotType));
  const captions = orderedClips.map((clip, index) => captionForEditedClip({ clip, index, total: orderedClips.length, location, style, mood }));
  const voiceoverScript = createPromptNarration({ location, style, mood, voiceoverPrompt });
  const soundtrack = {
    title: soundtrackTitleForMood(location, mood),
    mood,
    intensity: style.includes("Fast") || style.includes("Adventure") ? "high" : style.includes("Calm") ? "low" : "medium"
  };
  const editSummary = [
    `Opened with the strongest scenic moment.`,
    movement.length ? "Moved action and travel motion into the first sequence." : "Built the first sequence around the strongest location footage.",
    middle.length ? "Placed detail, food, and people moments through the middle." : "Kept the middle focused on atmosphere and place.",
    `Used ${transitions.filter((item) => item !== "Title card")[0] || "clean cuts"} transitions for the chosen style.`,
    `Closed on a final travel beat.`
  ];

  return { orderedClips, transitions, captions, voiceoverScript, soundtrack, editSummary };
}

function editedVlogToDraft({ edited, location, place, style, mood, track }) {
  const storyboard = edited.orderedClips.map((clip, index) => ({
    assetId: clip.id,
    label: clip.role,
    visual: cleanOverlayText(clip.name) || polishedClipLabel(clip.shotType, index),
    caption: edited.captions[index],
    transition: edited.transitions[index],
    pace: `${clip.duration.toFixed(1)}s`,
    duration: clip.duration,
    beat: clip.shotType
  }));

  return {
    title: `${location} vlog`,
    location,
    style,
    mood,
    cover: place.image,
    format: "Social video",
    orderedClips: edited.orderedClips,
    transitions: edited.transitions,
    captions: edited.captions,
    assets: edited.orderedClips.map((clip) => ({ id: clip.id, name: clip.name, type: clip.type, url: clip.url, role: clip.role, shotType: clip.shotType })),
    soundtrack: {
      ...edited.soundtrack,
      title: track?.title || edited.soundtrack.title,
      mood: track?.mood || edited.soundtrack.mood,
      style: track?.features?.["Soundtrack style"] || edited.soundtrack.style,
      bpm: track?.bpm || edited.soundtrack.bpm,
      instruments: track?.instruments || edited.soundtrack.instruments,
      audioUrl: track?.audioUrl || ""
    },
    narration: edited.voiceoverScript,
    voiceoverScript: edited.voiceoverScript,
    storyboard,
    editSummary: edited.editSummary,
    remotion: { fps: 30, width: 1080, height: 1920, scenes: storyboard.map((scene) => scene.label), duration: storyboard.reduce((total, scene) => total + scene.duration, 0) },
    scores: { Watchability: 92, "Music match": 88, "Edit rhythm": 90 }
  };
}

function uniqueClips(clips) {
  const seen = new Set();
  return clips.filter((clip) => {
    if (!clip || seen.has(clip.id)) return false;
    seen.add(clip.id);
    return true;
  });
}

function classifyShot(asset) {
  const name = cleanAssetName(asset.name).toLowerCase();
  if (/drone|wide|view|landscape|beach|sea|harbour|mountain|street|city|skyline|cliff|sunset|establish/.test(name)) return "establishing";
  if (/food|coffee|cafe|restaurant|market|plate|drink|breakfast|dinner/.test(name)) return "detail";
  if (/walk|run|bike|car|train|boat|dance|action|adventure|hike|motion/.test(name)) return "action";
  if (/friend|people|person|selfie|face|family|reaction/.test(name)) return "local moment";
  if (asset.type === "Photo") return "detail";
  return "movement";
}

function inferAssetSubject(asset, location) {
  const cleaned = cleanOverlayText(asset?.name || "");
  if (!cleaned) return location;
  const generic = /^(img|image|video|clip|photo|dsc|mov|untitled|screen recording|whatsapp|pxl|dcim)$/i.test(cleaned);
  return generic ? location : cleaned;
}

function cleanOverlayText(text) {
  const withoutExtension = String(text || "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const lower = withoutExtension.toLowerCase();
  const stockSource = /\b(filmsupply|film supply|pexels|shutterstock|getty|istock|stock|unsplash|storyblocks|artgrid|envato|adobe|videvo|motion array)\b/i.test(lower);
  const weirdFilename = /\b(img|image|video|clip|photo|dsc|mov|mvi|gh0|gopr|pxl|dcim|whatsapp|screen recording)\b/i.test(lower);
  const hasLongNumber = /\d{4,}/.test(lower);
  const tooLong = withoutExtension.split(/\s+/).length > 5 || withoutExtension.length > 34;
  if (!withoutExtension || stockSource || weirdFilename || hasLongNumber || tooLong) return "";
  return withoutExtension.replace(/\d+/g, "").replace(/\s+/g, " ").trim();
}

function cleanAssetName(name) {
  return String(name || "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPromptDetails(prompt) {
  const cleaned = String(prompt || "")
    .replace(/make it|mention|keep it|sound like|voiceover|narration|short|poetic|energetic|calm|tiktok|travel|diary/gi, " ")
    .replace(/[.?!]/g, ",");
  return cleaned
    .split(/,|\band\b|\bwith\b/)
    .map((item) => item.trim().replace(/^the\s+/i, ""))
    .filter((item) => item.length > 2)
    .slice(0, 5);
}

function naturalList(items) {
  const clean = items.filter(Boolean);
  if (clean.length <= 1) return clean[0] || "the day";
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean.at(-1)}`;
}

function scoreClipForEdit(clip, index) {
  const name = cleanAssetName(clip.name).toLowerCase();
  let score = 80 - index * 2;
  if (/drone|wide|view|harbour|sea|street|cliff|skyline|sunset|beach/.test(name)) score += 24;
  if (/walk|run|boat|train|car|bike|hike|dance|motion/.test(name)) score += 18;
  if (/food|coffee|market|cafe|plate|drink/.test(name)) score += 14;
  if (/people|friend|selfie|reaction|face/.test(name)) score += 12;
  if (clip.type === "Video") score += 8;
  return score;
}

function closingScore(clip) {
  const name = cleanAssetName(clip.name).toLowerCase();
  return clip.score + (/sunset|night|leaving|end|final|view|sea|harbour|wide/.test(name) ? 18 : 0);
}

function roleForShot(shotType) {
  if (shotType === "establishing") return "Establishing shot";
  if (shotType === "detail") return "Detail shot";
  if (shotType === "local moment") return "Local moment";
  return "Main sequence";
}

function durationForEditedClip(clip, index, total, style) {
  const fast = style.includes("Fast");
  const calm = style.includes("Calm") || style.includes("Documentary");
  if (index === 0) return fast ? 1.2 : 1.6;
  if (index === total - 1) return fast ? 2.2 : calm ? 4.6 : 3.6;
  if (clip.shotType === "establishing") return calm ? 3.8 : fast ? 1.8 : 3.0;
  if (clip.shotType === "detail" || clip.shotType === "local moment") return fast ? 1.4 : calm ? 2.6 : 2.0;
  if (clip.shotType === "action" || clip.shotType === "movement") return fast ? 1.1 : 1.6;
  return fast ? 1.4 : 2.4;
}

function polishedClipLabel(shotType, index) {
  if (index === 0) return "Opening travel moment";
  if (shotType === "establishing") return "Scenic location clip";
  if (shotType === "detail") return "Detail clip";
  if (shotType === "local moment") return "Local moment clip";
  if (shotType === "action") return "Movement clip";
  return "Travel clip";
}

function transitionForEditedVlog(style, shotType) {
  const lower = style.toLowerCase();
  if (lower.includes("tiktok") || lower.includes("fast")) return shotType === "action" ? "Quick cut" : "Zoom";
  if (lower.includes("calm")) return "Fade";
  if (lower.includes("documentary")) return shotType === "establishing" ? "Map/title card" : "Clean cut";
  if (lower.includes("cinematic")) return "Crossfade";
  if (lower.includes("adventure")) return "Zoom";
  return shotType === "detail" ? "Match cut" : "Crossfade";
}

function captionForEditedClip({ clip, index, total, location, style, mood }) {
  if (index === 0) return `${location}`;
  if (index === total - 1) return closingCaption(location, mood);
  if (style.includes("Fast")) return fastCaption(clip.shotType, location);
  if (style.includes("Documentary")) return documentaryCaption(clip.shotType, location);
  if (style.includes("Food") && clip.shotType === "detail") return "Small stop, big memory";
  if (style.includes("Calm")) return calmCaption(clip.shotType, location);
  return travelCaption(clip.shotType, location);
}

function travelCaption(shotType, location) {
  if (shotType === "establishing") return `${location} at golden hour`;
  if (shotType === "detail") return "Small details";
  if (shotType === "local moment") return "Local moments";
  if (shotType === "action") return "The journey continues";
  return "City streets";
}

function calmCaption(shotType, location) {
  if (shotType === "establishing") return `Soft ${location}`;
  if (shotType === "detail") return "Quiet by the water";
  return "The city slows down";
}

function fastCaption(shotType, location) {
  if (shotType === "establishing") return `${location}, straight in`;
  if (shotType === "detail") return "Quick stop";
  return "Next moment";
}

function documentaryCaption(shotType, location) {
  if (shotType === "establishing") return `${location}, slowly`;
  if (shotType === "local moment") return "Everyday life";
  return "Street by street";
}

function closingCaption(location, mood) {
  if (mood.includes("Calm")) return `A quiet goodbye to ${location}`;
  if (mood.includes("Energetic")) return "One last burst of the trip";
  return `Last light in ${location}`;
}

function createPromptNarration({ location, style, mood, voiceoverPrompt }) {
  const details = extractPromptDetails(voiceoverPrompt);
  const detailLine = details.length ? naturalList(details) : "the streets, the light, and the little moments in between";
  if (style.includes("Fast")) return `${location} came at me fast: ${detailLine}. Every turn had a bit of motion, a bit of noise, and one more reason to keep walking.`;
  if (style.includes("Calm")) return `${location} felt quiet in the best way. I remember ${detailLine}, and the soft pace of moving through the day without rushing it.`;
  if (style.includes("Documentary")) return `${location} tells its story through ${detailLine}. I followed those details until the place started to feel familiar.`;
  if (style.includes("Food")) return `${location} stayed with me through ${detailLine}. The trip felt warm, local, and full of small pauses worth keeping.`;
  if (style.includes("Adventure")) return `${location} felt open and alive, from ${detailLine}. I kept chasing the next bit of the day until the light changed.`;
  return `${location} felt ${mood.toLowerCase()}, with ${detailLine}. I followed the day through those moments, and somehow they all became one memory.`;
}

function soundtrackTitleForMood(location, mood) {
  if (mood.includes("Energetic")) return `${location} Pulse`;
  if (mood.includes("Calm")) return `${location} Drift`;
  if (mood.includes("Moody")) return `${location} Afterlight`;
  if (mood.includes("Bright")) return `${location} Glow`;
  return `${location} Story`;
}

async function createLibraryTrack(artist) {
  const profile = locationProfiles[artist.location] || profileFallback();
  const soundDna = createSoundDna(profile, `${artist.location} library track`);
  const duration = 14;
  const bpm = Math.round(82 + profile.pulseIntensity * 56);
  const context = new OfflineAudioContext(2, duration * 44100, 44100);
  const master = context.createGain();
  master.gain.value = 0.58;
  master.connect(context.destination);
  const notes = [0, 3, 7, 10, 12, 10, 7, 3];
  const beat = 60 / bpm;

  notes.forEach((semi, index) => {
    for (let repeat = 0; repeat < Math.ceil(duration / (notes.length * beat)); repeat += 1) {
      const start = repeat * notes.length * beat + index * beat;
      if (start >= duration) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = artist.vibe.includes("piano") ? "triangle" : artist.vibe.includes("city") || artist.vibe.includes("synth") ? "square" : "sine";
      oscillator.frequency.value = artist.tone * Math.pow(2, semi / 12);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, Math.min(start + beat * 0.86, duration));
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(Math.min(start + beat * 0.9, duration));
    }
  });

  addLocalTexture(context, master, profile, duration);
  const buffer = await context.startRendering();
  const audioBlob = encodeWav(buffer);

  return {
    title: artist.song,
    source: `${artist.name} · ${artist.location}`,
    artist: artist.name,
    mood: artist.vibe,
    bpm,
    instruments: ["artist library preview", artist.vibe, "location ambience"],
    profile,
    soundDna,
    audioBlob,
    audioUrl: URL.createObjectURL(audioBlob),
    engine: "Library",
    downloadName: `${artist.song.replaceAll(" ", "-").toLowerCase()}-library-preview.wav`,
    waveform: extractWaveform(buffer),
    features: {
      "Average volume": profile.averageVolume,
      "Dynamic range": profile.dynamicRange,
      Brightness: profile.brightness,
      "Low energy": profile.lowEnergy,
      Noise: profile.noiseLevel,
      Pulse: profile.pulseIntensity,
      "Human activity": profile.humanActivity ?? 0,
      "Library artist": artist.name,
      Location: artist.location
    }
  };
}

async function exportVlogVideo(draft, track, narration, notify) {
  if (!draft) return;
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    exportVlogHtml(draft, track, narration, notify);
    return;
  }

  notify("Rendering vlog video...");
  const isLandscape = draft.remotion.width > draft.remotion.height;
  const width = isLandscape ? 1280 : 720;
  const height = isLandscape ? 720 : 1280;
  const mediaItems = await prepareVlogMedia(draft.assets);
  const captions = draft.storyboard?.length
    ? draft.storyboard.map((scene) => scene.caption)
    : mediaItems.map((asset, index) => createVisualCaption({ asset, index, total: mediaItems.length, location: draft.location, vlogStyle: draft.title }));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const stream = canvas.captureStream(30);
  let audioContext = null;
  const audioElements = [];
  const sceneDurations = getSceneDurations(draft, mediaItems);
  const durationMs = Math.max(9000, Math.min(42000, sceneDurations.reduce((total, value) => total + value, 0) * 1000));

  try {
    if (track?.audioUrl || narration?.audioUrl) {
      audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      if (track?.audioUrl) audioElements.push(connectAudioUrl(audioContext, destination, track.audioUrl, 0.32, true, durationMs / 1000, Boolean(narration?.audioUrl)));
      if (narration?.audioUrl) audioElements.push(connectAudioUrl(audioContext, destination, narration.audioUrl, 0.92, false, durationMs / 1000, false));
      destination.stream.getAudioTracks().forEach((audioTrack) => stream.addTrack(audioTrack));
      await audioContext.resume();
      await Promise.all(audioElements.map((element) => element.play()));
    }
  } catch {
    audioElements.forEach((element) => element.pause());
    audioContext?.close?.();
    audioContext = null;
  }

  const mimeType = chooseVideoMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  const finished = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = () => reject(new Error("Video render failed."));
  });

  const started = performance.now();
  await playRenderableVideos(mediaItems);
  recorder.start();

  await new Promise((resolve) => {
    const draw = (now) => {
      const progress = Math.min(1, (now - started) / durationMs);
      drawVlogFrame(context, { draft, track, width, height, progress, mediaItems, captions, sceneDurations });
      if (progress < 1) requestAnimationFrame(draw);
      else resolve();
    };
    requestAnimationFrame(draw);
  });

  recorder.stop();
  await finished;
  stopRenderableVideos(mediaItems);
  audioElements.forEach((element) => element.pause());
  await audioContext?.close?.();

  const blob = new Blob(chunks, { type: mimeType || "video/webm" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${draft.title.replaceAll(" ", "-").toLowerCase()}-vlog.webm`;
  link.click();
  URL.revokeObjectURL(url);
  notify("Vlog video downloaded");
}

function connectAudioUrl(audioContext, destination, url, volume, loop, durationSeconds = 18, duckForVoice = false) {
  const element = new Audio(url);
  element.loop = loop;
  element.volume = 1;
  const source = audioContext.createMediaElementSource(element);
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  const end = now + durationSeconds;
  const ducked = duckForVoice ? volume * 0.46 : volume;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(duckForVoice ? ducked : volume, now + 1.2);
  if (duckForVoice) {
    gain.gain.setValueAtTime(ducked, now + 1.2);
    gain.gain.linearRampToValueAtTime(volume * 0.62, Math.max(now + 1.4, end - 5.2));
  }
  gain.gain.linearRampToValueAtTime(0.001, Math.max(now + 1.5, end - 2.2));
  source.connect(gain).connect(destination);
  return element;
}

async function prepareVlogMedia(assets) {
  const renderable = assets.filter((asset) => asset.url && (asset.type === "Video" || asset.type === "Photo"));
  const sourceAssets = renderable.length ? renderable : assets.filter((asset) => asset.url);
  const prepared = await Promise.all(sourceAssets.map(async (asset) => {
    if (asset.type === "Video") {
      const video = document.createElement("video");
      video.src = asset.url;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      await waitForMedia(video, "loadedmetadata");
      return { ...asset, element: video, duration: Math.min(Math.max(video.duration || 4, 3), 7) };
    }

    const image = new Image();
    image.src = asset.url;
    await waitForImage(image);
    return { ...asset, type: "Photo", element: image, duration: 4.5 };
  }));

  return prepared.length ? prepared : [{ name: "Generated title card", type: "Card", duration: 5 }];
}

function waitForMedia(element, eventName) {
  return new Promise((resolve) => {
    if (element.readyState >= 1) resolve();
    else {
      element.addEventListener(eventName, resolve, { once: true });
      element.addEventListener("error", resolve, { once: true });
    }
  });
}

function waitForImage(image) {
  return new Promise((resolve) => {
    if (image.complete) resolve();
    else {
      image.onload = resolve;
      image.onerror = resolve;
    }
  });
}

async function playRenderableVideos(mediaItems) {
  await Promise.all(mediaItems.filter((item) => item.type === "Video").map(async (item) => {
    try {
      item.element.currentTime = 0;
      await item.element.play();
    } catch {
      // Drawing still frames is better than failing the export.
    }
  }));
}

function stopRenderableVideos(mediaItems) {
  mediaItems.filter((item) => item.type === "Video").forEach((item) => item.element.pause());
}

function chooseVideoMimeType() {
  return [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm"
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function getSceneDurations(draft, mediaItems) {
  const storyboard = draft.storyboard || [];
  return mediaItems.map((item, index) => storyboard[index]?.duration || item.duration || 2.4);
}

function getTimedScene(progress, durations) {
  const total = durations.reduce((sum, value) => sum + value, 0) || 1;
  const time = progress * total;
  let elapsed = 0;
  for (let index = 0; index < durations.length; index += 1) {
    const next = elapsed + durations[index];
    if (time <= next || index === durations.length - 1) {
      return { sceneIndex: index, sceneProgress: clamp((time - elapsed) / Math.max(0.001, durations[index])) };
    }
    elapsed = next;
  }
  return { sceneIndex: 0, sceneProgress: 0 };
}

function drawVlogFrame(context, { draft, track, width, height, progress, mediaItems, captions, sceneDurations }) {
  const { sceneIndex, sceneProgress } = getTimedScene(progress, sceneDurations || getSceneDurations(draft, mediaItems));
  const item = mediaItems[sceneIndex];
  const scene = draft.storyboard?.[sceneIndex] || {};

  context.fillStyle = "#0f172a";
  context.fillRect(0, 0, width, height);
  drawMediaCover(context, item, width, height, sceneProgress, draft.style);
  drawTransitionEffect(context, { width, height, sceneProgress, transition: scene.transition, style: draft.style });
  drawVlogOverlays(context, { draft, track, width, height, progress, sceneIndex, caption: captions[sceneIndex] || captions.at(-1) || "" });
}

function drawMediaCover(context, item, width, height, sceneProgress, style = "") {
  if (!item?.element) {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#2a9d8f");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    return;
  }

  const mediaWidth = item.element.videoWidth || item.element.naturalWidth || width;
  const mediaHeight = item.element.videoHeight || item.element.naturalHeight || height;
  if (item.type === "Video" && item.element.duration) {
    const targetTime = Math.min(item.element.duration - 0.08, sceneProgress * item.element.duration);
    if (Number.isFinite(targetTime) && Math.abs(item.element.currentTime - targetTime) > 0.4) item.element.currentTime = targetTime;
  }

  const eased = easeInOut(sceneProgress);
  const cinematicMove = style.includes("Cinematic") || style.includes("Calm") || style.includes("Documentary");
  const scale = Math.max(width / mediaWidth, height / mediaHeight) * (cinematicMove ? 1 + eased * 0.055 : item.type === "Photo" ? 1 + eased * 0.035 : 1);
  const drawWidth = mediaWidth * scale;
  const drawHeight = mediaHeight * scale;
  const pan = cinematicMove ? (eased - 0.5) * width * 0.035 : 0;
  const x = (width - drawWidth) / 2 + pan;
  const y = (height - drawHeight) / 2;
  context.drawImage(item.element, x, y, drawWidth, drawHeight);
}

function drawVlogOverlays(context, { draft, track, width, height, progress, sceneIndex, caption }) {
  const padding = width * 0.06;
  const topFade = context.createLinearGradient(0, 0, 0, height * 0.30);
  topFade.addColorStop(0, "rgba(15,23,42,.72)");
  topFade.addColorStop(1, "rgba(15,23,42,0)");
  context.fillStyle = topFade;
  context.fillRect(0, 0, width, height * 0.30);

  const bottomFade = context.createLinearGradient(0, height * 0.54, 0, height);
  bottomFade.addColorStop(0, "rgba(15,23,42,0)");
  bottomFade.addColorStop(1, "rgba(15,23,42,.86)");
  context.fillStyle = bottomFade;
  context.fillRect(0, height * 0.54, width, height * 0.46);

  context.fillStyle = "#fafaf9";
  context.font = `900 ${Math.round(width * 0.052)}px Inter, system-ui, sans-serif`;
  context.fillText(sceneIndex === 0 ? draft.title : draft.location, padding, padding * 1.6);

  context.fillStyle = "rgba(250,250,249,.82)";
  context.font = `700 ${Math.round(width * 0.028)}px Inter, system-ui, sans-serif`;
  context.fillText(`${track?.title || draft.soundtrack} · ${draft.format}`, padding, padding * 2.25);

  context.fillStyle = "#fafaf9";
  context.font = `800 ${Math.round(width * 0.045)}px Inter, system-ui, sans-serif`;
  wrapCanvasText(context, caption, padding, height * 0.72, width - padding * 2, width * 0.058);

  context.fillStyle = "rgba(15,23,42,.68)";
  context.fillRect(padding, height - padding * 1.5, width - padding * 2, 8);
  context.fillStyle = "#f4c95d";
  context.fillRect(padding, height - padding * 1.5, (width - padding * 2) * progress, 8);
}

function drawTransitionEffect(context, { width, height, sceneProgress, transition, style }) {
  const name = String(transition || "").toLowerCase();
  const fast = String(style || "").includes("Fast") || String(style || "").includes("TikTok");
  const inEdge = easeOut(Math.max(0, 1 - sceneProgress / (fast ? 0.10 : 0.18)));
  const outEdge = easeInOut(Math.max(0, (sceneProgress - (fast ? 0.88 : 0.84)) / (fast ? 0.12 : 0.16)));
  const edge = Math.max(inEdge, outEdge);
  if (!edge) return;
  context.save();
  if (name.includes("fade") || name.includes("crossfade") || name.includes("title")) {
    context.fillStyle = `rgba(15,23,42,${edge * (name.includes("crossfade") ? 0.34 : 0.62)})`;
    context.fillRect(0, 0, width, height);
  } else if (name.includes("whip")) {
    context.fillStyle = `rgba(250,250,249,${edge * 0.18})`;
    context.fillRect(0, 0, width, height);
  } else if (name.includes("zoom")) {
    context.strokeStyle = `rgba(250,250,249,${edge * 0.14})`;
    context.lineWidth = width * 0.026 * edge;
    context.strokeRect(width * 0.08, height * 0.08, width * 0.84, height * 0.84);
  }
  context.restore();
}

function easeInOut(value) {
  const v = clamp(value);
  return v * v * (3 - 2 * v);
}

function easeOut(value) {
  const v = clamp(value);
  return 1 - Math.pow(1 - v, 3);
}

function splitCaptions(text, count) {
  const sentences = String(text || "").match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) || [];
  if (!sentences.length) return Array.from({ length: count }, (_, index) => index === 0 ? "Travel moments assembled with music and narration." : "");
  const captions = Array.from({ length: count }, () => "");
  sentences.forEach((sentence, index) => {
    const slot = Math.min(count - 1, Math.floor((index / sentences.length) * count));
    captions[slot] = captions[slot] ? `${captions[slot]} ${sentence}` : sentence;
  });
  return captions.map((caption, index) => caption || sentences[Math.min(sentences.length - 1, index)]);
}

function drawTimelineBars(context, x, y, width, height, waveform, sceneProgress, color) {
  const bars = waveform.length ? waveform.slice(0, 34) : Array.from({ length: 34 }, (_, index) => 30 + Math.sin(index * 0.7) * 24 + (index % 5) * 3);
  const gap = 4;
  const barWidth = (width - gap * (bars.length - 1)) / bars.length;
  bars.forEach((value, index) => {
    const active = index / bars.length < sceneProgress;
    const barHeight = Math.max(8, (value / 100) * height);
    context.fillStyle = active ? color : "rgba(250,250,249,.34)";
    context.fillRect(x + index * (barWidth + gap), y + height - barHeight, barWidth, barHeight);
  });
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const words = String(text || "").split(/\s+/);
  let line = "";
  let currentY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) context.fillText(line, x, currentY);
}

function exportVlogHtml(draft, track, narration, notify) {
  const media = draft.assets.filter((asset) => asset.url && (asset.type === "Video" || asset.type === "Photo"));
  const mediaHtml = media.map((asset) => asset.type === "Video"
    ? `<video src="${asset.url}" muted autoplay loop playsinline></video>`
    : `<img src="${asset.url}" alt="">`
  ).join("");
  const visibleCaptions = (draft.storyboard || []).map((scene) => `<p>${escapeHtml(scene.caption)}</p>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(draft.title)}</title><style>body{margin:0;background:#0f172a;color:#fafaf9;font-family:Inter,system-ui,sans-serif}.vlog{min-height:100vh;display:grid;grid-template-rows:1fr auto}.media{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:8px}.media>*{width:100%;height:42vh;object-fit:cover;border-radius:18px}.caption{padding:28px;background:linear-gradient(180deg,rgba(15,23,42,.64),#0f172a)}h1{font-size:48px;line-height:1;margin:0 0 12px}p{font-size:20px;line-height:1.45}.meta{color:#f4c95d;font-weight:800}</style></head><body><main class="vlog"><section class="media">${mediaHtml || `<div></div>`}</section><section class="caption"><p class="meta">${escapeHtml(track?.title || draft.soundtrack)} · ${escapeHtml(draft.format)}</p><h1>${escapeHtml(draft.title)}</h1>${visibleCaptions}</section></main></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${draft.title.replaceAll(" ", "-").toLowerCase()}-vlog.html`;
  link.click();
  URL.revokeObjectURL(url);
  notify("Vlog page downloaded");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function createLocalTrack(profile, source, recordingBlob = null, soundDna = createSoundDna(profile, source)) {
  const template = chooseSoundtrackTemplate(profile, soundDna, source);
  const bpm = template.bpm;
  const mood = template.mood;
  const title = template.title;
  const instruments = template.instruments;
  const duration = template.duration;
  const context = new OfflineAudioContext(2, duration * 44100, 44100);
  renderCuratedSoundtrack(context, template, profile, soundDna);

  const buffer = await context.startRendering();
  const audioBlob = encodeWav(buffer);
  const audioUrl = URL.createObjectURL(audioBlob);

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
    engine: "Local model",
    downloadName: `${title.replaceAll(" ", "-").toLowerCase()}.wav`,
    waveform: extractWaveform(buffer),
    features: {
      "Average volume": profile.averageVolume,
      "Dynamic range": profile.dynamicRange,
      Brightness: profile.brightness,
      "Low energy": profile.lowEnergy,
      Noise: profile.noiseLevel,
      Pulse: profile.pulseIntensity,
      "Human activity": profile.humanActivity ?? 0,
      "Soundtrack style": template.name,
      Key: template.key,
      "Calm/busy": profile.calmBusy,
      "Nature/urban": profile.natureUrban
    }
  };
}

const soundtrackTemplates = {
  coastal: {
    name: "Coastal Cinematic",
    title: "Atlantic Light",
    mood: "emotional, spacious travel montage",
    bpm: 84,
    key: "D major",
    root: 146.83,
    scale: [0, 2, 4, 7, 9, 12],
    chords: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
    motif: [0, 2, 4, 7, 4, 2, 0, 4],
    instruments: ["atmospheric piano", "soft strings", "ocean ambience", "light percussion"],
    duration: 24
  },
  indie: {
    name: "Indie Travel",
    title: "Weekend Roads",
    mood: "nostalgic creator-style travel",
    bpm: 92,
    key: "G major",
    root: 196.00,
    scale: [0, 2, 4, 7, 9, 12],
    chords: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
    motif: [0, 4, 7, 4, 2, 4, 0, 2],
    instruments: ["guitar", "bass", "light percussion", "warm keys"],
    duration: 22
  },
  urban: {
    name: "Urban Explorer",
    title: "Streetlight Pulse",
    mood: "energetic but clean city rhythm",
    bpm: 112,
    key: "A minor",
    root: 110.00,
    scale: [0, 3, 5, 7, 10, 12],
    chords: [[0, 3, 7], [8, 12, 15], [3, 7, 10], [10, 14, 17]],
    motif: [0, 3, 5, 7, 5, 3, 10, 7],
    instruments: ["electronic rhythm", "bass groove", "plucks", "modern synth textures"],
    duration: 20
  },
  calm: {
    name: "Calm Nature",
    title: "Quiet Canopy",
    mood: "dreamy, soft, intimate travel",
    bpm: 74,
    key: "C major",
    root: 130.81,
    scale: [0, 2, 4, 7, 9, 12],
    chords: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]],
    motif: [0, 2, 4, 2, 0, 7, 4, 2],
    instruments: ["acoustic guitar", "soft pads", "birds/wind ambience", "soft piano"],
    duration: 26
  }
};

function chooseSoundtrackTemplate(profile, soundDna, source) {
  const name = String(source || "").toLowerCase();
  const template = /dublin|street|crowd|urban|city/.test(name) || soundDna.scores.urban > 48
    ? soundtrackTemplates.urban
    : /cafe|food|market|coffee|cork/.test(name) || soundDna.scores.human > 44
      ? soundtrackTemplates.indie
      : /galway|clare|cliff|coast|sea|rain|harbour|water/.test(name) || (soundDna.scores.natural > 46 && profile.lowEnergy > 0.44)
        ? soundtrackTemplates.coastal
        : soundtrackTemplates.calm;
  const modifier = soundDna.scores.urban > 50 ? 6 : soundDna.scores.natural > 55 ? -4 : 0;
  return {
    ...template,
    bpm: Math.max(64, Math.min(120, template.bpm + modifier + Math.round((profile.pulseIntensity - 0.42) * 8))),
    duration: template.duration + (profile.calmBusy === "calm" ? 2 : profile.calmBusy === "busy" ? -2 : 0)
  };
}

function renderCuratedSoundtrack(context, template, profile, soundDna) {
  const master = context.createGain();
  master.gain.setValueAtTime(0.001, 0);
  master.gain.linearRampToValueAtTime(0.62, 1.4);
  master.gain.setValueAtTime(0.62, Math.max(1.5, template.duration - 2.4));
  master.gain.linearRampToValueAtTime(0.001, template.duration);
  master.connect(context.destination);

  const beat = 60 / template.bpm;
  const pad = context.createGain();
  const melody = context.createGain();
  const bass = context.createGain();
  const rhythm = context.createGain();
  pad.gain.value = template.name.includes("Urban") ? 0.08 : 0.15;
  melody.gain.value = template.name.includes("Urban") ? 0.10 : 0.13;
  bass.gain.value = template.name.includes("Urban") ? 0.18 : 0.10;
  rhythm.gain.value = template.name.includes("Calm") ? 0.045 : template.name.includes("Coastal") ? 0.075 : 0.13;
  pad.connect(master);
  melody.connect(master);
  bass.connect(master);
  rhythm.connect(master);

  scheduleTemplateAmbience(context, pad, template, profile, soundDna);
  scheduleTemplateChords(context, pad, template, beat);
  scheduleTemplateMelody(context, melody, template, beat);
  scheduleTemplateBass(context, bass, template, beat);
  scheduleTemplateRhythm(context, rhythm, template, beat, profile);
}

function scheduleTemplateAmbience(context, destination, template, profile, soundDna) {
  const step = template.name.includes("Urban") ? 0.42 : 0.64;
  for (let time = 0; time < template.duration; time += step) {
    const frequency = template.name.includes("Urban")
      ? template.root * 0.75 + Math.sin(time * 1.2) * 10
      : template.root * 1.5 + Math.sin(time * 0.38) * (18 + soundDna.scores.natural / 3);
    addLocalNote(context, destination, frequency, time, template.name.includes("Urban") ? 0.20 : 0.85, "sine", template.name.includes("Urban") ? 0.018 : 0.026);
  }
}

function scheduleTemplateChords(context, destination, template, beat) {
  for (let time = 0, index = 0; time < template.duration; time += beat * 4, index += 1) {
    const sectionGain = time < beat * 8 ? 0.58 : time > template.duration - beat * 8 ? 0.52 : 1;
    template.chords[index % template.chords.length].forEach((semi, voice) => {
      addLocalNote(context, destination, template.root * Math.pow(2, semi / 12), time + voice * 0.018, beat * 3.8, "sine", 0.052 * sectionGain);
    });
  }
}

function scheduleTemplateMelody(context, destination, template, beat) {
  const interval = template.name.includes("Urban") ? beat / 2 : template.name.includes("Calm") ? beat * 1.5 : beat;
  for (let time = beat * 2, step = 0; time < template.duration - beat * 3; time += interval, step += 1) {
    if (template.name.includes("Calm") && step % 6 === 5) continue;
    const motifDegree = template.motif[step % template.motif.length];
    const variation = step > 12 && step % 4 === 0 ? 2 : 0;
    const degree = template.scale[(motifDegree + variation) % template.scale.length];
    const volume = time < beat * 8 ? 0.055 : 0.092;
    addLocalNote(context, destination, template.root * Math.pow(2, (degree + 12) / 12), time, interval * 0.72, template.name.includes("Urban") ? "triangle" : "sine", volume);
  }
}

function scheduleTemplateBass(context, destination, template, beat) {
  const pattern = template.name.includes("Urban") ? [0, 0, 7, 10, 7, 3] : [0, 0, 7, 5];
  for (let time = beat * 4, step = 0; time < template.duration - beat * 3; time += beat, step += 1) {
    if (template.name.includes("Calm") && step % 2) continue;
    addLocalNote(context, destination, (template.root / 2) * Math.pow(2, pattern[step % pattern.length] / 12), time, beat * 0.78, "triangle", template.name.includes("Urban") ? 0.115 : 0.075);
  }
}

function scheduleTemplateRhythm(context, destination, template, beat, profile) {
  const subdivision = template.name.includes("Urban") ? beat / 2 : beat;
  for (let time = beat * 4, step = 0; time < template.duration - beat * 4; time += subdivision, step += 1) {
    if (!template.name.includes("Calm") && step % 4 === 0) addLocalKick(context, destination, time, profile);
    if (template.name.includes("Urban") && step % 4 === 2) addLocalNoiseHit(context, destination, time, 0.08, 0.035);
    if (step % (template.name.includes("Urban") ? 2 : 4) === 1) addLocalHat(context, destination, time, profile);
  }
}

function createSoundDna(profile, label) {
  const rawNatural = clamp((profile.natureUrban === "nature" ? 0.34 : 0.08) + profile.lowEnergy * 0.22 + (1 - profile.noiseLevel) * 0.20 + (1 - profile.pulseIntensity) * 0.14 + (profile.brightness > 0.62 ? 0.10 : 0.04));
  const rawHuman = clamp((profile.humanActivity ?? 0) * 0.46 + profile.pulseIntensity * 0.24 + profile.averageVolume * 0.14 + profile.dynamicRange * 0.10 + (profile.detected?.some((item) => /crowd|voice|footstep|performer|busker|conversation/i.test(item)) ? 0.18 : 0.04));
  const rawUrban = clamp((profile.natureUrban === "urban" ? 0.28 : 0.06) + profile.noiseLevel * 0.30 + profile.pulseIntensity * 0.16 + profile.lowEnergy * 0.10);
  const total = Math.max(0.01, rawNatural + rawHuman + rawUrban);
  const natural = Math.round((rawNatural / total) * 100);
  const human = Math.round((rawHuman / total) * 100);
  const urban = Math.max(0, 100 - natural - human);
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
  const voiceBand = estimateBandEnergy(channel, buffer.sampleRate, 300, 3400);
  const lowBand = estimateBandEnergy(channel, buffer.sampleRate, 45, 260);

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
  const speechPresence = clamp(voiceBand * 2.2 - lowBand * 0.45 + dynamicRange * 0.18);
  const humanActivity = clamp(speechPresence * 0.46 + pulseIntensity * 0.28 + averageVolume * 0.16 + dynamicRange * 0.10);
  const calmBusy = pulseIntensity > 0.58 || noiseLevel > 0.62 ? "busy" : averageVolume < 0.35 ? "calm" : "balanced";
  const natureUrban = noiseLevel > 0.64 && humanActivity < 0.42 ? "urban" : "nature";
  const detected = detectSoundHints({ averageVolume, dynamicRange, brightness, lowEnergy, noiseLevel, pulseIntensity, humanActivity, speechPresence, calmBusy, natureUrban });

  return { averageVolume, dynamicRange, brightness, lowEnergy, noiseLevel, pulseIntensity, humanActivity, speechPresence, calmBusy, natureUrban, detected };
}

function estimateBandEnergy(channel, sampleRate, minHz, maxHz) {
  const sampleCount = Math.min(4096, channel.length);
  if (sampleCount < 64) return 0;
  const stride = Math.max(1, Math.floor(channel.length / sampleCount));
  const frequencyStep = Math.max(90, (maxHz - minHz) / 12);
  let inBand = 0;
  let total = 0;

  for (let frequency = minHz; frequency <= maxHz; frequency += frequencyStep) {
    let real = 0;
    let imag = 0;
    for (let i = 0; i < sampleCount; i += 1) {
      const sample = channel[i * stride] || 0;
      const angle = (2 * Math.PI * frequency * i * stride) / sampleRate;
      real += sample * Math.cos(angle);
      imag -= sample * Math.sin(angle);
    }
    inBand += Math.sqrt(real * real + imag * imag) / sampleCount;
  }

  for (let i = 0; i < sampleCount; i += 1) total += Math.abs(channel[i * stride] || 0);
  return clamp(inBand / Math.max(total / sampleCount, 0.0001));
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
  if (profile.humanActivity > 0.55 || profile.speechPresence > 0.42) hints.push("voices or performers");
  if (profile.pulseIntensity > 0.54 && profile.humanActivity > 0.38) hints.push("footsteps or hand rhythm");
  if (profile.lowEnergy > 0.62) hints.push("low rumble");
  if (profile.brightness > 0.66) hints.push("birds or bright peaks");
  if (profile.noiseLevel > 0.62) hints.push(profile.natureUrban === "urban" ? "traffic/crowds" : "rain/wind texture");
  if (profile.pulseIntensity > 0.58) hints.push("repeated pulses");
  if (profile.calmBusy === "calm") hints.push("smooth ambience");
  if (hints.length < 3) hints.push(profile.natureUrban === "urban" ? "city texture" : "wind or waves");
  return hints.slice(0, 4);
}

function chooseMusicPreset(profile, soundDna, source) {
  const name = String(source || "").toLowerCase();
  const coastal = /galway|clare|cliff|coast|sea|rain|harbour|water/.test(name) || (soundDna.scores.natural > 48 && profile.lowEnergy > 0.46);
  const urban = /dublin|street|crowd|city/.test(name) || soundDna.scores.urban > 48;
  const food = /cafe|food|market|coffee|cork/.test(name);
  const calm = profile.calmBusy === "calm" || soundDna.scores.natural > 56;
  if (urban) return makePreset("Urban Travel", 108 + Math.round(profile.pulseIntensity * 10), 110.00, [0, 3, 7, 10], [[0, 3, 7], [8, 12, 15], [3, 7, 10], [10, 14, 17]], ["synth bass", "soft electronic drums", "plucks", "city texture"], 19, 0.62);
  if (food) return makePreset("Indie Travel", 88 + Math.round(profile.humanActivity * 9), 196.00, [0, 2, 4, 7, 9, 12], [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], ["guitar", "soft drums", "bass", "warm keys"], 22, 0.60);
  if (calm) return makePreset("Calm Aesthetic", 68 + Math.round(profile.brightness * 10), 130.81, [0, 2, 4, 7, 9, 12], [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]], ["acoustic guitar", "warm pad", "soft piano", "light shaker"], 25, 0.56);
  if (coastal) return makePreset("Cinematic Coastal", 80 + Math.round(profile.pulseIntensity * 10), 146.83, [0, 2, 4, 7, 9, 12], [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], ["soft piano", "pads", "strings", "light percussion", "ambient waves"], 24, 0.58);
  return makePreset("Indie Travel", 92, 196.00, [0, 2, 4, 7, 9, 12], [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], ["guitar", "soft drums", "bass", "warm keys"], 22, 0.60);
}

function makePreset(name, bpm, root, scale, chords, instruments, duration, master) {
  return { name, bpm, root, scale, chords, instruments, duration, master };
}

function addLocalTexture(context, master, profile, duration, soundDna = createSoundDna(profile, "texture"), preset = chooseMusicPreset(profile, soundDna, "")) {
  const gain = context.createGain();
  gain.gain.value = preset.name.includes("Urban") ? 0.055 : preset.name.includes("Coastal") ? 0.14 : 0.09;
  gain.connect(master);
  const interval = preset.name.includes("Urban") ? 0.34 : 0.48;
  for (let time = 0; time < duration; time += Math.max(0.16, interval)) {
    const sweep = preset.name.includes("Urban") ? preset.root * 0.75 + Math.sin(time * 1.4) * 18 : preset.root * 1.5 + Math.sin(time * 0.45) * 22;
    addLocalNote(context, gain, sweep, time, preset.name.includes("Urban") ? 0.18 : 0.72, preset.name.includes("Urban") ? "triangle" : "sine", 0.028);
  }
}

function addLocalChords(context, master, root, beat, duration, profile, soundDna = createSoundDna(profile, "chords"), preset = chooseMusicPreset(profile, soundDna, "")) {
  const gain = context.createGain();
  gain.gain.value = preset.name.includes("Urban") ? 0.09 : 0.15;
  gain.connect(master);
  for (let time = 0, index = 0; time < duration; time += beat * 4, index += 1) {
    const section = time < beat * 8 ? 0.62 : time > duration - beat * 8 ? 0.50 : 1;
    const type = preset.name.includes("Urban") ? "triangle" : "sine";
    preset.chords[index % preset.chords.length].forEach((semi) => addLocalNote(context, gain, root * Math.pow(2, semi / 12), time, beat * 3.8, type, (0.055 + soundDna.scores.natural / 1800) * section));
  }
}

function addLocalMelody(context, master, root, beat, duration, profile, soundDna = createSoundDna(profile, "melody"), preset = chooseMusicPreset(profile, soundDna, "")) {
  const gain = context.createGain();
  gain.gain.value = preset.name.includes("Urban") ? 0.10 : 0.13;
  gain.connect(master);
  const interval = preset.name.includes("Urban") ? beat / 2 : preset.name.includes("Calm") ? beat * 1.5 : beat;
  const motif = [0, 2, 4, 2, 0, 4, 5, 4];
  for (let time = beat, step = 0; time < duration; time += interval, step += 1) {
    if (step % 6 === 5 && preset.name.includes("Calm")) continue;
    const scaleDegree = preset.scale[(motif[step % motif.length] + (step > 12 ? 1 : 0)) % preset.scale.length];
    const volume = time < beat * 6 ? 0.055 : time > duration - beat * 6 ? 0.045 : 0.105;
    addLocalNote(context, gain, root * Math.pow(2, (scaleDegree + 12) / 12), time, interval * 0.68, preset.name.includes("Urban") ? "triangle" : "sine", volume);
  }
}

function addLocalBass(context, master, root, beat, duration, profile, preset = chooseMusicPreset(profile, createSoundDna(profile, "bass"), "")) {
  if (profile.lowEnergy < 0.35 && profile.natureUrban !== "urban") return;
  const gain = context.createGain();
  gain.gain.value = preset.name.includes("Urban") ? 0.18 : 0.12 + profile.lowEnergy * 0.10;
  gain.connect(master);
  const pattern = preset.name.includes("Urban") ? [0, 0, 7, 10, 7, 3] : preset.name.includes("Calm") ? [0, 0, 5, 0] : [0, 0, 7, 5];
  for (let time = 0, step = 0; time < duration; time += beat, step += 1) {
    if (preset.name.includes("Calm") && step % 2) continue;
    addLocalNote(context, gain, (root / 2) * Math.pow(2, pattern[step % pattern.length] / 12), time, beat * 0.72, "triangle", preset.name.includes("Urban") ? 0.13 : 0.09);
  }
}

function addLocalPercussion(context, master, beat, duration, profile, soundDna, preset = chooseMusicPreset(profile, soundDna, "")) {
  const gain = context.createGain();
  gain.gain.value = preset.name.includes("Calm") ? 0.08 : preset.name.includes("Urban") ? 0.20 : 0.13;
  gain.connect(master);
  const subdivision = preset.name.includes("Urban") ? beat / 4 : beat / 2;
  for (let time = 0, step = 0; time < duration; time += subdivision, step += 1) {
    if (time < beat * 4 || time > duration - beat * 4) continue;
    if (step % 4 === 0 && !preset.name.includes("Calm")) addLocalKick(context, gain, time, profile);
    if (step % 4 === 2 && preset.name.includes("Urban")) addLocalNoiseHit(context, gain, time, 0.10, 0.045 + profile.noiseLevel * 0.04);
    if ((preset.name.includes("Urban") && step % 2 === 0) || (!preset.name.includes("Urban") && step % 4 === 2)) addLocalHat(context, gain, time, profile);
  }
}

function addGentleEnding(context, master, root, beat, duration, preset) {
  const gain = context.createGain();
  gain.gain.value = 0.08;
  gain.connect(master);
  const start = Math.max(0, duration - beat * 4);
  [0, 7, 12].forEach((semi) => addLocalNote(context, gain, root * Math.pow(2, semi / 12), start, beat * 3.5, preset.name.includes("Urban") ? "triangle" : "sine", 0.055));
}

function addLocalNote(context, destination, frequency, start, duration, type, volume) {
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

function addLocalKick(context, destination, time, profile) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(110 + profile.lowEnergy * 45, time);
  oscillator.frequency.exponentialRampToValueAtTime(42, time + 0.16);
  gain.gain.setValueAtTime(0.24 + profile.averageVolume * 0.20, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
  oscillator.connect(gain).connect(destination);
  oscillator.start(time);
  oscillator.stop(time + 0.24);
}

function addLocalNoiseHit(context, destination, time, duration, volume) {
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain).connect(destination);
  source.start(time);
}

function addLocalHat(context, destination, time, profile) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = 6500 + profile.brightness * 1800;
  gain.gain.setValueAtTime(0.035 + profile.brightness * 0.04, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
  oscillator.connect(gain).connect(destination);
  oscillator.start(time);
  oscillator.stop(time + 0.05);
}

function chooseRoot(profile, soundDna, source) {
  const name = String(source || "").toLowerCase();
  if (name.includes("dublin") || soundDna.scores.urban > 50) return 146.83;
  if (name.includes("cork") || soundDna.scores.human > 42) return 164.81;
  if (name.includes("clare") || name.includes("cliffs") || profile.lowEnergy > 0.58) return 110.00;
  if (name.includes("galway") || soundDna.scores.natural > 48) return 130.81;
  return profile.brightness > 0.62 ? 174.61 : 138.59;
}

function chooseScale(profile, soundDna) {
  if (soundDna.scores.urban > 50) return [0, 2, 3, 7, 10, 12, 14];
  if (soundDna.scores.natural > 55) return [0, 2, 5, 7, 9, 12, 14];
  if (soundDna.scores.human > 42) return [0, 3, 5, 7, 10, 12, 15];
  if (profile.brightness > 0.65) return [0, 2, 4, 7, 9, 12, 16];
  return [0, 3, 5, 7, 10, 12];
}

function chooseBpm(profile, soundDna) {
  return Math.round(58 + profile.pulseIntensity * 42 + profile.noiseLevel * 16 + profile.averageVolume * 11 + soundDna.scores.urban * 0.30 + soundDna.scores.human * 0.16 - soundDna.scores.natural * 0.13);
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
  const saved = JSON.parse(localStorage.getItem("vlogmate-saved") || localStorage.getItem("enviosound-saved") || "[]");
  localStorage.setItem("vlogmate-saved", JSON.stringify([{ title: track.title, mood: track.mood, source: track.source }, ...saved].slice(0, 10)));
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
  const credits = JSON.parse(localStorage.getItem("vlogmate-credits") || localStorage.getItem("enviosound-credits") || "[]");
  const next = [{ artist: artist.name, song: artist.song, location: artist.location }, ...credits.filter((credit) => credit.song !== artist.song)].slice(0, 8);
  localStorage.setItem("vlogmate-credits", JSON.stringify(next));
}

function createFallbackTrack(place) {
  const profileName = place.cityProfile || place.name;
  const profile = locationProfiles[profileName] || profileFallback();
  return { title: place.reco, source: profileName, mood: chooseMood(profile), waveform: fallbackWaveform(profile), features: { "Average volume": profile.averageVolume, Brightness: profile.brightness, Pulse: profile.pulseIntensity }, audioUrl: "", engine: "Local model" };
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
  if (rafRef.current) {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }
  try {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  } catch {
    // Ignore cleanup races while resetting or ending a recording.
  }
  try {
    if (audioContextRef.current?.state !== "closed") audioContextRef.current?.close?.();
  } catch {
    // AudioContext may already be closing.
  }
  streamRef.current = null;
  audioContextRef.current = null;
}

function releaseObjectUrls(urls) {
  urls.filter(Boolean).forEach((url) => {
    try {
      if (String(url).startsWith("blob:")) URL.revokeObjectURL(url);
    } catch {
      // Blob URLs are best-effort cleanup.
    }
  });
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

function fallbackWaveform(profile) {
  return Array.from({ length: 34 }, (_, index) => 18 + clamp(profile.averageVolume + Math.sin(index * profile.pulseIntensity * 3) * 0.28 + ((index * 13) % 17) / 50) * 62);
}

function base64ToBlob(base64, type) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

async function readApiJson(response) {
  const text = await response.text();
  if (!text) return { error: "Music API returned an empty response. Restart the app with npm run dev so the ElevenLabs proxy is running." };
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}
