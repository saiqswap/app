import React, { useEffect, useState, useRef } from "react"
import { openNotification } from "../utils/components"
import { InfoDice } from '../utils/constants'
import { useProgram } from "../utils/useProgram"
import { useWallet } from "@suiet/wallet-kit"
import ReactDice, {ReactDiceRef} from 'react-dice-complete'

export default function DiceGame(){
    const wallet = useWallet()
    const {getShsOwned, getUserDiceData, dice_roll, dice_claim} = useProgram()
    const [windowSize, setWindowSize] = useState(window.innerWidth)

    const [userData, setUserData] = useState<any>(null)
    const [tokenAmount, setTokenAmount] = useState(0)
    const [selectedCase, setSelectedCase] = useState(1)
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [isRoll, setIsRoll] = useState(false)

    const reactDice1 = useRef<ReactDiceRef>(null)
    const reactDice2 = useRef<ReactDiceRef>(null)

    useEffect(()=>{
        function handleWindowResize(){
            setWindowSize(window.innerWidth)
        }
        window.addEventListener('resize', handleWindowResize)
        return ()=>{
            window.removeEventListener('resize',handleWindowResize)
        }
    },[])

    useEffect(()=>{
        getUserData()
        const interval = setInterval(()=>{getTokenAmount()}, 5000)
        return ()=>clearInterval(interval)
    },[wallet])

    const getTokenAmount = async() => {
        setTokenAmount(await getShsOwned(InfoDice.token_type))
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
            <h2>DICE GAME&nbsp;&nbsp;:&nbsp;&nbsp;<span style={{color: "#00ffff"}}>{Math.floor(tokenAmount/(10**InfoDice.token_decimals)*100)/100}</span> SHS</h2>
        </div>
        <div className="dice-gameboard">
            {
                userData==null ?
                    <div className="dice-panel">
                        <div className="one-dice">
                            <ReactDice 
                                faceColor="linear-gradient(268.42deg, rgb(26, 41, 61) 0%, rgba(26, 41, 61, 0.9) 100.18%)"
                                ref={reactDice1} 
                                dieSize={windowSize > 770 ? 160 : 120}
                                dieCornerRadius={5}
                                defaultRoll={Math.floor((new Date()).getTime()/19)%6+1}
                                numDice={1}
                                rollTime={7} outline 
                                rollDone={(totalValue, values)=>{if(isRoll) reactDice1.current?.rollAll()}}/>
                        </div>
                        <div className="one-dice">
                            <ReactDice 
                                faceColor="linear-gradient(268.42deg, rgb(26, 41, 61) 0%, rgba(26, 41, 61, 0.9) 100.18%)"
                                ref={reactDice2}
                                dieSize={windowSize > 770 ? 160 : 120} 
                                dieCornerRadius={5} 
                                defaultRoll={Math.floor((new Date()).getTime()/139)%6+1} 
                                numDice={1} 
                                rollTime={7} outline 
                                rollDone={(totalValue, values)=>{if(isRoll) reactDice2.current?.rollAll()}}/>
                        </div>
                    </div>
                :
                    <div className="dice-panel">
                        <div className="one-dice first-dice">
                            {userData.dice1}
                        </div>
                        <div className="one-dice second-dice">
                            {userData.dice2}
                        </div>
                    </div>
            }
            {
                userData==null ?
                    <div className="dice-option-panel">
                        <div className="case-select-panel">
                            <button type="button" className={"btn-case "+(selectedCase===1?"active":"")} onClick={()=>{setSelectedCase(1)}}>Higher</button>
                            <button type="button" className={"btn-case "+(selectedCase===2?"active":"")} onClick={()=>{setSelectedCase(2)}}>Equal</button>
                            <button type="button" className={"btn-case "+(selectedCase===3?"active":"")} onClick={()=>{setSelectedCase(3)}}>Lower</button>
                        </div>
                        <h3 className="dice-gameboard-h3">Choose case</h3>
                        <div className="wager-select-panel">
                        {
                            InfoDice.wager_amount.map((item, idx)=>{
                                return <button key={idx} type="button" className={"btn-wager "+(selectedAmount===idx?"active":"")} onClick={()=>{setSelectedAmount(idx)}}>{item+" SHS"}</button>
                            })
                        }
                        </div>
                        <h3 className="dice-gameboard-h3">Choose amount</h3>
                        <hr style={{width: "50%", color: "rgb(118, 139, 173)", margin: "10px auto", opacity: 0.25}}/>
                        <div className="btn-roll-wrapper">
                            <button className="btn-roll" onClick={async ()=>{
                                setIsRoll(true)
                                try{
                                    reactDice1.current?.rollAll()
                                    reactDice2.current?.rollAll()
                                    let res = await dice_roll(selectedCase,InfoDice.wager_amount[selectedAmount])
                                    console.log(res.events[0].parsedJson)
                                    
                                    setUserData({...res.events[0].parsedJson})
                                }catch(err: any){
                                    console.log(err)
                                    openNotification('error', err.message)
                                }
                                setIsRoll(false)
                            }}>Roll</button>
                        </div>
                    </div>
                :
                ((userData.select===1 && userData.dice1>userData.dice2) || (userData.select===2 && userData.dice1===userData.dice2) || (userData.select===3 && userData.dice1<userData.dice2)) ?
                    <div className="dice-option-panel dice-result">
                        <div className="dice-result-banner">👍</div>
                        <h3 className="dice-result-description win-result">You win</h3>
                        <div className="btn-roll-wrapper">
                            <button className="btn-redeem" onClick={async()=>{
                                try{
                                    await dice_claim()
                                    setUserData(null)
                                }catch(err: any){
                                    openNotification('error',err.message)
                                }
                            }}>Redeem Reward</button>
                        </div>``
                    </div>
                :
                    <div className="dice-option-panel dice-result">
                        <div className="dice-result-banner">👎</div>
                        <h3 className="dice-result-description lost-result">You lost</h3>
                        <div className="btn-roll-wrapper">
                            <button className="btn-back" onClick={async()=>{
                                setUserData(null)
                            }}>Back and Retry</button>
                        </div>
                    </div>
            }
        </div>
    </div>
}