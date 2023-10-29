import { CommandsBuilder } from "../lib/commands.js";

const nya = new CommandsBuilder("nya");
nya.description("Say nya.");
nya.cooldown(10000);
nya.showOnHelp(false);
nya.runs(async (client, events) => {
    await client.sendMessage("nya.", events.threadID);
});

export default nya;