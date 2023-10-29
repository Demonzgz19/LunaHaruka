import { BlueArchiveInvCard } from "../lib/canvas.js";

const canvas = new BlueArchiveInvCard();
await canvas.new();
canvas.save("test");