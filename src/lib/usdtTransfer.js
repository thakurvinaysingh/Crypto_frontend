// src/lib/usdtTransfer.js
import { parseUnits, getAddress } from "viem";
import { ERC20_ABI } from "./erc20Abi";
import { getPublicClient, getRequiredChainId } from "./viemClients";

const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
const ENV_DEC = Number(import.meta.env.VITE_USDT_DECIMALS); // <- force if set
const FALLBACK_DEC = 6;

export async function sendUsdt({ walletClient, account, to, amount }) {
  if (!walletClient) throw new Error("No wallet client");
  if (!account) throw new Error("No account");
  if (!USDT) throw new Error("USDT address missing");
  if (!to) throw new Error("Receiver address missing");

  const num = Number(amount);
  if (!num || num <= 0) throw new Error("Invalid amount");

  // 1) Chain guard
  const required = getRequiredChainId();
  const current = await walletClient.getChainId();
  if (current !== required) {
    throw new Error(`Wrong network. Switch to BSC ${required === 97 ? "Testnet" : "Mainnet"}.`);
  }

  const pc = getPublicClient();

  // 2) Resolve decimals: prefer .env, else contract, else fallback
  let decimals = Number.isFinite(ENV_DEC) ? ENV_DEC : FALLBACK_DEC;
  if (!Number.isFinite(ENV_DEC)) {
    try {
      decimals = await pc.readContract({
        address: getAddress(USDT),
        abi: ERC20_ABI,
        functionName: "decimals",
      });
    } catch {
      // keep fallback
    }
  }

  // 3) Units + logging to verify
  const value = parseUnits(String(num), decimals);
  console.debug("[USDT] decimals =", decimals);
  console.debug("[USDT] human amount =", num);
  console.debug("[USDT] base units =", value.toString());
  console.debug("[USDT] receiver =", getAddress(to));

  // Optional sanity: if you typed >=1 but computed <1, warn about decimals
  if (num >= 1 && value < 10n ** BigInt(decimals)) {
    console.warn("Sanity check: computed < 1 token. Check VITE_USDT_DECIMALS.");
  }
const { request } = await pc.simulateContract({
  account: getAddress(account),
  address: getAddress(USDT),
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [getAddress(to), value],
});

// (optional) explicit gas & gasPrice on BSC-style networks
const gas = await pc.estimateContractGas({
  account: getAddress(account),
  address: getAddress(USDT),
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [getAddress(to), value],
});

const gasPrice = await pc.getGasPrice(); // legacy gas on BSC

const txHash = await walletClient.writeContract({
  ...request,
  gas,       // BigInt
  gasPrice,  // BigInt
});
  if (!txHash) throw new Error("Wallet did not return a transaction hash.");
  return { hash: txHash };


}



// import { parseUnits, getAddress } from "viem";
// import { ERC20_ABI } from "./erc20Abi";
// import { getPublicClient } from "./viemClients";

// const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
// const CHAIN_ID = Number(import.meta.env.VITE_BSC_CHAIN_ID || 56);

// /**
//  * Send USDT via ERC20 transfer. Returns { hash }.
//  * @param {object} params
//  * @param walletClient  viem wallet client (from getWalletClient or your provider)
//  * @param account       connected EOA address (0x...)
//  * @param to            receiver address (0x...)
//  * @param amount        number (e.g., 25)
//  */
// export async function sendUsdt({ walletClient, account, to, amount }) {
//   if (!walletClient) throw new Error("No wallet client");
//   if (!account) throw new Error("No account");
//   if (!USDT) throw new Error("USDT address missing");
//   if (!to) throw new Error("Receiver address missing");
//   if (!amount || amount <= 0) throw new Error("Invalid amount");

//   // ensure chain is BSC
//   const chainId = await walletClient.getChainId();
//   if (chainId !== CHAIN_ID) {
//     try {
//       await walletClient.switchChain({ id: CHAIN_ID });
//     } catch {
//       throw new Error("Please switch to BNB Smart Chain (BSC).");
//     }
//   }

//   const publicClient = getPublicClient();

//   // Optional: confirm decimals = 6 (USDT on BSC), and user has balance
//   const [decimals, balance] = await Promise.all([
//     publicClient.readContract({ address: USDT, abi: ERC20_ABI, functionName: "decimals" }),
//     publicClient.readContract({ address: USDT, abi: ERC20_ABI, functionName: "balanceOf", args: [getAddress(account)] })
//   ]);
//   const amt = parseUnits(String(amount), decimals); // 6 for USDT
//   if (balance < amt) throw new Error("Insufficient USDT balance.");

//   // (optional) gas estimation via simulate
//   const { request } = await publicClient.simulateContract({
//     account: getAddress(account),
//     address: USDT,
//     abi: ERC20_ABI,
//     functionName: "transfer",
//     args: [getAddress(to), amt],
//   });

//   // write transaction
//   const hash = await walletClient.writeContract(request);
//   return { hash };
// }
