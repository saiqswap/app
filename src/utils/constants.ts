import {notification} from 'antd'
export const SHS_TOKEN_CONTRACT_ADDRESS = "0x1e0b1b701da0c8ddaf839bd83b99bc32706ee25d70b8d95c73fef844d742b331"
export const SHS_STAKING_CONTRACT_ADDRESS = "0x5b60d21828e38adaaa7674e2deba8e937eae3e5da69b8e7b1a72b46d0ce8ea55"

export const STAKING_POOL = "0xeff4df0e9f04dff8ab2cb36e07fb794600bd19843ff6862acd06899ef5d59e4c"
export const STAKING_NFT_TYPE = "0x2d4bd7e964d3dd4fc6a92bd03094fad90180bed911b6eb2f42d95bd4e29526a2::bluemove_nft::BlueMoveNFT"
export const STAKING_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"

export const DECIMALS = 9

export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}