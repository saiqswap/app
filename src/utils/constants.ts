import {notification} from 'antd'
export const SHS_TOKEN_CONTRACT_ADDRESS = "0x1e0b1b701da0c8ddaf839bd83b99bc32706ee25d70b8d95c73fef844d742b331"
export const SHS_STAKING_CONTRACT_ADDRESS = "0x949c7a805e0d8e35cb678b245d0983967516e6f69cfa71ab1b5785c8d74aa9af"
export const SHS_COINFLIP_CONTRACT_ADDRESS = "0x8a5f95bdf4e37d14b938d6798dc46a1192c1bd1eb1422e328c9167612d3184a2"

export const DECIMALS = 9

export const STAKING_POOL = "0x4da67c8b244e1402ebd1cbb97014d7f79a752d398a2a7b31a022f7e0d1d045f1"
export const STAKING_NFT_TYPE = "0x2d4bd7e964d3dd4fc6a92bd03094fad90180bed911b6eb2f42d95bd4e29526a2::bluemove_nft::BlueMoveNFT"
export const STAKING_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"

export const COINFLIP_WAGER_AMOUNT = [50, 100, 200, 500, 1000, 2000]
export const COINFLIP_POOL = "0x00a5f667ca32c6986bb4aa16011cfa884214be8c6d459a0a719292a6920f3ade"
export const COINFLIP_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"
export const COINFLIP_TOKEN_DECIMALS = 9

export const DICE_WAGER_AMOUNT = [50, 100, 200, 500, 1000, 2000]
export const DICE_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"
export const DICE_TOKEN_DECIMALS = 9

export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}