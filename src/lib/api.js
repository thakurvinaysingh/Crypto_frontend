// src/lib/api.js
import axios from "axios";

// --- Base URL (unchanged) ---
const RAW_API = import.meta.env.VITE_API_BASE_URL || "";
const API = RAW_API.replace(/\/+$/, "");

// --- Axios instance (no client-side timeout) ---
const ax = axios.create({
  baseURL: API || undefined,   // if empty, axios uses relative URLs (e.g., /api/...)
  withCredentials: false,
  timeout: 0,                  // <-- no timeout on the browser client
  headers: { "Content-Type": "application/json" },
});

// Normalize axios errors => Error(message) with .status/.data/.code
ax.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    let message =
      (data && (data.error || data.message)) ||
      err.message ||
      (status ? `HTTP ${status}` : "Network error");
    if (err.code === "ECONNABORTED") message = "Request timed out.";
    const e = new Error(message);
    e.status = status;
    e.data = data;
    e.code = err.code;
    return Promise.reject(e);
  }
);

// Helper: detect timeout-ish errors/gateways
function looksTimeoutLike(e) {
  const msg = String(e?.message || "");
  return (
    e?.code === "ECONNABORTED" ||
    e?.status === 504 ||
    /timeout|timed out|ETIMEDOUT|server is not responding|504|gateway/i.test(msg)
  );
}

// ---------------- Node-backed APIs (Node -> .NET inside) ----------------

// POST /api/Auth/user  (Node proxies to .NET)
export async function checkUserExists({ address, UserId }) {
  const body = {};
  if (address) body.publicAddress = String(address).toLowerCase();
  if (UserId != null) body.UserId = String(UserId);

  const { data } = await ax.post(`/api/Auth/user`, body);
  return data; // e.g. { exists: boolean, id, userId, ... }
}

// POST /api/Auth/Register  (Node proxies to .NET)
export async function registerUser(payload, { timeoutMs } = {}) {
  // Note: timeoutMs is ignored on purpose (client timeout disabled). Keep param to avoid breaking call sites.
  const { data } = await ax.post(`/api/Auth/Register`, payload);
  return data;
}

// Same as above but with a graceful fallback if it "times out" but actually saved.
export async function registerUserWithFallback(payload, { timeoutMs } = {}) {
  try {
    const { data } = await ax.post(`/api/Auth/Register`, payload /*, { timeout: 0 }*/);
    return data;
  } catch (e) {
    if (payload?.publicAddress && looksTimeoutLike(e)) {
      try {
        const exists = await checkUserExists({ address: payload.publicAddress });
        if (exists?.exists) {
          // Treat as success if backend confirms user now exists
          return { ok: true, via: "timeout-confirmed" };
        }
      } catch {
        // ignore; fall through to original error
      }
    }
    throw e;
  }
}

// GET /api/Auth/getByRefId?id=...
export async function getDistributionByRefId(refId) {
  const { data } = await ax.get(`/api/Auth/getByRefId`, {
    params: { id: refId },
  });
  return data?.data || [];
}

// GET /api/Auth/dashboardbyid?id=...
export async function getDashboardById(id) {
  if (id == null || id === "") throw new Error("Missing id for dashboard.");
  const { data } = await ax.get(`/api/Auth/dashboardbyid`, {
    params: { id },
  });
  return data?.data || {};
}

// POST /api/registration/confirm  (Node verifies BscScan testnet, then .NET updatestatus)
export async function confirmRegistrationTx(tx) {
  if (!/^0x[a-fA-F0-9]{64}$/.test(tx || "")) {
    throw new Error("Invalid tx hash.");
  }
  const { data } = await ax.post(`/api/registration/confirm`, { tx });
  return data;
}

