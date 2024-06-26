# Swapper CLI
Swapper CLI is a simple example of how to build a command-line interface tool using the [Garden SDK](https://docs.garden.finance/developers/sdk/). This tool lets you swap between WBTC (Wrapped Bitcoin) and BTC (Bitcoin) directly from your terminal. For a step-by-step guide on how this CLI was built, refer to the [CLI tool with Garden SDK](https://docs.garden.finance/cookbook/cli-tool-with-garden-sdk) guide.

**Disclaimer:**  This example is meant to help you get started with the Garden SDK. It is not a complete or optimized tool and does not follow all best practices.
## Getting Started

### Cloning the Repository

```bash
git clone https://github.com/gardenfi/swapper-cli
cd swapper-cli
```

### Installing Dependencies

```bash
bun install
bun link
bun link swapper
```

### Getting the `API_KEY`

The API_KEY is used for initializing the ETHEREUM_PROVIDER.

```ts
// File: src/index.ts

// Part of the code that does the initialization
const API_KEY = readFileSync(join(homedir(), ".swapper_api_key"),"utf-8");
const RPC_PROVIDER_URL = `https://sepolia.gateway.tenderly.co/${API_KEY}`;
const ETHEREUM_PROVIDER = new JsonRpcProvider(RPC_PROVIDER_URL);
```

> Note: Here we are using [Tenderly](https://tenderly.co/) as an RPC Provider.

#### Obtaining the API_KEY from Tenderly
1. Go to the [Tenderly](https://tenderly.co/) Dashboard.
2. Navigate to Node RPCs.
3. Click Create Node & Sepolia as your network.

### Setting up the `API_KEY`

```bash
chmod +x setup_key.sh
./setup_key.sh <API_KEY>
```

## Running the CLI

### Creating Wallets
**Creating an evm wallet** 
```bash
swapper createevmwallet --privatekey=<PRIVATE_KEY>
``` 

![createevmwallet](https://github.com/gardenfi/swapper-cli/assets/162546266/ae5b5d56-3c18-49b3-a062-8a052b893da4)

**Creating a bitcoin wallet**
```bash
swapper createbitcoinwallet --privatekey=<PRIVATE_KEY>
```
![createbitcoinwallet](https://github.com/gardenfi/swapper-cli/assets/162546266/8658441e-69d4-4d2d-acb4-e2be5f720d50)

### Swapping
**To swap between `WBTC` to `BTC`, you can use `swapwbtctobtc`**
```bash
swapper swapwbtctobtc --amount=0.0001
```
![swapwbtctobtc](https://github.com/gardenfi/swapper-cli/assets/162546266/6725458e-e523-4659-b275-bdeedbb303e4)

**To swap between `BTC` to `WBTC`, you can use `swapbtctowbtc`**

### Getting details
```bash
swapper getdetails
```
A utility command useful for looking up the `$HOME/.swapper_config.json` file.

![carbon(5)](https://github.com/gardenfi/swapper-cli/assets/162546266/1db15518-239a-4d39-a481-31045ac818c8)
