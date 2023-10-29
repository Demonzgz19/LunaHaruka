import Clients from "./lib/clients.js";
import { Commands } from "./lib/commands.js";
import { BlueArchiveGacha } from "./lib/gacha_engine.js";
import Database from "./lib/database.js";
import Users from "./controller/users.js";


const client = new Clients("./src/session/c.json");
const database = new Database("src/database/data.db");
const commands = new Commands();
const ba_engine = new BlueArchiveGacha();
await ba_engine.loadsAll()
commands.loadsAll(console.log);

database.on("initialized", (res) => {
    console.log(res);
    database.close();
});

database.on("error", console.error);

client.on("message", async (api, events) => {
    if (!events.isGroup) return;
    const users = new Users(events.senderID, database, api, events);
    commands.users = await users;
    commands.users_data = await users.gets();
    commands.ba_engine = ba_engine;
    users.__add_exp(50);
    users.__add_chat();
    await users.__reload();
    
    if (events.body[0] === commands.config.prefix){
        const text = events.body.trim().match(/([\S]+)(?:[ \n]+([\S\s]+))?/);
        commands.execute(api, events, text, users);
    }else{
        commands.execute_events(api, events);
    }
});

client.on("error", client.start);

client.start();