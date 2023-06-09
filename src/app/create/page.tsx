"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { TransactionReceipt, parseEther } from "viem";
import { useSendTransaction, useWaitForTransaction } from "wagmi";

export default function CreateERC20() {
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    supply: 10000,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onReceipt = async (data: TransactionReceipt) => {
    console.log(data);
  };

  const onError = async (err: Error) => {
    alert(err.message);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    deployERC20();
  };

  /// Deploying ERC20 token
  const {
    data: deployedData,
    isLoading: isDeploying,
    sendTransaction: deployERC20,
  } = useSendTransaction({
    // data: "0xabc",
    to: "0x5c2E23698eB98cBd12dbaf100227BaF68D1e20fD",
    value: parseEther("0.002"),
    onError,
  });

  /// Waiting for tx to mine
  const { isFetching } = useWaitForTransaction({
    hash: deployedData?.hash,
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
      </header>
      <div className="pt-20 p-12 md:w-[85%] lg:w-[75%] md:self-center">
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
