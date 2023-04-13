import {notification} from 'antd'
export const SHS_CONTRACT_ADDRESS = "0xdf47af689b7d71521bfe4d5e7817e30adbf0c0833ec15780562b2090b731d3a5"
export const SHS_STAKING_POOL = "0xb7554edb63acdeea127c1ddbe633406f2e3fae4c0908113b16a482ed4372c773"
export const DECIMALS = 2
export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}