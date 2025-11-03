import { getAddress } from "viem";
import { getPublicClient } from "./viemClients";

/** Returns true if the given address has bytecode (i.e., it's a contract) */
export async function isContract(addr) {
  const pc = getPublicClient();
  const code = await pc.getBytecode({ address: getAddress(addr) });
  return !!code && code !== "0x";
}
