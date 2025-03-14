import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec } from '@stellar/stellar-sdk/contract';
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
    public: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        contractId: 'CBMGLZ2ZDEJFXIUEO4L3VQO5OKS4CLY3VCYXRZAGFNEIDFIDPWZV23VB',
    },
};
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
export class Client extends ContractClient {
    options;
    static async deploy(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { owner, kale, vegetables, max_vegetables },
        /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
        options,
    ) {
        return ContractClient.deploy({ owner, kale, vegetables, max_vegetables }, options);
    }
    constructor(options) {
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
        this.options = options;
    }
    fromJSON = {
        trade: this.txFromJSON,
        upgrade: this.txFromJSON,
        add_vegetables: this.txFromJSON,
        remove_vegetables: this.txFromJSON,
        grow_shelf_space: this.txFromJSON,
        shrink_shelf_space: this.txFromJSON,
        open: this.txFromJSON,
        close: this.txFromJSON,
    };
}
