import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec } from '@stellar/stellar-sdk/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    public: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        contractId: 'CBDM7MK5T2NNK6CSFD2IETMEYNHLSQ2MU7DAKD3J7MDFGPLFU4G2UWBI',
    },
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
                'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABGZhcm0AAAATAAAAAA==',
                'AAAAAAAAALVIYXJ2ZXN0IG11bHRpcGxlIHBhaWxzIGF2YWlsYWJsZSBmb3IgeW91ciBLQUxFIGZhcm1lci4KCiMgQXJndW1lbnRzCgotIGBmYXJtZXJgIC0gYWRkcmVzcyBvZiB0aGUgZmFybWVyIHRvIGhhcnZlc3Qgb24gYmVoYWxmIG9mCi0gYHBhaWxzYCAtIHZlY3RvciBvZiBwYWlscyB3aGljaCBzaG91bGQgYmUgaGFydmVzdGVkAAAAAAAAB2hhcnZlc3QAAAAAAgAAAAAAAAAGZmFybWVyAAAAAAATAAAAAAAAAAVwYWlscwAAAAAAA+oAAAAEAAAAAQAAAAs=',
            ]),
            options,
        );
        this.options = options;
    }
    fromJSON = {
        harvest: this.txFromJSON,
    };
}
