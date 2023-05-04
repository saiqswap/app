import {FC, useCallback, ReactNode,} from 'react'
import { ProgramContext } from './useProgram'
import { useWallet, useSuiProvider } from '@suiet/wallet-kit'
import { TransactionBlock } from '@mysten/sui.js'
import { InfoStaking, InfoCoinflip, InfoDice} from './constants'
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
            let res = (await provider.getObject({id: InfoStaking.pool, options: {showContent: true}})).data
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
                let stakeData = (await provider.getDynamicFieldObject({parentId: InfoStaking.pool, name:{type:"address", value:wallet.address}})).data
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
                let ownedNft = (await provider.getOwnedObjects({owner:wallet.address, filter:{StructType:InfoStaking.nft_type}, options:{showType: true, showContent: true}})).data
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
                let stakeData = (await provider.getDynamicFieldObject({parentId: InfoStaking.pool, name:{type:"address", value:wallet.address}})).data
                let res = (await provider.getDynamicFields({parentId: stakeData?.objectId!}))
                let listingNfts = res.data.filter((item)=>{return item.objectType===InfoStaking.nft_type})
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
            coinType: InfoStaking.token_type
        })).data
        let stakeAmount = amount * (10 ** InfoStaking.token_decimals)
        if(coins.length===0) throw new Error("No token");
        let total=0;
        for(let item of coins) total+=Number(item.balance)
        if(total<stakeAmount) throw new Error("Not Enough Token")
        
        const tx = new TransactionBlock()
        if(coins.length>1)
            tx.mergeCoins(tx.object(coins[0].coinObjectId), coins.slice(1,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        tx.moveCall({
            target: `${InfoStaking.constract}::token_staking::stake_token_mut`,
            typeArguments:[
                InfoStaking.token_type,
                InfoStaking.nft_type
            ],
            arguments:[
                tx.object(InfoStaking.pool),
                tx.object(coins[0].coinObjectId),
                tx.pure(stakeAmount),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet, provider])

    const unstake_shs = useCallback(async(amount: number)=>{
        let unstakeAmount = amount * (10 ** InfoStaking.token_decimals)
        const tx = new TransactionBlock()
        tx.moveCall({
            target: `${InfoStaking.constract}::token_staking::unstake_token`,
            typeArguments:[
                InfoStaking.token_type,
                InfoStaking.nft_type
            ],
            arguments:[
                tx.object(InfoStaking.pool),
                tx.pure(unstakeAmount),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    const claim_rewards = useCallback(async()=>{
        const tx= new TransactionBlock()
        tx.moveCall({
            target: `${InfoStaking.constract}::token_staking::redeem_reward`,
            typeArguments:[
                InfoStaking.token_type,
                InfoStaking.nft_type
            ],
            arguments:[
                tx.object(InfoStaking.pool),
                tx.object("0x6")
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    const stake_nfts = useCallback(async(items: string[])=>{
        const tx = new TransactionBlock()
        for(let item of items)
            tx.moveCall({
                target: `${InfoStaking.constract}::token_staking::stake_nft`,
                typeArguments:[
                    InfoStaking.token_type,
                    InfoStaking.nft_type
                ],
                arguments:[
                    tx.object(InfoStaking.pool),
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
                target: `${InfoStaking.constract}::token_staking::unstake_nft`,
                typeArguments:[
                    InfoStaking.token_type,
                    InfoStaking.nft_type
                ],
                arguments:[
                    tx.object(InfoStaking.pool),
                    tx.object(item),
                    tx.object("0x06")
                ]
            })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    }, [wallet])

    const getUserCoinflipData = async() => {
        try{
            if(wallet.address===undefined) return null
            let coinflipData = (await provider.getDynamicFieldObject({parentId: InfoCoinflip.pool, name: {type:"address", value: wallet.address}})).data
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
            coinType: InfoCoinflip.token_type
        })).data
        let amount = selectedAmount * (10 ** InfoCoinflip.token_decimals)
        if(coins.length===0) throw new Error("No token");
        let total=0;
        for(let item of coins) total+=Number(item.balance)
        if(total<amount) throw new Error("Not Enough Token")

        const tx = new TransactionBlock()
        if(coins.length>1)
            tx.mergeCoins(tx.object(coins[0].coinObjectId), coins.slice(1,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        tx.moveCall({
            target: `${InfoCoinflip.contract}::coinflip::play_mut`,
            typeArguments:[
                InfoCoinflip.token_type
            ],
            arguments:[
                tx.object(InfoCoinflip.pool),
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
            target: `${InfoCoinflip.contract}::coinflip::claim`,
            typeArguments:[
                InfoCoinflip.token_type
            ],
            arguments:[
                tx.object(InfoCoinflip.pool)
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx, options:{showEffects:true, showEvents: true, showObjectChanges: true, showBalanceChanges: true, showInput: true}})
    },[wallet])

    const getUserDiceData = async() => {
        try{
            if(wallet.address===undefined) return null
            let diceData = (await provider.getDynamicFieldObject({parentId: InfoDice.pool, name: {type:"address", value: wallet.address}})).data
            console.log(diceData)
            if(diceData?.content?.dataType==="moveObject")
                return diceData.content.fields
            else
                return null
        }catch(err){
            return null
        }
    }

    const dice_roll = useCallback(async(selectedCase: number, selectedAmount: number)=>{
        let coins = (await provider.getCoins({
            owner: wallet.address!,
            coinType: InfoDice.token_type
        })).data
        let amount = selectedAmount * (10 ** InfoDice.token_decimals)
        if(coins.length===0) throw new Error("No token");
        let total=0;
        for(let item of coins) total+=Number(item.balance)
        if(total<amount) throw new Error("Not Enough Token")

        const tx = new TransactionBlock()
        if(coins.length>1)
            tx.mergeCoins(tx.object(coins[0].coinObjectId), coins.slice(1,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        tx.moveCall({
            target: `${InfoDice.contract}::dicegame::play_mut`,
            typeArguments:[
                InfoDice.token_type
            ],
            arguments:[
                tx.object(InfoDice.pool),
                tx.object(coins[0].coinObjectId),
                tx.pure(amount),
                tx.pure(selectedCase),
                tx.object("0x06")
            ]
        })
        return await wallet.signAndExecuteTransactionBlock({transactionBlock: tx, options:{showEffects:true, showEvents: true, showObjectChanges: true, showBalanceChanges: true, showInput: true}})
    }, [wallet, provider])

    const dice_claim = useCallback(async()=>{
        const tx = new TransactionBlock()
        tx.moveCall({
            target: `${InfoDice.contract}::dicegame::claim`,
            typeArguments:[
                InfoDice.token_type
            ],
            arguments:[
                tx.object(InfoDice.pool)
            ]
        })
        await wallet.signAndExecuteTransactionBlock({transactionBlock: tx, options:{showEffects:true, showEvents: true, showObjectChanges: true, showBalanceChanges: true, showInput: true}})
    },[wallet])

    return <ProgramContext.Provider value={{
        getShsOwned,

        // Staking
        getUserStakeData,
        getOwnedNfts,
        getStakedNfts,
        getStakingPoolData,
        stake_shs,
        unstake_shs,
        claim_rewards,
        stake_nfts,
        unstake_nfts,

        // Coinflip
        getUserCoinflipData,
        coinflip_claim,
        coinflip_flip,

        // Dice game
        getUserDiceData,
        dice_roll,
        dice_claim,
    }}>{children}</ProgramContext.Provider>
}