import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec } from '@stellar/stellar-sdk/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    public: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        contractId: 'CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3',
    },
};
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
export class Client extends ContractClient {
    options;
    static async deploy(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { farm },
        /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
        options,
    ) {
        return ContractClient.deploy({ farm }, options);
    }
    constructor(options) {
        super(
            new ContractSpec([
                'AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAgAAAB9ObyBwYWlscyBwcm92aWRlZCBpbiBpbnZvY2F0aW9uAAAAAA9Ob1BhaWxzUHJvdmlkZWQAAAAAAQAAAChIYXJ2ZXN0aW5nIGFsbCBwYWlscyByZXN1bHRzIGluIDAgcmV3YXJkAAAAEk5vSGFydmVzdGFibGVQYWlscwAAAAAAAg==',
                'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABGZhcm0AAAATAAAAAA==',
                'AAAAAAAAAQlIYXJ2ZXN0IG11bHRpcGxlIHBhaWxzIGF2YWlsYWJsZSBmb3IgeW91ciBLQUxFIGZhcm1lci4KCiMgQXJndW1lbnRzCi0gYGZhcm1lcmAgLSBhZGRyZXNzIG9mIHRoZSBmYXJtZXIgdG8gaGFydmVzdCBvbiBiZWhhbGYgb2YKLSBgcGFpbHNgIC0gdmVjdG9yIG9mIHBhaWxzIHdoaWNoIHNob3VsZCBiZSBoYXJ2ZXN0ZWQKCiMgUGFuaWNzCi0gSWYgdGhlIGBwYWlsc2AgdmVjdG9yIGlzIGVtcHR5Ci0gSWYgbm8gcGFpbHMgcmVzdWx0IGluIGEgbm9uLXplcm8gcmV3YXJkAAAAAAAAB2hhcnZlc3QAAAAAAgAAAAAAAAAGZmFybWVyAAAAAAATAAAAAAAAAAVwYWlscwAAAAAAA+oAAAAEAAAAAQAAA+oAAAAL',
            ]),
            options,
        );
        this.options = options;
    }
    fromJSON = {
        harvest: this.txFromJSON,
    };
}
