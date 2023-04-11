import {notification} from 'antd'
export const SHS_CONTRACT_ADDRESS = "0x699019216ca093b693328631deb04d9a76c034946f679d89e6da543d1dba02b1"
export const SHS_STAKING_POOL = "0xc4ffe46122f38a20b3413966d89b1790584a662c96749068b2352c676afdfe38"
export const DECIMALS = 2
export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}