import SwiftUI

struct ContentView: View {
    @State private var hasOnboarded = false
    @State private var selectedTab: AppTab = .home
    @State private var selectedPlace = DemoData.places[0]
    @State private var generatorPlace = DemoData.places[0]
    @State private var vlogType: VlogType = .travelMontage
    @State private var mood: Mood = .cinematic
    @State private var videoLength: VideoLength = .thirty
    @State private var generatorState: GeneratorState = .idle
    @State private var isPreviewPresented = false
    @State private var isProfilePresented = false

    var body: some View {
        Group {
            if hasOnboarded {
                TabView(selection: $selectedTab) {
                    HomeView(onChoose: choosePlace)
                        .tabItem { Label("Home", systemImage: AppTab.home.symbol) }
                        .tag(AppTab.home)

                    MapScreen(selectedPlace: $selectedPlace, onCreate: choosePlace)
                        .tabItem { Label("Map", systemImage: AppTab.map.symbol) }
                        .tag(AppTab.map)

                    GeneratorView(
                        place: $generatorPlace,
                        vlogType: $vlogType,
                        mood: $mood,
                        videoLength: $videoLength,
                        state: $generatorState,
                        onPreview: { isPreviewPresented = true }
                    )
                    .tabItem { Label("Generate", systemImage: AppTab.generate.symbol) }
                    .tag(AppTab.generate)

                    ArtistsView()
                        .tabItem { Label("Artists", systemImage: AppTab.artists.symbol) }
                        .tag(AppTab.artists)

                    SavedView(onProfile: { isProfilePresented = true })
                        .tabItem { Label("Saved", systemImage: AppTab.saved.symbol) }
                        .tag(AppTab.saved)
                }
                .tint(.envioInk)
                .sheet(isPresented: $isPreviewPresented) {
                    TrackPreviewView(place: generatorPlace, mood: mood) {
                        isPreviewPresented = false
                        selectedTab = .saved
                    }
                    .presentationDetents([.large])
                }
                .sheet(isPresented: $isProfilePresented) {
                    ProfileView()
                }
            } else {
                OnboardingView(
                    onGetStarted: {
                        hasOnboarded = true
                        choosePlace(DemoData.places[0])
                    },
                    onExplore: {
                        hasOnboarded = true
                    }
                )
            }
        }
    }

    private func choosePlace(_ place: Place) {
        selectedPlace = place
        generatorPlace = place
        selectedTab = .generate
    }
}

enum GeneratorState: Equatable {
    case idle
    case loading
    case ready
}

struct OnboardingView: View {
    let onGetStarted: () -> Void
    let onExplore: () -> Void

    var body: some View {
        ZStack {
            LinearGradient(colors: [.envioInk, .envioTeal, .envioSand], startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()

            VStack(alignment: .leading, spacing: 28) {
                Text("VlogMate")
                    .font(.headline.weight(.bold))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 9)
                    .background(.white.opacity(0.18), in: Capsule())

                Spacer()

                VStack(alignment: .leading, spacing: 12) {
                    ValueLabel("Copyright-safe for creators")
                    Text("Soundtrack your journey")
                        .font(.system(size: 52, weight: .black, design: .rounded))
                        .lineLimit(3)
                    Text("Find music that matches where you are filming.")
                        .font(.title3.weight(.medium))
                        .foregroundStyle(.white.opacity(0.82))
                        .frame(maxWidth: 310, alignment: .leading)
                }

                VStack(spacing: 12) {
                    Button(action: onGetStarted) {
                        Text("Get Started")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(PrimaryButtonStyle())

                    Button(action: onExplore) {
                        Text("Explore Demo")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(GlassButtonStyle())
                }
            }
            .foregroundStyle(.white)
            .padding(24)
        }
    }
}

struct HomeView: View {
    let onChoose: (Place) -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            ValueLabel("VlogMate")
                            Text("Where are you filming today?")
                                .font(.largeTitle.weight(.black))
                                .frame(maxWidth: 310, alignment: .leading)
                        }
                        Spacer()
                        CreatorAvatar()
                    }

                    SearchPill(text: "Search a city, landmark, or vibe")

