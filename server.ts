import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development with Vite
  }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiter to API routes
  app.use("/api/", limiter);

  app.use(express.json({ limit: "10kb" })); // Limit body size to prevent DoS

  // API Route for Discord Webhook
  app.post("/api/submit-form", async (req, res) => {
    // Basic Origin Check
    const origin = req.get("origin");
    const host = req.get("host");
    
    // In development, origin might be missing or different, but in production we want to be strict
    if (process.env.NODE_ENV === "production" && origin && !origin.includes(host || "")) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Basic Input Validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Empty submission" });
    }

    // Honeypot Check
    if (req.body.website) {
      console.log("Bot detected via honeypot");
      return res.json({ success: true, message: "Submission received" }); // Stealth: return fake success
    }

    // Bot Detection via User-Agent and Headers
    const userAgent = req.headers['user-agent'] || "";
    const secChUa = req.headers['sec-ch-ua'] || "";
    const secFetchDest = req.headers['sec-fetch-dest'] || "";
    
    const botPatterns = [
      "bot", "crawler", "spider", "headless", "phantomjs", "selenium", 
      "googlebot", "bingbot", "yandexbot", "duckduckbot", "slurp", 
      "baiduspider", "facebot", "ia_archiver", "curl", "wget", "python-requests",
      "puppeteer", "playwright", "cypress"
    ];
    
    const isBotUA = botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern));
    const isHeadlessHeader = secChUa.includes("Headless") || (secFetchDest === "empty" && !req.xhr);

    if (isBotUA || isHeadlessHeader) {
      console.log("Bot detected via headers:", { userAgent, secChUa, secFetchDest });
      return res.json({ success: true, message: "Submission received" }); // Stealth: return fake success
    }

    // Prevent massive payloads
    if (JSON.stringify(req.body).length > 5000) {
      return res.status(400).json({ error: "Payload too large" });
    }

    try {
      // Small random delay to slow down automated scanners
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const payload = {
        content: "New Form Submission",
        embeds: [
          {
            title: "Form Data",
            color: 5814783, // Blurple
            fields: [
              ...Object.entries(req.body).map(([key, value]) => ({
                name: key,
                value: String(value) || "N/A",
                inline: true,
              })),
              { name: "IP Address", value: String(ip) || "Unknown", inline: false },
              { name: "User Agent", value: String(userAgent) || "Unknown", inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const discordResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!discordResponse.ok) {
        throw new Error(`Discord API responded with ${discordResponse.status}`);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error submitting to Discord:", error);
      res.status(500).json({ error: "Failed to submit form" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
