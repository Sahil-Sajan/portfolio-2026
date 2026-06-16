import { useRef, useState, useEffect } from "react";
import styles from "./SpotifyPlayer.module.css";

// ── Spotify API (optional) ───────────────────────────────────────────────────
// To show your real Spotify history, add these to your .env file:
//   VITE_SPOTIFY_CLIENT_ID=your_client_id
//   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
//   VITE_SPOTIFY_REFRESH_TOKEN=your_refresh_token
// Then restart the dev server. Falls back to DEMO_TRACKS if not configured.
const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

const DEMO_TRACKS = [
  { id: "d1", name: "Glimpse of Us",    artists: [{ name: "Joji" }],              duration_ms: 233000, album: { images: [] } },
  { id: "d2", name: "Starboy",          artists: [{ name: "The Weeknd" }],        duration_ms: 230000, album: { images: [] } },
  { id: "d3", name: "Levitating",       artists: [{ name: "Dua Lipa" }],          duration_ms: 203000, album: { images: [] } },
  { id: "d4", name: "As It Was",        artists: [{ name: "Harry Styles" }],      duration_ms: 167000, album: { images: [] } },
  { id: "d5", name: "Golden Hour",      artists: [{ name: "JVKE" }],              duration_ms: 209000, album: { images: [] } },
];

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null;
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH_TOKEN }),
    });
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function fetchRecentTracks(token) {
  try {
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=8",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    // de-dupe by track id
    const seen = new Set();
    return (data.items ?? [])
      .map(i => i.track)
      .filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
  } catch {
    return null;
  }
}

function fmt(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// ── Vinyl SVG ────────────────────────────────────────────────────────────────
function Vinyl({ albumArt, playing }) {
  return (
    <div className={`${styles.record} ${playing ? "" : styles.paused}`}>
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer vinyl body */}
        <circle cx="110" cy="110" r="109" fill="#161616" />
        {/* Grooves — concentric rings */}
        {[96, 84, 72, 60, 48].map(r => (
          <circle key={r} cx="110" cy="110" r={r} stroke="#242424" strokeWidth="1.2" fill="none" />
        ))}
        {/* Label ring */}
        <circle cx="110" cy="110" r="40" fill="#222222" />
        {/* Album art or teal fallback */}
        {albumArt
          ? (
            <>
              <defs>
                <clipPath id="sp-art">
                  <circle cx="110" cy="110" r="38" />
                </clipPath>
              </defs>
              <image href={albumArt} x="72" y="72" width="76" height="76" clipPath="url(#sp-art)" />
            </>
          )
          : <circle cx="110" cy="110" r="38" fill="#00A084" opacity="0.55" />
        }
        {/* Shine / highlight arc */}
        <path d="M 72 72 Q 110 54 148 72" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Center hole */}
        <circle cx="110" cy="110" r="5" fill="#0a0a0a" />
      </svg>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
const PrevIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2V12M12 2L5 7L12 12V2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 2V12M2 2L9 7L2 12V2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="3" y="2" width="2.5" height="10" rx="1" fill="currentColor" />
    <rect x="8.5" y="2" width="2.5" height="10" rx="1" fill="currentColor" />
  </svg>
);
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
  </svg>
);
const SpotifyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

// ── Main component ───────────────────────────────────────────────────────────
export default function SpotifyPlayer() {
  const [tracks, setTracks]     = useState(DEMO_TRACKS);
  const [idx, setIdx]           = useState(0);
  const [progress, setProgress] = useState(0);   // 0–100
  const [playing, setPlaying]   = useState(true);
  const tickRef                 = useRef(null);
  const TICK_MS                 = 200;

  // Try loading real Spotify data once
  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) return;
      const recent = await fetchRecentTracks(token);
      if (recent?.length) setTracks(recent);
    })();
  }, []);

  const track      = tracks[idx] ?? DEMO_TRACKS[0];
  const duration   = track.duration_ms ?? 210000;
  const albumArt   = track.album?.images?.[0]?.url ?? null;
  const artistName = track.artists?.map(a => a.name).join(", ") ?? "";

  // Progress ticker
  useEffect(() => {
    clearInterval(tickRef.current);
    if (!playing) return;
    tickRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + (TICK_MS / duration) * 100;
        if (next >= 100) {
          setIdx(i => (i + 1) % tracks.length);
          return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(tickRef.current);
  }, [playing, duration, tracks.length]);

  const prev = () => { setIdx(i => (i - 1 + tracks.length) % tracks.length); setProgress(0); };
  const next = () => { setIdx(i => (i + 1) % tracks.length); setProgress(0); };

  const seekTo = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setProgress(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  const elapsedMs = (progress / 100) * duration;

  return (
    <div className={styles.container}>
      {/* ── Info panel ── */}
      <div className={styles.info}>
        <span className={styles.label}>
          <span className={styles.dot} />
          NOW PLAYING
        </span>

        <h3 className={styles.title} title={track.name}>{track.name}</h3>
        <p className={styles.artist} title={artistName}>{artistName}</p>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.btn} onClick={prev} aria-label="Previous track">
            <PrevIcon />
          </button>
          <button className={`${styles.btn} ${styles.btnPlay}`} onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className={styles.btn} onClick={next} aria-label="Next track">
            <NextIcon />
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressRow}>
          <span className={styles.time}>{fmt(elapsedMs)}</span>
          <div className={styles.bar} onClick={seekTo} role="slider" aria-label="Seek">
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.time}>{fmt(duration)}</span>
        </div>

        {/* Spotify badge */}
        <span className={styles.badge}>
          <SpotifyIcon />
          {CLIENT_ID ? "Spotify" : "demo mode"}
        </span>
      </div>

      {/* ── Vinyl record (half-hidden right) ── */}
      <div className={styles.recordWrapper}>
        <Vinyl albumArt={albumArt} playing={playing} />
      </div>
    </div>
  );
}