                    HStack(spacing: 10) {
                        FeatureBadge("Soundtracks matched to real places", color: .envioTeal)
                        FeatureBadge("Made for travel vlogs, reels and short films", color: .envioOrange)
                    }

                    SectionHeader(title: "Trending travel soundtracks", caption: "Creator-safe picks")

                    LazyVStack(spacing: 14) {
                        ForEach(DemoData.places.filter { ["Galway", "Dublin", "Cliffs of Moher", "London", "Paris"].contains($0.name) }) { place in
                            PlaceCard(place: place) {
                                onChoose(place)
                            }
                        }
                    }
                }
                .padding(18)
            }
            .background(Color.envioBackground)
            .navigationBarHidden(true)
        }
    }
}

struct MapScreen: View {
    @Binding var selectedPlace: Place
    let onCreate: (Place) -> Void

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 14) {
                VStack(alignment: .leading, spacing: 6) {
                    ValueLabel("Location map")
                    Text("Tap a place to hear its vibe")
                        .font(.largeTitle.weight(.black))
                }
                .padding(.horizontal, 18)
                .padding(.top, 16)

                ZStack(alignment: .bottom) {
                    GeometryReader { proxy in
                        ZStack {
                            RoundedRectangle(cornerRadius: 32, style: .continuous)
                                .fill(
                                    LinearGradient(
                                        colors: [.envioMist, .envioSand.opacity(0.85), .blue.opacity(0.20)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )

                            MapPath()
                                .stroke(.white.opacity(0.55), style: StrokeStyle(lineWidth: 2, lineCap: .round, dash: [6, 10]))

                            ForEach(DemoData.places.filter { $0.name != "London" }) { place in
                                Button {
                                    selectedPlace = place
                                } label: {
                                    HStack(spacing: 6) {
                                        Circle()
                                            .fill(place == selectedPlace ? .envioOrange : .white)
                                            .frame(width: 12, height: 12)
                                        Text(place.name)
                                            .font(.caption2.weight(.bold))
                                    }
                                    .padding(.horizontal, 9)
                                    .padding(.vertical, 7)
                                    .background(place == selectedPlace ? Color.envioInk : .white.opacity(0.88), in: Capsule())
                                    .foregroundStyle(place == selectedPlace ? .white : .envioInk)
                                    .shadow(color: .black.opacity(0.12), radius: 12, y: 7)
                                }
                                .position(x: proxy.size.width * place.mapX, y: proxy.size.height * place.mapY)
                            }
                        }
                    }
                    .frame(height: 470)
                    .clipShape(RoundedRectangle(cornerRadius: 32, style: .continuous))

                    MapBottomSheet(place: selectedPlace) {
                        onCreate(selectedPlace)
                    }
                    .padding(.horizontal, 14)
                    .padding(.bottom, -74)
                }
                .padding(.horizontal, 18)

                Spacer(minLength: 86)
            }
            .background(Color.envioBackground)
            .navigationBarHidden(true)
        }
    }
}

struct GeneratorView: View {
    @Binding var place: Place
    @Binding var vlogType: VlogType
    @Binding var mood: Mood
    @Binding var videoLength: VideoLength
    @Binding var state: GeneratorState
    let onPreview: () -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 6) {
                        ValueLabel("Vlog soundtrack generator")
                        Text("Create music for this exact place")
                            .font(.largeTitle.weight(.black))
                    }

                    MenuPicker(title: "Location", selection: $place, options: DemoData.places)
                    ChipPicker(title: "Vlog type", selection: $vlogType, options: VlogType.allCases)
                    ChipPicker(title: "Mood", selection: $mood, options: Mood.allCases)
                    ChipPicker(title: "Video length", selection: $videoLength, options: VideoLength.allCases)

                    Button("Generate soundtrack") {
                        generate()
                    }
                    .buttonStyle(PrimaryButtonStyle())

                    if state == .loading {
                        LoadingCard()
                            .transition(.scale.combined(with: .opacity))
                    }

                    if state == .ready {
                        GeneratedResultCard(place: place, mood: mood, videoLength: videoLength, onPreview: onPreview)
                            .transition(.move(edge: .bottom).combined(with: .opacity))
                    }
                }
                .padding(18)
            }
            .animation(.spring(response: 0.45, dampingFraction: 0.84), value: state)
            .background(Color.envioBackground)
            .navigationBarHidden(true)
        }
    }

    private func generate() {
        state = .loading
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
            state = .ready
        }
    }
}

