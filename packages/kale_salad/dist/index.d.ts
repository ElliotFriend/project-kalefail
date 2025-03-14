import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
} from '@stellar/stellar-sdk/contract';
import type { u32, i128, Option } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
export declare const networks: {
    readonly public: {
        readonly networkPassphrase: 'Public Global Stellar Network ; September 2015';
        readonly contractId: 'CC23DRQPZAUP5MRMPDFGU5R4ISZRSCWCP4TIED2ZTVJLQCPCNDLSALAD';
    };
};
export declare const Errors: {
    101: {
        message: string;
    };
    /**
     * Indicates an error related to the payment vegetables. Used in `__constructor`.
     */
    104: {
        message: string;
    };
    /**
     * Indicates an error related to the number of tokens a single address can hold.
     */
    201: {
        message: string;
    };
    /**
     * Indicates an error related to the number of tokens ever to be minted.
     */
    202: {
        message: string;
    };
    /**
     * Indicates a non-existent `token_id`.
     */
    300: {
        message: string;
    };
    /**
     * Indicates an error related to the ownership over a particular token. Used in `transfer`s and approvals.
     */
    301: {
        message: string;
    };
    /**
     * Indicates a failure with the `spender`’s approval. Used in `transfer_from`s.
     */
    302: {
        message: string;
    };
    /**
     * Indicates a failure with the `spender` of a token to be approved. Used in approvals.
     */
    303: {
        message: string;
    };
    /**
     * Indicates an invalid value for `expiration_edger` when setting approvals.
     */
    304: {
        message: string;
    };
};
export interface Metadata {
    base_uri: string;
    name: string;
    symbol: string;
}
export interface ApprovedData {
    expiration_ledger: u32;
    spender: string;
}
export type Storage =
    | {
          tag: 'Admin';
          values: void;
      }
    | {
          tag: 'Metadata';
          values: void;
      }
    | {
          tag: 'Vegetables';
          values: void;
      }
    | {
          tag: 'PaymentPerNft';
          values: void;
      }
    | {
          tag: 'Supply';
          values: void;
      }
    | {
          tag: 'MintIndex';
          values: void;
      }
    | {
          tag: 'Balance';
          values: readonly [string];
      }
    | {
          tag: 'Owner';
          values: readonly [u32];
      }
    | {
          tag: 'Approved';
          values: readonly [u32];
      }
    | {
          tag: 'ApprovedAll';
          values: readonly [string];
      };
export interface Client {
    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    upgrade: (
        {
            new_wasm_hash,
        }: {
            new_wasm_hash: Buffer;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a set_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    set_price: (
        {
            payment_each_vegetable,
        }: {
            payment_each_vegetable: i128;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a mint_salad transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Mint a KALE Salad NFT to the balance of `owner`.
     *
     * # Arguments
     *
     * - `owner` - The address which will own the minted NFT(s)
     * - `payment_each_vegetable` - How much of each vegetable (in stroops) the
     * owner is paying in exchange for the NFT.
     * - `number_of_tokens` - The number of NFTs which should be minted to the
     * owner's address.
     *
     * # Panics
     *
     * - If the payment amount does not meet the required minimum.
     * - If the total maximum number of NFTs has already been minted.
     * - If the requested number of NFTs would exceed the total maximum NFTs.
     * - If the requested number of NFTs would exceed the maximum NFTs allowed
     * per address.
     *
     * # Events
     *
     * - Emits an event with:
     * - topics - `["mint", admin: Address, owner: Address]`
     * - data - `token_id: u32`
     */
    mint_salad: (
        {
            owner,
            number_of_tokens,
        }: {
            owner: string;
            number_of_tokens: Option<u32>;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a base_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    base_uri: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    decimals: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    burn: (
        {
            owner,
            token_id,
        }: {
            owner: string;
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    burn_from: (
        {
            spender,
            owner,
            token_id,
        }: {
            spender: string;
            owner: string;
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    balance: (
        {
            id,
        }: {
            id: string;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a owner_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    owner_of: (
        {
            token_id,
        }: {
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    approve: (
        {
            owner,
            spender,
            token_id,
            expiration_ledger,
        }: {
            owner: string;
            spender: string;
            token_id: u32;
            expiration_ledger: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_approved transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_approved: (
        {
            token_id,
        }: {
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<Option<string>>>;
    /**
     * Construct and simulate a approve_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    approve_all: (
        {
            owner,
            spender,
            expiration_ledger,
        }: {
            owner: string;
            spender: string;
            expiration_ledger: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a is_approved_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    is_approved_all: (
        {
            owner,
            spender,
        }: {
            owner: string;
            spender: string;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    transfer: (
        {
            owner,
            to,
            token_id,
        }: {
            owner: string;
            to: string;
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    transfer_from: (
        {
            spender,
            owner,
            to,
            token_id,
        }: {
            spender: string;
            owner: string;
            to: string;
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    name: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    symbol: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a token_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    token_uri: (
        {
            token_id,
        }: {
            token_id: u32;
        },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;
            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;
            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<string>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {
            admin,
            nft_name,
            nft_symbol,
            base_uri,
            vegetables,
            payment_each_vegetable,
        }: {
            admin: string;
            nft_name: string;
            nft_symbol: string;
            base_uri: string;
            vegetables: Array<string>;
            payment_each_vegetable: i128;
        },
        /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
        options: MethodOptions &
            Omit<ContractClientOptions, 'contractId'> & {
                /** The hash of the Wasm blob, which must already be installed on-chain. */
                wasmHash: Buffer | string;
                /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
                salt?: Buffer | Uint8Array;
                /** The format used to decode `wasmHash`, if it's provided as a string. */
                format?: 'hex' | 'base64';
            },
    ): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        upgrade: (json: string) => AssembledTransaction<null>;
        set_price: (json: string) => AssembledTransaction<null>;
        mint_salad: (json: string) => AssembledTransaction<null>;
        base_uri: (json: string) => AssembledTransaction<string>;
        decimals: (json: string) => AssembledTransaction<number>;
        burn: (json: string) => AssembledTransaction<null>;
        burn_from: (json: string) => AssembledTransaction<null>;
        balance: (json: string) => AssembledTransaction<number>;
        owner_of: (json: string) => AssembledTransaction<string>;
        approve: (json: string) => AssembledTransaction<null>;
        get_approved: (json: string) => AssembledTransaction<Option<string>>;
        approve_all: (json: string) => AssembledTransaction<null>;
        is_approved_all: (json: string) => AssembledTransaction<boolean>;
        transfer: (json: string) => AssembledTransaction<null>;
        transfer_from: (json: string) => AssembledTransaction<null>;
        name: (json: string) => AssembledTransaction<string>;
        symbol: (json: string) => AssembledTransaction<string>;
        token_uri: (json: string) => AssembledTransaction<string>;
    };
}
