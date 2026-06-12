import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Sparkles, 
  Train, 
  GraduationCap, 
  Heart, 
  Star, 
  Cookie, 
  Gamepad2, 
  Trophy, 
  Timer, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Award, 
  Smile, 
  Lightbulb, 
  Layers, 
  Flame,
  Check,
  Zap,
  Activity,
  Play,
  Pause,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Web Audio API Synthesizer Helper for offline retro sound effects
const playSound = (type: "flip" | "match" | "wrong" | "victory" | "click" | "perfect" | "great" | "good" | "miss", isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "flip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "match") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "wrong") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "victory") {
      const now = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start();
      osc.stop(now + 0.6);
    } else if (type === "perfect") {
      // High bright laser sweep
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start();
      osc.stop(now + 0.2);
    } else if (type === "great") {
      // Pleasant dual tone
      const now = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start();
      osc.stop(now + 0.18);
    } else if (type === "good") {
      // Short neutral check
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start();
      osc.stop(now + 0.12);
    } else if (type === "miss") {
      // Low descending sweep
      const now = ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn("Audio Context could not render:", e);
  }
};

type GameMode = "particle" | "memory";
type CardTheme = "shikohabad" | "bobby" | "glass";
type DifficultyLevel = "relaxed" | "expert" | "bullet";

interface CardItem {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
  colorClass: string;
}

// Generate circular track positions for the interactive Stop the Particle game
// 24 dots positioned around a central origin
const CO_DOTS = 24;
const CIRCLE_DOTS = Array.from({ length: CO_DOTS }, (_, i) => {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / CO_DOTS;
  return {
    index: i,
    x: 50 + 40 * Math.cos(angle), // radius %
    y: 50 + 40 * Math.sin(angle), // radius %
  };
});

// Zen and solver state variables are removed as they are now loaded as a dedicated standalone section.

