import {notification} from 'antd'
export const SHS_CONTRACT_ADDRESS = "0xe81372f8346b47436d21bfabcd3befc0c488f673377dd0e6b12d961a01559595"
export const SHS_STAKING_POOL = "0xb6940a7adc09b7f43957297e2f6f265280b2eac609afaaf01f1e6f0ae49811e8"
export const DECIMALS = 2
export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}