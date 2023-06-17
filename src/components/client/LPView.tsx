"use client";
import { FormEvent, useState, ChangeEvent, memo, FC } from "react";
import {
  useAccount,
  useToken,
  useNetwork,
  useSwitchNetwork,
  useContractRead,
  erc20ABI,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { formatEther, parseEther, TransactionReceipt } from "viem";
import { ACTIVE_CHAIN, CoinMingleRouter, EXPLORER, WFTM } from "@config";
import { parseToken, formatToken } from "@utils";
import { Toaster, toast } from "react-hot-toast";
import CM_ROUTER from "@abis/Router.json";
import CM_LP from "@abis/LP.json";
import Image from "next/image";

interface ILPViewProps {
  tokens: {
    tokenA: string;
    tokenB: string;
  };
  amounts: {
    tokenA: string;
    tokenB: string;
  };
}

const LPView: FC<ILPViewProps> = ({ tokens, amounts }) => {
  const [fullView, setFullView] = useState(false);
  const [lpAmount, setLpAmount] = useState<string>("");

  const { address, isConnected } = useAccount();
  /** @dev switching chain if not connected to ftm */
  const { chain: connectedChain } = useNetwork();
  const { isLoading: isSwitchingChain, switchNetworkAsync } = useSwitchNetwork({
    chainId: ACTIVE_CHAIN.id,
  });
  /** @dev Read tokenA data */
  const { data: tokenA_data } = useToken({
    address: tokens.tokenA as `0x`,
    chainId: ACTIVE_CHAIN.id,
    enabled: isConnected,
  });
  /** @dev Read tokenB data */
  const { data: tokenB_data } = useToken({
    address: tokens.tokenB as `0x`,
    chainId: ACTIVE_CHAIN.id,
    enabled: isConnected,
  });

  /** @dev Getting Per token Out */
  const { data: perTokenOut } = useContractRead({
    address: CoinMingleRouter as `0x`,
    abi: CM_ROUTER.abi,
    functionName: "getAmountOut",
    args: [
      parseToken("1", tokenA_data?.decimals),
      [tokens.tokenA, tokens.tokenB],
    ],
    enabled: isConnected,
    watch: true,
  });

  /** @dev Getting the pair address */
  const { data: pairAddress } = useContractRead({
    address: CoinMingleRouter as `0x`,
    abi: CM_ROUTER.abi,
    functionName: "getPair",
    args: [tokens?.tokenA, tokens?.tokenB],
    enabled: isConnected,
  });

  /** @dev Fetching the balances LP token */
  const { data: balanceOf, isFetched: balanceOfFetched } = useContractRead({
    address: pairAddress as `0x`,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address as `0x`],
    enabled: isConnected && pairAddress ? true : false,
    watch: true,
  });

  /** @dev Fetching the balances of selected token */
  const { data: tokenARead } = useContractRead({
    address: pairAddress as `0x`,
    // @ts-ignore
    abi: CM_LP.abi,
    functionName: "tokenA",
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

  /** @dev Getting the Out amount */
  const {
    data: amountsOut,
    isFetched: amountsOutFetched,
    isFetching: isAmountsOutFetching,
  } = useContractRead({
    address: CoinMingleRouter as `0x`,
    abi: CM_ROUTER.abi,
    functionName: "getAmountsOutForLiquidity",
    args: [
      // @ts-ignore
      parseEther(lpAmount as "0") <= balanceOf
        ? parseEther(lpAmount as "0")
        : 0,
      tokens.tokenA,
      tokens.tokenB,
    ],
    watch: true,
    enabled: isConnected && pairAddress ? true : false,
  });

  /** @dev Getting Approvals */
  const { data: approval } = useContractRead({
    address: pairAddress as "0x",
    abi: erc20ABI,
    functionName: "allowance",
    args: [address as "0x", CoinMingleRouter],
    enabled: isConnected,
    watch: true,
  });

  /** @dev Give approval if not available */
  const {
    data: approvalData,
    isLoading: isApproving,
    writeAsync: giveApproval,
  } = useContractWrite({
    address: pairAddress as "0x",
    abi: erc20ABI,
    functionName: "approve",
    args: [CoinMingleRouter, balanceOf!],
  });

  /** @dev Removing liquidity */
  const {
    data: removeLiquidityHash,
    writeAsync: removeLiquidity,
    isLoading: isRemovingLiquidity,
  } = useContractWrite({
    address: CoinMingleRouter,
    abi: CM_ROUTER.abi,
    functionName: "removeLiquidity",
    args: [
      tokens.tokenA,
      tokens.tokenB,
      parseEther(lpAmount as "0"),
      address,
      Math.round(+new Date() / 1000) + 300,
    ],
  });

  /** @dev Removing liquidity FTM */
  const {
    data: removeLiquidityFTMHash,
    writeAsync: removeLiquidityFTM,
    isLoading: isRemovingLiquidityFTM,
  } = useContractWrite({
    address: CoinMingleRouter,
    abi: CM_ROUTER.abi,
    functionName: "removeLiquidityFTM",
    args: [
      tokens.tokenA === WFTM ? tokens.tokenB : tokens.tokenA,
      parseEther(lpAmount as "0"),
      address,
      Math.round(+new Date() / 1000) + 300,
    ],
  });

  const toggle = () => {
    setFullView((prev) => !prev);
  };

  /** @dev Handling onTransactionError */
  const onError = async (err: Error) => {
    toast.error(err.name);
    console.log(err);
  };
  /** @dev Handling onTransactionReceipt (MINE) */
  const onReceipt = async (data: TransactionReceipt) => {
    toast.success(
      <a
        target="_blank"
        href={`${EXPLORER}/tx/${data.transactionHash}`}
        className="underline"
      >
        View Transaction
      </a>,
      {
        duration: 10000,
      }
    );
  };

  /** @dev Waiting for tx to mine */
  const { isFetching } = useWaitForTransaction({
    hash:
      removeLiquidityHash?.hash ||
      removeLiquidityFTMHash?.hash ||
      approvalData?.hash,
    onSuccess: onReceipt,
    onError,
  });

  /** @dev Handling form changing event */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const match = /^\d*\.?\d*$/.test(e.target.value);
    if (match && e.target.value.length <= 21) {
      setLpAmount(() => e.target.value);
    }
  };

  /** @dev Remove Liquidity handler */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    /** @dev If wallet is not connected then return with error */
    if (!isConnected) {
      toast.error(`Connect wallet first.`);
      return;
    }

    /** @dev Switching chain if correct chain is not connected */
    if (connectedChain?.id != ACTIVE_CHAIN.id) {
      const loadingToast = toast.loading("Switching to FTM...");
      try {
        switchNetworkAsync && (await switchNetworkAsync());
        toast.success("Switched");
      } catch (e: any) {
        onError(e);
      } finally {
        toast.dismiss(loadingToast);
      }
      return;
    }

    /// Taking approval if not available
    if (approval! < parseEther(lpAmount! as "0")) {
      const loadingToast = toast.loading("Approving...");
      try {
        await giveApproval();
        toast.success("Approved");
      } catch (e: any) {
        onError(e);
      } finally {
        toast.dismiss(loadingToast);
      }
      return;
    }

    try {
      if (tokens.tokenA === WFTM || tokens.tokenB === WFTM) {
        await removeLiquidityFTM();
      } else {
        await removeLiquidity();
      }
      toast.success("Removed");
    } catch (e: any) {
      onError(e);
    } finally {
      setLpAmount("");
    }
  };

  return (
    <div
      className="w-full min-h-32 p-4 py-8 flex flex-col gap-5 bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-xl transition-all hover:border hover:border-slate-300 cursor-pointer"
      onClick={toggle}
    >
      <div className="flex justify-around items-center">
        <div className="">
          <div className="flex gap-1">
            <div className="flex items-center">
              <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
              <h1 className="text-xl text-bold">
                {tokens.tokenA === WFTM ? "FTM" : tokenA_data?.symbol}
              </h1>
            </div>
            <p>/</p>
            <div className="flex items-center">
              <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
              <h1 className="text-xl text-bold">
                {tokens.tokenB === WFTM ? "FTM" : tokenB_data?.symbol}
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Rate : {formatToken(perTokenOut as BigInt, tokenB_data?.decimals)}{" "}
            {tokens.tokenB === WFTM ? "FTM" : tokenB_data?.symbol}/
            {tokens.tokenA === WFTM ? "FTM" : tokenA_data?.symbol}
          </p>
        </div>
        <div className="">
          <h1 className="text-lg">
            {Number(amounts.tokenA).toLocaleString()}{" "}
            {tokens.tokenA === WFTM ? "FTM" : tokenA_data?.symbol}
          </h1>
          {
            // @ts-ignore
            typeof reservesAmounts && reservesFetched && (
              <p className="text-sm text-slate-300">
                Reserve :{" "}
                {reservesFetched &&
                  formatToken(
                    // @ts-ignore
                    tokenARead === tokens.tokenA
                      ? // @ts-ignore
                        reservesAmounts[0] || 0
                      : // @ts-ignore
                        reservesAmounts[1] || 0,
                    tokenA_data?.decimals
                  )}
              </p>
            )
          }
        </div>
        <div className="">
          <h1 className="text-lg">
            {Number(amounts.tokenB).toLocaleString()}{" "}
            {tokens.tokenB === WFTM ? "FTM" : tokenB_data?.symbol}
          </h1>
          {typeof reservesAmounts && reservesFetched && (
            <p className="text-sm text-slate-300">
              Reserve :{" "}
              {reservesFetched &&
                formatToken(
                  // @ts-ignore
                  tokenARead === tokens.tokenA
                    ? // @ts-ignore
                      reservesAmounts[1] || 0
                    : // @ts-ignore
                      reservesAmounts[0] || 0,
                  tokenB_data?.decimals
                )}
            </p>
          )}
        </div>
      </div>
      {fullView && (
        <div className="flex gap-10 pt-4 px-6 justify-around items-center border-t border-white border-opacity-30">
          <div className="flex flex-col w-1/2">
            <p className="text-md text-slate-300">
              LP Available :{" "}
              {balanceOfFetched &&
                //@ts-ignore
                formatEther(balanceOf).toString()}
            </p>
            <div className="">
              <h1 className="text-lg underline underline-offset-2 mt-4 mb-3">
                Expected Output
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
                  <h1 className="text-xl text-bold">
                    {tokens.tokenA === WFTM ? "FTM" : tokenA_data?.symbol}
                  </h1>
                </div>
                <p>
                  {amountsOutFetched &&
                    formatToken(
                      // @ts-ignore
                      tokenARead === tokens.tokenA
                        ? // @ts-ignore
                          amountsOut
                          ? // @ts-ignore
                            amountsOut[0]
                          : 0
                        : // @ts-ignore
                        amountsOut
                        ? // @ts-ignore
                          amountsOut[1]
                        : 0,
                      tokenA_data?.decimals
                    )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src={"/ftm-logo.svg"} alt="" width={20} height={20} />
                  <h1 className="text-xl text-bold">
                    {tokens.tokenB === WFTM ? "FTM" : tokenB_data?.symbol}
                  </h1>
                </div>
                <p>
                  {
                    //@ts-ignore
                    amountsOutFetched &&
                      formatToken(
                        // @ts-ignore
                        tokenARead === tokens.tokenA
                          ? // @ts-ignore
                            amountsOut
                            ? // @ts-ignore
                              amountsOut[1]
                            : 0
                          : // @ts-ignore
                          amountsOut
                          ? // @ts-ignore
                            amountsOut[0]
                          : 0,
                        tokenB_data?.decimals
                      )
                  }
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="w-1/2">
            <div className="flex items-center gap-5 border rounded-xl px-4">
              <input
                type="text"
                placeholder="LP amount"
                className={`${
                  isAmountsOutFetching && "border-red-500"
                } transition-all w-full h-12 outline-none bg-transparent placeholder:text-slate-300`}
                required
                autoFocus
                // @ts-ignore
                value={lpAmount}
                onChange={onChange}
                onClick={(e) => e.stopPropagation()}
              />
              <p
                className="cursor-pointer border-l pl-3"
                onClick={(e) => {
                  e.stopPropagation();
                  // @ts-ignore
                  setLpAmount(formatEther(balanceOf));
                }}
              >
                Max
              </p>
            </div>
            <button
              type="submit"
              className="btn h-12 w-full mt-3 text-sm"
              onClick={(e) => e.stopPropagation()}
              disabled={
                balanceOf === 0n ||
                isApproving ||
                isRemovingLiquidity ||
                isRemovingLiquidityFTM ||
                isSwitchingChain ||
                isFetching
              }
            >
              {balanceOf === 0n
                ? "No LP available"
                : isApproving
                ? "Approving"
                : isSwitchingChain
                ? "Switching Chain..."
                : isFetching
                ? "Waiting for Receipt..."
                : isRemovingLiquidity || isRemovingLiquidityFTM
                ? "Removing Liquidity..."
                : connectedChain!.id !== ACTIVE_CHAIN.id
                ? "Switch to FTM"
                : approval! < balanceOf!
                ? "Approve"
                : "Remove"}
            </button>
          </form>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default memo(LPView);
