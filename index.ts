#! /usr/bin/env bun

import {
    BitcoinWallet,
    BitcoinProvider,
    BitcoinNetwork,
    EVMWallet,
} from "@catalogfi/wallets";
import { JsonRpcProvider, Wallet } from "ethers";
import { Assets, parseStatus, Actions } from "@gardenfi/orderbook";

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

import { ivar, ccreator } from "./src/command.ts";
import { getEvmWallet, getGarden, readJsonFileSync, logAddressAndBalance } from "./src/utility.ts";
import { KeyError, WalletError, AmountError } from "./src/errors.ts";

if (!existsSync(join(homedir(), ".swapper_api_key"))) {
    throw new Error("API_KEY not found, try running ./setup_key.sh <API_KEY> in the swapper dir");
}

// Constants
const API_KEY = readFileSync(join(homedir(), ".swapper_api_key"), "utf-8");
const RPC_PROVIDER_URL = `https://sepolia.gateway.tenderly.co/${API_KEY}`;
const ETHEREUM_PROVIDER = new JsonRpcProvider(RPC_PROVIDER_URL);
const BITCOIN_PROVIDER = new BitcoinProvider(BitcoinNetwork.Testnet);
const DOT_CONFIG_PATH = join(homedir(), ".swapper_config.json");

// Read config
let dotConfig = readJsonFileSync(DOT_CONFIG_PATH);

// Command Definitions
ccreator.command("createevmwallet", "creates a evm wallet", async () => {
    const { privatekey: privateKey } = ivar;

    if (!privateKey) throw new KeyError();

    const wallet = new Wallet(privateKey, ETHEREUM_PROVIDER);
    const evmWallet = new EVMWallet(wallet);

    const address = await evmWallet.getAddress();
    const balance = await evmWallet.getProvider().getBalance(address);

    logAddressAndBalance(address, balance);

    dotConfig.evmPrivateKey = privateKey;
    writeFileSync(DOT_CONFIG_PATH, JSON.stringify(dotConfig));

    console.info(`Saved to ${DOT_CONFIG_PATH}`);
});

ccreator.command(
    "createbitcoinwallet",
    "creates a bitcoin wallet",
    async () => {
        const { privatekey: privateKey } = ivar;

        if (!privateKey) throw new KeyError();

        const bitcoinWallet = BitcoinWallet.fromWIF(
            privateKey,
            BITCOIN_PROVIDER
        );
        const address = await bitcoinWallet.getAddress();
        const balance = await bitcoinWallet.getBalance();

        logAddressAndBalance(address, balance);
        
        dotConfig.bitcoinPrivateKey = privateKey;
        writeFileSync(DOT_CONFIG_PATH, JSON.stringify(dotConfig));

        console.info(`Saved to ${DOT_CONFIG_PATH}`);
    }
);

ccreator.command(
    "getdetails",
    "gets the contents of $HOME/.swapper_config.json",
    () => {
        console.info(readJsonFileSync(DOT_CONFIG_PATH));
    }
);

ccreator.command("swapwbtctobtc", "Swaps from WBTC to BTC", async () => {
    const { amount } = ivar;

    if (!dotConfig.bitcoinPrivateKey || !dotConfig.evmPrivateKey)
        throw new WalletError();
    if (!amount) throw new AmountError();

    const evmWallet = getEvmWallet(dotConfig, ETHEREUM_PROVIDER);
    const garden = await getGarden(
        dotConfig,
        ETHEREUM_PROVIDER,
        BITCOIN_PROVIDER
    );

    const sendAmount = amount * 1e8;
    const recieveAmount = (1 - 0.3 / 100) * sendAmount;

    const orderId = await garden.swap(
        Assets.ethereum_sepolia.WBTC,
        Assets.bitcoin_testnet.BTC,
        sendAmount,
        recieveAmount
    );

    garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
        const order = orders.filter((order) => order.ID === orderId)[0];
        if (!order) return;

        const action = parseStatus(order);
        if (
            action === Actions.UserCanInitiate ||
            action === Actions.UserCanRedeem
        ) {
            const swapper = garden.getSwap(order);
            const performedAction = await swapper.next();
            console.info(
                `Completed Action ${performedAction.action} with transaction hash: ${performedAction.output}`
            );
        }
    });
});

ccreator.parse();
