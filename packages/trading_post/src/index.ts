import { Buffer } from 'buffer';
import { Address } from '@stellar/stellar-sdk';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
    Result,
    Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
    u32,
    i32,
    u64,
    i64,
    u128,
    i128,
    u256,
    i256,
    Option,
    Typepoint,
    Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CB2GGSG7S4RU7VQP6ZWQRHB4HTTC5WXRVHJ4GBSU5W2ENN6KKPQJBJ55',
    },
} as const;

export const Errors = {
    1: { message: 'InvalidVegetable' },

    2: { message: 'TradingPostClosed' },

    3: { message: 'VegetablesRequired' },

    4: { message: 'ContractNotSacAdmin' },

    5: { message: 'VegetableNotForTrade' },

    6: { message: 'VegetableAlreadyForTrade' },

    7: { message: 'TradingPostOpen' },

    8: { message: 'TooManyVegetables' },

    9: { message: 'ShelfAlreadyBigger' },

    10: { message: 'ShelfAlreadySmaller' },

    11: { message: 'NotEnoughKale' },
};
export type Storage =
    | { tag: 'Owner'; values: void }
    | { tag: 'KaleAddress'; values: void }
    | { tag: 'Vegetables'; values: void }
    | { tag: 'MaxVegetables'; values: void }
    | { tag: 'IsOpen'; values: void };