struct TrackPreviewView: View {
    let place: Place
    let mood: Mood
    let onUse: () -> Void
    @State private var isPlaying = false

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                ZStack(alignment: .bottomLeading) {
                    RoundedRectangle(cornerRadius: 36, style: .continuous)
                        .fill(LinearGradient(colors: place.colors, startPoint: .topLeading, endPoint: .bottomTrailing))
                        .overlay {
                            Image(systemName: place.symbol)
                                .font(.system(size: 120, weight: .bold))
                                .foregroundStyle(.white.opacity(0.24))
                        }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("vlog-safe")
                            .font(.caption.weight(.bold))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 7)
                            .background(.white.opacity(0.2), in: Capsule())
                        Text(place.recommendedTrack)
                            .font(.system(size: 40, weight: .black, design: .rounded))
                        Text(place.name)
                            .font(.title3.weight(.semibold))
                            .foregroundStyle(.white.opacity(0.82))
                    }
                    .foregroundStyle(.white)
                    .padding(22)
                }
                .frame(height: 430)
                .shadow(color: .black.opacity(0.20), radius: 28, y: 18)

                WaveformView()

                Button(isPlaying ? "Pause" : "Play") {
                    isPlaying.toggle()
                }
                .buttonStyle(DarkButtonStyle())

                FlowTags(tags: ["cinematic", place.name, "vlog-safe", mood.rawValue.lowercased()])

                Button("Export for video") {}
                    .buttonStyle(PrimaryButtonStyle())

                Button("Copy credit") {}
                    .buttonStyle(SecondaryButtonStyle())

                Button("Use in vlog", action: onUse)
                    .buttonStyle(DarkButtonStyle())
            }
            .padding(18)
        }
        .background(Color.envioBackground)
    }
}

struct ArtistsView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    VStack(alignment: .leading, spacing: 8) {
                        ValueLabel("Support local artists")
                        Text("Local sounds from local artists")
                            .font(.largeTitle.weight(.black))
                        Text("Artists can attach original songs to locations so vloggers can use local music while giving artists recognition.")
                            .foregroundStyle(.secondary)
                    }

                    ForEach(DemoData.artists) { artist in
                        ArtistCard(artist: artist)
                    }
                }
                .padding(18)
            }
            .background(Color.envioBackground)
            .navigationBarHidden(true)
        }
    }
}

struct SavedView: View {
    let onProfile: () -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            ValueLabel("Saved projects")
                            Text("Ready for your next edit")
                                .font(.largeTitle.weight(.black))
                        }
                        Spacer()
                        Button(action: onProfile) {
                            CreatorAvatar()
                        }
                    }

                    ForEach(DemoData.projects) { project in
                        ProjectCard(project: project)
                    }
                }
                .padding(18)
            }
            .background(Color.envioBackground)
            .navigationBarHidden(true)
        }
    }
}

struct ProfileView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                VStack(spacing: 10) {
                    CreatorAvatar(size: 82)
                    Text("Travel Creator")
                        .font(.title.bold())
                    Text("Creator profile")
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(28)
                .background(.white, in: RoundedRectangle(cornerRadius: 30, style: .continuous))

                SettingsRow(label: "Saved tracks", value: "18")
                SettingsRow(label: "Export history", value: "7 video exports")
                SettingsRow(label: "Artist credits used", value: "4 local artists")
                SettingsRow(label: "Settings", value: "Licenses and downloads")
                Spacer()
            }
            .padding(18)
            .background(Color.envioBackground)
            .navigationTitle("Profile")
        }
    }
}

