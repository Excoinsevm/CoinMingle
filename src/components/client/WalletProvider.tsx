"use client";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { ReactNode, memo, useState, useEffect } from "react";
import {
  PROJECT_ID,
  WALLETCONNECT_VERSION,
  chains,
  themeVariables,
} from "@config";

/// Initializing publicClient
const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: PROJECT_ID }),
]);
/// Initializing wagmiConfig
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: PROJECT_ID,
    version: WALLETCONNECT_VERSION,
    chains,
  }),
  publicClient,
});

/// Initializing ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

/// Interface Props
interface IProps {
  children: ReactNode;
}

/// Return the main walletconnect provider.
const WalletProvider = ({ children }: IProps) => {
  /// Handling Hydration error.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
      <Web3Modal
        themeMode="dark"
        themeVariables={themeVariables}
        projectId={PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </WagmiConfig>
  );
};
export default memo(WalletProvider);
