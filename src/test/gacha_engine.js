import { BlueArchiveGacha } from "../lib/gacha_engine.js";
const engine = new BlueArchiveGacha();
await engine.loadsAll()
console.log(await engine.roll(10))