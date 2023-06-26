"use client";
import { memo, useEffect, useState } from "react";
import { ITokens } from "@types";
import { getAllPairs } from "@db";
import { toast, Toaster } from "react-hot-toast";
import PairView from "@components/client/PairView";

const Market = () => {
  const [allPairs, setAllPairs] = useState<ITokens[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const loading = toast.loading("Hold On! We are fetching...");
        const pairs = await getAllPairs();
        setAllPairs(pairs);
        toast.dismiss(loading);
      } catch (e: any) {
        toast.error(e);
      }
    })();
  }, []);

  return (
    <div className="w-[90%] lg:w-[60%] py-20 flex flex-col items-center">
      <h1 className="mb-10 text-lg font-medium underline">Market Overview</h1>
      <div className="overflow-y-scroll h-[32rem] w-full flex flex-col items-center gap-5 hide-scroll">
        {allPairs ? (
          allPairs.map((pair: ITokens, i: number) => (
            <PairView key={i} tokenA={pair.tokenA} tokenB={pair.tokenB} />
          ))
        ) : (
          <div className="h-[90%] flex items-center justify-center">
            <h1>No pair available</h1>
          </div>
        )}
      </div>
      <Toaster containerClassName="text-sm" />
    </div>
  );
};

export default memo(Market);
