import { useRef, useState, useEffect } from "react";
import styles from "./MobilePlayer.module.css";

const TRACKS = [
  { id: 1, name: "3AM AT FALLS",  artist: "JJ47",           src: "/songs/3AM AT FALLS - JJ47 (Prod. @umairmusicxx ) - (320 Kbps).mp3" },
  { id: 2, name: "Bebasi",        artist: "Talhah Yunus",   src: "/songs/Bebasi - Talhah Yunus _ Prod. by Jokhay & Umair - (64 Kbps).mp3" },
  { id: 3, name: "JUST A DREAM",  artist: "Talhah Yunus",   src: "/songs/JUST A DREAM - Talhah Yunus _ JJ47 _ Prod. by Jokhay - (320 Kbps).mp3" },
  { id: 4, name: "SHIKWA",        artist: "Talhah Yunus",   src: "/songs/SHIKWA - Talhah Yunus _ Prod. By Jokhay (Official Music Video) - (320 Kbps).mp3" },
  { id: 5, name: "TWO TONE",      artist: "Young Stunners", src: "/songs/TWO TONE - Young Stunners _ Talha Anjum _ Talhah Yunus _ Prod. by Umair (Official Music Video) - (320 Kbps).mp3" },
];

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
    <path d="M2 2V12M12 2L5 7L12 12V2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
    <path d="M12 2V12M2 2L9 7L2 12V2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
    <rect x="3" y="2" width="2.5" height="10" rx="1" fill="currentColor" />
    <rect x="8.5" y="2" width="2.5" height="10" rx="1" fill="currentColor" />
  </svg>
);
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
    <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
  </svg>
);

function Disc({ playing, size = 64 }) {
  return (
    <div
      className={`${styles.disc} ${playing ? styles.spinning : ""}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/recorder.jpg"
        alt="recorder"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
      />
    </div>
  );
}

export default function MobilePlayer() {
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen]     = useState(false);
  const audioRef            = useRef(null);
  const playingRef          = useRef(false);

  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const was = playingRef.current;
    audio.src = TRACKS[idx].src;
    if (was) audio.play().catch(() => setPlaying(false));
  }, [idx]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing]);

  const prev = () => setIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
  const next = () => setIdx(i => (i + 1) % TRACKS.length);
  const handleEnded = () => setIdx(i => (i + 1) % TRACKS.length);

  const track = TRACKS[idx];

  return (
    <div className={styles.wrapper}>
      <audio ref={audioRef} preload="metadata" onEnded={handleEnded} />

      {/* Mini panel — shows when disc is tapped */}
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelDisc}>
            <Disc playing={playing} size={48} />
          </div>
          <div className={styles.panelInfo}>
            <p className={styles.trackName}>{track.name}</p>
            <p className={styles.artist}>{track.artist}</p>
          </div>
          <div className={styles.panelControls}>
            <button className={styles.ctrl} onClick={prev} aria-label="Previous"><PrevIcon /></button>
            <button className={`${styles.ctrl} ${styles.ctrlPlay}`} onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className={styles.ctrl} onClick={next} aria-label="Next"><NextIcon /></button>
          </div>
        </div>
      )}

      {/* Floating disc button */}
      <button
        className={styles.discBtn}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle music player"
      >
        <Disc playing={playing} size={56} />
        {playing && <span className={styles.pulse} />}
      </button>
    </div>
  );
}