// Optional: poll confirm endpoint until success
export async function waitForTxConfirmationOnNode(
  tx,
  { intervalMs = 4000, maxAttempts = 15 } = {}
) {
  let i = 0;
  while (i++ < maxAttempts) {
    try {
      const res = await confirmRegistrationTx(tx);
      if (res?.success) return res;
    } catch {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Confirmation polling exceeded attempts.");
}


// GET /api/Team/squad?id=77
export async function getSquadData(id) {
  if (!id) throw new Error("Squad ID is required.");
  const { data } = await ax.get(`https://webapi.upbonline.com/api/Team/squad`, {
    params: { id },
  });
  return data?.data || [];
}


export async function getPartnersData(id) {
  if (!id) throw new Error("Partners ID is required.");
  const { data } = await ax.get("https://webapi.upbonline.com/api/Team/partners", {
    params: { id },
  });
  // API shape: { success, message, data: [] }
  return Array.isArray(data?.data) ? data.data : [];
}

export async function getPassiveIncome({ id, startDate, endDate }) {
  if (!id) throw new Error("Missing id for passive income.");
  const { data } = await ax.get("https://webapi.upbonline.com/api/Team/PassiveIncome", {
    params: { id, startDate, endDate },
  });
  return data?.data || null;
}





// // src/lib/api.js.   (useing .net api backend)
// const RAW_API = import.meta.env.VITE_API_BASE_URL || "";
// const API = RAW_API.replace(/\/+$/, ""); // sanitize trailing slash

// function withTimeout(ms) {
//   const ctrl = new AbortController();
//   const timer = setTimeout(() => ctrl.abort(), ms);
//   return { signal: ctrl.signal, clear: () => clearTimeout(timer) };
// }

// async function http(method, path, body, { timeoutMs = 25000, headers = {} } = {}) {
//   const { signal, clear } = withTimeout(timeoutMs);
//   try {
//     const res = await fetch(`${API}${path}`, {
//       method,
//       headers: { "Content-Type": "application/json", ...headers },
//       body: body ? JSON.stringify(body) : undefined,
//       signal,
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) {
//       // Bubble up backend error message if present
//       throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
//     }
//     return data;
//   } catch (err) {
//     // Surface AbortError as a clear timeout
//     if (err?.name === "AbortError") {
//       throw new Error("Request timed out. The server took too long to respond.");
//     }
//     throw err;
//   } finally {
//     clear();
//   }
// }

// // export async function checkUserExists(address) {
// //   const res = await http(
// //     "POST",
// //     `/api/Auth/user`,
// //     { publicAddress: address.toLowerCase() },
// //     {
// //       headers: { "x-api-key": "hjbdguydfjri7473ryuyutyhte5ghgrtt6r" },
// //       timeoutMs: 15000,
// //     }
// //   );
// //   return res; // expected { exists: true/false, ... }
// // }
// // src/lib/api.js

// export async function checkUserExists({ address, UserId }) {
//   const body = {};

//   if (address) body.publicAddress = address.toLowerCase();
//   if (UserId != null) body.UserId = String(UserId);

//   const res = await http(
//     "POST",
//     `/api/Auth/user`,
//     body,
//     {
//       headers: {
//         "x-api-key": "hjbdguydfjri7473ryuyutyhte5ghgrtt6r",
//       },
//       timeoutMs: 15000,
//     }
//   );

//   return res;   // expected { exists: true/false, id, userId, ... }
// }

// /**
//  * Register user with robust timeout handling.
//  * If the request times out or returns a "timeout/504" style error,
//  * we re-check existence and treat that as success if found.
//  */
// export async function registerUser(payload, { timeoutMs = 25000 } = {}) {
//   try {
//     return await http("POST", `/api/Auth/Register`, payload, { timeoutMs });
//   } catch (err) {
//     const msg = String(err?.message || err);
//     const looksLikeTimeout =
//       /timeout|timed out|server is not responding|504|gateway/i.test(msg);

//     if (looksLikeTimeout && payload?.publicAddress) {
//       // backend may have saved before timing out—confirm via existence
//       try {
//         const exists = await checkUserExists(payload.publicAddress);
//         if (exists?.exists) {
//           return { ok: true, via: "timeout-confirmed" };
//         }
//       } catch {
//         // ignore secondary failure; fall through to throw original error
//       }
//     }
//     throw err;
//   }
// }

// export async function getDistributionByRefId(refId) {
//   const res = await http(
//     "GET",
//     `/api/Auth/getByRefId?id=${refId}`,
//     null,
//  { timeoutMs: 15000 }
//   );
//   return res?.data || [];
// }

//  export async function getDashboardById(id) {
//    if (id == null || id === "") throw new Error("Missing id for dashboard.");
//    const res = await http(
//      "GET",
//      `/api/Auth/dashboardbyid?id=${id}`,
//      null,
//     { timeoutMs: 15000 }
//    );
//    return res?.data || {};
//  }


