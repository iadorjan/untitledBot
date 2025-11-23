# Rootstock

🏆 Freestyle Track ⸺ $2,000
Up to 2 teams will receive $1,000
Build dapps on Rootstock and unleash your creativity. We’re looking for original solutions. Some examples include: 

🔸DeFi Automation Agents 
🔸Smart Contract Assistants 
🔸Cross-Chain Interoperability Agents 
🔸Decentralized Governance Helpers



1) Clear short one-sentence description of your submission:
Our bot aims to integrate the functionalities and APIs available from Rootstock. For example, it can display account balances and provide access within the Discord bot to view transactions or network deployments made by users.

2) Short description of what you integrated Rootstock with and how. 

An example of a visualization query is calling the eth_getBalance method and getting the response by calling RPC_URL= 'https://rpc.mainnet.rootstock.io/gg1EqN38geRB99w7kX1x114dLFMre9-T' defined within the project's .env environment variables

3) Short description of the team and their backgrounds.

We are two members, father and son. Alejandro (father) is a Systems Engineer, with a Master's degree in Computer Science and a PhD candidate, and Ignacio (son) is a student at ORT University Uruguay, where he is finishing his second year of studies.

 4) Clear instructions for testing the integration. 
 
 Once the bot's private variables are configured, both in the .env file and the Discord TOKEN, and the configurations and variables specified in .env.example, the bot is run with npm install, npm run run (which compiles to TypeScript and then runs the server).
 
 5) Feedback describing your experience with building on Rootstock. 
 
 The experience was incredibly interesting, allowing us to integrate the functionalities, create accounts, integrate faucets, view them in the browser, and more. The available documentation guidelines are very clear.

 6) A short video demo or slide deck.

 TODO:  Video URL


# Hedera
  EVM Innovator Track ⸺ $4,000

  Hedera’s EVM compatibility allows developers to write Solidity contracts while benefiting from fast finality and low fees. This bounty is about using cross‑chain and real‑world data to build innovative dApps. Example ideas include multi‑chain financing, cross‑chain auctions or data‑driven trading bots.

  Qualification Requirements

1. Deploy and verify a smart contract on Hedera — use Hedera mainnet, testnet or previewnet; verify contracts on Hashscan. 

We performed an implementation using the Account ID 0.0.7306908 and the corresponding EVM Address 0x9531f8ef72919d2b1ca6b3eacb2623f4c95d1f72

2. Integrate oracles and/or bridges — consume external price feeds from Chainlink, Pyth or Supra, and/or use Chainlink CCIP, LayerZero or HashPort for cross‑chain transfers. 

We performed an implementation with the account ID

0.0.7306908 and the corresponding EVM address

0x9531f8ef72919d2b1ca6b3eacb2623f4c95d1f72, verifying and viewing it in Hashscan. On one hand, with the command `!hederaContract` we can view the status of the deployed contract, and on the other hand, with `!hederabalance` we can view our account balance.

Integramos el bot utilizando la testnet 
 HEDERA_MIRROR_TESTNET = "https://testnet.mirrornode.hedera.com/api/v1/accounts/";
3. Use Hedera services where relevant — consider HTS System Contracts or the Token Service for hybrid native/EVM functionality. 

Although we do not integrate services due to time constraints, it is possible to extend and implement these functionalities in future work.


4. Deliverables —novel real‑world use case.

One of the main applications of this bot can be extended to be a Hedera airdrop, as well as a creator of private accounts for users who have no experience, or it is also possible to integrate it with Hedera's existing AI bot APIs.

VIDEO: 



