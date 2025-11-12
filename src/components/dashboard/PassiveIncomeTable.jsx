// src/components/dashboard/PassiveIncomeTable.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import DottedCard from "./DottedCard";
import { getPassiveIncome } from "../../lib/api";

// Inline USDT icon
const UsdtIcon = ({ className = "h-4 w-4 opacity-90 text-gold-400" }) => (
  <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
    <circle cx="128" cy="128" r="128" fill="#26A17B" />
    <path
      fill="#FFF"
      d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
    />
  </svg>
);

// Strict status check (avoids matching "Not Active")
const isActive = (status) =>
  String(status ?? "")
    .trim()
    .toLowerCase() === "active";

/**
 * Props (all optional):
 * - id: number | string  (defaults to localStorage fx_user_id / fx_user_userId)
 * - startDate: 'YYYY-MM-DD'  (if omitted, defaults to current month start)
 * - endDate: 'YYYY-MM-DD'    (if omitted, defaults to today)
 */
export default function PassiveIncomeTable({ id, startDate, endDate }) {
  const [period, setPeriod] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---- Defaults: current month (1st -> today) ----
  const today = useMemo(() => new Date(), []);
  const monthStart = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const fmtISO = (d) => d.toISOString().slice(0, 10);
  const defaultStart = fmtISO(monthStart);
  const defaultEnd = fmtISO(today);

  const isControlled = Boolean(startDate && endDate);
  const [start, setStart] = useState(startDate || defaultStart);
  const [end, setEnd] = useState(endDate || defaultEnd);

  useEffect(() => {
    if (isControlled) {
      setStart(startDate);
      setEnd(endDate);
    }
  }, [isControlled, startDate, endDate]);

  const resolvedId = useMemo(
    () =>
      id ??
      localStorage.getItem("fx_user_id") ??
      localStorage.getItem("fx_user_userId"),
    [id]
  );

  useEffect(() => {
    if (start && end && start > end) setEnd(start);
  }, [start, end]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      setRows([]);
      setPeriod("");

      try {
        if (!resolvedId) throw new Error("No ID found for passive income.");
        const data = await getPassiveIncome({
          id: resolvedId,
          startDate: start,
          endDate: end,
        });
        if (!mounted) return;

        const apiRows = [
          {
            ok: isActive(data?.top10Status),
            statusText: data?.top10Status ?? "Not Active",
            label: "Owner Top 10 Squad",
            value: data?.top10Amount ?? 0,
          },
          {
            ok: isActive(data?.top100Status),
            statusText: data?.top100Status ?? "Not Active",
            label: "Top 100 Member",
            value: data?.top100Amount ?? 0,
          },
          {
            ok: isActive(data?.level2to5Status),
            statusText: data?.level2to5Status ?? "Not Active",
            label: "2–5 level Active",
            value: data?.level2to5Income ?? 0,
          },
          {
            ok: isActive(data?.level6to12Status),
            statusText: data?.level6to12Status ?? "Not Active",
            label: "6–12 level Unconditional",
            value: data?.level6to12Income ?? 0,
          },
        ];

        setRows(apiRows);
        setPeriod(String(data?.period || `${start} - ${end}`));
      } catch (e) {
        if (!mounted) return;
        setErr(String(e?.message || e) || "Failed to load passive income.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [resolvedId, start, end]);

  const displayAmount = (v) =>
    Number.isFinite(Number(v))
      ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(Number(v))
      : String(v ?? "0");

  // Calendar popover (same as before)
  const [openCal, setOpenCal] = useState(false);
  const popRef = useRef(null);
  const btnRef = useRef(null);
  const [tmpStart, setTmpStart] = useState(start);
  const [tmpEnd, setTmpEnd] = useState(end);

  useEffect(() => {
    if (!openCal) {
      setTmpStart(start);
      setTmpEnd(end);
    }
  }, [openCal, start, end]);

  useEffect(() => {
    if (!openCal) return;
    const onDown = (e) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpenCal(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenCal(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openCal]);

  const applyPreset = (type) => {
    const d = new Date();
    const toISO = (x) => x.toISOString().slice(0, 10);

    if (type === "thisMonth") {
      const ms = new Date(d.getFullYear(), d.getMonth(), 1);
      setTmpStart(toISO(ms));
      setTmpEnd(toISO(d));
    } else if (type === "last7") {
      const s = new Date(d);
      s.setDate(d.getDate() - 6);
      setTmpStart(toISO(s));
      setTmpEnd(toISO(d));
    } else if (type === "last30") {
      const s = new Date(d);
      s.setDate(d.getDate() - 29);
      setTmpStart(toISO(s));
      setTmpEnd(toISO(d));
    }
  };

  const applyRange = () => {
    if (isControlled) {
      setOpenCal(false);
      return;
    }
    let s = tmpStart;
    let e = tmpEnd;
    if (s && e && s > e) e = s;
    setStart(s || defaultStart);
    setEnd(e || defaultEnd);
    setOpenCal(false);
  };

  return (
    <div className="glass p-4 sm:p-5 relative">
      {/* Header with trigger */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/70 text-sm">Period</div>

        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpenCal((s) => !s)}
          className="inline-flex items-center gap-3 rounded-xl bg-black/30 px-3 py-2 border border-gold-600/20 text-sm hover:bg-white/10 transition-colors"
          aria-haspopup="dialog"
          aria-expanded={openCal}
        >
          <span className="text-white/80 truncate max-w-[60vw] sm:max-w-none">
            {period || "—"}
          </span>
          <span className="inline-flex h-6 w-6 rounded-md bg-gold-700/25 items-center justify-center">📅</span>
        </button>
      </div>

      {/* Calendar Popover */}
      {openCal && (
        <div
          ref={popRef}
          role="dialog"
          aria-label="Select date range"
          className="
            absolute z-20 right-3 top-14
            w-[min(100%,360px)]
            rounded-2xl border border-white/10
            bg-[#0C1118]/95 backdrop-blur
            shadow-[0_20px_60px_rgba(0,0,0,0.55)]
            p-3 sm:p-4
          "
        >
          <div className="text-white/80 text-sm mb-3">Select range</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2 text-xs text-white/70">
              <span className="shrink-0">Start</span>
              <input
                type="date"
                value={tmpStart}
                max={tmpEnd || undefined}
                disabled={isControlled}
                onChange={(e) => setTmpStart(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/30 border border-gold-600/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 disabled:opacity-60"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-xs text-white/70">
              <span className="shrink-0">End</span>
              <input
                type="date"
                value={tmpEnd}
                min={tmpStart || undefined}
                max={defaultEnd}
                disabled={isControlled}
                onChange={(e) => setTmpEnd(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/30 border border-gold-600/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 disabled:opacity-60"
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isControlled}
              onClick={() => applyPreset("thisMonth")}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white/90 disabled:opacity-50"
            >
              This month
            </button>
            <button
              type="button"
              disabled={isControlled}
              onClick={() => applyPreset("last7")}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white/90 disabled:opacity-50"
            >
              Last 7 days
            </button>
            <button
              type="button"
              disabled={isControlled}
              onClick={() => applyPreset("last30")}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white/90 disabled:opacity-50"
            >
              Last 30 days
            </button>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenCal(false)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isControlled}
              onClick={applyRange}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-700 text-white text-xs shadow-inner disabled:opacity-50"
            >
              Apply
            </button>
          </div>

          {isControlled && (
            <div className="mt-3 text-[11px] text-white/50">
              Dates are controlled by parent props.
            </div>
          )}
        </div>
      )}

      <DottedCard className="bg-gradient-to-br from-gold-700/15 to-gold-900/20">
        {loading ? (
          <div className="py-6 text-center text-white/70">Loading passive income…</div>
        ) : err ? (
          <div className="py-6 text-center text-red-300">{err}</div>
        ) : (
          <div className="divide-y divide-white/10">
            {rows.map((r, idx) => (
              <div key={idx} className="flex items-center py-3 sm:py-3.5">
                <div className="w-6">
                  {r.ok ? (
                    <span className="text-emerald-400 text-xl" aria-label="Active">✓</span>
                  ) : (
                    <span className="text-red-400 text-xl" aria-label="Not Active">✕</span>
                  )}
                </div>

                <div className="flex-1 text-white/90">{r.label}</div>

                {/* amount + status pill */}
                <div className="min-w-[140px] text-right flex items-center justify-end gap-2">
                  <span className={(Number(r.value) ?? 0) < 0 ? "text-red-300" : "text-gold-200"}>
                    {displayAmount(r.value)}
                  </span>
                  <UsdtIcon />
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] border ${
                      r.ok
                        ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                        : "text-red-300 border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    {r.ok ? "Active" : "Not Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DottedCard>
    </div>
  );
}



// // src/components/dashboard/PassiveIncomeTable.jsx
// import DottedCard from './DottedCard'

// // Inline USDT icon (keeps the same size/slot as TonIcon)
// const UsdtIcon = ({ className = "h-4 w-4 opacity-90 text-gold-400" }) => (
//   <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
//     <circle cx="128" cy="128" r="128" fill="#26A17B" />
//     <path
//       fill="#FFF"
//       d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
//     />
//   </svg>
// );

// const rows = [
//   { ok: true,  label: 'Owner Top 10 Squad',        value: '~15'     },
//   { ok: false, label: 'Top 100 Member',            value: '0'       },
//   { ok: true,  label: '2–5 level Active',          value: ''        },
//   { ok: true,  label: '6–12 level Unconditional',  value: '~0.721'  },
// ];

// export default function PassiveIncomeTable() {
//   return (
//     <div className="glass p-4 sm:p-5">
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-white/70 text-sm">Period</div>
//         <div className="inline-flex items-center gap-3 rounded-xl bg-black/30 px-3 py-2 border border-gold-600/20 text-sm">
//           <span className="text-white/80">10.10 – 20.10</span>
//           <span className="inline-flex h-6 w-6 rounded-md bg-gold-700/25 items-center justify-center">📅</span>
//         </div>
//       </div>

//       <DottedCard className="bg-gradient-to-br from-gold-700/15 to-gold-900/20">
//         <div className="divide-y divide-white/10">
//           {rows.map((r, idx) => (
//             <div key={idx} className="flex items-center py-3 sm:py-3.5">
//               <div className="w-6">
//                 {r.ok ? (
//                   <span className="text-emerald-400 text-xl">✓</span>
//                 ) : (
//                   <span className="text-red-400 text-xl">✕</span>
//                 )}
//               </div>
//               <div className="flex-1 text-white/90">{r.label}</div>
//               <div className="min-w-[100px] text-right flex items-center justify-end gap-2">
//                 {r.value && (
//                   <span className={r.value.includes('-') ? 'text-red-300' : 'text-gold-200'}>
//                     {r.value}
//                   </span>
//                 )}
//                 <UsdtIcon />
//               </div>
//             </div>
//           ))}
//         </div>
//       </DottedCard>
//     </div>
//   );
// }
