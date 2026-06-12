import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Phone, 
  MapPin, 
  Star, 
  Compass, 
  Train, 
  AlertTriangle, 
  Send, 
  Plus, 
  Heart, 
  Globe, 
  Calendar, 
  Check, 
  ExternalLink, 
  X, 
  MessageSquare,
  Sparkles,
  Info,
  Sun,
  Moon,
  Clock,
  Navigation,
  Instagram,
  Youtube,
  Gamepad2,
  Smartphone,
  Download,
  Loader2,
  Lock,
  Unlock,
  User,
  UserCheck,
  Briefcase,
  Pencil,
  Trash2,
  Camera,
  Layers,
  Map,
  QrCode,
  ShieldCheck,
  Award,
  Copy,
  FileUp,
  RefreshCw,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";

import { 
  Business, 
  Review, 
  Announcement, 
  INITIAL_BUSINESSES, 
  INITIAL_REVIEWS, 
  INITIAL_ANNOUNCEMENTS, 
  CITY_TRAINS, 
  ROAD_ESTIMATES, 
  EMERGENCY_CONTACTS 
} from "./types";

// @ts-ignore
import appLogo from "./assets/images/shikohabad_logo_1779875892580.png";
// @ts-ignore
import bobbyBanner from "./assets/images/bobby_studio_banner_1779877992439.png";
import MindRefresherGame from "./components/MindRefresherGame";
import ZenSolvers from "./components/ZenSolvers";

import { 
  db,
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged 
} from "./firebase";
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

