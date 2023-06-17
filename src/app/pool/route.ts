import { IPoolPost } from "@types";
import { NextResponse } from "next/server";

const allPools = [
  {
    tokenA: "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7", // PST
    tokenB: "0xC02C2EB530D6349F267BC9e6C7077603874131B2", // RAJ
  },
  {
    tokenA: "0xC02C2EB530D6349F267BC9e6C7077603874131B2", // RAJ
    tokenB: "0xa79465a58A098E17a44AB2E651371c8c8Cb47189", // iOS
  },
];

const getPath = (swap: IPoolPost, Pools: IPoolPost[]) => {
  let count = 0;
  const path = [swap.tokenA];

  while (true) {
    if (count == 1 && path.length == 1) return [];
    for (const pair of Pools) {
      if (path[0] === swap.tokenA && path[path.length - 1] === swap.tokenB)
        return path;

      if (pair.tokenA === path[path.length - 1]) {
        path.push(pair.tokenB);
      } else if (pair.tokenB === path[path.length - 1]) {
        path.push(pair.tokenA);
      }
    }
    count++;
  }
};

export const POST = async (req: Request) => {
  const body: IPoolPost = await req.json();
  const path = getPath(body, allPools);
  return NextResponse.json({
    path,
  });
};
