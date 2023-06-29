import { Schema, model, models, Model } from "mongoose";
import { IToken } from "@types";

const TokensSchema = new Schema<IToken>({
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
});

export const Token =
  (models.Token as Model<IToken>) || model<IToken>("Token", TokensSchema);
