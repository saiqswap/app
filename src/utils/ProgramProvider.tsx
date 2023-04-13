import {FC, useCallback, useMemo, useState, ReactNode, useEffect} from 'react'
import { ProgramContext } from './useProgram'
import { useWallet, useSuiProvider, useAccountBalance, } from '@suiet/wallet-kit'
import { TransactionBlock } from '@mysten/sui.js'
import { SHS_CONTRACT_ADDRESS, SHS_STAKING_POOL, DECIMALS } from './constants'

export interface ProgramProviderProps{
    children : ReactNode
}

export const ProgramProvider: FC<ProgramProviderProps> = ({children}) => {
    const wallet = useWallet()
    const provider = useSuiProvider(wallet.chain?.rpcUrl!)
    const [userData, setUserData] = useState<any>(null)
    const [poolData, setPoolData] = useState<any>(null)
    const [shsOwned, setShsOwned] = useState(0)

    useEffect(()=>{
        getStakingPoolData()
    },[])

    useEffect(()=>{
        getUserData()
        getShsOwned()
    },[wallet, poolData])

    useEffect(()=>{
        getShsOwned()
    },[userData])

    const getStakingPoolData = async() => {
        try{
            let res = (await provider.getObject({id: SHS_STAKING_POOL, options: {showContent: true}})).data
            if(res?.content?.dataType==="moveObject"){
                setPoolData(res?.content!.fields)
            }else
                setPoolData(null)
        }catch(err){
            setPoolData(null)
        }
    }

    const getShsOwned = async() => {
        try{
            let coins = (await provider.getCoins({
                owner: wallet.address!,
                coinType: SHS_CONTRACT_ADDRESS+'::shs::SHS'
            })).data
            let total = 0;
            for(let item of coins)
                total+=Number(item.balance)
            setShsOwned(total)
        }catch(err){
            setShsOwned(0)
        }
    }

    const getUserData = async() => {
        try{
            if(wallet.address===undefined){
                setUserData(null)
            }else{
                let res = (await provider.getDynamicFields({parentId: SHS_STAKING_POOL})).data
                let stakeDataObject = res.find((item)=>{return item.name.value==wallet.address})
                if(stakeDataObject===undefined){
                    setUserData(null)
                    return;
                }
                let stakeData = (await provider.getDynamicFieldObject({parentId: SHS_STAKING_POOL, name:stakeDataObject.name})).data
                if(stakeData?.content?.dataType==="moveObject"){
                    let current_time = (new Date()).getTime()
                    let uD = stakeData.content.fields
                    if(poolData!=null)
                        uD['reward_amount'] = Math.floor(Number(uD['reward_amount'])+(current_time - uD['last_changed_time']) * (poolData['apy']/10000) * uD['amount'] / (365 * 24 * 60 * 60 * 1000))
                    setUserData(uD)
                }
                else
                    setUserData(null)
            }
        }catch(err){
            setUserData(null)
        }
    }
    
    const stake_shs = useCallback(async(amount: number)=>{
        let coins = (await provider.getCoins({
            owner: wallet.address!,
            coinType: SHS_CONTRACT_ADDRESS+'::shs::SHS'
        })).data
        let stakeAmount = amount * (10 ** DECIMALS)
        if(coins.length===0) return Error("No token");
        let total=0;
        for(let item of coins) total+=item.balance
        if(total<stakeAmount) return Error("NotEnoughToken")
        
        const tx = new TransactionBlock()
        if(coins.length>1)
            tx.mergeCoins(tx.object(coins[0].coinObjectId), coins.slice(1,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        tx.moveCall({
            target: `${SHS_CONTRACT_ADDRESS}::token_staking::stake_token_mut`,
            typeArguments:[
                SHS_CONTRACT_ADDRESS+"::shs::SHS"
            ],
            arguments:[
                tx.object(SHS_STAKING_POOL),
                tx.object(coins[0].coinObjectId),
                tx.pure(stakeAmount),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet, provider])

    const unstake_shs = useCallback(async(amount: number)=>{
        let unstakeAmount = amount * (10 ** DECIMALS)
        const tx = new TransactionBlock()
        tx.moveCall({
            target: `${SHS_CONTRACT_ADDRESS}::token_staking::unstake_token`,
            typeArguments:[
                SHS_CONTRACT_ADDRESS+"::shs::SHS"
            ],
            arguments:[
                tx.object(SHS_STAKING_POOL),
                tx.pure(unstakeAmount),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    const claim_rewards = useCallback(async()=>{
        const tx= new TransactionBlock()
        tx.moveCall({
            target: `${SHS_CONTRACT_ADDRESS}::token_staking::redeem_reward`,
            typeArguments:[
                SHS_CONTRACT_ADDRESS+"::shs::SHS"
            ],
            arguments:[
                tx.object(SHS_STAKING_POOL),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    const stake_nft = useCallback(async()=>{

    }, [])

    const unstake_nft = useCallback(async()=>{

    }, [])

    return <ProgramContext.Provider value={{
        userData,
        poolData,
        shsOwned,
        getUserData,
        getStakingPoolData,
        stake_shs,
        unstake_shs,
        claim_rewards
    }}>{children}</ProgramContext.Provider>
}