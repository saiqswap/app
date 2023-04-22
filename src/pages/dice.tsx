import { useEffect, useState } from "react"
import { DICE_TOKEN_TYPE, DICE_WAGER_AMOUNT, DICE_TOKEN_DECIMALS } from "../utils/constants"
import { useProgram } from "../utils/useProgram"
import { useWallet } from "@suiet/wallet-kit"
import Dice from 'react-dice-roll'
import DICE_BACK_IMG from '../assets/images/Gold.png'

const FACES = [
    'https://www.wpclipart.com/dl.php?img=/recreation/games/dice/die_face_1_T.png',
    'https://www.wpclipart.com/dl.php?img=/recreation/games/dice/die_face_2_T.png',
    'https://www.wpclipart.com/dl.php?img=/recreation/games/dice/die_face_3_T.png',
    'https://www.wpclipart.com/dl.php?img=/recreation/games/dice/die_face_4_T.png',
    'https://www.wpclipart.com/dl.php?img=/recreation/games/dice/die_face_5_T.png',
    'https://www.wpclipart.com/dl.php?img=/recreation/games/dice/die_face_6_T.png',
]

export default function DiceGame(){
    const wallet = useWallet()
    const {getShsOwned} = useProgram()

    const [tokenAmount, setTokenAmount] = useState(0)

    useEffect(()=>{
        const interval = setInterval(()=>{getTokenAmount()}, 5000)
        return ()=>clearInterval(interval)
    },[])

    const getTokenAmount = async() => {
        setTokenAmount(await getShsOwned(DICE_TOKEN_TYPE))
    }


    return <div className="dice-dashboard">
        <div className="dashboard-header">
            <h2>DICE GAME&nbsp;&nbsp;:&nbsp;&nbsp;<span style={{color: "#00ffff"}}>{Math.floor(tokenAmount/(10**DICE_TOKEN_DECIMALS)*100)/100}</span> SHS</h2>
        </div>
        <div className="dice-gameboard">
           <div className="dice-panel">
                <div className="one-dice">
                    <Dice size={200} rollingTime={10000} faceBg="RGB(1,1,1,0)"/>
                </div>
                <div className="one-dice">
                    <Dice size={200}/>
                </div>
           </div>
           <div className="dice-option-panel">

           </div>
        </div>
    </div>
}