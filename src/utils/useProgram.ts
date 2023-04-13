import { createContext, useContext } from "react";

export interface ProgramContextState{
    userData : any,
    poolData : any,
    shsOwned : number,
    getUserData() : void;
    getStakingPoolData() : void;
    stake_shs(amount: number) : void;
    unstake_shs(amount: number) : void;
    claim_rewards() : void;
}

export const ProgramContext = createContext<ProgramContextState>({
    shsOwned:0
} as ProgramContextState)

export function useProgram() : ProgramContextState{
    return useContext(ProgramContext)
}