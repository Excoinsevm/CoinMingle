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
export const CoinMingleRouter = "0x100175318D8845F68a5D9F311f64334D61189C22";
export const WFTM = "0x812666209b90344ec8e528375298ab9045c2bd08";

/// OTHER CONFIG
export const WALLETCONNECT_VERSION = 1;
export const PROJECT_ID = process.env.PROJECT_ID as string;
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const POOL_PATH = "/api/pool";
export const DB_LIQUIDITY_PATH = "./src/db/liquidity.json";
export const DB_TOKENS_PATH = "./src/db/tokens.json";
export const DB_PAIRS_PATH = "./src/db/pairs.json";

/// Walletconnect theme
export const themeVariables = {
  "--w3m-accent-color": "#fff",
  "--w3m-accent-fill-color": "#000",
};
