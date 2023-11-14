import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs";

class StatusCard {
    
    constructor(){
        this.id = 1;
        this.username = "No Name";
        this.level = 1;
        this.exp = 0;
        this.money = 0;
        this.tf = 100;
        this.chat_len = 0;
        this.chat_hast = 0;
        this.user_avatar = "./src/assets/images/avatar.jpg";
        this.user_header = "./src/assets/images/cover.jpeg";

        this.width = 680;
        this.height = 525;

        this.canvas = createCanvas(this.width, this.height);
        GlobalFonts.registerFromPath("./src/assets/fonts/fonts.ttf", "keifont" );
    }
    
    async new(data){
        if (data){
            if (data.id) this.id = data.id;
            if (data.username) this.username = data.username;
            if (data.level) this.level = data.level;
            if (data.exp) this.exp = data.exp;
            if (data.money) this.money = data.money;
            if (data.tf) this.tf = data.tf;
            if (data.user_avatar) this.user_avatar = data.user_avatar;
            if (data.user_header) this.user_header = data.user_header;
            if (data.chat_len) this.chat_len = data.chat_len;
            if (data.chat_hast) this.chat_hast = data.chat_hast;
        }
        
        let text, width, height;
        const body = await loadImage("./src/assets/images/status_body.png");
        const avatar = await loadImage(this.user_avatar);
        const header = await loadImage(this.user_header);
        
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#181818";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.resize(ctx, header, this.width, 350, 680, 285);
        ctx.drawImage(body, 0, 0, this.width, this.height);
        
        // Text Default
        ctx.fillStyle = 'white';
        ctx.font = 'regular 8px keifont';
        ctx.fillText("Trust Factor", 90, 365)
        
        // Display Username
        ctx.font = 'bold 20px keifont';
        ctx.fillText(this.username, 210, 260);
        
        // Display Level
        text = "Level " + this.level;
        ctx.font = 'bold 15px keifont';
        ctx.fillText(text, 278, 335);
        
        // Display Exp Percentage Progress Bar
        const exp_bar = ctx.createLinearGradient(0, 0, this.width, 0);
        width = (this.exp / (500 * this.level)) * 365;
        height = 8;
        exp_bar.addColorStop(0, "#284BAE");
        exp_bar.addColorStop(1, "#54AEEA");
        ctx.fillStyle = exp_bar;
        this.canvasRad(ctx, width, height, 275, 350, 4);
        //ctx.fillRect(275, 350, width, height);
        
        // Display ID
        text = "#" + this.id;
        width = ctx.measureText(text).width;
        ctx.font = 'bold 15px keifont';
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.5;
        ctx.fillText(text, 640 - width, 265);
        ctx.globalAlpha = 1;
        
        // Display Yen
        text = this.money.toLocaleString() + "¥";
        width = ctx.measureText(text).width;
        ctx.font = 'bold 17px keifont';
        ctx.fillText(text, (550 - width) / 2, 435);
        
        // Display Chat Length
        text = this.chat_len.toLocaleString();
        width = ctx.measureText(text).width;
        ctx.fillText(text, (850 - width) / 2, 435);
        
        // Display Chat Hastag
        text = this.chat_hast.toLocaleString();
        width = ctx.measureText(text).width;
        ctx.fillText(text, (1140 - width) / 2, 435);
        
        // Display Bar Trust Factor Percentage
        ctx.fillStyle = "#7DB458";
        this.canvasRad(ctx, (this.tf / 100) * 155, 4, 38, 373.4, 2);
        //ctx.fillRect(38, 373.4, (this.tf / 100) * 155, 4);
        
        // Display User Avatar
        ctx.beginPath();
        ctx.arc(115, 260, 145 / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 40, 183, 150, 150);
        
        return this;
    }
    
    stream(){
        return this.canvas.createPNGStream();
    }
    
    save(filename){
        return new Promise(async (resolve, reject) => {
            this.path = `./src/database/status_card${filename}.png`;
            try{
                const buffer = this.canvas.toBuffer("image/png");
                await fs.writeFileSync(this.path, buffer);
                resolve("Success.");
                return this;
            }catch(error){
                reject(error);
            }
        });
    }
    
    load(){
        if (!this.path) throw new Error("Task not found.");
        return fs.createReadStream(this.path);
    }
    
    delete(){
        if (!this.path) throw new Error("Task not found.");
        fs.unlinkSync(this.path);
    }
    
