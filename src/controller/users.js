import Database from "../lib/database.js";
import { bold } from "../lib/style.js";

class Users {
    constructor(uid, db, client, events){
        this.uid = uid;
        this.username = "User New";
        this.level = 0;
        this.exp = 0;
        this.money = 0;
        this.tf = 100;
        this.chat_len = 0;
        this.chat_hast = 0;
        this.user_avatar = "./src/assets/images/avatar.jpg";
        this.user_header = "./src/assets/images/cover.jpeg";
        this.data = "[{ \"event\": [], \"daily\": { \"lastUsed\": 0, \"claimed\": false }, \"redeemed\": []}]";
        this.data_ba = "{\"total\": 0, \"inventory\": [] }";
        this.db = db;
        this.client = client;
        this.events = events;
    }
    
    async loads() {
        const data = await this.db.check(`SELECT * FROM users WHERE uid = ?`, [this.uid]);
        return data;
    }
    
    async create() {
        await this.db.update(`INSERT INTO users (uid, username, level, money, exp, data, tf, chat_len, chat_hast, user_avatar, user_header, data_ba) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [this.uid, this.username, this.level, this.money, this.exp, this.data, this.tf, this.chat_len, this.chat_hast, this.user_avatar, this.user_header, this.data_ba]);
    }
    
    async gets() {
        let data = await this.loads();
        if (!data) await this.create();
        data = await this.loads();
        this.username = data.username;
        this.level = data.level;
        this.exp = data.exp;
        this.money = data.money;
        this.data = data.data;
        this.tf = data.tf;
        this.chat_len = data.chat_len;
        this.chat_hast = data.chat_hast;
        this.user_avatar = data.user_avatar;
        this.user_header = data.user_header;
        this.data_ba = data.data_ba;
        return data;
    }
    
    async __add_yen(values){
        this.money += values;
        await this.db.update(`UPDATE users SET money = ? WHERE uid = ?`, [this.money, this.uid]);
    }
    
    async __reduce_yen(values){
        this.money -= values;
        await this.db.update(`UPDATE users SET money = ? WHERE uid = ?`, [this.money, this.uid]);
    }
    
    async __update_data(data){
        this.data = JSON.stringify(data);
        await this.db.update(`UPDATE users SET data = ? WHERE uid = ?`, [this.data, this.uid]);
    }
    
    async __update_username(text){
        if (typeof text !== "string") throw new Error("Name must a string!");
        this.username = text;
        await this.db.update("UPDATE users SET username = ? WHERE uid = ?", [this.username, this.uid]);
        return "Success!";
    }
    
    async __add_exp(value){
        if (typeof value !== "number") throw new Error("Value must a number!");
        
        this.exp += value;
        await this.db.update("UPDATE users SET exp = ? WHERE uid = ?", [this.exp, this.uid]);
    }
    
    async __update_exp(value){
        if (typeof value !== "number") throw new Error("Value must a number!");
        this.exp = value;
        await this.db.update("UPDATE users SET exp = ? WHERE uid = ?", [this.exp, this.uid]);
    }
    
    async __update_level(value){
        if (typeof value !== "number") throw new Error("Value must a number!");
        this.level = value;
        await this.db.update("UPDATE users SET level = ? WHERE uid = ?", [this.level, this.uid]);
        return "Success";
    }
    
    async __update_avatar(value){
        if (typeof value !== "string") throw new Error("Value must a number!");
        this.user_avatar = value;
        await this.db.update("UPDATE users SET user_avatar = ? WHERE uid = ?", [this.user_avatar, this.uid]);
        return "Success";
    }
    
    async __update_header(value){
        if (typeof value !== "string") throw new Error("Value must a number!");
        this.user_header = value;
        await this.db.update("UPDATE users SET user_header = ? WHERE uid = ?", [this.user_header, this.uid]);
        return "Success";
    }
    
    async __update_event(value){
        const { daily, redeemed } = this.__get_data();
        await this.__update_data([{ event: value, daily, redeemed}]);
        return "Success";
    }
    
    async __update_daily(status, date){
        const { daily, event, redeemed } = this.__get_data();
        if (!date) date = daily.lastUsed;
        const d = {
            lastUsed: date,
            claimed: status
        }
        await this.__update_data([{ event, daily: d, redeemed}]);
        return "Success";
    }
    
    async __update_redeem(value){
        const { daily, event, redeemed } = this.__get_data();
        redeemed.push(value);
        await this.__update_data([{ event, daily, redeemed}]);
        return "Success";
    }
    
    
    async __add_chat(){
        this.chat_len ++;
        await this.db.update("UPDATE users SET chat_len = ? WHERE uid = ?", [this.chat_len, this.uid]);
    }
    
    __get_data(){
        return JSON.parse(this.data)[0];
    }
    
    async __push_ba_inv(val){
        const data = JSON.parse(this.data_ba);
        const updated = data.inventory.concat(val);
        data.inventory = updated;
        await this.db.update("UPDATE users SET data_ba = ? WHERE uid = ?", [JSON.stringify(data), this.uid]);
        return this;
    }

	  async __set_ba_inv(val){
					const data = JSON.parse(this.data_ba);
					data.inventory = val;
					await this.db.update("UPDATE users SET data_ba = ? WHERE uid = ?", [JSON.stringify(data), this.uid]);
					return this;
		}
    
    async __reload(){
        const levelup = this.__calculate_level( this.exp, 500 * this.level, this.level);
        if (levelup.level > this.level){
            await this.__update_exp(levelup.exp);
            await this.__update_level(levelup.level);
            this.client.sendMessage(`Congratulations ${bold(this.username)}, you have leveled up to level ${bold(String(this.level))}!`, this.events.threadID)
        }
    }
    
    __calculate_level(exp, req_exp, level) {
        
        if (exp >= req_exp) {
            return this.__calculate_level(exp - req_exp, 500 * (level + 1), level + 1);
        }else{
            return { level, exp };
        }
    }
}

export default Users;
