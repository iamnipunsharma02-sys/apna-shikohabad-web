import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

dotenv.config();

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("GEMINI_API_KEY environment variable is not defined. AI Chat will not function.");
}

// Helper to resolve PWA static files dynamically from public, dist, or workspace root directories
const getPWAFilePath = (fileName: string): string => {
  const paths = [
    path.resolve(process.cwd(), "public", fileName),
    path.resolve(process.cwd(), "dist", fileName),
    path.resolve(process.cwd(), fileName),
    path.resolve(_dirname, fileName),
    path.resolve(_dirname, "..", "public", fileName),
    path.resolve(_dirname, "..", "dist", fileName),
    path.resolve(_dirname, "..", fileName)
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  // Fallback to public if no physical file was found on the disk (express will fail appropriately if missing)
  return path.resolve(process.cwd(), "public", fileName);
};

// CORS Custom Middleware for PWA and API compliance - Handles OPTIONS preflights gracefully
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Serve PWA critical files directly at root with correct MIME types, CORS headers, and caching directives
app.get("/sw.js", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.sendFile(getPWAFilePath("sw.js"));
});

app.get("/manifest.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(getPWAFilePath("manifest.json"));
});

app.get("/icon-192.png", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, max-age=31536000");
  res.sendFile(getPWAFilePath("icon-192.png"));
});

app.get("/icon-512.png", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, max-age=31536000");
  res.sendFile(getPWAFilePath("icon-512.png"));
});

app.get("/screenshot-mobile.png", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, max-age=172800"); // 2 days
  res.sendFile(getPWAFilePath("screenshot-mobile.png"));
});

app.get("/screenshot-desktop.png", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, max-age=172800"); // 2 days
  res.sendFile(getPWAFilePath("screenshot-desktop.png"));
});

// API: Check AI capability status
app.get("/api/status", (req: Request, res: Response) => {
  res.json({
    aiAvailable: !!ai,
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Route for the premium Appreciation page
app.get("/appreciation", (req: Request, res: Response) => {
  res.sendFile(getPWAFilePath("appreciation.html"));
});

// API: Dara, the AI City Guide Chat
app.post("/api/chat", async (req: Request, res: Response) => {
  const { messages } = req.body;
  console.log("[server] Received message request:", messages ? messages.length : 0, "messages");

  if (!ai) {
    console.log("[server] AI Client is not initialized.");
    return res.status(503).json({
      error: "AI service is currently unavailable. Please verify GEMINI_API_KEY is configured in Settings > Secrets.",
    });
  }

  if (!messages || !Array.isArray(messages)) {
    console.log("[server] Invalid messages payload.");
    return res.status(400).json({ error: "Invalid request payload. Expected 'messages' array." });
  }

  try {
    // Convert conversational message array into a form suitable for Gemini
    const lastMessage = messages[messages.length - 1];
    console.log("[server] Prepared lastMessage:", lastMessage);
    
    // We rebuild a conversational prompt
    const chatHistoryPrompt = messages.map(m => `${m.role === 'user' ? 'Visitor' : 'Dara'}: ${m.content}`).join("\n");
    const prompt = `${chatHistoryPrompt}\n\nProvide the next response as Dara, continuing the conversation in a friendly, conversational tone.`;
    console.log("[server] Built prompting chain, initiating Gemini call to gemini-3.5-flash...");

    const startTime = Date.now();
    let response;
    const systemInstruction = `You are Dara, an incredibly welcoming, highly knowledgeable, and cultured AI Local Guide for the city of Shikohabad (Firozabad District, Uttar Pradesh, India). 
Named after prince Dara Shikoh (the scholar-brother of Aurangzeb who founded the modern township as a secure military/scout post), you have deep historical roots. 
Your goals:
1. Speak warmly and respectfully, blending Hindi words appropriately like "Namaste", "Aap", "Aaiye", "Jarur". Refer to Shikohabad affectionately as "Poori Shaan" or "Apna Shikohabad".
2. Educate visitors about the famous aspects of Shikohabad:
   - History: Named after Dara Shikoh. Historically connected to the Mughal route.
   - Cuisine: Celebrated sweets, particularly our decadent "Peda", "Rabri", and thick creamy milk sweets from local halwais in Katra Bazar or Station Road.
   - Industries: While neighboring Firozabad is "Suhaag Nagari" of glass bangles, Shikohabad is a pivotal glass-molding and manufacturing hub itself, along with rich agriculture (known for its massive cold storage, potato trade, high-yield seeds).
   - Education: A prime educational hub for the region, housing reputable historical colleges like Narain College, Ahir Kshatriya College (AK College), and the sprawling JS University.
   - Geography & Transit: Set perfectly on National Highway 19 (linking Delhi to Kolkata). Near the famous Taj Expressway. It features the historic Shikohabad Junction Railway Station (SKB) with prompt connections to Agra, Kanpur, and Delhi.
3. Be concise, keeping responses around 2-3 short, engaging paragraphs, fully formatted in clean Markdown.
4. Keep the conversation focused purely on Shikohabad. Avoid general-purpose AI talk. Always welcome people to our lovely city.`;

    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      console.log("[server] Gemini call completed in", Date.now() - startTime, "ms with gemini-3.5-flash");
    } catch (primaryError: any) {
      console.warn("[server] Primary model gemini-3.5-flash failed, attempting fallback to gemini-3.1-flash-lite:", primaryError.message || primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        console.log("[server] Springback Gemini call completed in", Date.now() - startTime, "ms with gemini-3.1-flash-lite fallback");
      } catch (fallbackError: any) {
        console.error("[server] Both primary and fallback models failed. Throwing original error.");
        throw primaryError;
      }
    }

    const reply = response.text || "I apologize, but I couldn't generate a response. Please try again!";
    console.log("[server] Generated reply:", reply ? reply.substring(0, 60) : "empty");
    res.json({ reply });
  } catch (error: any) {
    console.error("[server] Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred while communicating with the AI Model.",
    });
  }
});

// Configure Vite or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    let distPath = path.join(process.cwd(), "dist");
    if (!fs.existsSync(distPath) || !fs.existsSync(path.join(distPath, "index.html"))) {
      if (fs.existsSync(path.join(_dirname, "index.html"))) {
        distPath = _dirname;
      } else if (fs.existsSync(path.join(_dirname, "dist", "index.html"))) {
        distPath = path.join(_dirname, "dist");
      } else if (fs.existsSync(path.join(_dirname, "..", "dist", "index.html"))) {
        distPath = path.join(_dirname, "..", "dist");
      }
    }
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Apna Shikohabad] Server running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV}`);
  });
}

startServer();
