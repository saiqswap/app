import { createContext, useContext } from "react";

export interface ProgramContextState{
    getShsOwned(coinType : string) : Promise<number>;

    // Staking
    getUserStakeData() : Promise<any>;
    getStakingPoolData() : Promise<any>;
    getOwnedNfts() : Promise<any[]>;
    getStakedNfts() : Promise<any[]>;
    stake_shs(amount: number) : void;
    unstake_shs(amount: number) : void;
    claim_rewards() : void;
    stake_nfts(item : string[]) : void;
    unstake_nfts(item : string[]) : void;

    // Coinflip
    getUserCoinflipData() : Promise<any>;
    coinflip_flip(side: number, amount: number) : Promise<any>;
    coinflip_claim() : void;

    // Dice game
    getUserDiceData() : Promise<any>;
    dice_roll(side: number, amount: number) : Promise<any>;
    dice_claim() : void;
}

export const ProgramContext = createContext<ProgramContextState>({
} as ProgramContextState)

export function useProgram() : ProgramContextState{
    return useContext(ProgramContext)
}