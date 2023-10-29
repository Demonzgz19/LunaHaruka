import { CommandsBuilder } from "../lib/commands.js";
import { BlueArchiveCard, BlueArchiveInvCard } from "../lib/canvas.js";
import { bold } from "../lib/style.js";

const ba = new CommandsBuilder("ba");
ba.description("Gacha and sell Blue Archive card.");
ba.groups("Gacha");
ba.arguments_status("Required");
ba.arguments(["sub-command", "sub-command"]);
ba.permissions(1);
ba.cooldown(1000);
ba.runs(async (client, events, { input, users, ba_engine }) => {
    const [key, args] = input.split(" ");
    
    switch (key){
        case "pull":
            await pull();
            break;
        case "bulk":
            await bulk();
            break;
        case "show":
            await show();
            break;
        case "inv":
            await inv();
            break;
    }
    
    async function inv(){
        const canvas = new BlueArchiveInvCard();
        await canvas.new();
        canvas.save("test");
        await client.sendMessage({attachment: canvas.load()}, events.threadID);
        canvas.delete();
    }
    
    async function show(){
        if (!args) return;
        if (typeof Number(args) !== "number") return;
        const data = ba_engine.item.find(data => data.id === Number(args));
        if (data){
            const card = new BlueArchiveCard();
            await card.new(data, users, true);
            await card.save(events.senderID);
            await client.sendMessage({attachment: card.load()}, events.threadID);
            card.delete();
        }else{
            client.sendMessage("You do not own that card.", events.threadID);
        }
    }
    
    async function bulk(){
        const num = Number(args);
        if (typeof num !== "number") return;
        const item = await ba_engine.roll(num);
        console.log(item);
        let text = bold("# Gacha Pull (Bulk)\n");
        item.map(data => text += `\n${bold(`#${data.id}`)}: ${data.name} (${data.rarity.toUpperCase()}★)`)
        client.sendMessage(text, events.threadID);
    }
    
    async function pull(){
        const item = await ba_engine.roll(1);
        console.log(item);
        const card = new BlueArchiveCard();
        await card.new(item[0], users);
        await card.save(events.senderID);
        await client.sendMessage({attachment: card.load()}, events.threadID);
        card.delete();
    }
});

export default ba;