import { createContext, useContext } from "react";

export interface ProgramContextState{
    getUserStakeData() : Promise<any>;
    getStakingPoolData() : Promise<any>;
    getShsOwned() : Promise<number>;
    getOwnedNfts() : Promise<any[]>;
    getStakedNfts() : Promise<any[]>;

    stake_shs(amount: number) : void;
    unstake_shs(amount: number) : void;
    claim_rewards() : void;
    stake_nfts(item : string[]) : void;
    unstake_nfts(item : string[]) : void;

    coinflip_flip(side: number, amount: number) : void;
    coinflip_claim() : void;
}

export const ProgramContext = createContext<ProgramContextState>({
} as ProgramContextState)

export function useProgram() : ProgramContextState{
    return useContext(ProgramContext)
}