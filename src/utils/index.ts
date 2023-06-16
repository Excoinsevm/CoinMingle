import { formatUnits, parseUnits } from "viem";

export const formatToken = (
  amount: BigInt | undefined,
  decimals: number | undefined
) => {
  return amount && Number(amount) > 0
    ? decimals && formatUnits(BigInt(amount.toString()), decimals)
    : 0;
};

export const parseToken = (
  amount: string | undefined,
  decimals: number | undefined
) => {
  return amount && decimals && parseUnits(`${Number(amount)}`, decimals);
};
