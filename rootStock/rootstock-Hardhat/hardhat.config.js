require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

const { ROOTSTOCK_MAINNET_PRIVATE_KEY, ROOTSTOCK_TESTNET_PRIVATE_KEY } = process.env;

function makeAccounts(key) {
  if (!key) return [];
  // ensure key starts with 0x
  return [key.startsWith('0x') ? key : `0x${key}`];
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    rskMainnet: {
      url: "https://rpc.mainnet.rootstock.io/gg1EqN38geRB99w7kX1x114dLFMre9-T",
      chainId: 30,
      gasPrice: 60000000,
      accounts: makeAccounts(ROOTSTOCK_MAINNET_PRIVATE_KEY)
    },
    rskTestnet: {
      url: "https://rpc.testnet.rootstock.io/gg1EqN38geRB99w7kX1x114dLFMre9-T",
      chainId: 31,
      gasPrice: 60000000,
      accounts: makeAccounts(ROOTSTOCK_TESTNET_PRIVATE_KEY)
    }
  }
};