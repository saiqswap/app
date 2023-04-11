import { Button } from "@mui/material"
import { useState } from "react"
import { useProgram } from "../utils/useProgram"
import { openNotification } from "../utils/constants"

export default function Staking(){
    const {claim_rewards,stake_shs, unstake_shs, userData, getUserData, poolData} = useProgram()

    const [stakeAmount, setStakeAmount] = useState('')
    const [unstakeAmount, setUnstakeAmount] = useState('')

    return <div className="dashboard">
        <div className="staking-main-panel">
            <div className="staking-main-panel-title">
                <h2>SHS STAKING</h2>
                <p>You can unstake from this pool anytime</p>
            </div>
            <div className="staking-main-panel-pool-info">
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">TVL</p>
                    <p className="staking-main-panel-one-info-detail">{poolData==null ? "-" : poolData['tvl']+" SHS"}</p>
                </div>
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">APY</p>
                    <p className="staking-main-panel-one-info-detail">{poolData==null ? "-" : (poolData['apy']/100)+" %"}</p>
                </div>
            </div>
            <div className="staking-main-panel-reward-info">
                <p className="staking-main-panel-reward-amount">0.00</p>
                <p className="staking-main-panel-reward-info-title">SHS Earned</p>
            </div>
            <div className="staking-main-panel-staking-info">
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">Staked</p>
                    <p className="staking-main-panel-one-info-detail">{userData==null ? "-" : userData['amount']+" SHS"}</p>
                </div>
                <div className="staking-main-panel-one-info">
                    <p className="staking-main-panel-one-info-title">Reward</p>
                    <p className="staking-main-panel-one-info-detail">{userData==null? "-" : userData['reward_amount']+" SHS"}</p>
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
                            getUserData()
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
                            getUserData()
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
                        getUserData()
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

                    </div>
                </div>
                <div className="nft-staking-one-panel-actions">
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="contained" color="success">Stake</Button>
                    </div>
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="outlined" color="success">Stake All</Button>
                    </div>
                </div>
            </div>
            <div className="nft-staking-one-panel">
                <div className="nft-staking-one-panel-content">
                    <div className="nft-staking-one-panel-content-body">

                    </div>
                </div>
                <div className="nft-staking-one-panel-actions">
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="contained" color="primary">Unstake</Button>
                    </div>
                    <div className="nft-staking-one-panel-action-wrapper">
                        <Button variant="outlined" color="primary">Unstake All</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}