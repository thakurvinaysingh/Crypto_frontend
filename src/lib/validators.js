export const ALLOWED_PACKAGES = [25, 50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

export function isValidTxHash(tx) {
  return /^0x([A-Fa-f0-9]{64})$/.test(String(tx || ""));
}

export function isValidRefId(refId) {
  if (!refId) return true;
  return /^[a-zA-Z0-9_-]{3,32}$/.test(refId);
}
