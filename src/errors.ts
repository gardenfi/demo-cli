class KeyError extends Error {
    constructor(message = "Private key is undefined") {
        super(message);
        this.name = "KeyError";
    }
}

class WalletError extends Error {
    constructor(message = "Wallets have not been initialised") {
        super(message);
        this.name = "WalletError";
    }
}

class AmountError extends Error {
    constructor(message = "Amount is not specified") {
        super(message);
        this.name = "AmountError";
    }
}

export { KeyError, WalletError, AmountError };
