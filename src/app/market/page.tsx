"use client";
import { memo, useEffect, useState } from "react";
import { ITokens } from "@types";
import { getAllPairs } from "@db";
import { toast, Toaster } from "react-hot-toast";
import PairView from "@components/client/PairView";

const Market = () => {
  const [isPairFetched, setIsPairFetched] = useState(false);
  const [pairs, setPairs] = useState<ITokens[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const allPairs = await getAllPairs();
        setPairs(allPairs);
        setIsPairFetched(true);
      } catch (e: any) {
        toast.error(e);
      }
    })();
  }, []);

  return (
    <div className="w-[90%] lg:w-[60%] h-[90%] flex flex-col items-center gap-5">
      <h1 className="mb-10 text-2xl font-medium underline">Market Overview</h1>
      <div className="overflow-y-scroll h-full w-full flex flex-col items-center gap-7">
        {isPairFetched &&
          pairs.map((pair, i) => (
            <PairView key={i} tokenA={pair.tokenA} tokenB={pair.tokenB} />
          ))}
      </div>
      <Toaster />
    </div>
  );
};

export default memo(Market);
