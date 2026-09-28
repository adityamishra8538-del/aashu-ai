const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/ask-ai", async (req, res) => {
    try {
        const question = req.body.question;

        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen2.5:3b",
                prompt: `You are Aashu AI, a helpful AI study assistant.

Answer the user's question clearly.
Use simple Hinglish when appropriate.
For educational questions, explain step-by-step.
For exam questions, also give an exam-ready answer.

User question:
${question}`,
                stream: false
            })
        });

        const data = await response.json();

        res.json({
            answer: data.response
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            answer: "AI se connection nahi ho pa raha."
        });
    }
});

app.listen(3000, () => {
    console.log("Aashu AI running at http://localhost:3000");
});