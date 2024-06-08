# Swapper CLI

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

The `API_KEY` is used for initializing the `ETHEREUM_PROVIDER`.

```ts
// File: src/index.ts

// Part of the code that does the initialization
const API_KEY = readFileSync(join(homedir(), ".swapper_api_key"),"utf-8");
const RPC_PROVIDER_URL = `https://sepolia.gateway.tenderly.co/${API_KEY}`;
const ETHEREUM_PROVIDER = new JsonRpcProvider(RPC_PROVIDER_URL);
```

> Note: Here we are using [Tenderly](https://tenderly.co/) as an RPC Provider.

#### Obtaining the `API_KEY` from Tenderly
1. Go to the [Tenderly](https://tenderly.co/) Dashboard.
2. Navigate to Node RPCs.
3. Click Create Node & Sepolia as your network.

### Setting up the `API_KEY`

```bash
chmod +x setup_key.sh
./setup_key.sh <API_KEY>
```

## Running the CLI



