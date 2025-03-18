import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i128,
} from '@stellar/stellar-sdk/contract';

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  public: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CBDM7MK5T2NNK6CSFD2IETMEYNHLSQ2MU7DAKD3J7MDFGPLFU4G2UWBI",
  }
} as const

export interface Client {
  /**
   * Construct and simulate a harvest transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Harvest multiple pails available for your KALE farmer.
   *
   * # Arguments
   *
   * - `farmer` - address of the farmer to harvest on behalf of
   * - `pails` - vector of pails which should be harvested
   */
  harvest: ({farmer, pails}: {farmer: string, pails: Array<u32>}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {farm}: {farm: string},
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({farm}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABGZhcm0AAAATAAAAAA==",
        "AAAAAAAAALVIYXJ2ZXN0IG11bHRpcGxlIHBhaWxzIGF2YWlsYWJsZSBmb3IgeW91ciBLQUxFIGZhcm1lci4KCiMgQXJndW1lbnRzCgotIGBmYXJtZXJgIC0gYWRkcmVzcyBvZiB0aGUgZmFybWVyIHRvIGhhcnZlc3Qgb24gYmVoYWxmIG9mCi0gYHBhaWxzYCAtIHZlY3RvciBvZiBwYWlscyB3aGljaCBzaG91bGQgYmUgaGFydmVzdGVkAAAAAAAAB2hhcnZlc3QAAAAAAgAAAAAAAAAGZmFybWVyAAAAAAATAAAAAAAAAAVwYWlscwAAAAAAA+oAAAAEAAAAAQAAAAs=" ]),
      options
    )
  }
  public readonly fromJSON = {
    harvest: this.txFromJSON<i128>
  }
}
