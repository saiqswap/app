import React, { useEffect, useState, useRef } from "react"
import { DICE_TOKEN_TYPE, DICE_WAGER_AMOUNT, DICE_TOKEN_DECIMALS } from "../utils/constants"
import { useProgram } from "../utils/useProgram"
import { useWallet } from "@suiet/wallet-kit"
import Dice from 'react-dice-roll'

export default function DiceGame(){
    const wallet = useWallet()
    const {getShsOwned, getUserDiceData, dice_roll, dice_claim} = useProgram()

    const [gameStatus, setGameStatus] = useState(0)
    const [tokenAmount, setTokenAmount] = useState(0)
    const [selectedCase, setSelectedCase] = useState(1)
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [dice1Amount, setDice1Amount] = useState<any>(Math.floor((new Date()).getTime()/19)%6+1)
    const [dice2Amount, setDice2Amount] = useState<any>(Math.floor((new Date()).getTime()/139)%6+1)

    useEffect(()=>{
        const interval = setInterval(()=>{getTokenAmount()}, 5000)
        return ()=>clearInterval(interval)
    },[wallet])

    const getTokenAmount = async() => {
        setTokenAmount(await getShsOwned(DICE_TOKEN_TYPE))
    }


    return <div className="dice-dashboard">
        <div className="dashboard-header">
            <h2>DICE GAME&nbsp;&nbsp;:&nbsp;&nbsp;<span style={{color: "#00ffff"}}>{Math.floor(tokenAmount/(10**DICE_TOKEN_DECIMALS)*100)/100}</span> SHS</h2>
        </div>
        {
            gameStatus===0 ?
                <div className="dice-gameboard">
                <div className="dice-panel">
                    <div className="one-dice">
                        <Dice size={160} onRoll={(value)=>{setDice1Amount(value)}} defaultValue={dice1Amount}/>
                    </div>
                    <div className="one-dice">
                        <Dice size={160} onRoll={(value)=>{setDice2Amount(value)}} defaultValue={dice2Amount}/>
                    </div>
                    <div className="case-result">{dice1Amount===dice2Amount?"Equal":dice1Amount>dice2Amount?"Higher":"Lower"}</div>
                </div>
                <div className="dice-option-panel">
                        <div className="case-select-panel">
                            <button type="button" className={"btn-case "+(selectedCase===1?"active":"")} onClick={()=>{setSelectedCase(1)}}>Higher</button>
                            <button type="button" className={"btn-case "+(selectedCase===2?"active":"")} onClick={()=>{setSelectedCase(2)}}>Equal</button>
                            <button type="button" className={"btn-case "+(selectedCase===3?"active":"")} onClick={()=>{setSelectedCase(3)}}>Lower</button>
                        </div>
                        <h3 className="dice-gameboard-h3">Choose case</h3>
                        <div className="wager-select-panel">
                        {
                            DICE_WAGER_AMOUNT.map((item, idx)=>{
                                return <button type="button" className={"btn-wager "+(selectedAmount===idx?"active":"")} onClick={()=>{setSelectedAmount(idx)}}>{item+" SHS"}</button>
                            })
                        }
                        </div>
                        <h3 className="dice-gameboard-h3">Choose amount</h3>
                        <hr style={{width: "50%", color: "rgb(118, 139, 173)", margin: "10px auto", opacity: 0.25}}/>
                        <div className="btn-roll-wrapper">
                            <button className="btn-roll" onClick={(e)=>{
                                
                            }}>Roll</button>
                        </div>
                </div>
                </div>
            :
            gameStatus===1 ?
                <div className="dice-gameboard">
                    <div className="dice-rolling-panel">
                        <Dice size={160} rollingTime={10000}/>
                        <Dice size={160} rollingTime={10000}/>
                    </div>
                </div>
            :
                <></>
        }
    </div>
}