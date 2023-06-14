"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useWaitForTransaction, useWalletClient } from "wagmi";
import { Interface, concat, hexlify } from "ethers/lib/utils";
import { toast, ToastContainer } from "react-toastify";
import { TransactionReceipt } from "viem";
import { EXPLORER } from "@config";
import Token from "@abis/token.json";

export default function CreateERC20() {
  const [deployedData, setDeployedData] = useState<`0x${string}`>();
  const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(
    null
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    supply: 10000,
  });

  const { data: walletClient } = useWalletClient();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onReceipt = async (data: TransactionReceipt) => {
    setContractAddress(data.contractAddress);
    toast.success(`Deployed :)`);
    toast.success(
      <a
        target="_blank"
        href={`${EXPLORER}/address/${data.contractAddress}`}
        className="underline"
      >
        {data.contractAddress}
      </a>,
      {
        autoClose: false,
      }
    );
  };

  const onError = async (err: Error) => {
    toast.error(err.message);
  };

  const onSubmit = async (e: FormEvent) => {
    setIsDeploying(true);
    const loadingTost = toast.loading(
      `Creating ${tokenData.name} Token (ERC20)...`
    );
    e.preventDefault();
    try {
      const iface = new Interface(Token.abi);
      const params = iface.encodeDeploy([
        tokenData.name,
        tokenData.symbol,
        tokenData.decimals || 18,
        tokenData.supply || 10000,
      ]);
      const tx = await walletClient?.sendTransaction({
        // @ts-ignore
        data: hexlify(concat([Token.bytecode, params])),
      });
      setDeployedData(tx);
      setTokenData({
        name: "",
        symbol: "",
        decimals: 18,
        supply: 10000,
      });
    } catch (e: any) {
      onError(e);
    } finally {
      setIsDeploying(false);
      toast.dismiss(loadingTost);
    }
  };

  /// Waiting for tx to mine
  const { isFetching } = useWaitForTransaction({
    hash: deployedData,
    onSuccess: onReceipt,
    onError,
  });

  return (
    <div className="flex flex-col h-full justify-center text-center text-black">
      <header>
        <h1 className="text-3xl font-semibold">Create ERC20 Token</h1>
        <p className="text-md mt-4 w-[85%] md:w-[70%] lg:w-[60%] m-auto">
          Create our own{" "}
          <span className="font-semibold text-slate-700">ERC20</span> tokens on
          the <span className="font-semibold text-slate-700">FANTOM</span>{" "}
          network. This feature can be valuable for launching new projects or
          enhancing liquidity by introducing new tokens.
        </p>
        <div className="pt-20">
          {contractAddress && (
            <a
              target="_blank"
              href={`${EXPLORER}/address/${contractAddress}`}
              className="underline"
            >
              Contract: {contractAddress}
            </a>
          )}
        </div>
      </header>
      <div className="pt-10 p-12 md:w-[85%] lg:w-[75%] md:self-center">
        <form onSubmit={onSubmit} className="flex flex-col gap-12">
          <div className="flex flex-col justify-center items-start">
            <label htmlFor="#name" className="text-black font-medium">
              Name
            </label>
            <input
              type="text"
              placeholder="Coin Mingle"
              id="name"
              name="name"
              className="w-full h-10 px-4 bg-transparent border-b-2 transition-all focus:border-b-green-500 outline-none"
              onChange={(e) => onChange(e)}
              value={tokenData.name}
              required
            />
          </div>

          <div className="flex flex-col justify-center items-start">
            <label htmlFor="#symbol" className="text-black font-medium">
              Symbol
            </label>
            <input
              type="text"
              id="symbol"
              placeholder="COM"
              className="w-full h-10 px-4 bg-transparent border-b-2 transition-all focus:border-b-green-500 outline-none"
              onChange={(e) => onChange(e)}
              name="symbol"
              value={tokenData.symbol}
              required
            />
          </div>
          <div className="flex flex-col justify-center items-start">
            <label htmlFor="#decimals" className="text-black font-medium">
              Decimals
            </label>
            <input
              type="number"
              id="decimals"
              placeholder="18"
              min={1}
              max={18}
              className="w-full h-10 px-4 bg-transparent border-b-2 transition-all focus:border-b-green-500 outline-none"
              onChange={(e) => onChange(e)}
              name="decimals"
              value={tokenData.decimals}
              required
            />
          </div>
          <div className="flex flex-col justify-center items-start">
            <label htmlFor="#supply" className="text-black font-medium">
              Initial Supply
            </label>
            <input
              type="number"
              id="supply"
              placeholder="10000"
              min={10000}
              className="w-full h-10 px-4 bg-transparent border-b-2 transition-all focus:border-b-green-500 outline-none"
              onChange={(e) => onChange(e)}
              name="supply"
              value={tokenData.supply}
              required
            />
          </div>
          <div className="w-full">
            <button
              disabled={isDeploying || isFetching}
              type="submit"
              className="w-80 h-16 rounded-xl bg-white disabled:opacity-40"
            >
              {isDeploying
                ? "Deploying..."
                : isFetching
                ? "Waiting..."
                : "Create"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
