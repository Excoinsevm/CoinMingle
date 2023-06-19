import { Schema, model, models, Model } from "mongoose";
import { ITokens } from "@types";

const TokensSchema = new Schema<ITokens>({
  tokenA: {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 42,
      minlength: 42,
    },
  },
  tokenB: {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 42,
      minlength: 42,
    },
  },
});

export const Pair =
  (models.Pair as Model<ITokens>) || model<ITokens>("Pair", TokensSchema);
