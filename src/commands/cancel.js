import { CommandsBuilder } from "../lib/commands.js";

const cancel = new CommandsBuilder("cancel");
cancel.description("Cancel your current task.");
cancel.showOnHelp(false);
cancel.cooldown(10000);
cancel.runs(async (client, events, { users }) => {
    try{
        await users.__update_event([]);
        client.sendMessage("Your current task successfully canceled.", events.threadID);
    }catch(error){
        console.log(error);
        client.sendMessage("Failed updated task.", events.threadID);
    }
});

export default cancel;