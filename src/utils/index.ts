import { formatUnits } from "viem";

export const formatToken = (
  amount: BigInt | undefined,
  decimals: number | undefined
) => {
  return amount && Number(amount) > 0
    ? decimals && formatUnits(BigInt(amount.toString()), decimals)
    : 0;
};
