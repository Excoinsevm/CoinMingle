import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { IToken, ITokens } from "@types";

export const GET = async () => {
  try {
    const tokens: IToken[] = JSON.parse(
      readFileSync("./src/db/tokens.json").toString()
    );
    return NextResponse.json({
      tokens,
    });
  } catch (e) {
    return NextResponse.json({});
  }
};

export const POST = async (req: Request) => {
  const body: ITokens = await req.json();
  try {
    let allTokens: IToken[] = JSON.parse(
      readFileSync("./src/db/tokens.json").toString()
    );
    const ATokenCount = allTokens.filter(
      (token) => token.address === body.tokenA.address
    ).length;

    const BTokenCount = allTokens.filter(
      (token) => token.address === body.tokenB.address
    ).length;

    if (ATokenCount === 0) {
      allTokens.push(body.tokenA);
    }
    if (BTokenCount === 0) {
      allTokens.push(body.tokenB);
    }

    writeFileSync(
      "./src/db/tokens.json",
      JSON.stringify(allTokens, null, "\t")
    );
    return NextResponse.json({});
  } catch (e) {
    const data: IToken[] = [body.tokenA, body.tokenB];
    writeFileSync("./src/db/tokens.json", JSON.stringify(data, null, "\t"));
    return NextResponse.json({});
  }
};
