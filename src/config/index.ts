/// Mainnet Chain
// import { fantom } from "wagmi/chains";
// export const chains = [fantom];
// export const ACTIVE_CHAIN = fantom;
// export const EXPLORER = "https://ftmscan.com";

/// Testnet Chain
import { fantomTestnet } from "wagmi/chains";
export const chains = [fantomTestnet];
export const ACTIVE_CHAIN = fantomTestnet;
export const EXPLORER = "https://testnet.ftmscan.com";
export const CoinMingleRouter = "0x48e93E4aA0CE858dc72C56Ba0F0a475168B3E4b7";

/// OTHER CONFIG
export const WALLETCONNECT_VERSION = 1;
export const PROJECT_ID = process.env.PROJECT_ID as string;
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

/// Walletconnect theme
export const themeVariables = {
  "--w3m-accent-color": "#fff",
  "--w3m-accent-fill-color": "#000",
};
