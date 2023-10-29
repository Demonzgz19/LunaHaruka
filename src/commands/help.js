import { CommandsBuilder } from "../lib/commands.js";
import { bold } from "../lib/style.js";
import ms from "ms";

const help = new CommandsBuilder("help");
help.permissions(0);
help.description("Help command");
help.showOnHelp(false);
help.cooldown(10000);
help.arguments_status("Optional");
help.helps(async (client, events, input, all_cmd) => {
    const c_name = input.split(" ")[0];
    const c_data = all_cmd.find(data => data.name === c_name);
    
    if (c_data){
        const text = showInfoCommand(c_data);
        client.sendMessage(text, events.threadID);
    }else{
        client.sendMessage(`Command ${bold(c_name)} is not exists.`, events.threadID);
    }
});
help.runs(async (client, events, { input, all_cmd }) => {
    if (input) return help.help(client, events, input, all_cmd);
    
    const text = createList(all_cmd);
    await client.sendMessage("𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁 successfully sent to your DM.", events.threadID);
    await client.sendMessage(text, events.senderID);
});

function createList(all_cmd) {
    const groupedCommands = {};
    for (const data of all_cmd) {
        if (data.show_on_help) {
            if (!groupedCommands[data.group]) {
                groupedCommands[data.group] = [];
            }
            groupedCommands[data.group].push(data.name);
        }
    }

    let text = bold("# Command Information\n");
    
    for (const group in groupedCommands) {
        const commandsInGroup = groupedCommands[group];
        text += `\n- ${bold(group)} (${commandsInGroup.length})\n`;
        text += commandsInGroup.join(", ") + "\n";
    }

    text += `\nUse the command ${bold(".help <command>")} for more information.`;
    return text;
}

function showInfoCommand(info) {
    const { desc, name, price, args, args_status, cd } = info;
    const priceText = price > 0 ? `${price}¥` : "Free";
    const cooldownText = ms(cd, { long: true });
    const syntaxText = `.${name} ${args.map(arg => `<${arg}>`).join(" ")}`;

    const text = `
${bold("# Command Information")}
${desc}

${bold("- Get started:")} .${name} help

${bold("• Name:")} ${name}
${bold("• Price:")} ${priceText}

${bold("• Arguments")}
${bold("- Usage:")} ${args_status}
${bold("- Params:")} ${args.join(", ") || "-"}

${bold("• Cooldown:")} ${cooldownText}

${bold("• Syntax")}
${syntaxText}
    `;

    return text;
}

export default help;
