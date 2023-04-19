import { Button, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"
import { useProgram } from "../utils/useProgram"
import { DECIMALS, STAKING_TOKEN_TYPE, openNotification, sleep } from "../utils/constants"
import { useWallet } from "@suiet/wallet-kit"

export default function Staking(){
    const wallet = useWallet()
    const {claim_rewards,stake_shs, unstake_shs, getShsOwned, getUserStakeData, getStakingPoolData, getOwnedNfts, getStakedNfts, stake_nfts, unstake_nfts} = useProgram()

    const [stakeAmount, setStakeAmount] = useState('')
    const [unstakeAmount, setUnstakeAmount] = useState('')

    const [userData, setUserData] = useState<any>(null)
    const [isUserDataLoading, setIsUserDataLoading] = useState(false)
    const [poolData, setPoolData] = useState<any>(null)
    const [shsOwned, setShsOwned] = useState(0)
    const [ownedNfts, setOwnedNfts] = useState<any[]>([])
    const [isOwnedNftsLoading, setIsOwnedNftsLoading] = useState(false)
    const [stakedNfts, setStakedNfts] = useState<any[]>([])
    const [isStakedNftsLoading, setIsStakedNftsLoading] = useState(false)

    useEffect(()=>{
        getPoolData()
        getUserDataBatch()
    },[])

    useEffect(()=>{
        getShsAmount()
        getUserDataBatch()
    },[wallet,poolData])

    const getUserDataBatch = async() => {
        getStakingUserData()
        getUserOwnedNftsData()
        getUserStakedNftsData()
    }

    const getStakingUserData = async() => {
        setUserData(await getUserStakeData())
    }

    const getPoolData = async() => {
        setPoolData(await getStakingPoolData())
    }

    const getShsAmount = async() => {
        setShsOwned(await getShsOwned(STAKING_TOKEN_TYPE))
    }

    const getUserOwnedNftsData = async() => {
        setIsOwnedNftsLoading(true)
        setOwnedNfts(await getOwnedNfts())
        setIsOwnedNftsLoading(false)
    }
    
    const getUserStakedNftsData = async() => {
        setIsStakedNftsLoading(true)
        setStakedNfts(await getStakedNfts())
        setIsStakedNftsLoading(false)
    }

    const handleSelectNft = (index : number) => {
        setOwnedNfts(ownedNfts.map((item, idx)=>{
            return index===idx ? {...item, selected: !item.selected} : item
        }))
    }

    const handleSelectStakedNft = (index : number) => {
        setStakedNfts(stakedNfts.map((item, idx)=>{
            return index===idx ? {...item, selected: !item.selected} : item
        }))
    }

    const stakeNft = async(isAll : boolean) => {
        try{
            let nfts = isAll ? ownedNfts : ownedNfts.filter((item)=>{return item.selected})
            if(nfts.length===0) throw new Error("No NFT selected")
            await stake_nfts(nfts.map((item)=>{return item.objectId}))
            openNotification('success', 'Stake Success!')
            await sleep(2000);
            getUserDataBatch()
        }catch(err: any){
            openNotification('error', err.message)
        }
    }

    const unstakeNft = async(isAll: boolean) => {
        try{
            let nfts = isAll ? stakedNfts : stakedNfts.filter((item)=>{return item.selected})
            if(nfts.length===0) throw new Error("No NFT selected")
            await unstake_nfts(nfts.map((item)=>{return item.listingId}))
            openNotification('success', 'Unstake Success!')
            await sleep(2000)
            getUserDataBatch()
        }catch(err: any){
            openNotification('error', err.message)
        }
    }

    return <div className="staking-dashboard">
        <div className="staking-main-panel">
            <div className="staking-main-panel-title">
                <h2>SHS STAKING</h2>
                <p>You can unstake from this pool anytime</p>
            </div>
            <div className="staking-main-panel-pool-info">
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">TVL</p>
                    <p className="staking-main-panel-one-info-detail">{poolData==null ? "-" : (poolData['tvl']/(10**DECIMALS))+" SHS"}</p>
                </div>
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">APY</p>
                    <p className="staking-main-panel-one-info-detail">{poolData==null ? "-" : ((userData==null || Number(userData['stake_nft_count'])===0 ? poolData['apy'] : (Number(poolData['apy_nft'])+Number(poolData['apy_one_nft'])*(Number(userData['stake_nft_count'])-1)))/100)+" %"}</p>
                </div>
            </div>
            <div className="staking-main-panel-reward-info">
                <p className="staking-main-panel-reward-amount">{shsOwned/(10**DECIMALS)}</p>
                <p className="staking-main-panel-reward-info-title">SHS Owned</p>
            </div>
            <div className="staking-main-panel-staking-info">
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">Staked</p>
                    <p className="staking-main-panel-one-info-detail">{userData==null ? "-" : (userData['amount']/(10**DECIMALS))+" SHS"}</p>
                </div>
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">Reward</p>
                    <p className="staking-main-panel-one-info-detail">{userData==null? "-" : (userData['reward_amount']/(10**DECIMALS))+" SHS"}</p>
                </div>
            </div>
            <div className="staking-main-panel-action-part">
                <div className="staking-main-panel-action-detail">
                    <div className="staking-main-panel-action-detail-title">Stake Amount</div>
                    <div className="staking-main-panel-action-detail-amount-wrapper">
                        <input type="number" className="staking-main-panel-action-detail-amount" placeholder="Enter amount to Stake" min="0" step="0.1" onChange={(e)=>{setStakeAmount(e.target.value)}} value={stakeAmount}/>
                    </div>
                    <Button variant="contained" color="success" className="staking-main-panel-action-detail-button btn-stake" onClick={async()=>{
                        try{
                            await stake_shs(Number(stakeAmount))
                            openNotification('success', 'Stake Success!')
                            await sleep(2000);
                            getStakingPoolData()
                        }catch(err: any){
                            openNotification('error',err.message)
                        }
                    }}>Stake</Button>
                </div>
                <div className="staking-main-panel-action-detail">
                    <div className="staking-main-panel-action-detail-title">Unstake Amount</div>
                    <div className="staking-main-panel-action-detail-amount-wrapper">
                        <input type="number" className="staking-main-panel-action-detail-amount" min="0" step="0.1" onChange={(e)=>{setUnstakeAmount(e.target.value)}} value={unstakeAmount} />
                    </div>
                    <Button variant="contained" className="staking-main-panel-action-detail-button btn-unstake" onClick={async()=>{
                        try{
                            await unstake_shs(Number(unstakeAmount))
                            openNotification('success', 'Unstake Success!')
                            await sleep(2000)
                            getStakingPoolData()
                        }catch(err: any){
                            openNotification('error', err.message)
                        }
                    }}>Unstake</Button>
                </div>
            </div>
            <div className="staking-main-panel-action-reward-part">
                <Button variant="outlined" sx={{width:"100%", borderRadius: "0.8rem", fontFamily: "IndustryBold"}} color="success" onClick={async()=>{
                    try{
                        await claim_rewards()
                        openNotification('success', 'Claim Reward Success!')
                        await sleep(2000)
                        getStakingUserData()
                    }catch(err: any){
                        openNotification('error', err.message)
                    }
                }}>Claim Reward</Button>
            </div>
        </div>
        <div className="nft-staking-panel-wrapper">
            <div className="nft-staking-one-panel">
                <div className="nft-staking-one-panel-content">
                    <div className="nft-staking-one-panel-content-body">
                    {
                        isOwnedNftsLoading ?
                            <div className="nft-staking-one-panel-content-body-loading"><CircularProgress size="10rem" color="inherit" disableShrink/></div>
                        :   
                        ownedNfts.length===0 ?
                            <div className="nft-staking-one-panel-content-body-banner">No NFTs</div>
                        :
                        ownedNfts.map((item : any, idx: number)=>{
                            return <div key={item.objectId} className="nft" onClick={()=>{
                                handleSelectNft(idx)
                            }}>
                                <img className={item.selected ? "red-border" : "normal-border"} src={item.data.fields.image_url} alt="logo" width={"100px"}></img>
                                <p className={item.selected ? "red-color" : "normal-color"}>{item.data.fields.name}</p>
                            </div>
                        })
                    }
                    </div>
                </div>
                <div className="nft-staking-one-panel-actions">
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="contained" color="success" onClick={async()=>{stakeNft(false)}}>Stake</Button>
                    </div>
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="outlined" color="success" onClick={async()=>{stakeNft(true)}}>Stake All</Button>
                    </div>
                </div>
            </div>
            <div className="nft-staking-one-panel">
                <div className="nft-staking-one-panel-content">
                    <div className="nft-staking-one-panel-content-body">
                    {
                        isStakedNftsLoading ?
                            <div className="nft-staking-one-panel-content-body-loading"><CircularProgress size="10rem" color="inherit" disableShrink/></div>
                        :
                        stakedNfts.length==0 ?
                            <div className="nft-staking-one-panel-content-body-banner">No NFTs</div>
                        :
                        stakedNfts.map((item : any, idx: number)=>{
                            return <div key={item.objectId} className="nft" onClick={()=>{
                                handleSelectStakedNft(idx)
                            }}>
                                <img className={item.selected ? "red-border" : "normal-border"} src={item.data.fields.image_url} alt="logo" width={"100px"}></img>
                                <p className={item.selected ? "red-color" : "normal-color"}>{item.data.fields.name}</p>
                            </div>
                        })
                    }
                    </div>
                </div>
                <div className="nft-staking-one-panel-actions">
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="contained" color="primary" onClick={async()=>{unstakeNft(false)}}>Unstake</Button>
                    </div>
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="outlined" color="primary" onClick={async()=>{unstakeNft(true)}}>Unstake All</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}