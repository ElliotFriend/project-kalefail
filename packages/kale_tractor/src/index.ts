import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
    Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type { u32, i128 } from '@stellar/stellar-sdk/contract';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    public: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        contractId: 'CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3',
    },
} as const;

export const Errors = {
    /**
     * No pails provided in invocation
     */
    1: { message: 'NoPailsProvided' },

    /**
     * Harvesting all pails results in 0 reward
     */
    2: { message: 'NoHarvestablePails' },
};

export interface Client {
    /**
     * Construct and simulate a harvest transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Harvest multiple pails available for your KALE farmer.
     *
     * # Arguments
     * - `farmer` - address of the farmer to harvest on behalf of
     * - `pails` - vector of pails which should be harvested
     *
     * # Panics
     * - If the `pails` vector is empty
     * - If no pails result in a non-zero reward
     */
    harvest: (
        { farmer, pails }: { farmer: string; pails: Array<u32> },
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
    ) => Promise<AssembledTransaction<Array<i128>>>;
}
export class Client extends ContractClient {
    static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { farm }: { farm: string },
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
        return ContractClient.deploy({ farm }, options);
    }
    constructor(public readonly options: ContractClientOptions) {
        super(
            new ContractSpec([
                'AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAgAAAB9ObyBwYWlscyBwcm92aWRlZCBpbiBpbnZvY2F0aW9uAAAAAA9Ob1BhaWxzUHJvdmlkZWQAAAAAAQAAAChIYXJ2ZXN0aW5nIGFsbCBwYWlscyByZXN1bHRzIGluIDAgcmV3YXJkAAAAEk5vSGFydmVzdGFibGVQYWlscwAAAAAAAg==',
                'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABGZhcm0AAAATAAAAAA==',
                'AAAAAAAAAQlIYXJ2ZXN0IG11bHRpcGxlIHBhaWxzIGF2YWlsYWJsZSBmb3IgeW91ciBLQUxFIGZhcm1lci4KCiMgQXJndW1lbnRzCi0gYGZhcm1lcmAgLSBhZGRyZXNzIG9mIHRoZSBmYXJtZXIgdG8gaGFydmVzdCBvbiBiZWhhbGYgb2YKLSBgcGFpbHNgIC0gdmVjdG9yIG9mIHBhaWxzIHdoaWNoIHNob3VsZCBiZSBoYXJ2ZXN0ZWQKCiMgUGFuaWNzCi0gSWYgdGhlIGBwYWlsc2AgdmVjdG9yIGlzIGVtcHR5Ci0gSWYgbm8gcGFpbHMgcmVzdWx0IGluIGEgbm9uLXplcm8gcmV3YXJkAAAAAAAAB2hhcnZlc3QAAAAAAgAAAAAAAAAGZmFybWVyAAAAAAATAAAAAAAAAAVwYWlscwAAAAAAA+oAAAAEAAAAAQAAA+oAAAAL',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        harvest: this.txFromJSON<Array<i128>>,
    };
}
