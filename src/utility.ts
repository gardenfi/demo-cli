import { BitcoinWallet, BitcoinProvider, EVMWallet } from "@catalogfi/wallets";
import { JsonRpcProvider, Wallet } from "ethers";
import { Orderbook, Chains } from "@gardenfi/orderbook";
import { GardenJS } from "@gardenfi/core";

import { writeFileSync, existsSync, readFileSync } from "fs";

import { WalletError } from "./errors.ts";
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

function getEvmWallet(dotConfig: DotConfig, ethereumProvider: JsonRpcProvider) {
    if (!dotConfig.evmPrivateKey) throw new WalletError();

    const wallet = new Wallet(dotConfig.evmPrivateKey, ethereumProvider);
    return new EVMWallet(wallet);
}

function getBitcoinWallet(
    dotConfig: DotConfig,
    bitcoinProvider: BitcoinProvider
) {
    if (!dotConfig.bitcoinPrivateKey) throw new WalletError();
    return BitcoinWallet.fromWIF(dotConfig.bitcoinPrivateKey, bitcoinProvider);
}

async function getGarden(
    dotConfig: DotConfig,
    ethereumProvider: JsonRpcProvider,
    bitcoinProvider: BitcoinProvider
) {
    if (!dotConfig.evmPrivateKey) throw new WalletError();

    const orderbook = await Orderbook.init({
        url: "https://stg-test-orderbook.onrender.com/",
        signer: new Wallet(dotConfig.evmPrivateKey, ethereumProvider),
    });

    const wallets = {
        [Chains.bitcoin_testnet]: getBitcoinWallet(dotConfig, bitcoinProvider),
        [Chains.ethereum_sepolia]: getEvmWallet(dotConfig, ethereumProvider),
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
    getEvmWallet,
    getBitcoinWallet,
    getGarden,
};
