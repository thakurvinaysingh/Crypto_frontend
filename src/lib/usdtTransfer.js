// src/lib/usdtTransfer.js
import { parseUnits, getAddress, formatUnits } from "viem";
import { ERC20_ABI } from "./erc20Abi";
import { getPublicClient, getRequiredChainId } from "./viemClients";

const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
// Leave VITE_USDT_DECIMALS undefined in .env unless you 100% know it.
// On BSC, most pegged USDTs use 18 decimals. Testnet tokens vary.
const ENV_DEC = Number(import.meta.env.VITE_USDT_DECIMALS);

export async function sendUsdt({
  walletClient,
  account,
  to,
  amount,
  waitForConfirm = false,
  confirmations = 1,
}) {
  if (!walletClient) throw new Error("No wallet client");
  if (!account) throw new Error("No account");
  if (!USDT) throw new Error("USDT address missing");
  if (!to) throw new Error("Receiver address missing");

  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error("Please enter a valid amount greater than 0.");
  }

  const pc = getPublicClient();

  // 1) Chain guard via public client
  const required = getRequiredChainId();
  const current = await pc.getChainId();
  if (current !== required) {
    throw new Error(
      `Wrong network. Switch to BSC ${required === 97 ? "Testnet" : "Mainnet"} and try again.`
    );
  }

  // 2) Resolve decimals from chain (most reliable). Only use ENV if you insist.
  let decimals;
  if (Number.isFinite(ENV_DEC) && ENV_DEC >= 0) {
    decimals = ENV_DEC;
  } else {
    try {
      decimals = await pc.readContract({
        address: getAddress(USDT),
        abi: ERC20_ABI,
        functionName: "decimals",
      });
    } catch {
      // As a last resort, assume 18 which is typical on BSC-pegged tokens.
      decimals = 18;
    }
  }

  // 3) Preflight balance check to avoid ugly revert
  let balance;
  try {
    balance = await pc.readContract({
      address: getAddress(USDT),
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [getAddress(account)],
    });
  } catch {
    throw new Error(
      "Could not read token balance. Check the token address for this network."
    );
  }

  const value = parseUnits(String(num), decimals);
  if (balance < value) {
    const humanBal = formatUnits(balance, decimals);
    throw new Error(
      `Insufficient USDT balance. Available: ${humanBal}, required: ${num}.`
    );
  }

  // 4) Simulate + write (let viem choose gas params from simulation)
  let request;
  try {
    const sim = await pc.simulateContract({
      account: getAddress(account),
      address: getAddress(USDT),
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [getAddress(to), value],
    });
    request = sim.request;
  } catch (err) {
    const m = String(err?.shortMessage || err?.message || err);
    // Friendly mapping for common cases
    if (/insufficient|balance/i.test(m)) {
      throw new Error("Transfer failed — not enough USDT balance.");
    }
    if (/decodeErrorResult|signature|rever|revert/i.test(m)) {
      throw new Error(
        "Transfer reverted — check token address, network, and amount/decimals."
      );
    }
    throw new Error("Unable to prepare the transaction. Please try again.");
  }

  const txHash = await walletClient.writeContract(request);
  if (!txHash) throw new Error("Wallet did not return a transaction hash.");

  if (waitForConfirm) {
    const receipt = await pc.waitForTransactionReceipt({
      hash: txHash,
      confirmations,
    });
    return { hash: txHash, receipt };
  }
  return { hash: txHash };
}



// // src/lib/usdtTransfer.js
// import { parseUnits, getAddress } from "viem";
// import { ERC20_ABI } from "./erc20Abi";
// import { getPublicClient, getRequiredChainId } from "./viemClients";

// const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
// const ENV_DEC = Number(import.meta.env.VITE_USDT_DECIMALS); // <- force if set
// const FALLBACK_DEC = 6;

// export async function sendUsdt({ walletClient, account, to, amount }) {
//   if (!walletClient) throw new Error("No wallet client");
//   if (!account) throw new Error("No account");
//   if (!USDT) throw new Error("USDT address missing");
//   if (!to) throw new Error("Receiver address missing");

//   const num = Number(amount);
//   if (!num || num <= 0) throw new Error("Invalid amount");

//   // 1) Chain guard
//   const required = getRequiredChainId();
//   const current = await walletClient.getChainId();
//   if (current !== required) {
//     throw new Error(`Wrong network. Switch to BSC ${required === 97 ? "Testnet" : "Mainnet"}.`);
//   }

//   const pc = getPublicClient();

//   // 2) Resolve decimals: prefer .env, else contract, else fallback
//   let decimals = Number.isFinite(ENV_DEC) ? ENV_DEC : FALLBACK_DEC;
//   if (!Number.isFinite(ENV_DEC)) {
//     try {
//       decimals = await pc.readContract({
//         address: getAddress(USDT),
//         abi: ERC20_ABI,
//         functionName: "decimals",
//       });
//     } catch {
//       // keep fallback
//     }
//   }

//   // 3) Units + logging to verify
//   const value = parseUnits(String(num), decimals);
//   console.debug("[USDT] decimals =", decimals);
//   console.debug("[USDT] human amount =", num);
//   console.debug("[USDT] base units =", value.toString());
//   console.debug("[USDT] receiver =", getAddress(to));

//   // Optional sanity: if you typed >=1 but computed <1, warn about decimals
//   if (num >= 1 && value < 10n ** BigInt(decimals)) {
//     console.warn("Sanity check: computed < 1 token. Check VITE_USDT_DECIMALS.");
//   }
// const { request } = await pc.simulateContract({
//   account: getAddress(account),
//   address: getAddress(USDT),
//   abi: ERC20_ABI,
//   functionName: "transfer",
//   args: [getAddress(to), value],
// });

// // (optional) explicit gas & gasPrice on BSC-style networks
// const gas = await pc.estimateContractGas({
//   account: getAddress(account),
//   address: getAddress(USDT),
//   abi: ERC20_ABI,
//   functionName: "transfer",
//   args: [getAddress(to), value],
// });

// const gasPrice = await pc.getGasPrice(); // legacy gas on BSC

// const txHash = await walletClient.writeContract({
//   ...request,
//   gas,       // BigInt
//   gasPrice,  // BigInt
// });
//   if (!txHash) throw new Error("Wallet did not return a transaction hash.");
//   return { hash: txHash };


// }


