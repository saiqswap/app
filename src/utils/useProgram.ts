import { createContext, useContext } from "react";

export interface ProgramContextState{
    userData : any,
    poolData : any,
    getUserData() : void;
    getStakingPoolData() : void;
    stake_shs(amount: number) : void;
    unstake_shs(amount: number) : void;
}

export const ProgramContext = createContext<ProgramContextState>({

} as ProgramContextState)

export function useProgram() : ProgramContextState{
    return useContext(ProgramContext)
}