import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";
import fs from "fs/promises";

const redeem = new CommandsBuilder("redeem");
redeem.description("Redeem code for yen or/and experience points.");
redeem.groups("Economy");
redeem.cooldown(10000);
redeem.runs(async (client, events, { users, input }) => {
    const { redeemed } = users.__get_data();
    const data = JSON.parse(await fs.readFile("./src/database/code_redeem.json"));
    const [ code ] = input.toLowerCase().split(" ") || [];
    const has_code = data.find(data => data.name === code);
    
    if (!code) return;
    if (redeemed.includes(code)) return client.sendMessage("You've used the submitted redeem code before.", events.threadID);
    if (has_code){
        await users.__update_redeem(code);
        await users.__add_yen(has_code.get.yen);
        await users.__add_exp(has_code.get.exp);
        await users.__reload();
        client.sendMessage(`You have redeemed a code for ${bold(has_code.get.exp + " experiences")} and ${bold(has_code.get.yen + "¥ Yen")}.`, events.threadID);
    }else{
        client.sendMessage("The submitted redeem code is not exists.", events.threadID);
    }
});

export default redeem;