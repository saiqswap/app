import { Savings as SavingsIcon, AttachMoney as AttachMoneyIcon, Brightness7 as Brightness7Icon, Brightness3 as Brightness3Icon, Opacity } from "@mui/icons-material"
import { useState } from "react"
import { COINFLIP_WAGER_AMOUNT, openNotification, sleep } from "../utils/constants"
import { useProgram } from "../utils/useProgram"

export default function Coinflip(){

    const {coinflip_flip, coinflip_claim} = useProgram()

    const [selectedSide, setSelectedSide] = useState(0)
    const [selectedAmount, setSelectedAmount] = useState(0)

    return <div className="coinflip-dashboard">
        <div className="dashboard-header">
            <h2>COIN FLIP</h2>
        </div>
        <div className="coinflip-gameboard">
            <div className="coin-select-panel">
                <div className={"front-coin coin-select-button "+(selectedSide?"":"active")} onClick={()=>{setSelectedSide(0)}}>
                    <Brightness7Icon style={{fontSize:"80px"}}/>
                </div>
                <div className={"back-coin coin-select-button "+(selectedSide?"active":"")} onClick={()=>{setSelectedSide(1)}}>
                    <Brightness3Icon style={{fontSize:"80px"}}/>
                </div>
            </div>
            <h3 className="coinflip-gameboard-h3">Choose your side</h3>
            <div className="wager-select-panel">
            {
                COINFLIP_WAGER_AMOUNT.map((item,idx)=>{
                    return <button type="button" className={"btn-wager "+(selectedAmount===idx?"active":"")} onClick={()=>{setSelectedAmount(idx)}}>
                        {item+" SHS"}
                    </button>
                })
            }
            </div>
            <h3 className="coinflip-gameboard-h3">Choose bet amount</h3>
            <hr style={{width: "50%", color: "rgb(118, 139, 173)", margin: "10px auto", opacity: 0.25}}/>
            <div className="btn-flip-wrapper">
                <button className="btn-flip" onClick={async()=>{
                    try{
                        await coinflip_flip(selectedSide, COINFLIP_WAGER_AMOUNT[selectedAmount])
                        await sleep(2000)
                    }catch(err: any){
                        openNotification('error',err.message)
                    }
                }}>Flip</button>
            </div>
        </div>
    </div>
}