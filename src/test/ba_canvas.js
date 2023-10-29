import { BlueArchiveCard } from "../lib/canvas.js";

const canvas = new BlueArchiveCard();
await canvas.new(null, null, true);
canvas.save("test");