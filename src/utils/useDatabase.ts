import { createContext, useContext } from "react";

export interface DatabseContextState{
    getCoinflipRecentGame() : Promise<any>;
    putNewCoinflipGame(data: any) : void;
}

export const DatabaseContext = createContext<DatabseContextState>({

} as DatabseContextState)

export function useDatabse() : DatabseContextState{
    return useContext(DatabaseContext)
}