import { ACTIVE_CHAIN, CoinMingleRouter, EXPLORER, WFTM } from "@config";
import { useToken, useContractRead } from "wagmi";
import CM_ROUTER from "@abis/Router.json";
import CM_LP from "@abis/LP.json";
import { ITokens } from "@types";
import Image from "next/image";
import { FC, memo } from "react";
import { formatToken, parseToken } from "@utils";
import { BsBoxArrowUpRight } from "react-icons/bs";
import Link from "next/link";

const PairView: FC<ITokens> = ({ tokenA, tokenB }) => {
  /** @dev Read tokenA data */
  const { data: tokenA_data } = useToken({
    address: tokenA.address as `0x`,
    chainId: ACTIVE_CHAIN.id,
  });

  /** @dev Read tokenB data */
  const { data: tokenB_data } = useToken({
    address: tokenB.address as `0x`,
    chainId: ACTIVE_CHAIN.id,
  });

  /** @dev Getting the pair address */
  const { data: pairAddress } = useContractRead({
    address: CoinMingleRouter as `0x`,
    abi: CM_ROUTER.abi,
    functionName: "getPair",
    args: [tokenA.address, tokenB.address],
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
    watch: true,
  });

  /** @dev Getting the reserves */
  const { data: reservesAmounts, isFetched: reservesFetched } = useContractRead(
    {
      address: pairAddress as `0x`,
      abi: CM_LP.abi,
      functionName: "getReserves",
      watch: true,
      enabled: pairAddress ? true : false,
    }
  );

  return (
    <div className="w-full px-8 flex justify-between items-center min-h-32 py-5 bg-slate-900 bg-opacity-5 backdrop-blur-xl rounded-xl hover:border hover:border-slate-300">
      <div className="">
        <div className="flex gap-1 text-md">
          <div className="flex items-center">
            <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
            <h1 className="text-bold">
              {tokenA.address === WFTM ? "FTM" : tokenA_data?.symbol}
            </h1>
          </div>
          <p>/</p>
          <div className="flex items-center">
            <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
            <h1 className="text-bold">
              {tokenB.address === WFTM ? "FTM" : tokenB_data?.symbol}
            </h1>
          </div>
        </div>
        <p className="text-sm mt-1 text-white font-medium">
          Rate :{" "}
          {isPerTokenFetched && tokenA_data && tokenB_data
            ? parseFloat(
                formatToken(
                  perTokenOut as BigInt,
                  tokenB_data?.decimals
                )!.toString()
              ).toFixed(2)
            : "0"}{" "}
          {tokenB.address === WFTM ? "FTM" : tokenB_data?.symbol} /{" "}
          {tokenA.address === WFTM ? "FTM" : tokenA_data?.symbol}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm">Reserve</p>
        {reservesFetched && typeof reservesAmounts !== "undefined" ? (
          <p className="text-lg font-medium">
            {parseFloat(
              formatToken(
                // @ts-ignore
                tokenA.address === WFTM
                  ? // @ts-ignore
                    (reservesAmounts[1] as BigInt)
                  : // @ts-ignore
                    (reservesAmounts[0] as BigInt),
                tokenA_data?.decimals
              )!.toString()
            ).toFixed(2)}
          </p>
        ) : (
          <p className="text-lg">0</p>
        )}
      </div>
      <div className="">
        <div className="flex flex-col items-center">
          <p className="text-sm">Reserve</p>
          {reservesFetched && typeof reservesAmounts !== "undefined" ? (
            <p className="text-lg font-medium">
              {parseFloat(
                formatToken(
                  tokenA.address === WFTM
                    ? // @ts-ignore
                      (reservesAmounts[0] as BigInt)
                    : // @ts-ignore
                      (reservesAmounts[1] as BigInt),
                  tokenB_data?.decimals
                )!.toString()
              ).toFixed(2)}
            </p>
          ) : (
            <p className="text-lg">0</p>
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
