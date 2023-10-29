import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";

const setav = new CommandsBuilder("setav");
setav.description("Change your avatar picture.");
setav.cooldown(10000);
setav.groups("Users");
setav.prices(2);
setav.runs(async (client, events, { users }) => {
    const { event, daily } = await users.__get_data();
    if (event.length) return client.sendMessage(`You're currently in task ${bold(event[0])}.

Use ${bold(".cancel")} to cancel the current task.`, events.threadID);
    await users.__update_event(["setav"]);
    client.sendMessage("You can now upload your image for your profile.", events.threadID);
});

export default setav;