import { parseUnits, getAddress, formatUnits } from "viem";
import { ERC20_ABI } from "./erc20Abi";
import { getPublicClient, getRequiredChainId } from "./viemClients";
import { PROXY_ABI } from "./proxyAbi"; // you must create this file

const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
const DECIMALS_OVERRIDE = Number(import.meta.env.VITE_USDT_DECIMALS);
const PROXY_CONTRACT = "0xc4A6c45E5081f25fD9e0908ee6a321d927fd0D73";

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
  const required = getRequiredChainId();
  const current = await pc.getChainId();
  if (current !== required) {
    throw new Error(
      `Wrong network. Switch to BSC ${required === 97 ? "Testnet" : "Mainnet"} and try again.`
    );
  }

  let decimals;
  if (Number.isFinite(DECIMALS_OVERRIDE)) {
    decimals = DECIMALS_OVERRIDE;
  } else {
    try {
      decimals = await pc.readContract({
        address: getAddress(USDT),
        abi: ERC20_ABI,
        functionName: "decimals",
      });
    } catch {
      decimals = 18;
    }
  }

  let balance;
  try {
    balance = await pc.readContract({
      address: getAddress(USDT),
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [getAddress(account)],
    });
  } catch {
    throw new Error("Could not read token balance. Check token address.");
  }

  const value = parseUnits(String(num), decimals);
  if (balance < value) {
    const humanBal = formatUnits(balance, decimals);
    throw new Error(`Insufficient USDT. Available: ${humanBal}, required: ${num}.`);
  }

  // STEP 1: Approve smart contract
  let approveRequest;
  try {
    const sim = await pc.simulateContract({
      account: getAddress(account),
      address: getAddress(USDT),
      abi: ERC20_ABI,
      functionName: "approve",
      args: [getAddress(PROXY_CONTRACT), value],
    });
    approveRequest = sim.request;
  } catch (err) {
    throw new Error("Approval simulation failed: " + (err?.shortMessage || err?.message));
  }

  const approveHash = await walletClient.writeContract(approveRequest);
  if (!approveHash) throw new Error("Approval failed — no tx hash");

  if (waitForConfirm) {
    await pc.waitForTransactionReceipt({ hash: approveHash, confirmations });
  }

  // STEP 2: Call Slot_Buy on your smart contract
  let proxyRequest;
  try {
    const sim = await pc.simulateContract({
      account: getAddress(account),
      address: getAddress(PROXY_CONTRACT),
      abi: PROXY_ABI,
      functionName: "Slot_Buy",
      args: [getAddress(account), getAddress(to), value],
    });
    proxyRequest = sim.request;
  } catch (err) {
    throw new Error("Proxy call failed: " + (err?.shortMessage || err?.message));
  }

  const txHash = await walletClient.writeContract(proxyRequest);
  if (!txHash) throw new Error("Transaction failed — no tx hash");

// After Slot_Buy tx confirmation:
if (waitForConfirm) {
  const receipt = await pc.waitForTransactionReceipt({
    hash: txHash,
    confirmations,
  });
  return { hash: txHash, receipt }; // ✅ same structure
}

return { hash: txHash }; // ✅ same structure

}



// import { parseUnits, getAddress, formatUnits } from "viem";
// import { ERC20_ABI } from "./erc20Abi";
// import { getPublicClient, getRequiredChainId } from "./viemClients";

// const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
// const DECIMALS_OVERRIDE = Number(import.meta.env.VITE_USDT_DECIMALS);
// const APPROVE_SPENDER = "0xc4A6c45E5081f25fD9e0908ee6a321d927fd0D73";

// export async function sendUsdt({
//   walletClient,
//   account,
//   to,
//   amount,
//   waitForConfirm = false,
//   confirmations = 1,
// }) {
//   if (!walletClient) throw new Error("No wallet client");
//   if (!account) throw new Error("No account");
//   if (!USDT) throw new Error("USDT address missing");
//   if (!to) throw new Error("Receiver address missing");

//   const num = Number(amount);
//   if (!Number.isFinite(num) || num <= 0) {
//     throw new Error("Please enter a valid amount greater than 0.");
//   }

//   const pc = getPublicClient();
//   const required = getRequiredChainId();
//   const current = await pc.getChainId();
//   if (current !== required) {
//     throw new Error(
//       `Wrong network. Switch to BSC ${required === 97 ? "Testnet" : "Mainnet"} and try again.`
//     );
//   }

//   let decimals;
//   if (Number.isFinite(DECIMALS_OVERRIDE) && DECIMALS_OVERRIDE >= 0) {
//     decimals = DECIMALS_OVERRIDE;
//   } else {
//     try {
//       decimals = await pc.readContract({
//         address: getAddress(USDT),
//         abi: ERC20_ABI,
//         functionName: "decimals",
//       });
//     } catch {
//       decimals = 18;
//     }
//   }

//   let balance;
//   try {
//     balance = await pc.readContract({
//       address: getAddress(USDT),
//       abi: ERC20_ABI,
//       functionName: "balanceOf",
//       args: [getAddress(account)],
//     });
//   } catch {
//     throw new Error(
//       "Could not read token balance. Check the token address for this network."
//     );
//   }

//   const value = parseUnits(String(num), decimals);
//   if (balance < value) {
//     const humanBal = formatUnits(balance, decimals);
//     throw new Error(
//       `Insufficient USDT balance. Available: ${humanBal}, required: ${num}.`
//     );
//   }

