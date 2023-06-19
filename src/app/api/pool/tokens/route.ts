import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { IToken, ITokens } from "@types";
import { DB_PAIRS_PATH, DB_TOKENS_PATH, WFTM } from "@config";

export const GET = async () => {
  try {
    const tokens: IToken[] = JSON.parse(
      readFileSync(DB_TOKENS_PATH).toString()
    );
    tokens.push({
      name: "FTM",
      symbol: "FTM",
      address: WFTM,
    });
    return NextResponse.json({
      tokens,
    });
  } catch (e) {
    return NextResponse.json({});
  }
};

export const POST = async (req: Request) => {
  const body: ITokens = await req.json();

  /** @dev Updating tokens */
  try {
    const allTokens: IToken[] = JSON.parse(
      readFileSync(DB_TOKENS_PATH).toString()
    );

    const tokenA_available = allTokens.find(
      (token) => token.address === body.tokenA.address
    );
    const tokenB_available = allTokens.find(
      (token) => token.address === body.tokenB.address
    );

    if (!tokenA_available || !tokenB_available) {
      !tokenA_available
        ? allTokens.push(body.tokenA)
        : allTokens.push(body.tokenB);

      writeFileSync(DB_TOKENS_PATH, JSON.stringify(allTokens, null, "\t"));
    }
  } catch (e) {
    const data: IToken[] = [body.tokenA, body.tokenB];
    writeFileSync(DB_TOKENS_PATH, JSON.stringify(data, null, "\t"));
  }

  /** @dev Updating pairs */
  try {
    const allPairs: ITokens[] = JSON.parse(
      readFileSync(DB_PAIRS_PATH).toString()
    );

    const pairAvailable = allPairs.find((pair) => {
      return (
        (body.tokenA.address === pair.tokenA.address ||
          body.tokenA.address === pair.tokenB.address) &&
        (body.tokenB.address === pair.tokenA.address ||
          body.tokenB.address === pair.tokenB.address)
      );
    });

    if (!pairAvailable) {
      allPairs.push(body);
      writeFileSync(DB_PAIRS_PATH, JSON.stringify(allPairs, null, "\t"));
    }
  } catch (e) {
    const data: ITokens[] = [body];
    writeFileSync(DB_PAIRS_PATH, JSON.stringify(data, null, "\t"));
  }

  return NextResponse.json({});
};
