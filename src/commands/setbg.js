import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";

const setbg = new CommandsBuilder("setbg");
setbg.description("Change your background picture.");
setbg.cooldown(10000);
setbg.groups("Users");
setbg.prices(2);
setbg.runs(async (client, events, { users }) => {
    const { event, daily } = await users.__get_data();
    if (event.length) return client.sendMessage(`You're currently in task ${bold(event[0])}.

Use ${bold(".cancel")} to cancel the current task.`, events.threadID);
    await users.__update_event(["setbg"]);
    client.sendMessage("You can now upload your image for your profile.", events.threadID);
});

export default setbg;