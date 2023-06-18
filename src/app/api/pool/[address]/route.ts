import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { IDB, ILPAdded } from "@types";
import { DB_LIQUIDITY_PATH } from "@config";

interface IContext {
  params: {
    address: string;
  };
}
export const GET = async (_: NextRequest, context: IContext) => {
  try {
    const DB: IDB = JSON.parse(readFileSync(DB_LIQUIDITY_PATH).toString());
    const positions = DB[context.params.address];
    return NextResponse.json({
      positions,
    });
  } catch (e) {
    return NextResponse.json({});
  }
};

export const POST = async (req: Request, context: IContext) => {
  const body: ILPAdded = await req.json();
  try {
    const DB: IDB = JSON.parse(readFileSync(DB_LIQUIDITY_PATH).toString());
    let userPositions = DB[context.params.address];
    if (userPositions) {
      let alreadyHave = userPositions.find((tx) => {
        return (
          (tx.tokens.tokenA === body.tokens.tokenA ||
            tx.tokens.tokenA === body.tokens.tokenB) &&
          (tx.tokens.tokenB === body.tokens.tokenA ||
            tx.tokens.tokenB === body.tokens.tokenB)
        );
      });

      if (alreadyHave) {
        const index = userPositions.findIndex((tx) => {
          return (
            (tx.tokens.tokenA === body.tokens.tokenA ||
              tx.tokens.tokenA === body.tokens.tokenB) &&
            (tx.tokens.tokenB === body.tokens.tokenA ||
              tx.tokens.tokenB === body.tokens.tokenB)
          );
        });

        alreadyHave = {
          ...alreadyHave,
          amounts: {
            tokenA:
              alreadyHave.tokens.tokenA === body.tokens.tokenA
                ? (
                    Number(alreadyHave.amounts.tokenA) +
                    Number(body.amounts.tokenA)
                  ).toString()
                : (
                    Number(alreadyHave.amounts.tokenA) +
                    Number(body.amounts.tokenB)
                  ).toString(),
            tokenB:
              alreadyHave.tokens.tokenB === body.tokens.tokenB
                ? (
                    Number(alreadyHave.amounts.tokenB) +
                    Number(body.amounts.tokenB)
                  ).toString()
                : (
                    Number(alreadyHave.amounts.tokenB) +
                    Number(body.amounts.tokenA)
                  ).toString(),
          },
        };

        userPositions[index] = alreadyHave;
      } else {
        userPositions.push(body);
      }
    } else {
      userPositions = [body];
    }

    const data: IDB = {
      ...DB,
      [context.params.address]: userPositions,
    };
    writeFileSync(DB_LIQUIDITY_PATH, JSON.stringify(data, null, "\t"));
    return NextResponse.json({});
  } catch (e) {
    const data: IDB = {
      [context.params.address]: [body],
    };
    writeFileSync(DB_LIQUIDITY_PATH, JSON.stringify(data, null, "\t"));
    return NextResponse.json({});
  }
};