export default function MindRefresherGame() {
  const [gameMode, setGameMode] = useState<GameMode>("particle");
  const [isMuted, setIsMuted] = useState(false);

  // ----------------------------------------------------
  // STATE DEFINITIONS FOR: PARTICLE FOCUS GAME
  // ----------------------------------------------------
  const [particleScore, setParticleScore] = useState(0);
  const [particleHighScore, setParticleHighScore] = useState<number>(() => {
    const saved = localStorage.getItem("skb_particle_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [particleStreak, setParticleStreak] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("expert");
  const [isParticlePlaying, setIsParticlePlaying] = useState(true);
  const [lastRating, setLastRating] = useState<"PERFECT" | "GREAT" | "GOOD" | "MISS" | null>(null);
  const [ratingColor, setRatingColor] = useState("");
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Refs for particle animation timing
  const particleIntervalRef = useRef<any>(null);
  const gameActionAreaRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------
  // STATE DEFINITIONS FOR: MEMORY MATCH GAME
  // ----------------------------------------------------
  const [theme, setTheme] = useState<CardTheme>("shikohabad");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isMemoryPlaying, setIsMemoryPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [memoryHighScore, setMemoryHighScore] = useState<number>(() => {
    const saved = localStorage.getItem("skb_game_highscore_moves-");
    return saved ? parseInt(saved, 10) : 999;
  });
  const [isMemoryCompleted, setIsMemoryCompleted] = useState(false);

  // Zen and solvers logic has been extracted into a standalone dedicated component.

  // Sound triggering wrapper
  const triggerSound = (type: "flip" | "match" | "wrong" | "victory" | "click" | "perfect" | "great" | "good" | "miss") => {
    playSound(type, isMuted);
  };

  // ----------------------------------------------------
  // GAME EFFECT: PARTICLE FOCUS ENGINE
  // ----------------------------------------------------
  useEffect(() => {
    if (gameMode !== "particle" || !isParticlePlaying) {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
      return;
    }

    let msInterval = 60; // Expert
    if (difficulty === "relaxed") msInterval = 100;
    if (difficulty === "bullet") msInterval = 30;

    // Speeds up dynamically based on current streak!
    const speedAdjustment = Math.max(-15, -Math.floor(particleStreak * 1.5));
    const finalInterval = Math.max(15, msInterval + speedAdjustment);

    particleIntervalRef.current = setInterval(() => {
      setActiveDot(prev => (prev + 1) % CO_DOTS);
    }, finalInterval);

    return () => {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, [gameMode, isParticlePlaying, difficulty, particleStreak]);

  // Handle key press spacebar to stop particle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameMode !== "particle") return;
      if (e.code === "Space") {
        e.preventDefault();
        handleStopParticle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameMode, activeDot, isParticlePlaying, particleStreak, particleScore]);

  // Particle explosion trigger
  const triggerExplosion = (color: string) => {
    const newSparkles = Array.from({ length: 16 }).map((_, i) => {
      const angle = (2 * Math.PI * i) / 16;
      const speed = 20 + Math.random() * 30;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        color: color
      };
    });
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 800);
  };

  // Stop particle focus calculation
  const handleStopParticle = () => {
    if (gameMode !== "particle" || !isParticlePlaying) return;

    // Dist to zero (The Red Dot is index 0)
    const dist = Math.min(activeDot, CO_DOTS - activeDot);
    
    let points = 0;
    let hitType: "PERFECT" | "GREAT" | "GOOD" | "MISS" = "MISS";
    let colorStyle = "text-rose-500 shadow-rose-500/50";
    let soundEffect: "perfect" | "great" | "good" | "miss" = "miss";

    if (dist === 0) {
      hitType = "PERFECT";
      points = 150;
      colorStyle = "text-yellow-400 font-black animate-bounce text-xl shadow-yellow-400/50";
      soundEffect = "perfect";
      triggerExplosion("#f59e0b");
    } else if (dist === 1) {
      hitType = "GREAT";
      points = 80;
      colorStyle = "text-emerald-400 font-bold text-lg shadow-emerald-400/50";
      soundEffect = "great";
      triggerExplosion("#10b981");
    } else if (dist === 2) {
      hitType = "GOOD";
      points = 40;
      colorStyle = "text-amber-400 font-semibold text-base shadow-amber-400/50";
      soundEffect = "good";
      triggerExplosion("#fbbf24");
    } else {
      hitType = "MISS";
      points = 0;
      colorStyle = "text-rose-500 font-extrabold text-base shadow-rose-500/50";
      soundEffect = "miss";
    }

    triggerSound(soundEffect);

    // Update Scores
    if (hitType !== "MISS") {
      const newStreak = particleStreak + 1;
      const multiplier = Math.min(5, 1 + Math.floor(newStreak / 3));
      const finalAward = points * multiplier;

      setParticleStreak(newStreak);
      setStreakMultiplier(multiplier);
      
      const nextScore = particleScore + finalAward;
      setParticleScore(nextScore);

      if (nextScore > particleHighScore) {
        setParticleHighScore(nextScore);
        localStorage.setItem("skb_particle_highscore", nextScore.toString());
      }
    } else {
      setParticleStreak(0);
      setStreakMultiplier(1);
    }

    setLastRating(hitType);
    setRatingColor(colorStyle);

    // Pause particle on click briefly for satisfaction, then restart
    setIsParticlePlaying(false);
    setTimeout(() => {
      setIsParticlePlaying(true);
      setLastRating(null);
    }, 700);
  };

  const handleResetParticleGame = () => {
    triggerSound("click");
    setParticleScore(0);
    setParticleStreak(0);
    setStreakMultiplier(1);
    setLastRating(null);
    setIsParticlePlaying(true);
  };

  // ----------------------------------------------------
  // TIMING EFFECT: MEMORY MATCH TIMER
  // ----------------------------------------------------
  useEffect(() => {
    let interval: any = null;
    if (gameMode === "memory" && isMemoryPlaying && !isMemoryCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameMode, isMemoryPlaying, isMemoryCompleted]);


  // Card items themes config
  const themesConfig = {
    shikohabad: [
      { icon: Cookie, label: "Desi Ghee Peda", colorClass: "text-amber-500 bg-amber-50 border-amber-200 hover:bg-amber-100" },
      { icon: Train, label: "SKB Jn Train", colorClass: "text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100" },
      { icon: GraduationCap, label: "JS University", colorClass: "text-emerald-500 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
      { icon: Sparkles, label: "Glass Tumbler", colorClass: "text-sky-500 bg-sky-50 border-sky-200 hover:bg-sky-100" },
      { icon: Layers, label: "Potato Cold Chain", colorClass: "text-indigo-500 bg-indigo-50 border-indigo-200 hover:bg-indigo-100" },
      { icon: Heart, label: "Community Care", colorClass: "text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100" },
      { icon: Star, label: "Premium Partner", colorClass: "text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
      { icon: Lightbulb, label: "Aman Electricals", colorClass: "text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100" }
    ],
    bobby: [
      { icon: Camera, label: "Pro DSLR Body", colorClass: "text-amber-500 bg-amber-950/10 border-amber-500/20 hover:bg-amber-950/25" },
      { icon: Star, label: "Golden Wedding Lights", colorClass: "text-yellow-400 bg-yellow-950/20 border-yellow-500/20 hover:bg-yellow-950/25" },
      { icon: Sparkles, label: "Cinematic Overlay", colorClass: "text-indigo-400 bg-indigo-950/20 border-indigo-500/20 hover:bg-indigo-950/25" },
      { icon: Flame, label: "Emotional Capture", colorClass: "text-rose-500 bg-rose-950/20 border-rose-500/20 hover:bg-rose-950/25" },
      { icon: Heart, label: "Pre-Wedding Shoot", colorClass: "text-pink-400 bg-pink-950/20 border-pink-500/20 hover:bg-pink-950/25" },
      { icon: Award, label: "Premium Portfolio", colorClass: "text-purple-400 bg-purple-950/20 border-purple-500/20 hover:bg-purple-950/25" },
      { icon: Trophy, label: "Excellence Award", colorClass: "text-amber-300 bg-amber-950/20 border-amber-500/20 hover:bg-amber-950/25" },
      { icon: Layers, label: "Matte Wedding Album", colorClass: "text-teal-400 bg-teal-950/20 border-teal-500/20 hover:bg-teal-950/25" }
    ],
    glass: [
      { icon: Sparkles, label: "Royal Bangle", colorClass: "text-fuchsia-500 bg-fuchsia-100 border-fuchsia-200 hover:bg-fuchsia-150" },
      { icon: Lightbulb, label: "Molten Masterwork", colorClass: "text-orange-500 bg-orange-100 border-orange-200 hover:bg-orange-150" },
      { icon: Layers, label: "Safety Glass Work", colorClass: "text-teal-500 bg-teal-100 border-teal-200 hover:bg-teal-150" },
      { icon: Star, label: "Luminous Beads", colorClass: "text-cyan-500 bg-cyan-100 border-cyan-200 hover:bg-cyan-150" },
      { icon: Award, label: "Traditional Art", colorClass: "text-amber-500 bg-amber-100 border-amber-200 hover:bg-amber-150" },
      { icon: Train, label: "Export Carriage", colorClass: "text-indigo-500 bg-indigo-100 border-indigo-200 hover:bg-indigo-150" },
      { icon: Cookie, label: "Sweet Craft Break", colorClass: "text-yellow-600 bg-yellow-100 border-yellow-250 hover:bg-yellow-150" },
      { icon: Smile, label: "Handcrafted Joy", colorClass: "text-emerald-500 bg-emerald-100 border-emerald-250 hover:bg-emerald-150" }
    ]
  };

  const handleStartMemoryGame = (selectedTheme: CardTheme) => {
    const rawItems = themesConfig[selectedTheme];
    const doubled = [...rawItems, ...rawItems].map((item, idx) => ({
      id: idx,
      ...item,
      isFlipped: false,
      isMatched: false
    }));

    // Fisher-Yates Shuffle
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }

    setCards(doubled);
    setSelectedIndices([]);
    setMoves(0);
    setTimeElapsed(0);
    setIsMemoryPlaying(true);
    setIsMemoryCompleted(false);
    triggerSound("victory");
  };

  useEffect(() => {
    if (gameMode === "memory") {
      handleStartMemoryGame(theme);
    }
  }, [theme, gameMode]);

  const handleCardClick = (idx: number) => {
    if (!isMemoryPlaying || isMemoryCompleted) return;
    if (cards[idx].isFlipped || cards[idx].isMatched) return;
    if (selectedIndices.length >= 2) return;

    triggerSound("flip");

    const updated = [...cards];
    updated[idx].isFlipped = true;
    setCards(updated);

    const checkMatch = [...selectedIndices, idx];
    setSelectedIndices(checkMatch);

    if (checkMatch.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = checkMatch;

      if (cards[first].label === cards[second].label) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setSelectedIndices([]);
          triggerSound("match");

          const allMatched = matchedCards.every(c => c.isMatched);
          if (allMatched) {
            setIsMemoryCompleted(true);
            triggerSound("victory");

            const newScore = moves + 1;
            if (newScore < memoryHighScore || memoryHighScore === 999) {
              setMemoryHighScore(newScore);
              localStorage.setItem("skb_game_highscore_moves-", newScore.toString());
            }
          }
        }, 450);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setSelectedIndices([]);
          triggerSound("wrong");
        }, 900);
      }
    }
  };

  const handleMemoryThemeChange = (newTheme: CardTheme) => {
    triggerSound("click");
    setTheme(newTheme);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col relative select-none">
      
      {/* GLOWING AMBIENT TOP BARS */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 shadow-[0_2px_10px_rgba(239,68,68,0.5)] z-10" />

      {/* ARCADE HEADER PANEL */}
      <div className="bg-slate-900 border-b border-slate-800/80 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-rose-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden group">
            <Gamepad2 className="w-6 h-6 stroke-[2.2] relative z-10 animate-pulse text-white group-hover:scale-108 transition-transform" />
            <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
              <span>City Game Zone</span>
              <span className="bg-amber-400/10 text-amber-300 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-amber-400/20 font-extrabold animate-pulse">
                ARCADE LIFE
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Challenge your precision, relax your mind, local style!</p>
          </div>
        </div>

        {/* MODE SWITCHER COMPONENTS */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 w-full md:w-auto">
          <button
            onClick={() => {
              triggerSound("click");
              setGameMode("particle");
            }}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              gameMode === "particle" 
                ? "bg-gradient-to-r from-[#ff6b00] to-rose-500 text-white shadow-md shadow-orange-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Particle Focus</span>
          </button>
          
          <button
            onClick={() => {
              triggerSound("click");
              setGameMode("memory");
            }}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              gameMode === "memory" 
                ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-300" />
            <span>Memory Matcher</span>
          </button>
        </div>

        {/* Global Sound Control Trigger */}
        <button
          onClick={() => setIsMuted(prev => !prev)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden md:block"
          title={isMuted ? "Unmute Retro Synth Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* ======================================================== */}
      // SCREEN VIEW: PARTICLE STOP FOCUS SYSTEM
      {/* ======================================================== */}
      {gameMode === "particle" && (
        <div className="flex flex-col flex-1 bg-slate-950 p-6 relative overflow-hidden">
          {/* Neon Grid decoration background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

          {/* Difficulty and stats dashboard */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-3 items-center border border-slate-800/80 bg-slate-900/40 p-3 rounded-xl backdrop-blur-xs mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">Speed Preset:</span>
              <div className="flex gap-1.5">
                {(["relaxed", "expert", "bullet"] as DifficultyLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => {
                      triggerSound("click");
                      setDifficulty(lvl);
                      setParticleStreak(0); // Reset streak to be fair on change
                    }}
                    className={`px-2.5 py-1 rounded text-[9px] font-mono capitalize font-bold border transition-colors cursor-pointer ${
                      difficulty === lvl 
                        ? lvl === "relaxed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-black text-amber-50"
                          : lvl === "expert" ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-black text-amber-50"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30 font-black text-rose-50"
                        : "bg-slate-950/40 text-slate-500 border-slate-800/60 hover:text-slate-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Scoreboard indicators */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 uppercase font-sans">Multi</span>
                <span className="text-yellow-400 font-extrabold flex items-center gap-0.5 text-sm">
                  ⚡{streakMultiplier}x
                </span>
              </div>
              <div className="w-[1px] h-6 bg-slate-800" />
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 uppercase font-sans">Streak</span>
                <span className="text-slate-200 font-extrabold text-sm">{particleStreak}</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-800" />
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 uppercase font-sans">Score</span>
                <span className="text-white font-extrabold text-sm text-shadow-glow">{particleScore}</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-800" />
              <div className="flex flex-col items-center text-amber-400">
                <span className="text-[8px] text-slate-500 uppercase font-sans">Record</span>
                <span className="font-extrabold flex items-center gap-0.5 text-sm">
                  🏆{particleHighScore}
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CIRCULAR PARTICLE SPEED TRACK ZONE */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[290px] relative z-10" ref={gameActionAreaRef}>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Circular track border */}
              <div className="absolute inset-2 rounded-full border border-dashed border-slate-800/80 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border border-slate-900/60" />

              {/* DRAW THE 24 SYSTEM DOTS */}
              {CIRCLE_DOTS.map((dot) => {
                const isTarget = dot.index === 0;
                const isActive = dot.index === activeDot;

                return (
                  <div
                    key={dot.index}
                    className="absolute transition-all duration-75 flex items-center justify-center"
                    style={{
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {isTarget ? (
                      /* Red Dot target - much larger, glowing, with outer neon pulse rings */
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <span className="absolute animate-ping w-7 h-7 rounded-full bg-rose-500/25 pointer-events-none" />
                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 border border-white/40 shadow-[0_0_12px_rgba(239,68,68,0.9)] z-10" />
                        <span className="absolute -top-3.5 text-[8px] tracking-widest text-red-500 font-extrabold font-mono uppercase bg-slate-950 px-1 border border-red-500/20 rounded">
                          TRG
                        </span>
                      </div>
                    ) : (
                      /* Standard passive dots */
                      <div 
                        className={`rounded-full transition-all duration-100 ${
                          isActive 
                            ? "w-2.5 h-2.5 bg-yellow-400 shadow-[0_0_8px_#fbbf24] scale-125 z-20" 
                            : "w-1.5 h-1.5 bg-slate-800"
                        }`} 
                      />
                    )}
                  </div>
                );
              })}

              {/* CENTRAL SATISFACTION FEEDBACK OR START BUTTON */}
              <div className="absolute inset-16 bg-slate-950 border border-slate-800/80 shadow-2xl rounded-full flex flex-col items-center justify-center text-center p-3">
                <AnimatePresence mode="wait">
                  {lastRating ? (
                    <motion.div
                      key={lastRating}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <h4 className={`text-base font-black ${ratingColor} uppercase tracking-wider`}>
                        {lastRating}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                        {lastRating === "PERFECT" && "🎉 Godlike Reflexes!"}
                        {lastRating === "GREAT" && "🎯 Excellent Timing!"}
                        {lastRating === "GOOD" && "⚡ Nice Effort!"}
                        {lastRating === "MISS" && "📉 Reset Streak!"}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Activity className={`w-6 h-6 ${isParticlePlaying ? "text-orange-500 animate-pulse" : "text-slate-500"}`} />
                      <span className="text-[8.5px] uppercase font-mono mt-1 text-slate-400 font-bold tracking-wider">
                        {isParticlePlaying ? "Active Rotation" : "Paused"}
                      </span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* EXPLOSION SPARKLES */}
              {sparkles.map((sp) => (
                <div
                  key={sp.id}
                  className="absolute w-2 h-2 rounded-full pointer-events-none transition-all duration-700 ease-out animate-ping"
                  style={{
                    backgroundColor: sp.color,
                    boxShadow: `0 0 8px ${sp.color}`,
                    left: `calc(50% + ${sp.x}px)`,
                    top: `calc(50% + ${sp.y}px)`
                  }}
                />
              ))}
            </div>

            {/* SPACEBAR HINT */}
            <div className="text-center mt-3 text-slate-500 text-[10px] sm:text-xs">
              Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono text-[9px] font-bold">SPACEBAR</kbd> or click the huge button below to test your focus timing!
            </div>
          </div>

          {/* LOWER ACTION CONTROLLER DECK */}
          <div className="relative z-10 mt-2 flex gap-3.5 flex-col xs:flex-row p-1">
            <button
              onClick={handleStopParticle}
              disabled={!isParticlePlaying && lastRating !== null}
              className="flex-1 bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-[0_4px_20px_rgba(249,115,22,0.35)] active:scale-97 transition-all flex items-center justify-center gap-3.5 text-sm cursor-pointer disabled:opacity-40"
            >
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300/30 animate-bounce" />
              <span>STOP PARTICLE AT RED TARGET!</span>
            </button>

            <button
              onClick={handleResetParticleGame}
              className="px-4 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              title="Reset metrics"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="xs:hidden">Reset</span>
            </button>
          </div>

          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40 mt-4 text-[10px] text-slate-500 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 text-[#ff6b00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-400">Reflex Focus Rule:</strong> Standalone browser views execute timing routines at high priority. Tapping the red mark triggers a progressive speed coefficient increase. Practice to claim the <strong className="text-orange-400">City Legend</strong> title!
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      // SCREEN VIEW: MEMORY MATCH SYSTEM
      {/* ======================================================== */}
      {gameMode === "memory" && (
        <div className="flex flex-col flex-1 bg-slate-950 p-6 relative">
          
          {/* Theme selections */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 mb-5 select-none text-slate-300">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider shrink-0 mr-1">Tops:</span>
              
              <button
                onClick={() => handleMemoryThemeChange("shikohabad")}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-all duration-200 ${
                  theme === "shikohabad"
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm"
                    : "bg-slate-950/40 text-slate-400 border-slate-850 hover:bg-slate-900 hover:text-white"
                }`}
              >
                🍯 Peda Hub
              </button>

              <button
                onClick={() => handleMemoryThemeChange("bobby")}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-all duration-200 ${
                  theme === "bobby"
                    ? "bg-orange-500 text-white border-orange-500 font-extrabold shadow-sm"
                    : "bg-slate-950/40 text-slate-400 border-slate-850 hover:bg-slate-900 hover:text-white"
                }`}
              >
                📷 Bobby Pro DSLR
              </button>

              <button
                onClick={() => handleMemoryThemeChange("glass")}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-all duration-200 ${
                  theme === "glass"
                    ? "bg-sky-500 text-white border-sky-400 font-extrabold shadow-sm"
                    : "bg-slate-950/40 text-slate-400 border-slate-850 hover:bg-slate-900 hover:text-white"
                }`}
              >
                💎 Glass Art
              </button>
            </div>

            {/* Score indicators */}
            <div className="flex gap-4 items-center text-xs text-slate-300 bg-slate-950/60 border border-slate-850 px-3.5 py-1.5 rounded-lg shrink-0 select-none font-mono self-end md:self-auto">
              <div className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{formatTime(timeElapsed)}</span>
              </div>
              <div className="border-l border-slate-800 h-4" />
              <div>
                <span className="text-slate-500 mr-1">Moves:</span>
                <span className="font-bold text-white">{moves}</span>
              </div>
              <div className="border-l border-slate-800 h-4" />
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Best: {memoryHighScore === 999 ? "—" : memoryHighScore}</span>
              </div>
            </div>
          </div>

          {/* Cards board container */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[310px] select-none bg-slate-900/10 rounded-2xl p-4 border border-slate-900/85">
            {!isMemoryCompleted ? (
              <div className="grid grid-cols-4 gap-3.5 max-w-sm sm:max-w-md w-full">
                {cards.map((card, idx) => {
                  const IconComp = card.icon;
                  const isRevealed = card.isFlipped || card.isMatched;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className={`aspect-square rounded-xl shadow-md border transition-all duration-300 transform active:scale-95 cursor-pointer relative overflow-hidden flex items-center justify-center group ${
                        isRevealed
                          ? `${card.colorClass} border-slate-300`
                          : "bg-gradient-to-br from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 hover:border-[#ff6b00]/50 border-slate-800/80 text-[#ff6b00]"
                      }`}
                    >
                      {isRevealed ? (
                        <motion.div
                          initial={{ scale: 0.6, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="flex flex-col items-center justify-center text-center p-1"
                        >
                          <IconComp className="w-6 h-6" />
                          <span className="text-[7.5px] uppercase font-black tracking-wider opacity-90 line-clamp-1 mt-1.5 font-mono max-w-[65px]">
                            {card.label.split(" ")[0]}
                          </span>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-[#ff6b00] rounded-full group-hover:scale-125 duration-200 transition-transform shadow-xs shadow-[#ff6b00]/30" />
                          <span className="text-[7.5px] tracking-widest text-slate-500 uppercase mt-1.5 font-mono">SKB</span>
                        </div>
                      )}

                      {card.isMatched && (
                        <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-br-md flex items-center justify-center" title="Matched!">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Victory memory panel */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl border border-amber-500/20 p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center z-10"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
                  <Award className="w-9 h-9 stroke-[1.8]" />
                </div>

                <h4 className="text-base font-black text-white">Master City Matcher!</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-[280px]">
                  Excellent match! You solved this theme with spectacular cognitive dexterity.
                </p>

                <div className="my-5 w-full bg-slate-950 rounded-xl p-4 border border-slate-800 grid grid-cols-2 gap-2 text-slate-300 text-xs font-mono">
                  <div className="border-r border-slate-800 pr-2">
                    <span className="text-[10px] text-slate-500 block uppercase">Time Spent</span>
                    <strong className="text-sm font-bold text-white">{formatTime(timeElapsed)}</strong>
                  </div>
                  <div className="pl-2">
                    <span className="text-[10px] text-slate-500 block uppercase">Required Moves</span>
                    <strong className="text-sm font-bold text-white">{moves} moves</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleStartMemoryGame(theme)}
                  className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-extrabold text-xs py-3 rounded-lg shadow-md transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Challange Again!</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Trigger button manually */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => handleStartMemoryGame(theme)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-800/80 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle Tiles and Restart</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCREEN VIEW: ZEN MINDFRESHER & DAILY PROBLEM SOLVER - MOVED OUTSIDE */}
      {/* ======================================================== */}
      {/* Zen and solver utilities section has been removed; it is featured fully as its own page section. */}

      {/* FOOTER FUN LOCAL FACTS BANNER */}
      <div className="bg-slate-900 text-[10px] text-slate-400 py-3.5 px-4 text-center border-t border-slate-800/80 font-mono">
        {gameMode === "particle" 
          ? "Tap timing aligns with local machine refresh cycle. Try playing on desktop/mobile browsers natively!" 
          : "Fact: Bobby Studio is recognized for delivering premium wedding photography overlays and cine shoots in City."}
      </div>
    </div>
  );
}
