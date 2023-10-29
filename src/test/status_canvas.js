import { StatusCard } from "../lib/canvas.js";

const canvas = new StatusCard();
await canvas.new();
canvas.save("test");