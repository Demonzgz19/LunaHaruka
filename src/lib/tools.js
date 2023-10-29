import fetch from "node-fetch";
import fs from "fs/promises";

class Attachments {
    
    constructor(url){
        this.url = url;
    }
    
    async download(){
        try {
            const req = await fetch(this.url);
            const buff = await req.buffer();
            return buff;
        }catch(error){
            throw new Error("Failed get attachments " + error.message);
        }
    }
    
    async save(filename){
        try {
            const buff = await this.download();
            await fs.writeFile(filename, buff);
            return "Success";
        }catch(error){
            throw new Error("Failed save attachments reason " + error.message);
        }
    }
}

export { Attachments };