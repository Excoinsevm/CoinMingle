import { DB_PAIRS_PATH, DB_TOKENS_PATH } from "@config";
import { IPoolPost, IToken, ITokens } from "@types";
import { NextResponse } from "next/server";
import { readFileSync } from "fs";

const getPath = (swap: IPoolPost) => {
  let count = 0;
  const path = [swap.tokenA];
  const content = [];

  try {
    /** @dev If Token not available */
    const tokens: IToken[] = JSON.parse(
      readFileSync(DB_TOKENS_PATH).toString()
    );

    const isTokenA_available = tokens.find((pool) => {
      return swap.tokenA === pool.address;
    });

    const tokenB_Available = tokens.find((pool) => {
      return swap.tokenB === pool.address;
    });

    if (!isTokenA_available || !tokenB_Available) {
      return {
        path: [],
        content: [],
      };
    }

    /** @dev Finding path */
    const pools: ITokens[] = JSON.parse(readFileSync(DB_PAIRS_PATH).toString());

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
    /** @dev Getting all the Pairs available */
    const pairs: IToken[] = JSON.parse(readFileSync(DB_PAIRS_PATH).toString());
    return NextResponse.json({
      pairs,
    });
  } catch (e) {
    return NextResponse.json({});
  }
};

export const POST = async (req: Request) => {
  const body: IPoolPost = await req.json();
  const path = getPath(body);
  return NextResponse.json({
    ...path,
  });
};