struct PlaceCard: View {
    let place: Place
    let action: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 34) {
            HStack {
                Image(systemName: place.symbol)
                    .font(.title2.weight(.bold))
                Spacer()
                Text("\(place.tracks) tracks")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white.opacity(0.78))
            }

            VStack(alignment: .leading, spacing: 8) {
                Text(place.name)
                    .font(.title.bold())
                Text(place.vibe)
                    .foregroundStyle(.white.opacity(0.78))
                Button("Find soundtrack", action: action)
                    .buttonStyle(WhiteCapsuleButtonStyle())
                    .padding(.top, 6)
            }
        }
        .foregroundStyle(.white)
        .padding(18)
        .frame(maxWidth: .infinity, minHeight: 190, alignment: .leading)
        .background(LinearGradient(colors: place.colors, startPoint: .topLeading, endPoint: .bottomTrailing), in: RoundedRectangle(cornerRadius: 30, style: .continuous))
        .shadow(color: place.colors.first?.opacity(0.22) ?? .black.opacity(0.15), radius: 22, y: 14)
    }
}

struct MapBottomSheet: View {
    let place: Place
    let action: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(LinearGradient(colors: place.colors, startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(width: 92, height: 136)
                .overlay {
                    Image(systemName: place.symbol)
                        .font(.system(size: 34, weight: .bold))
                        .foregroundStyle(.white)
                }

            VStack(alignment: .leading, spacing: 8) {
                ValueLabel(place.vibe)
                Text(place.name)
                    .font(.title2.bold())
                Text(place.summary)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                FlowTags(tags: place.sounds)
                Text("Recommended soundtrack: \(place.recommendedTrack)")
                    .font(.caption.weight(.bold))
                Button("Create vlog soundtrack", action: action)
                    .buttonStyle(DarkCompactButtonStyle())
            }
        }
        .padding(13)
        .background(.white.opacity(0.96), in: RoundedRectangle(cornerRadius: 30, style: .continuous))
        .shadow(color: .black.opacity(0.18), radius: 26, y: 14)
    }
}

struct MenuPicker: View {
    let title: String
    @Binding var selection: Place
    let options: [Place]

    var body: some View {
        HStack {
            Text(title)
                .font(.headline)
            Spacer()
            Menu(selection.name) {
                ForEach(options) { option in
                    Button(option.name) {
                        selection = option
                    }
                }
            }
            .font(.subheadline.weight(.bold))
            .padding(.horizontal, 12)
            .padding(.vertical, 9)
            .background(Color.envioMist, in: Capsule())
        }
        .padding(15)
        .background(.white, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
    }
}

struct ChipPicker<T: Identifiable & RawRepresentable>: View where T.RawValue == String {
    let title: String
    @Binding var selection: T
    let options: [T]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(options) { option in
                        Button(option.rawValue) {
                            selection = option
                        }
                        .font(.caption.weight(.bold))
                        .foregroundStyle(selection.rawValue == option.rawValue ? .white : .primary)
                        .padding(.horizontal, 13)
                        .padding(.vertical, 10)
                        .background(selection.rawValue == option.rawValue ? Color.envioInk : Color.envioCream, in: Capsule())
                    }
                }
            }
        }
        .padding(15)
        .background(.white, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
    }
}

