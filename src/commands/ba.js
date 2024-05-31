import { CommandsBuilder } from "../lib/commands.js";
import { BlueArchiveCard, BlueArchiveInvCard } from "../lib/canvas.js";
import { bold } from "../lib/style.js";
import _ from "lodash";

const ba = new CommandsBuilder("ba");
ba.description("Gacha and sell Blue Archive card.");
ba.groups("Gacha");
ba.arguments_status("Required");
ba.arguments(["sub-command", "sub-command"]);
ba.permissions(0);
ba.cooldown(1 * 60 * 1000);
ba.runs(async (client, events, { input, users, ba_engine }) => {
		const [key, args] = input.split(" ");

		switch (key) {
				case "pull":
						await pull();
						break;
				case "bulk":
						await bulk();
						break;
				case "show":
						await show();
						break;
				case "inv":
						await inv();
						break;
				case "sell":
						await sell();
						break;
		}

		async function inv() {
				const list = JSON.parse(users.data_ba);
				const row = _.chunk(list.inventory, 5);
				const page = _.chunk(row, 2);
				const index = Number(args) || page.length;
				const data = {
						list: page[index - 1],
						page: index,
						max_page: page.length
				};
				const canvas = new BlueArchiveInvCard();
				await canvas.new(data, users);
				canvas.save(events.senderID);
				await client.sendMessage({ attachment: canvas.load() }, events.threadID);
				canvas.delete();
		}

		async function show() {
				if (!args) return;
				if (typeof Number(args) !== "number") return;
				const list = JSON.parse(users.data_ba);
				const data = list.inventory.find(data => data.id === Number(args));
				if (data) {
						const card = new BlueArchiveCard();
						await card.new(data, users, true);
						await card.save(events.senderID);
						await client.sendMessage({ attachment: card.load() }, events.threadID);
						card.delete();
				} else {
						client.sendMessage("You do not own that card.", events.threadID);
				}
		}

		async function bulk() {
				const num = Number(args);
				if (typeof num !== "number") return;
				if (num < 1) return client.sendMessage("Please input the number of pulls.", events.threadID);
				const prices = 12 * num;
				if (users.money < prices) return client.sendMessage(`Insufficient Yen to pull a gacha. You'll need ${bold(String(prices))}¥ (12 x ${num}) to bulk this gacha.`, events.threadID);
				const item = await ba_engine.roll(num);
				let text = bold("# Gacha Pull (Bulk)\n");
				for (const data of item) {
						text += `\n${bold(`#${data.id}`)}: ${data.name} (${data.rarity.toUpperCase()}★)`;
				}
				await users.__reduce_yen(prices);
				await users.__push_ba_inv(item);
				client.sendMessage(text, events.threadID);
		}

		async function pull() {
				if (users.money < 12) return client.sendMessage("Insufficient Yen to pull a gacha. You'll need 𝟭𝟮¥ to pull this gacha.", events.threadID);
				const item = await ba_engine.roll(1);
				await users.__reduce_yen(12);
				await users.__push_ba_inv(item);
				const card = new BlueArchiveCard();
				await card.new(item[0], users);
				await card.save(events.senderID);
				await client.sendMessage({ attachment: card.load() }, events.threadID);
				card.delete();
		}

		async function sell() {
				const list = JSON.parse(users.data_ba).inventory;
				const prices = { r: 9.1, sr: 13, ssr: 30 };
				const item = list.find(data => data.id === Number(args));

				if (item) {
						const index = list.findIndex(data => data.id === item.id);
						list.splice(index, 1); // Get the first (and only) element
						await users.__set_ba_inv(list);
					await users.__add_yen(prices[item.rarity]);
					client.sendMessage(`You sold ${item.name} for ${bold(String(prices[item.rarity]))}¥`, events.threadID)
					

						// Add logic here to update user data or perform other actions as needed

				} else {
						client.sendMessage("You do not own that card.", events.threadID);
				}
		}
});

export default ba;
