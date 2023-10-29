import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";
import { StatusCard } from "../lib/canvas.js";

const status = new CommandsBuilder("status");
status.description("Get your basic user status card.");
status.cooldown(200000);
status.groups("Users");
status.runs(async (clients, events, { users }) => {
    try{
        
        const canvas = new StatusCard();
        await canvas.new(await users.gets());
        await canvas.save(events.senderID);
        await clients.sendMessage({ attachment: canvas.load() }, events.threadID);
        canvas.delete();
    }catch(error){
        clients.sendMessage(`Failed sending message ${error.message}`, events.threadID);
    }
});


export default status;