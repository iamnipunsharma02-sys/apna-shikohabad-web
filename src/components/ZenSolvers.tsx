import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Train, 
  GraduationCap, 
  Heart, 
  Star, 
  Cookie, 
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
  Activity,
  AlertCircle,
  MessageSquare,
  Compass,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Web Audio API Synthesizer Helper for offline sounds
const playSound = (type: "bell" | "hum" | "click" | "success", isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "success") {
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start();
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.warn("Audio Context could not render:", e);
  }
};

// Utilities for Math Slabs
const electricityCostCalc = (units: number) => {
  let energyCost = 0;
  if (units <= 150) {
    energyCost = units * 5.50;
  } else if (units <= 300) {
    energyCost = (150 * 5.50) + ((units - 150) * 6.00);
  } else {
    energyCost = (150 * 5.50) + (150 * 6.00) + ((units - 300) * 7.00);
  }
  const fixedCharge = 110;
  const duty = Math.round((energyCost * 0.05) * 100) / 100;
  const totalBill = Math.round((energyCost + fixedCharge + duty) * 100) / 100;
  return {
    energyCost: Math.round(energyCost * 100) / 100,
    duty,
    totalBill
  };
};

const lpgCalculator = (familySize: number, refillDate: string) => {
  const totalDays = Math.round(14200 / (130 * familySize));
  const dateObj = new Date(refillDate);
  const diffTime = Math.abs(Date.now() - dateObj.getTime());
  const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  return {
    totalDays,
    elapsedDays,
    remainingDays
  };
};

const petitionTemplates = (type: "road" | "water" | "power" | "sewer") => {
  const templates = {
    road: {
      subject: "Immediate repairs of deep potholes on Station Road / NH-19 Crossing bypass",
      to: "The Chief Executive Officer / Chairman,\nNagar Palika Parishad, Shikohabad (UP)",
      body: "Sir/Madam,\nWe would like to draw your immediate attention to the terrible condition of the main bypass linking Station Road to NH-19. Numerous deep potholes have surfaced, leading to multiple minor vehicle slips and major traffic bottlenecks during night hours. As concerned citizens of Shikohabad, we request you to arrange for urgent stone-filling & bitumen repaving of this crucial road segment.",
    },
    water: {
      subject: "Supply of muddy and low-pressure drinking water in Katra Bazar Zone",
      to: "The Assistant Engineer,\nWater Works Department (Jal Sansthan), Shikohabad Branch",
      body: "Sir,\nThis is to respectfully report that for the past week, residents of Katra Bazar and surrounding sectors are receiving highly contaminated, muddy water with extremely low pressure. Many children are falling ill due to water-borne conditions. We request you to check the sewage piping leakages crossing the water lines and fix the filtration mechanism immediately.",
    },
    power: {
      subject: "Unscheduled load shedding and voltage drop failures in Station Area",
      to: "The SDO / Assistant Engineer,\nUP Power Corporation Limited (UPPCL) Substation, Shikohabad",
      body: "Sir,\nWe are facing continuous, unannounced electricity outages of 4-6 hours daily during peak afternoon and night hours. In addition, severe low-voltage drops are preventing coolers, water pumps, and fans from operating. This is causing extreme distress to infants and senior citizens. Kindly stabilize the load and enforce regular supply hours.",
    },
    sewer: {
      subject: "Overflowing sewage drains and stagnant wastewater near Ramlila Ground",
      to: "The Executive Health & Sanitation Officer,\nMunicipal Board (Nagar Palika), Shikohabad Zone",
      body: "Sir,\nThe main drainage pipes near Ramlila Ground crossing are completely blocked and stagnant sewer water is overflowing onto the main market streets. The foul smell has made it impossible to walk or open shops, and mosquitoes are breeding aggressively. Please send a specialized jetting machine to clear the blockage immediately.",
    }
  };
  return templates[type];
};