struct LoadingCard: View {
    var body: some View {
        VStack(spacing: 12) {
            ProgressView()
                .tint(.envioOrange)
                .scaleEffect(1.2)
            Text("Listening to the place...")
            Text("Matching the vibe...")
            Text("Creating your travel soundtrack...")
        }
        .font(.subheadline.weight(.bold))
        .foregroundStyle(.secondary)
        .frame(maxWidth: .infinity)
        .padding(22)
        .background(.white, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
    }
}

struct GeneratedResultCard: View {
    let place: Place
    let mood: Mood
    let videoLength: VideoLength
    let onPreview: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 13) {
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(LinearGradient(colors: place.colors, startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(width: 92, height: 132)
                .overlay {
                    Image(systemName: place.symbol)
                        .font(.system(size: 34, weight: .bold))
                        .foregroundStyle(.white)
                }

            VStack(alignment: .leading, spacing: 9) {
                ValueLabel("Generated result")
                Text(place.recommendedTrack)
                    .font(.title3.bold())
                Text("\(place.name) - \(mood.rawValue) - \(videoLength.rawValue)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                VStack(spacing: 7) {
                    MetaLine(label: "BPM", value: mood == .energetic ? "126" : "88")
                    MetaLine(label: "Instruments", value: "guitar, pads, field drums")
                    MetaLine(label: "License", value: "Creator-safe")
                }
                Button("Preview", action: onPreview)
                    .buttonStyle(DarkCompactButtonStyle())
                Button("Save to project") {}
                    .buttonStyle(QuietCompactButtonStyle())
                Button("Use in vlog", action: onPreview)
                    .buttonStyle(PrimaryCompactButtonStyle())
            }
        }
        .padding(13)
        .background(.white, in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .shadow(color: .black.opacity(0.08), radius: 18, y: 10)
    }
}

struct ArtistCard: View {
    let artist: Artist

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Circle()
                    .fill(LinearGradient(colors: [.envioTeal, .envioOrange], startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 52, height: 52)
                    .overlay(Text(initials).font(.headline.weight(.black)).foregroundStyle(.white))
                VStack(alignment: .leading, spacing: 3) {
                    Text(artist.name)
                        .font(.headline)
                    Text("\(artist.location) - \(artist.song)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Text(artist.vibe)
                        .font(.caption.weight(.bold))
                        .foregroundStyle(.envioTeal)
                }
                Spacer()
            }
            HStack {
                Button("Play") {}
                    .buttonStyle(QuietCompactButtonStyle())
                Button("Use with credit") {}
                    .buttonStyle(DarkCompactButtonStyle())
            }
        }
        .padding(15)
        .background(.white, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
    }

    private var initials: String {
        artist.name.split(separator: " ").compactMap(\.first).map(String.init).joined()
    }
}

struct ProjectCard: View {
    let project: SavedProject

    var body: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 5) {
                Text(project.name)
                    .font(.headline)
                Text("\(project.location) - \(project.mood)")
                    .foregroundStyle(.secondary)
                Text(project.track)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.envioTeal)
            }
            Spacer()
            Text("Ready to export")
                .font(.caption.weight(.black))
                .foregroundStyle(.envioTeal)
                .multilineTextAlignment(.trailing)
        }
        .padding(17)
        .background(.white, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
    }
}

struct WaveformView: View {
    private let bars: [CGFloat] = [22, 36, 54, 28, 62, 44, 74, 32, 50, 68, 38, 82, 42, 64, 30, 58, 76, 34, 48, 70, 40, 60, 28, 52, 66, 36, 80, 44, 56, 30]

    var body: some View {
        HStack(alignment: .center, spacing: 4) {
            ForEach(Array(bars.enumerated()), id: \.offset) { _, bar in
                Capsule()
                    .fill(LinearGradient(colors: [.envioOrange, .envioTeal], startPoint: .top, endPoint: .bottom))
                    .frame(width: 5, height: bar)
            }
        }
        .frame(maxWidth: .infinity, minHeight: 104)
        .background(.white, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
    }
}

struct FlowTags: View {
    let tags: [String]

    var body: some View {
        HStack {
            ForEach(tags, id: \.self) { tag in
                Text(tag)
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(.envioTeal)
                    .padding(.horizontal, 9)
                    .padding(.vertical, 7)
                    .background(Color.envioMist, in: Capsule())
            }
        }
    }
}

struct FeatureBadge: View {
    let text: String
    let color: Color

    init(_ text: String, color: Color) {
        self.text = text
        self.color = color
    }

    var body: some View {
        Text(text)
            .font(.caption.weight(.bold))
            .foregroundStyle(color)
            .frame(maxWidth: .infinity, minHeight: 66, alignment: .leading)
            .padding(13)
            .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

struct SearchPill: View {
    let text: String

    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
            Text(text)
            Spacer()
        }
        .foregroundStyle(.secondary)
        .padding(16)
        .background(.white, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        .shadow(color: .black.opacity(0.06), radius: 14, y: 8)
    }
}

struct SectionHeader: View {
    let title: String
    let caption: String

    var body: some View {
        HStack(alignment: .lastTextBaseline) {
            Text(title)
                .font(.title3.bold())
            Spacer()
            Text(caption)
                .font(.caption.weight(.bold))
                .foregroundStyle(.secondary)
        }
    }
}

struct CreatorAvatar: View {
    var size: CGFloat = 48

