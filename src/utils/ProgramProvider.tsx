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

    useEffect(()=>{
        getStakingPoolData()
    },[])

    useEffect(()=>{
        getUserData()
    },[wallet])

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
                    setUserData(stakeData?.content!.fields)
                    console.log(stakeData.content.fields["amount"])
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
        console.log(coins)
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
                tx.pure(amount)
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet, provider])

    const unstake_shs = useCallback(async(amount: number)=>{
        const tx = new TransactionBlock()
        tx.moveCall({
            target: `${SHS_CONTRACT_ADDRESS}::token_staking::unstake_token`,
            typeArguments:[
                SHS_CONTRACT_ADDRESS+"::shs::SHS"
            ],
            arguments:[
                tx.object(SHS_STAKING_POOL),
                tx.pure(amount)
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
                tx.object(SHS_STAKING_POOL)
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
        getUserData,
        getStakingPoolData,
        stake_shs,
        unstake_shs,
        claim_rewards
    }}>{children}</ProgramContext.Provider>
}