import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";
import ms from "humanize-duration";

const daily = new CommandsBuilder("daily");
daily.description("Claim daily reward.");
daily.groups("Economy");
daily.cooldown(10000);
daily.permissions(0);
daily.runs(async (client, events, { users, users_data }) => {
    const { daily, event } = users.__get_data(users_data);
    const timenow = Date.now();
    const elapsed_time = 23 * 60 * 60 * 1000 - ( timenow - daily.lastUsed );
    const text = `# 𝗗𝗮𝗶𝗹𝘆 𝗥𝗲𝘄𝗮𝗿𝗱

- 𝗘𝘅𝗽: 1200 experience
- 𝗬𝗲𝗻: 2¥ yen
- 𝗧𝗙: 2.5% trust factor

Send message of your choice to choose the daily reward.`

    const text_claimed = `You already claimed your daily reward. You can claim it again in ${bold(ms(elapsed_time, { units: ["d", "h", "m", "s"], round: true }))}`;
    
    if (event[0]){
        client.sendMessage(`You're currently in task ${bold(event[0])}.

Use ${bold(".cancel")} to cancel the current task.`, events.threadID);
    }else{
        if (daily.claimed){
            if (elapsed_time <= 0) {
                await users.__update_event(["daily"]);
                client.sendMessage(text, events.threadID);
            }else{
                client.sendMessage(text_claimed, events.threadID);
            }
        }else{
            await users.__update_event(["daily"]);
            client.sendMessage(text, events.threadID);
        }
    }
});

export default daily;