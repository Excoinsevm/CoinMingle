"use client";
import { memo, useEffect, useState } from "react";
import useSWR from "swr";
import { ITokens } from "@types";
import { fetcher } from "@db";
import { toast, Toaster } from "react-hot-toast";
import PairView from "@components/client/PairView";
import { POOL_PATH } from "@config";

const Market = () => {
  const { data: allPairs, error } = useSWR(`${POOL_PATH}`, fetcher);
  if (error) {
    toast.error("Got Error while fetching pairs");
  }

  return (
    <div className="w-[90%] lg:w-[60%] h-[90%] flex flex-col items-center gap-5">
      <h1 className="mb-10 text-2xl font-medium underline">Market Overview</h1>
      <div className="overflow-y-scroll h-full w-full flex flex-col items-center gap-7">
        {allPairs &&
          allPairs.map((pair: ITokens, i: number) => (
            <PairView key={i} tokenA={pair.tokenA} tokenB={pair.tokenB} />
          ))}
      </div>
      <Toaster />
    </div>
  );
};

export default memo(Market);
