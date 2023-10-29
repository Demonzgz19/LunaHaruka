import fs from "fs/promises";

class BlueArchiveGacha {
    
    constructor(){
        this.item = [];
        this.r_rate = 95.7;
        this.sr_rate = 3.2;
        this.ssr_rate = 1.7;
    }
    
    async roll(ten_pull){
        const result = this.searchBasedWeight(this.item, this.r_rate, this.sr_rate, this.ssr_rate, ten_pull);
        return result;
    }
    
    async loadsAll(){
        const data = JSON.parse(await fs.readFile("./src/database/ba_data/ba_data.json"));
        console.log("[+] Loaded total " + data.length + " data.");
        this.item = data;
    }
    
    searchBasedWeight(card_data, r_rate, sr_rate, ssr_rate, pull){
        this.r_rate *= 100;
        this.sr_rate *= 100;
        this.ssr_rate *= 100;
        
        let weight = r_rate + sr_rate + ssr_rate;
        
        let R = r_rate;
        let SR = R + sr_rate;
        let SSR = SR + ssr_rate;
        
        const reloadNumber = (length) => Math.floor(Math.random() * length);
        const whenRarity = (symbol_rarity) => card_data.filter(o => o.rarity === symbol_rarity);
        
        let getItem = [];
        
        const rollItUp = (max) => {
            for (let index = 0; index < max; index++){
                let res, randNumber = Math.floor(Math.random() * parseFloat(weight));
                
                if (SR < randNumber && randNumber <= SSR){
                    res = whenRarity("ssr");
                    getItem.push(res[reloadNumber(res.length)]);
                }else if (R < randNumber && randNumber <= SR){
                    res = whenRarity("sr");
                    getItem.push(res[reloadNumber(res.length)]);
                }else if(randNumber <= R){
                    res = whenRarity("r");
                    getItem.push(res[reloadNumber(res.length)]);
                }else{
                    // Harusnya gak sampai sini
                    rollItUp(max);
                }
            }
        }
        
        if (pull === undefined || pull < 1){
            rollItUp(1);
        }else if (pull >= 10){
            let res = whenRarity("sr");
            getItem.push(res[reloadNumber(res.length)]);
            rollItUp(pull -1);
        }else{
            rollItUp(pull);
        }
        
        let shuffledArray = [];
        let stop = false;
        while (stop === false) {
            if (getItem.length < 1) stop = true;
            else {
                var index = Math.floor(Math.random() * getItem.length);
                var item = getItem[index];
                getItem.splice(index, 1);
                shuffledArray.push(item);
                stop = false;
            }
        }
        return shuffledArray;
    }
}


export { BlueArchiveGacha };