    canvasRad(ctx, width, height, x, y, borderRadius) {
        if (width <= 0) return;
        if (height <= 0) return;
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.fill();
    }
    resize(ctx, image, max_w, max_h, x, y){
        let w = image.width;
        let h = image.height;
        if (w > max_w || h > max_h){
            const w_ratio = max_w / w;
            const h_ratio = max_h / h;
            const ratio = Math.min(w_ratio, h_ratio);
            w *= ratio;
            h *= ratio;
        }else if (w < max_w || h < max_h){
            const w_ratio = max_w / w;
            const h_ratio = max_h / h;
            const ratio = Math.max(w_ratio, h_ratio);
            w *= ratio;
            h *= ratio;
        }
        ctx.drawImage(image, (x - w) / 2, (y - h) / 2, w, h);
    }
}

class BlueArchiveCard {
    
    constructor(){
        this.image_c_path = "./src/assets/images/ba_assets/yuuka_b3.png";
        this.image_b_path = "./src/assets/images/ba_base.png";
        this.image_bs_path = "./src/assets/images/ba_showcase_body.png";
        this.image_s_path = "./src/assets/images/ba_assets/star_icon.png";
        this.attacker_icon = "./src/assets/images/ba_assets/icons/Icon_role_attacker.png";
        this.healer_icon = "./src/assets/images/ba_assets/icons/Icon_role_healer.png";
        this.support_icon = "./src/assets/images/ba_assets/icons/Icon_role_support.png";
        this.cactical_support_icon = "./src/assets/images/ba_assets/icons/Icon_role_tactical_support.png";
        this.tank_icon = "./src/assets/images/ba_assets/icons/Icon_role_tank.png";
        this.c_name = "No Name";
        this.c_id = 1;
        this.u_id = 1;
        this.star = "SSR";
        this.role = "attacker";
        this.costume = "normal";
        this.date_now = new Date().toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
        this.width = 1440;
        this.height = 1080;
        this.canvas = createCanvas(this.width, this.height);
        GlobalFonts.registerFromPath("./src/assets/fonts/fonts.otf", "lemon");
    }
    
    async new(data, user, is_show){
        if (data){
            if (data.name) this.c_name = data.name;
            if (data.rarity) this.star = data.rarity;
            if (data.costume) this.costume = data.costume;
            if (data.id) this.c_id = data.id;
            if (data.img) this.image_c_path = data.img;
            if (data.role) this.role = data.role;
        }
        if (user){
            if (user.id) this.u_id = user.id;
        }
        
        let text, height, width, body, icon_role;
        if (is_show){
            body = await loadImage(this.image_bs_path);
        }else{
            body = await loadImage(this.image_b_path);
        }
        
        switch (this.role){
            case "attacker":
                icon_role = await loadImage(this.attacker_icon);
                break;
            case "healer":
                icon_role = await loadImage(this.healer_icon);
                break;
            case "support":
                icon_role = await loadImage(this.support_icon);
                break;
            case "tank":
                icon_role = await loadImage(this.tank_icon);
                break;
            case "tactical_support":
                icon_role = await loadImage(this.cactical_support_icon);
                break;
        }
        
        const star = await loadImage(this.image_s_path);
        const c_spirit = await loadImage(this.image_c_path);
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.drawImage(body, 0, 0, this.width, this.height);
        
        // Show ID Card
        text = "#" + this.c_id;
        ctx.fillStyle = "#FFC300";
        ctx.font = 'bold 20px lemon';
        ctx.fillText(text, 75, 590);
        
        // Show Card Name
        ctx.fillStyle = "#000000";
        ctx.font = 'bold 35px lemon';
        ctx.fillText(this.c_name, 76, 670);
        
        // Show Owner Card
        text = "own by #" + this.u_id;
        ctx.font = 'bold 15px lemon';
        ctx.fillText(text, 76, 880);
        
        // Show Date Now
        width = ctx.measureText(this.date_now).width;
        ctx.fillText(this.date_now, 1355 - width , 880);
        
        // Show ID item with costum name
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 15px lemon';
        text = `#${this.c_id} (${this.costume})`
        width = ctx.measureText(text).width
        ctx.fillText(text, 1250 - width , 790);
        
        // Show Star Rate
        ctx.font = 'bold 30px lemon';
        width = ctx.measureText(this.star).width;
        ctx.fillText(this.star, 1250 - width , 330);
        
        // Show Role Icon
        width = 510;
        height = 310;
        ctx.fillStyle = "#FFC300";
        ctx.fillRect(width, height, 40, 40);
        ctx.drawImage(icon_role, width+7.5, height+7.5, 25, 25);
        
        
        // Show Character Spirit
        this.resize(ctx, c_spirit, 500, 450, 1700, 1100);
        //ctx.fillRect(650, 230, 400, 700);
    }
    
