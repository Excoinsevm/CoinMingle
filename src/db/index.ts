import { ILPAdded, IPoolPost, IToken, ITokens } from "@types";
import { POOL_PATH } from "@config";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

/** @dev PAIRS */
export const getAllPairs = async (): Promise<ITokens[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${POOL_PATH}`);
      const data = await response.json();
      if (data.pairs) {
        resolve(data.pairs);
      }
      reject("No pair found");
    } catch (e) {
      reject("Internal Server Error while getting tokens.");
    }
  });
};

export const getRoutePath = async (
  tokens: IPoolPost
): Promise<{ path: string[]; content: IToken[] }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${POOL_PATH}`, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokens),
      });
      const data: { path: string[]; content: IToken[] } = await response.json();
      if (data.path.length > 0) {
        resolve(data);
      }
      reject("No pool available");
    } catch (e) {
      reject("Internal Server Error getting route path.");
    }
  });
};

/** @dev TOKENS */
export const getAllTokens = async (): Promise<IToken[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${POOL_PATH}/tokens`);
      const data = await response.json();
      resolve(data.tokens);
    } catch (e) {
      reject("Internal Server Error while getting tokens.");
    }
  });
};

export const updateTokens = async (tokens: ITokens) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${POOL_PATH}/tokens`, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokens),
      });
      await response.json();
      resolve("Successfully Added.");
    } catch (e) {
      reject("Internal Server Error while getting tokens.");
    }
  });
};

/** @dev LIQUIDITY */
export const getUserPositions = async (
  address?: string
): Promise<ILPAdded[]> => {
  return new Promise(async (resolve, reject) => {
    if (!address) reject("No Address Available");

    try {
      const response = await fetch(`${POOL_PATH}/${address}`);
      const data = await response.json();
      resolve(data.positions ? data.positions : []);
    } catch (e) {
      reject("Internal Server Error while updating positions");
    }
  });
};

export const updateUserPosition = async (
  address: string,
  newPosition: ILPAdded
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${POOL_PATH}/${address}`, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPosition),
      });
      await response.json();
      resolve("Successfully Added.");
    } catch (e) {
      reject("Internal Server Error while updating positions");
    }
  });
};
