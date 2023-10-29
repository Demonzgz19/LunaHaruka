import config from "../config.json" assert { type: "json" };
import * as fs from "fs/promises";
import { bold } from "./style.js";
import { Attachments } from "./tools.js";
import ms from "ms";

class CommandsBuilder {
    constructor(name){
        this.name = name;
        this.desc = "";
        this.permission = 0;
        this.price = 0;
        this.cd = 0;
        this.show_on_help = true;
        this.args = [];
        this.args_status = "Not required";
        this.group = "No Group";
        this.run = (...args) => {};
        this.help = (...args) => {};
    }
    
    description(desc){
        if (typeof desc !== "string") throw new Error("Descriptin must a string!");
        this.desc = desc;
        return this;
    }
    
    permissions(perm){
        if (typeof perm !== "number" || ![0, 1, 2].includes(perm)) throw new Error("Permission must a number 0, 1, 2");
        this.permission = perm;
        return this;
    }
    
    arguments(arg){
        this.args = arg;
        return this;
    }
    
    arguments_status(arg){
        if (typeof arg !== "string") throw new Error("Status must a string!");
        this.args_status = arg;
        return this;
    }
    
    groups(name){
        if (typeof name !== "string") throw new Error("Groups name must a string!");
        this.group = name;
        return this;
    }
    
    showOnHelp(value){
        if (typeof value !== "boolean") throw new Error("Value must a boolean!")
        
        this.show_on_help = value;
        return this;
    }
    
    prices(num){
        this.price = num;
        return this
    }
    
    cooldown(sec){
        this.cd = sec;
        return this;
    }
    
    runs(func){
        if (typeof func !== "function") throw new Error("Run must a function!");
        this.run = func;
        return this;
    }
    
    helps(func){
        if (typeof func !== "function") throw new Error("Helpz must a function!");
        this.help = func;
        return this;
    }
}

class Commands {
    constructor(){
        this.config = config;
        this.list_cmd = [];
        this.users = {};
        this.users_data = {};
        this.temporary = [];
        this.ba_engine = {};
    }
    
    async loadsAll(callback){
        if (typeof callback !== "function") callback = (...args) => {};
        
        let result = 0;
        const files = await fs.readdir("./src/commands/");
        
        
        for (const file of files){
            if (!file.endsWith(".js")) return;
            
            try{
                const data = await import("../commands/" + file);
                if (!data.default) throw new Error("The file does not have a default value; perhaps you forgot to export a default value.");
                this.list_cmd.push(data.default);
                result ++;
            }catch(error){
                callback(`[+] Failed loaded ${file} ${error.message}`);
            }
        }
        callback(`[+] Loaded total ${result} commands.`);
    }
    
    async execute(client, events, par){
        const [, c, p] = par;
        let commands = c.slice(1).toLowerCase();
        const has_sudo = config.admin.includes(events.senderID) || config.moderator.includes(events.senderID);
        const has_coomand = this.__info_commands(commands);
        
        if (has_coomand){
            const is_cd = this.__calculate_cooldown(events.senderID, has_coomand);
            if (is_cd.cd){
                if (is_cd.warn) return;
                await client.sendMessage("Slow down.. (>~< \")", events.threadID);
            }else{
                if (has_coomand.permission === 1 && !has_sudo) return client.sendMessage("You not allowed to run this command.", events.threadID);
                if (this.users_data.money < has_coomand.price) return client.sendMessage(`You'll need ${bold(`${has_coomand.price}¥ Yen`)} to use this command.`, events.threadID);
                
                try {
                    await has_coomand.run(client, events, { input: p, cmd: has_coomand, users: this.users, users_data: this.users_data, all_cmd: this.list_cmd, ba_engine: this.ba_engine });
                }catch(error){
                    await client.sendMessage(`Failed processing code ${error.message}`, events.threadID);
                }
            }
        }
    }
    
    async execute_events(client, events){
        const { event , daily } = await this.users.__get_data(this.users_data);
        const selected = events.body.trim().toLowerCase().split(" ")[0];
        
        switch (event[0]){
            case "daily":
                await this.__claim_user_daily(client, events, selected);
                break;
            case "setav":
                await this.__handle_events_setav(client, events);
                break;
            case "setbg":
                await this.__handle_events_setbg(client, events);
                break;
        }
    }
    
    async __claim_user_daily(client, events, text){
        
        switch (text){
            case "yen":
                await this.users.__update_daily(true, Date.now());
                await this.users.__update_event([]);
                await this.users.__add_yen(2);
                client.sendMessage(`${bold(this.users_data.username)} successfully claimed daily reward, ${bold("2¥")}!`, events.threadID);
                break;
            case "exp":
                await this.users.__add_exp(1200);
                await this.users.__update_daily(true, Date.now());
                await this.users.__update_event([]);
                await this.users.__reload();
                client.sendMessage(`${bold(this.users_data.username)} successfully claimed daily reward, ${bold("1200 experience")}!`, events.threadID);
                break;
            case "tf":
                //this.users.__update_data(data);
                break;
        }
    }
    
    async __handle_events_setav(client, events){
        const attachments = events.attachments[0];
        if (!attachments) return;
        if (attachments.type !== "photo") return;
        const media = new Attachments(attachments.url);
        await media.save("./src/database/users/avatars/"+events.senderID+".jpg");
        await this.users.__reduce_yen(2);
        await this.users.__update_event([]);
        await this.users.__update_avatar("./src/database/users/avatars/"+events.senderID+".jpg");
        client.sendMessage("Your status profile image successfully changed.", events.threadID);
    }
    
    async __handle_events_setbg(client, events){
        const attachments = events.attachments[0];
        if (!attachments) return;
        if (attachments.type !== "photo") return;
        const media = new Attachments(attachments.url);
        await media.save("./src/database/users/headers/"+events.senderID+".jpg");
        await this.users.__reduce_yen(2);
        await this.users.__update_event([]);
        await this.users.__update_header("./src/database/users/headers/"+events.senderID+".jpg");
        client.sendMessage("Your status profile image successfully changed.", events.threadID);
    }
    
    __info_commands(name){
        return this.list_cmd.find(data => data.name === name);
    }
    
    __calculate_cooldown(uid, { name, cd }) {
        // Check if the user exists in the 'temporary' array
        const has_user = this.temporary.find(data => data.uid === uid);
    
        if (has_user) {
            if (has_user[name]) {
                const { lastUsed, warn } = has_user[name];
                const datenow = Date.now();
                const elapsed_time = datenow - lastUsed;
    
                if (elapsed_time >= cd) {
                    has_user[name] = { lastUsed: Date.now(), warn: false };
                    return { cd: false, warn: false };
                } else {
                    if (warn) return { cd: true, warn: true };
                    has_user[name].warn = true;
                    return { cd: true, warn: false };
                }
            } else {
                has_user[name] = {
                    lastUsed: Date.now(),
                    warn: false
                };
                return { cd: false, warn: false };
            }
        } else {
            this.temporary.push({
                uid,
                [name]: {
                    lastUsed: Date.now(),
                    warn: false
                }
            });
            return { cd: false, warn: false };
        }
    }

}

export { Commands, CommandsBuilder };