import {FC, useCallback, ReactNode,} from 'react'
import { ProgramContext } from './useProgram'
import { useWallet, useSuiProvider } from '@suiet/wallet-kit'
import { TransactionBlock } from '@mysten/sui.js'
import { SHS_STAKING_CONTRACT_ADDRESS, DECIMALS, STAKING_POOL, STAKING_NFT_TYPE, STAKING_TOKEN_TYPE, SHS_COINFLIP_CONTRACT_ADDRESS, COINFLIP_TOKEN_TYPE, COINFLIP_POOL, COINFLIP_TOKEN_DECIMALS} from './constants'
export interface ProgramProviderProps{
    children : ReactNode
}

export const ProgramProvider: FC<ProgramProviderProps> = ({children}) => {
    const wallet = useWallet()
    const provider = useSuiProvider(wallet.chain?.rpcUrl!)

    const getShsOwned = async(coinType : string) => {
        try{
            let coins = (await provider.getCoins({
                owner: wallet.address!,
                coinType: coinType
            })).data
            let total = 0;
            for(let item of coins)
                total+=Number(item.balance)
            return total
        }catch(err){
            return 0
        }
    }
    
    const getStakingPoolData = async() => {
        try{
            let res = (await provider.getObject({id: STAKING_POOL, options: {showContent: true}})).data
            if(res?.content?.dataType==="moveObject"){
                return res?.content!.fields
            }else
                return null
        }catch(err){
            return null
        }
    }

    const getUserStakeData = async() => {
        try{
            if(wallet.address===undefined){
                return null
            }else{
                // let res = (await provider.getDynamicFields({parentId: STAKING_POOL})).data
                // let stakeDataObject = res.find((item)=>{return item.name.value===wallet.address})
                // if(stakeDataObject===undefined){
                //     return null
                // }
                let stakeData = (await provider.getDynamicFieldObject({parentId: STAKING_POOL, name:{type:"address", value:wallet.address}})).data
                if(stakeData?.content?.dataType==="moveObject"){
                    let current_time = (new Date()).getTime()
                    let uD = stakeData.content.fields
                    let poolData = await getStakingPoolData()
                    if(poolData!=null)
                        uD['reward_amount'] = Math.floor(Number(uD['reward_amount'])+(current_time - uD['last_changed_time']) * ((Number(uD['stake_nft_count'])===0 ? poolData['apy'] : (Number(poolData['apy_nft'])+Number(poolData['apy_one_nft'])*(Number(uD['stake_nft_count'])-1)))/10000) * uD['amount'] / (365 * 24 * 60 * 60 * 1000))
                    return uD
                }
                else
                    return null
            }
        }catch(err){
            return null
        }
    }

    const getOwnedNfts = async() => {
        try{
            if(wallet.address === undefined){
                return []
            }else{
                let ownedNft = (await provider.getOwnedObjects({owner:wallet.address, filter:{StructType:STAKING_NFT_TYPE}, options:{showType: true, showContent: true}})).data
                return ownedNft.map((item)=>{
                    return {objectId: item.data?.objectId, data: item.data?.content, selected: false}
                })
            }
        }catch(err){
            return []
        }
    }

    const getStakedNfts = async() => {
        try{
            if(wallet.address === undefined){
                return []
            }else{
                let nfts : any[] = []
                let stakeData = (await provider.getDynamicFieldObject({parentId: STAKING_POOL, name:{type:"address", value:wallet.address}})).data
                let res = (await provider.getDynamicFields({parentId: stakeData?.objectId!}))
                let listingNfts = res.data.filter((item)=>{return item.objectType===STAKING_NFT_TYPE})
                for(let item of listingNfts){
                    let nftDetail = (await provider.getObject({id: item.objectId, options: {showContent:true}}))
                    nfts.push({id: item.objectId, data: nftDetail.data?.content, selected: false})
                }
                return nfts
            }
        }catch(err){
            return []
        }
    }
    
    const stake_shs = useCallback(async(amount: number)=>{
        let coins = (await provider.getCoins({
            owner: wallet.address!,
            coinType: STAKING_TOKEN_TYPE
        })).data
        let stakeAmount = amount * (10 ** DECIMALS)
        if(coins.length===0) throw new Error("No token");
        let total=0;
        for(let item of coins) total+=item.balance
        if(total<stakeAmount) throw new Error("Not Enough Token")
        
        const tx = new TransactionBlock()
        if(coins.length>1)
            tx.mergeCoins(tx.object(coins[0].coinObjectId), coins.slice(1,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        tx.moveCall({
            target: `${SHS_STAKING_CONTRACT_ADDRESS}::token_staking::stake_token_mut`,
            typeArguments:[
                STAKING_TOKEN_TYPE,
                STAKING_NFT_TYPE
            ],
            arguments:[
                tx.object(STAKING_POOL),
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
            target: `${SHS_STAKING_CONTRACT_ADDRESS}::token_staking::unstake_token`,
            typeArguments:[
                STAKING_TOKEN_TYPE,
                STAKING_NFT_TYPE
            ],
            arguments:[
                tx.object(STAKING_POOL),
                tx.pure(unstakeAmount),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    const claim_rewards = useCallback(async()=>{
        const tx= new TransactionBlock()
        tx.moveCall({
            target: `${SHS_STAKING_CONTRACT_ADDRESS}::token_staking::redeem_reward`,
            typeArguments:[
                STAKING_TOKEN_TYPE,
                STAKING_NFT_TYPE
            ],
            arguments:[
                tx.object(STAKING_POOL),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    const stake_nfts = useCallback(async(items: string[])=>{
        const tx = new TransactionBlock()
        for(let item of items)
            tx.moveCall({
                target: `${SHS_STAKING_CONTRACT_ADDRESS}::token_staking::stake_nft`,
                typeArguments:[
                    STAKING_TOKEN_TYPE,
                    STAKING_NFT_TYPE
                ],
                arguments:[
                    tx.object(STAKING_POOL),
                    tx.object(item),
                    tx.object("0x06")
                ]
            })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    }, [wallet])

    const unstake_nfts = useCallback(async(items: string[])=>{
        const tx = new TransactionBlock()
        for(let item of items)
            tx.moveCall({
                target: `${SHS_STAKING_CONTRACT_ADDRESS}::token_staking::unstake_nft`,
                typeArguments:[
                    STAKING_TOKEN_TYPE,
                    STAKING_NFT_TYPE
                ],
                arguments:[
                    tx.object(STAKING_POOL),
                    tx.object(item),
                    tx.object("0x06")
                ]
            })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    }, [wallet])

    const getUserCoinflipData = async() => {
        try{
            if(wallet.address===undefined) return null
            // let res = (await provider.getDynamicFields({parentId: COINFLIP_POOL})).data
            // let coinflipDataObject = res.find((item)=>{return item.name.value===wallet.address})
            // if(coinflipDataObject===undefined) return null
            let coinflipData = (await provider.getDynamicFieldObject({parentId: COINFLIP_POOL, name: {type:"address", value: wallet.address}})).data
            if(coinflipData?.content?.dataType==="moveObject")
                return coinflipData.content.fields
            else
                return null
        }catch(err){
            return null
        }
    }

    const coinflip_flip = useCallback(async(selectedSide: number, selectedAmount: number)=>{
        let coins = (await provider.getCoins({
            owner: wallet.address!,
            coinType: COINFLIP_TOKEN_TYPE
        })).data
        let amount = selectedAmount * (10 ** COINFLIP_TOKEN_DECIMALS)
        if(coins.length===0) throw new Error("No token");
        let total=0;
        for(let item of coins) total+=item.balance
        if(total<amount) throw new Error("Not Enough Token")

        const tx = new TransactionBlock()
        if(coins.length>1)
            tx.mergeCoins(tx.object(coins[0].coinObjectId), coins.slice(1,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        tx.moveCall({
            target: `${SHS_COINFLIP_CONTRACT_ADDRESS}::coinflip::play_mut`,
            typeArguments:[
                COINFLIP_TOKEN_TYPE
            ],
            arguments:[
                tx.object(COINFLIP_POOL),
                tx.object(coins[0].coinObjectId),
                tx.pure(amount),
                tx.pure(selectedSide+1),
                tx.object("0x06")
            ]
        })
        return await wallet.signAndExecuteTransactionBlock({transactionBlock: tx, options:{showEffects:true, showEvents: true, showObjectChanges: true, showBalanceChanges: true, showInput: true}})
    }, [wallet, provider])

    const coinflip_claim = useCallback(async()=>{
        const tx = new TransactionBlock()
        tx.moveCall({
            target: `${SHS_COINFLIP_CONTRACT_ADDRESS}::coinflip::claim`,
            typeArguments:[
                COINFLIP_TOKEN_TYPE
            ],
            arguments:[
                tx.object(COINFLIP_POOL)
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx, options:{showEffects:true, showEvents: true, showObjectChanges: true, showBalanceChanges: true, showInput: true}})
    },[wallet])

    return <ProgramContext.Provider value={{
        getShsOwned,

        // Staking Platform
        getUserStakeData,
        getOwnedNfts,
        getStakedNfts,
        getStakingPoolData,
        stake_shs,
        unstake_shs,
        claim_rewards,
        stake_nfts,
        unstake_nfts,

        //Coinflip
        getUserCoinflipData,
        coinflip_claim,
        coinflip_flip,
    }}>{children}</ProgramContext.Provider>
}