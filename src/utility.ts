import { BitcoinWallet, BitcoinProvider, EVMWallet } from "@catalogfi/wallets";
import { JsonRpcProvider, Wallet } from "ethers";
import { Orderbook, Chains } from "@gardenfi/orderbook";
import { GardenJS } from "@gardenfi/core";

import { writeFileSync, existsSync, readFileSync } from "fs";

import { type DotConfig } from "./types.ts";

// Utility Functions
function readJsonFileSync(dotConfigPath: string): DotConfig {
    createDotConfig(dotConfigPath);
    const fileContent = readFileSync(dotConfigPath, "utf-8");
    return JSON.parse(fileContent);
}

function createDotConfig(dotConfigPath: string) {
    if (existsSync(dotConfigPath)) return;
    writeFileSync(dotConfigPath, JSON.stringify({}));
    console.info(`${dotConfigPath} created!`);
}

function getEVMWallet(
    evmPrivateKey: string,
    ethereumProvider: JsonRpcProvider
) {
    const wallet = new Wallet(evmPrivateKey, ethereumProvider);
    return new EVMWallet(wallet);
}

function getBitcoinWallet(
    bitcoinPrivateKey: string,
    bitcoinProvider: BitcoinProvider
) {
    return BitcoinWallet.fromWIF(bitcoinPrivateKey, bitcoinProvider);
}

async function getGarden(
    evmPrivateKey: string,
    evmWallet: EVMWallet,
    bitcoinWallet: BitcoinWallet
) {
    const orderbook = await Orderbook.init({
        url: "https://orderbook-testnet.garden.finance/",
        signer: new Wallet(evmPrivateKey, evmWallet.getProvider()),
    });

    const wallets = {
        [Chains.bitcoin_testnet]: bitcoinWallet,
        [Chains.ethereum_sepolia]: evmWallet,
    };

    return new GardenJS(orderbook, wallets);
}

function logAddressAndBalance(address: string, balance: number | bigint) {
    console.info("Fetching Address and Balance...");
    console.info(`Address : ${address}`);
    console.info(`Balance : ${balance}`);
}

export {
    readJsonFileSync,
    createDotConfig,
    logAddressAndBalance,
    getEVMWallet,
    getBitcoinWallet,
    getGarden,
};
