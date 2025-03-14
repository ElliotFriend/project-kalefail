import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CDTILMO5W7U3IFPE3YBVUZNFGYBZ77CUKNG2LZDME6BNNPPGXWBLOECA",
    }
};
export const Errors = {
    1: { message: "UnsetMetadata" },
    2: { message: "TooManyTokens" },
    3: { message: "InsufficientPayment" },
    4: { message: "TooFewVegetables" },
    5: { message: "InvalidSpender" },
    6: { message: "CannotApproveOwner" },
    300: { message: "NonExistentToken" },
    301: { message: "IncorrectOwner" },
    302: { message: "InvalidOperator" },
    304: { message: "InsufficientApproval" },
    306: { message: "InvalidApprover" },
    307: { message: "InvalidApprovalExpiration" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, nft_name, nft_symbol, base_uri, vegetables, payment_each_vegetable }, 
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ admin, nft_name, nft_symbol, base_uri, vegetables, payment_each_vegetable }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAADAAAAAAAAAANVW5zZXRNZXRhZGF0YQAAAAAAAAEAAAAAAAAADVRvb01hbnlUb2tlbnMAAAAAAAACAAAAAAAAABNJbnN1ZmZpY2llbnRQYXltZW50AAAAAAMAAAAAAAAAEFRvb0Zld1ZlZ2V0YWJsZXMAAAAEAAAAAAAAAA5JbnZhbGlkU3BlbmRlcgAAAAAABQAAAAAAAAASQ2Fubm90QXBwcm92ZU93bmVyAAAAAAAGAAAAAAAAABBOb25FeGlzdGVudFRva2VuAAABLAAAAAAAAAAOSW5jb3JyZWN0T3duZXIAAAAAAS0AAAAAAAAAD0ludmFsaWRPcGVyYXRvcgAAAAEuAAAAAAAAABRJbnN1ZmZpY2llbnRBcHByb3ZhbAAAATAAAAAAAAAAD0ludmFsaWRBcHByb3ZlcgAAAAEyAAAAAAAAABlJbnZhbGlkQXBwcm92YWxFeHBpcmF0aW9uAAAAAAABMw==",
            "AAAAAQAAAAAAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
            "AAAAAQAAAAAAAAAAAAAADEFwcHJvdmVkRGF0YQAAAAIAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAAAAAAHc3BlbmRlcgAAAAAT",
            "AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAACgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAITWV0YWRhdGEAAAAAAAAAAAAAAApWZWdldGFibGVzAAAAAAAAAAAAAAAAAA1QYXltZW50UGVyTmZ0AAAAAAAAAAAAAAAAAAAGU3VwcGx5AAAAAAAAAAAAAAAAAAlNaW50SW5kZXgAAAAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAFT3duZXIAAAAAAAABAAAABAAAAAEAAAAAAAAACEFwcHJvdmVkAAAAAQAAAAQAAAABAAAAAAAAAAtBcHByb3ZlZEFsbAAAAAABAAAAEw==",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAYAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIbmZ0X25hbWUAAAAQAAAAAAAAAApuZnRfc3ltYm9sAAAAAAAQAAAAAAAAAAhiYXNlX3VyaQAAABAAAAAAAAAACnZlZ2V0YWJsZXMAAAAAA+oAAAATAAAAAAAAABZwYXltZW50X2VhY2hfdmVnZXRhYmxlAAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
            "AAAAAAAAAAAAAAAJc2V0X3ByaWNlAAAAAAAAAQAAAAAAAAAWcGF5bWVudF9lYWNoX3ZlZ2V0YWJsZQAAAAAACwAAAAA=",
            "AAAAAAAAAtVNaW50IGEgS0FMRSBTYWxhZCBORlQgdG8gdGhlIGJhbGFuY2Ugb2YgYG93bmVyYC4KCiMgQXJndW1lbnRzCgotIGBvd25lcmAgLSBUaGUgYWRkcmVzcyB3aGljaCB3aWxsIG93biB0aGUgbWludGVkIE5GVChzKQotIGBwYXltZW50X2VhY2hfdmVnZXRhYmxlYCAtIEhvdyBtdWNoIG9mIGVhY2ggdmVnZXRhYmxlIChpbiBzdHJvb3BzKSB0aGUKb3duZXIgaXMgcGF5aW5nIGluIGV4Y2hhbmdlIGZvciB0aGUgTkZULgotIGBudW1iZXJfb2ZfdG9rZW5zYCAtIFRoZSBudW1iZXIgb2YgTkZUcyB3aGljaCBzaG91bGQgYmUgbWludGVkIHRvIHRoZQpvd25lcidzIGFkZHJlc3MuCgojIFBhbmljcwoKLSBJZiB0aGUgcGF5bWVudCBhbW91bnQgZG9lcyBub3QgbWVldCB0aGUgcmVxdWlyZWQgbWluaW11bS4KLSBJZiB0aGUgdG90YWwgbWF4aW11bSBudW1iZXIgb2YgTkZUcyBoYXMgYWxyZWFkeSBiZWVuIG1pbnRlZC4KLSBJZiB0aGUgcmVxdWVzdGVkIG51bWJlciBvZiBORlRzIHdvdWxkIGV4Y2VlZCB0aGUgdG90YWwgbWF4aW11bSBORlRzLgotIElmIHRoZSByZXF1ZXN0ZWQgbnVtYmVyIG9mIE5GVHMgd291bGQgZXhjZWVkIHRoZSBtYXhpbXVtIE5GVHMgYWxsb3dlZApwZXIgYWRkcmVzcy4KCiMgRXZlbnRzCgotIEVtaXRzIGFuIGV2ZW50IHdpdGg6Ci0gdG9waWNzIC0gYFsibWludCIsIGFkbWluOiBBZGRyZXNzLCBvd25lcjogQWRkcmVzc11gCi0gZGF0YSAtIGB0b2tlbl9pZDogdTMyYAAAAAAAAAptaW50X3NhbGFkAAAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAEG51bWJlcl9vZl90b2tlbnMAAAPoAAAABAAAAAA=",
            "AAAAAAAAAAAAAAAIYmFzZV91cmkAAAAAAAAAAQAAABA=",
            "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAA==",
            "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACHRva2VuX2lkAAAABAAAAAA=",
            "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAE",
            "AAAAAAAAAAAAAAAIb3duZXJfb2YAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAAEw==",
            "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAABFleHBpcmF0aW9uX2xlZGdlcgAAAAAAAAQAAAAA",
            "AAAAAAAAAAAAAAAMZ2V0X2FwcHJvdmVkAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAA+gAAAAT",
            "AAAAAAAAAAAAAAALYXBwcm92ZV9hbGwAAAAAAwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAA=",
            "AAAAAAAAAAAAAAAPaXNfYXBwcm92ZWRfYWxsAAAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAQAAAAE=",
            "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAA",
            "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAA==",
            "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
            "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
            "AAAAAAAAAAAAAAAJdG9rZW5fdXJpAAAAAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAABA="]), options);
        this.options = options;
    }
    fromJSON = {
        upgrade: (this.txFromJSON),
        set_price: (this.txFromJSON),
        mint_salad: (this.txFromJSON),
        base_uri: (this.txFromJSON),
        decimals: (this.txFromJSON),
        burn: (this.txFromJSON),
        burn_from: (this.txFromJSON),
        balance: (this.txFromJSON),
        owner_of: (this.txFromJSON),
        approve: (this.txFromJSON),
        get_approved: (this.txFromJSON),
        approve_all: (this.txFromJSON),
        is_approved_all: (this.txFromJSON),
        transfer: (this.txFromJSON),
        transfer_from: (this.txFromJSON),
        name: (this.txFromJSON),
        symbol: (this.txFromJSON),
        token_uri: (this.txFromJSON)
    };
}
