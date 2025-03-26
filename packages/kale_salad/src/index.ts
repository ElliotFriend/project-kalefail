import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
    Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type { u32, i128, Option } from '@stellar/stellar-sdk/contract';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CBOGCH2B2XDT3JSXDOUZIZJA43WTQCHLJYEOATQBTB37XC2BT7KU2F5S',
    },
    public: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        contractId: 'CC23DRQPZAUP5MRMPDFGU5R4ISZRSCWCP4TIED2ZTVJLQCPCNDLSALAD',
    },
} as const;

export const Errors = {
    101: { message: 'UnsetMetadata' },

    /**
     * Indicates an error related to the payment vegetables. Used in `__constructor`.
     */
    104: { message: 'TooFewVegetables' },

    /**
     * Indicates an error related to the number of tokens a single address can hold.
     */
    201: { message: 'AllTokensMinted' },

    /**
     * Indicates an error related to the number of tokens ever to be minted.
     */
    202: { message: 'MaxTokensReached' },

    /**
     * Indicates a non-existent `token_id`.
     */
    300: { message: 'NonExistentToken' },

    /**
     * Indicates an error related to the ownership over a particular token. Used in `transfer`s and approvals.
     */
    301: { message: 'IncorrectOwner' },

    /**
     * Indicates a failure with the `spender`’s approval. Used in `transfer_from`s.
     */
    302: { message: 'InsufficientApproval' },

    /**
     * Indicates a failure with the `spender` of a token to be approved. Used in approvals.
     */
    303: { message: 'InvalidSpender' },

    /**
     * Indicates an invalid value for `expiration_edger` when setting approvals.
     */
    304: { message: 'InvalidExpirationLedger' },
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
    | { tag: 'Admin'; values: void }
    | { tag: 'Metadata'; values: void }
    | { tag: 'Vegetables'; values: void }
    | { tag: 'PaymentPerNft'; values: void }
    | { tag: 'Supply'; values: void }
    | { tag: 'MintIndex'; values: void }
    | { tag: 'Balance'; values: readonly [string] }
    | { tag: 'Owner'; values: readonly [u32] }
    | { tag: 'Approved'; values: readonly [u32] }
    | { tag: 'ApprovedAll'; values: readonly [string] };

export interface Client {
    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    upgrade: (
        { new_wasm_hash }: { new_wasm_hash: Buffer },
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
        { payment_each_vegetable }: { payment_each_vegetable: i128 },
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
        { owner, number_of_tokens }: { owner: string; number_of_tokens: Option<u32> },
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
     * Construct and simulate a set_base_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    set_base_uri: (
        { base_uri }: { base_uri: string },
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
        { owner, token_id }: { owner: string; token_id: u32 },
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
        { spender, owner, token_id }: { spender: string; owner: string; token_id: u32 },
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
        { id }: { id: string },
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
        { token_id }: { token_id: u32 },
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
        }: { owner: string; spender: string; token_id: u32; expiration_ledger: u32 },
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
        { token_id }: { token_id: u32 },
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
        }: { owner: string; spender: string; expiration_ledger: u32 },
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
        { owner, spender }: { owner: string; spender: string },
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
        { owner, to, token_id }: { owner: string; to: string; token_id: u32 },
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
        }: { spender: string; owner: string; to: string; token_id: u32 },
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
        { token_id }: { token_id: u32 },
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
export class Client extends ContractClient {
    static async deploy<T = Client>(
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
    ): Promise<AssembledTransaction<T>> {
        return ContractClient.deploy(
            { admin, nft_name, nft_symbol, base_uri, vegetables, payment_each_vegetable },
            options,
        );
    }
    constructor(public readonly options: ContractClientOptions) {
        super(
            new ContractSpec([
                'AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAACQAAAAAAAAANVW5zZXRNZXRhZGF0YQAAAAAAAGUAAABOSW5kaWNhdGVzIGFuIGVycm9yIHJlbGF0ZWQgdG8gdGhlIHBheW1lbnQgdmVnZXRhYmxlcy4gVXNlZCBpbiBgX19jb25zdHJ1Y3RvcmAuAAAAAAAQVG9vRmV3VmVnZXRhYmxlcwAAAGgAAABNSW5kaWNhdGVzIGFuIGVycm9yIHJlbGF0ZWQgdG8gdGhlIG51bWJlciBvZiB0b2tlbnMgYSBzaW5nbGUgYWRkcmVzcyBjYW4gaG9sZC4AAAAAAAAPQWxsVG9rZW5zTWludGVkAAAAAMkAAABFSW5kaWNhdGVzIGFuIGVycm9yIHJlbGF0ZWQgdG8gdGhlIG51bWJlciBvZiB0b2tlbnMgZXZlciB0byBiZSBtaW50ZWQuAAAAAAAAEE1heFRva2Vuc1JlYWNoZWQAAADKAAAAJEluZGljYXRlcyBhIG5vbi1leGlzdGVudCBgdG9rZW5faWRgLgAAABBOb25FeGlzdGVudFRva2VuAAABLAAAAGdJbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byB0aGUgb3duZXJzaGlwIG92ZXIgYSBwYXJ0aWN1bGFyIHRva2VuLiBVc2VkIGluIGB0cmFuc2ZlcmBzIGFuZCBhcHByb3ZhbHMuAAAAAA5JbmNvcnJlY3RPd25lcgAAAAABLQAAAE5JbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGBzcGVuZGVyYOKAmXMgYXBwcm92YWwuIFVzZWQgaW4gYHRyYW5zZmVyX2Zyb21gcy4AAAAAABRJbnN1ZmZpY2llbnRBcHByb3ZhbAAAAS4AAABUSW5kaWNhdGVzIGEgZmFpbHVyZSB3aXRoIHRoZSBgc3BlbmRlcmAgb2YgYSB0b2tlbiB0byBiZSBhcHByb3ZlZC4gVXNlZCBpbiBhcHByb3ZhbHMuAAAADkludmFsaWRTcGVuZGVyAAAAAAEvAAAASUluZGljYXRlcyBhbiBpbnZhbGlkIHZhbHVlIGZvciBgZXhwaXJhdGlvbl9lZGdlcmAgd2hlbiBzZXR0aW5nIGFwcHJvdmFscy4AAAAAAAAXSW52YWxpZEV4cGlyYXRpb25MZWRnZXIAAAABMA==',
                'AAAAAQAAAAAAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ',
                'AAAAAQAAAAAAAAAAAAAADEFwcHJvdmVkRGF0YQAAAAIAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAAAAAAHc3BlbmRlcgAAAAAT',
                'AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAACgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAITWV0YWRhdGEAAAAAAAAAAAAAAApWZWdldGFibGVzAAAAAAAAAAAAAAAAAA1QYXltZW50UGVyTmZ0AAAAAAAAAAAAAAAAAAAGU3VwcGx5AAAAAAAAAAAAAAAAAAlNaW50SW5kZXgAAAAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAFT3duZXIAAAAAAAABAAAABAAAAAEAAAAAAAAACEFwcHJvdmVkAAAAAQAAAAQAAAABAAAAAAAAAAtBcHByb3ZlZEFsbAAAAAABAAAAEw==',
                'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAYAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIbmZ0X25hbWUAAAAQAAAAAAAAAApuZnRfc3ltYm9sAAAAAAAQAAAAAAAAAAhiYXNlX3VyaQAAABAAAAAAAAAACnZlZ2V0YWJsZXMAAAAAA+oAAAATAAAAAAAAABZwYXltZW50X2VhY2hfdmVnZXRhYmxlAAAAAAALAAAAAA==',
                'AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA',
                'AAAAAAAAAAAAAAAJc2V0X3ByaWNlAAAAAAAAAQAAAAAAAAAWcGF5bWVudF9lYWNoX3ZlZ2V0YWJsZQAAAAAACwAAAAA=',
                'AAAAAAAAAtVNaW50IGEgS0FMRSBTYWxhZCBORlQgdG8gdGhlIGJhbGFuY2Ugb2YgYG93bmVyYC4KCiMgQXJndW1lbnRzCgotIGBvd25lcmAgLSBUaGUgYWRkcmVzcyB3aGljaCB3aWxsIG93biB0aGUgbWludGVkIE5GVChzKQotIGBwYXltZW50X2VhY2hfdmVnZXRhYmxlYCAtIEhvdyBtdWNoIG9mIGVhY2ggdmVnZXRhYmxlIChpbiBzdHJvb3BzKSB0aGUKb3duZXIgaXMgcGF5aW5nIGluIGV4Y2hhbmdlIGZvciB0aGUgTkZULgotIGBudW1iZXJfb2ZfdG9rZW5zYCAtIFRoZSBudW1iZXIgb2YgTkZUcyB3aGljaCBzaG91bGQgYmUgbWludGVkIHRvIHRoZQpvd25lcidzIGFkZHJlc3MuCgojIFBhbmljcwoKLSBJZiB0aGUgcGF5bWVudCBhbW91bnQgZG9lcyBub3QgbWVldCB0aGUgcmVxdWlyZWQgbWluaW11bS4KLSBJZiB0aGUgdG90YWwgbWF4aW11bSBudW1iZXIgb2YgTkZUcyBoYXMgYWxyZWFkeSBiZWVuIG1pbnRlZC4KLSBJZiB0aGUgcmVxdWVzdGVkIG51bWJlciBvZiBORlRzIHdvdWxkIGV4Y2VlZCB0aGUgdG90YWwgbWF4aW11bSBORlRzLgotIElmIHRoZSByZXF1ZXN0ZWQgbnVtYmVyIG9mIE5GVHMgd291bGQgZXhjZWVkIHRoZSBtYXhpbXVtIE5GVHMgYWxsb3dlZApwZXIgYWRkcmVzcy4KCiMgRXZlbnRzCgotIEVtaXRzIGFuIGV2ZW50IHdpdGg6Ci0gdG9waWNzIC0gYFsibWludCIsIGFkbWluOiBBZGRyZXNzLCBvd25lcjogQWRkcmVzc11gCi0gZGF0YSAtIGB0b2tlbl9pZDogdTMyYAAAAAAAAAptaW50X3NhbGFkAAAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAEG51bWJlcl9vZl90b2tlbnMAAAPoAAAABAAAAAA=',
                'AAAAAAAAAAAAAAAMc2V0X2Jhc2VfdXJpAAAAAQAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAA==',
                'AAAAAAAAAAAAAAAIYmFzZV91cmkAAAAAAAAAAQAAABA=',
                'AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=',
                'AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAA==',
                'AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACHRva2VuX2lkAAAABAAAAAA=',
                'AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAE',
                'AAAAAAAAAAAAAAAIb3duZXJfb2YAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAAEw==',
                'AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAABFleHBpcmF0aW9uX2xlZGdlcgAAAAAAAAQAAAAA',
                'AAAAAAAAAAAAAAAMZ2V0X2FwcHJvdmVkAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAA+gAAAAT',
                'AAAAAAAAAAAAAAALYXBwcm92ZV9hbGwAAAAAAwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAA=',
                'AAAAAAAAAAAAAAAPaXNfYXBwcm92ZWRfYWxsAAAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAQAAAAE=',
                'AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAA',
                'AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAA==',
                'AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==',
                'AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=',
                'AAAAAAAAAAAAAAAJdG9rZW5fdXJpAAAAAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAABA=',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        upgrade: this.txFromJSON<null>,
        set_price: this.txFromJSON<null>,
        mint_salad: this.txFromJSON<null>,
        set_base_uri: this.txFromJSON<null>,
        base_uri: this.txFromJSON<string>,
        decimals: this.txFromJSON<u32>,
        burn: this.txFromJSON<null>,
        burn_from: this.txFromJSON<null>,
        balance: this.txFromJSON<u32>,
        owner_of: this.txFromJSON<string>,
        approve: this.txFromJSON<null>,
        get_approved: this.txFromJSON<Option<string>>,
        approve_all: this.txFromJSON<null>,
        is_approved_all: this.txFromJSON<boolean>,
        transfer: this.txFromJSON<null>,
        transfer_from: this.txFromJSON<null>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        token_uri: this.txFromJSON<string>,
    };
}
