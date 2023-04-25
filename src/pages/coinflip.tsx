import { Savings as SavingsIcon, AttachMoney as AttachMoneyIcon, Brightness7 as Brightness7Icon, Brightness3 as Brightness3Icon, Opacity } from "@mui/icons-material"
import { useDebugValue, useEffect, useState } from "react"
import { COINFLIP_TOKEN_DECIMALS, COINFLIP_TOKEN_TYPE, COINFLIP_WAGER_AMOUNT, openNotification, sleep } from "../utils/constants"
import { useProgram } from "../utils/useProgram"
import { useWallet } from "@suiet/wallet-kit"
import Confetti from "react-confetti"

export default function Coinflip(){
    const wallet = useWallet()
    const {coinflip_flip, coinflip_claim, getUserCoinflipData, getShsOwned} = useProgram()

    const [gameStatus, setGameStatus] = useState(0)
    const [selectedSide, setSelectedSide] = useState(0)
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [userData, setUserData] = useState<any>(null)
    const [tokenAmount, setTokenAmount] = useState(0)

    const [winNumber, setWinNumber] = useState(0)

    useEffect(()=>{
        getUserData()
        const interval = setInterval(()=>{getTokenAmount()}, 5000)
        return ()=>clearInterval(interval)
    },[wallet])

    useEffect(()=>{
        if(userData==null) setGameStatus(0)
        if(userData!=null && userData.result===1) setGameStatus(2)
        if(userData!=null && userData.result===0) setGameStatus(3)
    },[userData])

    const getUserData = async() => {
        const ud = await getUserCoinflipData()
        if(ud!=null && ud.result===1) setUserData(ud)
        else setUserData(null)
    }

    const getTokenAmount = async() => {
        setTokenAmount(await getShsOwned(COINFLIP_TOKEN_TYPE))
    }

    return <div className="coinflip-dashboard">
        {/* <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} wind={-0.01} recycle={false}/> */}
        <div className="dashboard-header">
            <h2>COIN FLIP&nbsp;&nbsp;:&nbsp;&nbsp;<span style={{color: "#00ffff"}}>{Math.floor(tokenAmount/(10**COINFLIP_TOKEN_DECIMALS)*100)/100}</span> SHS</h2>
        </div>
        {
            gameStatus===0 ?
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
                            return <button key={idx} type="button" className={"btn-wager "+(selectedAmount===idx?"active":"")} onClick={()=>{setSelectedAmount(idx)}}>{item+" SHS"}</button>
                        })
                    }
                    </div>
                    <h3 className="coinflip-gameboard-h3">Choose amount</h3>
                    <hr style={{width: "50%", color: "rgb(118, 139, 173)", margin: "10px auto", opacity: 0.25}}/>
                    <div className="btn-flip-wrapper">
                        <button className="btn-flip" onClick={async()=>{
                            try{
                                setGameStatus(1)
                                let res = await coinflip_flip(selectedSide, COINFLIP_WAGER_AMOUNT[selectedAmount])
                                if(res.events[0].parsedJson.result===1){
                                    setWinNumber(winNumber+1)
                                }else{
                                    setWinNumber(0)
                                }
                                setUserData({...res.events[0].parsedJson})
                                // let i = (new Date()).getTime() % 5;
                                // if(i>=0) setWinNumber(winNumber+1)
                                // else setWinNumber(0)
                                // console.log(winNumber)
                                // await sleep(1000)
                                // setUserData({select: 1, result: i>=0?1:0, amount: COINFLIP_WAGER_AMOUNT[selectedAmount]})
                            }catch(err: any){
                                openNotification('error',err.message)
                                setGameStatus(0)
                            }
                        }}>Flip</button>
                    </div>
                </div>
            :
            gameStatus===1 ?
                <div className="coinflip-gameboard">
                    <div className="coin-flipping-panel">
                        <div className="coin-flipping-image animation-front-image front-coin">
                            <Brightness7Icon style={{fontSize:"160px"}}/>
                        </div>
                        <div className="coin-flipping-image animation-back-image back-coin">
                            <Brightness3Icon style={{fontSize:"160px"}}/>
                        </div>
                    </div>
                    <h3 className="coinflip-gameboard-h3">F l i p p i n g . . .</h3>
                </div>
            :
            gameStatus===2 ?
                <div className="coinflip-gameboard">
                    <div className="coin-select-panel">
                        <div className={"coin-result " + (userData.select===1 ? "front-coin" : "back-coin")}>
                        {
                            userData.select ?
                                <Brightness7Icon style={{fontSize:"160px"}}/>
                            :
                                <Brightness3Icon style={{fontSize:"160px"}}/>
                        }
                        </div>
                    </div>
                    <h3 className="coinflip-gameboard-h3">Bet amount : {userData.amount/(10**COINFLIP_TOKEN_DECIMALS)} SHS</h3>
                    <div className="btn-flip-wrapper">
                        <button className="btn-flip" onClick={async()=>{
                            try{
                                await coinflip_claim()
                                setGameStatus(0)
                                await sleep(100)
                                setUserData(null)
                            }catch(err: any){
                                openNotification('error', err.message)
                            }
                        }}>Redeem Reward</button>
                    </div>
                </div>
            :
                <div className="coinflip-gameboard">
                    <div className="coin-select-panel">
                        <div className={"coin-result " + (userData.select===1 ? "back-coin" : "front-coin")}>
                        {
                            userData.select ?
                                <Brightness3Icon style={{fontSize:"160px"}}/>
                            :
                                <Brightness7Icon style={{fontSize:"160px"}}/>
                        }
                        </div>
                    </div>
                    <h3 className="coinflip-gameboard-h3">You lost {COINFLIP_WAGER_AMOUNT[selectedAmount]} SHS</h3>
                    <div className="btn-flip-wrapper">
                        <button className="btn-flip" onClick={async()=>{
                            setGameStatus(0)
                            setUserData(null)
                        }}>Back and Retry</button>
                    </div>
                </div>
        }
    </div>
}