export interface Client {
    /**
     * Construct and simulate a trade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Trade between `KALE` and some other, related vegetable.
     *
     * # Arguments
     *
     * * `customer` - The address of a customer making the trade.
     * * `vegetable` - The SAC address of the vegetable which should be traded
     * against `KALE`.
     * * `amount` - The amount of tokens (in stroops) which should be exchanged
     * between the customer and the trading post.
     * * `buy_kale` - Whether or not the customer should receive `KALE` or the
     * other vegetable.
     *
     * # Panics
     *
     * * If the trading post is not open for business.
     * * If the desired vegetable token is not in the list of available
     * vegetables.
     * * If the trading post contract does not have a high enough `KALE`
     * balance to send to the customer (if buying `KALE`).
     */
    trade: (
        {
            customer,
            vegetable,
            amount,
            buy_kale,
        }: { customer: string; vegetable: string; amount: i128; buy_kale: boolean },
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
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Upgrade the contract's Wasm bytecode. The trading post must be closed
     * before invoking this function.
     *
     * # Arguments
     *
     * * `new_wasm_hash` - Hash identifier for the bytecode that should be
     * henceforth used by this contract. The bytecode must already be
     * installed and present on-chain.
     *
     * # Panics
     *
     * * If the trading post is still open.
     * * If the Wasm bytecode is not already installed on-chain.
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
     * Construct and simulate a add_vegetables transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Add more vegetables which will be available to trade for using `KALE`
     * tokens.
     *
     * # Arguments
     *
     * * `vegetables_to_add` - A vector of vegetable asset contract addresses.
     *
     * # Panics
     *
     * * If a vegetable to be added is already available for trade.
     * * If the trading post is open for trading, but the SAC admin of a
     * provided vegetable contract is not the trading post contract address.
     */
    add_vegetables: (
        { vegetables_to_add }: { vegetables_to_add: Array<string> },
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
     * Construct and simulate a remove_vegetables transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Remove vegetables so they will no longer be available to trade for using
     * `KALE` tokens.
     *
     * # Arguments
     *
     * * `vegetables_to_remove` - A vector of vegetable asset contract
     * addresses.
     *
     * # Panics
     *
     * * If a vegetable to be removed is not already available for trade.
     */
    remove_vegetables: (
        { vegetables_to_remove }: { vegetables_to_remove: Array<string> },
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
     * Construct and simulate a grow_shelf_space transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Increase the maximum number of vegetables available for trade.
     *
     * # Arguments
     *
     * * `new_max_vegetables` - The new maximum number of vegetables that can
     * be available to trade.
     *
     * # Panics
     *
     * * If the existing maximum is greater than the provided new maximum.
     * * If the existing maximum is equal to the provided new maximum. Why even
     * bother then?
     */
    grow_shelf_space: (
        { new_max_vegetables }: { new_max_vegetables: u32 },
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
     * Construct and simulate a shrink_shelf_space transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Decrease the maximum number of vegetables available for trade.
     *
     * # Arguments
     *
     * * `new_max_vegetables` - The new maximum number of vegetables that can
     * be available to trade.
     *
     * # Panics
     *
     * * If the existing maximum is less than the provided new maximum.
     * * If the existing maximum is equal to the provided new maximum. Why even
     * bother then?
     * * If the number of available vegetables would be bigger than the new
     * maximum.
     */
    shrink_shelf_space: (
        { new_max_vegetables }: { new_max_vegetables: u32 },
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
     * Construct and simulate a open transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Open the trading post for business. The trading post is closed _by
     * default_, so this function will need to be invoked before trading can
     * begin.
     *
     * # Panics
     *
     * * If there are no vegetable assets available for trade.
     * * If one or more of the available vegetable assets does not have a SAC
     * admin set to this trading post contract's address.
     */
    open: (options?: {
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
    }) => Promise<AssembledTransaction<null>>;

    /**
     * Construct and simulate a close transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Close the trading post.
     */
    close: (options?: {
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
    }) => Promise<AssembledTransaction<null>>;
}
export class Client extends ContractClient {
    static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {
            owner,
            kale,
            vegetables,
            max_vegetables,
        }: {
            owner: string;
            kale: string;
            vegetables: Option<Array<string>>;
            max_vegetables: Option<u32>;
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
        return ContractClient.deploy({ owner, kale, vegetables, max_vegetables }, options);
    }
    constructor(public readonly options: ContractClientOptions) {
        super(
            new ContractSpec([
                'AAAAAAAAAqNUcmFkZSBiZXR3ZWVuIGBLQUxFYCBhbmQgc29tZSBvdGhlciwgcmVsYXRlZCB2ZWdldGFibGUuCgojIEFyZ3VtZW50cwoKKiBgY3VzdG9tZXJgIC0gVGhlIGFkZHJlc3Mgb2YgYSBjdXN0b21lciBtYWtpbmcgdGhlIHRyYWRlLgoqIGB2ZWdldGFibGVgIC0gVGhlIFNBQyBhZGRyZXNzIG9mIHRoZSB2ZWdldGFibGUgd2hpY2ggc2hvdWxkIGJlIHRyYWRlZAphZ2FpbnN0IGBLQUxFYC4KKiBgYW1vdW50YCAtIFRoZSBhbW91bnQgb2YgdG9rZW5zIChpbiBzdHJvb3BzKSB3aGljaCBzaG91bGQgYmUgZXhjaGFuZ2VkCmJldHdlZW4gdGhlIGN1c3RvbWVyIGFuZCB0aGUgdHJhZGluZyBwb3N0LgoqIGBidXlfa2FsZWAgLSBXaGV0aGVyIG9yIG5vdCB0aGUgY3VzdG9tZXIgc2hvdWxkIHJlY2VpdmUgYEtBTEVgIG9yIHRoZQpvdGhlciB2ZWdldGFibGUuCgojIFBhbmljcwoKKiBJZiB0aGUgdHJhZGluZyBwb3N0IGlzIG5vdCBvcGVuIGZvciBidXNpbmVzcy4KKiBJZiB0aGUgZGVzaXJlZCB2ZWdldGFibGUgdG9rZW4gaXMgbm90IGluIHRoZSBsaXN0IG9mIGF2YWlsYWJsZQp2ZWdldGFibGVzLgoqIElmIHRoZSB0cmFkaW5nIHBvc3QgY29udHJhY3QgZG9lcyBub3QgaGF2ZSBhIGhpZ2ggZW5vdWdoIGBLQUxFYApiYWxhbmNlIHRvIHNlbmQgdG8gdGhlIGN1c3RvbWVyIChpZiBidXlpbmcgYEtBTEVgKS4AAAAABXRyYWRlAAAAAAAABAAAAAAAAAAIY3VzdG9tZXIAAAATAAAAAAAAAAl2ZWdldGFibGUAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACGJ1eV9rYWxlAAAAAQAAAAA=',
                'AAAAAAAAAa9Jbml0aWFsaXplcyB0aGUgdHJhZGluZyBwb3N0IGFuZCBzZXRzIHRoaW5ncyB1cCB0byBiZWdpbiBmdXJ0aGVyCmNvbmZpZ3VyYXRpb24uCgojIEFyZ3VtZW50cwoKKiBgb3duZXJgIC0gVGhlIGFkZHJlc3Mgd2hpY2ggd2lsbCBiZSB0aGUgb3duZXIgYW5kIGFkbWluaXN0cmF0b3Igb2YgdGhlCnRyYWRpbmcgcG9zdC4KKiBga2FsZWAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgYEtBTEVgIGFzc2V0IGNvbnRyYWN0LgoqIGB2ZWdldGFibGVzYCAtIChvcHRpb25hbCkgQSB2ZWN0b3Igb2YgYXNzZXRzIHRoYXQgd2lsbCBiZSBhdmFpbGFibGUKZm9yIHRyYWRpbmcuCiogYG1heF92ZWdldGFibGVzYCAtIChvcHRpb25hbCkgVGhlIG1heGltdW0gbnVtYmVyIG9mIHZlZ2V0YWJsZXMgdGhhdApzaG91bGQgYmUgYXZhaWxhYmxlIHRvIHRyYWRlLiBEZWZhdWx0cyB0byA0LgAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAEa2FsZQAAABMAAAAAAAAACnZlZ2V0YWJsZXMAAAAAA+gAAAPqAAAAEwAAAAAAAAAObWF4X3ZlZ2V0YWJsZXMAAAAAA+gAAAAEAAAAAA==',
                'AAAAAAAAAX9VcGdyYWRlIHRoZSBjb250cmFjdCdzIFdhc20gYnl0ZWNvZGUuIFRoZSB0cmFkaW5nIHBvc3QgbXVzdCBiZSBjbG9zZWQKYmVmb3JlIGludm9raW5nIHRoaXMgZnVuY3Rpb24uCgojIEFyZ3VtZW50cwoKKiBgbmV3X3dhc21faGFzaGAgLSBIYXNoIGlkZW50aWZpZXIgZm9yIHRoZSBieXRlY29kZSB0aGF0IHNob3VsZCBiZQpoZW5jZWZvcnRoIHVzZWQgYnkgdGhpcyBjb250cmFjdC4gVGhlIGJ5dGVjb2RlIG11c3QgYWxyZWFkeSBiZQppbnN0YWxsZWQgYW5kIHByZXNlbnQgb24tY2hhaW4uCgojIFBhbmljcwoKKiBJZiB0aGUgdHJhZGluZyBwb3N0IGlzIHN0aWxsIG9wZW4uCiogSWYgdGhlIFdhc20gYnl0ZWNvZGUgaXMgbm90IGFscmVhZHkgaW5zdGFsbGVkIG9uLWNoYWluLgAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA',
                'AAAAAAAAAXNBZGQgbW9yZSB2ZWdldGFibGVzIHdoaWNoIHdpbGwgYmUgYXZhaWxhYmxlIHRvIHRyYWRlIGZvciB1c2luZyBgS0FMRWAKdG9rZW5zLgoKIyBBcmd1bWVudHMKCiogYHZlZ2V0YWJsZXNfdG9fYWRkYCAtIEEgdmVjdG9yIG9mIHZlZ2V0YWJsZSBhc3NldCBjb250cmFjdCBhZGRyZXNzZXMuCgojIFBhbmljcwoKKiBJZiBhIHZlZ2V0YWJsZSB0byBiZSBhZGRlZCBpcyBhbHJlYWR5IGF2YWlsYWJsZSBmb3IgdHJhZGUuCiogSWYgdGhlIHRyYWRpbmcgcG9zdCBpcyBvcGVuIGZvciB0cmFkaW5nLCBidXQgdGhlIFNBQyBhZG1pbiBvZiBhCnByb3ZpZGVkIHZlZ2V0YWJsZSBjb250cmFjdCBpcyBub3QgdGhlIHRyYWRpbmcgcG9zdCBjb250cmFjdCBhZGRyZXNzLgAAAAAOYWRkX3ZlZ2V0YWJsZXMAAAAAAAEAAAAAAAAAEXZlZ2V0YWJsZXNfdG9fYWRkAAAAAAAD6gAAABMAAAAA',
                'AAAAAAAAAP5SZW1vdmUgdmVnZXRhYmxlcyBzbyB0aGV5IHdpbGwgbm8gbG9uZ2VyIGJlIGF2YWlsYWJsZSB0byB0cmFkZSBmb3IgdXNpbmcKYEtBTEVgIHRva2Vucy4KCiMgQXJndW1lbnRzCgoqIGB2ZWdldGFibGVzX3RvX3JlbW92ZWAgLSBBIHZlY3RvciBvZiB2ZWdldGFibGUgYXNzZXQgY29udHJhY3QKYWRkcmVzc2VzLgoKIyBQYW5pY3MKCiogSWYgYSB2ZWdldGFibGUgdG8gYmUgcmVtb3ZlZCBpcyBub3QgYWxyZWFkeSBhdmFpbGFibGUgZm9yIHRyYWRlLgAAAAAAEXJlbW92ZV92ZWdldGFibGVzAAAAAAAAAQAAAAAAAAAUdmVnZXRhYmxlc190b19yZW1vdmUAAAPqAAAAEwAAAAA=',
                'AAAAAAAAAU9JbmNyZWFzZSB0aGUgbWF4aW11bSBudW1iZXIgb2YgdmVnZXRhYmxlcyBhdmFpbGFibGUgZm9yIHRyYWRlLgoKIyBBcmd1bWVudHMKCiogYG5ld19tYXhfdmVnZXRhYmxlc2AgLSBUaGUgbmV3IG1heGltdW0gbnVtYmVyIG9mIHZlZ2V0YWJsZXMgdGhhdCBjYW4KYmUgYXZhaWxhYmxlIHRvIHRyYWRlLgoKIyBQYW5pY3MKCiogSWYgdGhlIGV4aXN0aW5nIG1heGltdW0gaXMgZ3JlYXRlciB0aGFuIHRoZSBwcm92aWRlZCBuZXcgbWF4aW11bS4KKiBJZiB0aGUgZXhpc3RpbmcgbWF4aW11bSBpcyBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbmV3IG1heGltdW0uIFdoeSBldmVuCmJvdGhlciB0aGVuPwAAAAAQZ3Jvd19zaGVsZl9zcGFjZQAAAAEAAAAAAAAAEm5ld19tYXhfdmVnZXRhYmxlcwAAAAAABAAAAAA=',
                'AAAAAAAAAZpEZWNyZWFzZSB0aGUgbWF4aW11bSBudW1iZXIgb2YgdmVnZXRhYmxlcyBhdmFpbGFibGUgZm9yIHRyYWRlLgoKIyBBcmd1bWVudHMKCiogYG5ld19tYXhfdmVnZXRhYmxlc2AgLSBUaGUgbmV3IG1heGltdW0gbnVtYmVyIG9mIHZlZ2V0YWJsZXMgdGhhdCBjYW4KYmUgYXZhaWxhYmxlIHRvIHRyYWRlLgoKIyBQYW5pY3MKCiogSWYgdGhlIGV4aXN0aW5nIG1heGltdW0gaXMgbGVzcyB0aGFuIHRoZSBwcm92aWRlZCBuZXcgbWF4aW11bS4KKiBJZiB0aGUgZXhpc3RpbmcgbWF4aW11bSBpcyBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbmV3IG1heGltdW0uIFdoeSBldmVuCmJvdGhlciB0aGVuPwoqIElmIHRoZSBudW1iZXIgb2YgYXZhaWxhYmxlIHZlZ2V0YWJsZXMgd291bGQgYmUgYmlnZ2VyIHRoYW4gdGhlIG5ldwptYXhpbXVtLgAAAAAAEnNocmlua19zaGVsZl9zcGFjZQAAAAAAAQAAAAAAAAASbmV3X21heF92ZWdldGFibGVzAAAAAAAEAAAAAA==',
                'AAAAAAAAAUxPcGVuIHRoZSB0cmFkaW5nIHBvc3QgZm9yIGJ1c2luZXNzLiBUaGUgdHJhZGluZyBwb3N0IGlzIGNsb3NlZCBfYnkKZGVmYXVsdF8sIHNvIHRoaXMgZnVuY3Rpb24gd2lsbCBuZWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIHRyYWRpbmcgY2FuCmJlZ2luLgoKIyBQYW5pY3MKCiogSWYgdGhlcmUgYXJlIG5vIHZlZ2V0YWJsZSBhc3NldHMgYXZhaWxhYmxlIGZvciB0cmFkZS4KKiBJZiBvbmUgb3IgbW9yZSBvZiB0aGUgYXZhaWxhYmxlIHZlZ2V0YWJsZSBhc3NldHMgZG9lcyBub3QgaGF2ZSBhIFNBQwphZG1pbiBzZXQgdG8gdGhpcyB0cmFkaW5nIHBvc3QgY29udHJhY3QncyBhZGRyZXNzLgAAAARvcGVuAAAAAAAAAAA=',
                'AAAAAAAAABdDbG9zZSB0aGUgdHJhZGluZyBwb3N0LgAAAAAFY2xvc2UAAAAAAAAAAAAAAA==',
                'AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAACwAAAAAAAAAQSW52YWxpZFZlZ2V0YWJsZQAAAAEAAAAAAAAAEVRyYWRpbmdQb3N0Q2xvc2VkAAAAAAAAAgAAAAAAAAASVmVnZXRhYmxlc1JlcXVpcmVkAAAAAAADAAAAAAAAABNDb250cmFjdE5vdFNhY0FkbWluAAAAAAQAAAAAAAAAFFZlZ2V0YWJsZU5vdEZvclRyYWRlAAAABQAAAAAAAAAYVmVnZXRhYmxlQWxyZWFkeUZvclRyYWRlAAAABgAAAAAAAAAPVHJhZGluZ1Bvc3RPcGVuAAAAAAcAAAAAAAAAEVRvb01hbnlWZWdldGFibGVzAAAAAAAACAAAAAAAAAASU2hlbGZBbHJlYWR5QmlnZ2VyAAAAAAAJAAAAAAAAABNTaGVsZkFscmVhZHlTbWFsbGVyAAAAAAoAAAAAAAAADU5vdEVub3VnaEthbGUAAAAAAAAL',
                'AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAABQAAAAAAAAAAAAAABU93bmVyAAAAAAAAAAAAAAAAAAALS2FsZUFkZHJlc3MAAAAAAAAAAAAAAAAKVmVnZXRhYmxlcwAAAAAAAAAAAAAAAAANTWF4VmVnZXRhYmxlcwAAAAAAAAAAAAAAAAAABklzT3BlbgAA',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        trade: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        add_vegetables: this.txFromJSON<null>,
        remove_vegetables: this.txFromJSON<null>,
        grow_shelf_space: this.txFromJSON<null>,
        shrink_shelf_space: this.txFromJSON<null>,
        open: this.txFromJSON<null>,
        close: this.txFromJSON<null>,
    };
}
