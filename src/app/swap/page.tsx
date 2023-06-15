"use client";
import { ACTIVE_CHAIN } from "@config";
import { formatToken } from "@utils";
import { FormEvent, useState } from "react";
import { erc20ABI, useAccount, useContractReads, useToken } from "wagmi";

export default function Swap() {
  const [activeToken, setActiveToken] = useState({
    tokenA: "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7",
    tokenB: "0xC02C2EB530D6349F267BC9e6C7077603874131B2",
  });

  const { address, isConnected } = useAccount();
  /** @dev Read tokenA data */
  const { data: tokenA_data } = useToken({
    address: activeToken.tokenA as `0x`,
    chainId: ACTIVE_CHAIN.id,
    enabled: isConnected,
  });
  /** @dev Read tokenB data */
  const { data: tokenB_data } = useToken({
    address: activeToken.tokenB as `0x`,
    chainId: ACTIVE_CHAIN.id,
    enabled: isConnected,
  });

  /** @dev Fetching the balances of selected token */
  const { data: balanceOf, isFetched: isBalanceFetched } = useContractReads({
    contracts: [
      {
        address: activeToken.tokenA as `0x`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address as `0x`],
      },
      {
        address: activeToken.tokenB as `0x`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address as `0x`],
      },
    ],
    watch: true,
  });

  const reverseSwap = () => {
    setActiveToken((prev) => ({
      tokenA: prev.tokenB,
      tokenB: prev.tokenA,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="justify-evenly flex flex-col gap-16">
      <header className="text-center flex flex-col gap-4">
        <h1 className="text-2xl">Swap</h1>
        <p className="text-md text-slate-300 max-w-xl text-center">
          Users can easily exchange one token for another directly through the
          smart contract. The swap feature calculates the conversion rate based
          on the available liquidity in the AMM pool.
        </p>
      </header>

      <form className="w-[35rem] flex flex-col gap-2" onSubmit={onSubmit}>
        <div className="flex flex-col items-center justify-center gap-2 h-32 px-4 bg-white bg-opacity-20 backdrop-blur-3xl rounded-2xl">
          <div className="flex gap-3 items-center justify-center">
            <input
              type="number"
              placeholder="0"
              name="tokenA"
              className="w-full h-10 px-4 bg-transparent outline-none text-3xl"
              required
            />
            <div className="flex gap-4 justify-center items-center px-5 py-2 cursor-pointer border border-slate-100 rounded-2xl">
              <p className="font-semibold">{tokenA_data?.symbol}</p>
              <p className="text-2xl">&#8650;</p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center px-4 mt-1">
            <div></div>
            {isBalanceFetched && (
              <p className="text-sm text-slate-300">
                Balance:{" "}
                {formatToken(balanceOf?.[0].result, tokenA_data?.decimals)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center cursor-pointer">
          <h1
            className=" w-fit px-5 py-4 text-center text-[1.5rem] bg-white bg-opacity-20 backdrop-blur-3xl rounded-full"
            onClick={reverseSwap}
          >
            &#8693;
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 h-32 px-4 bg-white bg-opacity-20 backdrop-blur-3xl rounded-2xl">
          <div className="flex gap-3 items-center justify-center">
            <input
              type="number"
              placeholder="0"
              name="tokenA"
              className="w-full h-10 px-4 bg-transparent outline-none text-3xl"
              required
            />
            <div className="flex gap-4 justify-center items-center px-5 py-2 cursor-pointer border border-slate-100 rounded-2xl">
              <p className="font-semibold">{tokenB_data?.symbol}</p>
              <p className="text-2xl">&#8650;</p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center px-4 mt-1">
            <div></div>
            {isBalanceFetched && (
              <p className="text-sm text-slate-300">
                Balance:{" "}
                {formatToken(balanceOf?.[1].result, tokenB_data?.decimals)}
              </p>
            )}
          </div>
        </div>

        {isBalanceFetched && (
          <>
            <div className="flex items-center justify-between mt-2 text-sm">
              <p className="flex items-center justify-center text-slate-300">
                1 {tokenB_data?.symbol} = 10.456 {tokenA_data?.symbol}
              </p>
              <p className="flex items-center justify-center text-slate-300">
                Expected Output: 10.456 {tokenB_data?.symbol}
              </p>
            </div>

            <div className="mt-1">
              <p className="">
                {tokenA_data?.symbol} <span>&#8674;</span> {tokenB_data?.symbol}
              </p>
            </div>
          </>
        )}

        <button type="submit" className="btn w-full mt-10">
          Swap
        </button>
      </form>
    </div>
  );
}
