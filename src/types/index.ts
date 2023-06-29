export interface ILiquidity {
  tokens: {
    tokenA: string;
    tokenB: string;
  };
  amounts: {
    tokenA: number;
    tokenB: number;
  };
}

export interface ILiquidities {
  address: string;
  liquidities: ILiquidity[];
}

export interface IToken {
  address: string;
  name: string;
  symbol: string;
}

export interface ITokens {
  tokenA: IToken;
  tokenB: IToken;
}

export interface IPoolPost {
  tokenA: string;
  tokenB: string;
}
