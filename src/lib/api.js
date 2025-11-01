
// src/lib/api.js
const RAW_API = import.meta.env.VITE_API_BASE_URL || "";
const API = RAW_API.replace(/\/+$/, ""); // sanitize trailing slash

function withTimeout(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(timer) };
}

async function http(method, path, body, { timeoutMs = 25000, headers = {} } = {}) {
  const { signal, clear } = withTimeout(timeoutMs);
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // Bubble up backend error message if present
      throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    // Surface AbortError as a clear timeout
    if (err?.name === "AbortError") {
      throw new Error("Request timed out. The server took too long to respond.");
    }
    throw err;
  } finally {
    clear();
  }
}

export async function checkUserExists(address) {
  const res = await http(
    "POST",
    `/api/Auth/user`,
    { publicAddress: address.toLowerCase() },
    {
      headers: { "x-api-key": "hjbdguydfjri7473ryuyutyhte5ghgrtt6r" },
      timeoutMs: 15000,
    }
  );
  return res; // expected { exists: true/false, ... }
}

/**
 * Register user with robust timeout handling.
 * If the request times out or returns a "timeout/504" style error,
 * we re-check existence and treat that as success if found.
 */
export async function registerUser(payload, { timeoutMs = 25000 } = {}) {
  try {
    return await http("POST", `/api/Auth/Register`, payload, { timeoutMs });
  } catch (err) {
    const msg = String(err?.message || err);
    const looksLikeTimeout =
      /timeout|timed out|server is not responding|504|gateway/i.test(msg);

    if (looksLikeTimeout && payload?.publicAddress) {
      // backend may have saved before timing out—confirm via existence
      try {
        const exists = await checkUserExists(payload.publicAddress);
        if (exists?.exists) {
          return { ok: true, via: "timeout-confirmed" };
        }
      } catch {
        // ignore secondary failure; fall through to throw original error
      }
    }
    throw err;
  }
}

export async function getDistributionByRefId(refId) {
  const res = await http(
    "GET",
    `/api/Auth/getByRefId?id=${refId}`,
    null,
    {
      timeoutMs: 15000,
      headers: {
        "x-api-key": "hjbdguydfjri7473ryuyutyhte5ghgrtt6r", // if needed
      },
    }
  );
  return res?.data || [];
}





// // src/lib/api.js
// const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// function url(path, query) {
//   const rel = path.startsWith("/") ? path : `/${path}`;
//   const qs = query ? `?${new URLSearchParams(query)}` : "";
//   return `${API_BASE}${rel}${qs}`;
// }

// async function http(method, path, body, query) {
//   const res = await fetch(url(path, query), {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: method === "GET" ? undefined : body ? JSON.stringify(body) : undefined,
//   });

//   let data = {};
//   try { data = await res.json(); } catch { /* ignore non-json */ }

//   if (!res.ok) {
//     throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
//   }
//   return data;
// }

// /** POST /api/Auth/users  { publicAddress } */
// export function checkUserExists(publicAddress) {
//   if (!publicAddress) throw new Error("publicAddress required");
//   return http("POST", "/api/Auth/users", { publicAddress: publicAddress.toLowerCase() });
// }

// /** 
//  * POST /api/Auth/Register?wait=true|false
//  * Body: { publicAddress, packageAmount, refBy, tx, receiver }
//  * Set wait to true if you want the backend to block until it sees 2 confirmations.
//  */
// export function registerUser({ publicAddress, packageAmount, refBy, tx, receiver }, { wait = false } = {}) {
//   if (!publicAddress || !packageAmount || !tx || !receiver) {
//     throw new Error("publicAddress, packageAmount, tx, receiver are required");
//   }
//   return http(
//     "POST",
//     "/api/Auth/Register",
//     { publicAddress, packageAmount, refBy: refBy ?? 0, tx, receiver },
//     { wait: String(wait) }
//   );
// }

// /** Optional debug/poll endpoint: GET /api/tx/:hash */
// export function getTxStatus(hash) {
//   if (!hash) throw new Error("hash required");
//   return http("GET", `/api/tx/${hash}`);
// }










// const API = import.meta.env.VITE_API_BASE_URL;

// async function http(method, path, body) {
//   const res = await fetch(`${API}${path}`, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: body ? JSON.stringify(body) : undefined,
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(data?.error || `HTTP ${res.status}`);
//   }
//   return data;
// }

// export async function checkUserExists(address) {
//   try {
//     const res = await fetch(`${API}/api/Auth/user`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": "hjbdguydfjri7473ryuyutyhte5ghgrtt6r", // ✅ custom header here
//       },
//       body: JSON.stringify({ publicAddress: address.toLowerCase() }),
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) {
//       throw new Error(data?.error || `HTTP ${res.status}`);
//     }
//     return data;
//   } catch (err) {
//     console.error("checkUserExists error:", err);
//     throw err;
//   }
// }


// export async function registerUser(payload) {
//   // payload: { walletAddress, refId, packageAmount, txHash, receiverAddress, timestamp }
//   return http("POST", `/api/Auth/Register`, payload);
// }