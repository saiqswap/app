import {FC, useCallback, ReactNode,} from 'react'
import { DatabaseContext } from './useDatabase'
import axios from 'axios'
export interface DatabseProviderProps{
    children: ReactNode
}

export const DatabaseProvider: FC<DatabseProviderProps> = ({children}) => {
    const SERVER_URL = "http://162.240.228.209:8111"

    const getCoinflipRecentGame = async() => {
        let resp = await axios.get(SERVER_URL+"/coinflip")
        if(resp.data.response){
            return resp.data.data
        }else{
            throw new Error("Invalid Request")
        }
    }
    const putNewCoinflipGame = async(data: any) => {
        try{
            await axios.put(SERVER_URL+"/coinflip",data)
        }catch(err: any){
            throw new Error(err.message)
        }
    }
    return <DatabaseContext.Provider value={{
        getCoinflipRecentGame,
        putNewCoinflipGame,
    }}>{children}</DatabaseContext.Provider>
}