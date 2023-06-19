import { connectToDB } from "@utils/dbConnect";
import { ITokens } from "@types";
import { WFTM } from "@config";
import { Token } from "@models/Token";
import { Pair } from "@models/Pair";

export const GET = async () => {
  try {
    await connectToDB();

    /** @dev Getting all the tokens */
    const tokens = await Token.find({});
    //@ts-ignore
    tokens.push({
      name: "FTM",
      symbol: "FTM",
      address: WFTM,
    });
    return new Response(JSON.stringify({ tokens }), { status: 200 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const body: ITokens = await req.json();

  try {
    await connectToDB();

    /** @dev Updating tokens */
    const tokenA_available = await Token.findOne({
      address: body.tokenA.address,
    });
    const tokenB_available = await Token.findOne({
      address: body.tokenB.address,
    });

    /** @dev If both tokens not available then add both tokens */
    if (!tokenA_available && !tokenB_available) {
      const newTokenA = new Token(body.tokenA);
      const newTokenB = new Token(body.tokenB);
      await newTokenA.save();
      await newTokenB.save();
    }

    /** @dev If one token not available then add that token */
    if (!tokenA_available || !tokenB_available) {
      if (!tokenA_available) {
        const newTokenA = new Token(body.tokenA);
        await newTokenA.save();
      } else {
        const newTokenB = new Token(body.tokenB);
        await newTokenB.save();
      }
    }

    /** @dev Updating pairs */
    const pairAvailable = await Pair.findOne({
      tokenA: body.tokenA,
      tokenB: body.tokenB,
    });
    const pairReverseAvailable = await Pair.findOne({
      tokenA: body.tokenB,
      tokenB: body.tokenA,
    });

    /** @dev If pair not available */
    if (!pairAvailable && !pairReverseAvailable) {
      const newPair = new Pair(body);
      await newPair.save();
    }

    return new Response("Success", { status: 200 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
