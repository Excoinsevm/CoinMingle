console.clear()
const DB = [
    {
        "tokens": {
            "tokenA": "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7",
            "tokenB": "0xC02C2EB530D6349F267BC9e6C7077603874131B2"
        },
        "amounts": {
            "tokenA": "10000",
            "tokenB": "50000"
        }
    },

    {
        "tokens": {
            "tokenA": "0xC02C2EB530D6349F267BC9e6C7077603874131B2",
            "tokenB": "0xa79465a58A098E17a44AB2E651371c8c8Cb47189"
        },
        "amounts": {
            "tokenA": "10000",
            "tokenB": "100000"
        }
    },
]

const add = {
    "tokens": {
        "tokenA": "0x3a2367bd29058B3827b6A97fdCFaaF7426e9A5B7",
        "tokenB": "0xC02C2EB530D6349F267BC9e6C7077603874131B2"
    },
    "amounts": {
        "tokenA": "10910.8281",
        "tokenB": "50000"
    }
}


let alreadyHave = DB.find((tx) => {
    return (tx.tokens.tokenA === add.tokens.tokenA ||
        tx.tokens.tokenA === add.tokens.tokenB) &&
        (tx.tokens.tokenB === add.tokens.tokenA ||
            tx.tokens.tokenB === add.tokens.tokenB)
})

const index = DB.findIndex((tx) => {
    return (tx.tokens.tokenA === add.tokens.tokenA ||
        tx.tokens.tokenA === add.tokens.tokenB) &&
        (tx.tokens.tokenB === add.tokens.tokenA ||
            tx.tokens.tokenB === add.tokens.tokenB)
})

if (alreadyHave) {
    alreadyHave = {
        ...alreadyHave,
        amounts: {
            tokenA: alreadyHave.tokens.tokenA === add.tokens.tokenA ? (Number(alreadyHave.amounts.tokenA) + Number(add.amounts.tokenA)).toString() : (Number(alreadyHave.amounts.tokenA) + Number(add.amounts.tokenB)).toString(),
            tokenB: alreadyHave.tokens.tokenB === add.tokens.tokenB ? (Number(alreadyHave.amounts.tokenB) + Number(add.amounts.tokenB)).toString() : (Number(alreadyHave.amounts.tokenB) + Number(add.amounts.tokenA)).toString()
        }
    }
}

DB[index] = alreadyHave;
console.log(DB);
