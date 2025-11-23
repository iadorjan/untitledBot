"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const web3_1 = __importDefault(require("web3"));
const https = __importStar(require("https"));
require("dotenv").config();
const AUTHOR = "@aleadorjan (Alejandro Adorjan) @iadorjan (Ignacio Adorjan)";
const BOT_NAME = "Untitled BOT";
const BOT_NAME_FOOTER = "Template";
const EMBED_COLOR_PRIMARY = 0x00ffff;
const EMBED_COLOR_SECONDARY = 0xffffff;
const IMAGE_DEFAULT = "https://ethglobal.storage/events/buenosaires/logo/default";
const LOGO = "https://ethglobal.storage/events/buenosaires/logo/default";
const URL_BOT = "https://ethglobal.com/events/buenosaires/home";
const MNEMONIC = process.env.MNEMONIC;
const SENDER_ADDRESS = '0xbFB013D6Af176b32DD2F3c452B4449319d93F498';
const TOKEN_NAME = 'HBAR';
const EXAMPLE_HELP = "`!help` - Display this help message\n";
console.log(`SHedera-World-RootBot Start ....`);
console.log(`Connecting .....`);
const BLOCK_EXPLORER_WORLD = 'https://sepolia.worldscan.org';
const client = new discord_js_1.Client();
const web3 = new web3_1.default(process.env.RPC_URL);
let user_address = process.env.ADDRESS;
let private_key_hedera = process.env.ACCOUNT_PRIVATE_KEY_HEDERA;
let RPC_URL_HEDERA = process.env.RPC_URL_HEDERA;
const URL_CHAINLIST_WORLD = 'https://chainlist.org/?search=world&testnets=true';
const URL_PRIZES = 'https://ethglobal.com/events/buenosaires/home';
const ROOTSTOCK_RPC_URL = "https://rpc.testnet.rootstock.io/gg1EqN38geRB99w7kX1x114dLFMre9-T";
const URL_ETHGLOBAL_FAUCETS = 'https://ethglobal.com/faucet';
function getRootstockBlockNumber() {
    const postData = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 0,
    });
    return new Promise((resolve, reject) => {
        const req = https.request(ROOTSTOCK_RPC_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        }, (res) => {
            let raw = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => (raw += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.result) {
                        // result is a hex string like 0x1234
                        const bn = BigInt(parsed.result).toString();
                        resolve(bn);
                    }
                    else {
                        reject(new Error("Invalid RPC response: " + raw));
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on("error", (e) => reject(e));
        req.write(postData);
        req.end();
    });
}
function getRootstockBalance(address) {
    const postData = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
    });
    return new Promise((resolve, reject) => {
        const req = https.request(ROOTSTOCK_RPC_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        }, (res) => {
            let raw = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => (raw += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.result) {
                        const wei = BigInt(parsed.result);
                        const weiStr = wei.toString();
                        const whole = wei / (10n ** 18n);
                        const rem = wei % (10n ** 18n);
                        const remStr = rem.toString().padStart(18, "0");
                        const etherStr = `${whole.toString()}.${remStr.slice(0, 6)}`; // 6 decimal places
                        resolve({ wei: weiStr, ether: etherStr });
                    }
                    else {
                        reject(new Error("Invalid RPC response: " + raw));
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on("error", (e) => reject(e));
        req.write(postData);
        req.end();
    });
}
// Hedera mirror node (testnet) base URL
const HEDERA_MIRROR_TESTNET = "https://testnet.mirrornode.hedera.com/api/v1/accounts/";
function getHederaBalance(accountId) {
    const url = HEDERA_MIRROR_TESTNET + encodeURIComponent(accountId);
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
            let raw = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => (raw += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(raw);
                    const balObj = parsed && (parsed.balance || parsed.account_balance || parsed.crypto_account_balance);
                    let tinybars = null;
                    if (balObj && typeof balObj === "object") {
                        if (typeof balObj.balance !== "undefined")
                            tinybars = BigInt(balObj.balance);
                    }
                    if (tinybars === null && parsed && typeof parsed.balance === "number")
                        tinybars = BigInt(parsed.balance);
                    if (tinybars === null) {
                        if (parsed && typeof parsed.balance === "string")
                            tinybars = BigInt(parsed.balance);
                    }
                    if (tinybars === null)
                        return reject(new Error("Unable to parse Hedera balance from response: " + raw));
                    const tinybarsStr = tinybars.toString();
                    // 1 HBAR = 100,000,000 tinybars
                    const HBAR_FACTOR = 10n ** 8n;
                    const whole = tinybars / HBAR_FACTOR;
                    const rem = tinybars % HBAR_FACTOR;
                    const remStr = rem.toString().padStart(8, "0");
                    const hbarStr = `${whole.toString()}.${remStr.slice(0, 6)}`; // show 6 decimals
                    resolve({ tinybars: tinybarsStr, hbar: hbarStr });
                }
                catch (e) {
                    reject(e);
                }
            });
        })
            .on("error", (e) => reject(e));
    });
}
client.on("ready", () => {
    console.log(`Login ${client.user.tag}!`);
});
client.on("message", async (msg) => {
    try {
        if (msg.content === "!rootstock") {
            msg.reply("Welcome to Rootstock!");
            msg.author.send("Your public address " + user_address);
            msg.reply("Rootstock is the first Bitcoin sidechain that brings Ethereum-compatible smart contracts to the Bitcoin network. It combines Bitcoin’s unmatched security and liquidity with the flexibility of the EVM, enabling developers to build scalable DeFi, NFT, and dApp solutions powered by Bitcoin. ");
            const helpEmbed = new discord_js_1.MessageEmbed()
                .setTitle("Help")
                .setDescription(`

				${EXAMPLE_HELP}
		
				
			`)
                .setThumbnail(IMAGE_DEFAULT)
                .addField("Author", AUTHOR, true)
                .addField("Name", BOT_NAME, true)
                .addField("Version", "1.0.0", true);
            msg.channel.send(helpEmbed);
            // client.user.setAvatar(IMAGE_DEFAULT)
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.on("message", async (msg) => {
    try {
        if (msg.content === "!world") {
            msg.reply("Building a mini app means you will get instant exposure to the 23 million World App users. All World App users already have an integrated wallet and free transaction fees on World Chain (part of the super chain). We will be working closely with teams that want to build a real app reaching millions of people this weekend. To be considered for the Mini App bounties you MUST use any of the Minikit SDK commands found on our docs. Learn more: https://www.youtube.com/watch?v=QJ0htHP6lb0");
            // client.user.setAvatar(IMAGE_DEFAULT)
            msg.reply("https://world.org");
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.on("message", async (msg) => {
    try {
        if (msg.content === "!world") {
            msg.reply("Welcome to World");
            // client.user.setAvatar(IMAGE_DEFAULT)
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.on("message", async (msg) => {
    try {
        if (msg.content === "!hederaContract") {
            msg.reply("Hedera stands apart as a leading EVM blockchain through its distinctive developer experience. Developers of all backgrounds can leverage familiar tools like Solidity and EVM libraries or SDKs in JavaScript, Rust, Python and more to build applications. The AI Agent Kit SDK also enables you to build agentic applications easily. The blockchain network is powered by the hashgraph consensus algorithm which enables 10,000+ TPS, 3s finality, low fixed fees priced in USD, and fair ordering (no MEV).");
            // client.user.setAvatar(IMAGE_DEFAULT)
            msg.reply('List of testnet' + 'https://chainlist.org/?search=hedera&testnets=true');
            msg.reply("https://hashscan.io/testnet/transaction/0.0.7306908@1763859445.575000936");
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.on("message", async (msg) => {
    try {
        if (msg.content === "!ping") {
            const accountBalance = BigInt(await web3.eth.getBalance(SENDER_ADDRESS));
            const msgEmbed = new discord_js_1.MessageEmbed()
                .setColor(EMBED_COLOR_PRIMARY)
                .setDescription(BOT_NAME)
                .setURL(URL_BOT)
                .setAuthor("Author: " + AUTHOR, IMAGE_DEFAULT, URL_BOT)
                .setThumbnail(LOGO)
                .addField("Current account balance", `${accountBalance / (10n ** 18n)} ${TOKEN_NAME}`)
                .setImage(LOGO)
                .setFooter(BOT_NAME_FOOTER, IMAGE_DEFAULT)
                .setTimestamp();
            msg.channel.send(msgEmbed);
            client.user.setActivity("tokens", { type: "WATCHING" });
            // client.user.setAvatar(IMAGE_DEFAULT)
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR Data", e.stack || e);
    }
});
// Command: !rootblock -> fetch block number from Rootstock testnet RPC
client.on("message", async (msg) => {
    try {
        if (msg.content === "!rootblock") {
            msg.reply("Querying Rootstock testnet for block number...");
            try {
                const blockNumber = await getRootstockBlockNumber();
                msg.channel.send(`Rootstock testnet block number: ${blockNumber}`);
            }
            catch (err) {
                msg.channel.send("Failed to fetch block number: " + (err.message || err));
            }
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
// Command: !rootbalance [address] -> fetch balance from Rootstock testnet RPC
client.on("message", async (msg) => {
    try {
        if (msg.content.startsWith("!rootbalance")) {
            const parts = msg.content.split(/\s+/);
            const target = parts[1] && parts[1].startsWith("0x") ? parts[1] : "0x1fab9a0e24ffc209b01faa5a61ad4366982d0b7f";
            msg.reply(`Querying Rootstock testnet for balance of ${target}...`);
            try {
                const bal = await getRootstockBalance(target);
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("Rootstock Balance")
                    .addField("Address", target, true)
                    .addField("Balance (wei)", bal.wei, true)
                    .addField("Balance (R-BTC)", bal.ether + "", true)
                    .setTimestamp()
                    .setColor(EMBED_COLOR_PRIMARY);
                msg.channel.send(embed);
            }
            catch (err) {
                msg.channel.send("Failed to fetch balance: " + (err.message || err));
            }
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
// Command: !hederabalance [accountId] -> fetch HBAR balance from Hedera mirror-node (testnet)
client.on("message", async (msg) => {
    try {
        if (msg.content.startsWith("!hederabalance")) {
            const parts = msg.content.split(/\s+/);
            const target = parts[1] || process.env.HEDERA_ACCOUNT || "0.0.1001";
            msg.reply(`Querying Hedera testnet mirror-node for balance of ${target}...`);
            try {
                const balance = await getHederaBalance(target);
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("Hedera Account Balance")
                    .addField("Account", target, true)
                    .addField("Balance (tinybars)", balance.tinybars, true)
                    .addField("Balance (HBAR)", balance.hbar + " HBAR", true)
                    .setTimestamp()
                    .setColor(EMBED_COLOR_PRIMARY);
                msg.channel.send(embed);
                msg.channel.send("Hedera " + 'https://hashscan.io/testnet/account/' + target);
            }
            catch (err) {
                msg.channel.send("Failed to fetch Hedera balance: " + (err.message || err));
            }
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
// Helper: get balance from World RPC (supports ws/http providers)
async function getWorldBalanceRPC(address) {
    const rpcWs = process.env.RPC_URL_WORLD_WS || process.env.RPC_URL_WORLD;
    if (!rpcWs)
        throw new Error("No World RPC URL configured (RPC_URL_WORLD_WS or RPC_URL_WORLD)");
    let providerWeb3;
    try {
        if (rpcWs.startsWith("ws://") || rpcWs.startsWith("wss://")) {
            providerWeb3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(rpcWs));
        }
        else {
            providerWeb3 = new web3_1.default(rpcWs);
        }
        const balStr = await providerWeb3.eth.getBalance(address);
        const wei = BigInt(balStr.toString());
        const weiStr = wei.toString();
        const whole = wei / (10n ** 18n);
        const rem = wei % (10n ** 18n);
        const remStr = rem.toString().padStart(18, "0");
        const etherStr = `${whole.toString()}.${remStr.slice(0, 6)}`;
        // If we created a websocket provider, attempt to disconnect it
        try {
            const prov = providerWeb3.currentProvider;
            if (prov && typeof prov.disconnect === "function")
                prov.disconnect();
            if (prov && typeof prov.close === "function")
                prov.close();
        }
        catch (e) {
            // ignore
        }
        return { wei: weiStr, ether: etherStr };
    }
    catch (e) {
        throw e;
    }
}
// Command: !worldbalance -> show balance of `ACCOUNT_PUBLIC_WORLD` using `RPC_URL_WORLD_WS`/`RPC_URL_WORLD`
client.on("message", async (msg) => {
    try {
        if (msg.content.startsWith("!worldbalance")) {
            const parts = msg.content.split(/\s+/);
            const target = parts[1] || process.env.ACCOUNT_PUBLIC_WORLD || process.env.ADDRESS;
            msg.reply(`Querying World RPC ${process.env.RPC_URL_WORLD_WS || process.env.RPC_URL_WORLD} for ${target}...`);
            try {
                const bal = await getWorldBalanceRPC(target);
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("World Account Balance")
                    .addField("Address", target, true)
                    .addField("Balance (wei)", bal.wei, true)
                    .addField("Balance (native)", bal.ether + "", true)
                    .setTimestamp()
                    .setColor(EMBED_COLOR_PRIMARY);
                msg.channel.send(embed);
            }
            catch (err) {
                msg.channel.send("Failed to fetch World balance: " + (err.message || err));
            }
        }
    }
    catch (e) {
        msg.reply("ERROR");
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.login(process.env.DISCORD_TOKEN);
