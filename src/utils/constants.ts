import {notification} from 'antd'
export const SHS_TOKEN_CONTRACT_ADDRESS = "0x1e0b1b701da0c8ddaf839bd83b99bc32706ee25d70b8d95c73fef844d742b331"
export const SHS_STAKING_CONTRACT_ADDRESS = "0x949c7a805e0d8e35cb678b245d0983967516e6f69cfa71ab1b5785c8d74aa9af"
export const SHS_COINFLIP_CONTRACT_ADDRESS = "0x8d2f23d78c0f0586bfb65311933e3a8a6c873611b48c2424acb9e5aad56ff747"
export const SHS_DICE_CONTRACT_ADDRESS = "0x8d2f23d78c0f0586bfb65311933e3a8a6c873611b48c2424acb9e5aad56ff747"

export const DECIMALS = 9

export const STAKING_POOL = "0x4da67c8b244e1402ebd1cbb97014d7f79a752d398a2a7b31a022f7e0d1d045f1"
export const STAKING_NFT_TYPE = "0x2d4bd7e964d3dd4fc6a92bd03094fad90180bed911b6eb2f42d95bd4e29526a2::bluemove_nft::BlueMoveNFT"
export const STAKING_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"

export const COINFLIP_WAGER_AMOUNT = [50, 100, 200, 500, 1000, 2000]
export const COINFLIP_POOL = "0x3e735790a8a702f80eeab60909b01a6e2c5d990b971c6c4f1ba216b77efe5269"
export const COINFLIP_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"
export const COINFLIP_TOKEN_DECIMALS = 9

export const DICE_WAGER_AMOUNT = [50, 100, 200, 500, 1000, 2000]
export const DICE_POOL = '0x5160e937c7c863af80e4f35d2506831d39e31c5219774fc579df21c8bfe4c10a'
export const DICE_TOKEN_TYPE = SHS_TOKEN_CONTRACT_ADDRESS+"::suiheroes::SUIHEROES"
export const DICE_TOKEN_DECIMALS = 9

export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const RoadmapContent = [
    {
        main: "Build a strong community",
        details: "Our first mission is to build a strong SUI HEROES Community.",
    },
    {
        main: "Launch Socials",
        details: "Launching of our website and Discord.",
    },
    {
        main: "NFT mint",
        details: "SUI HEROES NFT mint on Clutchy Marketplace and Launchpad . ",
    },
    {
        main: "SECONDARY MARKETS",
        details: "Listing and features on Clutchy NFT marketplaces. ",
    },
    {
        main: "SUI HEROES TOKEN IDO & Airdrop",
        details:
            "Conduct a TOKEN IDO sale on a Launchpad & Airdrop of SUI HEROES token to all SUI HEROES NFT holders.",
    },
    {
        main: "SUIHEROES TOKEN DEX LISTING",
        details: "Listing of SuiHeroes Token ($SHS) on a DEX.",
    },
    {
        main: " SuperCharged Staking ",
        details: "Stake your NFT and Tokens to earn SuperCharged rewards",
    },
    {
        main: "CoinFlip ",
        details:
            "Throw a coin, your luck, your money!! (Platform fees of 3.5% will be taken from a winning CoinFlip)",
    },
    {
        main: " 3D SUI HEROES ",
        details:
            "Launch of 3D SUI HEROES, this will be airdropped to original SUI HEROES NFT holders.",
    },
    {
        main: "SUI HEROES Marketplace",
        details:
            "Platform where users can sell and purchase 3D HEROES, assets, and accessories.",
    },
    {
        main: " SUI HEROES DAO",
        details: "Creation of the community SUI HEROES DAO.",
    },
    {
        main: "SUI HEROES Web 3.0 Lottery",
        details: "Opening of our first SUI HEROES Web 3.0 Lottery.",
    },
];