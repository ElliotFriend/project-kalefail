import { kaleSacAddress, rpc } from '$lib/passkeyClient';
import { xdr, Address, Contract, scValToNative, nativeToScVal, Asset } from '@stellar/stellar-sdk';
import type { PageServerLoad } from './$types';
import trading_post from '$lib/contracts/trading_post';
import type { Storage } from 'trading_post';
import type { VegetableAsset } from '$lib/types';
import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';

export const load: PageServerLoad = async () => {
    // 1. get the vegetables available to trade
    // 2. get the current KALE held in the trading post
    // 3. get the wallet's current KALE balance (nvm, do this client-side)
    // 4. find out if the trading post is open or closed
    // 5. find the number of tokens minted of each vegetable

    const tradingPostContract = new Contract(trading_post.options.contractId)



    let returnObj: Record<string, any> = {
        instance: {} as Storage,
        balances: {},
        vegetables: [] as VegetableAsset[],
    }

    // const walletThing = 'CAU6Q25V6KD4J2T2PXRA3CDQKPRMSWOZNO3LPKFDCJPW3IHI67OGGERS'
    const tpKaleBalanceKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(kaleSacAddress).toScAddress(),
            durability: xdr.ContractDataDurability.persistent(),
            key: xdr.ScVal.scvVec([
                nativeToScVal("Balance", { type: "symbol" }),
                tradingPostContract.address().toScVal(),
            ])
        })
    )
    // console.log(tpKaleBalanceKey.toXDR('base64'))

    // const tradingPostKaleBalanceLedgerKey = xdr.LedgerKey.contractData()

    const { entries } = await rpc.getLedgerEntries(
        tradingPostContract.getFootprint(),
        tpKaleBalanceKey,
    )

    entries.forEach((entry) => {
        // console.log(entry.val.contractData().key().switch())
        switch (entry.val.contractData().key().switch().value) {
            case xdr.ScValType.scvLedgerKeyContractInstance().value:
                // trading post contract instance storage
                let instanceStorage = entry.val.contractData().val().instance().storage()
                instanceStorage!.forEach((iEntry) => {
                    let key = scValToNative(iEntry.key())[0].toString()
                    let value = scValToNative(iEntry.val())
                    returnObj.instance[key] = value

                    // if (key == 'Vegetables') {
                    //     let vegetableFootprints = value.map((v: string) => {
                    //         return new Contract(v).getFootprint()
                    //     })
                    //     let vEntries = await rpc.getLedgerEntries(...vegetableFootprints)
                    //     vEntries.entries.forEach((vE) => {
                    //         let key = scValToNative(vE.val.contractData().val())
                    //         key.storage().forEach((huh) => {
                    //             console.log('huh', nativeToScVal(huh.val().value()))
                    //         })
                    //     })
                    // } else {
                    // }
                })
                break
            default:
                // the KALE balance held by the trading post
                let value = scValToNative(entry.val.contractData().val())
                // console.log('value', value)
                returnObj.balances['KALE'] = value.amount

        }
        // if (entry.val.contractData().val().instance) {
        // // if (false) {
        // } else {
        //     console.log('hi there hello')
        // }
    })

    let vegetableFootprints = returnObj.instance.Vegetables.map((v: string) => {
        return new Contract(v).getFootprint()
    })
    const { entries: vegetablesMeta } = await rpc.getLedgerEntries(
        ...vegetableFootprints
    )
    vegetablesMeta.forEach((vege) => {
        // let vegeAsset: VegetableAsset = {};
        if (vege.val.contractData().key().switch().value === xdr.ScValType.scvLedgerKeyContractInstance().value) {
            let instanceStorage = vege.val.contractData().val().instance().storage()
            instanceStorage!.forEach((iEntry) => {
                if (iEntry.key().switch().value === xdr.ScValType.scvSymbol().value) {
                    // the "METADATA" instance storage entries for a SAC
                    // console.log(nativeToScVal(iEntry.val().value()[0].val()))
                    let thing = iEntry.val().map()?.find((t) => t.key().sym().toString() === 'name')
                    let [assetCode, assetIssuer] = scValToNative(thing!.val()).split(':')
                    let vegeAsset: VegetableAsset = {
                        assetCode,
                        issuerAddress: assetIssuer,
                        contractAddress: new Asset(assetCode, assetIssuer).contractId(PUBLIC_STELLAR_NETWORK_PASSPHRASE),
                    }
                    // vegeAsset.assetCodescValToNative(thing!.val()))
                    returnObj.vegetables.push(vegeAsset)
                }
            })
            // let key = vege.val.contractData().val().instance().storage()[]
            // console.log('key', key)
            // key.storage().forEach((huh) => {
            //     console.log('huh', huh.toXDR('base64'))
            //     // console.log('huh', nativeToScVal(huh.val().value()))
            // })
        }

    })
    // console.log('scv instance', instanceStorage)
    // instanceStorage?.forEach((entry) => {
    //     // switch (entry.val().switch()) {
    //     //     case xdr.
    //     // }
    //     console.log('entry', entry.key())
    // })
    // console.log(scValToNative(instanceStorage![0].key()))
    // instanceStorage!.forEach((entry) => {
    //     // console.log('inst each', scValToNative(entry.val()))

    // })
    console.log(returnObj)

    // console.log('instance', instance)
    return returnObj;
};
