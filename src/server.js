import "./index.js";
import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Bot started.");
});

app.listen(3000);