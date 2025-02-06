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
        readonly contractId: 'CBMGLZ2ZDEJFXIUEO4L3VQO5OKS4CLY3VCYXRZAGFNEIDFIDPWZV23VB';
    };
};
export declare const Errors: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
    7: {
        message: string;
    };
    8: {
        message: string;
    };
    9: {
        message: string;
    };
    10: {
        message: string;
    };
    11: {
        message: string;
    };
};
export type Storage =
    | {
          tag: 'Owner';
          values: void;
      }
    | {
          tag: 'KaleAddress';
          values: void;
      }
    | {
          tag: 'Vegetables';
          values: void;
      }
    | {
          tag: 'MaxVegetables';
          values: void;
      }
    | {
          tag: 'IsOpen';
          values: void;
      };
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
        }: {
            customer: string;
            vegetable: string;
            amount: i128;
            buy_kale: boolean;
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
        {
            vegetables_to_add,
        }: {
            vegetables_to_add: Array<string>;
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
        {
            vegetables_to_remove,
        }: {
            vegetables_to_remove: Array<string>;
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
        {
            new_max_vegetables,
        }: {
            new_max_vegetables: u32;
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
        {
            new_max_vegetables,
        }: {
            new_max_vegetables: u32;
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
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
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
    ): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        trade: (json: string) => AssembledTransaction<null>;
        upgrade: (json: string) => AssembledTransaction<null>;
        add_vegetables: (json: string) => AssembledTransaction<null>;
        remove_vegetables: (json: string) => AssembledTransaction<null>;
        grow_shelf_space: (json: string) => AssembledTransaction<null>;
        shrink_shelf_space: (json: string) => AssembledTransaction<null>;
        open: (json: string) => AssembledTransaction<null>;
        close: (json: string) => AssembledTransaction<null>;
    };
}
