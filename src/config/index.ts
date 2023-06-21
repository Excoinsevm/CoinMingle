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
export const CoinMingleRouter = "0x079D6fDBA5ee8C9d8304276DFd4cfd890cB5f1Ad";
export const WFTM = "0x812666209b90344ec8e528375298ab9045c2bd08";

/// OTHER CONFIG
export const WALLETCONNECT_VERSION = 1;
export const PROJECT_ID = process.env.PROJECT_ID as string;
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const POOL_PATH = "/api/pool";

/// Walletconnect theme
export const themeVariables = {
  "--w3m-accent-color": "#fff",
  "--w3m-accent-fill-color": "#000",
  "--w3m-text-medium-regular-size": "0.8rem",
};
