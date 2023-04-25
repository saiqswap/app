import React, { useEffect, useState, useRef } from "react"
import { DICE_TOKEN_TYPE, DICE_WAGER_AMOUNT, DICE_TOKEN_DECIMALS, openNotification, sleep } from "../utils/constants"
import { useProgram } from "../utils/useProgram"
import { useWallet } from "@suiet/wallet-kit"
import Dice from 'react-dice-roll'
import ReactDice, {ReactDiceRef} from 'react-dice-complete'

export default function DiceGame(){
    const wallet = useWallet()
    const {getShsOwned, getUserDiceData, dice_roll, dice_claim} = useProgram()

    const [gameStatus, setGameStatus] = useState(0)
    const [userData, setUserData] = useState<any>(null)
    const [tokenAmount, setTokenAmount] = useState(0)
    const [selectedCase, setSelectedCase] = useState(1)
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [dice1Amount, setDice1Amount] = useState(0)
    const [dice2Amount, setDice2Amount] = useState(0)

    const reactDice1 = useRef<ReactDiceRef>(null)
    const reactDice2 = useRef<ReactDiceRef>(null)
    const reactDice3 = useRef<ReactDiceRef>(null)
    const reactDice4 = useRef<ReactDiceRef>(null)

    useEffect(()=>{
        getUserData()
        const interval = setInterval(()=>{getTokenAmount()}, 5000)
        return ()=>clearInterval(interval)
    },[wallet])

    useEffect(()=>{
        if(userData==null) setGameStatus(0)
        else{
            reactDice3.current?.rollAll()
            reactDice4.current?.rollAll()
            setGameStatus(1)
        }
    },[userData])

    const getTokenAmount = async() => {
        setTokenAmount(await getShsOwned(DICE_TOKEN_TYPE))
    }

    const getUserData = async() => {
        const ud = await getUserDiceData()
        console.log(ud)
        if(ud!=null && ((ud.select===1 && ud.dice1>ud.dice2) || (ud.select===2 && ud.dice1===ud.dice2) || (ud.select===3 && ud.dice1<ud.dice2))){
            setUserData(ud)
        }
        else setUserData(null)
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
                        {/* <Dice size={160} onRoll={(value)=>{setDice1Amount(value)}} defaultValue={dice1Amount}/> */}
                        <ReactDice ref={reactDice1} dieSize={160} dieCornerRadius={5} defaultRoll={Math.floor((new Date()).getTime()/19)%6+1}  numDice={1} rollTime={3} outline rollDone={(totalValue, values)=>{setDice1Amount(values[0])}}/>
                    </div>
                    <div className="one-dice">
                        <ReactDice ref={reactDice2} dieSize={160} dieCornerRadius={5} defaultRoll={Math.floor((new Date()).getTime()/139)%6+1} numDice={1} rollTime={3} outline rollDone={(totalValue, values)=>{setDice2Amount(values[0])}}/>
                    </div>
                    {/* <div className="case-result">{dice1Amount===0?"":(dice1Amount===dice2Amount?"Equal":dice1Amount>dice2Amount?"Higher":"Lower")}</div> */}
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
                                return <button key={idx} type="button" className={"btn-wager "+(selectedAmount===idx?"active":"")} onClick={()=>{setSelectedAmount(idx)}}>{item+" SHS"}</button>
                            })
                        }
                        </div>
                        <h3 className="dice-gameboard-h3">Choose amount</h3>
                        <hr style={{width: "50%", color: "rgb(118, 139, 173)", margin: "10px auto", opacity: 0.25}}/>
                        <div className="btn-roll-wrapper">
                            <button className="btn-roll" onClick={async ()=>{
                                try{
                                    // setGameStatus(1)
                                    reactDice1.current?.rollAll()
                                    reactDice2.current?.rollAll()
                                    let res = await dice_roll(selectedCase,DICE_WAGER_AMOUNT[selectedAmount])
                                    console.log(res)
                                    setUserData({...res.events[0].parsedJson})
                                }catch(err: any){
                                    console.log(err)
                                    openNotification('error', err.message)
                                    setGameStatus(0)
                                }

                            }}>Roll</button>
                        </div>
                </div>
                </div>
            :
            gameStatus===1 ?
                <div className="dice-gameboard one-panel">
                    <div className="dice-rolling-panel">
                        {/* <div className="one-dice">
                            <ReactDice ref={reactDice3}  dieSize={160} dieCornerRadius={5} defaultRoll={userData.dice1} disableRandom={true} numDice={1} rollTime={1} outline rollDone={(totalValue, values)=>{setDice1Amount(values[0]); reactDice1.current?.rollAll()}}/>
                        </div>
                        <div className="one-dice">
                            <ReactDice ref={reactDice4}  dieSize={160} dieCornerRadius={5} defaultRoll={userData.dice2} disableRandom={true} numDice={1} rollTime={1} outline rollDone={(totalValue, values)=>{setDice1Amount(values[0]); reactDice2.current?.rollAll()}}/>
                        </div> */}
                    </div>
                    <h3 className="dice-gameboard-h3">
                    {
                        userData==null ? "R o l l i n g. . ."
                        : 
                        ((userData.select===1 && userData.dice1>userData.dice2) || (userData.select===2 && userData.dice1===userData.dice2) || (userData.select===3 && userData.dice1<userData.dice2)) ? "You win" : "You lost"
                    }
                    </h3>
                    {
                        userData!=null &&
                        <div className="btn-roll-wrapper">
                        {
                            ((userData.select===1 && userData.dice1>userData.dice2) || (userData.select===2 && userData.dice1===userData.dice2) || (userData.select===3 && userData.dice1<userData.dice2)) ?
                                <button onClick={async()=>{
                                    try{
                                        await dice_claim()
                                        setGameStatus(0)
                                        await sleep(100)
                                        setUserData(null)
                                    }catch(err: any){
                                        openNotification('error',err.message)
                                    }
                                }}>Redeem Reward</button>
                            :
                                <button onClick={async()=>{
                                    setGameStatus(0)
                                    await sleep(100)
                                    setUserData(null)
                                }}>Back and Retry</button>
                        }
                        </div>
                    }
                </div>
            :  
                <></>
        }
    </div>
}