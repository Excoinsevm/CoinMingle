import { ACTIVE_CHAIN, CoinMingleRouter, EXPLORER } from "@config";
import { useAccount, useToken, useContractRead } from "wagmi";
import CM_ROUTER from "@abis/Router.json";
import CM_LP from "@abis/LP.json";
import { ITokens } from "@types";
import Image from "next/image";
import { FC, memo } from "react";
import { formatToken, parseToken } from "@utils";
import { BsBoxArrowUpRight } from "react-icons/bs";
import Link from "next/link";

const PairView: FC<ITokens> = ({ tokenA, tokenB }) => {
  const { isConnected } = useAccount();
  /** @dev Read tokenA data */
  const { data: tokenA_data } = useToken({
    address: tokenA.address as `0x`,
    chainId: ACTIVE_CHAIN.id,
    enabled: isConnected,
  });
  /** @dev Read tokenB data */
  const { data: tokenB_data } = useToken({
    address: tokenB.address as `0x`,
    chainId: ACTIVE_CHAIN.id,
    enabled: isConnected,
  });

  /** @dev Getting the pair address */
  const { data: pairAddress } = useContractRead({
    address: CoinMingleRouter as `0x`,
    abi: CM_ROUTER.abi,
    functionName: "getPair",
    args: [tokenA.address, tokenB.address],
    enabled: isConnected,
  });

  /** @dev Getting Per token Out */
  const { data: perTokenOut, isFetched: isPerTokenFetched } = useContractRead({
    address: CoinMingleRouter as `0x`,
    abi: CM_ROUTER.abi,
    functionName: "getAmountOut",
    args: [
      parseToken("1", tokenA_data?.decimals),
      [tokenA.address, tokenB.address],
    ],
    enabled: isConnected,
    watch: true,
  });

  /** @dev Getting the reserves */
  const { data: reservesAmounts, isFetched: reservesFetched } = useContractRead(
    {
      address: pairAddress as `0x`,
      abi: CM_LP.abi,
      functionName: "getReserves",
      watch: true,
      enabled: isConnected && pairAddress ? true : false,
    }
  );

  return (
    <div className="w-full px-8 flex justify-between items-center min-h-32 py-8 bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-xl transition-all hover:border hover:border-slate-300">
      <div className="">
        <div className="flex gap-1">
          <div className="flex items-center">
            <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
            <h1 className="text-xl text-bold">{tokenA_data?.symbol}</h1>
          </div>
          <p>/</p>
          <div className="flex items-center">
            <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
            <h1 className="text-xl text-bold">{tokenB_data?.symbol}</h1>
          </div>
        </div>
        <p className="text-md mt-1 text-slate-300">
          Rate :{" "}
          {isPerTokenFetched
            ? parseFloat(
                formatToken(
                  perTokenOut as BigInt,
                  tokenB_data?.decimals
                )!.toString()
              ).toFixed(4)
            : "0"}{" "}
          {tokenA_data?.symbol} / {tokenB_data?.symbol}
        </p>
      </div>
      <div className="flex flex-col items-center text-slate-300">
        <p className="text-sm">Reserve</p>
        {reservesFetched && typeof reservesAmounts !== "undefined" ? (
          <p className="text-xl">
            {Number(
              formatToken(
                // @ts-ignore
                reservesAmounts[0] as BigInt,
                tokenA_data?.decimals
              )
            ).toLocaleString()}
          </p>
        ) : (
          <p className="text-xl">0</p>
        )}
      </div>
      <div className="">
        <div className="flex flex-col items-center text-slate-300">
          <p className="text-sm">Reserve</p>
          {reservesFetched && typeof reservesAmounts !== "undefined" ? (
            <p className="text-xl">
              {Number(
                formatToken(
                  // @ts-ignore
                  reservesAmounts[1] as BigInt,
                  tokenB_data?.decimals
                )
              ).toLocaleString()}
            </p>
          ) : (
            <p className="text-xl">0</p>
          )}
        </div>
      </div>
      <Link
        href={`${EXPLORER}/address/${pairAddress}`}
        target="_blank"
        title="Visit pair contract address"
      >
        <BsBoxArrowUpRight className="text-xl" />
      </Link>
    </div>
  );
};

export default memo(PairView);
