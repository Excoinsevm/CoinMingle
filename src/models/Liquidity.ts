import { ILiquidities } from "@types";
import { Schema, model, models, Model } from "mongoose";

const LiquiditySchema = new Schema<ILiquidities>({
  address: {
    type: String,
    unique: true,
    required: true,
    minlength: 42,
    maxlength: 42,
  },
  liquidities: [
    {
      tokens: {
        tokenA: {
          type: String,
          required: true,
          minlength: 42,
          maxlength: 42,
        },
        tokenB: {
          type: String,
          required: true,
          minlength: 42,
          maxlength: 42,
        },
      },

      amounts: {
        tokenA: {
          type: Number,
          required: true,
        },
        tokenB: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

export const Liquidity =
  (models.Liquidity as Model<ILiquidities>) ||
  model<ILiquidities>("Liquidity", LiquiditySchema);
