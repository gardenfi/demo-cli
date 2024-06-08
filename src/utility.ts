import { BitcoinWallet, BitcoinProvider, EVMWallet } from "@catalogfi/wallets";
import { JsonRpcProvider, Wallet } from "ethers";
import { Orderbook, Chains } from "@gardenfi/orderbook";
import { GardenJS } from "@gardenfi/core";

import { writeFileSync, existsSync, readFileSync } from "fs";

import { WalletError } from "./errors.ts";
import { type DotConfig } from "./types.ts";

// Utility Functions
function readJsonFileSync(DOT_CONFIG_PATH: string): DotConfig {
    createDotConfig(DOT_CONFIG_PATH);
    const fileContent = readFileSync(DOT_CONFIG_PATH, "utf-8");
    return JSON.parse(fileContent);
}

function createDotConfig(DOT_CONFIG_PATH: string) {
    if (existsSync(DOT_CONFIG_PATH)) return;
    writeFileSync(DOT_CONFIG_PATH, JSON.stringify({}));
    console.info(`${DOT_CONFIG_PATH} created!`);
}

function getEvmWallet(
    dotConfig: DotConfig,
    ETHEREUM_PROVIDER: JsonRpcProvider
) {
    if (!dotConfig.evmPrivateKey) throw new WalletError();

    const wallet = new Wallet(dotConfig.evmPrivateKey, ETHEREUM_PROVIDER);
    return new EVMWallet(wallet);
}

function getBitcoinWallet(
    dotConfig: DotConfig,
    BITCOIN_PROVIDER: BitcoinProvider
) {
    if (!dotConfig.bitcoinPrivateKey) throw new WalletError();
    return BitcoinWallet.fromWIF(dotConfig.bitcoinPrivateKey, BITCOIN_PROVIDER);
}

async function getGarden(
    dotConfig: DotConfig,
    ETHEREUM_PROVIDER: JsonRpcProvider,
    BITCOIN_PROVIDER: BitcoinProvider
) {
    if (!dotConfig.evmPrivateKey) throw new WalletError();

    const orderbook = await Orderbook.init({
        url: "https://stg-test-orderbook.onrender.com/",
        signer: new Wallet(dotConfig.evmPrivateKey, ETHEREUM_PROVIDER),
    });

    const wallets = {
        [Chains.bitcoin_testnet]: getBitcoinWallet(dotConfig, BITCOIN_PROVIDER),
        [Chains.ethereum_sepolia]: getEvmWallet(dotConfig, ETHEREUM_PROVIDER),
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
