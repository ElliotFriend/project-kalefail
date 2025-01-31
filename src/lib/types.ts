export type VegetableAsset = {
    assetCode: string;
    issuerAddress: string;
    contractAddress: string;
};

export type InstanceStorageValue = string | VegetableAsset[] | boolean;