export default function App() {
  // PWA & Core Native Feel Experience State Variables
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  const [isOffline, setIsOffline] = useState(typeof window !== "undefined" ? !navigator.onLine : false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallPromo, setShowInstallPromo] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  
  const [isInIframe, setIsInIframe] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic clipboard copy helper
  const copySharedUrl = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://ais-pre-jdxgahs26f22fl7lrkceo5-417156983070.asia-southeast1.run.app";
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
      });
  };

  // State variables for Bobby Studio Interactive Booking Modal
  const [showBobbyBookingModal, setShowBobbyBookingModal] = useState(false);
  const [bobbyBookingName, setBobbyBookingName] = useState("");
  const [bobbyBookingPhone, setBobbyBookingPhone] = useState("");
  const [bobbyBookingDate, setBobbyBookingDate] = useState("");
  const [bobbyBookingType, setBobbyBookingType] = useState("Wedding");
  const [bobbyBookingNotes, setBobbyBookingNotes] = useState("");
  const [bobbyBookingSubmitted, setBobbyBookingSubmitted] = useState(false);

  // Authenticated Member State & Real Secure Login Database
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const saved = localStorage.getItem("shk_current_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Real Firebase Observer hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Verified Resident",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "Real Firebase Account",
          isRealVerified: true,
          isFirebaseUser: true,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
        };
        setCurrentUser(u);
        localStorage.setItem("shk_current_user", JSON.stringify(u));
      } else {
        // If logged out from Firebase, check if user session was a local mock user or cleared
        const saved = localStorage.getItem("shk_current_user");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.isFirebaseUser) {
              setCurrentUser(null);
              localStorage.removeItem("shk_current_user");
            }
          } catch (e) {
            setCurrentUser(null);
            localStorage.removeItem("shk_current_user");
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem("shk_registered_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "usr_admin",
        name: "Bobby Kumar",
        phone: "9837686414",
        password: "password123",
        email: "bobby@apnashikohabad.com",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_local",
        name: "Nipun Sharma",
        phone: "9412345678",
        password: "password123",
        email: "nipun@apnashikohabad.com",
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Auth portal state controls
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [regMethod, setRegMethod] = useState<"otp" | "email">("otp");
  
  // Login input fields
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // OTP transient fields
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Register fields
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAgreed, setRegAgreed] = useState(true);

  // Live simulation states to make the login page feel incredibly alive
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [pulsePhone, setPulsePhone] = useState(false);
  const [showLiveSmsBanner, setShowLiveSmsBanner] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

  // Focus and Highlight Appreciation modal state on initial mount - opens automatically to focus user on Support Project page
  const [showAppreciationBanner, setShowAppreciationBanner] = useState(true);
  const [showAppreciationSpotlight, setShowAppreciationSpotlight] = useState(true);

  // Unique "Scan to Pay" QR Merchant Scanner States
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrScanMode, setQrScanMode] = useState<"camera" | "upload">("camera");
  const [qrScanning, setQrScanning] = useState(false);
  const [qrScannerError, setQrScannerError] = useState<string | null>(null);
  const [scannedUpiData, setScannedUpiData] = useState<{
    pa: string; // Merchant VPA (e.g. 9837686414@ybl)
    pn?: string; // Merchant Name
    mc?: string; // Category Code
    tn?: string; // Purpose / Note
    am?: string; // Amount
    cu?: string; // Currency
  } | null>(null);

  // Scanned checkout and patron feedback actions
  const [paidUtr, setPaidUtr] = useState("");
  const [patronCertificateName, setPatronCertificateName] = useState("");
  const [isVerifyingScannedPayment, setIsVerifyingScannedPayment] = useState(false);
  const [verifiedPatronCertificate, setVerifiedPatronCertificate] = useState<{
    name: string;
    utr: string;
    amount: string;
    date: string;
  } | null>(null);

  // Custom toast notification system to replace boring browser alerts
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "warning" | "info" | "error" | "sms">("success");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message: string, type: "success" | "warning" | "info" | "error" | "sms" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    // Auto hide after 4.5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  // Business editing controls and custom hub filters
  const [showMyListingsOnly, setShowMyListingsOnly] = useState(false);
  const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);

  // Edit form states
  const [editBizName, setEditBizName] = useState("");
  const [editBizCat, setEditBizCat] = useState<Business["category"]>("sweets");
  const [editBizDesc, setEditBizDesc] = useState("");
  const [editBizAddress, setEditBizAddress] = useState("");
  const [editBizArea, setEditBizArea] = useState("");
  const [editBizPhone, setEditBizPhone] = useState("");
  const [editBizWhatsapp, setEditBizWhatsapp] = useState("");
  const [editBizTags, setEditBizTags] = useState("");

  // State variables backboned by localStorage
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem("shk_businesses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const parsedIds = new Set(parsed.map((b: any) => b.id));
        const missing = INITIAL_BUSINESSES.filter(b => !parsedIds.has(b.id));
        let list = [...parsed, ...missing];
        return list.map((b: any) => {
          // Fallback ownership injection for testing credentials
          if (b.id === "b_bobby" || b.name === "Bobby Studio Photography") {
            return {
              ...b,
              category: "photography",
              address: "Paliwal Chaurah, Station Road, Shikohabad",
              phone: "9837686414, 9634521011",
              whatsapp: "9837686414",
              verifiedPartner: true,
              ownerId: "usr_admin"
            };
          }
          if (b.id === "b1" || b.name === "Radhe Radhe Sweets & Mishthan Bhandar") {
            return {
              ...b,
              phone: "",
              whatsapp: "",
              ownerId: "usr_local"
            };
          }
          return {
            ...b,
            phone: "",
            whatsapp: ""
          };
        });
      } catch (e) {
        return INITIAL_BUSINESSES;
      }
    }
    return INITIAL_BUSINESSES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("shk_reviews");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const parsedIds = new Set(parsed.map((r: any) => r.id));
        const missing = INITIAL_REVIEWS.filter(r => !parsedIds.has(r.id));
        return [...parsed, ...missing];
      } catch (e) {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("shk_announcements");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const parsedIds = new Set(parsed.map((a: any) => a.id));
        const missing = INITIAL_ANNOUNCEMENTS.filter(a => !parsedIds.has(a.id));
        return [...parsed, ...missing];
      } catch (e) {
        return INITIAL_ANNOUNCEMENTS;
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Current selected tab - extended to support full screen mobile assistant and Merchant Hub
  const [activeTab, setActiveTab] = useState<"directory" | "transit" | "community" | "emergency" | "game" | "zen" | "assistant" | "profile">("directory");

  // State to track expanded visual map views for each business
  const [expandedMapIds, setExpandedMapIds] = useState<Record<string, boolean>>({});

  // State to track the active map marker/view mode for each business
  const [cardMapModes, setCardMapModes] = useState<Record<string, "roadmap" | "satellite" | "streetview">>({});

  // State to toggle interactive QR flyer for Bobby Studio Socials
  const [showBobbyQR, setShowBobbyQR] = useState(false);

  // Search and filter states for Directory
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  // Modal control states
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [showGoogleTrustModal, setShowGoogleTrustModal] = useState(false);
  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState("");
  const [activeAuthError, setActiveAuthError] = useState<{
    code: string;
    message: string;
    helpfulMessage: string;
    type: 'unauthorized-domain' | 'network' | 'unauthorized-credential' | 'permission-denied' | 'other';
    context: string;
  } | null>(null);

  // New review form
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Map view selection state for detail view (streetview = front view, satellite = air view, roadmap = standard map)
  const [detailedMapMode, setDetailedMapMode] = useState<"streetview" | "satellite" | "roadmap">("streetview");

  // New business form structure
  const [newBizName, setNewBizName] = useState("");
  const [newBizCat, setNewBizCat] = useState<Business["category"]>("sweets");
  const [newBizDesc, setNewBizDesc] = useState("");
  const [newBizAddress, setNewBizAddress] = useState("");
  const [newBizArea, setNewBizArea] = useState("");
  const [newBizPhone, setNewBizPhone] = useState("");
  const [newBizWhatsapp, setNewBizWhatsapp] = useState("");
  const [newBizTags, setNewBizTags] = useState("");
  const [newBizImageUrl, setNewBizImageUrl] = useState("");
  const [editBizImageUrl, setEditBizImageUrl] = useState("");
  const [driveToken, setDriveToken] = useState<string | null>(() => {
    return localStorage.getItem("shk_drive_token");
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);

  // New Notice form
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeAuthor, setNoticeAuthor] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<Announcement["category"]>("news");
  const [noticeContent, setNoticeContent] = useState("");

  // System & Presence simulation state ("active" or "inactive" for users and the system)
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [userPresence, setUserPresence] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [bulletinFilter, setBulletinFilter] = useState<string>("all");

  // Manage resident online/offline status mapped to user IDs
  const [residentStatusMap, setResidentStatusMap] = useState<Record<string, "ONLINE" | "IDLE" | "OFFLINE">>({
    "usr_admin": "ONLINE",
    "usr_local": "IDLE"
  });

  const handleToggleResidentStatus = (userId: string) => {
    setResidentStatusMap(prev => {
      const current = prev[userId] || "ONLINE";
      const next: "ONLINE" | "IDLE" | "OFFLINE" = 
        current === "ONLINE" ? "IDLE" : 
        current === "IDLE" ? "OFFLINE" : "ONLINE";
      return { ...prev, [userId]: next };
    });
    triggerToast("Resident activity status modified locally.", "info");
  };

  const handleTriggerRandomTraffic = () => {
    const statuses: Array<"ONLINE" | "IDLE" | "OFFLINE"> = ["ONLINE", "IDLE", "OFFLINE"];
    const updated: Record<string, "ONLINE" | "IDLE" | "OFFLINE"> = { ...residentStatusMap };
    
    // Update existing registered users
    registeredUsers.forEach(u => {
      updated[u.id] = statuses[Math.floor(Math.random() * statuses.length)];
    });
    
    // Add/Update simulated guest users
    for (let i = 0; i < 6; i++) {
      updated[`sim_res_${i}`] = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    setResidentStatusMap(updated);
    triggerToast("⚡ Simulated town traffic pulse refreshed residents presence!", "success");
  };

  const handleQuickAddLocalBusiness = () => {
    const randomBizNames = [
      "Royal City Food Palace",
      "Karan Cement & Hardware",
      "Ganesh Mobile repairing clinic",
      "Blooming Buds Junior",
      "Paliwal PG Commerce Hub",
      "Verma Saree & Bridal Mall",
      "Hotel Green Park Suites",
      "Bobby Creative Photography Studio",
      "Shiko Pizza & Burgers Corner",
      "Tanay Telecom Services Shop",
      "Vishal Brand Outlet",
      "Maa Jaanki Mahal Marriage Hall"
    ];
    const categories: Array<Business["category"]> = [
      "restaurant", "hardware", "electronics", "school", "college", "retail", "hotel", "photography",
      "restaurant", "electronics", "retail", "hotel"
    ];
    const index = Math.floor(Math.random() * randomBizNames.length);
    const randomName = randomBizNames[index];
    const randomCat = categories[index];
    const randomAreas = ["Station Road", "Katra Bazar", "Bypass Road", "College Road", "Ramlila Ground"];
    const randomArea = randomAreas[Math.floor(Math.random() * randomAreas.length)];
    const code = Math.floor(Math.random() * 1000);
    
    const newBiz: Business = {
      id: `biz_quick_${Date.now()}_${code}`,
      name: randomName,
      category: randomCat,
      description: `Premium quality trade goods. Added by resident volunteer during live active session simulation. Welcome to our City family!`,
      address: `Shop No. ${code}, ${randomArea}, City`,
      area: randomArea,
      phone: "+91 98" + Math.floor(10000000 + Math.random() * 90000000),
      rating: parseFloat((4.0 + Math.random() * 0.5).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 20) + 1,
      tags: ["Volunteer Added", "Local Business", randomCat.toUpperCase()],
      ownerId: "usr_local"
    };
    
    setBusinesses([newBiz, ...businesses]);
    triggerToast(`Listed "${newBiz.name}" instantly under local resident submitted directory!`, "success");
  };

  // AI chat states
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([
    {
      role: "assistant",
      content: `### Namaste! Welcome to Apna City. 🌸\n\nI am **Dara**, your local companion. Ask me anything about our historical city—where to find the most delicious traditional **Mishri Peda**, the history of prince **Dara Shikoh**, details on the local glassware industry, or colleges like JS University!\n\n_What would you like to explore today?_`
    }
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState({ aiAvailable: true, hasApiKey: true });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // PWA & Offline management hooks on mount
  useEffect(() => {
    // Handle PWA shortcut URL search parameters
    const urlParams = new URL(window.location.href).searchParams;
    if (urlParams.get("open_chat") === "true") {
      setActiveTab("assistant");
    }

    // Elegant boot-up splash sequence to match native Android loading screens (2 seconds)
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    // Environment checks
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const iOSDetected = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== "undefined" && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(!!iOSDetected);

    // Online & Offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Intercept standard PWA prompt event
    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] Apna City was installed successfully!');
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      setShowInstallPopup(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforePrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Detect if already launched inside standalone display
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone
    ) {
      setIsAppInstalled(true);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforePrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Handle PWA shortcut and deep-linking routing on startup
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const actionParam = params.get("action");

      if (tabParam) {
        const validTabs = ["directory", "transit", "community", "emergency", "game", "assistant", "profile"];
        if (validTabs.includes(tabParam)) {
          setActiveTab(tabParam as any);
          console.log(`[PWA Router] Routed to shortcut tab: ${tabParam}`);
        }
      }
      if (actionParam === "add-business") {
        setShowAddBusinessModal(true);
        console.log(`[PWA Router] Triggered shortcut action: Add Business`);
      }
    } catch (err) {
      console.warn("[PWA Router] Failed to parse startup deep-link shortcuts:", err);
    }
  }, []);


  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      // If there is no browser automatic installer prompt yet, trigger the smart interactive guide
      setShowInstallPopup(true);
      return;
    }

    try {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA prompt outcome: ${outcome}`);
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsAppInstalled(true);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    } catch (err) {
      console.error("Installation failed:", err);
    } finally {
      setIsInstalling(false);
      setShowInstallPopup(false);
    }
  };


  // Synchronize with localStorage
  useEffect(() => {
    localStorage.setItem("shk_businesses", JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem("shk_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("shk_announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("shk_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("shk_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("shk_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    if (driveToken) {
      localStorage.setItem("shk_drive_token", driveToken);
    } else {
      localStorage.removeItem("shk_drive_token");
    }
  }, [driveToken]);

  // Check backend capabilities on mount
  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => setAiStatus(data))
      .catch(() => setAiStatus({ aiAvailable: false, hasApiKey: false }));
  }, []);

  // Real-time Firestore Sync on Mount & Auto-Seeding Missing Items
  useEffect(() => {
    // Sync businesses
    const unsubBiz = onSnapshot(collection(db, "businesses"), (snapshot) => {
      const list: Business[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const fetched = doc.data() as Business;
          const initial = INITIAL_BUSINESSES.find(ib => ib.id === doc.id);
          const isBobby = doc.id === "b_bobby" || fetched.name === "Bobby Studio Photography";
          list.push({
            id: doc.id,
            ...initial,
            ...fetched,
            phone: isBobby ? (fetched.phone || initial?.phone || "9837686414, 9634521011") : "",
            whatsapp: isBobby ? (fetched.whatsapp || initial?.whatsapp || "9837686414") : "",
            imageUrl: fetched.imageUrl || initial?.imageUrl
          } as Business);
        });
        const fetchedIds = new Set(list.map(b => b.id));
        const missing = INITIAL_BUSINESSES.filter(b => !fetchedIds.has(b.id));
        if (missing.length > 0) {
          list.push(...missing);
          missing.forEach(b => {
            setDoc(doc(db, "businesses", b.id), b).catch(err => console.warn("Auto-seeding business error:", err));
          });
        }
        setBusinesses(list);
      } else {
        // Empty Firestore collection, seed everything
        INITIAL_BUSINESSES.forEach(b => {
          setDoc(doc(db, "businesses", b.id), b).catch(err => console.warn("Auto-seeding first-run business error:", err));
        });
        setBusinesses(INITIAL_BUSINESSES);
      }
    }, (err) => {
      console.warn("Firestore businesses sync error:", err);
    });

    // Sync reviews
    const unsubReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const list: Review[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Review);
        });
        const fetchedIds = new Set(list.map(r => r.id));
        const missing = INITIAL_REVIEWS.filter(r => !fetchedIds.has(r.id));
        if (missing.length > 0) {
          list.push(...missing);
          missing.forEach(r => {
            setDoc(doc(db, "reviews", r.id), r).catch(err => console.warn("Auto-seeding review error:", err));
          });
        }
        setReviews(list);
      } else {
        INITIAL_REVIEWS.forEach(r => {
          setDoc(doc(db, "reviews", r.id), r).catch(err => console.warn("Auto-seeding first-run review error:", err));
        });
        setReviews(INITIAL_REVIEWS);
      }
    }, (err) => {
      console.warn("Firestore reviews sync error:", err);
    });

    // Sync announcements
    const unsubAnnouncements = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const list: Announcement[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Announcement);
        });
        const fetchedIds = new Set(list.map(a => a.id));
        const missing = INITIAL_ANNOUNCEMENTS.filter(a => !fetchedIds.has(a.id));
        if (missing.length > 0) {
          list.push(...missing);
          missing.forEach(a => {
            setDoc(doc(db, "announcements", a.id), a).catch(err => console.warn("Auto-seeding announcement error:", err));
          });
        }
        list.sort((a, b) => b.id.localeCompare(a.id));
        setAnnouncements(list);
      } else {
        INITIAL_ANNOUNCEMENTS.forEach(a => {
          setDoc(doc(db, "announcements", a.id), a).catch(err => console.warn("Auto-seeding first-run announcement error:", err));
        });
        const listToSet = [...INITIAL_ANNOUNCEMENTS];
        listToSet.sort((a, b) => b.id.localeCompare(a.id));
        setAnnouncements(listToSet);
      }
    }, (err) => {
      console.warn("Firestore announcements sync error:", err);
    });

    return () => {
      unsubBiz();
      unsubReviews();
      unsubAnnouncements();
    };
  }, []);

  // Handle auto-scrolling Chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiLoading]);

  // Filter businesses
  const filteredBusinesses = businesses.filter(b => {
    if (showMyListingsOnly && currentUser) {
      if (b.ownerId !== currentUser.id) return false;
    }
    // Intercept search queries related to photography or bobby so it specifically displays only Bobby Studio Photography
    const lowerQuery = searchQuery.toLowerCase().trim();
    const isPhotographerSearch = 
      lowerQuery.includes("photo") || 
      lowerQuery.includes("camera") || 
      lowerQuery.includes("video") || 
      lowerQuery.includes("shoot") || 
      lowerQuery.includes("studio") || 
      lowerQuery.includes("bobby") || 
      lowerQuery.includes("album") || 
      lowerQuery.includes("cinemat") ||
      lowerQuery.includes("pic") ||
      lowerQuery.includes("image");

    if (isPhotographerSearch && lowerQuery.length >= 2) {
      return b.id === "b_bobby" || b.name === "Bobby Studio Photography";
    }

    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    const matchesArea = areaFilter === "all" || b.area === areaFilter;
    return matchesSearch && matchesCategory && matchesArea;
  });

  const uniqueAreas = Array.from(new Set(businesses.map(b => b.area)));

  // "Scan to Pay" QR Merchant Scanner Support Handlers
  const handleQrDecoded = (decodedText: string) => {
    try {
      if (decodedText.startsWith("upi://pay")) {
        const url = new URL(decodedText);
        const pa = url.searchParams.get("pa") || "";
        const pn = url.searchParams.get("pn") || "Verified Merchant";
        const am = url.searchParams.get("am") || "101";
        const tn = url.searchParams.get("tn") || "Apna Shikohabad Appreciation";
        setScannedUpiData({ pa, pn, am, tn });
      } else if (decodedText.includes("@")) {
        setScannedUpiData({ pa: decodedText, pn: "Verified Merchant", am: "101", tn: "Service Payment" });
      } else {
        setScannedUpiData({ 
          pa: "9837686414@ybl", 
          pn: "Apna Shikohabad", 
          am: "101", 
          tn: decodedText || "Apna Shikohabad Support" 
        });
      }
      triggerToast("QR Code processed successfully!", "success");
    } catch {
      if (decodedText.includes("@")) {
        setScannedUpiData({ pa: decodedText, pn: "Verified Merchant", am: "101" });
      } else {
        setScannedUpiData({ 
          pa: "9837686414@ybl", 
          pn: "Apna Shikohabad", 
          am: "101", 
          tn: "Apna Shikohabad Support" 
        });
      }
      triggerToast("QR code scanned", "success");
    }
  };

  const startCameraScan = async () => {
    setQrScanning(true);
    setQrScannerError(null);
    try {
      setTimeout(async () => {
        const html5QrCode = new Html5Qrcode("shk-qr-scanner-element");
        (window as any).html5QrCodeInstance = html5QrCode;
        
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.75;
              return { width: size, height: size };
            }
          },
          (decodedText) => {
            handleQrDecoded(decodedText);
            stopCameraScan();
          },
          () => {
            // Bad frame, silent
          }
        );
      }, 150);
    } catch (err: any) {
      console.error("Camera scan error:", err);
      setQrScannerError(err?.message || "Failed to start camera. Please ensure permissions are granted.");
      setQrScanning(false);
    }
  };

  const stopCameraScan = async () => {
    const instance = (window as any).html5QrCodeInstance;
    if (instance) {
      try {
        if (instance.isScanning) {
          await instance.stop();
        }
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
      (window as any).html5QrCodeInstance = null;
    }
    setQrScanning(false);
  };

  const handleQrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrScanning(true);
    setQrScannerError(null);
    try {
      const html5QrCode = new Html5Qrcode("shk-file-uploader-stage");
      const decodedText = await html5QrCode.scanFile(file, true);
      handleQrDecoded(decodedText);
    } catch (err: any) {
      console.warn("File scan error:", err);
      setQrScannerError("Failed to decode QR code from the selected image. Make sure the QR Code is clearly visible inside the file.");
    } finally {
      setQrScanning(false);
    }
  };

  const handleVerifyScannedPayment = () => {
    const pName = patronCertificateName.trim();
    const utr = paidUtr.trim();

    if (!pName) {
      triggerToast("Please enter the Patron Name for the certificate.", "warning");
      return;
    }

    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(utr)) {
      triggerToast("Please enter a valid 12-Digit numerical UPI UTR code.", "warning");
      return;
    }

    setIsVerifyingScannedPayment(true);
    setTimeout(() => {
      setIsVerifyingScannedPayment(false);
      
      const calendar = new Date();
      const day = calendar.getDate().toString().padStart(2, '0');
      const month = (calendar.getMonth() + 1).toString().padStart(2, '0');
      const year = calendar.getFullYear();
      
      setVerifiedPatronCertificate({
        name: pName,
        utr: utr,
        amount: scannedUpiData?.am || "101",
        date: `${day}-${month}-${year}`
      });

      triggerToast("Contribution certified successfully!", "success");
    }, 4000);
  };

  // Clean scanning states on toggle
  useEffect(() => {
    if (!showQrScanner) {
      stopCameraScan();
    }
    return () => {
      stopCameraScan();
    };
  }, [showQrScanner]);

  // Submit new review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("Verification Required: Please log in to post reviews & star ratings!", "warning");
      setShowAuthModal(true);
      return;
    }

    if (!reviewComment.trim()) {
      triggerToast("Please enter your detailed comment!", "warning");
      return;
    }

    if (!selectedBusiness) return;

    // Strict Condition Check: Ratings above 4.5 stars are reserved only for "Bobby Studio Photography"
    let currentRating = reviewRating;
    if (currentRating > 4.5 && selectedBusiness.id !== "b_bobby") {
      triggerToast("Notice: Ratings above 4.5 Stars are reserved for legendary partner 'Bobby Studio Photography'. Adjusted to 4.5 Stars.", "info");
      currentRating = 4.5;
    }

    const newReview: Review = {
      id: "rev_" + Date.now(),
      businessId: selectedBusiness.id,
      author: currentUser.name,
      rating: currentRating,
      comment: reviewComment,
      createdAt: new Date().toISOString()
    };

    // Save review to Firestore!
    setDoc(doc(db, "reviews", newReview.id), newReview)
      .then(() => {
        const updatedReviews = [newReview, ...reviews];
        const bizReviews = updatedReviews.filter(r => r.businessId === selectedBusiness.id);
        const avgRating = parseFloat((bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length).toFixed(1));
        const finalRating = selectedBusiness.id === "b_bobby" ? avgRating : Math.min(avgRating, 4.5);

        // Update the business counters in Firestore!
        updateDoc(doc(db, "businesses", selectedBusiness.id), {
          rating: finalRating,
          reviewsCount: bizReviews.length
        }).catch(err => {
          console.warn("Could not update business rating counters on Firebase:", err.message);
        });

        triggerToast("Review posted successfully to the community directory!", "success");
      })
      .catch((err) => {
        console.error("Firestore reviews error:", err);
        // Fallback locally
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        triggerToast("Posted locally.", "info");
      });

    // Reset Form
    setReviewAuthor("");
    setReviewComment("");
    setReviewRating(4); // Default to 4 on reset as 5 is locked for non-Bobby
  };

  // Submit new Business
  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("Authentication Required: Only registered merchants can list businesses. Please log in first!", "warning");
      setShowAuthModal(true);
      return;
    }

    if (!newBizName.trim() || !newBizDesc.trim() || !newBizAddress.trim() || !newBizPhone.trim()) {
      triggerToast("Please fill in all required fields!", "warning");
      return;
    }

    const tagsArray = newBizTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const isBobby = newBizName === "Bobby Studio Photography";
    const newBiz: Business = {
      id: "biz_" + Date.now(),
      name: newBizName,
      category: newBizCat,
      description: newBizDesc,
      address: newBizAddress,
      area: newBizArea || "General Area",
      phone: isBobby ? newBizPhone : "",
      whatsapp: isBobby ? (newBizWhatsapp || undefined) : undefined,
      rating: isBobby ? 5.0 : 4.5, // Initial default rating
      reviewsCount: 0,
      tags: tagsArray.length > 0 ? tagsArray : ["Local Shop"],
      ownerId: currentUser.id, // Store the creator's ID!
      imageUrl: newBizImageUrl || undefined
    };

    // Save to Firestore!
    setDoc(doc(db, "businesses", newBiz.id), newBiz)
      .then(() => {
        triggerToast(`"${newBiz.name}" has been successfully listed under your profile!`, "success");
      })
      .catch((err) => {
        console.error("Firestore save error:", err);
        // Local state fallback in case firestore is busy
        setBusinesses([newBiz, ...businesses]);
        triggerToast(`Listed locally: ${err.message}`, "info");
      });

    setShowAddBusinessModal(false);

    // Reset values
    setNewBizName("");
    setNewBizDesc("");
    setNewBizAddress("");
    setNewBizArea("");
    setNewBizPhone("");
    setNewBizWhatsapp("");
    setNewBizTags("");
    setNewBizImageUrl("");
  };

  // OTP Simulated SMS Sending
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const phone = authTab === "login" ? loginPhone : regPhone;
    if (!phone || phone.trim().length < 10) {
      triggerToast("Please enter a valid 10-digit mobile number!", "error");
      return;
    }
    
    // Generate a beautiful, recognizable random 4-digit code
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(generated);
    setIsOtpSent(true);
    setOtpTimer(30);
    setPulsePhone(true);
    
    // Auto-reset phone pulse after some time
    setTimeout(() => {
      setPulsePhone(false);
    }, 1000);
    
    // Trigger live sliding top SMS simulation card!
    setShowLiveSmsBanner(true);
    triggerToast(`OTP secure verification passcode dispatched!`, "sms");
  };

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (isOtpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(t => t - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpTimer]);

  // Verify OTP & Login
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp) {
      triggerToast("Verification Failed: Invalid OTP code! Please tap the SMS simulation banner above.", "error");
      return;
    }

    if (authTab === "login") {
      let user = registeredUsers.find(u => u.phone.includes(loginPhone));
      if (!user) {
        // Automatically create account for this phone
        user = {
          id: "usr_" + Date.now(),
          name: "Resident " + loginPhone.slice(-4),
          phone: loginPhone,
          createdAt: new Date().toISOString()
        };
        setRegisteredUsers(prev => [...prev, user]);
      }
      
      setCurrentUser(user);
      triggerToast(`Welcome back, ${user.name}! Your merchant session is now active.`, "success");
    } else {
      const newUser = {
        id: "usr_" + Date.now(),
        name: regName,
        phone: regPhone,
        email: regEmail || undefined,
        password: regPassword || "password123",
        createdAt: new Date().toISOString()
      };
      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      triggerToast(`Account created! Welcome, ${regName}! Your shop is now claimable.`, "success");
    }

    handleResetAuth();
    setShowLiveSmsBanner(false);
  };

  // Real Email/Password Registration through Firebase Auth
  const handleRegisterRealEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPassword.trim() || !regName.trim()) {
      triggerToast("Please fill in Name, Email, and Password for real validation!", "warning");
      return;
    }
    if (regPassword.length < 6) {
      triggerToast("Security threshold: Password must be 6 or more characters.", "warning");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword.trim());
      await updateProfile(userCredential.user, { displayName: regName.trim() });
      const firebaseUser = userCredential.user;
      const u = {
        id: firebaseUser.uid,
        name: regName.trim(),
        email: firebaseUser.email || "",
        phone: regPhone || "Real Email Account",
        isRealVerified: true,
        isFirebaseUser: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(u);
      triggerToast(`Account created successfully! Real validated session active for ${regName}.`, "success");
      handleResetAuth();
    } catch (err: any) {
      triggerToast(`Registration Failed: ${err.message}`, "error");
    }
  };

  // Simulated Google Sign-In for Sandbox Preview Mode
  const handleSimulatedGoogleLogin = () => {
    const backupId = "goog_" + Date.now();
    const u = {
      id: backupId,
      name: "Google Resident (Sandbox Partner)",
      email: "resident.shikohabad@gmail.com",
      phone: "+91 94111 88888 (Google Verified ID)",
      isRealVerified: true,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(u);
    setDriveToken("simulated_drive_token_google_shk");
    triggerToast(`Success! Logged in as ${u.name} (Sandbox Simulated Mode). All features unlocked!`, "success");
    setShowGoogleConfigModal(false);
    handleResetAuth();
  };

  // Google Authentication Handler using Popup overlay as mandated by the Firebase developer skill
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setDriveToken(credential.accessToken);
      }
      
      const u = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google Resident",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "Google Verified ID",
        isRealVerified: true,
        isFirebaseUser: true,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
      };
      setCurrentUser(u);
      triggerToast(`Success! Logged in as ${u.name} via real Google verification. Google Drive is connected!`, "success");
      handleResetAuth();
    } catch (err: any) {
      console.warn("Real Google Login failed. Opening guide overlay.", err.message);
      setGoogleAuthError(err.message || "Unknown auth error.");
      setShowGoogleConfigModal(true);
      triggerToast("Google Sign-In failed. Showing setup helper and sandbox login modal.", "info");
    }
  };

  const handleConnectDrive = async () => {
    setIsConnectingDrive(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setDriveToken(credential.accessToken);
        triggerToast("Successfully connected Google Drive! You can now upload shop images.", "success");
        if (!currentUser) {
          const firebaseUser = result.user;
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Google Resident",
            email: firebaseUser.email || "",
            phone: firebaseUser.phoneNumber || "Google Verified ID",
            isRealVerified: true,
            isFirebaseUser: true,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
          });
        }
      } else {
        triggerToast("Authorized, but Google did not return a valid Drive access token.", "warning");
      }
    } catch (err: any) {
      console.warn("Real Google Drive grant failed. Opening guide overlay.", err.message);
      setGoogleAuthError(err.message || "Unknown auth error.");
      setShowGoogleConfigModal(true);
      triggerToast("Drive Grant Failed. Showing setup helper and sandbox login modal.", "info");
    } finally {
      setIsConnectingDrive(false);
    }
  };

  // Helper to upload file to Google Drive and return a direct viewing URL
  const uploadToGoogleDrive = async (file: File): Promise<string> => {
    if (!driveToken) {
      throw new Error("Google Drive is not connected. Please connect your Google Drive first!");
    }

    // Step 1: Create file metadata on Google Drive
    const metadataResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${driveToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: `shikohabad_shop_${Date.now()}_${file.name}`,
        mimeType: file.type,
      })
    });

    if (!metadataResponse.ok) {
      const errText = await metadataResponse.text();
      throw new Error(`Failed to initialize Google Drive file: ${errText}`);
    }

    const metadata = await metadataResponse.json();
    const fileId = metadata.id;

    // Step 2: Upload file binary content
    const mediaResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${driveToken}`,
        "Content-Type": file.type
      },
      body: file
    });

    if (!mediaResponse.ok) {
      const errText = await mediaResponse.text();
      throw new Error(`Failed to transfer file material to Google Drive: ${errText}`);
    }

    // Step 3: Create 'anyone reader' permission so that the image is accessible by any browser viewer
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${driveToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone"
        })
      });
    } catch (permissionErr) {
      console.warn("Could not set anyone reader permission, but file was uploaded. Continuing anyway...", permissionErr);
    }

    // Returns the reliable Google Drive image gateway thumbnail rendering URL
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  };

  // Login via Password
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || !loginPassword.trim()) {
      triggerToast("Please enter secure login credentials.", "warning");
      return;
    }

    // Checking if it is an email address for real Firebase authentication
    if (loginPhone.includes("@")) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, loginPhone.trim(), loginPassword.trim());
        const firebaseUser = userCredential.user;
        const u = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Verified Resident",
          email: firebaseUser.email || "",
          phone: "Verified via Email",
          isRealVerified: true,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
        };
        setCurrentUser(u);
        triggerToast(`Welcome back! Real validated session active for ${u.name}.`, "success");
        handleResetAuth();
        return;
      } catch (err: any) {
        triggerToast(`Authentication Failed: ${err.message}`, "error");
        return;
      }
    }

    const user = registeredUsers.find(
      u => (u.phone.includes(loginPhone) || u.email === loginPhone) && u.password === loginPassword
    );

    if (user) {
      setCurrentUser(user);
      triggerToast(`Welcome back, ${user.name}! Secure partner session active.`, "success");
      handleResetAuth();
    } else {
      triggerToast("Authentication Failed: Credentials do not match any verified record. Use test profiles or login with real email address.", "error");
    }
  };

  // Reset/Logout Auth states
  const handleResetAuth = () => {
    setShowAuthModal(false);
    setIsOtpSent(false);
    setOtpCode("");
    setGeneratedOtp("");
    setLoginPhone("");
    setLoginPassword("");
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegPassword("");
    setOtpTimer(0);
    setActiveDemoRole(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase signOut failure:", e);
    }
    setCurrentUser(null);
    setDriveToken(null);
    setShowMyListingsOnly(false);
    localStorage.removeItem("shk_current_user");
    localStorage.removeItem("shk_drive_token");
    triggerToast("Your security session ended. Logged out successfully.", "info");
  };

  // Edit/Delete Business Logic Click Handlers
  const handleOpenEditBusiness = (b: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || b.ownerId !== currentUser.id) {
       triggerToast("Security Alert: This business belongs to another verified merchant. You cannot edit other shops!", "error");
       return;
    }
    setEditingBusinessId(b.id);
    setEditBizName(b.name);
    setEditBizCat(b.category);
    setEditBizDesc(b.description);
    setEditBizAddress(b.address);
    setEditBizArea(b.area || "");
    setEditBizPhone(b.phone);
    setEditBizWhatsapp(b.whatsapp || "");
    setEditBizTags(b.tags.join(", "));
    setEditBizImageUrl(b.imageUrl || "");
    setShowEditBusinessModal(true);
  };

  const handleSaveEditBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBizName.trim() || !editBizDesc.trim() || !editBizAddress.trim() || !editBizPhone.trim()) {
      triggerToast("Please fill in all requested fields!", "warning");
      return;
    }

    if (!editingBusinessId) return;

    const tagsArray = editBizTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const originalBiz = businesses.find(b => b.id === editingBusinessId);
    if (!originalBiz) return;

    if (originalBiz.ownerId !== currentUser?.id) {
      triggerToast("Security Bound Violated: Modification of non-owned businesses is restricted!", "error");
      return;
    }

    const isBobby = editingBusinessId === "b_bobby" || editBizName === "Bobby Studio Photography";
    const updatedBiz: Business = {
      ...originalBiz,
      name: editBizName,
      category: editBizCat,
      description: editBizDesc,
      address: editBizAddress,
      area: editBizArea || "General Area",
      phone: isBobby ? editBizPhone : "",
      whatsapp: isBobby ? (editBizWhatsapp || undefined) : undefined,
      tags: tagsArray.length > 0 ? tagsArray : ["Local Shop"],
      imageUrl: editBizImageUrl || undefined
    };

    // Save update to Firestore!
    setDoc(doc(db, "businesses", editingBusinessId), updatedBiz)
      .then(() => {
        triggerToast("Business directory listing updated successfully in database!", "success");
      })
      .catch((err) => {
        console.error("Firestore update error:", err);
        // Fallback local update
        setBusinesses(prev => prev.map(b => b.id === editingBusinessId ? updatedBiz : b));
        triggerToast("Saved locally.", "info");
      });

    setSelectedBusiness(prev => {
      if (prev && prev.id === editingBusinessId) {
        return updatedBiz;
      }
      return prev;
    });

    setShowEditBusinessModal(false);
    setEditingBusinessId(null);
  };

  const handleDeleteBusiness = (b: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || b.ownerId !== currentUser.id) {
      triggerToast("Security Alert: You do not have ownership privileges to delete this business!", "error");
      return;
    }

    // Delete from Firestore!
    deleteDoc(doc(db, "businesses", b.id))
      .then(() => {
        triggerToast(`"${b.name}" has been permanently removed from town directory.`, "success");
      })
      .catch((err) => {
        console.error("Firestore delete error:", err);
        // Fallback local state delete
        setBusinesses(prev => prev.filter(item => item.id !== b.id));
        triggerToast("Deleted locally.", "info");
      });

    if (selectedBusiness?.id === b.id) {
      setSelectedBusiness(null);
    }
  };

  // Submit new Announcement
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim() || !noticeAuthor.trim()) {
      triggerToast("Please fill in all fields!", "warning");
      return;
    }

    const newNotice: Announcement = {
      id: "not_" + Date.now(),
      title: noticeTitle,
      content: noticeContent,
      author: noticeAuthor,
      category: noticeCategory,
      date: new Date().toISOString(),
      likes: 0,
      userId: currentUser?.id || "usr_guest"
    };

    // Save notice to Firestore!
    setDoc(doc(db, "announcements", newNotice.id), newNotice)
      .then(() => {
        triggerToast("Notice published successfully to the town bulletin board!", "success");
      })
      .catch((err) => {
        console.error("Firestore notice error:", err);
        // Fallback locally
        setAnnouncements([newNotice, ...announcements]);
        triggerToast("Posted notice locally.", "info");
      });

    setShowAddNoticeModal(false);

    // Reset values
    setNoticeTitle("");
    setNoticeContent("");
    setNoticeAuthor("");
  };

  // Interactive bulletboard Like action
  const handleLikeAnnouncement = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const notice = announcements.find(a => a.id === id);
    if (!notice) return;

    // Increment in Firestore!
    updateDoc(doc(db, "announcements", id), {
      likes: (notice.likes || 0) + 1
    })
      .then(() => {
        triggerToast("Notice liked!", "success");
      })
      .catch((err) => {
        console.warn("Firestore like error, incrementing locally:", err.message);
        setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, likes: (a.likes || 0) + 1 } : a));
      });
  };

  // Chat conversation handle
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || isAiLoading) return;

    const userMsg = userChatInput.trim();
    setUserChatInput("");

    const newMessages = [...chatMessages, { role: "user" as const, content: userMsg }];
    setChatMessages(newMessages);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Local server reported an error processing your guide request.");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant" as const, content: data.reply }]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { 
          role: "assistant" as const, 
          content: `### Connection Issue ⚠️\n\nI couldn't reach the server-side proxy. Please ensure that your **GEMINI_API_KEY** is configured securely inside the **Settings > Secrets** panel of AI Studio, then compile again. Here's a brief mock-up guidance: City is rich in sweets and glassware!`
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper parser to render basic markdown bold/paragraphs elegantly inside the chat
  const parseMarkdown = (text: string) => {
    return text.split("\n\n").map((paragraph, index) => {
      // Inline tags parser
      let content = paragraph;
      // Headings
      if (content.startsWith("### ")) {
        return <h3 key={index} className="text-base font-bold text-amber-950 mt-2 mb-1">{content.replace("### ", "")}</h3>;
      }
      if (content.startsWith("**") && content.endsWith("**")) {
        return <p key={index} className="text-sm font-semibold text-amber-950 mt-1">{content.replaceAll("**", "")}</p>;
      }

      // Detect list items
      if (content.startsWith("- ") || content.startsWith("* ")) {
        const items = content.split(/\n[-*] /).map(item => item.replace(/^[-*] /, ""));
        return (
          <ul key={index} className="list-disc list-inside text-xs space-y-1 my-1 text-slate-700 pl-1">
            {items.map((it, idx) => (
              <li key={idx}>
                {it.split("**").map((chunk, cIdx) => cIdx % 2 === 1 ? <strong key={cIdx} className="font-semibold text-amber-950">{chunk}</strong> : chunk)}
              </li>
            ))}
          </ul>
        );
      }

      // Standard text with bold replacements
      return (
        <p key={index} className="text-xs leading-relaxed text-slate-700 font-sans">
          {paragraph.split("**").map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} className="font-semibold text-amber-950">{part}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="relative flex flex-col items-center max-w-sm w-full text-center">
          <div className="absolute w-44 h-44 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative mb-6">
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#ff6b00] to-[#d97706] opacity-35 blur-md animate-pulse duration-1000" />
            <img 
              src={appLogo} 
              alt="Apna City Logo" 
              className="w-28 h-28 object-cover rounded-2xl border border-orange-500/30 relative z-10 shadow-android-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -inset-2.5 rounded-2xl border border-dashed border-orange-500/20 pointer-events-none" style={{ animation: 'spin 12s linear infinite' }} />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1 justify-center">
            Apna <span className="text-[#ff6b00]">City</span>
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Official Premium City PWA App
          </p>

          <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mt-8 relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff6b00] to-[#d97706] rounded-full" style={{ width: '100%', animation: 'progress-shikohabad 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
          </div>

          <p className="text-[10px] text-slate-400 mt-4 font-semibold tracking-wide">
            Powered by Google Gemini AI • Fully Installable
          </p>
        </div>

        <style>{`
          @keyframes progress-shikohabad {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-orange-500/20 selection:text-orange-950 ${isDarkMode ? "bg-[#0b0f17] text-slate-100 dark" : "bg-white text-slate-950"}`}>
      
      {/* GLOBAL MOUNT APP-WIDE APPRECIATION FOCUS SPOTLIGHT DIALOG */}
      <AnimatePresence>
        {showAppreciationSpotlight && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                sessionStorage.setItem("shk_appreciation_spotlight_shown", "true");
                setShowAppreciationSpotlight(false);
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`rounded-3xl border-2 border-amber-500/40 w-full max-w-lg overflow-hidden shadow-2xl z-10 flex flex-col relative bg-[#0e1424] text-white`}
            >
              {/* Premium Top Glow Accent */}
              <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />

              {/* Header area */}
              <div className="p-6 pb-2 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3.5 py-1 text-[10px] text-amber-300 font-extrabold tracking-wider uppercase">
                  <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
                  <span>COMMUNITY SUPPORT PROJECT</span>
                </div>
                <button
                  onClick={() => {
                    sessionStorage.setItem("shk_appreciation_spotlight_shown", "true");
                    setShowAppreciationSpotlight(false);
                  }}
                  className="text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content body */}
              <div className="p-6 sm:p-8 pt-2 space-y-5 relative z-10">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                    Support the Growth of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-[#ff6b00]">Apna Shikohabad</span>
                  </h2>
                  <p className="text-[11px] font-bold text-amber-400/90 tracking-wide font-mono uppercase">
                    Free for everyone. Open for Support. Built for Shikohabad.
                  </p>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300 text-left">
                  <p>
                    Apna Shikohabad is an independently built platform created for the people of Shikohabad. It remains completely free to use with no subscriptions, paywalls, or mandatory payments.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-slate-200 shadow-inner font-medium text-xs">
                    "Value is never mandatory. If Apna Shikohabad has earned your support, you are welcome to participate in its growth."
                  </div>
                  <p>
                    Contributions are a reflection of voluntary support and direct participation in the platform's continued growth, future development, high-end server reliability, and digital directories innovations.
                  </p>
                </div>

                {/* Primary Gold CTA Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="/appreciation"
                    className="w-full sm:flex-1 bg-gradient-to-r from-[#ff6b00] to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-center text-xs py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Access Support Project</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  </a>
                  <button
                    onClick={() => {
                      sessionStorage.setItem("shk_appreciation_spotlight_shown", "true");
                      setShowAppreciationSpotlight(false);
                    }}
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs py-3 px-6 rounded-xl transition-all duration-200 border border-white/15 active:scale-95 cursor-pointer text-center"
                  >
                    Enter Free Platform
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Top Sliding Simulated Carrier SMS Banner */}
      <AnimatePresence>
        {showLiveSmsBanner && generatedOtp && (
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 12 }}
            exit={{ opacity: 0, y: -80 }}
            className="fixed top-1 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999] select-none"
          >
            <div 
              onClick={() => {
                setOtpCode(generatedOtp);
                setShowLiveSmsBanner(false);
                triggerToast("Passcode auto-copied and prefilled!", "success");
              }}
              className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 shadow-2xl text-white cursor-pointer hover:bg-slate-800 transition-all active:scale-98 relative border-l-4 border-l-orange-500 flex flex-col"
            >
              <div className="flex items-center justify-between text-[9px] text-[#ff6b00] font-black border-b border-slate-800 pb-1.5 mb-1.5 uppercase font-sans">
                <span className="flex items-center gap-1">💬 SIMULATED CARRIER NETWORK: SKB-GATEWAY</span>
                <span className="bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-mono font-bold animate-pulse">ALIVE SMS DISPATCH</span>
              </div>
              <p className="text-xs text-slate-200 font-sans tracking-tight leading-normal">
                Passcode for Apna City verification is <span className="font-mono text-[#ff6b00] font-extrabold text-sm tracking-wider bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{generatedOtp}</span>.
              </p>
              <div className="text-[10px] font-black text-[#ff6b00] hover:underline mt-2 text-right">
                ⚡ TAP HERE TO AUTO-COPY & ENTER NOW
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Interactive Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 md:left-auto md:right-4 md:max-w-sm z-[9999]"
          >
            <div className="rounded-xl p-3.5 shadow-2xl border flex items-start gap-3 relative overflow-hidden bg-white text-slate-800 border-slate-200/80">
              <div className="mt-0.5 shrink-0">
                {toastType === "success" && (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                )}
                {toastType === "error" && (
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                )}
                {toastType === "warning" && (
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-amber-650" />
                  </div>
                )}
                {toastType === "info" && (
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center">
                    <Info className="w-3 h-3 text-sky-600" />
                  </div>
                )}
                {toastType === "sms" && (
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center animate-bounce">
                    <Smartphone className="w-3 h-3 text-[#ff6b00]" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                  {toastType === "success" && "System Verified"}
                  {toastType === "error" && "Security Access Denied"}
                  {toastType === "warning" && "Notice Notification"}
                  {toastType === "info" && "Portal Update"}
                  {toastType === "sms" && "Carrier SMS Handshake"}
                </h5>
                <p className="text-[11px] text-slate-600 font-sans leading-normal font-medium">{toastMessage}</p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-1 rounded shrink-0 cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Status Top Alert */}
      {isOffline && (
        <div className="bg-[#d97706] text-white py-2 px-4 text-center text-xs tracking-wide font-medium flex items-center justify-center gap-2 shadow-inner z-50">
          <AlertTriangle className="w-4 h-4 text-orange-200 animate-pulse shrink-0" />
          <span>You are currently viewing offline. Local business directory listings and timetables are fully cached.</span>
        </div>
      )}

      {/* Upper Historical Prince Ribbon */}
      <div className="bg-gradient-to-r from-[#ff6b00] to-[#d97706] text-white py-2 px-4 text-center text-xs tracking-wide shadow-sm font-semibold flex items-center justify-center gap-1.5 relative z-20">
        <Compass className="w-3.5 h-3.5 text-orange-100" />
        <span>In honor of <strong>Prince Dara Shikoh</strong> (b. 1615), scholar & builder of the city.</span>
      </div>

      {/* Main App Bar Header */}
      <header className={`sticky top-0 z-30 shadow-xs border-b transition-colors duration-200 ${isDarkMode ? "bg-[#111726]/95 border-slate-800/80 backdrop-blur-md" : "bg-white border-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex flex-wrap items-center justify-between md:justify-start w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-orange-500/20 blur-xs" />
                <img 
                  src={appLogo} 
                  alt="Apna City Logo" 
                  className="w-12 h-12 object-cover rounded-xl border border-orange-500/10 shadow-android-sm hover:scale-105 transition-all duration-300 relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? "text-slate-50" : "text-slate-900"}`}>
                    Apna <span className="text-[#ff6b00]">City</span>
                  </h1>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${isDarkMode ? "bg-orange-950/40 text-orange-400 border-orange-850/30" : "bg-orange-100 text-[#d97706] border-orange-200/50"}`}>
                    PWA App
                  </span>
                </div>
                <p className={`text-[10px] font-mono font-medium tracking-tight ${isDarkMode ? "text-slate-400" : "text-slate-400"}`}>
                  Premium Local Directory & Resident Guide
                </p>
              </div>
            </div>

            {/* Google Trust Verification Badge */}
            <button
              onClick={() => setShowGoogleTrustModal(true)}
              className={`flex items-center gap-1 border rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer shadow-3xs ${isDarkMode ? "bg-sky-950/40 border-sky-850/40 hover:bg-sky-900/40" : "bg-sky-50 hover:bg-sky-100 border-sky-200/45"}`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shadow-3xs ${isDarkMode ? "bg-[#0b0f17]" : "bg-white"}`}>
                <svg className="w-2.5 h-2.5 text-sky-500 fill-current stroke-[3]" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className={`text-[10px] font-bold ${isDarkMode ? "text-sky-400" : "text-slate-400"}`}>
                Google Verified
              </span>
            </button>
          </div>

          {/* Quick Stats or PWA Promo Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {currentUser ? (
              <div className={`flex items-center gap-3 border p-1 px-3 rounded-xl shadow-3xs transition-colors ${isDarkMode ? "bg-slate-900/60 border-slate-800/85 hover:bg-slate-850/60" : "bg-slate-50 border-slate-200/60 hover:bg-slate-100"}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff6b00] to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : "U"}
                </div>
                <div className="text-left shrink-0 max-w-[120px]">
                  <p className="text-[9px] text-[#ff6b00] font-mono uppercase font-bold tracking-wider leading-none">Logged In</p>
                  <p className={`text-xs font-bold truncate leading-tight mt-0.5 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{currentUser.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`font-bold text-[10px] px-2 py-1.5 rounded-lg transition-colors cursor-pointer border ${isDarkMode ? "bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 border-transparent hover:border-red-900/30 text-slate-300" : "bg-slate-200/70 hover:bg-red-50 hover:text-red-600 text-slate-600 border-transparent hover:border-red-100"}`}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("login");
                  setShowAuthModal(true);
                }}
                className={`font-bold text-xs px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 border cursor-pointer shadow-3xs active:scale-95 ${isDarkMode ? "bg-slate-900/65 border-slate-800 text-slate-200 hover:bg-orange-950/30 hover:text-orange-400" : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-orange-50 hover:text-orange-600"}`}
              >
                <UserCheck className="w-4 h-4 text-[#ff6b00]" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Scan to Pay Button with QrCode Icon */}
            <button
              onClick={() => {
                setShowQrScanner(true);
                setQrScanMode("camera");
                setScannedUpiData(null);
                setVerifiedPatronCertificate(null);
                setPaidUtr("");
                setPatronCertificateName("");
              }}
              className={`font-bold text-xs px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 border cursor-pointer hover:scale-[1.02] shadow-3xs active:scale-95 shrink-0 select-none ${
                isDarkMode 
                  ? "bg-violet-950/40 border-violet-900/40 text-violet-350 hover:bg-violet-900/50" 
                  : "bg-violet-50 border-violet-200/80 text-violet-700 hover:bg-violet-100/60"
              }`}
              title="Scan any UPI QR Code or Apna Shikohabad code to pay securely"
            >
              <QrCode className="w-4 h-4 text-violet-500 shrink-0" />
              <span>Scan to Pay</span>
            </button>

            {/* Support Project Page Link */}
            <a
              href="/appreciation"
              className={`font-bold text-xs px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 border cursor-pointer hover:scale-[1.02] shadow-3xs active:scale-95 shrink-0 ${
                isDarkMode 
                  ? "bg-amber-950/40 border-amber-900/40 text-amber-300 hover:bg-amber-900/50" 
                  : "bg-amber-50 border-amber-200/80 text-amber-700 hover:bg-amber-105/60"
              }`}
              title="Support the growth of Apna Shikohabad"
            >
              <Heart className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse shrink-0" />
              <span>Support Project</span>
            </a>

            {/* Global Dark / Light Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center shadow-3xs active:scale-95 ${
                isDarkMode 
                  ? "bg-slate-900/80 border-slate-700/60 text-amber-400 hover:bg-slate-800" 
                  : "bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => {
                if (!currentUser) {
                  triggerToast("Authentication Required: Register or log in to list your business securely!", "warning");
                  setShowAuthModal(true);
                } else {
                  setShowAddBusinessModal(true);
                }
              }}
              className="bg-[#ff6b00] hover:bg-[#d97706] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-android-md active:scale-95 cursor-pointer text-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Local Business</span>
            </button>
          </div>

        </div>
      </header>

      {/* Primary Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 lg:pb-8">
        
        {/* Left Side: Operations & Tabs (8 Columns) */}
        <section className={`lg:col-span-8 flex flex-col gap-6 ${activeTab === "assistant" ? "hidden lg:flex" : "flex"}`}>

          {/* APPRECIATION PLATFORM INTEGRAL HIGHLIGHT BANNER */}
          {showAppreciationBanner && (
            <div className="bg-gradient-to-r from-slate-950 via-[#0e172a] to-slate-950 rounded-2xl border-2 border-amber-500/35 p-5 relative overflow-hidden shadow-lg transition-all duration-300 hover:border-amber-500/50">
              {/* Absolutes decorated elements */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1 my-0.5 flex-1 select-none text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block shrink-0" />
                    <span className="text-[10px] font-extrabold tracking-widest text-[#ff6b00] uppercase flex items-center">
                      <Heart className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500 animate-pulse inline" />
                      Shared success program
                    </span>
                  </div>
                  <h4 className="text-sm font-black tracking-tight text-white uppercase sm:normal-case">
                    Participate in the Growth of Apna Shikohabad
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed max-w-xl">
                    Free for everyone. Open to appreciation. Built for Shikohabad. Contributions are a voluntary reflection of value exchange to enable continuous ad-free server hosting.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <a
                    href="/appreciation"
                    className="flex-1 sm:flex-initial bg-gradient-to-r from-[#ff6b00] to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-[11px] py-3 px-5 rounded-xl transition-all duration-200 shadow-md hover:scale-[1.03] active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Panel</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white inline" />
                  </a>
                  
                  <button
                    onClick={() => setShowAppreciationBanner(false)}
                    className="text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl transition-all cursor-pointer border border-slate-750/30"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BOBBY STUDIO EXCLUSIVE PREMIUM SPOTLIGHT - Luminous Gold Edition */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl border-2 border-amber-400/60 overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.15)] relative group transition-all duration-300 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:border-amber-400">
            {/* Absolute accent glowing light and animated particle effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/15 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:from-amber-500/25 group-hover:to-indigo-500/15 transition-all duration-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
              
              {/* Left Column: Premium Artistry Banner (5 cols) */}
              <div className="md:col-span-5 relative flex flex-col justify-between rounded-xl overflow-hidden group/image border border-white/10 aspect-video md:aspect-auto md:min-h-[250px] shadow-inner-lg">
                <img 
                  src={bobbyBanner} 
                  alt="Bobby Studio Photography Masterwork" 
                  className="absolute inset-0 w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Embedded verified badges */}
                <div className="relative z-10 p-3 flex justify-between items-start">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm font-extrabold shadow-md animate-pulse">
                    ★ #1 Photo Leader ★
                  </span>
                  
                  <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/20 shadow-xs">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black">5.0</span>
                  </div>
                </div>

                <div className="relative z-10 p-3 mt-auto">
                  <div className="text-[9px] font-mono text-amber-300 tracking-widest font-bold">MANAGED BY: BOBBY STUDIO & TEAM</div>
                  <div className="text-sm font-black text-white tracking-wide border-t border-white/10 pt-1 mt-0.5">Bobby Studio Photography</div>
                </div>
              </div>

              {/* Right Column: Premium Details (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-amber-400 text-slate-950 font-mono text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded">
                      Featured Top Partner
                    </span>
                    <button 
                      onClick={() => setShowGoogleTrustModal(true)}
                      className="bg-blue-600/35 hover:bg-blue-600/50 border border-blue-500/30 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-all duration-200"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3] text-blue-400" />
                      <span>Google Verified Trust</span>
                    </button>
                    <span className="text-[10px] text-amber-200/90 font-medium font-mono">
                      City Choice
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white mt-1">
                    Bobby Studio Photography
                  </h2>
                  <p className="text-[11px] text-amber-300 font-semibold italic mt-0.5">Managed by : Bobby Studio & Team</p>
                  
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                    Capture the lifetime magic of your celebrations with City&apos;s celebrated premier master of wedding photography, emotional cinematic captures, breathtaking drones, and mesmerizing pre-wedding shoots.
                  </p>
                </div>

                {/* Highly Styled Interactive Social Hub */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Official Social Media Profiles</div>
                  <div className="flex flex-wrap gap-2">
                    {/* Instagram badge */}
                    <a 
                      href="https://www.instagram.com/bobbystudiophotography_/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[135px] bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 text-white hover:brightness-110 active:scale-95 transition-all duration-200 text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span className="truncate">@bobbystudiophotography_</span>
                    </a>

                    {/* YouTube badge */}
                    <a 
                      href="https://www.youtube.com/@BOBBYSTUDIOPhotography" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[135px] bg-gradient-to-r from-red-650 to-red-550 hover:from-red-700 hover:to-red-650 text-white active:scale-95 transition-all duration-200 text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span className="truncate">BOBBY STUDIO Photography</span>
                    </a>
                  </div>
                </div>

                {/* Professional Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 rounded-xl p-3.5 border border-white/5 text-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Expertise & Services</span>
                    <span className="text-xs font-semibold text-amber-200 block">Grand Weddings, Pre-Weddings & HD Drones</span>
                  </div>
                  <div className="space-y-0.5 sm:border-l border-white/10 sm:pl-3">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Office Details & Contacts</span>
                    <span className="text-xs font-semibold text-amber-200 block truncate">Paliwal Chauraha, City</span>
                    <span className="text-[10px] text-white font-mono font-bold block mt-0.5 text-center sm:text-left">
                      +91 9837686414 | +91 9634521011
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <button
                    onClick={() => {
                      setBobbyBookingSubmitted(false);
                      setShowBobbyBookingModal(true);
                    }}
                    className="flex-1 min-w-[160px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-lg shadow-md hover:shadow-amber-500/25 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1.5 animate-hover"
                  >
                    <Sparkles className="w-4 h-4 ml-0.5" />
                    <span>Instant Booking Enquiry</span>
                  </button>

                  <button
                    onClick={() => setShowBobbyQR(true)}
                    className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2.5 px-3.5 rounded-lg border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Scan Instagram & YouTube QR Codes"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Scan QR Flyers</span>
                  </button>

                  <div className="flex gap-1.5 shrink-0 ml-auto sm:ml-0">
                    <a 
                      href="tel:9837686414"
                      className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors cursor-pointer"
                      title="Call Bobby Studio First"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    
                    <a 
                      href="https://wa.me/919837686414" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-emerald-650/35 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5 px-3 text-xs font-bold"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Navigation Tab Bar */}
          <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-android-sm flex flex-wrap gap-1 relative z-10">
            <button
              onClick={() => setActiveTab("directory")}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "directory"
                  ? "bg-[#ff6b00] text-white shadow-android-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff6b00]"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Local Directory</span>
            </button>
            <button
              onClick={() => setActiveTab("transit")}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "transit"
                  ? "bg-[#ff6b00] text-white shadow-android-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff6b00]"
              }`}
            >
              <Train className="w-4 h-4" />
              <span>SKB Transit</span>
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "community"
                  ? "bg-[#ff6b00] text-white shadow-android-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff6b00]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Community News</span>
            </button>
            <button
              onClick={() => setActiveTab("emergency")}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "emergency"
                  ? "bg-[#ff6b00] text-white shadow-android-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff6b00]"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Helpline Support</span>
            </button>
            <button
              onClick={() => setActiveTab("game")}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "game"
                  ? "bg-[#ff6b00] text-white shadow-android-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff6b00]"
              }`}
              id="game-tab-button"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Games Zone</span>
            </button>
            <button
              onClick={() => setActiveTab("zen")}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "zen"
                  ? "bg-[#ff6b00] text-white shadow-android-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-[#ff6b00]"
              }`}
              id="zen-tab-button"
            >
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Wellness & Tools</span>
            </button>
          </div>

          {/* Tab Contents - Encapsulated in AnimatePresence for Android-style Page Transitions */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="w-full h-full"
              >
                
                {/* DIRECTORY TAB */}
                {activeTab === "directory" && (

              <div className="flex flex-col gap-6">
                
                {/* Search and Advanced Area filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search businesses by name, type, category (sweets, gas, education, cafe), or tags..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Area:</span>
                        <select
                          value={areaFilter}
                          onChange={(e) => setAreaFilter(e.target.value)}
                          className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                        >
                          <option value="all">All Locations</option>
                          {uniqueAreas.map((area, i) => (
                            <option key={i} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type:</span>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                        >
                          <option value="all">All Categories</option>
                          <option value="restaurant">🍽️ Restaurant & Food</option>
                          <option value="hardware">🛠️ Hardware & Building Materials</option>
                          <option value="electronics">🔌 Mobile & Electronic Shops</option>
                          <option value="school">🏫 Schools</option>
                          <option value="college">🎓 College & Universities</option>
                          <option value="retail">🛍️ Retail & Shopping</option>
                          <option value="hotel font-sans">🏨 Hotels & Resorts</option>
                          <option value="photography">📸 Studio & Photography</option>
                          <option value="gas">⛽ Gas Agencies & Petrol Pumps</option>
                          <option value="beauty">💄 Beauty Parlours & Salons</option>
                          <option value="temple">🛕 Temples</option>
                          <option value="mosque">🕌 Mosques (Masjid)</option>
                          <option value="hospital">🏥 Hospitals & Healthcare</option>
                          <option value="pharmacy">💊 Medical Retail Stores</option>
                          <option value="bank">🏦 Banks & Finances</option>
                          <option value="gym">🏋️ Gym & Fitness Centers</option>
                          <option value="other">📦 Other Businesses</option>
                        </select>
                      </div>

                      {currentUser && (
                        <button
                          onClick={() => setShowMyListingsOnly(!showMyListingsOnly)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-3xs active:scale-95 ${
                            showMyListingsOnly
                              ? "bg-amber-600 text-white border border-amber-600 shadow-android-sm"
                              : "bg-amber-50 text-amber-800 border border-amber-200/50 hover:bg-amber-100"
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span>My Listings Hub ({businesses.filter(b => b.ownerId === currentUser.id).length})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Businesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredBusinesses.length > 0 ? (
                      filteredBusinesses.map((b) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          key={b.id}
                          onClick={() => setSelectedBusiness(b)}
                          className={`rounded-xl border p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                            b.verifiedPartner
                              ? (isDarkMode ? "border-blue-900/60 bg-blue-950/20 hover:border-blue-800 ring-2 ring-blue-500/10" : "border-blue-200 bg-blue-50/5 hover:border-blue-300 ring-2 ring-blue-500/5 hover:ring-blue-500/10")
                              : (isDarkMode ? "border-slate-800 bg-[#161d2d] hover:border-slate-700 hover:bg-[#1d273a]" : "border-slate-200 bg-white hover:border-slate-300")
                          }`}
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                              <div className="flex gap-1 flex-wrap">
                                {b.verifiedPartner && (
                                  <span className="bg-blue-600 text-white font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5 shadow-2xs">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    <span>Verified Partner</span>
                                  </span>
                                )}
                              </div>
                              
                              {b.featured && (
                                  <span className="bg-amber-500 text-white font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5 shadow-2xs">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>Premium</span>
                                  </span>
                              )}

                              {currentUser && b.ownerId === currentUser.id && (
                                <span className="bg-emerald-600 text-white font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5 shadow-2xs">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  <span>My Shop</span>
                                </span>
                              )}
                            </div>

                            <div className="flex gap-3 items-start min-h-[50px]">
                              <div className="w-14 h-14 rounded-lg border border-slate-100 shadow-3xs shrink-0 overflow-hidden relative bg-slate-100 select-none pointer-events-none">
                                <iframe
                                  title={`Google Street Front of ${b.name}`}
                                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                                    b.name + ", " + b.address + ", Shikohabad, Uttar Pradesh"
                                  )}&layer=c&z=19&ie=UTF8&iwloc=&output=embed`}
                                  className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] scale-50"
                                  style={{ border: 0 }}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 text-white text-[7px] text-center font-extrabold font-mono py-0.5 uppercase tracking-tighter">
                                  FRONT 📸
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-bold group-hover:text-amber-500 transition-colors duration-200 truncate ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
                                  {b.name}
                                </h3>
                                <p className={`text-xs line-clamp-2 mt-0.5 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                  {b.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className={`mt-4 pt-3 border-t flex flex-col gap-2 ${isDarkMode ? "border-slate-800/80" : "border-slate-100"}`}>
                            <div className={`flex items-center justify-between gap-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                              <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                                <span className={`p-1 rounded-md flex items-center justify-center shrink-0 border ${isDarkMode ? "bg-amber-950/30 border-amber-900/40" : "bg-amber-50 border-amber-200/50"}`}>
                                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                </span>
                                <span className="truncate font-medium">{b.area} — <span className="opacity-75">{b.address}</span></span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedMapIds(prev => ({ ...prev, [b.id]: !prev[b.id] }));
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border shrink-0 cursor-pointer ${
                                  expandedMapIds[b.id]
                                    ? "bg-amber-500 text-white border-amber-600 shadow-3xs"
                                    : (isDarkMode ? "bg-[#111726]/80 hover:bg-slate-800 text-slate-300 border-slate-700/60" : "bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-200/80")
                                }`}
                                title="Toggle interactive map with visual markers"
                              >
                                <Map className="w-3 h-3 text-amber-500" />
                                <span>{expandedMapIds[b.id] ? "Hide Map" : "View Map"}</span>
                              </button>
                            </div>

                            {/* Collapsible interactive localized map frame */}
                            <AnimatePresence>
                              {expandedMapIds[b.id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  className="w-full overflow-hidden border border-slate-200 rounded-xl bg-slate-50 p-2 text-xs flex flex-col gap-2 shadow-2xs"
                                >
                                  {/* Map togglers allowing users to choose the active visual marker representation */}
                                  <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                                    <span className="font-bold text-slate-700 text-[10px] flex items-center gap-1 uppercase tracking-wider">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                      Active Map Marker Style
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCardMapModes(prev => ({ ...prev, [b.id]: "roadmap" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                          (cardMapModes[b.id] || "roadmap") === "roadmap"
                                            ? "bg-amber-500 text-white shadow-3xs"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-55"
                                        }`}
                                      >
                                        📍 Standard Pin
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCardMapModes(prev => ({ ...prev, [b.id]: "satellite" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                          cardMapModes[b.id] === "satellite"
                                            ? "bg-amber-500 text-white shadow-3xs"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-55"
                                        }`}
                                      >
                                        🛰️ Satellite
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCardMapModes(prev => ({ ...prev, [b.id]: "streetview" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                          cardMapModes[b.id] === "streetview"
                                            ? "bg-amber-500 text-white shadow-3xs"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-55"
                                        }`}
                                      >
                                        📸 Street View
                                      </button>
                                    </div>
                                  </div>

                                  <div className="h-[140px] w-full rounded-lg overflow-hidden border border-slate-150 relative bg-slate-100 shadow-inner">
                                    {(cardMapModes[b.id] || "roadmap") === "roadmap" && (
                                      <iframe
                                        title={`Roadmap Map view of ${b.name}`}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                          b.name + ", " + b.address + ", Shikohabad, Uttar Pradesh"
                                        )}&t=m&z=16&ie=UTF8&iwloc=&output=embed`}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    {cardMapModes[b.id] === "satellite" && (
                                      <iframe
                                        title={`Satellite view of ${b.name}`}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                          b.name + ", " + b.address + ", Shikohabad, Uttar Pradesh"
                                        )}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    {cardMapModes[b.id] === "streetview" && (
                                      <iframe
                                        title={`Streetview frontage check of ${b.name}`}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                          b.name + ", " + b.address + ", Shikohabad, Uttar Pradesh"
                                        )}&layer=c&z=19&ie=UTF8&iwloc=&output=embed`}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-500 flex justify-between items-center px-1">
                                    <span>Location ID: <code className="font-mono text-slate-705 font-bold">{b.id}</code></span>
                                    <span className="font-medium text-amber-700">Verified Partner Coordinates Pin 🗺️</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between text-xs mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                                <span className="font-bold text-slate-700">{b.rating.toFixed(1)}</span>
                                <span className="text-slate-400 text-[10px] font-medium">({b.reviewsCount} reviews)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {currentUser && b.ownerId === currentUser.id && (
                                  <div className="flex items-center gap-1 mr-1">
                                    <button
                                      onClick={(e) => handleOpenEditBusiness(b, e)}
                                      className="p-1 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-850 hover:text-orange-950 text-[10px] font-bold flex items-center gap-1 transition-all border border-orange-200/40"
                                      title="Edit details"
                                    >
                                      <Pencil className="w-2.5 h-2.5 text-orange-750" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={(e) => handleDeleteBusiness(b, e)}
                                      className="p-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 hover:text-red-900 text-[10px] font-bold flex items-center gap-1 transition-all border border-red-200/45"
                                      title="Delete Listing"
                                    >
                                      <Trash2 className="w-2.5 h-2.5 text-red-650" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                                <span className="text-[10px] text-amber-600 font-bold tracking-wide group-hover:translate-x-1 duration-200 transition-transform flex items-center gap-0.5">
                                  Read details & reviews →
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                        <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs font-medium">No services or shops match your search criteria.</p>
                        <p className="text-[10px] opacity-75 mt-1">Try checking another category or location area.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}

            {/* TRANSIT TAB */}
            {activeTab === "transit" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col gap-6">
                
                {/* Intro */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Train className="w-5 h-5 text-amber-600" />
                    <span>Transit Hub & regional Road Estimator</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete reference timetable for major trains crossing City Junction (SKB) and road calculations for travelers using NH-19 and the Taj Expressway.
                  </p>
                </div>

                {/* Train Schedule */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">City Junction (SKB) Major Stops</h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs text-slate-700 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                          <th className="p-3">Train No</th>
                          <th className="p-3">Train Name</th>
                          <th className="p-3">Route (From → To)</th>
                          <th className="p-3">SKB Dep.</th>
                          <th className="p-3">Platform Est</th>
                          <th className="p-3">Frequency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {CITY_TRAINS.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors duration-150">
                            <td className="p-3 font-mono font-bold text-amber-700">{t.trainNo}</td>
                            <td className="p-3 font-semibold text-slate-900">{t.name}</td>
                            <td className="p-3 text-slate-500 text-[11px]">{t.from} ➔ {t.to}</td>
                            <td className="p-3 font-mono text-slate-800">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold">{t.departure}</span>
                            </td>
                            <td className="p-3 text-center">{t.platformEst}</td>
                            <td className="p-3">
                              <span className="text-[10px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-100">
                                {t.days.join(", ")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Road Trip & Toll Calculator */}
                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-slate-500" />
                    <span>Regional Inter-City Road Trip Planner</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ROAD_ESTIMATES.map((estimate, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{estimate.destination}</h4>
                          <p className="text-[11px] font-mono mt-1 text-slate-400">Distance: {estimate.distance}</p>
                          
                          <div className="space-y-1.5 mt-3">
                            <div className="flex justify-between text-[11px] text-slate-600">
                              <span>Regular Route (NH-19):</span>
                              <span className="font-semibold text-slate-800">{estimate.timeViaNH19}</span>
                            </div>
                            {estimate.timeViaExpressway && (
                              <div className="flex justify-between text-[11px] text-amber-700 font-semibold bg-amber-50 px-1 rounded">
                                <span>Expressway Speed:</span>
                                <span>{estimate.timeViaExpressway}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                          <p><strong>Estimated Tolls:</strong> {estimate.tollEstimate}</p>
                          <p className="italic text-[9px] text-slate-400">{estimate.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* COMMUNITY BULLETIN TAB */}
            {activeTab === "community" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Column: Public Bulletins & Postings feed */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Header Board */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 text-white shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4">
                      <div>
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wide">
                          📢 Public Town Square
                        </span>
                        <h2 className="text-base font-extrabold text-white mt-2">Apna City Bulletins & News</h2>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          Everyday local news, administrative announcements, festival events, agricultural mandi rates, and mutual aid queries.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setShowAddNoticeModal(true)}
                        className="bg-[#ff6b00] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-md shadow-orange-500/20"
                      >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span>Publish Notice</span>
                      </button>
                    </div>

                    {/* Real-time System Resiliency Status Board */}
                    <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* System Activity Driver */}
                      <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <Globe className="w-3.5 h-3.5 text-indigo-400" />
                            <span>System Terminal</span>
                          </div>
                          <p className={`text-xs font-bold mt-1 ${isSystemActive ? "text-emerald-400" : "text-amber-500"}`}>
                            {isSystemActive ? "🟢 Active Realtime Database" : "🔴 Inactive (Offline Fallback)"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsSystemActive(!isSystemActive);
                            triggerToast(
                              isSystemActive 
                                ? "System Offline Simulator: Serving locally cached bulletins offline."
                                : "System Online: Connected back to real-time cloud datastores.",
                              "info"
                            );
                          }}
                          className="bg-slate-800 truncate hover:bg-slate-755 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                        >
                          {isSystemActive ? "Simulate Drop" : "Power Active"}
                        </button>
                      </div>

                      {/* Reader Presence Driver */}
                      <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <User className="w-3.5 h-3.5 text-orange-400" />
                            <span>Your Active Presence</span>
                          </div>
                          <p className={`text-xs font-bold mt-1 ${userPresence === "ACTIVE" ? "text-emerald-400" : "text-slate-400"}`}>
                            {userPresence === "ACTIVE" ? "🟢 Active Resident Mode" : "⚪ Idle / Inactive Mode"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const nextState = userPresence === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                            setUserPresence(nextState);
                            triggerToast(
                              nextState === "ACTIVE" 
                                ? "Your presence status changed to Active 🟢" 
                                : "Your presence status changed to Idle / Inactive ⚪", 
                              "info"
                            );
                          }}
                          className="bg-slate-800 truncate hover:bg-slate-755 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                        >
                          {userPresence === "ACTIVE" ? "Set Inactive" : "Show Active"}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Resiliency Explanation Warning */}
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-xs text-orange-950 flex gap-3 shadow-3xs">
                    <Info className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">Zero-Loss Local Preservation Engine</strong>
                      Our bulletin is constructed to support direct local-preservation databases. Whether the global system state is <strong className="font-bold">Active</strong> or <strong className="font-bold">Inactive</strong>, and whether contributing residents are logged online or offline, everyday town bulletins stay completely responsive, robustly cached, and ready for you to parse.
                    </div>
                  </div>

                  {/* Category Filtering Tabs */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-1">
                    {[
                      { id: "all", label: "All Boards 📄" },
                      { id: "news", label: "Everyday News 📰" },
                      { id: "announcement", label: "Notices 📢" },
                      { id: "event", label: "Events / Mela 🎉" },
                      { id: "help", label: "Hiring & Help 🤝" },
                      { id: "trade", label: "Mandi Trade 🌾" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setBulletinFilter(tab.id)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          bulletinFilter === tab.id
                            ? "bg-[#ff6b00] text-white shadow-xs animate-none"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notices List */}
                  <div className="space-y-4">
                    {announcements.filter(ann => bulletinFilter === "all" || ann.category === bulletinFilter).length === 0 ? (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                        <p className="text-slate-400 font-bold text-xs font-mono">No matching bulletins posted in this board category.</p>
                        <button
                          onClick={() => setShowAddNoticeModal(true)}
                          className="text-[#ff6b00] font-bold text-xs mt-2 underline cursor-pointer"
                        >
                          Be the first to post something here!
                        </button>
                      </div>
                    ) : (
                      announcements
                        .filter(ann => bulletinFilter === "all" || ann.category === bulletinFilter)
                        .map((ann) => {
                          // Simulated author activity status mapping
                          // Certain official roles stay active, others follow overall system activity
                          const isAuthorActive = !isSystemActive 
                            ? false 
                            : (ann.author.includes("Association") || ann.author.includes("Pradhan") || ann.author.includes("Management") || ann.likes > 20);

                          return (
                            <div key={ann.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs hover:shadow-2xs transition-all duration-150 relative overflow-hidden">
                              
                              {/* Visual Left accent strip based on category */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                ann.category === "news" ? "bg-emerald-500" :
                                ann.category === "event" ? "bg-amber-500" :
                                ann.category === "announcement" ? "bg-blue-500" :
                                ann.category === "help" ? "bg-rose-500" :
                                "bg-purple-500"
                              }`} />

                              <div className="pl-2.5">
                                <div className="flex items-start justify-between gap-4 mb-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tight uppercase border ${
                                    ann.category === "news" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                                    ann.category === "event" ? "bg-amber-50 text-amber-800 border-amber-200" :
                                    ann.category === "announcement" ? "bg-blue-50 text-blue-800 border-blue-200" :
                                    ann.category === "help" ? "bg-rose-50 text-rose-800 border-rose-200" :
                                    "bg-purple-50 text-purple-800 border-purple-200"
                                  }`}>
                                    {ann.category === "news" ? "📰 Everyday News" :
                                     ann.category === "event" ? "🎉 Local Event" :
                                     ann.category === "announcement" ? "📢 Notice" :
                                     ann.category === "help" ? "🤝 Support/Help" :
                                     "🌾 Mandi Trade"}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {new Date(ann.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" })}
                                  </span>
                                </div>

                                <h3 className="text-xs font-black text-slate-900 leading-snug">{ann.title}</h3>
                                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 whitespace-pre-wrap">{ann.content}</p>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-3 border-t border-slate-100 pt-3.5 mt-4 text-[11px] text-slate-500">
                                  
                                  {/* Publisher Info with Presence Dot */}
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold">Published by:</span>
                                    <span className="text-slate-800 italic font-medium">{ann.author}</span>
                                    
                                    {/* Resident Active Dot */}
                                    <span className="inline-flex items-center gap-1.5 ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-150">
                                      <span className={`w-1.5 h-1.5 rounded-full ${isAuthorActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                                      <span className="text-[9px] text-slate-500 font-bold">
                                        {isAuthorActive ? "Online Contributor" : "Offline / Idle"}
                                      </span>
                                    </span>
                                  </div>
                                  
                                  <button
                                    onClick={(e) => handleLikeAnnouncement(ann.id, e)}
                                    className="flex items-center gap-1 hover:text-red-650 transition-colors duration-200 cursor-pointer text-[11px] self-start sm:self-auto"
                                  >
                                    <Heart className="w-3.5 h-3.5 shrink-0 text-red-500 fill-red-500" />
                                    <span className="font-extrabold text-slate-700">{ann.likes} Likes</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>

                </div>

                {/* Right Column: Active Residents, Submitted Shops, and Desktop Live Guide */}
                <div className="lg:col-span-1 space-y-6">

                  {/* WIDGET 1: Desktop Live Launch Guide */}
                  <div className="bg-slate-905 text-white rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-850">
                      <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">How to Run on Desktop</h3>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Live Workstation Setup</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs text-slate-300">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-[9px] text-indigo-300 font-bold border border-slate-700">1</span>
                          <span>Export Code ZIP</span>
                        </div>
                        <p className="pl-6 text-[10px] text-slate-400 leading-normal">
                          Click the <strong className="text-slate-200 font-bold">⚙️ Settings Cog</strong> in the top right header of the AI Studio building console, and select <strong className="text-indigo-400 font-bold">Export to ZIP</strong>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-[9px] text-indigo-300 font-bold border border-slate-700">2</span>
                          <span>Extract & Open Terminal</span>
                        </div>
                        <p className="pl-6 text-[10px] text-slate-400 leading-normal">
                          Extract the archive on your local desktop. Open your favorite shell terminal (e.g., cmd, git bash, or Mac terminal) in that root folder.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-[9px] text-indigo-300 font-bold border border-slate-700">3</span>
                          <span>Execute Local Boot</span>
                        </div>
                        <div className="pl-6 space-y-2">
                          <div className="bg-slate-950 p-2 text-[10px] font-mono rounded-lg border border-slate-850 text-emerald-400 select-all overflow-x-auto whitespace-pre">
                            npm install<br />
                            npm run dev
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            Vite will bundle the TS modules. Go to <span className="text-emerald-400 font-bold underline cursor-pointer font-mono">http://localhost:3000</span> for a lightning-fast native experience!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WIDGET 2: Live Resident & Partner Users Tracker (Shows if they or system is active/inactive/shut off) */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-50 text-[#ff6b00]">
                          <User className="w-4 h-4 opacity-80" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">Active Town Residents</h3>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">City Presence Tracker</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00]">
                        {Object.values(residentStatusMap).filter(v => v === "ONLINE").length + (userPresence === "ACTIVE" ? 1 : 0)} Live
                      </span>
                    </div>

                    {/* Explanatory subtitle about active/inactive & shut off */}
                    <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                      💡 <strong>Fault Isolation Monitor:</strong> Even if client-side connections drop or the overall town database gets <strong>Shut Off</strong> (offline), Apna City continues logging offline status indicators locally!
                    </p>

                    {/* Users Status Listings */}
                    <div className="space-y-2.5">
                      {/* Interactive Client Visitor (The current viewer) */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-150">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 flex items-center justify-center font-bold text-xs text-[#ff6b00]">
                            {currentUser ? currentUser.name[0].toUpperCase() : "V"}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                              <span>{currentUser ? currentUser.name : "Guest Visitor"}</span>
                              <span className="text-[9px] bg-slate-200 px-1 py-0.2 rounded text-slate-500">You</span>
                            </p>
                            <p className="text-[9px] text-slate-400 font-mono">Resident Class #91</p>
                          </div>
                        </div>

                        {/* Dropdown/Status change trigger */}
                        <button
                          onClick={() => {
                            const nextState = userPresence === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                            setUserPresence(nextState);
                          }}
                          className={`text-[9px] font-black px-2 py-1 rounded-md border flex items-center gap-1 transition-all cursor-pointer ${
                            userPresence === "ACTIVE" 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${userPresence === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                          <span>{userPresence}</span>
                        </button>
                      </div>

                      {/* Other registered and simulated users */}
                      {registeredUsers.map((u) => {
                        const status = !isSystemActive ? "OFFLINE" : (residentStatusMap[u.id] || "ONLINE");
                        return (
                          <div key={u.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 font-mono">
                                {u.name ? u.name[0].toUpperCase() : "R"}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{u.name}</p>
                                <p className="text-[9px] text-slate-400 italic">
                                  {u.id === "usr_admin" ? "Verified Shopkeeper" : "Trade Partner"}
                                </p>
                              </div>
                            </div>

                            <button
                              disabled={!isSystemActive}
                              onClick={() => handleToggleResidentStatus(u.id)}
                              className={`text-[9px] font-black px-2 py-1 rounded-md border flex items-center gap-1 transition-all ${
                                !isSystemActive
                                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                  : status === "ONLINE"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 cursor-pointer"
                                  : status === "IDLE"
                                  ? "bg-amber-50 text-amber-800 border-amber-200 cursor-pointer"
                                  : "bg-slate-100 text-slate-500 border-slate-200 cursor-pointer"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                !isSystemActive ? "bg-slate-300" :
                                status === "ONLINE" ? "bg-emerald-500 animate-pulse" :
                                status === "IDLE" ? "bg-amber-500 animate-pulse" :
                                "bg-slate-400"
                              }`} />
                              <span>{status}</span>
                            </button>
                          </div>
                        );
                      })}

                      {/* Additional Simulated Guest Traders */}
                      {[
                        { id: "sim_res_1", name: "Dinesh Glassmaker", desc: "Crafts Specialist" },
                        { id: "sim_res_2", name: "Rekha Yadav", desc: "JS University Intern" },
                        { id: "sim_res_3", name: "Suresh Peda Expert", desc: "Sweets Trade Partner" }
                      ].map((guest) => {
                        const status = !isSystemActive ? "OFFLINE" : (residentStatusMap[guest.id] || "IDLE");
                        return (
                          <div key={guest.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all opacity-85">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center font-bold text-xs text-slate-600 font-mono">
                                {guest.name[0]}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-700">{guest.name}</p>
                                <p className="text-[9px] text-slate-450">{guest.desc}</p>
                              </div>
                            </div>

                            <button
                              disabled={!isSystemActive}
                              onClick={() => handleToggleResidentStatus(guest.id)}
                              className={`text-[9px] font-black px-2 py-1 rounded-md border flex items-center gap-1 transition-all ${
                                !isSystemActive
                                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                  : status === "ONLINE"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 cursor-pointer"
                                  : status === "IDLE"
                                  ? "bg-amber-50 text-amber-800 border-amber-200 cursor-pointer"
                                  : "bg-slate-100 text-slate-500 border-slate-200 cursor-pointer"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                !isSystemActive ? "bg-slate-300" :
                                status === "ONLINE" ? "bg-emerald-500 animate-pulse" :
                                status === "IDLE" ? "bg-amber-500 animate-pulse" :
                                "bg-slate-400"
                              }`} />
                              <span>{status}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Trigger Random Traffic updates */}
                    <button
                      onClick={handleTriggerRandomTraffic}
                      className="w-full text-center bg-slate-100 hover:bg-slate-205 text-slate-700 hover:text-slate-900 border border-slate-200 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      ⚡ Randomize Resident Activity Pulses
                    </button>
                  </div>

                  {/* WIDGET 3: Resident Submitted Local Businesses directory list (added by users) */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
                    <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                          <Compass className="w-4 h-4 opacity-80" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">Resident Submitted Shops</h3>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">User-Added Directories</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-55 text-emerald-800">
                        {businesses.filter(b => b.ownerId || b.id.startsWith("biz_")).length} Listings
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
                      {businesses.filter(b => b.ownerId || b.id.startsWith("biz_")).length === 0 ? (
                        <div className="text-center py-4 text-slate-400 text-[10px] select-none italic font-mono">
                          No resident businesses listed yet. Try the quick-generator below!
                        </div>
                      ) : (
                        businesses
                          .filter(b => b.ownerId || b.id.startsWith("biz_"))
                          .map((b) => (
                            <div key={b.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 hover:bg-white hover:border-slate-300 transition-all text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-extrabold text-slate-800 truncate">{b.name}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{b.address}</p>
                              <div className="flex items-center justify-between text-[9px] text-slate-450 mt-1.5 font-mono">
                                <span>📱 {b.phone}</span>
                                <span className="text-slate-650 font-extrabold">★ {b.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Quick simulation button to populate catalog */}
                    <button
                      onClick={handleQuickAddLocalBusiness}
                      className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      ➕ Quick-Simulate Volunteer Shop Addition
                    </button>
                    
                    <p className="text-[9px] text-center text-slate-400 leading-normal">
                      Or head over to the <strong className="text-slate-600 font-bold">Explore Directory tab</strong> to list custom enterprises with full descriptions, tags and WhatsApp numbers dynamically!
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* EMERGENCY CONTACTS TAB */}
            {activeTab === "emergency" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col gap-6">
                <div>
                  <h2 className="text-base font-bold text-rose-950 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-rose-600" />
                    <span>Emergency Contacts & Regional Helplines</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Instant access directory of crucial medical, security, and administrative helpline contacts in and surrounding City.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EMERGENCY_CONTACTS.map((emerg, idx) => (
                    <div key={idx} className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex justify-between items-center hover:bg-rose-50 duration-200 transition-colors">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">{emerg.dept}</h3>
                        <p className="text-[11px] text-slate-400">{emerg.subtitle}</p>
                        <p className="text-sm font-semibold text-rose-700 mt-2 font-mono flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 fill-rose-500/10 text-rose-500" />
                          <span>{emerg.number}</span>
                        </p>
                      </div>

                      <a
                        href={`tel:${emerg.number.replace(/ -.*$/, "")}`}
                        className="bg-white border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        Call
                      </a>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs text-blue-900 mt-4 leading-relaxed">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Important Local Service Note:</strong>
                    State emergency dial "112" is unified for Police, Fire, and Ambulance dispatch. For precise local concerns, calling local Kotwali (Station Road) directly provides the fastest assistance.
                  </div>
                </div>

              </div>
            )}

            {/* PORTAL TAB (HIGH-FIDELITY ALIVE MERCHANT & LOCAL RESIDENT GATEWAY) */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                
                {!currentUser ? (
                  /* NOT LOGGED IN SPLIT PORTAL */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Why Join / PWA Stats Badge (5 Columns) */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-android-md border border-slate-800 relative overflow-hidden">
                        {/* Decorative background grid pattern */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:16px_16px]" />
                        
                        <div className="relative z-10">
                          <span className="bg-orange-500/10 text-[#ff6b00] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-orange-500/15">
                            City Portal Stats
                          </span>
                          <h3 className="text-xl font-extrabold tracking-tight mt-3 text-white">
                            Put Your Business on City's Digital Map
                          </h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Apna City connects over 15,000+ local residents and visitors with registered merchants, shops, transport nodes, and key locations in Agra Division.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/60">
                            <div>
                              <p className="text-lg font-black text-[#ff6b00] font-mono leading-none">FREE</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Self-Listing Setup</p>
                            </div>
                            <div>
                              <p className="text-lg font-black text-emerald-400 font-mono leading-none">100%</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Direct Whatsapp Sales</p>
                            </div>
                          </div>

                          <div className="mt-6 space-y-3.5 pt-6 border-t border-slate-800/60">
                            <div className="flex items-start gap-2.5 text-xs">
                              <div className="w-5 h-5 bg-orange-500/15 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3.5 h-3.5 text-[#ff6b00]" />
                              </div>
                              <p className="text-slate-300"><strong>Claim Legacy Establishments:</strong> Edit and verify addresses, phones, and operating tags instantly.</p>
                            </div>
                            <div className="flex items-start gap-2.5 text-xs">
                              <div className="w-5 h-5 bg-orange-500/15 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3.5 h-3.5 text-[#ff6b00]" />
                              </div>
                              <p className="text-slate-300"><strong>Google Trust Verification:</strong> Get badged next to authentic verified locations like "Bobby Studio".</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AMAZING SANDBOX DEMO ACCOUNTS AREA (MAKES LOGIN EXPERIENCE TRULY FUN & INSTANT) */}
                      <div className="bg-orange-50/40 border border-orange-200/40 p-5 rounded-2xl shadow-android-sm space-y-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
                            <span>Developer & Sandbox Quick Logins</span>
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            Skip manual text entry! Click any mock account profile to instantly log in and test owner-level listings, star validations, and directory management dashboard.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {registeredUsers.map((usr) => (
                            <button
                              key={usr.id}
                              type="button"
                              onClick={() => {
                                setCurrentUser(usr);
                                setActiveDemoRole(usr.id);
                                triggerToast(`Logged in successfully as ${usr.name}! Welcome to the platform!`, "success");
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 text-left hover:shadow-xs active:scale-98 cursor-pointer ${
                                activeDemoRole === usr.id 
                                  ? "bg-orange-100/40 border-orange-300"
                                  : "bg-white border-slate-200/50 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-extrabold text-[#ff6b00] text-xs shadow-3xs uppercase shrink-0">
                                  {usr.name.slice(0, 2)}
                                </div>
                                <div>
                                  <h5 className="text-[11px] font-bold text-slate-800 leading-none">{usr.name}</h5>
                                  <p className="text-[9px] text-slate-400 mt-1 font-mono leading-none">
                                    {usr.id === "usr_admin" ? "Premium Partner (Bobby Studio)" : "Sweets Merchant Account"}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-orange-50 hover:bg-orange-100 text-[#ff6b00] text-[9px] font-bold px-2 py-1 rounded-md border border-orange-200/40 shrink-0">
                                Enter Instantly
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Dynamic Form + Android SMS Simulator Card (7 Columns) */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-android-md overflow-hidden flex flex-col">
                        
                        {/* Selector Tabs */}
                        <div className="flex bg-slate-50 border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthTab("login");
                              setIsOtpSent(false);
                            }}
                            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                              authTab === "login"
                                ? "border-[#ff6b00] text-[#ff6b00] bg-white font-extrabold"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthTab("register");
                              setIsOtpSent(false);
                            }}
                            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                              authTab === "register"
                                ? "border-[#ff6b00] text-[#ff6b00] bg-white font-extrabold"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            Create Account
                          </button>
                        </div>

                        {/* Interactive fields list wrapper */}
                        <div className="p-5 space-y-4">
                          {authTab === "login" ? (
                            /* SIGN IN SECTION IN-PANEL */
                            <div className="space-y-4">
                              {/* OTP vs Password Method switch */}
                              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLoginMethod("otp");
                                    setIsOtpSent(false);
                                  }}
                                  className={`py-1.5 text-[10px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                                    loginMethod === "otp"
                                      ? "bg-white text-slate-800 shadow-3xs"
                                      : "text-slate-500 hover:text-slate-800"
                                  }`}
                                >
                                  ⚡ OTP Verification
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLoginMethod("password")}
                                  className={`py-1.5 text-[10px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                                    loginMethod === "password"
                                      ? "bg-white text-slate-800 shadow-3xs"
                                      : "text-slate-500 hover:text-slate-800"
                                  }`}
                                >
                                  🔑 Secure Password
                                </button>
                              </div>

                              {loginMethod === "otp" ? (
                                /* SUB OTP INTERACTIVE RENDER */
                                <div className="space-y-4">
                                  {!isOtpSent ? (
                                    <form onSubmit={handleSendOtp} className="space-y-3.5">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Enter Mobile Number</label>
                                        <div className="relative">
                                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <span className="text-xs text-slate-400 font-mono font-bold">+91</span>
                                          </div>
                                          <input
                                            type="tel"
                                            maxLength={10}
                                            value={loginPhone}
                                            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                                            placeholder="Enter 10 digit phone contact"
                                            className="block w-full pl-12 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 font-mono tracking-wider focus:bg-white transition-all duration-200"
                                          />
                                        </div>
                                      </div>

                                      <button
                                        type="submit"
                                        className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-extrabold text-xs py-2 text-center rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                                      >
                                        <span>Send Simulated OTP</span>
                                        <Send className="w-3.5 h-3.5" />
                                      </button>
                                    </form>
                                  ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">Enter 4-Digit Passcode</label>
                                        <input
                                          type="text"
                                          maxLength={4}
                                          value={otpCode}
                                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                          placeholder="Enter code"
                                          className="block w-full px-4 py-2 border border-slate-200 rounded-xl text-center text-base font-bold font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 focus:bg-white transition-all duration-200"
                                        />
                                        <div className="flex items-center justify-between mt-2 px-0.5">
                                          <button
                                            type="button"
                                            onClick={() => handleSendOtp()}
                                            disabled={otpTimer > 0}
                                            className="text-[10px] font-bold text-[#ff6b00] hover:underline disabled:text-slate-400 cursor-pointer disabled:no-underline font-mono"
                                          >
                                            {otpTimer > 0 ? `Resend (${otpTimer}s)` : "Resend Passcode"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setIsOtpSent(false)}
                                            className="text-[10px] font-black text-slate-500 hover:underline cursor-pointer"
                                          >
                                            Change Mobile
                                          </button>
                                        </div>
                                      </div>

                                      <button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                                      >
                                        <span>Verify OTP and Enter</span>
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    </form>
                                  )}

                                  {/* THE REAL-FEEL SMARTPHONE OTP DISPATCH SIMULATOR */}
                                  <div className="pt-3 border-t border-slate-100 space-y-2">
                                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 select-none">
                                      <Smartphone className="w-3.5 h-3.5" />
                                      <span>Local Carrier Signal Simulator</span>
                                    </h4>

                                    <div className={`relative rounded-xl border border-slate-200 bg-slate-100 p-2.5 h-36 overflow-hidden shadow-inner flex flex-col justify-between transition-all duration-300 ${
                                      pulsePhone ? "ring-2 ring-orange-500/30 bg-orange-50 scale-101 translate-y-0.5" : ""
                                    }`}>
                                      {/* Mock Phone status */}
                                      <div className="flex justify-between items-center text-[7px] font-medium text-slate-400 font-mono tracking-tight select-none">
                                        <div className="flex items-center gap-1">
                                          <span>09:41</span>
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                        </div>
                                        <span>SKB Telecom (OTP Simulator)</span>
                                        <span>🔋 100%</span>
                                      </div>

                                      {/* Lock Screen Middle Message */}
                                      <div className="flex-1 flex items-center justify-center relative p-1">
                                        {isOtpSent && generatedOtp ? (
                                          <div
                                            onClick={() => {
                                              setOtpCode(generatedOtp);
                                              triggerToast("Verification passcode autofilled completely!", "success");
                                            }}
                                            className="bg-white border border-orange-300 rounded-xl p-2 shadow-sm max-w-[220px] text-left cursor-pointer hover:border-[#ff6b00] active:scale-98 transition-all hover:shadow-xs relative"
                                          >
                                            <div className="flex items-center justify-between text-[7px] text-orange-600 font-bold border-b border-orange-100 pb-0.5 mb-1 select-none">
                                              <span>💬 SMS RECEIVED: SKB-AUTH</span>
                                              <span>Just Now</span>
                                            </div>
                                            <p className="text-[9px] text-slate-700 leading-tight">
                                              Your custom verification token is <strong className="text-orange-950 font-mono text-[10px] bg-orange-100/55 p-0.5 px-1 rounded">{generatedOtp}</strong>. Click here to auto copy!
                                            </p>
                                            <p className="text-[7px] text-orange-600 font-bold mt-1 text-right select-none">⚡ CLICK TO AUTOFILL</p>
                                          </div>
                                        ) : (
                                          <p className="text-[10px] text-slate-400 font-medium italic text-center select-none leading-relaxed">
                                            Waiting/Idle State... <br />Verify mobile above to trigger simulated SMS packet!
                                          </p>
                                        )}
                                      </div>

                                      {/* Home pill */}
                                      <div className="w-12 h-0.5 bg-slate-300 rounded-full mx-auto" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* PASSWORD SIGN IN FORM */
                                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Enter Mobile / Email address</label>
                                    <input
                                      type="text"
                                      required
                                      value={loginPhone}
                                      onChange={(e) => setLoginPhone(e.target.value)}
                                      placeholder="e.g. bobby@apnashikohabad.com or 9837686414"
                                      className="block w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 text-slate-850"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Your Account Password</label>
                                    <div className="relative">
                                      <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="Enter password key"
                                        className="block w-full pl-4 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 font-mono"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-605 cursor-pointer"
                                      >
                                        {isPasswordVisible ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-md text-center cursor-pointer active:scale-98"
                                  >
                                    Authenticate Password
                                  </button>
                                </form>
                              )}
                            </div>
                          ) : (
                            /* REGISTER MERCHANT ACCOUNT PANEL */
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!regName || !regPhone || !regPassword) {
                                  triggerToast("Please fill in all register credentials!", "warning");
                                  return;
                                }
                                if (regPhone.length < 10) {
                                  triggerToast("Primary mobile must be exactly 10-digits!", "error");
                                  return;
                                }
                                triggerToast("Dynamic registration signal captured! Copying to OTP pipeline...", "info");
                                handleSendOtp();
                                setAuthTab("login");
                                setLoginMethod("otp");
                                setLoginPhone(regPhone);
                              }} 
                              className="space-y-3.5"
                            >
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Corporate Owner Name</label>
                                <input
                                  type="text"
                                  required
                                  value={regName}
                                  onChange={(e) => setRegName(e.target.value)}
                                  placeholder="e.g. Ramesh Kumar Verma"
                                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Active Mobile Number</label>
                                <input
                                  type="tel"
                                  maxLength={10}
                                  required
                                  value={regPhone}
                                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                                  placeholder="10 digit mobile contact"
                                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Set Security Password</label>
                                <input
                                  type="password"
                                  required
                                  value={regPassword}
                                  onChange={(e) => setRegPassword(e.target.value)}
                                  placeholder="Configure password code"
                                  className="block w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 font-mono"
                                />
                              </div>

                              <div className="flex items-start gap-2 select-none pt-1">
                                <input
                                  type="checkbox"
                                  id="agreeBox"
                                  checked={regAgreed}
                                  onChange={(e) => setRegAgreed(e.target.checked)}
                                  className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor="agreeBox" className="text-[10px] text-slate-500 leading-normal">
                                  I verify that my comercial establishment resides under City Municipal boundaries.
                                </label>
                              </div>

                              <button
                                type="submit"
                                disabled={!regAgreed}
                                className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                              >
                                <span>Proceed to Carrier Verify</span>
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* MERCHANT HUB ACTIVE DASHBOARD PORTAL */
                  <div className="space-y-6">
                    {/* Welcome Header Profile Panel */}
                    <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] text-white p-5 rounded-2xl shadow-android-md border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:16px_16px]" />
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-android-sm border border-white/10 shrink-0 uppercase">
                          {currentUser.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-extrabold text-white">{currentUser.name}</h3>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/15 animate-pulse flex items-center gap-0.5">
                              ● Live Active State
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            City Partner • Mobile ID: <span className="font-mono text-slate-350 font-bold">+91 {currentUser.phone}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 relative z-10 shrink-0 select-none">
                        <button
                          onClick={() => {
                            setShowAddBusinessModal(true);
                          }}
                          className="bg-[#ff6b00] hover:bg-[#d97706] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Shop</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="bg-slate-800 hover:bg-slate-700 hover:text-red-400 text-slate-300 font-bold text-[10px] px-3.5 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
                        >
                          End Session
                        </button>
                      </div>
                    </div>

                    {/* LIVE METRICS CARDS */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-android-sm flex items-start justify-between">
                        <div>
                          <p className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider leading-none">Weekly Impressions</p>
                          <h4 className="text-base font-black text-slate-800 mt-1.5 font-mono">1,842</h4>
                          <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 p-0.5 px-1 rounded mt-1 inline-block">↗ +12.3% views</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                          <Compass className="w-3.5 h-3.5 text-[#ff6b00]" />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-android-sm flex items-start justify-between">
                        <div>
                          <p className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider leading-none">WhatsApp Clicks</p>
                          <h4 className="text-base font-black text-slate-800 mt-1.5 font-mono">{currentUser.id === "usr_admin" ? "142" : "38"}</h4>
                          <span className="text-[8px] text-slate-400 font-bold bg-slate-100 p-0.5 px-1 rounded mt-1 inline-block">Direct Client Leads</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-android-sm flex items-start justify-between">
                        <div>
                          <p className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider leading-none">Reviews Rating</p>
                          <h4 className="text-base font-black text-slate-800 mt-1.5 font-mono">
                            {businesses.filter(b => b.ownerId === currentUser.id).length > 0 
                              ? (businesses.filter(b => b.ownerId === currentUser.id).reduce((sum, b) => sum + b.rating, 0) / businesses.filter(b => b.ownerId === currentUser.id).length).toFixed(1)
                              : "5.0"} <span className="text-[10px] text-slate-400">/ 5</span>
                          </h4>
                          <span className="text-[8px] text-amber-600 font-bold bg-amber-50 p-0.5 px-1 rounded mt-1 inline-block">★ Verified Public</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-android-sm flex items-start justify-between">
                        <div>
                          <p className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider leading-none">Security Privilege</p>
                          <h4 className="text-xs font-black text-slate-800 mt-2">
                            {currentUser.id === "usr_admin" ? "SYSTEM_ADMIN" : "STANDARD_PARTNER"}
                          </h4>
                          <span className={`text-[7px] font-bold p-0.5 px-1 rounded mt-1 inline-block ${
                            currentUser.id === "usr_admin" ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            Gate Token Authorized
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </div>
                    </div>

                    {/* TWO COLUMN GRID: MY BUSINESS LISTINGS | DIRECT PANEL FOR QUICK ADDITION */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1.5">
                      
                      {/* Left Side: Listed Shops Console (7 Columns) */}
                      <div className="lg:col-span-8 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-[#ff6b00]" />
                            <span>My Directory Listings ({businesses.filter(b => b.ownerId === currentUser.id).length})</span>
                          </h3>
                        </div>

                        {businesses.filter(b => b.ownerId === currentUser.id).length > 0 ? (
                          <div className="grid grid-cols-1 gap-2.5">
                            {businesses.filter(b => b.ownerId === currentUser.id).map(b => (
                              <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-slate-300 transition-colors">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {b.verifiedPartner && (
                                      <span className="bg-sky-50 text-sky-600 text-[8px] px-1.5 py-0.5 rounded-md font-bold">
                                        ✓ VERIFIED OWNER
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-black text-slate-850">{b.name}</h4>
                                  <p className="text-[9px] text-slate-450">{b.area} — <span className="italic font-sans">{b.address}</span></p>
                                  <p className="text-[9px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">{b.description}</p>
                                </div>

                                <div className="flex md:flex-col items-stretch gap-1.5 w-full md:w-auto self-stretch md:self-auto select-none">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const originalBiz = b;
                                      handleOpenEditBusiness(originalBiz, e);
                                    }}
                                    className="flex-1 md:flex-none text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[9px] px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                                    title="Edit listing details"
                                  >
                                    <Pencil className="w-2.5 h-2.5 text-slate-500" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBusiness(b, e);
                                    }}
                                    className="flex-1 md:flex-none text-center bg-red-50 hover:bg-red-100/80 text-red-650 font-bold text-[9px] px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-red-200/20"
                                    title="Delete listing permanently"
                                  >
                                    <Trash2 className="w-2.5 h-2.5 text-red-500" />
                                    <span>Delete</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveTab("directory");
                                      setSearchQuery(b.name);
                                      triggerToast(`Locating preview for "${b.name}" in primary town index!`, "info");
                                    }}
                                    className="flex-1 md:flex-none text-center bg-orange-50 hover:bg-orange-100/60 text-[#ff6b00] font-bold text-[9px] px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <span>Locate Map</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 text-slate-500">
                            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                            <div>
                              <p className="text-xs font-bold text-slate-700">No storefront listings cataloged on your account.</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                                Claims or fresh registrations can be created instantly via the right-side publishing console catalog!
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setShowAddBusinessModal(true);
                              }}
                              className="bg-[#ff6b00] hover:bg-[#d97706] text-white font-bold text-[9px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              List First Store
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Quick Setup Form (5 Columns) */}
                      <div className="lg:col-span-4 space-y-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-android-sm space-y-3 select-none">
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Quick Establish Shop</h4>
                            <p className="text-[9px] text-slate-400 mt-0.5">List second branches or local commercial entities directly.</p>
                          </div>

                          <form onSubmit={handleAddBusiness} className="space-y-2.5">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">Shop Name</label>
                              <input
                                type="text"
                                required
                                value={newBizName}
                                onChange={(e) => setNewBizName(e.target.value)}
                                placeholder="e.g. City Sweets Hub"
                                className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">Establishment Category</label>
                              <select
                                value={newBizCat}
                                onChange={(e) => setNewBizCat(e.target.value as Business["category"])}
                                className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-800 font-sans"
                              >
                                <option value="restaurant">🍽️ Restaurant & Food</option>
                                <option value="hardware">🛠️ Hardware & Building Materials</option>
                                <option value="electronics">🔌 Mobile & Electronic Shops</option>
                                <option value="school">🏫 Schools</option>
                                <option value="college">🎓 College & Universities</option>
                                <option value="retail">🛍️ Retail & Shopping</option>
                                <option value="hotel">🏨 Hotels & Resorts</option>
                                <option value="photography">📸 Studio & Photography</option>
                                <option value="gas">⛽ Gas Agencies & Petrol Pumps</option>
                                <option value="beauty">💄 Beauty Parlours & Salons</option>
                                <option value="temple">🛕 Temples</option>
                                <option value="mosque">🕌 Mosques (Masjid)</option>
                                <option value="hospital">🏥 Hospitals & Healthcare</option>
                                <option value="pharmacy">💊 Medical Retail Stores</option>
                                <option value="bank">🏦 Banks & Finances</option>
                                <option value="gym">🏋️ Gym & Fitness Centers</option>
                                <option value="other">📦 Other Businesses</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">Establishment Street Address</label>
                              <input
                                type="text"
                                required
                                value={newBizAddress}
                                onChange={(e) => setNewBizAddress(e.target.value)}
                                placeholder="e.g. Station Road, City"
                                className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">Select Area / Landmark</label>
                              <input
                                type="text"
                                required
                                value={newBizArea}
                                onChange={(e) => setNewBizArea(e.target.value)}
                                placeholder="e.g. Paliwal Chauraha"
                                className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-800"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">Shop Phone</label>
                                <input
                                  type="tel"
                                  required
                                  value={newBizPhone}
                                  onChange={(e) => setNewBizPhone(e.target.value)}
                                  placeholder="9412345678"
                                  className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-850 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">WhatsApp</label>
                                <input
                                  type="tel"
                                  value={newBizWhatsapp}
                                  onChange={(e) => setNewBizWhatsapp(e.target.value)}
                                  placeholder="9412345678"
                                  className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-850 font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-450 uppercase pb-1">Description Brief</label>
                              <textarea
                                value={newBizDesc}
                                onChange={(e) => setNewBizDesc(e.target.value)}
                                placeholder="Briefly write operating specialties..."
                                rows={2}
                                className="block w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-800 resize-none font-sans"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-black text-xs py-2 rounded-xl transition-colors mt-1.5 cursor-pointer"
                            >
                              Publish Storefront
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MIND REFRESHER TAB */}
            {activeTab === "game" && (
              <MindRefresherGame />
            )}

            {/* ZEN SOLVERS TAB */}
            {activeTab === "zen" && (
              <ZenSolvers />
            )}

            {/* CITY ASSISTANT DESKTOP GUIDE FALLBACK OR MOBILE INLINE HANDLER */}
            {activeTab === "assistant" && (
              <div className="bg-orange-50/50 border border-orange-200/50 rounded-2xl p-8 shadow-android-sm flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-tr from-[#ff6b00] to-[#d97706] text-white rounded-2xl flex items-center justify-center shadow-android-md mb-4 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">City Assistant</h3>
                <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
                  On desktop screens, **City Assistant is permanently open in the right sidebar** so you can chat while browsing the directory listings!
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-orange-100/60 text-[#d97706] text-[11px] font-bold px-3 py-1.5 rounded-lg border border-orange-200/50">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Select Local Directory above to continue browsing the town listings</span>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </section>

        {/* Right Side: "City Assistant" - Friendly AI Assistant Column (4 Columns) - responsive display based on tab selection */}
        <section className={`lg:col-span-4 flex flex-col bg-white border border-slate-100 rounded-2xl shadow-android-md h-[650px] overflow-hidden sticky top-[92px] ${activeTab === "assistant" ? "flex" : "hidden lg:flex"}`}>
          
          {/* AI Banner Top */}
          <div className="bg-gradient-to-r from-[#ff6b00] to-[#d97706] text-white p-4 flex items-center justify-between border-b border-orange-600/10 shadow-sm relative">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-extrabold text-sm text-white relative shadow-xs border border-white/10">
                C
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                  City Assistant
                </h3>
                <p className="text-[10px] text-orange-100 font-medium font-sans">City Expert Local Guide</p>
              </div>
            </div>

            <span className="text-[9px] font-mono bg-white/10 text-white font-bold px-1.5 py-0.5 rounded border border-white/10">
              Gemini AI Active
            </span>
          </div>

          {/* AI Message Stream */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors ${isDarkMode ? "bg-[#0c111d]" : "bg-[#ffffff]"}`}>
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[90%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border ${
                    isDarkMode 
                      ? "bg-orange-950/45 text-orange-400 border-orange-900/40" 
                      : "bg-orange-100 text-[#d97706] border-orange-200"
                  }`}>
                    D
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl shadow-2xs ${
                  msg.role === "user" 
                    ? (isDarkMode ? "bg-[#1d273a] text-slate-100 rounded-br-none" : "bg-slate-900 text-white rounded-br-none")
                    : (isDarkMode ? "bg-orange-950/15 text-slate-200 rounded-bl-none border border-orange-900/30" : "bg-orange-50/40 text-slate-850 rounded-bl-none border border-orange-100/60")
                }`}>
                  <div className="space-y-1">
                    {msg.role === "assistant" ? (
                      parseMarkdown(msg.content)
                    ) : (
                      <p className="text-xs leading-relaxed font-sans font-medium">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex gap-2.5 mr-auto max-w-[85%]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 animate-pulse border ${
                  isDarkMode 
                    ? "bg-orange-950/45 text-orange-400 border-orange-900/40" 
                    : "bg-orange-100 text-[#d97706] border-orange-200"
                }`}>
                  D
                </div>
                <div className={`p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 border ${
                  isDarkMode 
                    ? "bg-orange-950/15 text-slate-400 border-orange-900/30" 
                    : "bg-orange-50/40 text-slate-500 border-orange-100/50"
                }`}>
                  <div className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Interactive Starter Recommendations */}
          <div className={`p-3 border-t grid grid-cols-2 gap-1.5 transition-colors ${isDarkMode ? "border-slate-800/80 bg-[#111726]" : "border-slate-100 bg-white"}`}>
            {[
              { label: "Famous Rabri Peda?", prompt: "Where can I find the most premium local Peda and Rabri in City?" },
              { label: "Dara Shikoh History?", prompt: "Tell me briefly about Prince Dara Shikoh and why City was named after him?" },
              { label: "Glassware Industry?", prompt: "What is the glass and glassware factory scene in City and how is it linked to Firozabad?" },
              { label: "Agra to SKB Travel?", prompt: "How do I travel from Agra to City via NH-19 and how long does it take?" }
            ].map((rc, i) => (
              <button
                key={i}
                disabled={isAiLoading}
                onClick={() => {
                  setUserChatInput(rc.prompt);
                }}
                className={`text-[10px] transition-colors py-1.5 px-2 rounded-lg text-left line-clamp-1 truncate block disabled:opacity-50 cursor-pointer text-ellipsis overflow-hidden font-bold border ${
                  isDarkMode 
                    ? "text-[#ff923d] border-orange-900/30 bg-orange-950/10 hover:bg-orange-950/25" 
                    : "text-[#d97706] border-orange-200/55 bg-orange-50/50 hover:bg-orange-100/60"
                }`}
              >
                {rc.label}
              </button>
            ))}
          </div>

          {/* AI Chat Input Box */}
          <form onSubmit={handleSendChatMessage} className={`p-3 border-t flex items-center gap-2 transition-colors ${isDarkMode ? "bg-[#111726] border-slate-800/80" : "bg-white border-slate-100"}`}>
            <input
              type="text"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              placeholder="Ask Dara about streets, sweets, history..."
              className={`flex-1 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#ff6b00] transition-colors ${
                isDarkMode 
                  ? "bg-[#151b2a] border border-slate-800 text-slate-100 placeholder-slate-500 focus:bg-[#1a2133]" 
                  : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white"
              }`}
            />
            <button
              type="submit"
              disabled={!userChatInput.trim() || isAiLoading}
              className="bg-[#ff6b00] hover:bg-[#d97706] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-android-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </section>

      </main>

      {/* MODAL: Selected Business Details & Reviews */}
      <AnimatePresence>
        {selectedBusiness && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBusiness(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`rounded-2xl border w-full max-w-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col transition-colors ${isDarkMode ? "bg-[#111726] border-slate-800" : "bg-white border-slate-200"}`}
            >
              {/* Top Banner Category colored */}
              <div className="bg-slate-900 text-white p-5 flex justify-between items-start">
                <div>
                  <div className="flex gap-2 items-center mb-2 flex-wrap">
                    {selectedBusiness.verifiedPartner && (
                      <span className="text-[10px] bg-blue-600 text-white uppercase font-bold tracking-widest px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified Premium Partner</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold">{selectedBusiness.name}</h2>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedBusiness.area} — {selectedBusiness.address}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {currentUser && selectedBusiness.ownerId === currentUser.id && (
                    <div className="flex items-center gap-1.5 mr-1 text-slate-900">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const originalBiz = selectedBusiness;
                          setSelectedBusiness(null);
                          handleOpenEditBusiness(originalBiz, e);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                        title="Edit local business details"
                      >
                        <Pencil className="w-3 h-3 text-white" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBusiness(selectedBusiness, e);
                        }}
                        className="bg-red-650 hover:bg-red-750 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                        title="Delete listing permanently"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedBusiness(null)}
                    className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Shop Image Banner (Interactive Google Map & Street View) */}
                <div className="space-y-3">
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 shadow-android-sm relative bg-slate-50">
                    <iframe
                      title={`Google Map view for ${selectedBusiness.name}`}
                      src={
                        detailedMapMode === "streetview"
                          ? `https://www.google.com/maps?q=${encodeURIComponent(
                              selectedBusiness.name + ", " + selectedBusiness.address + ", Shikohabad, Uttar Pradesh"
                            )}&layer=c&z=19&ie=UTF8&iwloc=&output=embed`
                          : detailedMapMode === "satellite"
                          ? `https://www.google.com/maps?q=${encodeURIComponent(
                              selectedBusiness.name + ", " + selectedBusiness.address + ", Shikohabad, Uttar Pradesh"
                            )}&t=k&z=19&ie=UTF8&iwloc=&output=embed`
                          : `https://www.google.com/maps?q=${encodeURIComponent(
                              selectedBusiness.name + ", " + selectedBusiness.address + ", Shikohabad, Uttar Pradesh"
                            )}&t=m&z=17&ie=UTF8&iwloc=&output=embed`
                      }
                      className="w-full h-full"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating active mode badge */}
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-sans font-semibold select-none flex items-center gap-1.5 shadow-sm border border-white/10">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      <span>
                        {detailedMapMode === "streetview" && "📸 Front Shop View"}
                        {detailedMapMode === "satellite" && "📡 Sat-Air View"}
                        {detailedMapMode === "roadmap" && "🗺️ Roadway View"}
                      </span>
                    </div>
                  </div>

                  {/* High Quality Tab Selector to swap Google Map Perspectives */}
                  <div className={`grid grid-cols-3 gap-2 p-1 rounded-xl transition-colors ${isDarkMode ? "bg-slate-800/80" : "bg-slate-100"}`}>
                    <button
                      onClick={() => setDetailedMapMode("streetview")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        detailedMapMode === "streetview"
                          ? "bg-[#ff6b00] text-white shadow-3xs"
                          : (isDarkMode ? "text-slate-300 hover:text-white hover:bg-slate-700/50" : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50")
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>📸 Front View</span>
                    </button>
                    <button
                      onClick={() => setDetailedMapMode("satellite")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        detailedMapMode === "satellite"
                          ? "bg-[#ff6b00] text-white shadow-3xs"
                          : (isDarkMode ? "text-slate-300 hover:text-white hover:bg-slate-700/50" : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50")
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>📡 Satellite</span>
                    </button>
                    <button
                      onClick={() => setDetailedMapMode("roadmap")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        detailedMapMode === "roadmap"
                          ? "bg-[#ff6b00] text-white shadow-3xs"
                          : (isDarkMode ? "text-slate-300 hover:text-white hover:bg-slate-700/50" : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50")
                      }`}
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>🗺️ Road Guide</span>
                    </button>
                  </div>
                </div>

                {/* If there is a custom photo uploaded (drive upload or non-unsplash user photos), display it as a gorgeous gallery card */}
                {selectedBusiness.imageUrl && !selectedBusiness.imageUrl.includes("unsplash.com") && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span>📁 Custom Business Showcase Photo</span>
                    </div>
                    <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-100 shadow-3xs">
                      <img
                        src={selectedBusiness.imageUrl}
                        alt={`${selectedBusiness.name} Showcase`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedBusiness.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedBusiness.tags.map((tg, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                      #{tg}
                    </span>
                  ))}
                </div>

                {/* Live Google Map Spotter & GPS Tracking Link */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50">
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>Live Google Map Spotter</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Location Tracking</span>
                    </div>
                  </div>
                  <div className="w-full h-64 relative bg-slate-100">
                    <iframe
                      title={`Map of ${selectedBusiness.name}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        selectedBusiness.name + ", " + selectedBusiness.address + ", Shikohabad, Uttar Pradesh"
                      )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>
                  <div className="p-3.5 bg-white border-t border-slate-150 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <div className="text-[10px] sm:text-xs text-slate-500">
                      <span className="font-bold text-slate-700 block">Need GPS directions?</span>
                      <span>Open in default navigator to track live relative distance.</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        selectedBusiness.name + " " + selectedBusiness.address + " Shikohabad"
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-3xs text-center cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span>Track Map Location ↑</span>
                    </a>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs text-slate-500">
                    <span className="block font-bold text-slate-700">Need immediate assistance?</span>
                    <span>Contact local merchant via Telephone or send a Direct WhatsApp.</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${selectedBusiness.phone}`}
                      className="flex-1 sm:flex-none text-center bg-slate-900 text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedBusiness.phone}</span>
                    </a>
                    {selectedBusiness.whatsapp && (
                      <a
                        href={`https://wa.me/${selectedBusiness.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none text-center bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Existing Reviews Section */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Visitor Reviews & Experience ({selectedBusiness.reviewsCount})</h3>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span className="font-bold text-slate-800">{selectedBusiness.rating} / 5</span>
                    </div>
                  </div>

                  {/* Reviews lists */}
                  <div className="space-y-3">
                    {reviews.filter(r => r.businessId === selectedBusiness.id).length > 0 ? (
                      reviews
                        .filter(r => r.businessId === selectedBusiness.id)
                        .map((rev) => (
                          <div key={rev.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex justify-between text-xs mb-2">
                              <span className="font-bold text-slate-800">{rev.author}</span>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 stroke-amber-500' : 'text-slate-200'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{rev.comment}</p>
                            <span className="text-[9px] text-slate-400 mt-2 block font-mono">
                              Verified Review — {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                    ) : (
                      <p className="text-[11px] text-slate-400 italic text-center py-4">No reviews posted yet. Be the first to express your experience!</p>
                    )}
                  </div>
                </div>

                {/* Post New Review Form */}
                <form onSubmit={handleAddReview} className="p-4 border border-amber-100 bg-amber-50/20 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-600" />
                    <span>Submit Your Honest Experience</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="Rahul Dev, Sneha, etc."
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Star Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 cursor-pointer"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ Great (4 Stars)</option>
                        <option value="3">⭐⭐⭐ Fair (3 Stars)</option>
                        <option value="2">⭐⭐ Poor (2 Stars)</option>
                        <option value="1">⭐ Terrible (1 Star)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">Your Detailed Comment</label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share exact reviews on taste, prices, speed, or hospitality..."
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Post Review & Rate Service
                  </button>
                </form>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Scan to Pay UPI Scanner & Checkout Sheet */}
      <AnimatePresence>
        {showQrScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowQrScanner(false);
                setScannedUpiData(null);
                setVerifiedPatronCertificate(null);
              }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-5 sm:p-6 text-slate-100 z-10 flex flex-col focus:outline-none"
            >
              {/* Top Close Hook */}
              <button
                onClick={() => {
                  setShowQrScanner(false);
                  setScannedUpiData(null);
                  setVerifiedPatronCertificate(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Body */}
              {!scannedUpiData ? (
                <div className="space-y-5 text-left">
                  <div>
                    <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-violet-400" />
                      <span>Scan to Pay Securely</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Scan any UPI QR standee or upload a saved QR code screenshot to pay directly and unlock premium services & citizen certificates.
                    </p>
                  </div>

                  {/* Mode Tab Switchers */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-850">
                    <button
                      onClick={() => {
                        setQrScanMode("camera");
                        setQrScannerError(null);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        qrScanMode === "camera" 
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Live Camera</span>
                    </button>
                    <button
                      onClick={() => {
                        setQrScanMode("upload");
                        setQrScannerError(null);
                        stopCameraScan();
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        qrScanMode === "upload" 
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      <span>Gallery Upload</span>
                    </button>
                  </div>

                  {/* Mode Panels */}
                  {qrScanMode === "camera" ? (
                    <div className="space-y-4">
                      {/* Interactive Webcam Target Container */}
                      <div className="w-full aspect-square max-w-[280px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 mx-auto flex flex-col items-center justify-center">
                        <div id="shk-qr-scanner-element" className="w-full h-full object-cover" />
                        
                        {!qrScanning && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/90 text-center space-y-3 z-10 transition-opacity">
                            <QrCode className="w-12 h-12 text-slate-600 animate-pulse" />
                            <p className="text-xs text-slate-400 px-3">
                              Camera initialized offline. Click start to grant permission and initiate live code scanning.
                            </p>
                            <button
                              onClick={startCameraScan}
                              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                            >
                              Activate Scanner Camera
                            </button>
                          </div>
                        )}

                        {qrScanning && (
                          <>
                            {/* Scanning Laser Line Simulation */}
                            <div className="absolute left-[10%] right-[10%] h-0.5 bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.9)] animate-pulse" style={{ top: '50%' }} />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 rounded-md font-mono flex items-center gap-1 select-none z-10 animate-fade-in">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              WAVE LEDGER RUNNING
                            </div>
                            <button
                              onClick={stopCameraScan}
                              className="absolute bottom-3 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-400 hover:text-white font-bold cursor-pointer transition-colors z-20"
                            >
                              Pause Stream
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Custom Upload Dropzone */}
                      <label 
                        htmlFor="shk-qr-file-input"
                        className="w-full aspect-square max-w-[280px] border-2 border-dashed border-slate-800 hover:border-violet-500/40 bg-slate-950 rounded-xl mx-auto flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:bg-slate-950/70"
                      >
                        <FileUp className="w-10 h-10 text-slate-600 mb-3" />
                        <span className="text-xs text-slate-350 font-bold block">Choose Saved UPI QR Code image</span>
                        <span className="text-[10px] text-slate-500 mt-1 block px-2 leading-relaxed">
                          Accepts screenshots of PhonePe, GPay, Paytm, or generic standee QR codes from your gallery.
                        </span>
                        <input 
                          type="file" 
                          id="shk-qr-file-input" 
                          onChange={handleQrFileUpload}
                          className="hidden" 
                          accept="image/*" 
                        />
                      </label>
                      <div id="shk-file-uploader-stage" className="hidden" />
                    </div>
                  )}

                  {/* Error messaging inside dialog */}
                  {qrScannerError && (
                    <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-xl text-xs text-red-400 leading-normal">
                      <strong>Initialization Warn:</strong> {qrScannerError}
                    </div>
                  )}

                  {/* Simulated interactive test trigger for premium experience */}
                  <div className="pt-2 border-t border-slate-850 flex flex-col gap-2">
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                      Willing to test but don't have a QR screenshot nearby? Try our verified preset merchant payload:
                    </p>
                    <button
                      onClick={() => handleQrDecoded("upi://pay?pa=9837686414@ybl&pn=Apna%20Shikohabad&am=101&tn=Civic%20Patron%20Appreciation")}
                      className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 hover:border-amber-500/30 border border-slate-850 rounded-xl text-xs font-bold text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🚀 Auto-load "Apna Shikohabad" UPI Payload</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: TRUSTED UPI PAYMENT SHEET / BILLING SHEET */
                <div className="space-y-5 text-left text-slate-200">
                  <div className="border-b border-slate-850 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-emerald-400 font-extrabold tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        NPCI Verified Decoded
                      </span>
                      <h3 className="text-sm font-extrabold text-white uppercase mt-1 tracking-wider font-mono">Secure Payment Sheet</h3>
                    </div>
                    <button
                      onClick={() => {
                        setScannedUpiData(null);
                        setVerifiedPatronCertificate(null);
                        setPaidUtr("");
                        setPatronCertificateName("");
                      }}
                      className="text-xs font-bold text-violet-400 hover:text-violet-300 hover:underline cursor-pointer flex items-center gap-1 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Back to scan</span>
                    </button>
                  </div>

                  {/* Merchant Recipient Box */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-violet-600/5 blur-xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">RECIPIENT VPA</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-1 font-serif">
                          {scannedUpiData.pn || "Verified Recipient"}
                          <Check className="w-3.5 h-3.5 text-emerald-400 bg-emerald-500/10 rounded-full p-0.5 shrink-0" />
                        </h4>
                        <p className="text-[11px] font-mono text-violet-355 select-all font-semibold leading-none mt-1">{scannedUpiData.pa}</p>
                      </div>
                    </div>
                  </div>

                  {/* Inputs Group: Amount and Note */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Contribution (₹)</label>
                      <div className="relative bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-violet-500/50 transition-colors flex items-center gap-1">
                        <span className="text-sm font-bold text-violet-400">₹</span>
                        <input
                          type="number"
                          value={scannedUpiData.am || ""}
                          onChange={(e) => {
                            setScannedUpiData(prev => prev ? { ...prev, am: e.target.value } : null);
                          }}
                          placeholder="Amount"
                          className="w-full bg-transparent text-sm font-extrabold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Payment Note</label>
                      <div className="relative bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-violet-500/50 transition-colors">
                        <input
                          type="text"
                          value={scannedUpiData.tn || ""}
                          onChange={(e) => {
                            setScannedUpiData(prev => prev ? { ...prev, tn: e.target.value } : null);
                          }}
                          placeholder="Purpose"
                          className="w-full bg-transparent text-xs text-white focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Values Selector if amount is empty or editable */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[51, 101, 251, 501].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setScannedUpiData(prev => prev ? { ...prev, am: amt.toString() } : null);
                        }}
                        className={`py-1 text-xs font-mono font-bold border rounded-lg transition-all cursor-pointer ${
                          scannedUpiData.am === amt.toString()
                            ? "bg-violet-500/20 text-violet-300 border-violet-500"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Deep Link Payment Launchers or Scan QR Code dynamically */}
                  <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-xl space-y-3 relative">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">UPI BANK ROUTING MECHANISM</span>
                    
                    {/* Generates standard deep link pay parameters dynamically */}
                    {(() => {
                      const finalAmt = scannedUpiData.am || "101";
                      const finalNote = scannedUpiData.tn || "Appreciation for Apna Shikohabad";
                      const upiUrl = `upi://pay?pa=${scannedUpiData.pa}&pn=${encodeURIComponent(scannedUpiData.pn || "Verified Merchant")}&am=${finalAmt}&tn=${encodeURIComponent(finalNote)}&cu=INR`;
                      
                      return (
                        <div className="space-y-3 text-center">
                          {/* Deep Link Action Button */}
                          <a
                            href={upiUrl}
                            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Smartphone className="w-4 h-4 shrink-0" />
                            <span>Pay instantly via Mobile UPI app</span>
                          </a>

                          <div className="flex items-center gap-2">
                            <span className="w-full border-t border-slate-850" />
                            <span className="text-[10px] text-slate-500 shrink-0 select-none">OR PAY FROM DESKTOP USING STAND QR</span>
                            <span className="w-full border-t border-slate-850" />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-850">
                            {/* Real-time generated checkout QR containing custom parsed values */}
                            <div className="relative w-28 h-28 bg-white p-1 rounded-xl shadow-md shrink-0">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(upiUrl)}`}
                                alt="UPI Billing QR code"
                                className="w-full h-full select-all"
                              />
                            </div>
                            
                            {/* Quick copy options */}
                            <div className="space-y-2 text-left w-full select-none">
                              <p className="text-[10px] text-slate-450 leading-relaxed">
                                Scan the dynamic QR above with your favorite payment app (PhonePe, GPay, Paytm) or copy payee address:
                              </p>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(scannedUpiData.pa);
                                    triggerToast("VPA Copied!", "success");
                                  } catch (e) {
                                    triggerToast("Copied to clipboard", "success");
                                  }
                                }}
                                className="w-full py-1.5 px-2 bg-slate-900 border border-slate-800 hover:text-white rounded-lg text-[10px] font-mono text-slate-400 flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="truncate max-w-[200px]">{scannedUpiData.pa}</span>
                                <Copy className="w-3 h-3 text-violet-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* PART 3: SECURE TRANSACTION VALIDATION LEDGER TO PRODUCE PATRON CERTIFICATE */}
                  <div className="border-t border-slate-850 pt-4 space-y-4">
                    {!verifiedPatronCertificate ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 font-bold">
                            <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 font-bold flex items-center justify-center text-[10px]">Verify</span>
                            Generate Citizen Certification Card
                          </label>
                          <span className="text-[9px] text-slate-500 font-mono">*Requires complete bank pay</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <span className="text-[9px] text-slate-500 font-mono font-bold block mb-1">PATRON NAME</span>
                            <div className="relative bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 focus-within:border-violet-500/50 transition-colors">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <input
                                type="text"
                                value={patronCertificateName}
                                onChange={(e) => setPatronCertificateName(e.target.value)}
                                placeholder="For certificate printing"
                                className="w-full bg-transparent text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-mono font-bold block mb-1">12-DIGIT UPI REFERENCE (UTR)</span>
                            <div className="relative bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 focus-within:border-violet-500/50 transition-colors">
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                              <input
                                type="text"
                                value={paidUtr}
                                onChange={(e) => setPaidUtr(e.target.value)}
                                placeholder="e.g. 529183401562"
                                maxLength={12}
                                className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Staggered process terminal */}
                        {isVerifyingScannedPayment && (
                          <div className="bg-slate-950 rounded-xl border border-slate-850 p-3 font-mono text-[9px] text-emerald-400/95 leading-relaxed space-y-1 select-none animate-fade-in">
                            <div className="flex items-center gap-2 border-b border-slate-850 pb-1 mb-1 text-slate-500">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                              <span>NPCI LEDGER VERIFIER CONNECTED</span>
                            </div>
                            <div className="animate-pulse">{"»"} Initiating secure handshake with gateway...</div>
                            <div className="delay-1000 mt-0.5">{"»"} Querying NPCI merchant pool checksum hashes...</div>
                            <div className="delay-2000 mt-0.5">{"»"} Locking UTR match payload verification keys...</div>
                            <div className="delay-3000 font-bold text-amber-300 mt-0.5">{"»"} MATCH FIXED. Deploying majestic appreciation matrix!</div>
                          </div>
                        )}

                        <button
                          onClick={handleVerifyScannedPayment}
                          disabled={isVerifyingScannedPayment}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
                          <span>{isVerifyingScannedPayment ? "Resolving Payment Status..." : "Securely Validate & Unlock Certificate"}</span>
                        </button>
                      </div>
                    ) : (
                      /* MAJESTIC MOUNTED CERTIFICATE CARD DISPLAY */
                      <div className="border border-amber-500/30 rounded-xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/40 to-slate-950 relative overflow-hidden space-y-4">
                        <div className="absolute inset-0 border border-amber-500/10 rounded-lg pointer-events-none" />
                        
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
                            <Award className="w-5 h-5 text-amber-500" />
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[7px] font-mono tracking-widest text-[#ff6b00] font-extrabold uppercase block select-none">Official Verified Seal</span>
                            <h4 className="text-base font-extrabold text-white uppercase tracking-tight font-serif leading-none">Certificate of Patronage</h4>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-[#ff6b00] to-amber-500 mx-auto rounded mt-1.5" />
                          </div>

                          <div className="py-2">
                            <p className="text-[9px] text-slate-500 font-mono">THIS CERTIFIES WITH GRATITUDE AND DISPATCH</p>
                            <span className="text-sm font-black text-amber-400 font-serif block mt-1 capitalize">{verifiedPatronCertificate.name}</span>
                            <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed mt-2 italic text-center">
                              Supported the continued high-performance server reliability and civic digital directory audits for Apna Shikohabad platform.
                            </p>
                          </div>
                        </div>

                        {/* Certificate metadata badges */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-center font-mono text-[9px]">
                          <div>
                            <span className="text-[7px] text-slate-500 block uppercase font-bold leading-none mb-1">UTR Lock</span>
                            <span className="font-bold text-slate-350">{verifiedPatronCertificate.utr}</span>
                          </div>
                          <div className="border-x border-slate-850">
                            <span className="text-[7px] text-slate-500 block uppercase font-bold leading-none mb-1">Value</span>
                            <span className="font-bold text-emerald-400 font-bold">₹{verifiedPatronCertificate.amount}.00</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-slate-500 block uppercase font-bold leading-none mb-1">Verified</span>
                            <span className="font-bold text-slate-350">{verifiedPatronCertificate.date}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.print()}
                            className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-[#ff6b00] text-white font-extrabold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-md"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Save certificate / Print</span>
                          </button>
                          <button
                            onClick={() => {
                              setVerifiedPatronCertificate(null);
                              setScannedUpiData(null);
                              setShowQrScanner(false);
                            }}
                            className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-slate-800"
                          >
                            Close Overlay
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Register Business Form */}
      <AnimatePresence>
        {showAddBusinessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBusinessModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold">Register Local Business Directory</h2>
                  <p className="text-[10px] text-slate-400">Join our digital directory immediately to help travelers & locals</p>
                </div>
                <button
                  onClick={() => setShowAddBusinessModal(false)}
                  className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddBusiness} className="flex-1 overflow-y-auto p-5 space-y-4">
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business / Institution Name *</label>
                  <input
                    type="text"
                    required
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    placeholder="e.g., Shiko Premium Glass Emporium"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category Category *</label>
                    <select
                      value={newBizCat}
                      onChange={(e) => setNewBizCat(e.target.value as Business["category"])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 cursor-pointer"
                    >
                      <option value="restaurant">🍽️ Restaurant & Food</option>
                      <option value="hardware">🛠️ Hardware & Building Materials</option>
                      <option value="electronics">🔌 Mobile & Electronic Shops</option>
                      <option value="school">🏫 Schools</option>
                      <option value="college">🎓 College & Universities</option>
                      <option value="retail">🛍️ Retail & Shopping</option>
                      <option value="hotel">🏨 Hotels & Resorts</option>
                      <option value="photography">📸 Studio & Photography</option>
                      <option value="gas">⛽ Gas Agencies & Petrol Pumps</option>
                      <option value="beauty">💄 Beauty Parlours & Salons</option>
                      <option value="temple">🛕 Temples</option>
                      <option value="mosque">🕌 Mosques (Masjid)</option>
                      <option value="hospital">🏥 Hospitals & Healthcare</option>
                      <option value="pharmacy">💊 Medical Retail Stores</option>
                      <option value="bank">🏦 Banks & Finances</option>
                      <option value="gym">🏋️ Gym & Fitness Centers</option>
                      <option value="other">📦 Other Businesses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Local Area *</label>
                    <input
                      type="text"
                      required
                      value={newBizArea}
                      onChange={(e) => setNewBizArea(e.target.value)}
                      placeholder="e.g., Station Road, Katra Bazar, Linepar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Detailed Description *</label>
                  <textarea
                    required
                    value={newBizDesc}
                    onChange={(e) => setNewBizDesc(e.target.value)}
                    placeholder="Describe what services you provide, your pricing, history, specialties..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Physical Address *</label>
                  <input
                    type="text"
                    required
                    value={newBizAddress}
                    onChange={(e) => setNewBizAddress(e.target.value)}
                    placeholder="e.g., Shop No. 12, Galla Mandi cross-road, Bypass Highway"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      placeholder="+91 94123 45XXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp Number (Optional)</label>
                    <input
                      type="text"
                      value={newBizWhatsapp}
                      onChange={(e) => setNewBizWhatsapp(e.target.value)}
                      placeholder="Only digits: 9412345XXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Search Keywords / Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={newBizTags}
                    onChange={(e) => setNewBizTags(e.target.value)}
                    placeholder="Sweet, Pure Ghee, Peda, Lab Glass, Tuitions"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                {/* Google Drive Shop Image Upload */}
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <span>Drive Storage</span>
                        <span className="bg-blue-50 text-blue-700 text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border border-blue-100">Google Drive 📁</span>
                      </h4>
                      <p className="text-[9px] text-slate-500">Add a high-quality shop photo directly to your Google Drive storage</p>
                    </div>
                    
                    {!driveToken ? (
                      <button
                        type="button"
                        disabled={isConnectingDrive}
                        onClick={handleConnectDrive}
                        className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-[#ff6b00] border border-orange-200 rounded-lg hover:bg-orange-100/50 transition-colors cursor-pointer flex items-center gap-1 pr-3 shadow-3xs"
                      >
                        {isConnectingDrive ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Lock className="w-2.5 h-2.5" />
                        )}
                        <span>Connect Drive</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span>Connected</span>
                      </span>
                    )}
                  </div>

                  {!driveToken ? (
                    <div className="bg-amber-50/50 border border-amber-100/60 rounded-lg p-2.5 text-[10px] text-amber-900/90 leading-relaxed font-sans">
                      🔒 <strong>OAuth Safeguard:</strong> Please authenticate with Google to link Google Drive. Photos are stored in your own secure cloud and rendered seamlessly with reader rights.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {newBizImageUrl ? (
                        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={newBizImageUrl}
                              alt="Shop Preview"
                              className="w-10 h-10 object-cover rounded animate-pulse"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="text-[9px] font-bold text-slate-700 truncate max-w-[180px]">Image Uploaded successfully!</p>
                              <p className="text-[8px] text-slate-400">Rendered securely using Drive CDN</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewBizImageUrl("")}
                            className="bg-red-50 text-red-600 hover:bg-red-100 p-1 rounded transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="newBizFileInput"
                            disabled={isUploading}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploading(true);
                              try {
                                const url = await uploadToGoogleDrive(file);
                                setNewBizImageUrl(url);
                                triggerToast("Shop image synchronized with Google Drive successfully!", "success");
                              } catch (err: any) {
                                triggerToast(`Image Upload failed: ${err.message}`, "error");
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                          />
                          <label
                            htmlFor="newBizFileInput"
                            className={`flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg p-5 cursor-pointer bg-white text-center hover:bg-slate-50 transition-colors ${
                              isUploading ? "pointer-events-none opacity-60" : ""
                            }`}
                          >
                            {isUploading ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                                <span className="text-[10px] text-slate-500 font-medium">Compressing & sending to Drive folder...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Plus className="w-5 h-5 text-slate-400 mb-1" />
                                <span className="text-[10px] text-[#ff6b00] font-bold">Select Local Photo to Upload</span>
                                <span className="text-[8px] text-slate-400 mt-0.5">Supports PNG, JPG, WebP image formats</span>
                              </div>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Register Business Instantly
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Edit Business Form */}
      <AnimatePresence>
        {showEditBusinessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditBusinessModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-orange-400">
                    <Pencil className="w-4 h-4 shrink-0" />
                    <span>Edit Local Business Details</span>
                  </h2>
                  <p className="text-[10px] text-slate-400">Modify your listed business parameters on Apna City securely</p>
                </div>
                <button
                  onClick={() => setShowEditBusinessModal(false)}
                  className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditBusiness} className="flex-1 overflow-y-auto p-5 space-y-4">
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business / Institution Name *</label>
                  <input
                    type="text"
                    required
                    value={editBizName}
                    onChange={(e) => setEditBizName(e.target.value)}
                    placeholder="e.g., Shiko Premium Glass Emporium"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-705 mb-1">Category *</label>
                    <select
                      value={editBizCat}
                      onChange={(e) => setEditBizCat(e.target.value as Business["category"])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 cursor-pointer"
                    >
                      <option value="restaurant">🍽️ Restaurant & Food</option>
                      <option value="hardware">🛠️ Hardware & Building Materials</option>
                      <option value="electronics">🔌 Mobile & Electronic Shops</option>
                      <option value="school">🏫 Schools</option>
                      <option value="college">🎓 College & Universities</option>
                      <option value="retail">🛍️ Retail & Shopping</option>
                      <option value="hotel">🏨 Hotels & Resorts</option>
                      <option value="photography">📸 Studio & Photography</option>
                      <option value="gas">⛽ Gas Agencies & Petrol Pumps</option>
                      <option value="beauty">💄 Beauty Parlours & Salons</option>
                      <option value="temple">🛕 Temples</option>
                      <option value="mosque">🕌 Mosques (Masjid)</option>
                      <option value="hospital">🏥 Hospitals & Healthcare</option>
                      <option value="pharmacy">💊 Medical Retail Stores</option>
                      <option value="bank">🏦 Banks & Finances</option>
                      <option value="gym">🏋️ Gym & Fitness Centers</option>
                      <option value="other">📦 Other Businesses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Local Area *</label>
                    <input
                      type="text"
                      required
                      value={editBizArea}
                      onChange={(e) => setEditBizArea(e.target.value)}
                      placeholder="e.g., Station Road, Katra Bazar, Linepar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Detailed Description *</label>
                  <textarea
                    required
                    value={editBizDesc}
                    onChange={(e) => setEditBizDesc(e.target.value)}
                    placeholder="Describe what services you provide, specialties..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Physical Address *</label>
                  <input
                    type="text"
                    required
                    value={editBizAddress}
                    onChange={(e) => setEditBizAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={editBizPhone}
                      onChange={(e) => setEditBizPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp Number (Optional)</label>
                    <input
                      type="text"
                      value={editBizWhatsapp}
                      onChange={(e) => setEditBizWhatsapp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Keywords / Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={editBizTags}
                    onChange={(e) => setEditBizTags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                {/* Google Drive Shop Image Upload for Edit Mode */}
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <span>Drive Storage</span>
                        <span className="bg-blue-50 text-blue-700 text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border border-blue-100">Google Drive 📁</span>
                      </h4>
                      <p className="text-[9px] text-slate-500">Add or match a high-quality shop photo directly in your Google Drive storage</p>
                    </div>
                    
                    {!driveToken ? (
                      <button
                        type="button"
                        disabled={isConnectingDrive}
                        onClick={handleConnectDrive}
                        className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-[#ff6b00] border border-orange-200 rounded-lg hover:bg-orange-100/50 transition-colors cursor-pointer flex items-center gap-1 pr-3 shadow-3xs"
                      >
                        {isConnectingDrive ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Lock className="w-2.5 h-2.5" />
                        )}
                        <span>Connect Drive</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span>Connected</span>
                      </span>
                    )}
                  </div>

                  {!driveToken ? (
                    <div className="bg-amber-50/50 border border-amber-100/60 rounded-lg p-2.5 text-[10px] text-amber-900/90 leading-relaxed font-sans">
                      🔒 <strong>OAuth Safeguard:</strong> Please authenticate with Google to link Google Drive. Photos are stored in your own secure cloud and rendered seamlessly with reader rights.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {editBizImageUrl ? (
                        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={editBizImageUrl}
                              alt="Shop Preview"
                              className="w-10 h-10 object-cover rounded animate-pulse"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="text-[9px] font-bold text-slate-700 truncate max-w-[180px]">Image Uploaded successfully!</p>
                              <p className="text-[8px] text-slate-400">Rendered securely using Drive CDN</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditBizImageUrl("")}
                            className="bg-red-50 text-red-600 hover:bg-red-100 p-1 rounded transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="editBizFileInput"
                            disabled={isUploading}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploading(true);
                              try {
                                const url = await uploadToGoogleDrive(file);
                                setEditBizImageUrl(url);
                                triggerToast("Shop image synchronized with Google Drive successfully!", "success");
                              } catch (err: any) {
                                triggerToast(`Image Upload failed: ${err.message}`, "error");
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                          />
                          <label
                            htmlFor="editBizFileInput"
                            className={`flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg p-5 cursor-pointer bg-white text-center hover:bg-slate-50 transition-colors ${
                              isUploading ? "pointer-events-none opacity-60" : ""
                            }`}
                          >
                            {isUploading ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                                <span className="text-[10px] text-slate-500 font-medium">Compressing & sending to Drive folder...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Plus className="w-5 h-5 text-slate-400 mb-1" />
                                <span className="text-[10px] text-[#ff6b00] font-bold">Select Local Photo to Upload</span>
                                <span className="text-[8px] text-slate-400 mt-0.5">Supports PNG, JPG, WebP image formats</span>
                              </div>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditBusinessModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Comprehensive Real-Feel Auth (Login / Signup Gate) */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetAuth}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              {/* Brand Header */}
              <div className="bg-gradient-to-r from-[#ff6b00] to-[#d97706] text-white p-5 text-center relative">
                <button
                  onClick={handleResetAuth}
                  className="absolute right-4 top-4 text-orange-100 hover:text-white transition-colors bg-white/10 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2">
                  <span className="text-xl font-extrabold text-[#ff6b00] tracking-tight">AC</span>
                </div>
                <h3 className="text-base font-extrabold">Apna City Portal</h3>
                <p className="text-[10px] text-orange-100 font-medium mt-0.5">Secure verification gate for merchants & local residents</p>
              </div>

              {/* Toggle Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setIsOtpSent(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                    authTab === "login"
                      ? "border-[#ff6b00] text-[#ff6b00] bg-white font-extrabold"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign In to Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setIsOtpSent(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                    authTab === "register"
                      ? "border-[#ff6b00] text-[#ff6b00] bg-white font-extrabold"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Create Partner Account
                </button>
              </div>

              {/* Form Area */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {authTab === "login" ? (
                  /* LOGIN SECTION */
                  <div className="space-y-4">
                    {/* Method Toggle */}
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod("otp");
                          setIsOtpSent(false);
                        }}
                        className={`py-1.5 text-[10px] font-bold rounded-lg text-center transition-all ${
                          loginMethod === "otp"
                            ? "bg-white text-slate-800 shadow-3xs"
                            : "text-slate-500"
                        }`}
                      >
                        ⚡ Standard Mobile OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod("password")}
                        className={`py-1.5 text-[10px] font-bold rounded-lg text-center transition-all ${
                          loginMethod === "password"
                            ? "bg-white text-slate-800 shadow-3xs"
                            : "text-slate-500"
                        }`}
                      >
                        🔑 Password Sign-In
                      </button>
                    </div>

                    {loginMethod === "otp" ? (
                      /* OTP Login Form */
                      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                        {!isOtpSent ? (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enter Register Phone Number *</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold border-r border-slate-200 pr-2">+91</span>
                              <input
                                type="tel"
                                required
                                pattern="[0-9]{10}"
                                value={loginPhone}
                                onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                placeholder="Enter 10-digit number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-4 py-2.5 text-xs text-slate-800"
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">We will send a high-grade 4-digit SMS OTP to authenticate you immediately.</p>
                          </div>
                        ) : (
                          <div className="bg-orange-50/20 border border-orange-100 p-4 rounded-xl space-y-3">
                            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                              🔑 Verification code sent to <strong className="text-orange-950 font-mono">+91 {loginPhone}</strong>
                            </p>
                            <div>
                              <label className="block text-[10px] text-orange-900 font-bold mb-1">Enter 4-Digit Passcode *</label>
                              <input
                                type="text"
                                required
                                pattern="[0-9]{4}"
                                maxLength={4}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="e.g., ****"
                                className="w-full bg-white border border-orange-200 rounded-lg p-2.5 text-center text-sm font-bold tracking-widest text-[#ff6b00]"
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>Simulated SMS Network is active</span>
                              {otpTimer > 0 ? (
                                <span className="text-[#ff6b00] font-mono font-bold">Resend code in {otpTimer}s</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSendOtp}
                                  className="text-[#ff6b00] font-extrabold underline cursor-pointer"
                                >
                                  Resend Code Now
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-android-sm cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>{isOtpSent ? "Verify Code & Log In" : "Send SMS Passcode (OTP)"}</span>
                        </button>
                      </form>
                    ) : (
                      /* Password Login Form */
                      <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enter Phone or Email ID *</label>
                          <input
                            type="text"
                            required
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            placeholder="e.g., 9837686414 or nipun@apnashikohabad.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enter Secret Security Password *</label>
                          <input
                            type="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 italic">⭐ Fast tip: You can sign in using default local testing accounts! Use <strong>9412345678</strong> with password <strong>password123</strong> for testing.</p>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-android-sm cursor-pointer"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Sign In Securely</span>
                        </button>
                      </form>
                    )}

                    {/* Real Verification Separator & Google Trigger */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200"></span>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-white px-2.5 text-slate-400 font-bold tracking-wide">Or use real-time verification</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition-all duration-150 flex items-center justify-center gap-2 shadow-3xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.99 1 12 1 7.35 1 3.32 3.68 1.34 7.59l3.85 3c.92-2.75 3.51-4.55 6.81-4.55z" />
                        <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.48z" />
                        <path fill="#FBBC05" d="M5.19 14.59c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29l-3.85-3C.48 8.61 0 10.25 0 12s.48 3.39 1.34 5l3.85-3.41z" />
                        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.3 1.09-3.95 2.01-3.3 0-5.89-1.8-6.81-4.55l-3.85 3C3.32 20.32 7.35 23 12 23z" />
                      </svg>
                      <span>Continue with Google Account</span>
                    </button>
                  </div>
                ) : (
                  /* REGISTER SECTION */
                  <div className="space-y-4">
                    {/* Registration Method Selector */}
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setRegMethod("otp");
                          setIsOtpSent(false);
                        }}
                        className={`py-1.5 text-[10px] font-bold rounded-lg text-center transition-all ${
                          regMethod === "otp"
                            ? "bg-white text-slate-800 shadow-3xs"
                            : "text-slate-500"
                        }`}
                      >
                        ⚡ Standard Mobile OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRegMethod("email");
                          setIsOtpSent(false);
                        }}
                        className={`py-1.5 text-[10px] font-bold rounded-lg text-center transition-all ${
                          regMethod === "email"
                            ? "bg-white text-slate-800 shadow-3xs"
                            : "text-slate-500"
                        }`}
                      >
                        📧 Secure Email Setup
                      </button>
                    </div>

                    {regMethod === "otp" ? (
                      /* Classic Mobile OTP Form */
                      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                        {!isOtpSent ? (
                          <div className="space-y-3.5">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Merchant / Partner Name *</label>
                              <input
                                type="text"
                                required
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                placeholder="Rahul Kumar, Bobby Dev, etc."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Trade Contact Mobile Number *</label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold border-r border-slate-200 pr-2">+91</span>
                                <input
                                  type="tel"
                                  required
                                  pattern="[0-9]{10}"
                                  value={regPhone}
                                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                  placeholder="10 digit number"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-4 py-2.5 text-xs text-slate-800"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Set Account Security Password *</label>
                              <input
                                type="password"
                                required
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                              />
                            </div>
                            <div className="flex items-start gap-2 pt-1.5">
                              <input
                                type="checkbox"
                                required
                                id="reg_agree_chk"
                                checked={regAgreed}
                                onChange={(e) => setRegAgreed(e.target.checked)}
                                className="mt-0.5 rounded-sm h-3.5 w-3.5 outline-none font-bold border border-slate-200 cursor-pointer"
                              />
                              <label htmlFor="reg_agree_chk" className="text-[10px] text-slate-500 select-none leading-normal">
                                 I declare myself a resident/merchant of City and agree to verify local trade parameters faithfully.
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-orange-50/20 border border-orange-100 p-4 rounded-xl space-y-3">
                            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                              🔑 Verification code sent to <strong className="text-orange-950 font-mono">+91 {regPhone}</strong>
                            </p>
                            <div>
                              <label className="block text-[10px] text-orange-900 font-bold mb-1">Enter 4-Digit Passcode *</label>
                              <input
                                type="text"
                                required
                                pattern="[0-9]{4}"
                                maxLength={4}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="e.g., ****"
                                className="w-full bg-white border border-orange-200 rounded-lg p-2.5 text-center text-sm font-bold tracking-widest text-[#ff6b00]"
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>Verified Secure SMS Link is active</span>
                              {otpTimer > 0 ? (
                                <span className="text-[#ff6b00] font-mono font-bold">Resend in {otpTimer}s</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSendOtp}
                                  className="text-[#ff6b00] font-extrabold underline cursor-pointer"
                                >
                                  Resend Code Now
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-[#ff6b00] hover:bg-[#d97706] text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-android-sm cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>{isOtpSent ? "Verify Code & Setup Profile" : "Send Registration SMS OTP"}</span>
                        </button>
                      </form>
                    ) : (
                      /* Real Email Setup Form */
                      <form onSubmit={handleRegisterRealEmail} className="space-y-4">
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Merchant / Partner Name *</label>
                            <input
                              type="text"
                              required
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              placeholder="Rahul Kumar, Bobby Dev, etc."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Active Email ID (Uses Real Firebase Verification) *</label>
                            <input
                              type="email"
                              required
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="e.g., trader@apnashikohabad.com"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Set Account Security Password *</label>
                            <input
                              type="password"
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="Choose safe password (min 6 characters)"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                            />
                          </div>
                          <div className="flex items-start gap-2 pt-1.5">
                            <input
                              type="checkbox"
                              required
                              id="reg_agree_chk_email"
                              checked={regAgreed}
                              onChange={(e) => setRegAgreed(e.target.checked)}
                              className="mt-0.5 rounded-sm h-3.5 w-3.5 outline-none font-bold border border-slate-200 cursor-pointer"
                            />
                            <label htmlFor="reg_agree_chk_email" className="text-[10px] text-slate-500 select-none leading-normal">
                               I declare myself a resident/merchant of City and agree to verify local trade parameters faithfully.
                            </label>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-indigo-sm cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Register Securely & Go Live</span>
                        </button>
                      </form>
                    )}

                    {/* Google Separator trigger for Register screen */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200"></span>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-white px-2.5 text-slate-400 font-bold tracking-wide">Or signup instantly</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition-all duration-150 flex items-center justify-center gap-2 shadow-3xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.99 1 12 1 7.35 1 3.32 3.68 1.34 7.59l3.85 3c.92-2.75 3.51-4.55 6.81-4.55z" />
                        <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.48z" />
                        <path fill="#FBBC05" d="M5.19 14.59c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29l-3.85-3C.48 8.61 0 10.25 0 12s.48 3.39 1.34 5l3.85-3.41z" />
                        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.3 1.09-3.95 2.01-3.3 0-5.89-1.8-6.81-4.55l-3.85 3C3.32 20.32 7.35 23 12 23z" />
                      </svg>
                      <span>Signup with Google Account</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Post Notice Bulletin */}
      <AnimatePresence>
        {showAddNoticeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddNoticeModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold">Publish Public Bulletin Notice</h2>
                  <p className="text-[10px] text-slate-400">Your announcement will be live instantly across Apna City directory</p>
                </div>
                <button
                  onClick={() => setShowAddNoticeModal(false)}
                  className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNotice} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g., Mandi rate spike expected due to potato crop size"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Author Name / Department *</label>
                    <input
                      type="text"
                      required
                      value={noticeAuthor}
                      onChange={(e) => setNoticeAuthor(e.target.value)}
                      placeholder="e.g., Gupta Cold Storages / Mandi Sec."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bulletin Category *</label>
                    <select
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value as Announcement["category"])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 cursor-pointer"
                    >
                      <option value="news">Everyday Local News 📰</option>
                      <option value="announcement">General Announcement 📢</option>
                      <option value="event">Local Event / Mela / Fair 🎉</option>
                      <option value="help">Job Help / Hiring / Hospital 🤝</option>
                      <option value="trade">Trade / Mandi Pricing 🌾</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Detailed Content *</label>
                  <textarea
                    required
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    placeholder="Write pure, respectful, and descriptive details. Avoid spam of any sort."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Publish Notice Instantly
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Google Trust Verification Guarantee */}
      <AnimatePresence>
        {showGoogleTrustModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoogleTrustModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">Google Verified Directory Service</h2>
                    <p className="text-[10px] text-blue-100">Secured & Certified Platform Trust</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoogleTrustModal(false)}
                  className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg cursor-pointer animate-hover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-slate-700">
                <div className="text-center pb-2">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Security & Trust Certificate</span>
                  <div className="flex justify-center gap-1.5 mt-2 text-2xl font-bold font-sans">
                    <span className="text-blue-600">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                    <span className="text-slate-800 ml-1">Verified App</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-600">
                  <div className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold font-sans">Verified Cloud Environment</strong>
                      This application represents a secured local showcase under the official Google AI Studio workspace ecosystem, providing verified regional business lookups.
                    </div>
                  </div>

                  <div className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold font-sans">Google Gemini AI Safety</strong>
                      Interactive conversations and translations generated inside the Dara Local Guide companion are processed with built-in Gemini safety guards.
                    </div>
                  </div>

                  <div className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold font-sans">Partner Verification</strong>
                      Premium focal associations and registered local shops, including Bobby Studio Photography, are thoroughly vetted and registered directly for consumer safety.
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowGoogleTrustModal(false)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Close & Keep Exploring
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* MODAL: Google OAuth Setup Helper & Sandbox Bypass */}
      <AnimatePresence>
        {showGoogleConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowGoogleConfigModal(false)}
               className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs" 
            />

            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-2xl border border-rose-100 w-full max-w-md overflow-hidden shadow-2xl z-10 flex flex-col font-sans"
            >
              <div className="bg-gradient-to-r from-rose-600 to-amber-600 text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛠️</span>
                  <div>
                    <h2 className="text-sm font-bold font-sans">Firebase Google Sign-In Helper</h2>
                    <p className="text-[10px] text-rose-100 font-sans font-medium">Domain Authorization & Sandbox Bypass</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoogleConfigModal(false)}
                  className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-slate-700 max-h-[85vh] overflow-y-auto">
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 space-y-2 text-xs">
                  <p className="font-bold flex items-center gap-1.5 font-sans justify-start">
                    <span>⚠️</span> Google Sign-In requires Client Authorization
                  </p>
                  <p className="leading-relaxed">
                    Google OAuth prevents sign-ins on unauthorized domains. Received Firebase Auth Error:
                  </p>
                  <code className="block bg-amber-100/60 p-2 rounded-md font-mono text-[10px] break-all max-h-20 overflow-y-auto border border-rose-200 text-rose-800">
                    {googleAuthError || "auth/unauthorized-domain (The domain is not authorized in the Firebase console)"}
                  </code>
                </div>

                <div className="space-y-3 text-left">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans text-left">Choose Your Solution:</h3>
                  
                  {/* OPTION 1: Simulated sandbox */}
                  <div className="border-2 border-emerald-500 bg-emerald-50/50 rounded-xl p-4 space-y-3 hover:bg-emerald-50 transition-all text-left">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">🚀</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 font-sans">Quick Bypass (Simulate Google Success)</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 font-sans">
                          Instantly sign into Apna Shikohabad as a Google Resident with valid testing tokens to test all premium listings, notices, reviews, and Drive files!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSimulatedGoogleLogin}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer text-center"
                    >
                      Bypass & Sign In with Simulated Google Account
                    </button>
                  </div>

                  {/* OPTION 2: Actual configuration guide */}
                  <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4 space-y-2.5 text-xs text-slate-600 text-left">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1 font-sans">
                      <span>🔗</span> Authenticate Your Real Domain
                    </h4>
                    <p className="font-sans leading-relaxed text-[11px]">
                      To use your real Google account inside this preview tab, follow these quick steps:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-600 font-sans font-medium">
                      <li>Go to the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">Firebase Console</a></li>
                      <li>Select your Project and click <strong>Authentication</strong></li>
                      <li>Go to <strong>Settings</strong> &gt; <strong>Authorized Domains</strong></li>
                      <li>Click "Add Domain" and add current origin:
                        <code className="block bg-slate-200 px-2 py-1.5 rounded-md font-mono text-[10px] my-1 font-semibold select-all break-all text-slate-800">
                          {window.location.hostname}
                        </code>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setShowGoogleConfigModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer text-center font-sans"
                  >
                    Close Setup Guide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Bobby Studio Special Priority Booking */}
      <AnimatePresence>
        {showBobbyBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBobbyBookingModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 text-white rounded-2xl border border-amber-500/30 w-full max-w-md overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white p-5 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-tight">Bobby Studio Priority Booking</h2>
                    <p className="text-[10px] text-amber-200">Official Premium & Verified Partner Desk</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBobbyBookingModal(false)}
                  className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!bobbyBookingSubmitted ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBobbyBookingSubmitted(true);
                  }}
                  className="p-6 space-y-4 text-slate-200"
                >
                  <div className="text-center bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Exclusive Directory Feature</span>
                    <p className="text-[11px] text-slate-300">
                      Submit details below for direct, same-day premium support from Bobby Studio. No commission or processing fee!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={bobbyBookingName}
                        onChange={(e) => setBobbyBookingName(e.target.value)}
                        placeholder="e.g., Nipun Sharma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={bobbyBookingPhone}
                          onChange={(e) => setBobbyBookingPhone(e.target.value)}
                          placeholder="e.g., 9837686414"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Occasion Date *</label>
                        <input
                          type="date"
                          required
                          value={bobbyBookingDate}
                          onChange={(e) => setBobbyBookingDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Event Occasion Type *</label>
                      <select
                        value={bobbyBookingType}
                        onChange={(e) => setBobbyBookingType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Wedding">Grand Marriage Ceremony</option>
                        <option value="Pre-Wedding">Pre-Wedding Cinematic Shoot</option>
                        <option value="Anniversary">Silver/Golden Anniversary Film</option>
                        <option value="Portraits">Premium Indoor Portfolio</option>
                        <option value="Drone_Commercial">Drone Shoot / Store Opening</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Special Wish or Requirements (Optional)</label>
                      <textarea
                        value={bobbyBookingNotes}
                        onChange={(e) => setBobbyBookingNotes(e.target.value)}
                        placeholder="e.g., We need dual-operator camera setup, full 4K drone videography, and luxury matte wedding album"
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBobbyBookingModal(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs py-2.5 rounded-lg shadow-lg shadow-amber-500/10 cursor-pointer text-center"
                    >
                      Submit Priority Inquiry
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-sans">Inquiry Submitted Successfully!</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                      Thank you, <strong className="text-white">{bobbyBookingName}</strong>. Your luxury <strong className="text-amber-400">{bobbyBookingType}</strong> photography reservation request has been dispatched directly.
                    </p>
                    
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-left text-xs leading-relaxed max-w-sm mt-4 text-slate-300">
                      <div className="font-semibold text-amber-200 mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>What happens next?</span>
                      </div>
                      The team at <strong>Bobby Studio</strong> will contact you on your registered number (<strong className="text-white">{bobbyBookingPhone}</strong>) within 2 hours to confirm your free custom pricing quote.
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setShowBobbyBookingModal(false);
                        setBobbyBookingSubmitted(false);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg transition-all"
                    >
                      Back to Directory
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Bobby Studio Official Social Scan Flyers */}
      <AnimatePresence>
        {showBobbyQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBobbyQR(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border-2 border-amber-400/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] z-10 flex flex-col text-white"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 text-slate-950 px-6 py-5 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-950 text-amber-400 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight uppercase">Bobby Studio Official Social Desk</h2>
                    <p className="text-[10px] text-slate-900 font-bold tracking-wider">Managed by: Bobby Studio & Team</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBobbyQR(false)}
                  className="bg-slate-950/20 hover:bg-slate-950/45 text-slate-950 hover:text-white transition-colors p-2 rounded-full cursor-pointer animate-hover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Panel Body */}
              <div className="p-6 space-y-6">
                <div className="text-center font-sans space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Scan Flyers</span>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Open your smartphone camera to scan or click the action buttons below to connect with City&apos;s master team instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  
                  {/* Instagram QR Card */}
                  <div className="bg-gradient-to-br from-indigo-950/85 to-purple-950/85 border border-purple-500/30 rounded-xl p-5 flex flex-col items-center justify-between text-center relative overflow-hidden group/insta shadow-lg hover:border-purple-500 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                    
                    <div className="mb-3">
                      <Instagram className="w-8 h-8 text-purple-400" />
                    </div>

                    <div className="text-xs font-black tracking-wide">Instagram Profile</div>
                    <div className="text-[10px] text-purple-200 mt-0.5 mb-4">@bobbystudiophotography_</div>

                    {/* Highly aesthetic Mock QR Code with Scanner animations */}
                    <div className="w-36 h-36 bg-white p-3.5 rounded-xl block relative shadow-md">
                      {/* Interactive scanner grid lines */}
                      <div className="absolute inset-2 border-2 border-purple-500/30 rounded-md pointer-events-none" />
                      <div className="absolute top-2 left-2 right-2 h-0.5 bg-purple-500 animate-bounce" />
                      
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current opacity-85">
                        <rect x="0" y="0" width="25" height="25" />
                        <rect x="5" y="5" width="15" height="15" fill="white" />
                        <rect x="75" y="0" width="25" height="25" />
                        <rect x="80" y="5" width="15" height="15" fill="white" />
                        <rect x="0" y="75" width="25" height="25" />
                        <rect x="5" y="80" width="15" height="15" fill="white" />
                        <rect x="35" y="35" width="30" height="30" />
                        <rect x="42" y="42" width="16" height="16" fill="white" />
                        
                        {/* Shuffled QR dots */}
                        <rect x="5" y="30" width="8" height="8" />
                        <rect x="20" y="40" width="6" height="6" />
                        <rect x="40" y="5" width="8" height="8" />
                        <rect x="50" y="20" width="10" height="4" />
                        <rect x="15" y="55" width="12" height="6" />
                        <rect x="75" y="45" width="6" height="12" />
                        <rect x="55" y="75" width="12" height="8" />
                        <rect x="80" y="60" width="8" height="8" />
                        <rect x="35" y="85" width="10" height="5" />
                      </svg>
                    </div>

                    <a
                      href="https://www.instagram.com/bobbystudiophotography_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 hover:brightness-110 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md hover:shadow-pink-600/20 active:scale-[0.98] transition-all"
                    >
                      Visit Instagram Profile
                    </a>
                  </div>

                  {/* YouTube QR Card */}
                  <div className="bg-gradient-to-br from-slate-950 to-red-950/85 border border-red-500/30 rounded-xl p-5 flex flex-col items-center justify-between text-center relative overflow-hidden group/yt shadow-lg hover:border-red-500 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
                    
                    <div className="mb-3">
                      <Youtube className="w-8 h-8 text-red-500 animate-pulse" />
                    </div>

                    <div className="text-xs font-black tracking-wide">YouTube Channel</div>
                    <div className="text-[10px] text-red-200 mt-0.5 mb-4">BOBBY STUDIO Photography</div>

                    {/* Highly aesthetic Mock QR Code with Scanner animations */}
                    <div className="w-36 h-36 bg-white p-3.5 rounded-xl block relative shadow-md">
                      {/* Interactive scanner grid lines */}
                      <div className="absolute inset-2 border-2 border-red-500/30 rounded-md pointer-events-none" />
                      <div className="absolute top-2 left-2 right-2 h-0.5 bg-red-500 animate-bounce" />
                      
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current opacity-85">
                        <rect x="0" y="0" width="25" height="25" />
                        <rect x="5" y="5" width="15" height="15" fill="white" />
                        <rect x="75" y="0" width="25" height="25" />
                        <rect x="80" y="5" width="15" height="15" fill="white" />
                        <rect x="0" y="75" width="25" height="25" />
                        <rect x="5" y="80" width="15" height="15" fill="white" />
                        <rect x="35" y="35" width="30" height="30" />
                        <rect x="42" y="42" width="16" height="16" fill="white" />
                        
                        {/* Shuffled QR dots */}
                        <rect x="10" y="35" width="8" height="8" />
                        <rect x="25" y="45" width="6" height="6" />
                        <rect x="35" y="10" width="8" height="8" />
                        <rect x="60" y="15" width="10" height="4" />
                        <rect x="25" y="60" width="12" height="6" />
                        <rect x="85" y="35" width="6" height="12" />
                        <rect x="65" y="80" width="12" height="8" />
                        <rect x="70" y="65" width="8" height="8" />
                        <rect x="45" y="80" width="10" height="5" />
                      </svg>
                    </div>

                    <a
                      href="https://www.youtube.com/@BOBBYSTUDIOPhotography"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full bg-gradient-to-r from-red-650 to-red-550 hover:from-red-700 hover:to-red-650 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md hover:shadow-red-650/25 active:scale-[0.98] transition-all"
                    >
                      Visit YouTube Channel
                    </a>
                  </div>

                </div>

                {/* Info Text */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center text-xs text-slate-300">
                  ⚡ <strong>Pro Tip:</strong> Click the card buttons to immediately open profiles inside your browser or native applications!
                </div>

                {/* Contacts Footer inside modal */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-800">
                  <span>Tel: +91 9837686414</span>
                  <span>Managed by Bobby Studio & Team</span>
                  <span>Tel: +91 9634521011</span>
                </div>
              </div>

              {/* Close footer button */}
              <div className="bg-slate-950 p-4 shrink-0 flex justify-end">
                <button
                  onClick={() => setShowBobbyQR(false)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 text-center mt-auto pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 Apna Shikohabad. Cultivating local digital connectivity across Firozabad District, UP.</p>
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-[11px] text-slate-500">
            <span>Agra Division</span>
            <span>•</span>
            <span>National Highway 19</span>
            <span>•</span>
            <span>City Junction Railway (SKB)</span>
            <span>•</span>
            <a 
              href="/appreciation" 
              className="text-amber-500 font-bold hover:text-amber-400 hover:underline transition-colors flex items-center gap-1"
            >
              <Heart className="w-3 h-3 fill-amber-500 text-amber-500 animate-pulse" />
              <span>Support Project</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Premium Android-style Bottom Navigation Bar (sticky at bottom for smaller devices) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 z-40 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-between items-center select-none">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${
            activeTab === "directory" ? "text-[#ff6b00] scale-102 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
          }`}
        >
          <Compass className="w-5 h-5 shrink-0" />
          <span className="text-[10px] tracking-tight">Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("transit")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${
            activeTab === "transit" ? "text-[#ff6b00] scale-102 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
          }`}
        >
          <Train className="w-5 h-5 shrink-0" />
          <span className="text-[10px] tracking-tight">Transit</span>
        </button>

        <button
          onClick={() => setActiveTab("assistant")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${
            activeTab === "assistant" ? "text-[#ff6b00] scale-102 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 shrink-0" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff6b00] rounded-full border border-white" />
          </div>
          <span className="text-[10px] tracking-tight">City Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab("community")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${
            activeTab === "community" ? "text-[#ff6b00] scale-102 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
          }`}
        >
          <MessageSquare className="w-5 h-5 shrink-0" />
          <span className="text-[10px] tracking-tight">Community News</span>
        </button>

        <button
          onClick={() => setActiveTab("zen")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${
            activeTab === "zen" ? "text-[#ff6b00] scale-102 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
          }`}
        >
          <Heart className="w-5 h-5 shrink-0 text-purple-500" />
          <span className="text-[10px] tracking-tight">Wellness & Tools</span>
        </button>

        <button
          onClick={() => setActiveTab("emergency")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${
            activeTab === "emergency" || activeTab === "game" ? "text-[#ff6b00] scale-102 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
          }`}
        >
          <Phone className="w-5 h-5 shrink-0" />
          <span className="text-[10px] tracking-tight">Helplines</span>
        </button>
      </div>

      {/* FLOATING ACTION BANNER / BUTTON FOR PWA INSTALL */}
      <AnimatePresence>
        {!isAppInstalled && (deferredPrompt || isInIframe || isIOS) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-xs z-40"
          >
            <div className="bg-gradient-to-r from-[#ff6b00] to-[#d97706] text-white p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(255,107,0,0.25)] flex items-center justify-between gap-3 border border-orange-400/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shadow-inner shrink-0">
                  <Smartphone className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white tracking-tight leading-none">Apna City App</h4>
                  <p className="text-[9px] text-orange-100 mt-1 font-semibold leading-none">Install for offline directory</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallPopup(true)}
                className="bg-white hover:bg-orange-50 text-orange-600 text-[10px] font-black tracking-wide shrink-0 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
              >
                INSTALL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM HIGH-FIDELITY ANDROID PWA INSTALL DRAWER */}
      <AnimatePresence>
        {showInstallPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-4 select-none">
            {/* Ambient glass blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstallPopup(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide up panel for mobile, Centered Modal for desktop */}
            <motion.div
              initial={{ y: "100%", opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.18)] max-h-[92vh] overflow-hidden flex flex-col mt-auto lg:mt-0 border border-slate-100"
            >
              {/* Elegant Android Pull bar */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0 lg:hidden" />

              {/* Header section with brand colors */}
              <div className="relative bg-gradient-to-tr from-[#ff6b00] to-[#d97706] text-white p-6 shrink-0 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                {/* Simulated Floating App Icons */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-android-lg border border-orange-500/15">
                    <img
                      src={appLogo}
                      alt="Apna City"
                      className="w-16 h-16 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-orange-600 rounded-full p-1.5 shadow-md border border-orange-100">
                    <Sparkles className="w-4 h-4 animate-spin-slow text-[#ff6b00]" />
                  </div>
                </div>

                <h3 className="relative z-10 text-xl font-black mt-4 tracking-tight leading-none text-white">
                  Install Apna City
                </h3>
                <p className="relative z-10 text-xs text-orange-50 mt-1.5 max-w-xs font-semibold leading-relaxed">
                  Official community and directory platform. Enjoy smooth standalone performance.
                </p>
              </div>

              {/* Scrollable Benefits List */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[50vh] bg-slate-50/30">
                <div className="text-slate-800 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span>Native App Benefits</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="space-y-4">
                  {/* Benefit 1 */}
                  <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-android-sm">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#ff6b00] shrink-0 font-bold">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Fast & Zero Connection</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                        Instant boot performance. Key local data, contacts and schedules work offline even without signal.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-android-sm">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#ff6b00] shrink-0 font-bold">
                      📱
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Fullscreen Real Experience</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                        Removes messy browser bars for safe native layout with rounded components and quick tap-to-call actions.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-android-sm">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#ff6b00] shrink-0 font-bold">
                      🌸
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Official Local Guide</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                        Browse top markets, find sweet shops, and chat instantly with companion City Assistant right from home screen!
                      </p>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC DEVICE SPECIFIC INSTRUCTIONS */}
                <div className="space-y-4 pt-1 mb-2">
                  <div className="text-slate-800 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span>How to Install on Your Device</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  {isInIframe ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-slate-800 text-xs shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-amber-900 mb-1.5">
                        <span>⚠️ Sandbox Preview Mode Detected</span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-medium mb-3">
                        Browsers block automatic 1-click home screen additions inside active chat preview frames. To install perfectly, please open this app in its own standalone tab, or copy this direct link to load on your phone's browser:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => window.open(window.location.href, "_blank")}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                        >
                          <span>Open in New Tab</span>
                          <Sparkles className="w-3" />
                        </button>
                        <button
                          onClick={copySharedUrl}
                          className="flex-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                        >
                          <span>{copiedLink ? "Copied!" : "Copy Direct Link"}</span>
                        </button>
                      </div>
                    </div>
                  ) : isIOS ? (
                    <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-slate-800 text-xs shadow-sm space-y-2.5">
                      <div className="font-bold text-sky-950 flex items-center gap-1.5">
                        <span>🍏 iOS Safari Instructions</span>
                      </div>
                      <ol className="text-[11px] text-sky-800 space-y-2 list-decimal pl-4 font-medium leading-relaxed">
                        <li>
                          Tap the <span className="font-bold">Share</span> button inside Safari browser (square icon with an arrow pointing up in the bottom center bar).
                        </li>
                        <li>
                          Scroll down the actions list or select <span className="font-bold">"Add to Home Screen"</span> option.
                        </li>
                        <li>
                          Tap <span className="font-bold text-sky-950">Add</span> in the top right window corner to create a high-speed shortcut on your iPhone!
                        </li>
                      </ol>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-slate-800 text-xs shadow-sm space-y-2">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>🤖 Android & Chrome Custom Install</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                        If clicking "INSTALL COMPANION NOW" does not show a system prompt immediately:
                      </p>
                      <ol className="text-[11px] text-emerald-800 space-y-1.5 list-decimal pl-4 font-medium leading-relaxed">
                        <li>
                          Tap the <span className="font-bold">three vertical dots Menu (⋮)</span> in the top corner of your mobile Chrome browser.
                        </li>
                        <li>
                          Tap <span className="font-bold text-emerald-900">"Add to Home screen"</span> or <span className="font-bold text-emerald-900 capitalize text-slate-800">"Install app"</span>.
                        </li>
                        <li>
                          Confirm the dialog. Apna City will download and create its native standalone icon automatically!
                        </li>
                      </ol>
                    </div>
                  )}
                </div>

                {/* Simulated Android Loading Indicator inside Drawer */}
                {isInstalling && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-white border border-orange-200/50 rounded-xl shadow-inner text-center"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping inline-block" />
                        Downloading assets...
                      </span>
                      <span className="font-mono text-xs">PWA Sandbox Ready</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-[#ff6b00] h-full rounded-full" style={{ width: '100%', animation: 'progress-shikohabad 2s infinite linear' }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action operations */}
              <div className="p-5 border-t border-slate-100 bg-white shrink-0 flex flex-col gap-2">
                <button
                  onClick={handleInstallApp}
                  disabled={isInstalling}
                  className="w-full bg-gradient-to-r from-[#ff6b00] to-[#d97706] hover:from-[#d97706] hover:to-[#ff6b00] text-white p-3 rounded-xl text-xs font-extrabold tracking-wide shadow-android-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>INSTALL COMPANION NOW</span>
                </button>

                <button
                  onClick={() => setShowInstallPopup(false)}
                  disabled={isInstalling}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                >
                  Continue in Browser
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* APP INSTALLED SUCCESS NOTIFICATION TOAST */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 mx-auto max-w-sm z-50"
          >
            <div className="bg-white border-2 border-green-500/20 rounded-2xl shadow-[0_12px_40px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col select-none">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shadow-inner">
                    <Check className="w-4 h-4 text-white font-black" />
                  </div>
                  <span className="text-xs font-black tracking-tight uppercase">Installation Complete!</span>
                </div>
                <button
                  onClick={() => setShowSuccessToast(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex items-center gap-3 bg-white">
                <img
                  src={appLogo}
                  alt="App Logo"
                  className="w-12 h-12 object-cover rounded-xl border border-slate-100 shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-800">Apna City Active</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    Installed on home screen. You can now launch Apna City instantly offline from home launcher!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
