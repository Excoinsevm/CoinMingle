export interface ILPAdded {
  tokens: {
    tokenA: string;
    tokenB: string;
  };
  amounts: {
    tokenA: string;
    tokenB: string;
  };
}

export interface IDB {
  [address: string]: ILPAdded[];
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
