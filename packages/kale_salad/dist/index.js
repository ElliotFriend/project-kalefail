import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec } from '@stellar/stellar-sdk/contract';
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
};
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
export class Client extends ContractClient {
    options;
    static async deploy(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { admin, nft_name, nft_symbol, base_uri, vegetables, payment_each_vegetable },
        /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
        options,
    ) {
        return ContractClient.deploy(
            { admin, nft_name, nft_symbol, base_uri, vegetables, payment_each_vegetable },
            options,
        );
    }
    constructor(options) {
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
        this.options = options;
    }
    fromJSON = {
        upgrade: this.txFromJSON,
        set_price: this.txFromJSON,
        mint_salad: this.txFromJSON,
        set_base_uri: this.txFromJSON,
        base_uri: this.txFromJSON,
        decimals: this.txFromJSON,
        burn: this.txFromJSON,
        burn_from: this.txFromJSON,
        balance: this.txFromJSON,
        owner_of: this.txFromJSON,
        approve: this.txFromJSON,
        get_approved: this.txFromJSON,
        approve_all: this.txFromJSON,
        is_approved_all: this.txFromJSON,
        transfer: this.txFromJSON,
        transfer_from: this.txFromJSON,
        name: this.txFromJSON,
        symbol: this.txFromJSON,
        token_uri: this.txFromJSON,
    };
}
