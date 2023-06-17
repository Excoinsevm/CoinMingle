import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { IDB, ILPAdded } from "@types";
import { DB_PATH } from "@config";

interface IContext {
  params: {
    address: string;
  };
}
export const GET = async (_: NextRequest, context: IContext) => {
  try {
    const DB: IDB = JSON.parse(readFileSync(DB_PATH).toString());
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
    const DB: IDB = JSON.parse(readFileSync(DB_PATH).toString());
    let userPositions = DB[context.params.address];
    if (userPositions) {
      userPositions.push(body);
    } else {
      userPositions = [body];
    }

    const data: IDB = {
      ...DB,
      [context.params.address]: userPositions,
    };
    writeFileSync(DB_PATH, JSON.stringify(data, null, "\t"));
    return NextResponse.json({});
  } catch (e) {
    const data: IDB = {
      [context.params.address]: [body],
    };
    writeFileSync(DB_PATH, JSON.stringify(data, null, "\t"));
    return NextResponse.json({});
  }
};
