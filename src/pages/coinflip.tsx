import { Savings as SavingsIcon, AttachMoney as AttachMoneyIcon, Brightness7 as Brightness7Icon, Brightness3 as Brightness3Icon } from "@mui/icons-material"
import { useState } from "react"

export default function Coinflip(){
    const [selected, setSelected] = useState(0)

    return <div className="coinflip-dashboard">
        <div className="dashboard-header">
            <h2>COIN FLIP</h2>
        </div>
        <div className="coinflip-gameboard">
            <div className="coin-select-panel">
                <div className={"front-coin coin-select-button "+(selected?"":"active")} onClick={()=>{setSelected(0)}}>
                    <Brightness7Icon style={{fontSize:"40px"}}/>
                </div>
                <div className={"back-coin coin-select-button "+(selected?"active":"")} onClick={()=>{setSelected(1)}}>
                    <Brightness3Icon style={{fontSize:"40px"}}/>
                </div>
            </div>
        </div>
    </div>
}