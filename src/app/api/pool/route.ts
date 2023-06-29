import { IPoolPost } from "@types";
import { NextResponse } from "next/server";
import { Pair } from "@models/Pair";
import { connectToDB } from "@utils/dbConnect";
import { Token } from "@models/Token";

const getPath = async (swap: IPoolPost) => {
  let count = 0;
  const path = [swap.tokenA];
  const content = [];

  try {
    await connectToDB();

    /** @dev Checking if token available */
    const tokenA_available = await Token.findOne({
      address: swap.tokenA,
    });
    const tokenB_available = await Token.findOne({
      address: swap.tokenB,
    });

    /** @dev If both tokens not available then add both tokens */
    if (!tokenA_available && !tokenB_available) {
      return {
        path: [],
        content: [],
      };
    }

    /** @dev Finding path */
    const pools = await Pair.find({});
    const filtered = pools.find((pool) => {
      return (
        (pool.tokenA.address === swap.tokenA ||
          pool.tokenA.address === swap.tokenB) &&
        (pool.tokenB.address === swap.tokenA ||
          pool.tokenB.address === swap.tokenB)
      );
    });

    if (filtered) {
      path.push(swap.tokenB);
      content.push(
        filtered.tokenA.address === swap.tokenA
          ? filtered.tokenB
          : filtered.tokenA
      );
      return { path, content };
    }

    while (true) {
      if (count >= 1 && path.length === 1) {
        return {
          path: [],
          content: [],
        };
      }

      for (const pair of pools) {
        if (path[0] === swap.tokenA && path[path.length - 1] === swap.tokenB)
          return { path, content };

        if (pair.tokenA.address === path[path.length - 1]) {
          const filtered = path.find((p) => p === pair.tokenB.address);
          if (filtered) {
            path.pop();
            content.pop();
          } else {
            path.push(pair.tokenB.address);
            content.push(pair.tokenB);
          }
        } else if (pair.tokenB.address === path[path.length - 1]) {
          const filtered = path.find((p) => p === pair.tokenA.address);
          if (filtered) {
            path.pop();
            content.pop();
          } else {
            path.push(pair.tokenA.address);
            content.push(pair.tokenA);
          }
        }
      }
      count++;
    }
  } catch (e) {
    return {
      path: [],
      content: [],
    };
  }
};

export const GET = async () => {
  try {
    await connectToDB();
    /** @dev Getting all the Pairs available */
    const pairs = await Pair.find({});
    return new Response(JSON.stringify({ pairs }), { status: 200 });
  } catch (e) {
    return NextResponse.json({});
  }
};

export const POST = async (req: Request) => {
  const body: IPoolPost = await req.json();
  const path = await getPath(body);
  return NextResponse.json({
    ...path,
  });
};
