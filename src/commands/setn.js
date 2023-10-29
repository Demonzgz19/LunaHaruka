import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";

const setn = new CommandsBuilder("setn");
setn.description("Set your username for your account.");
setn.permissions(0);
setn.arguments(["username"]);
setn.arguments_status("Required");
setn.prices(0.5);
setn.groups("Users");
setn.cooldown(10000);
setn.runs(async (client, events, { input, users, cmd }) => {
    if (!input) return client.sendMessage("Invalid command arguments, see .𝗵𝗲𝗹𝗽 𝘀𝗲𝘁𝗻 for more information.", events.threadID);
    try{
        await users.__update_username(input);
        await users.__reduce_yen(cmd.price);
        client.sendMessage(`Your username has been changed to ${bold(input)}`, events.threadID);
    }catch(error){
        client.sendMessage(`Failed to change username ${error}`, events.threadID);
    }
});

export default setn;