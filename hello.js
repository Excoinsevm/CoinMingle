console.clear()
const pools = [
    {
        "tokenA": {
            "address": "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7",
            "name": "PreSale Token",
            "symbol": "PST"
        },
        "tokenB": {
            "address": "0xC02C2EB530D6349F267BC9e6C7077603874131B2",
            "name": "Raj Token",
            "symbol": "RAJ"
        }
    },
    {
        "tokenA": {
            "address": "0xC02C2EB530D6349F267BC9e6C7077603874131B2",
            "name": "Raj Token",
            "symbol": "RAJ"
        },
        "tokenB": {
            "address": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189",
            "name": "iPhone",
            "symbol": "iOS"
        }
    },
    {
        "tokenA": {
            "address": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189",
            "name": "iPhone",
            "symbol": "iOS"
        },
        "tokenB": {
            "address": "0xc14826134e21a51FC6eD47e56C58259467CEAa5B",
            "name": "Android",
            "symbol": "AND"
        }
    },
    {
        "tokenA": {
            "address": "0xabc",
            "name": "LOL",
            "symbol": "LOL"
        },
        "tokenB": {
            "address": "0xdef",
            "name": "LOL2",
            "symbol": "LOL2"
        }
    }
]

const swap = {
    /// RAJ -> iOS -> AND
    // "tokenA": "0xC02C2EB530D6349F267BC9e6C7077603874131B2", // RAJ
    // "tokenB": "0xc14826134e21a51FC6eD47e56C58259467CEAa5B" // AND

    /// AND -> iOS -> RAJ
    // "tokenA": "0xc14826134e21a51FC6eD47e56C58259467CEAa5B", // AND
    // "tokenB": "0xC02C2EB530D6349F267BC9e6C7077603874131B2" // RAJ

    /// PST -> RAJ -> iOS -> AND
    "tokenA": "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7", // PST
    "tokenB": "0xc14826134e21a51FC6eD47e56C58259467CEAa5B" // AND

    /// AND -> iOS -> RAJ -> PST
    // "tokenA": "0xc14826134e21a51FC6eD47e56C58259467CEAa5B", // AND
    // "tokenB": "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7" // PST

    /// iOS -> RAJ
    // "tokenA": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189", // iOS
    // "tokenB": "0xC02C2EB530D6349F267BC9e6C7077603874131B2" // RAJ

    /// RAJ -> iOS
    // "tokenA": "0xC02C2EB530D6349F267BC9e6C7077603874131B2", // RAJ
    // "tokenB": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189" // iOS

    /// []
    // "tokenA": "0xabc", // LOL
    // "tokenB": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189" // PST
}

const tokens = [
    {
        "name": "Raj Token",
        "symbol": "RAJ",
        "address": "0xC02C2EB530D6349F267BC9e6C7077603874131B2"
    },
    {
        "name": "PreSale Token",
        "symbol": "PST",
        "address": "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7"
    },
    {
        "address": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189",
        "name": "iPhone",
        "symbol": "iOS"
    },
    {
        "address": "0xc14826134e21a51FC6eD47e56C58259467CEAa5B",
        "name": "Android",
        "symbol": "AND"
    },
    {
        "address": "0xabc",
        "name": "LOL",
        "symbol": "LOL"
    },
    {
        "address": "0xdef",
        "name": "LOL2",
        "symbol": "LOL2"
    }
]


const getPath = (swap) => {
    let count = 0;
    const path = [swap.tokenA];
    const content = [];

    try {
        const isTokenA_available = tokens.find((pool) => {
            return swap.tokenA === pool.address;
        });

        const tokenB_Available = tokens.find((pool) => {
            return swap.tokenB === pool.address;
        });

        if (!isTokenA_available || !tokenB_Available) {
            return {
                path: [],
                content: [],
            };
        }

        const filtered = pools.find((pool) => {
            return (
                (pool.tokenA.address === swap.tokenA ||
                    pool.tokenA.address === swap.tokenB) &&
                (pool.tokenB.address === swap.tokenA ||
                    pool.tokenB.address === swap.tokenB)
            );
        });

        if (filtered) {
            path.push(swap.tokenB);
            content.push(
                filtered.tokenA.address === swap.tokenA
                    ? filtered.tokenB
                    : filtered.tokenA
            );
            return { path, content };
        }

        while (true) {
            if (count >= 1 && path.length === 1) {
                return {
                    path: [],
                    content: [],
                };
            }

            for (const pair of pools) {
                if (path[0] === swap.tokenA && path[path.length - 1] === swap.tokenB)
                    return { path, content };

                if (pair.tokenA.address === path[path.length - 1]) {
                    const filtered = path.find((p) => p === pair.tokenB.address);
                    if (filtered) {
                        path.pop();
                        content.pop();
                    }
                    else {
                        path.push(pair.tokenB.address);
                        content.push(pair.tokenB);
                    }
                } else if (pair.tokenB.address === path[path.length - 1]) {
                    const filtered = path.find((p) => p === pair.tokenA.address);
                    if (filtered) {
                        path.pop();
                        content.pop();
                    }
                    else {
                        path.push(pair.tokenA.address);
                        content.push(pair.tokenA);
                    }
                }
            }
            count++;
        }
    } catch (e) {
        return {
            path: [],
            content: [],
        };
    }
};

console.log(getPath(swap));