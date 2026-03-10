import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Discord Webhook
  app.post("/api/submit-form", async (req, res) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    try {
      const payload = {
        content: "New Form Submission",
        embeds: [
          {
            title: "Form Data",
            color: 5814783, // Blurple
            fields: Object.entries(req.body).map(([key, value]) => ({
              name: key,
              value: String(value) || "N/A",
              inline: true,
            })),
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
