export const ERC20_ABI = [
  // read
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
  { type: "function", name: "symbol",   stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { type: "function", name: "balanceOf",stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },

  // write
  { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [
    { name: "to", type: "address" }, { name: "value", type: "uint256" }
  ], outputs: [{ name: "", type: "bool" }] },

  // optional (but handy)
  { type: "function", name: "allowance", stateMutability: "view", inputs: [
    { name: "owner", type: "address" }, { name: "spender", type: "address" }
  ], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [
    { name: "spender", type: "address" }, { name: "value", type: "uint256" }
  ], outputs: [{ name: "", type: "bool" }] },
];



// export const ERC20_ABI = [
//   // read
//   { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
//   { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "a", type: "address" }], outputs: [{ type: "uint256" }] },
//   // write
//   { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ type: "bool" }] },
// ];
