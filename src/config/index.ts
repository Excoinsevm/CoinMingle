/// Mainnet Chain
import { bitrock } from "../chains";
export const chains = [
  {
    ...bitrock,
    rpcUrls: {
      default: {
        http: ["https://connect.bit-rock.io/"],
      },
      public: {
        http: ["https://connect.bit-rock.io/"],
      },
    },
  },
];
export const ACTIVE_CHAIN = fantom;
export const EXPLORER = "https://explorer.bit-rock.io";
export const CoinMingleRouter = "0x28011841A9E8D782a3B58da3e757fc939cca84B3";
export const WFTM = "0x413f0e3a440aba7a15137f4278121450416882d5";

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
