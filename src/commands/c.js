import { CommandsBuilder } from "../lib/commands.js";
import { BlueArchiveGacha } from "../lib/gacha_engine.js";
import { exec } from "child_process";
import { inspect } from "util";

const c = new CommandsBuilder("c");
c.description("Cardinal Internal Command & Owner utilities.");
c.groups("Misc");
c.arguments_status("Optional");
c.arguments(["task"]);
c.permissions(1);
c.cooldown(10000);
c.runs(async (client, events, { input, users_data, users, all_cmd }) => {
    const [key, ...args] = input.split(" ") || [];
    
    switch (key){
        case "debug":
            await debug();
            break;
        case "konsole":
            await console();
            break;
    }
    
    async function console(){
        await exec(args.join(" "), (stderr, stdout) => {
            if (stderr) return client.sendMessage(stderr || "Error", events.threadID);
            client.sendMessage(stdout || "Done", events.threadID);
        });
    }
    
    async function debug(){
        let evaled = await eval(args.join(" "));
        if (typeof evaled !== "string") evaled = inspect(evaled);
        
        client.sendMessage(evaled || "Done.", events.threadID);
    }
});

export default c;