    var body: some View {
        Text("TC")
            .font(.system(size: size * 0.28, weight: .black))
            .foregroundStyle(.white)
            .frame(width: size, height: size)
            .background(Color.envioInk, in: Circle())
    }
}

struct ValueLabel: View {
    let text: String

    init(_ text: String) {
        self.text = text
    }

    var body: some View {
        Text(text.uppercased())
            .font(.caption2.weight(.black))
            .foregroundStyle(.envioTeal)
    }
}

struct MetaLine: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.bold)
                .multilineTextAlignment(.trailing)
        }
        .font(.caption)
    }
}

struct SettingsRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .font(.subheadline.weight(.bold))
        }
        .padding(17)
        .background(.white, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
    }
}

struct MapPath: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.width * 0.12, y: rect.height * 0.18))
        path.addCurve(to: CGPoint(x: rect.width * 0.42, y: rect.height * 0.44), control1: CGPoint(x: rect.width * 0.22, y: rect.height * 0.22), control2: CGPoint(x: rect.width * 0.28, y: rect.height * 0.50))
        path.addCurve(to: CGPoint(x: rect.width * 0.78, y: rect.height * 0.72), control1: CGPoint(x: rect.width * 0.58, y: rect.height * 0.35), control2: CGPoint(x: rect.width * 0.68, y: rect.height * 0.67))
        return path
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline.weight(.black))
            .foregroundStyle(.white)
            .padding(.vertical, 17)
            .frame(maxWidth: .infinity)
            .background(Color.envioOrange.opacity(configuration.isPressed ? 0.78 : 1), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            .shadow(color: .envioOrange.opacity(0.25), radius: 18, y: 10)
    }
}

struct DarkButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline.weight(.black))
            .foregroundStyle(.white)
            .padding(.vertical, 17)
            .frame(maxWidth: .infinity)
            .background(Color.envioInk.opacity(configuration.isPressed ? 0.78 : 1), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline.weight(.black))
            .foregroundStyle(.envioInk)
            .padding(.vertical, 17)
            .frame(maxWidth: .infinity)
            .background(.white.opacity(configuration.isPressed ? 0.72 : 1), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

struct GlassButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline.weight(.black))
            .foregroundStyle(.white)
            .padding(.vertical, 17)
            .background(.white.opacity(configuration.isPressed ? 0.12 : 0.20), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

struct WhiteCapsuleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.caption.weight(.black))
            .foregroundStyle(.envioInk)
            .padding(.horizontal, 13)
            .padding(.vertical, 10)
            .background(.white.opacity(configuration.isPressed ? 0.74 : 1), in: Capsule())
    }
}

struct DarkCompactButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.caption.weight(.black))
            .foregroundStyle(.white)
            .padding(.horizontal, 13)
            .padding(.vertical, 10)
            .background(Color.envioInk.opacity(configuration.isPressed ? 0.75 : 1), in: Capsule())
    }
}

struct PrimaryCompactButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.caption.weight(.black))
            .foregroundStyle(.white)
            .padding(.horizontal, 13)
            .padding(.vertical, 10)
            .background(Color.envioOrange.opacity(configuration.isPressed ? 0.75 : 1), in: Capsule())
    }
}

struct QuietCompactButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.caption.weight(.black))
            .foregroundStyle(.envioInk)
            .padding(.horizontal, 13)
            .padding(.vertical, 10)
            .background(Color.envioCream.opacity(configuration.isPressed ? 0.64 : 1), in: Capsule())
    }
}

extension Color {
    static let envioInk = Color(red: 0.07, green: 0.09, blue: 0.14)
    static let envioTeal = Color(red: 0.15, green: 0.45, blue: 0.48)
    static let envioOrange = Color(red: 0.89, green: 0.37, blue: 0.20)
    static let envioSand = Color(red: 0.91, green: 0.76, blue: 0.52)
    static let envioCream = Color(red: 0.95, green: 0.93, blue: 0.88)
    static let envioMist = Color(red: 0.90, green: 0.95, blue: 0.94)
    static let envioBackground = Color(red: 0.97, green: 0.96, blue: 0.93)
}

#Preview {
    ContentView()
}
