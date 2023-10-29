import fs from "fs/promises";
import fb from "archery-fb";
import Events from "events";

class Client extends Events {
    
    constructor(appstatePath) {
        super();
        this.appstatePath = appstatePath;
    }

    async getAppstate() {
        try {
            const data = await fs.readFile(this.appstatePath, "utf8");
            return JSON.parse(data);
        } catch (error) {
            throw new Error("Error reading appstate file: " + error.message);
        }
    }

    async start() {
        try {
            const appState = await this.getAppstate();
            const api = await fb({ appState }, {
                listenEvents: true,
                forceLogin: true,
                autoReconnect: false,
                autoMarkDelivery: false,
                logLevel: "error"
            });

            api.listen((err, events) => {
                if (err) {
                    this.emit("error", new Error("Facebook API listen error: " + err.message));
                    return;
                }

                switch (events.type) {
                    case "message":
                    case "message_reply":
                        this.emit("message", api, events);
                        break;
                }
            });
        } catch (error) {
            this.emit("error", new Error("Facebook API error: " + err.message));
        }
    }
}

export default Client;