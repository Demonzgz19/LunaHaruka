import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";
import ms from "humanize-duration";
import pm2 from "pm2";

const r = new CommandsBuilder("r");
r.description("Get current next restart time.");
r.groups("Misc");
r.arguments_status("No");
r.cooldown(1 * 60 * 1000);
r.runs(async (client, events) => {
    const countdown = await getNextRestartTime();
    const text = `Restart schedule in ${bold(ms(countdown, { units: ["d", "h", "m", "s"], round: true }))}.`;
    client.sendMessage(text, events.threadID);
});

function getNextRestartTime() {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
                return;
            }

            pm2.list((err, processList) => {
                if (err) {
                    reject(err);
                    pm2.disconnect();
                    return;
                }

                const targetProcess = processList.find(
                    (process) => process.name === 'index',
                );

                if (targetProcess) {
                    const uptime = targetProcess.pm2_env.pm_uptime;
                    const time = 2 * 60 * 60 * 1000;
                    const date = Date.now();
                    const countdown = time - ( date - uptime );
                    resolve(countdown);
                } else {
                    reject(new Error('No process found, maybe on development mode?'));
                }
                pm2.disconnect();
            });
        });
    });
}

export default r;