export default function ZenSolvers() {
  const [isMuted, setIsMuted] = useState(false);

  // Pranayama State
  const [breathState, setBreathState] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathActive, setBreathActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState<"bell" | "hum" | "none">("none");
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Daily Solvers states
  const [familySize, setFamilySize] = useState(4);
  const [refillDate, setRefillDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 25);
    return d.toISOString().split("T")[0];
  });
  const [electricityUnits, setElectricityUnits] = useState(180);
  const [complaintType, setComplaintType] = useState<"road" | "water" | "power" | "sewer">("road");

  const ambientIntervalRef = useRef<any>(null);
  const ambientContextRef = useRef<any>(null);
  const ambientContextHumRef = useRef<any>(null);
  const ambientOscsRef = useRef<any[]>([]);
  const ambientGainsRef = useRef<any[]>([]);

  // Stop continuous ambient sound
  const stopAmbientAudio = () => {
    try {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
      ambientOscsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e){}
      });
      ambientOscsRef.current = [];
      ambientGainsRef.current.forEach(gain => {
        try { gain.disconnect(); } catch(e){}
      });
      ambientGainsRef.current = [];
      if (ambientContextRef.current) {
        try { ambientContextRef.current.close(); } catch(e){}
        ambientContextRef.current = null;
      }
      if (ambientContextHumRef.current) {
        try { ambientContextHumRef.current.close(); } catch(e){}
        ambientContextHumRef.current = null;
      }
    } catch(err) {
      console.warn("Audio stop error:", err);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientAudio();
    };
  }, []);

  const triggerAmbientTriggerNote = (phase: "inhale" | "hold" | "exhale") => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      const freq = phase === "inhale" ? 261.63 : phase === "hold" ? 329.63 : 392.00; // C4, E4, G4
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch(e) {}
  };

  // Breathing loop effect
  useEffect(() => {
    if (!breathActive) {
      setBreathState("idle");
      return;
    }

    setBreathState("inhale");
    setBreathTimer(4);

    const intervalId = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          setBreathState(curr => {
            let next: "inhale" | "hold" | "exhale" = "inhale";
            if (curr === "inhale") next = "hold";
            else if (curr === "hold") next = "exhale";
            else next = "inhale";

            triggerAmbientTriggerNote(next);
            return next;
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [breathActive]);

  const handleToggleAmbient = (soundType: "bell" | "hum") => {
    if (ambientSound === soundType) {
      stopAmbientAudio();
      setAmbientSound("none");
      return;
    }

    try {
      stopAmbientAudio();
      setAmbientSound(soundType);

      if (isMuted) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      if (soundType === "hum") {
        const ctx = new AudioContextClass();
        ambientContextHumRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const binGain = ctx.createGain();

        osc1.connect(binGain);
        osc2.connect(binGain);
        binGain.connect(BinFilter(ctx, binGain));

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(130.81, ctx.currentTime);
        
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(131.81, ctx.currentTime);

        binGain.gain.setValueAtTime(0.06, ctx.currentTime);

        osc1.start();
        osc2.start();

        ambientOscsRef.current = [osc1, osc2];
        ambientGainsRef.current = [binGain];
      } else if (soundType === "bell") {
        const playSingleBell = () => {
          try {
            const ctx = new AudioContextClass();
            const now = ctx.currentTime;
            
            const freqs = [523.25, 783.99, 1046.50];
            freqs.forEach((f, idx) => {
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              osc.connect(gainNode);
              gainNode.connect(ctx.destination);

              osc.type = "sine";
              osc.frequency.setValueAtTime(f, now);
              
              gainNode.gain.setValueAtTime(idx === 0 ? 0.10 : 0.04, now);
              gainNode.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

              osc.start(now);
              osc.stop(now + 3.3);
            });
          } catch(e){}
        };

        playSingleBell();
        ambientIntervalRef.current = setInterval(playSingleBell, 6000);
      }
    } catch(e) {
      console.warn("Audio exception:", e);
    }
  };

  const BinFilter = (ctx: AudioContext, node: AudioNode) => {
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(160, ctx.currentTime);
    f.connect(ctx.destination);
    return f;
  };

  const triggerSound = (type: "bell" | "hum" | "click" | "success") => {
    playSound(type, isMuted);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col gap-6 select-none">
      
      {/* Intro Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Smile className="w-5 h-5 text-purple-600 animate-pulse" />
            <span>Zen Mind Refresher & Daily Solvers</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Recharge your mental state with rhythmic breathing, relax to cosmic synth waves, and solve household calculations instantly.
          </p>
        </div>
        
        {/* Sound Toggle */}
        <button
          onClick={() => {
            playSound("click", false); 
            setIsMuted(!isMuted);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
            isMuted 
              ? "bg-rose-50 text-rose-500 border-rose-200" 
              : "bg-slate-50 text-slate-700 border-slate-250 hover:bg-slate-100"
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? "Sound Muted" : "Sound On"}</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ZEN ZONE (5/12 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pranayama Breathing Section */}
          <div className="border border-slate-200 bg-slate-50 p-5 rounded-2xl flex flex-col items-center">
            <span className="bg-purple-100 text-purple-700 border border-purple-200 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg font-bold">
              Pranayama Coach
            </span>
            
            <h4 className="text-sm font-bold text-slate-800 mt-2 mb-1">Rhythmic Deep Breathing</h4>
            <p className="text-[11px] text-slate-500 text-center max-w-[260px] leading-relaxed mb-6">
              Shed municipal stress, reduce blood pressure, & soothe your head cells in seconds.
            </p>

            {/* VISUAL PULSING CONTAINER */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              {/* Outer pulsing radial ring, expanding dynamically under state */}
              <div 
                className={`absolute rounded-full border border-purple-400 transition-all duration-[4000ms] ease-in-out ${
                  breathState === "inhale" ? "w-36 h-36 border-purple-400 opacity-60 scale-125" :
                  breathState === "hold" ? "w-36 h-36 border-emerald-400 opacity-50 scale-110" :
                  breathState === "exhale" ? "w-24 h-24 border-rose-400 opacity-30 scale-95" :
                  "w-28 h-28 opacity-0"
                }`}
              />
              
              {/* Inner breathing circle */}
              <div 
                className={`rounded-full flex flex-col items-center justify-center text-center transition-all duration-[4000ms] ease-in-out shadow-lg relative ${
                  breathState === "inhale" ? "w-32 h-32 bg-purple-50 border-2 border-purple-500 shadow-purple-200 scale-110" :
                  breathState === "hold" ? "w-32 h-32 bg-emerald-50 border-2 border-emerald-50 shadow-emerald-200 scale-110 rotate-12" :
                  breathState === "exhale" ? "w-22 h-22 bg-rose-50 border-2 border-rose-400 shadow-rose-100 scale-90" :
                  "w-26 h-26 bg-slate-100 border border-slate-300 text-slate-400"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={breathState}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${
                      breathState === "inhale" ? "text-purple-600" :
                      breathState === "hold" ? "text-emerald-600" :
                      breathState === "exhale" ? "text-rose-600" :
                      "text-slate-500"
                    }`}>
                      {breathState === "inhale" ? "Inhale" :
                       breathState === "hold" ? "Hold" :
                       breathState === "exhale" ? "Exhale" :
                       "Inactive"}
                    </span>

                    {breathActive && (
                      <span className="text-2xl font-black text-slate-800 font-mono mt-1">
                        {breathTimer}s
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* INSTRUCTION TEXTS */}
            <p className="text-center text-[11px] font-sans h-5 text-slate-600 mb-6 font-medium italic">
              {breathState === "inhale" && "🌬️ Expand lungs slowly, pull clean air..."}
              {breathState === "hold" && "🧘 Keep the pressure quiet, rest in tranquility..."}
              {breathState === "exhale" && "💨 Relax shoulders and eject toxic thoughts..."}
              {breathState === "idle" && "Click start to begin breathing loop"}
            </p>

            {/* TRIGGER BREATHING BUTTON */}
            <button
              onClick={() => {
                triggerSound("click");
                setBreathActive(!breathActive);
              }}
              className={`w-full font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                breathActive 
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md border border-rose-500"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
              }`}
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span>{breathActive ? "Stop Breathing Loop" : "Begin Pranayama Exercise"}</span>
            </button>
          </div>

          {/* Ambient Soundscape Section */}
          <div className="border border-slate-200 bg-slate-50 p-5 rounded-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Ambient Audio Relaxer</h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Generate relaxing, continuous sound frequencies to block out regional road traffic and market noise.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleToggleAmbient("bell")}
                className={`p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center gap-2 ${
                  ambientSound === "bell"
                    ? "bg-amber-50 border-amber-500 text-amber-700 shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                <div className="text-left py-0.5">
                  <strong className="text-[10px] block font-bold">Temple Bell</strong>
                  <span className="text-[8px] text-slate-400 block font-mono mt-0.5">Mild periodic chimes</span>
                </div>
              </button>

              <button
                onClick={() => handleToggleAmbient("hum")}
                className={`p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center gap-2 ${
                  ambientSound === "hum"
                    ? "bg-purple-50 border-purple-500 text-purple-700 shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                <div className="text-left py-0.5">
                  <strong className="text-[10px] block font-bold">Cosmic Drone</strong>
                  <span className="text-[8px] text-slate-400 block font-mono mt-0.5">Binaural grounding frequencies</span>
                </div>
              </button>
            </div>
            
            {isMuted && (
              <div className="mt-3.5 text-center text-[9px] text-rose-500 font-mono flex items-center justify-center gap-1.5 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <VolumeX className="w-3.5 h-3.5" />
                <span>Audio is currently muted via the global sound switch.</span>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: PROBLEM SOLVERS (7/12 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Electricity Bill Estimator */}
          <div className="border border-slate-200 bg-slate-50 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">UPPCL Slabs Bill Estimator</h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Estimate home electricity bills based on direct Firozabad Suburban domestic slab rules.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center bg-white p-4 rounded-xl border border-slate-200">
              <div className="md:col-span-12 xs:md:col-span-5">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 pb-1">Units Consumed (kWh)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={electricityUnits}
                    onChange={(e) => setElectricityUnits(Math.max(0, parseInt(e.target.value, 10)) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-3 pr-10 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-[10px] uppercase font-mono">kWh</span>
                </div>
              </div>

              {/* COMPUTED RESULT DISPLAY CARD */}
              <div className="md:col-span-12 bg-purple-50/50 p-3.5 rounded-lg border border-purple-100 flex justify-between items-center w-full">
                <div>
                  <span className="text-[7.5px] uppercase font-bold text-slate-400 block font-mono">Estimated Progressive Bill</span>
                  <strong className="text-xl font-mono text-purple-700 font-black block mt-0.5">
                    ₹{electricityCostCalc(electricityUnits).totalBill}
                  </strong>
                </div>
                
                <div className="text-right text-[8.5px] text-slate-500 font-mono space-y-0.5">
                  <div>Slab cost: ₹{electricityCostCalc(electricityUnits).energyCost}</div>
                  <div>Fixed Meter charges: ₹110.00</div>
                  <div>Electricity Duty (5%): ₹{electricityCostCalc(electricityUnits).duty}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-purple-100/30 p-2.5 rounded-lg border border-purple-200/40 flex gap-2 text-[10px] text-slate-500 italic">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0 mt-1 animate-ping" />
              <span>Slabs: 1-150 units cost ₹5.50/unit; 151-300 units cost ₹6.00/unit; above that ₹7.00/unit. Call 1912 for power helpline.</span>
            </div>
          </div>

          {/* LPG Cylinder Lifespan Estimator */}
          <div className="border border-slate-200 bg-slate-50 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">LPG Cylinder Lifespan Tracker</h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Calculate household cooking gas depletion timeframe based on connection sizes & booking history.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 mb-3.5">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 pb-1 font-mono">Family Members count</label>
                  <select
                    value={familySize}
                    onChange={(e) => setFamilySize(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:outline-none focus:border-purple-500 font-sans"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} Member{n > 1 && "s"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 pb-1 font-mono">Refill Booking Date</label>
                  <input
                    type="date"
                    value={refillDate}
                    onChange={(e) => setRefillDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* RESULTS CALCULATOR GRAPHIC */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400">Estimated Days left</span>
                
                <strong className={`text-3xl font-mono block mt-1.5 font-black ${
                  lpgCalculator(familySize, refillDate).remainingDays < 7 ? "text-rose-600 animate-pulse" :
                  lpgCalculator(familySize, refillDate).remainingDays < 15 ? "text-amber-600" :
                  "text-emerald-600"
                }`}>
                  {lpgCalculator(familySize, refillDate).remainingDays} Days
                </strong>

                <span className="text-[9px] text-slate-500 font-medium italic mt-1 leading-snug">
                  {lpgCalculator(familySize, refillDate).remainingDays < 7 ? "⚠️ Refill booking is highly overdue!" :
                   lpgCalculator(familySize, refillDate).remainingDays < 15 ? "⏳ More than half depleted." :
                   "✅ Sufficient gas reserve."}
                </span>

                <span className="text-[8px] text-slate-400 font-mono uppercase mt-2 border-t border-slate-200/80 pt-1.5 w-full block">
                  Last Booking: {lpgCalculator(familySize, refillDate).elapsedDays} days ago (est: {lpgCalculator(familySize, refillDate).totalDays} days standard)
                </span>
              </div>
            </div>

            <p className="text-[9.5px] text-slate-400 italic font-mono leading-relaxed">
              Standard civil cylinders yield 14.2 kg LPG. Typical consumption rates average around 130 grams per person daily. Call local LPG distributors for booking.
            </p>
          </div>

          {/* Civil Petition Counsel Letter Draft Generator */}
          <div className="border border-slate-200 bg-slate-50 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Nagar Palika Letter Draft Generator</h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Draft formal civic petitions directed to local representatives & executive teams in Firozabad district.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1.5 rounded-lg border border-slate-200">
                {(["road", "water", "power", "sewer"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      triggerSound("click");
                      setComplaintType(type);
                      setCopiedFeedback(false);
                    }}
                    className={`px-3 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap capitalize ${
                      complaintType === type
                        ? "bg-purple-100/60 text-purple-700 border-purple-300"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {type === "road" && "🛣️ Broken Roads"}
                    {type === "water" && "🚰 Low Water Pressure"}
                    {type === "power" && "🔌 Load Shedded Power"}
                    {type === "sewer" && "🧼 Overflowing Drain"}
                  </button>
                ))}
              </div>

              {/* PETITION TEXTBOX DISPLAY */}
              <div className="bg-[#fdfbf7] border-2 border-[#f0e3ce] p-4 rounded-xl relative text-slate-800 block leading-relaxed font-serif max-h-60 overflow-y-auto antialiased">
                <div className="absolute right-3 top-3 opacity-5 font-bold tracking-widest text-lg uppercase pointer-events-none select-none">
                  CIVIL FORM LIST
                </div>

                <strong className="text-xs font-sans text-slate-500 uppercase tracking-wide block font-black leading-none mb-3">
                  Sub: {petitionTemplates(complaintType).subject}
                </strong>

                <p className="text-xs font-bold font-sans text-slate-705 leading-none mb-2">
                  To, <br />
                  {petitionTemplates(complaintType).to}
                </p>

                <p className="text-[11.5px] leading-relaxed italic text-slate-700 font-serif pb-2 whitespace-pre-wrap">
                  "{petitionTemplates(complaintType).body}"
                </p>

                <p className="text-[10px] leading-none text-slate-400 font-sans border-t border-[#f3e9da] pt-2 flex justify-between">
                  <span>Signatory: Respectful Resident of Shikohabad</span>
                  <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
                </p>
              </div>

              {/* COPY FEEDBACK ACTIONS */}
              <button
                onClick={() => {
                  triggerSound("success");
                  const fullText = `Sub: ${petitionTemplates(complaintType).subject}\nTo,\n${petitionTemplates(complaintType).to}\n\n${petitionTemplates(complaintType).body}\n\nSincerely,\nConcerned Citizen of Shikohabad (UP)`;
                  navigator.clipboard.writeText(fullText);
                  setCopiedFeedback(true);
                  setTimeout(() => setCopiedFeedback(false), 2500);
                }}
                className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  copiedFeedback 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" 
                    : "bg-slate-900 text-white hover:bg-slate-850"
                }`}
              >
                {copiedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                    <span>Petition Statement Copied!</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-purple-300" />
                    <span>Copy Petition Draft to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
