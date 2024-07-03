# Demo CLI
This is an example on building a command-line interface tool using the [Garden SDK](https://docs.garden.finance/developers/sdk/). This tool lets you swap between WBTC (Wrapped Bitcoin) and BTC (Bitcoin) directly from your terminal. For a step-by-step guide on how this CLI was built, refer to [cookbook/demo-cli](https://docs.garden.finance/cookbook/demo-cli).

> [!NOTE] 
> This example is meant to help you get started with the Garden SDK. It is not a complete or optimized tool and does not follow all best practices.

## Getting Started

1. Clone the repository.

```bash
git clone https://github.com/gardenfi/demo-cli
cd demo-cli
```

2. Install the required dependencies.

```bash
bun install
bun link
bun link swapper
```

3. Get the `API_KEY`. The `API_KEY` is used for initializing the `ETHEREUM_PROVIDER`.

```ts
// File: src/index.ts

// Part of the code that does the initialization
const API_KEY = readFileSync(join(homedir(), ".swapper_api_key"),"utf-8");
const RPC_PROVIDER_URL = `https://sepolia.gateway.tenderly.co/${API_KEY}`;
const ETHEREUM_PROVIDER = new JsonRpcProvider(RPC_PROVIDER_URL);
```

> [!Note]
> Here we are using [Tenderly](https://tenderly.co/) as an RPC Provider.

4. To obtain the `API_KEY` from Tenderly,go to the [Tenderly](https://tenderly.co/) Dashboard. Navigate to Node RPCs and click Create Node & Sepolia as your network.

5. Set up the `API_KEY`.

```bash
chmod +x setup_key.sh
./setup_key.sh <API_KEY>
```

## Running the CLI

### Creating Wallets
Create an EVM wallet.
```bash
swapper createevmwallet --privatekey=<PRIVATE_KEY>
``` 

![createevmwallet](https://github.com/gardenfi/swapper-cli/assets/162546266/ae5b5d56-3c18-49b3-a062-8a052b893da4)

Create a Bitcoin wallet.
```bash
swapper createbitcoinwallet --privatekey=<PRIVATE_KEY>
```
![createbitcoinwallet](https://github.com/gardenfi/swapper-cli/assets/162546266/8658441e-69d4-4d2d-acb4-e2be5f720d50)

### Swapping
Swap between **WBTC** to **BTC**.
```bash
swapper swapwbtctobtc --amount=0.0001
```
![swapwbtctobtc](https://github.com/gardenfi/swapper-cli/assets/162546266/6725458e-e523-4659-b275-bdeedbb303e4)

Swap between **BTC** to **WBTC**.

```bash
swapper swapbtctowbtc --amount=0.0001
```
![swapbtctowbtc](https://github.com/gardenfi/demo-cli/assets/162546266/7adb07d2-b79c-4ff6-b34a-358d41294220)

### Get Details
A utility command useful for looking up the `$HOME/.swapper_config.json` file.
```bash
swapper getdetails
```
![getdetails](https://github.com/gardenfi/demo-cli/assets/162546266/4095a1e2-ce4b-4280-be51-943ce96cc701)