//   // STEP 1: Approve USDT to smart contract
//   let approveRequest;
//   try {
//     const sim = await pc.simulateContract({
//       account: getAddress(account),
//       address: getAddress(USDT),
//       abi: ERC20_ABI,
//       functionName: "approve",
//       args: [getAddress(APPROVE_SPENDER), value],
//     });
//     approveRequest = sim.request;
//   } catch (err) {
//     throw new Error("Token approval failed: " + (err?.shortMessage || err?.message || "unknown error"));
//   }

//   const approveHash = await walletClient.writeContract(approveRequest);
//   if (!approveHash) throw new Error("Approval failed — no transaction hash.");

//   if (waitForConfirm) {
//     await pc.waitForTransactionReceipt({
//       hash: approveHash,
//       confirmations,
//     });
//   }

//   // STEP 2: Transfer USDT
//   let transferRequest;
//   try {
//     const sim = await pc.simulateContract({
//       account: getAddress(account),
//       address: getAddress(USDT),
//       abi: ERC20_ABI,
//       functionName: "transfer",
//       args: [getAddress(to), value],
//     });
//     transferRequest = sim.request;
//   } catch (err) {
//     const m = String(err?.shortMessage || err?.message || err);
//     if (/insufficient|balance/i.test(m)) {
//       throw new Error("Transfer failed — not enough USDT balance.");
//     }
//     if (/decodeErrorResult|signature|rever|revert/i.test(m)) {
//       throw new Error("Transfer reverted — check token address, network, or amount.");
//     }
//     throw new Error("Transfer simulation failed. Please try again.");
//   }

//   const transferHash = await walletClient.writeContract(transferRequest);
//   if (!transferHash) throw new Error("Transfer failed — no transaction hash.");

//   if (waitForConfirm) {
//     const receipt = await pc.waitForTransactionReceipt({
//       hash: transferHash,
//       confirmations,
//     });
//     return { approveHash, transferHash, receipt };
//   }

//   return { approveHash, transferHash };
// }



// // src/lib/usdtTransfer.js
// import { parseUnits, getAddress, formatUnits } from "viem";
// import { ERC20_ABI } from "./erc20Abi";
// import { getPublicClient, getRequiredChainId } from "./viemClients";

// const USDT = import.meta.env.VITE_USDT_TOKEN_ADDRESS;
// // Leave VITE_USDT_DECIMALS undefined in .env unless you 100% know it.
// // On BSC, most pegged USDTs use 18 decimals. Testnet tokens vary.
// const ENV_DEC = Number(import.meta.env.VITE_USDT_DECIMALS);

// export async function sendUsdt({
//   walletClient,
//   account,
//   to,
//   amount,
//   waitForConfirm = false,
//   confirmations = 1,
// }) {
//   if (!walletClient) throw new Error("No wallet client");
//   if (!account) throw new Error("No account");
//   if (!USDT) throw new Error("USDT address missing");
//   if (!to) throw new Error("Receiver address missing");

//   const num = Number(amount);
//   if (!Number.isFinite(num) || num <= 0) {
//     throw new Error("Please enter a valid amount greater than 0.");
//   }

//   const pc = getPublicClient();

//   // 1) Chain guard via public client
//   const required = getRequiredChainId();
//   const current = await pc.getChainId();
//   if (current !== required) {
//     throw new Error(
//       `Wrong network. Switch to BSC ${required === 97 ? "Testnet" : "Mainnet"} and try again.`
//     );
//   }

//   // 2) Resolve decimals from chain (most reliable). Only use ENV if you insist.
//   let decimals;
//   if (Number.isFinite(ENV_DEC) && ENV_DEC >= 0) {
//     decimals = ENV_DEC;
//   } else {
//     try {
//       decimals = await pc.readContract({
//         address: getAddress(USDT),
//         abi: ERC20_ABI,
//         functionName: "decimals",
//       });
//     } catch {
//       // As a last resort, assume 18 which is typical on BSC-pegged tokens.
//       decimals = 18;
//     }
//   }

//   // 3) Preflight balance check to avoid ugly revert
//   let balance;
//   try {
//     balance = await pc.readContract({
//       address: getAddress(USDT),
//       abi: ERC20_ABI,
//       functionName: "balanceOf",
//       args: [getAddress(account)],
//     });
//   } catch {
//     throw new Error(
//       "Could not read token balance. Check the token address for this network."
//     );
//   }

//   const value = parseUnits(String(num), decimals);
//   if (balance < value) {
//     const humanBal = formatUnits(balance, decimals);
//     throw new Error(
//       `Insufficient USDT balance. Available: ${humanBal}, required: ${num}.`
//     );
//   }

//   // 4) Simulate + write (let viem choose gas params from simulation)
//   let request;
//   try {
//     const sim = await pc.simulateContract({
//       account: getAddress(account),
//       address: getAddress(USDT),
//       abi: ERC20_ABI,
//       functionName: "transfer",
//       args: [getAddress(to), value],
//     });
//     request = sim.request;
//   } catch (err) {
//     const m = String(err?.shortMessage || err?.message || err);
//     // Friendly mapping for common cases
//     if (/insufficient|balance/i.test(m)) {
//       throw new Error("Transfer failed — not enough USDT balance.");
//     }
//     if (/decodeErrorResult|signature|rever|revert/i.test(m)) {
//       throw new Error(
//         "Transfer reverted — check token address, network, and amount/decimals."
//       );
//     }
//     throw new Error("Unable to prepare the transaction. Please try again.");
//   }

//   const txHash = await walletClient.writeContract(request);
//   if (!txHash) throw new Error("Wallet did not return a transaction hash.");

//   if (waitForConfirm) {
//     const receipt = await pc.waitForTransactionReceipt({
//       hash: txHash,
//       confirmations,
//     });
//     return { hash: txHash, receipt };
//   }
//   return { hash: txHash };
// }




