import { NextRequest } from "next/server";
import { ILiquidity } from "@types";
import { isAddress } from "viem";
import { Liquidity } from "@models/Liquidity";
import { connectToDB } from "@utils/dbConnect";

interface IContext {
  params: {
    address: string;
  };
}
export const GET = async (_: NextRequest, context: IContext) => {
  if (!isAddress(context.params.address)) {
    return new Response("Invalid Address", { status: 404 });
  }

  try {
    await connectToDB();

    /** @dev Getting all the Positions of the user */
    const positions = await Liquidity.findOne({
      address: context.params.address,
    });

    return new Response(
      JSON.stringify({
        positions,
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request, context: IContext) => {
  if (!isAddress(context.params.address)) {
    return new Response("Invalid Address", { status: 404 });
  }

  const body: ILiquidity = await req.json();

  try {
    await connectToDB();

    /** @dev Checking if user present */
    const provider = await Liquidity.findOne({
      address: context.params.address,
    });

    /** @dev If not present */
    if (!provider) {
      const provider = new Liquidity({
        address: context.params.address,
        liquidities: [body],
      });
      await provider.save();
    } else {
      /** @dev If provider present */
      await Liquidity.findOneAndUpdate(
        { address: context.params.address },
        {
          $push: {
            liquidities: body,
          },
        }
      );
    }

    return new Response("Success", { status: 201 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
