/// Mainnet Chain
import { fantom } from "wagmi/chains";
export const chains = [fantom];
export const ACTIVE_CHAIN = fantom;
export const EXPLORER = "https://ftmscan.com";
export const CoinMingleRouter = "0xdAF48C05573B92F2B50d75E9A0Db91F5B83Ca359";
export const WFTM = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";

/// Testnet Chain
// import { fantomTestnet } from "wagmi/chains";
// export const chains = [fantomTestnet];
// export const ACTIVE_CHAIN = fantomTestnet;
// export const EXPLORER = "https://testnet.ftmscan.com";
// export const CoinMingleRouter = "0x6B37410133cDC3365fFd80008b6C1040Db83a04f";
// export const WFTM = "0x812666209b90344ec8e528375298ab9045c2bd08";

/// OTHER CONFIG
export const PROJECT_ID = "ab3bbfc86a151e76c8aac6bbaea9ccf8";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const POOL_PATH = "/api/pool";

/// Walletconnect theme
export const themeVariables = {
  "--w3m-accent-color": "#fff",
  "--w3m-accent-fill-color": "#000",
  "--w3m-text-medium-regular-size": "0.8rem",
};
