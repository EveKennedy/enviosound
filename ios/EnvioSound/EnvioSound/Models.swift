import SwiftUI

struct Place: Identifiable, Equatable {
    let id: String
    let name: String
    let vibe: String
    let tracks: Int
    let sounds: [String]
    let recommendedTrack: String
    let summary: String
    let colors: [Color]
    let symbol: String
    let mapX: CGFloat
    let mapY: CGFloat

    static func == (lhs: Place, rhs: Place) -> Bool {
        lhs.id == rhs.id
    }
}

struct Artist: Identifiable {
    let id = UUID()
    let name: String
    let location: String
    let song: String
    let vibe: String
}

struct SavedProject: Identifiable {
    let id = UUID()
    let name: String
    let location: String
    let mood: String
    let track: String
}

enum AppTab: String, CaseIterable, Identifiable {
    case home
    case map
    case generate
    case artists
    case saved

    var id: String { rawValue }

    var title: String {
        switch self {
        case .home: "Home"
        case .map: "Map"
        case .generate: "Generate"
        case .artists: "Artists"
        case .saved: "Saved"
        }
    }

    var symbol: String {
        switch self {
        case .home: "house.fill"
        case .map: "map.fill"
        case .generate: "sparkles"
        case .artists: "music.mic"
        case .saved: "folder.fill"
        }
    }
}

enum VlogType: String, CaseIterable, Identifiable {
    case travelMontage = "Travel montage"
    case dayInLife = "Day in my life"
    case foodVlog = "Food vlog"
    case adventure = "Adventure"
    case calm = "Calm aesthetic"
    case city = "City vlog"

    var id: String { rawValue }
}

enum Mood: String, CaseIterable, Identifiable {
    case cinematic = "Cinematic"
    case peaceful = "Peaceful"
    case energetic = "Energetic"
    case dreamy = "Dreamy"
    case indie = "Indie"
    case traditional = "Traditional"

    var id: String { rawValue }
}

enum VideoLength: String, CaseIterable, Identifiable {
    case fifteen = "15 sec"
    case thirty = "30 sec"
    case sixty = "60 sec"
    case threeMin = "3 min"

    var id: String { rawValue }
}

enum DemoData {
    static let places: [Place] = [
        Place(
            id: "galway",
            name: "Galway",
            vibe: "Indie coastal city",
            tracks: 42,
            sounds: ["buskers", "harbour wind", "cafe chatter"],
            recommendedTrack: "Atlantic Light",
            summary: "Warm indie guitars, soft hand percussion, and a sea-air lift for creator montages.",
            colors: [.teal, .orange],
            symbol: "sailboat.fill",
            mapX: 0.18,
            mapY: 0.23
        ),
        Place(
            id: "dublin",
            name: "Dublin",
            vibe: "City reel energy",
            tracks: 58,
            sounds: ["tram bells", "street crowds", "pub doors"],
            recommendedTrack: "Liffey Motion",
            summary: "A bright urban pulse for walking shots, fast cuts, and polished city reels.",
            colors: [.green, .blue],
            symbol: "building.2.fill",
            mapX: 0.36,
            mapY: 0.36
        ),
        Place(
            id: "cork",
            name: "Cork",
            vibe: "Warm local story",
            tracks: 27,
            sounds: ["market stalls", "river steps", "acoustic sets"],
            recommendedTrack: "Marina Morning",
            summary: "Organic rhythm and soft folk color for slower travel storytelling.",
            colors: [.pink, .orange],
            symbol: "leaf.fill",
            mapX: 0.29,
            mapY: 0.64
        ),
        Place(
            id: "cliffs",
            name: "Cliffs of Moher",
            vibe: "Epic cinematic nature",
            tracks: 31,
            sounds: ["waves", "high wind", "distant gulls"],
            recommendedTrack: "Edge of the Atlantic",
            summary: "Wide strings and low drums built for drone footage and scenic reveals.",
            colors: [.cyan, .indigo],
            symbol: "mountain.2.fill",
            mapX: 0.13,
            mapY: 0.41
        ),
        Place(
            id: "london",
            name: "London",
            vibe: "Modern city documentary",
            tracks: 73,
            sounds: ["underground", "rain", "crosswalks"],
            recommendedTrack: "Afterlight Camden",
            summary: "Moody synths and polished beats for cinematic city vlogs.",
            colors: [.gray, .purple],
            symbol: "tram.fill",
            mapX: 0.55,
            mapY: 0.47
        ),
        Place(
            id: "paris",
            name: "Paris",
            vibe: "Dreamy cafe cinema",
            tracks: 64,
            sounds: ["accordion", "metro", "terrace voices"],
            recommendedTrack: "Rue Lumiere",
            summary: "Romantic piano textures with a soft pulse for aesthetic travel films.",
            colors: [.pink, .yellow],
            symbol: "camera.aperture",
            mapX: 0.67,
            mapY: 0.55
        ),
        Place(
            id: "barcelona",
            name: "Barcelona",
            vibe: "Sunlit street rhythm",
            tracks: 49,
            sounds: ["plazas", "guitar", "scooters"],
            recommendedTrack: "Golden Ramblas",
            summary: "Percussive, bright, and breezy for food markets and beach transitions.",
            colors: [.orange, .red],
            symbol: "sun.max.fill",
            mapX: 0.78,
            mapY: 0.76
        )
    ]

    static let artists: [Artist] = [
        Artist(name: "Aoife Lane", location: "Galway", song: "Spanish Arch Sunrise", vibe: "indie folk"),
        Artist(name: "Mika Dubois", location: "Paris", song: "Cafe After Rain", vibe: "dreamy piano"),
        Artist(name: "Rafa Sol", location: "Barcelona", song: "Gracia Noon", vibe: "sunlit guitar"),
        Artist(name: "Niamh K.", location: "Dublin", song: "Liffey Gold", vibe: "city pop")
    ]

    static let projects: [SavedProject] = [
        SavedProject(name: "Galway Weekend Vlog", location: "Galway", mood: "Cinematic", track: "Atlantic Light"),
        SavedProject(name: "Dublin City Reel", location: "Dublin", mood: "Energetic", track: "Liffey Motion"),
        SavedProject(name: "Cliffs of Moher Montage", location: "Cliffs of Moher", mood: "Dreamy", track: "Edge of the Atlantic")
    ]
}
