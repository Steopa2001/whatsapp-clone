// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessages = req.body.messages; // array di messaggi (testo)
    const systemPrompt = req.body.systemPrompt;

    const formattedChat = [];

    // Aggiungo il systemPrompt come primo messaggio
    formattedChat.push({
      role: "user",
      parts: [{ text: systemPrompt }],
    });

    // Aggiungo i messaggi utente/model
    for (const message of userMessages) {
      formattedChat.push({
        role: message.type === "sent" ? "user" : "model",
        parts: [{ text: message.text }],
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedChat }),
    });

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Ops, non riesco a rispondere adesso 😅";

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel server" });
  }
});

// facoltativo: servire i file statici
app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