    save(filename){
        return new Promise(async (resolve, reject) => {
            this.path = `./src/database/ba_card${filename}.png`;
            try{
                const buffer = this.canvas.toBuffer("image/png");
                await fs.writeFileSync(this.path, buffer);
                resolve("Success.");
                return this;
            }catch(error){
                reject(error);
            }
        });
    }
    
    load(){
        if (!this.path) throw new Error("Task not found.");
        return fs.createReadStream(this.path);
    }
    
    delete(){
        if (!this.path) throw new Error("Task not found.");
        fs.unlinkSync(this.path);
    }
    
    resize(ctx, image, max_w, max_h, x, y){
        let w = image.width;
        let h = image.height;
        if (w > max_w || h > max_h){
            const w_ratio = max_w / w;
            const h_ratio = max_h / h;
            const ratio = Math.min(w_ratio, h_ratio);
            w *= ratio;
            h *= ratio;
        }else if (w < max_w || h < max_h){
            const w_ratio = max_w / w;
            const h_ratio = max_h / h;
            const ratio = Math.max(w_ratio, h_ratio);
            w *= ratio;
            h *= ratio;
        }
        ctx.drawImage(image, (x - w) / 2, (y - h) / 2, w, h);
    }
}

class BlueArchiveInvCard extends BlueArchiveCard {
    
    constructor(){
        super();
        this.bg_path = "./src/assets/images/inv_bg.png";
        this.username = "Taka";
        this.width = 960;
        this.height = 720;
        this.canvas = createCanvas(this.width, this.height);
        this.list = [];
        this.page = 1;
        this.max_page = 1;
        GlobalFonts.registerFromPath("./src/assets/fonts/p_bold.ttf", "poppins");
    }
    
    async new(data, user){
        
        if (data){
            if (data.page) this.page = data.page;
            if (data.list) this.list = data.list;
            if (data.max_page) this.max_page = data.max_page;
        }
        if (user){
            if (user.username) this.username = user.username;
        }
        
        let width, height, text;
        const body = await loadImage(this.bg_path);
        const ctx = this.canvas.getContext("2d");
        ctx.drawImage(body, 0, 0, this.width, this.height);
        
        // Show Username user
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 15px poppins';
        ctx.fillText("@"+this.username, 50, 130);
        
        // Show Time Now
        width = ctx.measureText(this.date_now).width;
        ctx.fillText(this.date_now, 900 - width, 115);
        
        // Show Page Now
        text = `Page ${this.page} of ${this.max_page}`;
        width = ctx.measureText(text).width;
        ctx.fillText(text, 900 - width, 130);
        
        width = 150; height = 200;
        const margin = 24;
        const margin_x = 200;
        const margin_y = 230;
        for (let i = 0; i < this.list.length; i++){
            for (let j = 0; j < this.list[i].length; j++){
                const color = {
                    r: "#345fff",
                    sr: "#bd52ff",
                    ssr: "#fff16c"
                };
                const item = this.list[i][j];
                const x = j * (width + margin) + 50;
                const y = i * (height + margin) + 200;
                
                const x_l = x + 5;
                const y_l = y + 5;
                
                const x_i = j * (width + margin_x) + 50;
                const y_i = i * (height + margin_y) + 220;
                
                // Base Color
                ctx.fillStyle = color[item.rarity];
                ctx.fillRect(x, y, 150, 200);
                
                // Layer Color
                ctx.fillStyle = "white";
                ctx.fillRect(x_l, y_l, 150, 200);
                
                const c_spirit = await loadImage(item.img);
                this.resize(ctx, c_spirit, width, height - 20, x_i + 200, y_i + 400);
                
                // Background id
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, 50, 20);
                ctx.fillStyle = "#fff";
                ctx.font = 'bold 15px poppins';
                ctx.globalAlpha = 1;
                
                const width_t = ctx.measureText(this.date_now).width;
                ctx.fillText(String(item.id), (x + 75) - width_t, y + 15);
            }
        }
    }
    
}

export { StatusCard, BlueArchiveCard, BlueArchiveInvCard };